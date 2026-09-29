"""114 teaching adoption. Native HTTP/localStorage in CI; explicit --isolated fixture locally."""
from pathlib import Path
import sys,json,os,threading,http.server,functools
from playwright.sync_api import sync_playwright
site=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True);isolated='--isolated' in sys.argv
checks=[];errors=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)));threading.Thread(target=server.serve_forever,daemon=True).start()
def check(name,value):
 assert value,name
 checks.append(name)
with sync_playwright() as p:
 opts={'headless':True,'args':['--no-sandbox']}
 if isolated or os.getenv('CHROMIUM_PATH'):opts['executable_path']=os.getenv('CHROMIUM_PATH','/usr/bin/chromium')
 b=p.chromium.launch(**opts);ctx=b.new_context(viewport={'width':1366,'height':960},accept_downloads=True);page=ctx.new_page();page.set_default_timeout(10000);page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
 if isolated:
  page.evaluate('()=>{const d={};Object.defineProperty(window,"localStorage",{value:{getItem:k=>d[k]??null,setItem:(k,v)=>d[k]=String(v),removeItem:k=>delete d[k]}})}');page.set_content(site.read_text())
 else:page.goto(f'http://127.0.0.1:{server.server_port}/{site.name}')
 def go(h):page.evaluate('(h)=>location.hash=h',h);page.wait_for_timeout(70)
 check('version and real content totals',page.evaluate('STUDY_DATA.appVersion==="1.8.0"&&STUDY_DATA.units.length===147&&STUDY_DATA.units.reduce((n,u)=>n+u.quiz.length,0)===856'))
 check('homepage remains navigation',page.locator('[data-unit-card]').count()==0)
 for g,n in [(7,11),(8,12),(9,6)]:
  go(f'#/atlas?g={g}&s=math&period=114-2')
  check(f'114 grade {g} has {n} readable sections',page.locator('.atlas-learning-actions').count()==n)
  check(f'114 grade {g} acknowledges teaching adoption','114學年度下學期資料作教學' in page.locator('.atlas-period-note').inner_text())
  check(f'114 grade {g} retains correct publisher',('翰林' if g==9 else '康軒') in page.locator('.atlas-course-head').inner_text())
  go(f'#/library?g={g}&s=math&term=2')
  check(f'114 grade {g} catalog includes notes plus original overview',page.locator('.unit-card').count()==n+1)
  check(f'114 grade {g} catalog does not show blanket current publisher','114學年度教材' in page.locator('.catalog-scope-line').inner_text())
 go('#/atlas?g=8&s=math&period=114-2');page.screenshot(path=str(out/'lower114-atlas-desktop.png'),full_page=False)
 ids=page.evaluate('STUDY_DATA.units.filter(u=>u.historicalAdoption).map(u=>u.id)')
 for uid in ids:
  go('#/unit/'+uid+'/notes')
  assert page.locator('[data-concept-card]').count()==3,uid
  assert '114學年度教材' in page.locator('.unit-hero .badge-row').inner_text(),uid
  assert 'period=114-2' in page.locator('.atlas-unit-trail a').get_attribute('href'),uid
 check('all 29 lessons display actual notes, year and historical return link',True)
 for uid in ['hist114-math-7-1-1','hist114-math-8-3-3','hist114-math-9-3-2']:
  go('#/unit/'+uid+'/quiz');qs=page.evaluate('(id)=>STUDY_DATA.units.find(u=>u.id===id).quiz',uid)
  for q in qs:
   page.locator(f'[data-option="{q["answer"]}"]').click();page.locator('[data-action="submit-answer"]').click();page.locator('[data-action="next-question"]').click()
  check(uid+' sixth question completes',page.locator('[data-quiz-result]').count()==1)
 go('#/practice?unit=hist114-math-8-3-2&n=8&seed=finite114')
 check('finite historical scope produces six not repeated eight',page.locator('.practice-card').count()==6)
 go('#/practice?unit=hist114-math-8-1-2&n=8&seed=lowerflow')
 qs=page.evaluate('PracticeV2.generate(STUDY_DATA,{unitId:"hist114-math-8-1-2",count:8,seed:"lowerflow"}).questions')
 check('numerical history practice has eight unique questions',len(qs)==8 and len({q['question'] for q in qs})==8)
 for i,q in enumerate(qs):
  answer=next(o['id'] for o in q['options'] if o['id']!=q['answer']) if i==0 else q['answer']
  page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{answer}"]').click()
 page.locator('[data-ac="submit"]').click();page.wait_for_selector('.practice-summary')
 check('historical generated test scored 7/8',page.locator('.practice-summary h2').inner_text()=='7 / 8 題正確')
 check('historical mistake backup validates',page.evaluate('PracticeV2.validateState(JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")),STUDY_DATA).mistakes.length')==1)
 page.locator('[data-ac="retry-current"]').click();page.wait_for_timeout(80)
 check('historical exact wrong question preserved',page.locator('.practice-card h3').inner_text()==qs[0]['question'])
 q=qs[0];page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{q["answer"]}"]').click();page.locator('[data-ac="submit"]').click();page.wait_for_timeout(80)
 check('correct historical retry removes mistake',page.evaluate('JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")).mistakes.length')==0)
 go('#/atlas?g=8&s=math&period=114-2')
 check('21 actual historical question records unchanged',page.evaluate('STUDY_DATA.atlas.statistics.questionRecords')==21)
 go('#/atlas?g=8&s=math&period=115-1')
 check('current syllabus remains twelve original sections',page.locator('.atlas-learning-actions').count()==12)
 check('no historical evidence leaked into current math',page.evaluate('STUDY_DATA.atlas.courses.find(c=>c.id==="115-1-8-math").sections.every(s=>s.evidence.length===0)'))
 for w in [320,390,768,1366]:
  page.set_viewport_size({'width':w,'height':900});go('#/atlas?g=8&s=math&period=114-2')
  check(f'{w}px historical map no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  go('#/unit/hist114-math-9-3-2/notes')
  check(f'{w}px historical note no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  if w==390:page.screenshot(path=str(out/'lower114-note-mobile.png'),full_page=False)
 check('no uncaught script errors',not errors)
 report={'passed':len(checks),'failed':0,'checks':checks,'errors':errors,'mode':'isolated DOM/memory storage' if isolated else 'Chromium HTTP/native localStorage'}
 (out/'lower114-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2));b.close()
server.shutdown()
