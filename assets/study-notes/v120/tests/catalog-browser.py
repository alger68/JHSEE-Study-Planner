"""V2 end-to-end acceptance on a local HTTP server in GitHub Actions."""
from pathlib import Path
import json, sys, threading, http.server, functools, traceback
from playwright.sync_api import sync_playwright

site = Path(sys.argv[1]).resolve()
out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
checks, errors = [], []
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(site.parent)))
threading.Thread(target=server.serve_forever, daemon=True).start()
report = {'mode': 'Chromium HTTP with native localStorage', 'checks': checks, 'runtimeErrors': errors}
def check(name, condition):
    if not condition: raise AssertionError(name)
    checks.append(name); print('PASS ' + name, flush=True)
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1366, 'height': 960})
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(f'http://127.0.0.1:{server.server_port}/{site.name}', wait_until='domcontentloaded')
        def go(route):
            page.evaluate('(route)=>location.hash=route', route)
            page.wait_for_timeout(30)
        data = page.evaluate('STUDY_DATA')
        completion = data['catalogCompletion']
        check('V2 release has every verified section bound', data['appVersion'] == '2.0.0' and completion['locatedSections'] == 697 and completion['pendingSections'] == 0 and completion['untranscribedCourses'] == 0)
        check('original guides and external links remain', len(data['units']) == 759 and len(data['freeResources']['resources']) == 29)
        check('homepage shows navigation and honest completion labels', page.locator('.home-welcome').count() == 1 and page.locator('[data-unit-card]').count() == 0 and '閱讀導引' in page.locator('.home-meta').inner_text())
        page.screenshot(path=str(out/'home-desktop.png'))
        courses = data['atlas']['courses']
        rendered = 0
        for grade in [7, 8, 9]:
            for term in [1, 2]:
                for subject in data['subjects']:
                    go(f'#/library?g={grade}&s={subject["id"]}&term={term}')
                    expected = [s for c in courses if c['grade'] == grade and c['term'] == term and c['bucket'] == subject['id'] for s in c['sections']]
                    assert page.locator('[data-curriculum-section]').count() == len(expected)
                    assert page.locator('[data-curriculum-section] a[href$="/notes"]').count() == len(expected)
                    assert page.locator('[data-curriculum-section] a[href$="/quiz"]').count() == len(expected)
                    rendered += len(expected)
        check('all 697 catalog entries render reading and practice links in the correct semester', rendered == 697)
        go('#/library?g=7&s=chinese&term=1')
        check('literature reading guides visibly distinguish unverified full text', page.locator('.curriculum-reading-note').count() > 0 and '尚未核對本課全文' in page.locator('.curriculum-reading').first.inner_text())
        page.locator('#library-term').select_option('2')
        page.wait_for_timeout(40)
        check('semester selector keeps original 114 lower-year label', '114學年度下學期' in page.locator('#main').inner_text() and '115學年度下學期' not in page.locator('#main').inner_text())
        go('#/library?g=7&s=health&term=1')
        check('PE theme numbering and unknown PDF pages stay explicit', '非課本原課號' in page.locator('#main').inner_text() and 'PDF頁碼待版面核對' in page.locator('#main').inner_text())
        go('#/atlas?g=7&s=pe&period=115-1')
        check('atlas never claims null PDF page is an evidence page', 'PDF第null頁' not in page.locator('#main').inner_text() and 'PDF頁碼待核對' in page.locator('#main').inner_text())
        # All content renders; representative subjects exercise the existing five-tab contract.
        samples = []
        for subject in ['chinese', 'english', 'science', 'social', 'health', 'arts', 'integrated', 'technology', 'taiwanese']:
            unit = next(u for u in data['units'] if u.get('version') == '2.0.0' and u['subject'] == subject) if subject != 'english' else next(u for u in data['units'] if u.get('atlasCourseId') == '115-1-7-english')
            samples.append(unit)
        for unit in data['units']:
            go(f'#/unit/{unit["id"]}/notes')
            assert page.locator('#unit-content').inner_text().strip(), unit['id']
            assert not page.locator('#main').get_by_text('教材資料需要修正', exact=True).count(), unit['id']
        check('all 759 lesson notes render', True)
        answered = 0
        for unit in samples:
            if unit.get('contentMode') == 'reading-guide':
                go(f'#/unit/{unit["id"]}/notes')
                check('direct reading-guide links retain the full-text limitation', '尚未核對該課全文' in page.locator('.scope-note').inner_text())
            for view in ['diagrams', 'traps', 'quick', 'quiz']:
                go(f'#/unit/{unit["id"]}/{view}')
                assert page.locator('#unit-content').inner_text().strip(), unit['id'] + '/' + view
            for question in unit['quiz']:
                page.locator(f'[data-option="{question["answer"]}"]').click()
                page.locator('[data-action="submit-answer"]').click()
                assert page.locator('[data-feedback]').count() == 1
                page.locator('[data-action="next-question"]').click()
                answered += 1
            assert page.locator('.result-score').inner_text() == f'{len(unit["quiz"])} / {len(unit["quiz"])}'
        check('representative subjects finish quizzes with explanations and correct scores', answered >= 30)
        unit = next(u for u in samples if u['subject'] == 'science')
        go(f'#/practice?unit={unit["id"]}&n=8&seed=v2-release')
        check('three-question lesson is not padded to eight duplicate questions', page.locator('.practice-card').count() == 3)
        code_unit = next(u for u in data['units'] if any('\n    ' in q['question'] for q in u['quiz']))
        go(f'#/practice?unit={code_unit["id"]}&n=8&seed=code-format')
        check('code question line breaks and indentation remain readable', page.locator('.practice-card h3').evaluate_all('(elements)=>elements.some(e=>e.textContent.includes("\\n    ")&&getComputedStyle(e).whiteSpace==="pre-wrap")'))
        go(f'#/unit/{unit["id"]}/notes')
        page.locator('[data-star]').first.click(); page.reload()
        check('existing native bookmark persists across reload', page.locator('[data-star]').first.get_attribute('aria-pressed') == 'true')
        reading = next(u for u in samples if u['subject'] == 'chinese')
        for width in [320, 390, 768, 1366]:
            page.set_viewport_size({'width': width, 'height': 900})
            for route, name in [('#/home', 'home'), ('#/library?g=7&s=chinese&term=1', 'reading-catalog'), ('#/library?g=8&s=technology&term=2', 'technology-catalog'), (f'#/unit/{reading["id"]}/notes', 'reading-notes')]:
                go(route)
                check(f'{width}px {name} has no horizontal overflow', page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
                if width == 390: page.screenshot(path=str(out/f'{name}-mobile.png'))
        check('no uncaught JavaScript errors', not errors)
        report.update(passed=len(checks), failed=0, units=len(data['units']), sections=rendered, questionsAnswered=answered)
        browser.close()
except Exception as error:
    report.update(passed=len(checks), failed=1, error=str(error), traceback=traceback.format_exc())
    raise
finally:
    server.shutdown()
    (out/'catalog-browser-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps(report, ensure_ascii=False, indent=2))
