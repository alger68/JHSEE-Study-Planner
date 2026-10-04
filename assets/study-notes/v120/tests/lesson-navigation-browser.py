"""Native acceptance of direct lesson navigation in the shipped compact release."""
from pathlib import Path
import functools, http.server, json, sys, threading, traceback
from playwright.sync_api import sync_playwright
site=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
checks=[];errors=[];requests=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/{site.name}'
def check(name,ok):
    if not ok:raise AssertionError(name)
    checks.append(name);print('PASS '+name,flush=True)
report={'checks':checks,'runtimeErrors':errors}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':390,'height':844})
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:requests.append(r.url))
        page.goto(url+'#/home',wait_until='networkidle')
        ids=page.evaluate('STUDY_DATA.atlas.courses.find(c=>c.id==="115-1-7-chinese").sections.map(s=>s.unitId)')
        saved=page.evaluate('(id)=>({app:"jh-study-notes",schemaVersion:1,read:[id],starred:[],answers:{[id+"/q1"]:STUDY_DATA.units.find(u=>u.id===id).quiz[0].answer},font:0})',ids[0])
        page.evaluate('(s)=>localStorage.setItem("jh-study-notes.progress.v1",JSON.stringify(s))',saved)
        page.goto(url+'#/unit/'+ids[0]+'/notes',wait_until='networkidle')
        progress=page.evaluate('localStorage.getItem("jh-study-notes.progress.v1")')
        jump=page.locator('[data-lesson-jump]')
        jump.wait_for()
        check('Chinese lesson picker follows all official course sections',jump.locator('option').evaluate_all('(xs)=>xs.map(x=>x.value)')==ids)
        check('first lesson has no previous link',page.locator('[data-lesson-prev]').get_attribute('aria-disabled')=='true')
        page.locator('[data-lesson-next]').click()
        page.wait_for_function('(id)=>document.querySelector("[data-lesson-jump]")?.dataset.currentUnit===id',arg=ids[1])
        check('next opens second lesson directly',page.locator('h1').inner_text()=='生之歌選')
        jump.select_option(ids[-1])
        page.wait_for_function('(id)=>document.querySelector("[data-lesson-jump]")?.dataset.currentUnit===id',arg=ids[-1])
        check('picker jumps directly to last lesson',jump.input_value()==ids[-1] and page.locator('[data-lesson-next]').get_attribute('aria-disabled')=='true')
        page.locator('[data-lesson-prev]').click()
        page.wait_for_function('(id)=>document.querySelector("[data-lesson-jump]")?.dataset.currentUnit===id',arg=ids[-2])
        check('previous follows course order',jump.input_value()==ids[-2])
        for width in [320,390,1366]:
            page.set_viewport_size({'width':width,'height':900})
            page.evaluate('window.scrollTo(0,document.body.scrollHeight)')
            page.wait_for_function('()=>{const r=document.querySelector(".lesson-switcher").getBoundingClientRect();return r.top>=0&&r.bottom<innerHeight}')
            check(f'navigation stays reachable at page end at {width}px',page.locator('.lesson-switcher').is_visible())
            check(f'lesson navigation fits {width}px',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
            page.locator('#unit-content').evaluate('(el)=>el.scrollIntoView({block:"start"})')
            page.wait_for_function('()=>document.querySelector("#unit-content").getBoundingClientRect().top>=document.querySelector(".lesson-switcher").getBoundingClientRect().bottom')
            check(f'content anchors are not hidden by navigation at {width}px',True)
        check('switching retains fixed-question answers',page.evaluate('localStorage.getItem("jh-study-notes.progress.v1")')==progress)
        check('same-course navigation needs only one lesson bundle',len(set(r for r in requests if '/content/' in r))==1)
        page.set_viewport_size({'width':390,'height':844})
        page.screenshot(path=str(out/'lesson-switcher-mobile.png'))
        check('no navigation runtime errors',not errors)
        browser.close()
except Exception:
    report['error']=traceback.format_exc();raise
finally:
    (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));server.shutdown()
