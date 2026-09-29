"""Verify current English chapter routes, quizzes and year isolation on the final HTML."""
from pathlib import Path
import functools, http.server, json, os, sys, threading
from playwright.sync_api import sync_playwright

site=Path(sys.argv[1]).resolve()
out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
isolated='--isolated' in sys.argv
checks=[];errors=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)))
threading.Thread(target=server.serve_forever,daemon=True).start()
def check(name,condition):
 assert condition,name
 checks.append(name)
with sync_playwright() as playwright:
 opts={'headless':True,'args':['--no-sandbox']}
 if isolated or os.getenv('CHROMIUM_PATH'): opts['executable_path']=os.getenv('CHROMIUM_PATH','/usr/bin/chromium')
 browser=playwright.chromium.launch(**opts)
 context=browser.new_context(viewport={'width':1366,'height':900})
 page=context.new_page();page.set_default_timeout(10000)
 page.on('pageerror',lambda error:errors.append(str(error)))
 if isolated:
  page.evaluate('()=>{const data={};Object.defineProperty(window,"localStorage",{value:{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=String(v),removeItem:k=>delete data[k]}})}')
  page.set_content(site.read_text())
 else: page.goto(f'http://127.0.0.1:{server.server_port}/{site.name}')
 def go(route): page.evaluate('(route)=>location.hash=route',route);page.wait_for_timeout(80)
 check('version 1.9 and 22 school English lessons',page.evaluate('STUDY_DATA.appVersion==="1.9.0"&&STUDY_DATA.units.filter(u=>u.id.startsWith("school-en-115-")).length===22'))
 for grade,count,publisher in [(7,7,'康軒'),(8,8,'翰林'),(9,7,'翰林')]:
  go(f'#/atlas?g={grade}&s=english&period=115-1')
  check(f'grade {grade} exact school chapter links',page.locator('[data-atlas-section]').count()==count and page.locator('.atlas-learning-actions').count()==count)
  check(f'grade {grade} publisher on source card',publisher in page.locator('.atlas-course-head').inner_text())
  go(f'#/library?g={grade}&s=english&term=1')
  check(f'grade {grade} catalog includes a separate overview',page.locator('.unit-card').count()==count+1)
 ids=page.evaluate('STUDY_DATA.units.filter(u=>u.id.startsWith("school-en-115-")).map(u=>u.id)')
 for uid in ids:
  go('#/unit/'+uid+'/notes')
  assert page.locator('[data-concept-card]').count()==3,uid
  assert 'period=115-1' in page.locator('.atlas-unit-trail a').get_attribute('href'),uid
 check('all 22 real notes open with current-school trail',True)
 for uid in ['school-en-115-7-lesson-1','school-en-115-8-u3','school-en-115-9-u6']:
  go('#/unit/'+uid+'/quiz')
  questions=page.evaluate('(uid)=>STUDY_DATA.units.find(u=>u.id===uid).quiz',uid)
  for question in questions:
   page.locator(f'[data-option="{question["answer"]}"]').click()
   page.locator('[data-action="submit-answer"]').click()
   page.locator('[data-action="next-question"]').click()
  check(uid+' correct six-question result',page.locator('[data-quiz-result]').count()==1)
 go('#/practice?unit=school-en-115-9-u1&n=8&seed=english-check')
 questions=page.evaluate('PracticeV2.generate(STUDY_DATA,{unitId:"school-en-115-9-u1",count:8,seed:"english-check"}).questions')
 check('finite six-question practice has no repeated filler',len(questions)==6 and len({q['id'] for q in questions})==6 and page.locator('.practice-card').count()==6)
 for index,question in enumerate(questions):
  answer=next(o['id'] for o in question['options'] if o['id']!=question['answer']) if index==0 else question['answer']
  page.locator(f'[data-ac-question="{question["id"]}"][data-ac-option="{answer}"]').click()
 page.locator('[data-ac="submit"]').click();page.wait_for_selector('.practice-summary')
 check('five correct of six graded',page.locator('.practice-summary h2').inner_text()=='5 / 6 題正確')
 page.locator('[data-ac="retry-current"]').click();page.wait_for_timeout(80)
 check('exact wrong English question retained',page.locator('.practice-card').count()==1 and page.locator('.practice-card h3').inner_text()==questions[0]['question'])
 go('#/atlas?g=9&s=english&period=114-2')
 check('historical English remains marked as unwritten',page.locator('.atlas-learning-actions').count()==0)
 for width in [320,390,768,1366]:
  page.set_viewport_size({'width':width,'height':900})
  go('#/atlas?g=8&s=english&period=115-1')
  check(f'{width}px atlas has no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  go('#/unit/school-en-115-9-u6/notes')
  check(f'{width}px English note has no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  if width==390:page.screenshot(path=str(out/'english-note-mobile.png'),full_page=False)
 check('no uncaught browser errors',not errors)
 report={'passed':len(checks),'checks':checks,'errors':errors,'mode':'isolated DOM/memory storage fixture' if isolated else 'native Chromium HTTP/localStorage'}
 (out/'english115-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 print(json.dumps(report,ensure_ascii=False,indent=2))
 browser.close()
server.shutdown()
