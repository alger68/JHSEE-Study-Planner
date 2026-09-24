import json, pathlib, sys
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
FIXTURE='--fixture' in sys.argv
BASE='https://example.com/' if FIXTURE else (sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8765/')
checks=[]
(ROOT/'evidence').mkdir(parents=True,exist_ok=True)
def ok(name,condition):
    assert condition,name
    checks.append(name)
with sync_playwright() as p:
    launch={'headless':True}
    if pathlib.Path('/usr/bin/chromium').exists():launch['executable_path']='/usr/bin/chromium'
    browser=p.chromium.launch(**launch)
    context=browser.new_context(viewport={'width':1400,'height':950})
    if FIXTURE: context.route('https://example.com/**',lambda route:route.fulfill(status=200,content_type='text/html',body=(ROOT/'site/index.html').read_text()))
    page=context.new_page(); errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
    page.goto(BASE);page.locator('[data-view="library"]').wait_for()
    ok('完整來源載入72指南',page.evaluate('STUDY_DATA.units.length')==72)
    ok('舊add-on已移除',not page.evaluate("document.documentElement.innerHTML.includes('PRACTICE_ADDON_V110')"))
    ok('官方31格版本',page.evaluate('Object.values(STUDY_DATA.versions.mapping).flat().filter(Boolean).length')==31)
    page.screenshot(path=str(ROOT/'evidence/desktop-home.png'),full_page=True)
    page.select_option('#library-grade','9');page.select_option('#library-subject','science');
    ok('九年級自然篩選含新增專題',page.locator('[data-unit-card]').count()==page.evaluate("STUDY_DATA.units.filter(u=>u.grade===9&&u.subject==='science').length"))
    ok('九年級南一版本',all('南一' in t for t in page.locator('.unit-card-body').all_text_contents()))
    page.goto(BASE+'#/unit/math-8-1/notes');page.locator('[data-concept-card]').first.wait_for();ok('每本六重點',page.locator('[data-concept-card]').count()==6)
    page.locator('[data-star]').first.click();page.reload();page.locator('.star-btn.saved').wait_for();ok('收藏跨重載保存',page.locator('.star-btn.saved').count()==1)
    page.screenshot(path=str(ROOT/'evidence/math-notes.png'),full_page=True)
    page.goto(BASE+'#/unit/arts-7-1/diagrams');page.locator('.table-scroll').wait_for();ok('非自然不顯示空白實驗區',page.locator('.experiments').count()==0)
    page.goto(BASE+'#/practice?unit=math-8-1&n=8&seed=browser');page.locator('.practice-card').first.wait_for();
    stems=page.locator('.practice-card h3').all_text_contents();ok('變化卷有8題無重複',len(stems)==8 and len(set(stems))==8)
    qdata=page.evaluate("PracticeV2.generate(STUDY_DATA,{unitId:'math-8-1',count:8,seed:'browser'}).questions")
    for i,q in enumerate(qdata):
        selected=next(o['id'] for o in q['options'] if o['id']!=q['answer']) if i==0 else q['answer']
        page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{selected}"]').click()
    page.locator('[data-ac="submit"]').click();ok('完成交卷與解析', '7 / 8' in page.locator('.practice-summary').inner_text() and page.locator('.practice-explanation').count()==8)
    page.screenshot(path=str(ROOT/'evidence/practice-result.png'),full_page=True)
    ok('錯題快照保存',page.evaluate("JSON.parse(localStorage.getItem('jh-study-notes.practice.v2')).mistakes.length")==1)
    ok('交卷後錯題按鈕立即可用',page.locator('[data-ac="wrong"]').is_enabled())
    page.locator('[data-ac="wrong"]').click();ok('錯題只重練原題',page.locator('.practice-card').count()==1 and page.locator('.practice-card h3').inner_text()==qdata[0]['question'])
    q=qdata[0];page.locator(f'[data-ac-question="{q["id"]}"][data-ac-option="{q["answer"]}"]').click();page.locator('[data-ac="submit"]').click()
    ok('答對移出錯題',page.evaluate("JSON.parse(localStorage.getItem('jh-study-notes.practice.v2')).mistakes.length")==0)
    page.goto(BASE+'#/practice?g=7&s=arts&term=1&n=20&seed=limited');page.locator('.practice-card').first.wait_for();ok('有限題庫不灌重複題',page.locator('.practice-card').count()==6)
    page.goto(BASE+'#/practice?g=9&s=taiwanese&term=1&n=8&seed=no');ok('未列九年級本土語不改成別科', '此範圍尚無' in page.locator('#main').inner_text())
    page.goto(BASE+'#/versions');page.locator('[data-view="versions"]').wait_for();ok('版本矩陣11科',page.locator('tbody tr').count()==11);page.screenshot(path=str(ROOT/'evidence/versions.png'),full_page=True)
    page.goto(BASE+'#/unit/bio-3-3/quiz');page.locator('[data-option]').first.wait_for()
    for _ in range(5):
        page.locator('[data-option]').first.click();page.locator('[data-action="submit-answer"]').click();page.locator('[data-action="next-question"]').click()
    ok('原有生物最後一題可完成',page.locator('[data-quiz-result]').count()==1)
    page.goto(BASE+'#/practice');page.locator('#practice-import').wait_for(state='attached');before=page.evaluate("localStorage.getItem('jh-study-notes.practice.v2')")
    page.locator('#practice-import').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{"app":"wrong"}'})
    page.wait_for_timeout(150);ok('無效備份不覆寫',before==page.evaluate("localStorage.getItem('jh-study-notes.practice.v2')"))
    with page.expect_download() as download:page.locator('[data-ac="export"]').click()
    file=download.value.path();backup=json.loads(pathlib.Path(file).read_text());ok('可下載合法備份',backup['app']=='jh-study-practice')
    page.locator('#practice-import').set_input_files(file);page.wait_for_timeout(150);ok('有效備份匯入', '備份無效' not in page.locator('#notice').inner_text())
    for width in [360,390,768]:
        page.set_viewport_size({'width':width,'height':844});page.goto(BASE+'#/home');page.locator('[data-view="library"]').wait_for()
        ok(f'{width}px首頁無橫向溢位',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
        if width==390:page.screenshot(path=str(ROOT/'evidence/mobile-home.png'),full_page=True)
        page.goto(BASE+'#/practice?g=9&s=math&term=2&n=8&seed=mobile');page.locator('.practice-card').first.wait_for()
        ok(f'{width}px練習無橫向溢位',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
    ok('所有流程無JS例外',not errors)
    browser.close()
(ROOT/'evidence/browser-report.json').write_text(json.dumps({'checks':checks,'errors':errors},ensure_ascii=False,indent=2))
print(f'PASS: {len(checks)} browser checks; mode={"fixture" if FIXTURE else "HTTP"}; Chromium desktop/mobile emulation')
