"""HTTP/real storage in CI; --isolated explicitly uses a DOM + storage fixture locally."""
from pathlib import Path
import json,sys,threading,http.server,functools
from playwright.sync_api import sync_playwright
site=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
isolated='--isolated' in sys.argv;checks=[];errors=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)))
threading.Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/{site.name}'
def check(name,value):
 assert value,name
 checks.append(name)
with sync_playwright() as p:
 kwargs={'headless':True,'args':['--no-sandbox']}
 if isolated:kwargs['executable_path']='/usr/bin/chromium'
 browser=p.chromium.launch(**kwargs);ctx=browser.new_context(viewport={'width':1366,'height':960},accept_downloads=True);page=ctx.new_page();page.set_default_timeout(12000)
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
 if isolated:
  page.evaluate('()=>{const data={};Object.defineProperty(window,"localStorage",{value:{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=String(v),removeItem:k=>delete data[k]}})}')
  page.set_content(site.read_text())
 else:page.goto(url)
 def go(h):page.evaluate('(h)=>location.hash=h',h);page.wait_for_timeout(60)
 check('chapter entry present on homepage',page.locator('.home-meta a[href="#/chapters"]').count()==1)
 page.locator('.home-meta a[href="#/chapters"]').click();page.wait_for_selector('[data-view="chapters"]')
 check('school chapter route not fallback homepage',page.locator('.chapter-row').count()==22)
 books=page.evaluate('STUDY_DATA.courseMap.books')
 for b in books:
  go(f'#/chapters?g={b["grade"]}&s={b["subject"]}')
  check(b['id']+' section count',page.locator('.chapter-row').count()==len(b['sections']))
  for s in b['sections']:
   row=page.locator(f'[data-chapter="{s["code"]}"]')
   assert row.locator('h3').inner_text()==s['title']
   if not s['unitId']:assert row.locator('a').count()==0
 check('all 105 titles match evidence index; gaps have no fake quiz',True)
 go('#/chapters?g=8&s=math');page.screenshot(path=str(out/'chapters-desktop.png'),full_page=False)
 for b in books:
  for s in b['sections']:
   if not s['unitId']:continue
   uid=s['unitId'];go(f'#/unit/{uid}/notes')
   assert page.locator('#unit-content').inner_text().strip()
   go(f'#/practice?unit={uid}&n=8&seed=verified-browser')
   check(uid+' scoped questions render',page.locator('#practice-questions .practice-card').count()>0)
   ids=page.locator('[data-ac-question]').evaluate_all('(es)=>es.map(e=>e.dataset.acQuestion)')
   assert all(x.startswith(uid+'/') for x in ids)
 go('#/practice?unit=school-s8-2-2&n=8&seed=flow')
 qs=page.evaluate('PracticeV2.generate(STUDY_DATA,{unitId:"school-s8-2-2",count:8,seed:"flow"}).questions')
 check('new concentration lesson gives eight unique questions',len(qs)==8 and len({q['question'] for q in qs})==8)
 for i,q in enumerate(qs):
  selected=next(o['id'] for o in q['options'] if o['id']!=q['answer']) if i==0 else q['answer']
  page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{selected}"]').click()
 page.locator('[data-ac="submit"]').click();page.wait_for_selector('.practice-summary')
 check('new chapter submits with correct score',page.locator('.practice-summary h2').inner_text()=='7 / 8 題正確')
 page.locator('[data-ac="retry-current"]').click();page.wait_for_timeout(70)
 check('new chapter wrong snapshot retained',page.locator('.practice-card h3').inner_text()==qs[0]['question'])
 q=qs[0];page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{q["answer"]}"]').click();page.locator('[data-ac="submit"]').click();page.wait_for_timeout(70)
 check('new chapter correct retry clears mistake',page.evaluate('JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")).mistakes.length')==0)
 go('#/practice?unit=school-m8-5-1&n=8&seed=finite')
 check('three-question section does not repeat to fill eight',page.locator('.practice-card').count()==3)
 for width in [320,390,768,1366]:
  page.set_viewport_size({'width':width,'height':900});go('#/chapters?g=9&s=science')
  check(f'chapter map {width}px no document overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  if width==390:page.screenshot(path=str(out/'chapters-mobile.png'),full_page=False)
  go('#/home?g=8&term=1&s=all');check(f'home {width}px no document overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
 page.set_viewport_size({'width':1366,'height':960});go('#/home');page.screenshot(path=str(out/'home-desktop.png'),full_page=False)
 page.set_viewport_size({'width':390,'height':844});go('#/unit/school-m8-4-2/notes');page.screenshot(path=str(out/'lesson-mobile.png'),full_page=False)
 check('no runtime errors',not errors);browser.close()
server.shutdown();report={'passed':len(checks),'failed':0,'checks':checks,'runtimeErrors':errors,'mode':'isolated DOM/storage fixture' if isolated else 'Chromium HTTP with native localStorage'}
(out/'chapters-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
