from pathlib import Path
import json, os, sys, threading, http.server, functools
from playwright.sync_api import sync_playwright
site=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)))
threading.Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/{site.name}'
checks=[];issues=[]
def check(name,fn):
 try:fn();checks.append(name)
 except Exception as exc:issues.append({'name':name,'error':str(exc)[:900]})
def eq(a,b):assert a==b,(a,b)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox'],executable_path=os.environ.get('CHROMIUM_PATH'))
 ctx=browser.new_context(viewport={'width':1366,'height':960},accept_downloads=True);page=ctx.new_page();errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept());page.goto(url);page.wait_for_timeout(100)
 def go(h):page.evaluate('(h)=>location.hash=h',h);page.wait_for_timeout(50)
 check('V1.5.0 loaded',lambda:eq(page.evaluate('window.STUDY_DATA.appVersion'),'1.5.0'))
 check('72 readable units',lambda:eq(page.evaluate('window.STUDY_DATA.units.length'),72))
 ids=page.evaluate('window.STUDY_DATA.units.map(u=>u.id)')
 def scan():
  for uid in ids:
   for tab in ['notes','diagrams','traps','quiz','quick']:
    go('#/unit/'+uid+'/'+tab)
    assert page.locator('#unit-content').inner_text().strip(),uid+'/'+tab
    assert not page.locator('#main').get_by_text('教材資料需要修正',exact=True).count(),uid
 check('every unit and all five tabs render',scan)
 go('#/exam?g=7&term=1&s=science&n=10');check('exam range selector visible',lambda: page.locator('[data-exam-unit]').count()>=1)
 for cb in page.locator('[data-exam-unit]').all():cb.check()
 page.locator('[data-ac="exam-build"]').click();page.wait_for_timeout(80)
 check('exam paper builds selected scope',lambda: page.locator('section.panel ol li').count()>0)
 go('#/practice/versions');check('legacy version URL works',lambda:eq(page.locator('[data-view="versions"]').count(),1))
 go('#/practice?unit=math-7-1&n=8&seed=unfinished');page.locator('[data-ac-option]').first.click()
 go('#/practice?unit=math-7-2&n=8&seed=other');go('#/practice?unit=math-7-1&n=8&seed=unfinished')
 check('unfinished deck does not auto-submit on return',lambda:eq(page.locator('[data-ac="submit"]').count(),1))
 page.locator('[data-ac="new"]').first.click();page.wait_for_timeout(80)
 check('new deck preserves explicit unit scope',lambda:eq('unit=math-7-1' in page.url,True))
 go('#/practice?unit=math-7-1&n=8&seed=acceptance-flow')
 qs=page.evaluate('PracticeV2.generate(STUDY_DATA,{unitId:"math-7-1",count:8,seed:"acceptance-flow"}).questions')
 for i,q in enumerate(qs):
  oid=next(o['id'] for o in q['options'] if o['id']!=q['answer']) if i==0 else q['answer']
  page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{oid}"]').click()
 page.locator('[data-ac="submit"]').click();page.wait_for_timeout(80)
 check('eight question submit',lambda:eq(page.locator('.practice-summary h2').inner_text(),'7 / 8 題正確'))
 check('exact mistake snapshot saved',lambda:eq(page.evaluate('JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")).mistakes[0].q.question'),qs[0]['question']))
 page.locator('[data-ac="retry-current"]').click();page.wait_for_timeout(80)
 check('retry contains one mistake',lambda:eq(page.locator('.practice-card').count(),1))
 q=qs[0];page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{q["answer"]}"]').click();page.locator('[data-ac="submit"]').click();page.wait_for_timeout(80)
 check('correct retry removes mistake',lambda:eq(page.evaluate('JSON.parse(localStorage.getItem("jh-study-notes.practice.v2")).mistakes.length'),0))
 with page.expect_download() as dl:page.locator('[data-ac="export"]').click()
 backup=out/'practice-backup.json';dl.value.save_as(backup)
 check('export valid JSON',lambda:eq(json.loads(backup.read_text())['app'],'jh-study-practice'))
 before=page.evaluate('localStorage.getItem("jh-study-notes.practice.v2")')
 page.locator('#practice-import').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{"app":"evil"}'});page.wait_for_timeout(100)
 check('invalid import preserves old state',lambda:eq(page.evaluate('localStorage.getItem("jh-study-notes.practice.v2")'),before))
 go('#/unit/bio-3-3/notes');page.locator('[data-star]').first.click();page.locator('[data-action="read"]').click();page.reload();page.wait_for_timeout(100)
 check('legacy bookmarks persist',lambda:eq(page.locator('[data-star]').first.get_attribute('aria-pressed'),'true'))
 go('#/practice?unit=math-7-1&n=8&seed=print');page.evaluate('window.print=()=>window.__printed=true');page.locator('[data-ac="print"]').click()
 check('eight printable questions',lambda:eq(page.locator('#print-root .print-question').count(),8))
 check('print invoked',lambda:eq(page.evaluate('window.__printed'),True))
 go('#/practice?g=9&term=1&s=hakka');check('no invented ninth grade local-language course',lambda:eq(page.locator('#main h1').inner_text(),'此範圍尚無可用試卷'))
 for width in [320,390,768,1366]:
  page.set_viewport_size({'width':width,'height':900});go('#/home?g=9&term=1&s=all')
  check(f'home width {width}',lambda:eq(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),True))
  go('#/practice?g=8&term=1&s=science&n=8&seed=mobile')
  check(f'practice width {width}',lambda:eq(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),True))
  if width in [390,1366]:page.screenshot(path=str(out/f'practice-{width}.png'),full_page=False)
  if width==768:
   ys=page.locator('#mobile-nav a').evaluate_all('(els)=>els.map(e=>Math.round(e.getBoundingClientRect().y))')
   check('tablet bottom nav single row',lambda:eq(len(set(ys)),1))
 page.set_viewport_size({'width':1366,'height':960});go('#/home?g=7&term=1&s=all');page.screenshot(path=str(out/'desktop-home.png'),full_page=False)
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(out/'mobile-home.png'),full_page=False)
 check('no uncaught script errors',lambda:eq(errors,[]))
 fp=ctx.new_page();fp.goto(site.as_uri());fp.wait_for_timeout(80)
 check('standalone HTML opens without server',lambda:eq(fp.locator('[data-view="home"]').count(),1));fp.close();browser.close()
server.shutdown();result={'passed':len(checks),'failed':len(issues),'checks':checks,'issues':issues};(out/'browser-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False,indent=2));sys.exit(bool(issues))
