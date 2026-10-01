"""Final Pages artifact acceptance. Run by repository CI in native Chromium."""
from pathlib import Path
import functools, gzip, http.server, json, sys, threading, time, traceback
from playwright.sync_api import sync_playwright

site=Path(sys.argv[1]).resolve(); out=Path(sys.argv[2]); out.mkdir(parents=True,exist_ok=True)
checks=[]; errors=[]; requests=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/{site.name}'
report={'checks':checks,'runtimeErrors':errors,'htmlBytes':site.stat().st_size,'gzipBytes':len(gzip.compress(site.read_bytes()))}
def check(name,condition):
    if not condition: raise AssertionError(name)
    checks.append(name); print('PASS '+name,flush=True)
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
        context=browser.new_context(viewport={'width':1366,'height':960})
        page=context.new_page(); page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:requests.append(r.url)); page.on('dialog',lambda d:d.accept())
        page.goto(url+'#/home',wait_until='networkidle')
        def go(route,selector):
            page.evaluate('(route)=>location.hash=route',route)
            page.locator(selector).first.wait_for(state='visible')
        check('fresh home is complete and downloads no lesson content',page.locator('.home-welcome').count()==1 and not any('/content/' in x for x in requests))
        check('initial HTML below 2 MB and gzip below 350 KB',report['htmlBytes']<2000000 and report['gzipBytes']<350000)
        check('catalog retains all 759 unit IDs and 2824 question IDs',page.evaluate('STUDY_DATA.units.length===759 && STUDY_DATA.units.reduce((n,u)=>n+u.quiz.length,0)===2824'))
        page.screenshot(path=str(out/'home-desktop.png'))
        go('#/library?g=7&s=science&term=1','[data-curriculum-section]')
        check('catalog selection needs no lesson downloads',not any('/content/' in x for x in requests))
        go('#/unit/bio-3-3/notes','#unit-content')
        check('one lesson loads one content group',len([x for x in requests if '/content/' in x])==1)
        page.locator('[data-star]').first.click()
        go('#/unit/bio-3-3/quiz','[data-option]')
        check('tabs reuse loaded content',len([x for x in requests if '/content/' in x])==1)
        go('#/practice?unit=bio-3-3&n=8&seed=leaf-structure-test','[data-view="practice"]')
        page.locator('[data-ac-option]').first.click(); page.reload(); page.locator('.practice-option.selected').wait_for()
        check('unfinished selected answer survives native reload',page.locator('.practice-option.selected').count()==1 and '快照無法驗證' not in page.locator('#main').inner_text())
        # Use the real deterministic deck to answer incorrectly, including leaf-structure.
        questions=page.evaluate("PracticeV2.generate(STUDY_DATA,{unitId:'bio-3-3',count:8,seed:'leaf-structure-test'}).questions")
        for q in questions:
            wrong=next(o['id'] for o in q['options'] if o['id']!=q['answer'])
            page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{wrong}"]').click()
        page.locator('[data-ac="submit"]').click()
        go('#/home','.home-welcome'); page.reload(); page.locator('.home-welcome').wait_for()
        page.wait_for_function('document.querySelector("[data-wrong-count]")?.textContent==="5"')
        check('all five genuine biology mistakes survive reload',page.locator('[data-wrong-count]').inner_text()=='5')
        page.locator('[data-ac="home-wrong"]').click(); page.locator('[data-view="practice"]').wait_for()
        check('homepage resumes the stored wrong-question snapshots',page.locator('.practice-card').count()==5)
        go('#/review','[data-view="review"]'); check('legacy bookmark survived delivery migration',page.locator('.concept-card').count()==1)
        go('#/practice?g=9&term=2&s=science&exam=math-7-1&n=10&seed=bad-scope','.empty')
        check('conflicting direct exam is rejected',page.locator('[data-ac-option]').count()==0)
        go('#/exam?g=7&term=1&s=math&units=math-7-1&n=10&seed=web-exam','[data-ac="exam-start"]')
        page.locator('[data-ac="exam-start"]').click(); page.locator('[data-view="practice"]').wait_for()
        check('lazy exam builds and starts the complete requested paper',page.locator('.practice-card').count()==10)
        go('#/search?q='+__import__('urllib.parse',fromlist=['quote']).quote('木質部'),'.search-result')
        check('full text search hydrates every lesson on demand',page.evaluate('STUDY_DATA.units.every(u=>u.concepts[0].body)'))
        check('search results disclose source scope','年級' in page.locator('.search-result').first.inner_text() and '學年度' in page.locator('.search-result').first.inner_text())
        go('#/unit/catalog-285458f7a56563a2/notes','#unit-content')
        # Native beforeprint event generates the same content used by browser print shortcuts.
        page.evaluate("window.dispatchEvent(new Event('beforeprint'))")
        check('print retains reading guide limitation','閱讀導引' in page.locator('#print-root').text_content() and '未核對' in page.locator('#print-root').text_content())
        page.evaluate("window.dispatchEvent(new Event('afterprint'))")
        for width in [320,390,768,1366]:
            page.set_viewport_size({'width':width,'height':900}); go('#/home','.home-welcome')
            check(f'homepage fits {width}px',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
        page.set_viewport_size({'width':390,'height':844}); page.screenshot(path=str(out/'home-mobile.png'))
        # A separate context cannot accidentally reuse previously hydrated content.
        recovery=browser.new_context(); r=recovery.new_page(); r.on('pageerror',lambda e:errors.append(str(e)))
        r.route('**/content/**',lambda route:route.abort())
        r.goto(url+'#/unit/bio-3-3/notes'); r.locator('[data-content-retry]').wait_for()
        check('network failure offers an explicit retry',r.locator('[data-content-retry]').is_visible())
        r.unroute('**/content/**'); r.locator('[data-content-retry]').click(); r.locator('#unit-content').wait_for()
        check('retry opens the requested lesson',r.locator('#unit-content').inner_text().strip()!='')
        recovery.close()
        # Delay content in a fresh browser; leave before it arrives.
        slow=browser.new_context(); s=slow.new_page(); s.on('pageerror',lambda e:errors.append(str(e)))
        def delayed(route):
            time.sleep(.3); route.continue_()
        s.route('**/content/**',delayed); s.goto(url+'#/home')
        s.evaluate("location.hash='#/unit/bio-3-3/notes'")
        s.locator('[data-content-status]').wait_for(); s.evaluate("location.hash='#/home'")
        s.wait_for_load_state('networkidle'); check('late content cannot steal a newer homepage route',s.locator('.home-welcome').count()==1)
        slow.close(); check('no uncaught runtime errors',not errors)
        report['status']='passed'; browser.close()
except Exception as error:
    report['status']='failed'; report['failure']=str(error); traceback.print_exc(); raise
finally:
    (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)); server.shutdown()
