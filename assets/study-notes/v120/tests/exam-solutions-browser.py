"""Native acceptance for source-backed, on-demand historical solutions."""
from pathlib import Path
import functools, http.server, json, sys, threading, traceback
from playwright.sync_api import sync_playwright

site=Path(sys.argv[1]).resolve(); out=Path(sys.argv[2]); out.mkdir(parents=True,exist_ok=True)
checks=[]; errors=[]; requests=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/{site.name}'
report={'checks':checks,'runtimeErrors':errors}
def check(name,condition):
    if not condition: raise AssertionError(name)
    checks.append(name); print('PASS '+name,flush=True)
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
        context=browser.new_context(viewport={'width':1366,'height':960})
        page=context.new_page(); page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:requests.append(r.url))
        def go(route,selector):
            page.evaluate('(route)=>location.hash=route',route)
            page.locator(selector).first.wait_for(state='visible')
        page.goto(url+'#/home',wait_until='networkidle')
        check('homepage downloads no paper or lesson payload',not any('/content/' in r for r in requests))
        page.locator('[data-paper-entry]').click();page.locator('[data-view="papers"]').wait_for()
        check('seventh-grade history is explicit and opens without paper downloads','114下學期' in page.locator('main').inner_text() and not any('/content/' in r for r in requests))
        papers=page.evaluate('STUDY_DATA.examSolutions.papers')
        check('all fifteen seventh-grade historical papers have guides',len(papers)==15 and {(x['subject'],x['round']) for x in papers}=={(s,r) for s in ['math','english','chinese','social','biology'] for r in [1,2,3]} and all(x['grade']==7 and x['year']==114 and x['term']==2 for x in papers))
        check('seventh-grade list has fifteen ready papers and no pending cards',page.locator('[data-paper-card] .btn.primary').count()==15 and page.locator('.paper-pending-list').count()==0)
        progress=page.evaluate('JSON.stringify(localStorage)')
        for paper in papers:
            start=len(requests)
            label=paper['subject']+' round '+str(paper['round'])
            go('#/papers?id='+paper['sourceId'],'[data-solution-id]')
            check(label+' loads exactly its one paper payload',len([r for r in requests[start:] if '/content/paper-' in r])==1)
            check(label+' represents every audited item',page.locator('[data-solution-id]').count()==paper['totalItems'])
            check(label+' displays the downloaded coverage note',len(page.locator('[data-paper-coverage]').inner_text())>10)
            q=page.locator('[data-solution-id]').first;q.locator('summary').click()
            check(label+' reveals original steps and page citation',q.locator('li').count()>=2 and q.locator('[data-source-page]').get_attribute('href').startswith(paper['url']+'#page='))
            page.set_viewport_size({'width':320,'height':900})
            check(label+' fits the narrowest supported viewport',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
            page.set_viewport_size({'width':1366,'height':960})
        check('reading solutions leaves saved progress unchanged',page.evaluate('JSON.stringify(localStorage)')==progress)
        math=next(x for x in papers if x['subject']=='math' and x['round']==1)
        go('#/papers?id='+math['sourceId'],'[data-solution-id]')
        issue=page.locator('.paper-question').filter(has=page.locator('.paper-caution')).first
        issue.locator('summary').click()
        check('source discrepancy is visibly explained',issue.locator('.paper-issue').is_visible())
        page.screenshot(path=str(out/'solutions-desktop.png'),full_page=True)
        for width in [320,390,768,1366]:
            page.set_viewport_size({'width':width,'height':900})
            check(f'solution page fits {width}px',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
        page.set_viewport_size({'width':390,'height':844})
        page.screenshot(path=str(out/'solutions-mobile.png'),full_page=True)
        go('#/papers?id=unknown','[data-paper-invalid]')
        check('unknown IDs do not substitute content',page.locator('[data-solution-id]').count()==0)
        go('#/papers?g=','[data-paper-invalid]')
        check('empty grade does not silently select seventh grade',page.locator('[data-paper-card]').count()==0)
        go('#/papers?g=8','[data-view="papers"]')
        page.locator('[data-paper-card] .btn').first.click();page.locator('[data-paper-pending]').wait_for()
        check('pending guide retains source access and availability boundary','逐題詳解尚待編寫' in page.locator('main').inner_text())
        # Fresh context ensures the recovery test cannot reuse a loaded paper.
        retry=context.new_page();retry.on('pageerror',lambda e:errors.append(str(e)))
        retry.route('**/content/paper-*',lambda route:route.abort())
        retry.goto(url+'#/papers?id='+math['sourceId']);retry.locator('[data-paper-retry]').wait_for()
        retry.unroute('**/content/paper-*');retry.locator('[data-paper-retry]').click();retry.locator('[data-solution-id]').first.wait_for()
        check('real failed request can be retried without reloading the app',retry.locator('[data-solution-id]').count()==math['totalItems'])
        check('no runtime errors',not errors)
        browser.close()
except Exception:
    report['error']=traceback.format_exc();raise
finally:
    (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));server.shutdown()
