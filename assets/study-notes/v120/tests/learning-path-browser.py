"""Verify semester guidance, native reload and fixed-question correction on the Pages artifact."""
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
        page.locator('[data-learning-entry]').click(); page.locator('[data-view="learn"]').wait_for()
        check('home opens seventh-grade first-semester guidance without downloading lessons',page.locator('[data-learning-grade]').inner_text()=='7年級上學期' and not any('/content/' in r for r in requests))
        check('unverified Chinese reading guides remain clearly disclosed','未核對課文全文' in page.locator('[data-learning-course="115-1-7-chinese"]').inner_text())
        check('unanswered questions are not mistakes',page.locator('[data-fixed-wrong-count]').inner_text()=='0')
        page.screenshot(path=str(out/'learning-desktop.png'),full_page=True)
        for width in [320,390,768,1366]:
            page.set_viewport_size({'width':width,'height':900})
            check(f'learning view fits {width}px',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
        page.set_viewport_size({'width':390,'height':844}); page.screenshot(path=str(out/'learning-mobile.png'),full_page=True)
        # Exercise actual controls before seeding completed-course records below.
        page.locator('[data-learning-course="115-1-7-math"] [data-learn-read]').click()
        page.locator('#unit-content').wait_for()
        check('reading one recommended lesson downloads one content group',len([r for r in requests if '/content/' in r])==1)
        page.locator('[data-action="read"]').click()
        go('#/unit/atlas-math-7-1-1/quiz','[data-option]')
        question=page.evaluate("STUDY_DATA.units.find(u=>u.id==='atlas-math-7-1-1').quiz[0]")
        wrong=next(o['id'] for o in question['options'] if o['id']!=question['answer'])
        page.locator(f'[data-option="{wrong}"]').click(); page.locator('[data-action="submit-answer"]').click()
        go('#/learn?g=7&term=1','[data-view="learn"]'); page.reload(); page.locator('[data-view="learn"]').wait_for()
        check('real wrong answer survives native reload and appears in semester corrections',page.locator('[data-fixed-wrong-count]').inner_text()=='1')
        before=page.evaluate("localStorage.getItem('jh-study-notes.progress.v1')")
        page.screenshot(path=str(out/'correction-mobile.png'),full_page=True)
        page.locator('[data-correction-link]').click(); page.locator('[data-feedback].wrong').wait_for()
        check('opening wrong feedback preserves saved answers',page.evaluate("localStorage.getItem('jh-study-notes.progress.v1')")==before)
        page.locator('[data-action="retry-wrong"]').click(); page.locator(f'[data-option="{question["answer"]}"]').click()
        page.locator('[data-action="submit-answer"]').click()
        page.locator('[data-action="next-question"]').click(); page.locator('[data-quiz-result]').wait_for()
        page.get_by_role('link',name='繼續未作答的題目').click(); page.locator('[data-option]:not(:disabled)').first.wait_for()
        check('finishing a correction can continue unanswered questions without resetting records',page.evaluate("JSON.parse(localStorage.getItem('jh-study-notes.progress.v1')).answers['atlas-math-7-1-1/'+STUDY_DATA.units.find(u=>u.id==='atlas-math-7-1-1').quiz[0].id]")==question['answer'])
        go('#/learn?g=7&term=1','[data-view="learn"]')
        page.locator('[data-learning-course="115-1-7-math"] [data-learn-quiz]').click(); page.locator('[data-option]:not(:disabled)').first.wait_for()
        check('guidance also resumes the unanswered part of a corrected chapter',page.locator('[data-quiz-result]').count()==0)
        go('#/learn?g=7&term=1','[data-view="learn"]'); page.reload(); page.locator('[data-view="learn"]').wait_for()
        check('corrected answer stays corrected after reload',page.locator('[data-fixed-wrong-count]').inner_text()=='0')
        check('partly finished chapter stays next',page.locator('[data-learning-course="115-1-7-math"] [data-next-unit]').get_attribute('data-next-unit')=='atlas-math-7-1-1')
        # Persist valid pre-existing records for two grades; recommendations must not overwrite them.
        seeded=page.evaluate("""()=>{
            const key='jh-study-notes.progress.v1',saved=JSON.parse(localStorage.getItem(key));
            const first=STUDY_DATA.units.find(u=>u.id==='atlas-math-7-1-1');
            for(const q of first.quiz)saved.answers[first.id+'/'+q.id]=q.answer;
            const other=STUDY_DATA.units.find(u=>u.grade===8&&u.subject==='math');
            saved.answers[other.id+'/'+other.quiz[0].id]=other.quiz[0].options.find(o=>o.id!==other.quiz[0].answer).id;
            const raw=JSON.stringify(saved);localStorage.setItem(key,raw);return raw;
        }""")
        page.reload(); page.locator('[data-view="learn"]').wait_for()
        check('completed fixed check advances to next chapter',page.locator('[data-learning-course="115-1-7-math"] [data-next-unit]').get_attribute('data-next-unit')=='atlas-math-7-1-2')
        check('other-grade mistakes do not enter the seventh-grade list',page.locator('[data-fixed-wrong-count]').inner_text()=='0')
        check('recommendations preserve all pre-existing records',page.evaluate("localStorage.getItem('jh-study-notes.progress.v1')")==seeded)
        go('#/learn?g=7&term=2','[data-learning-course="114-2-7-math"]')
        check('semester selection retains original source year','下學期' in page.locator('[data-learning-grade]').inner_text() and '114學年度' in page.locator('#main').inner_text())
        go('#/learn?g=8&term=1','[data-learning-course="114-1-8-history"]')
        check('mixed-year scope retains historical history alongside current mathematics','114學年度' in page.locator('[data-learning-course="114-1-8-history"]').inner_text() and '115學年度' in page.locator('[data-learning-course="115-1-8-math"]').inner_text())
        check('no uncaught runtime errors',not errors)
        report['status']='passed'; browser.close()
except Exception as error:
    report['status']='failed'; report['failure']=str(error); traceback.print_exc(); raise
finally:
    (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)); server.shutdown()
