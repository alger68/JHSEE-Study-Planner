"""Final V1.9 integration test. Default: native HTTP/localStorage; --isolated: explicit fixture only."""
from pathlib import Path
import json,sys,os,threading,http.server,functools,traceback
from playwright.sync_api import sync_playwright
site=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
isolated='--isolated' in sys.argv
checks=[];errors=[];server=None
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
def check(name,ok):
 if not ok: raise AssertionError(name)
 checks.append(name);print('PASS '+name,flush=True)
if not isolated:
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)))
 threading.Thread(target=server.serve_forever,daemon=True).start()
mode='isolated HTML DOM with explicit memory-storage fixture; NOT native persistence or HTTP' if isolated else 'Chromium HTTP with native localStorage'
report={'mode':mode,'checks':checks,'runtimeErrors':errors,'coverage':{}}
try:
 with sync_playwright() as p:
  opts={'headless':True,'args':['--no-sandbox']}
  if isolated or os.getenv('CHROMIUM_PATH'):opts['executable_path']=os.getenv('CHROMIUM_PATH','/usr/bin/chromium')
  b=p.chromium.launch(**opts);ctx=b.new_context(viewport={'width':1366,'height':960},accept_downloads=True)
  page=ctx.new_page();page.set_default_timeout(10000);page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
  if isolated:
   page.evaluate('()=>{const d={};Object.defineProperty(window,"localStorage",{value:{getItem:k=>d[k]??null,setItem:(k,v)=>d[k]=String(v),removeItem:k=>delete d[k],clear:()=>Object.keys(d).forEach(k=>delete d[k])}})}')
   page.set_content(site.read_text(),wait_until='domcontentloaded')
  else:page.goto(f'http://127.0.0.1:{server.server_port}/{site.name}',wait_until='domcontentloaded')
  def go(h):
   page.evaluate('(h)=>location.hash=h',h);page.wait_for_timeout(25)
  check('final build loaded with real 169/988 totals',page.evaluate('STUDY_DATA.appVersion==="1.9.0"&&STUDY_DATA.units.length===169&&STUDY_DATA.units.reduce((n,u)=>n+u.quiz.length,0)===988'))
  check('homepage is navigation, not a pile of lesson cards',page.locator('[data-unit-card]').count()==0)
  check('homepage links to free resources',page.locator('#main a[href="#/resources"]').count()==1)
  page.screenshot(path=str(out/'home-desktop.png'))
  go('#/resources')
  check('resource route renders 29 cards',page.locator('[data-resource-id]').count()==29)
  check('resources retain completion distinction','外部連結不計入教材完成率' in page.locator('#main').inner_text())
  check('external anchors are HTTPS and rel-protected',page.locator('[data-resource-id] a').evaluate_all('(es)=>es.every(e=>e.hasAttribute("data-free-chapter") ? e.getAttribute("href").startsWith("#/atlas?")&&!e.target : e.href.startsWith("https://")&&e.target==="_blank"&&e.rel.includes("noopener")&&e.rel.includes("noreferrer"))'))
  check('no external media auto-embedded',page.locator('iframe,video').count()==0)
  check('lotus resources show login warning','登入觀看' in page.locator('[data-resource-id="j-lotus-overview"]').inner_text())
  check('failed resource retrieval remains explicit','讀取未成功' in page.locator('[data-resource-id="m-online-safety"]').inner_text())
  page.screenshot(path=str(out/'resources-desktop.png'))
  page.locator('[data-resource-id="m-photo"] [data-free-chapter]').first.click();page.wait_for_timeout(60)
  check('resource backlink opens the matching school chapter map',page.locator('[data-atlas-section="115-1-7-biology/3-3"]').count()==1)
  go('#/resources')
  page.locator('#free-filter-form input[name=q]').fill('愛蓮說');page.locator('#free-filter-form button').click();page.wait_for_timeout(60)
  check('resource filtering acts on titles without creating lessons',page.locator('[data-resource-id="j-lotus-overview"]').count()==1 and page.locator('[data-resource-id]').count()==4)
  go('#/resources?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E')
  check('filter text escaped and empty state usable',page.locator('[data-resource-id]').count()==0 and page.locator('#main img').count()==0 and '沒有資源' in page.locator('#main').inner_text())
  go('#/atlas?g=8&s=chinese&period=115-1')
  lotus=page.locator('[data-atlas-section="115-1-8-chinese/4"]')
  check('lotus gets three exact-topic resources but no fake local quiz',lotus.locator('.free-section-resources').count()==1 and lotus.locator('.atlas-learning-actions').count()==0)
  lotus.locator('.free-section-resources summary').click();check('lotus three links displayed',lotus.locator('[data-resource-id]').count()==3)
  for cid,n in [('114-1-8-history',6),('114-1-8-health',7),('114-1-9-health',9)]:
   _,_,g,s=cid.split('-');go(f'#/atlas?g={g}&s={s}&period=114-1')
   check(cid+' full chapter navigation and local exercises',page.locator('.atlas-learning-actions').count()==n)
   check(cid+' original year visible','114-1' in page.locator('.atlas-course-head').inner_text())
  go('#/atlas?g=8&s=history&period=115-1')
  check('missing current history offers explicit old-year choice, no silent switch',page.locator('.free-alternatives').count()==1 and '114-1' in page.locator('.free-alternatives').inner_text() and page.locator('.atlas-learning-actions').count()==0)
  go('#/atlas?g=9&s=health&period=114-1');page.screenshot(path=str(out/'health-atlas-desktop.png'))
  go('#/unit/bio-3-3/notes')
  check('existing photosynthesis note has resource panel',page.locator('[data-unit-resources]').count()==1 and page.locator('[data-resource-id="m-photo"]').count()==1)
  go('#/unit/atlas-bio-5-3/notes')
  check('endocrine chapter never fuzzy-matched to photosynthesis',page.locator('[data-resource-id="m-photo"]').count()==0)
  go('#/unit/hist114-1-9-health-3-1/notes');page.locator('.free-source-note summary').click()
  check('old PDF PM2.5 discrepancy visible','氣體污染物' in page.locator('.free-source-note').inner_text() and '不同' in page.locator('.free-source-note').inner_text())
  go('#/unit/hist114-1-9-health-1-2/notes');page.locator('.free-source-note summary').click()
  check('old shape-title alias and adult threshold limitation explicit','我型我塑' in page.locator('.free-source-note').inner_text() and '未成年人' in page.locator('.free-source-note').inner_text())
  ids=page.evaluate('STUDY_DATA.units.map(u=>u.id)')
  # Validate that every existing and new content view remains renderable.
  newset=set(page.evaluate('STUDY_DATA.units.filter(u=>u.integrationBatch==="free-20260930").map(u=>u.id)'))
  viewed=0
  for uid in ids:
   for tab in (['notes','diagrams','traps','quick','quiz'] if uid in newset else ['notes']):
    go(f'#/unit/{uid}/{tab}')
    assert page.locator('#unit-content').inner_text().strip(),uid+'/'+tab
    viewed+=1
    assert not page.locator('#main').get_by_text('教材資料需要修正',exact=True).count(),uid
  check('all 169 units readable; all 22 added units render five tabs (257 views)',viewed==257);report['coverage']['renderedUnitTabs']=viewed
  newids=page.evaluate('STUDY_DATA.units.filter(u=>u.integrationBatch==="free-20260930").map(u=>u.id)')
  for uid in newids:
   go(f'#/unit/{uid}/quiz');qs=page.evaluate('(id)=>STUDY_DATA.units.find(u=>u.id===id).quiz',uid)
   for q in qs:
    page.locator(f'[data-option="{q["answer"]}"]').click();page.locator('[data-action="submit-answer"]').click();page.locator('[data-action="next-question"]').click()
   check(uid+' all six questions reach correctly scored final result',page.locator('[data-quiz-result]').count()==1 and page.locator('.result-score').inner_text()=='6 / 6')
  report['coverage']['newLocalQuestionsAnswered']=len(newids)*6
  uid='hist114-1-8-health-1-1';go(f'#/practice?unit={uid}&n=8&seed=health-fixture')
  qs=page.evaluate('(id)=>PracticeV2.generate(STUDY_DATA,{unitId:id,count:8,seed:"health-fixture"}).questions',uid)
  check('six fixed questions do not repeat to fill eight',len(qs)==6 and len(set(q['question'] for q in qs))==6 and page.locator('.practice-card').count()==6)
  for i,q in enumerate(qs):
   answer=next(o['id'] for o in q['options'] if o['id']!=q['answer']) if i==0 else q['answer']
   page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{answer}"]').click()
  page.locator('[data-ac="submit"]').click();page.wait_for_selector('.practice-summary')
  check('new health practice scored 5/6',page.locator('.practice-summary h2').inner_text()=='5 / 6 題正確')
  check('new mistake snapshot validates against current data',page.evaluate('PracticeV2.validateState(JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")),STUDY_DATA).mistakes.length')==1)
  page.locator('[data-ac="retry-current"]').click();page.wait_for_timeout(60)
  check('retry preserves the actual original question',page.locator('.practice-card h3').inner_text()==qs[0]['question'])
  q=qs[0];page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{q["answer"]}"]').click();page.locator('[data-ac="submit"]').click();page.wait_for_timeout(60)
  check('correct retry clears mistake',page.evaluate('JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")).mistakes.length')==0)
  before=page.evaluate('localStorage.getItem("jh-study-notes.practice.v2")')
  with page.expect_download() as dl:page.locator('[data-ac="export"]').click()
  backup=out/'practice-backup.json';dl.value.save_as(backup)
  check('backup export is valid JSON',json.loads(backup.read_text())['app']=='jh-study-practice')
  page.locator('#practice-import').set_input_files(backup);page.wait_for_timeout(90)
  restored=page.evaluate('JSON.parse(localStorage.getItem("jh-study-notes.practice.v2"))')
  original=json.loads(before)
  check('exported backup reimports without deleting history and concept stats',restored['history']==original['history'] and restored['conceptStats']==original['conceptStats'])
  go('#/unit/bio-3-3/notes');page.locator('[data-star]').first.click();go('#/resources');go('#/unit/bio-3-3/notes')
  check('existing note bookmark survives route changes',page.locator('[data-star]').first.get_attribute('aria-pressed')=='true')
  # Explicitly distinguish a native reload check from a memory fixture route check.
  if not isolated:
   page.reload();check('native bookmark persists across reload',page.locator('[data-star]').first.get_attribute('aria-pressed')=='true')
  for w in [320,390,768,1366]:
   page.set_viewport_size({'width':w,'height':900})
   for h,name in [('#/home','home'),('#/resources','resources'),('#/atlas?g=8&s=health&period=114-1','health-map'),('#/unit/hist114-1-9-health-2-2/notes','health-notes')]:
    go(h);check(f'{w}px {name} no horizontal document overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
    if w==390:
     page.wait_for_timeout(2200);page.screenshot(path=str(out/f'{name}-mobile.png'))
  page.set_viewport_size({'width':1366,'height':960});go('#/unit/hist114-1-9-health-2-2/notes');page.screenshot(path=str(out/'health-notes-desktop.png'))
  check('no uncaught JavaScript errors',not errors)
  report.update(passed=len(checks),failed=0)
  b.close()
except Exception as exc:
 report.update(passed=len(checks),failed=1,error=str(exc),traceback=traceback.format_exc());raise
finally:
 if server:server.shutdown()
 (out/'free-integration-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 print(json.dumps(report,ensure_ascii=False,indent=2))
