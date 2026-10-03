"""Native acceptance for source-scoped reading support and unchanged practice."""
from pathlib import Path
import functools, http.server, json, sys, threading, traceback
from playwright.sync_api import sync_playwright

site=Path(sys.argv[1]).resolve(); out=Path(sys.argv[2]); out.mkdir(parents=True,exist_ok=True)
checks=[]; errors=[]; requests=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(site.parent)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/{site.name}'
report={'checks':checks,'runtimeErrors':errors}
def check(name,condition):
    if not condition: raise AssertionError(name)
    checks.append(name); print('PASS '+name,flush=True)
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':390,'height':844})
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:requests.append(r.url))
        page.goto(url+'#/home',wait_until='networkidle')
        check('homepage does not download reading or exam content',not any('/content/' in r for r in requests))
        inventory=page.evaluate('STUDY_DATA.units.filter(u=>u.contentMode==="reading-guide").map(u=>({id:u.id,title:u.title,subject:u.subject,sectionId:u.catalogSectionId}))')
        coverage=page.evaluate('STUDY_DATA.readingSupport')
        check('all 74 guides have individually audited source status',len(inventory)==coverage['total']==74 and sum(coverage[k] for k in ['originalVerified','editionVerified','sourceNeeded'])==74)
        check('initial lesson metadata excludes reading bodies',page.evaluate('STUDY_DATA.units.every(u=>!u.readingSupport)'))
        saved={'app':'jh-study-notes','schemaVersion':1,'read':[inventory[0]['id']],'starred':[],'answers':{},'font':0}
        page.evaluate('(saved)=>localStorage.setItem("jh-study-notes.progress.v1",JSON.stringify(saved))',saved)
        progress=page.evaluate('localStorage.getItem("jh-study-notes.progress.v1")')
        seen={'original-verified':0,'edition-verified':0,'source-needed':0}
        for unit in inventory:
            page.evaluate('(id)=>location.hash="#/unit/"+id+"/notes"',unit['id'])
            panel=page.locator('[data-reading-support]');panel.wait_for(state='visible')
            page.wait_for_function('(sectionId)=>document.querySelector("[data-reading-support]")?.getAttribute("data-reading-support")===sectionId',arg=unit['sectionId'])
            support=page.evaluate('(id)=>STUDY_DATA.units.find(u=>u.id===id).readingSupport',unit['id'])
            seen[support['status']]+=1
            check(unit['id']+' displays exact scope and safe source links',panel.locator('[data-reading-scope]').inner_text()==support['scopeNote'] and panel.locator('[data-reading-source]').count()==len(support['sources']) and all(a.startswith('https://') for a in panel.locator('[data-reading-source]').evaluate_all('(links)=>links.map(a=>a.href)')))
            prompt=panel.locator('[data-reading-check]').first
            if prompt.count():
                prompt.locator('summary').click()
                check(unit['id']+' reveals original reading check and its evidence',prompt.locator('.experiment-content').is_visible() and support['readingChecks'][0]['basis'] in prompt.inner_text())
            page.set_viewport_size({'width':320,'height':900})
            check(unit['id']+' fits 320px',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
            page.set_viewport_size({'width':390,'height':844})
        check('rendered source statuses match honest release counts',seen=={'original-verified':coverage['originalVerified'],'edition-verified':coverage['editionVerified'],'source-needed':coverage['sourceNeeded']})
        check('reading all additions preserves fixed-question progress',page.evaluate('localStorage.getItem("jh-study-notes.progress.v1")')==progress)
        page.screenshot(path=str(out/'reading-mobile.png'),full_page=True)
        check('no reading runtime errors',not errors)
        browser.close()
except Exception:
    report['error']=traceback.format_exc();raise
finally:
    (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));server.shutdown()
