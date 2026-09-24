"""Home/catalog regression. CI uses HTTP + native storage; --isolated is explicitly a local fixture."""
from pathlib import Path
import json,sys,threading,http.server,functools,os
from playwright.sync_api import sync_playwright
site=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
isolated='--isolated' in sys.argv;checks=[];errors=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/{site.name}'
def check(name,value):
 assert value,name
 checks.append(name)
with sync_playwright() as p:
 kwargs={'headless':True,'args':['--no-sandbox']}
 if Path('/usr/bin/chromium').exists():kwargs['executable_path']='/usr/bin/chromium'
 browser=p.chromium.launch(**kwargs);ctx=browser.new_context(viewport={'width':1366,'height':950},accept_downloads=True);page=ctx.new_page();page.set_default_timeout(10000)
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
 if isolated:
  page.evaluate('()=>{const data={};Object.defineProperty(window,"localStorage",{value:{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=String(v),removeItem:k=>delete data[k]}})}')
  page.set_content(site.read_text())
 else:page.goto(base)
 def go(h):page.evaluate('(h)=>location.hash=h',h);page.wait_for_timeout(70)
 page.wait_for_selector('[data-view="home"]')
 check('fresh homepage has no chapter inventory',page.locator('#main .unit-card').count()==0)
 check('homepage offers three grades',page.locator('[data-grade-entry]').count()==3)
 check('homepage offers all eleven subject entries',page.locator('[data-subject-entry]').count()==11)
 check('fresh homepage does not pin biology topics','植物如何製造養分' not in page.locator('#main').inner_text() and '植物體內物質的運輸' not in page.locator('#main').inner_text())
 check('fresh continue-learning section is empty',page.locator('.home-empty').count()==1)
 check('no wrong questions means disabled shortcut',page.locator('[data-ac="home-wrong"]').is_disabled())
 page.screenshot(path=str(out/'home-desktop.png'),full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(out/'home-mobile.png'),full_page=True);page.set_viewport_size({'width':1366,'height':950})
 page.locator('[data-grade-entry="7"]').focus();page.keyboard.press('Enter');page.wait_for_selector('[data-view="library"]')
 check('grade entry opens dedicated catalog', '#/library' in page.evaluate('location.hash'))
 check('grade selection requires subject',page.locator('.unit-card').count()==0 and page.locator('[data-subject-entry]').count()==11)
 page.locator('[data-subject-entry="science"]').click();page.wait_for_selector('.unit-card')
 check('seven-upper science shows exactly its six readable materials',page.locator('.unit-card').count()==6 and page.locator('[data-catalog-count]').inner_text()=='目前篩選：6份教材')
 titles=page.locator('.unit-card h3').all_text_contents()
 check('biology chapter cards remain in catalog and are ordered',titles.index('物質進出細胞的方式')<titles.index('植物如何製造養分')<titles.index('植物體內物質的運輸'))
 check('chapter coverage gaps remain visible', '尚無本節專題' in page.locator('.catalog-status').inner_text())
 page.screenshot(path=str(out/'catalog-desktop.png'),full_page=False)
 if not isolated:
  page.go_back();page.wait_for_selector('[data-subject-entry]');check('browser back restores subject choice',page.locator('.unit-card').count()==0)
  page.go_forward();page.wait_for_selector('.unit-card');check('browser forward restores catalog filters',page.locator('.unit-card').count()==6)
  page.reload();page.wait_for_selector('.unit-card');check('direct catalog reload retains selected scope',page.locator('#library-grade').input_value()=='7' and page.locator('#library-subject').input_value()=='science')
 before=page.evaluate('localStorage.getItem("jh-study-notes.progress.v1")')
 page.locator('.unit-grid a[href="#/unit/bio-3-3/notes"]').first.click();page.wait_for_selector('[data-view="unit"]')
 check('opening a lesson does not change old answers or read state',page.evaluate('localStorage.getItem("jh-study-notes.progress.v1")')==before)
 check('lesson back link preserves grade term and subject',page.locator('.back-link').get_attribute('href')=='#/library?g=7&term=1&s=science')
 page.locator('[data-star]').first.click();page.locator('[data-action="read"]').click()
 saved=page.evaluate('localStorage.getItem("jh-study-notes.progress.v1")')
 go('#/home');page.wait_for_selector('[data-view="home"]')
 check('actual opened lesson appears in continue-learning',page.locator('[data-recent-unit="bio-3-3"]').count()==1)
 check('unopened biology topic is not recommended',page.locator('[data-recent-unit="bio-4-2"]').count()==0)
 if not isolated:
  page.reload();page.wait_for_selector('[data-view="home"]')
  check('recent reading survives native reload',page.locator('[data-recent-unit="bio-3-3"]').count()==1)
 check('old bookmarks and answers preserved while returning home',page.evaluate('localStorage.getItem("jh-study-notes.progress.v1")')==saved)
 page.locator('[data-subject-entry="math"]').click();page.wait_for_selector('[data-view="library"]')
 check('subject shortcut asks grade rather than assuming seven',page.locator('[data-grade-entry]').count()==3 and page.locator('.unit-card').count()==0)
 page.locator('[data-grade-entry="8"]').click();page.wait_for_selector('.unit-card')
 check('math grade-eight course has its three scoped guides',page.locator('.unit-card').count()==3)
 page.select_option('#library-term','2');page.wait_for_timeout(100)
 check('changing semester stays in catalog', '#/library?' in page.evaluate('location.hash') and page.locator('.unit-card').count()==1)
 go('#/home?g=7&term=all&s=science');page.wait_for_selector('[data-view="library"]')
 check('old filtered-home URL still resolves to seven science materials',page.locator('.unit-card').count()==7)
 if not isolated:check('old URL visibly canonicalized', '#/library?' in page.url)
 go('#/subject/science?g=9&term=1');page.wait_for_selector('[data-view="library"]')
 check('old subject link preserves grade-nine scope',page.locator('#library-grade').input_value()=='9' and page.locator('.unit-card').count()==3)
 go('#/unit/bio-3-3/quiz');page.wait_for_selector('[data-option]')
 for _ in range(5):
  page.locator('[data-option]').first.click();page.locator('[data-action="submit-answer"]').click();page.locator('[data-action="next-question"]').click()
 check('original biology quiz still completes final question',page.locator('[data-quiz-result]').count()==1)
 # Native persisted valid mistake snapshots from two subjects, not a mocked score.
 page.evaluate('''()=>{let s=PracticeV2.newState();for(const id of ['math-8-1','bio-3-3']){const q=PracticeV2.generate(STUDY_DATA,{unitId:id,count:1,seed:'home-regression'}).questions[0];s=PracticeV2.record(s,q,q.options.find(o=>o.id!==q.answer).id);}localStorage.setItem('jh-study-notes.practice.v2',JSON.stringify(s));}''')
 # Reinitialize actual application to read the injected valid saved state.
 go('#/home')
 if isolated:page.set_content(site.read_text())
 else:page.reload()
 page.wait_for_selector('[data-view="home"]')
 check('home uses real saved wrong-question count',page.locator('[data-wrong-count]').inner_text()=='2')
 page.locator('[data-ac="home-wrong"]').click();page.wait_for_selector('.practice-card')
 check('home wrong shortcut opens actual two-question retry deck',page.locator('.practice-card').count()==2 and page.locator('#main h1').inner_text()=='錯題原題重練')
 qs=page.evaluate('JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")).mistakes.map(x=>x.q)')
 check('cross-subject wrong snapshots preserved',page.locator('.practice-card h3').all_text_contents()==[q['question'] for q in qs])
 if not isolated:
  page.reload();page.wait_for_selector('.practice-card')
  check('home wrong retry survives native reload',page.locator('.practice-card').count()==2)
 for q in qs:page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{q["answer"]}"]').click()
 page.locator('[data-ac="submit"]').click();page.wait_for_selector('.practice-summary')
 check('home-launched wrong retry scores correctly',page.locator('.practice-summary h2').inner_text()=='2 / 2 題正確')
 go('#/home');page.wait_for_selector('[data-view="home"]')
 check('correct retry clears home count',page.locator('[data-wrong-count]').inner_text()=='0' and page.locator('[data-ac="home-wrong"]').is_disabled())
 for width in [320,390,768,1366]:
  page.set_viewport_size({'width':width,'height':900})
  for route in ['#/home','#/library?g=7&term=1&s=science']:
   go(route)
   check(f'{width}px {route} no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  if width==390:
   go('#/home');page.screenshot(path=str(out/'home-mobile-with-history.png'),full_page=True)
   go('#/library?g=7&term=1&s=science');page.screenshot(path=str(out/'catalog-mobile.png'),full_page=False)
 page.set_viewport_size({'width':320,'height':900});go('#/home');page.locator('[data-action="font"]').click();page.locator('[data-action="font"]').click()
 check('large-text mobile home remains within viewport',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
 go('#/library?g=7&term=1&s=science');check('large-text mobile catalog remains within viewport',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
 check('no uncaught runtime errors',not errors)
 browser.close()
server.shutdown()
report={'passed':len(checks),'failed':0,'checks':checks,'errors':errors,'mode':'isolated DOM + memory storage fixture' if isolated else 'Chromium HTTP + native localStorage'}
(out/'home-navigation-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
