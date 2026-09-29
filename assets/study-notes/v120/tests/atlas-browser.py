"""Atlas acceptance. CI uses real HTTP/localStorage; --isolated uses a labelled local DOM fixture."""
from pathlib import Path
import functools,http.server,threading,json,sys,os
from playwright.sync_api import sync_playwright
site=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True);isolated='--isolated' in sys.argv
checks=[];errors=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)));threading.Thread(target=server.serve_forever,daemon=True).start()
def check(name,condition):
 assert condition,name
 checks.append(name)
with sync_playwright() as p:
 options={'headless':True,'args':['--no-sandbox']}
 if isolated or os.getenv('CHROMIUM_PATH'):options['executable_path']=os.getenv('CHROMIUM_PATH','/usr/bin/chromium')
 b=p.chromium.launch(**options);ctx=b.new_context(viewport={'width':1366,'height':960},accept_downloads=True);page=ctx.new_page();page.set_default_timeout(10000);page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
 if isolated:
  page.evaluate('()=>{const x={};Object.defineProperty(window,"localStorage",{value:{getItem:k=>x[k]??null,setItem:(k,v)=>x[k]=String(v),removeItem:k=>delete x[k]}})}');page.set_content(site.read_text())
 else:page.goto(f'http://127.0.0.1:{server.server_port}/{site.name}')
 def go(h):page.evaluate('(h)=>location.hash=h',h);page.wait_for_timeout(90)
 check('V190 curriculum loaded',page.evaluate('STUDY_DATA.appVersion')=='1.9.0')
 check('home is still navigation, not fixed chapter cards',page.locator('[data-view="home"]').count()==1 and page.locator('[data-unit-card]').count()==0)
 check('home provides atlas entry',page.locator('.atlas-home a[href="#/atlas"]').count()==1)
 page.screenshot(path=str(out/'home-desktop.png'),full_page=False)
 page.locator('.atlas-home a').click();page.wait_for_selector('[data-view="atlas"]')
 check('all 22 current biology sections have notes',page.locator('[data-atlas-section]').count()==22 and page.locator('.atlas-learning-actions').count()==22)
 check('current biology does not inherit old exam references',page.evaluate('STUDY_DATA.atlas.courses.find(c=>c.id==="115-1-7-biology").sections.every(s=>s.evidence.length===0)'))
 page.screenshot(path=str(out/'atlas-biology-desktop.png'),full_page=False)
 page.locator('.atlas-registry > summary').click()
 check('source registry includes 103 plans',page.locator('.atlas-registry tbody tr').count()==103)
 check('source registry includes 40 exam papers',page.locator('.atlas-registry [data-paper-id]').count()==40)
 with page.expect_download() as dl:page.locator('[data-atlas-export]').click()
 dest=out/'atlas-export.json';dl.value.save_as(dest);d=json.loads(dest.read_text());check('export exact 143 unique sources',len({s['sourceId'] for s in d['courses']+d['exams']})==143)
 page.select_option('#atlas-grade','8');page.wait_for_timeout(100)
 check('invalid biology-grade pairing requests a choice instead of silently changing subject',page.locator('#atlas-subject').input_value()=='')
 page.select_option('#atlas-subject','math');page.wait_for_timeout(100);page.select_option('#atlas-period','114-2');page.wait_for_timeout(100)
 check('historical grade eight math has 12 sections',page.locator('[data-atlas-section]').count()==12)
 check('historical lessons now bind only to adopted 114 notes',page.locator('.atlas-learning-actions').count()==12 and page.evaluate('STUDY_DATA.atlas.courses.find(c=>c.id==="114-2-8-math").sections.every(s=>s.unitId.startsWith("hist114-"))'))
 check('21 actual question records shown independently of range',page.locator('.atlas-stats').inner_text().endswith('21\n已定位的歷屆實際題號'))
 page.locator('[data-atlas-section="114-2-8-math/3-2"] summary').click()
 check('3-2 exam records retain page and question number','題1' in page.locator('[data-atlas-section="114-2-8-math/3-2"]').inner_text())
 page.screenshot(path=str(out/'atlas-history-desktop.png'),full_page=False)
 go('#/atlas?g=8&s=history&period=114-2');page.locator('.atlas-paper-list [data-paper-id="1IyRF_yDq4Yg31aM-kK3BCA0Eo0VEBw4A"] > summary').click()
 check('contradictory book numbers shown and not silently merged','範圍衝突' in page.locator('.atlas-paper-list').inner_text())
 check('conflicted historical range creates no section evidence',page.evaluate('STUDY_DATA.atlas.courses.find(c=>c.id==="114-2-8-history").sections.every(s=>s.evidence.every(e=>e.round!==2))'))
 go('#/atlas?g=9&s=english&period=114-2');page.locator('.atlas-paper-list [data-paper-id="1_pQpySF_oySBmCVAf0NmFnlL7fJ-DhS4"] > summary').click()
 check('English whole-book vs narrow answer range conflict retained','Unit3–Review2' in page.locator('.atlas-paper-list').inner_text())
 go('#/atlas?g=7&s=biology&period=115-2');check('unpublished period does not fall back','篩選條件無效' in page.locator('#main').inner_text())
 go('#/atlas?g=7&s=biology&period=115-1')
 page.locator('[data-atlas-section="115-1-7-biology/3-2"] .atlas-learning-actions a').first.click();page.wait_for_selector('[data-view="unit"]')
 check('new lesson opens real notes and source trail',page.locator('#unit-content').inner_text().find('專一性')>=0 and page.locator('.atlas-unit-trail a').count()==1)
 page.locator('.atlas-unit-trail a').click();page.wait_for_selector('[data-view="atlas"]')
 page.locator('[data-atlas-section="115-1-7-biology/3-2"] .atlas-learning-actions a').nth(1).click();page.wait_for_selector('[data-option]')
 quiz=page.evaluate('STUDY_DATA.units.find(u=>u.id==="atlas-bio-3-2").quiz')
 for q in quiz:
  page.locator(f'[data-option="{q["answer"]}"]').click();page.locator('[data-action="submit-answer"]').click();page.locator('[data-action="next-question"]').click()
 check('six-question section quiz reaches result',page.locator('[data-quiz-result]').count()==1)
 check('new authored quiz correct grading',page.evaluate('Object.values(JSON.parse(localStorage.getItem("jh-study-notes.progress.v1")).answers).length')==6)
 for uid in page.evaluate('STUDY_DATA.units.filter(u=>u.id.startsWith("atlas-bio-")).map(u=>u.id)'):
  go('#/unit/'+uid+'/notes');assert page.locator('[data-concept-card]').count()==3,uid
 check('all 17 new lessons render three concepts',True)
 go('#/practice?unit=atlas-bio-1-2&n=8&seed=atlas-test');check('six-question fixed pool not repeated to fill eight',page.locator('.practice-card').count()==6)
 qs=page.evaluate('PracticeV2.generate(STUDY_DATA,{unitId:"atlas-bio-1-2",count:8,seed:"atlas-test"}).questions')
 for i,q in enumerate(qs):
  selected=next(o['id'] for o in q['options'] if o['id']!=q['answer']) if i==0 else q['answer']
  page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{selected}"]').click()
 page.locator('[data-ac="submit"]').click();page.wait_for_selector('.practice-summary');check('new practice grades five correct of six','5 / 6' in page.locator('.practice-summary').inner_text())
 page.locator('[data-ac="retry-current"]').click();page.wait_for_timeout(100);check('actual wrong question snapshot restored',page.locator('.practice-card').count()==1 and page.locator('.practice-card h3').inner_text()==qs[0]['question'])
 page.locator(f'[data-ac-question="{qs[0]["id"]}"][data-ac-option="{qs[0]["answer"]}"]').click();page.locator('[data-ac="submit"]').click();page.wait_for_timeout(100)
 check('correct retry clears mistake',page.evaluate('JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")).mistakes.length')==0)
 for w in [320,390,768,1366]:
  page.set_viewport_size({'width':w,'height':900});go('#/atlas?g=7&s=biology&period=115-1');check(str(w)+'px atlas no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  if w==390:page.screenshot(path=str(out/'atlas-mobile.png'),full_page=False)
  go('#/home');check(str(w)+'px home still no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
 check('all flows without script exceptions',not errors)
 report={'passed':len(checks),'checks':checks,'errors':errors,'mode':'isolated DOM/memory storage fixture' if isolated else 'native Chromium / HTTP / real localStorage'}
 (out/'atlas-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2));b.close()
server.shutdown()
