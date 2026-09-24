"""Native HTTP by default; --isolated is explicitly a DOM/storage-fixture fallback."""
from pathlib import Path
import sys,re,json,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
html_path=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
isolated='--isolated' in sys.argv;checks=[];errors=[]
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(html_path.parent),**kw)
 def log_message(self,*a):pass
server=socketserver.TCPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_address[1]}/{html_path.name}'
def check(name,value):
 assert value,name
 checks.append(name);print("PASS",name,flush=True)
with sync_playwright() as p:
 args={'headless':True}
 if isolated:args.update(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 browser=p.chromium.launch(**args);context=browser.new_context(viewport={'width':1366,'height':900},accept_downloads=True)
 def load(old=None,hashval='#/exam?g=7&term=1&s=math'):
  payload=old.evaluate('JSON.stringify(window.__memoryStore||{})') if old and isolated else '{}'
  if old:old.close()
  page=context.new_page();page.set_default_timeout(10000)
  page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
  if isolated:
   page.evaluate('raw=>{window.__memoryStore=JSON.parse(raw);Object.defineProperty(window,"localStorage",{value:{getItem:k=>window.__memoryStore[k]??null,setItem:(k,v)=>{window.__memoryStore[k]=String(v)},removeItem:k=>{delete window.__memoryStore[k]}}})}',payload)
   page.evaluate('v=>location.hash=v',hashval);page.set_content(html_path.read_text())
  else:page.goto(base+hashval)
  return page
 page=load();page.wait_for_selector('[data-exam-unit]')
 page.select_option('#exam-grade','8');page.wait_for_timeout(120)
 check('exam grade change refreshes selectable units',page.locator('[data-exam-unit]').first.input_value()=='math-8-1')
 page.select_option('#exam-grade','7');page.wait_for_timeout(100)
 page.locator('[data-exam-unit]').first.check();page.select_option('#exam-count','40');page.locator('[data-ac="exam-build"]').click();page.wait_for_selector('[data-ac="exam-start"]')
 exam_hash=page.evaluate('location.hash')
 check('exam offers full-paper answering',page.locator('[data-ac="exam-start"]').count()==1)
 page.locator('[data-ac="exam-start"]').click();page.wait_for_selector('#practice-questions .practice-card')
 check('40-question exam enters full answering flow',page.locator('#practice-questions .practice-card').count()==40)
 stems=page.locator('#practice-questions h3').all_text_contents()
 for i in range(5):page.locator('#practice-questions .practice-card').nth(i).locator('[data-ac-option]').first.click()
 session_key='jh-study-notes.practice.v2.session'
 session=page.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',session_key)
 check('pending answers saved',len(session['selections'])==5 and not session['submitted'])
 practice_hash=page.evaluate('location.hash');page=load(page,practice_hash);page.wait_for_selector('#practice-questions .practice-card')
 check('reload retains identical paper and five selections',page.locator('#practice-questions h3').all_text_contents()==stems and page.locator('[data-ac-option][aria-pressed="true"]').count()==5)
 for i in range(40):page.locator('#practice-questions .practice-card').nth(i).locator('[data-ac-option]').first.click()
 page.locator('[data-ac="submit"]').click();page.wait_for_selector('.practice-summary')
 state=page.evaluate('JSON.parse(localStorage.getItem("jh-study-notes.practice.v2"))')
 check('40-question result persisted',state['history'][-1]['total']==40)
 check('40-question record valid after reload',page.evaluate('PracticeV2.validateState(JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")),STUDY_DATA).history.slice(-1)[0].total')==40)
 page=load(page,practice_hash);page.wait_for_selector('.practice-summary')
 check('submitted state restored, not silently reset',page.locator('.practice-summary').count()==1)
 with page.expect_download() as d:page.locator('[data-ac="export"]').click()
 d.value.save_as(out/'progress-backup.json')
 check('export includes 40-question history',json.loads((out/'progress-backup.json').read_text())['history'][-1]['total']==40)
 page.locator('[data-ac="retry-current"]').click();page.wait_for_timeout(100)
 retry_stems=page.locator('#practice-questions h3').all_text_contents();page=load(page,practice_hash);page.wait_for_selector('#practice-questions')
 check('wrong-question snapshot survives reload',retry_stems==page.locator('#practice-questions h3').all_text_contents() and not page.locator('.practice-summary').count())
 page=load(page,exam_hash);page.wait_for_selector('[data-ac="exam-print"]');page.evaluate('window.__prints=0;window.print=()=>{window.__prints++};void 0')
 page.locator('[data-ac="exam-print"]').click()
 check('exam printing fills dedicated print container',page.locator('#print-root .print-question').count()==40 and page.evaluate('window.__prints')==1)
 page.screenshot(path=str(out/'exam-desktop.png'),full_page=False)
 page.locator('[data-ac="exam-start"]').click();page.wait_for_selector('#practice-questions');page.locator('[data-ac="new"]').first.click();page.wait_for_timeout(100)
 check('new paper preserves complete exam scope and count',len(page.evaluate('new URLSearchParams(location.hash.split("?")[1]).get("exam")') or '')>0 and page.locator('#practice-questions .practice-card').count()==40)
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(out/'practice-mobile.png'),full_page=False)
 check('390px no document overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
 check('no page runtime errors',not errors)
 browser.close()
server.shutdown()
report={'passed':len(checks),'checks':checks,'runtimeErrors':errors,'mode':'isolated DOM with storage fixture' if isolated else 'native Chromium via HTTP with real localStorage'}
(out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
