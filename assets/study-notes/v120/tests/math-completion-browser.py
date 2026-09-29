"""Run on final V1.8 HTML. --isolated is explicitly a DOM/memory-storage fixture."""
from pathlib import Path
import sys,json,os,threading,http.server,functools
from playwright.sync_api import sync_playwright
site=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True);isolated='--isolated' in sys.argv
checks=[];errors=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)));threading.Thread(target=server.serve_forever,daemon=True).start()
def check(name,condition):
 assert condition,name
 checks.append(name)
with sync_playwright() as p:
 opts={'headless':True,'args':['--no-sandbox']}
 if isolated or os.getenv('CHROMIUM_PATH'):opts['executable_path']=os.getenv('CHROMIUM_PATH','/usr/bin/chromium')
 browser=p.chromium.launch(**opts);ctx=browser.new_context(viewport={'width':1366,'height':960},accept_downloads=True);page=ctx.new_page();page.set_default_timeout(10000)
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
 if isolated:
  page.evaluate('()=>{const d={};Object.defineProperty(window,"localStorage",{value:{getItem:k=>d[k]??null,setItem:(k,v)=>d[k]=String(v),removeItem:k=>delete d[k]}})}');page.set_content(site.read_text())
 else:page.goto(f'http://127.0.0.1:{server.server_port}/{site.name}')
 def go(h):page.evaluate('(h)=>location.hash=h',h);page.wait_for_timeout(70)
 check('final V1.8 data',page.evaluate('STUDY_DATA.appVersion')=='1.8.0')
 check('147 notes and 856 fixed questions',page.evaluate('STUDY_DATA.units.length===147&&STUDY_DATA.units.reduce((n,u)=>n+u.quiz.length,0)===856'))
 for g,n,qcount in [(7,11,66),(8,12,66),(9,8,48)]:
  go(f'#/atlas?g={g}&s=math&period=115-1')
  check(f'grade {g} atlas all {n} sections ready',page.locator('[data-atlas-section]').count()==n and page.locator('.atlas-learning-actions').count()==n)
  check(f'grade {g} question count {qcount}',str(qcount) in page.locator('.atlas-stats').inner_text())
  if g==7:page.screenshot(path=str(out/'math-atlas-desktop.png'),full_page=False)
  go(f'#/library?g={g}&term=1&s=math')
  check(f'grade {g} catalog keeps overview separate',page.locator('.unit-card').count()==n+1 and page.locator('.catalog-status-row a').count()==n)
 for uid in page.evaluate('STUDY_DATA.units.filter(u=>u.id.startsWith("atlas-math-")).map(u=>u.id)'):
  go('#/unit/'+uid+'/notes');assert page.locator('[data-concept-card]').count()==3,uid
  assert page.locator('.atlas-unit-trail a').count()==1,uid
 check('all 29 notes open three concepts and a source trail',True)
 for uid in ['atlas-math-7-1-1','atlas-math-8-1-2','atlas-math-9-3-2']:
  go('#/unit/'+uid+'/quiz');qs=page.evaluate('(id)=>STUDY_DATA.units.find(u=>u.id===id).quiz',uid)
  for q in qs:
   page.locator(f'[data-option="{q["answer"]}"]').click();page.locator('[data-action="submit-answer"]').click();page.locator('[data-action="next-question"]').click()
  check(uid+' sixth question reaches result',page.locator('[data-quiz-result]').count()==1)
 go('#/practice?unit=atlas-math-7-1-1&n=8&seed=finite')
 check('finite six-question section not repeated to fill eight',page.locator('.practice-card').count()==6)
 go('#/practice?unit=atlas-math-7-3-2&n=8&seed=math-flow');qs=page.evaluate('PracticeV2.generate(STUDY_DATA,{unitId:"atlas-math-7-3-2",count:8,seed:"math-flow"}).questions')
 check('generated algebra deck has eight unique questions',len(qs)==8 and len({q['question'] for q in qs})==8)
 for i,q in enumerate(qs):
  a=next(o['id'] for o in q['options'] if o['id']!=q['answer']) if i==0 else q['answer']
  page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{a}"]').click()
 page.locator('[data-ac="submit"]').click();page.wait_for_selector('.practice-summary')
 check('eight-question generated deck graded 7/8',page.locator('.practice-summary h2').inner_text()=='7 / 8 題正確')
 page.locator('[data-ac="retry-current"]').click();page.wait_for_timeout(90)
 check('exact wrong question retained',page.locator('.practice-card h3').inner_text()==qs[0]['question'])
 q=qs[0];page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{q["answer"]}"]').click();page.locator('[data-ac="submit"]').click();page.wait_for_timeout(90)
 check('correct reattempt removes saved mistake',page.evaluate('JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")).mistakes.length')==0)
 with page.expect_download() as dl:page.locator('[data-ac="export"]').click()
 file=out/'math-backup.json';dl.value.save_as(file)
 check('new mathematics progress backup validates',json.loads(file.read_text())['version']=='1.3.1')
 go('#/atlas?g=8&s=math&period=114-2')
 check('adopted 114 mathematics exposes twelve ready notes',page.locator('.atlas-learning-actions').count()==12)
 check('historical 21 actual question links preserved',page.evaluate('STUDY_DATA.atlas.statistics.questionRecords')==21)
 for w in [320,390,768,1366]:
  page.set_viewport_size({'width':w,'height':900});go('#/atlas?g=9&s=math&period=115-1')
  check(f'{w}px math atlas no page overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  if w==390:page.screenshot(path=str(out/'math-atlas-mobile.png'),full_page=False)
  go('#/unit/atlas-math-9-3-2/notes')
  check(f'{w}px geometry lesson no page overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  if w==390:page.screenshot(path=str(out/'math-lesson-mobile.png'),full_page=False)
 check('no script exceptions',not errors)
 browser.close()
server.shutdown();report={'passed':len(checks),'failed':0,'checks':checks,'errors':errors,'mode':'isolated DOM/memory storage' if isolated else 'native Chromium HTTP/localStorage'}
(out/'math-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
