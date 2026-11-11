"""Arena Combat Workstation V5 visual and interaction smoke checks.
Requires playwright chromium. Logs bounding rectangles to diagnose viewport fit.
"""
import subprocess
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
server=subprocess.Popen([sys.executable,"-m","http.server","8896","--bind","127.0.0.1"],
                        cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        for width in (320,390,768,1024,1120,1366,1600):
            page=browser.new_page(viewport={"width":width,"height":768},device_scale_factor=1)
            errors=[]
            page.on("pageerror",lambda err:errors.append(str(err)))
            for attempt in range(15):
                try:
                    page.goto("http://127.0.0.1:8896/arena/index.html",wait_until="domcontentloaded",timeout=3500)
                    break
                except Exception:
                    if attempt==14:raise
                    time.sleep(.25)
            page.locator('[data-act="start-cpu"]').click()
            assert page.locator(".arena-match-shell").count()==1
            assert page.locator(".turn-tactic").count()==1
            assert page.locator(".turn-steps .turn-step").count()==3
            assert page.locator(".hand-cards .tactcard").count()>=3
            assert page.locator(".turn-tactic").get_attribute("data-selected-tactic")=="none"
            stage=page.locator(".arena-stage").bounding_box()
            controls=page.locator(".action-dock").bounding_box()
            hand=page.locator(".hand-shell").bounding_box()
            if width>=1120:
                assert page.locator(".hand-cards").evaluate("(el)=>getComputedStyle(el).display")=="grid"
                assert controls["x"]>=stage["x"]+stage["width"]-4, f"Controls not beside battlefield {width}px"
                assert hand["x"]>=controls["x"]+controls["width"]-4, f"Tactical rail not beside controls {width}px"
                assert not page.locator(".match-quick-nav").is_visible()
                bottom=max(stage["y"]+stage["height"],controls["y"]+controls["height"],hand["y"]+hand["height"])
                print(f"Desktop layout {width}px: stage={stage['height']:.0f}, controls={controls['height']:.0f}, hand={hand['height']:.0f}, lowest={bottom:.0f}/768")
                if width>=1366:
                    assert bottom<=768, f"Workstation falls below one desktop viewport: {width}px lowest={bottom}"
            else:
                assert page.locator(".match-quick-nav").is_visible()
                page.locator('[data-act="jump-hand"]').click()
                page.locator('[data-act="jump-board"]').click()
                page.locator('[data-act="jump-controls"]').click()
            assert page.evaluate("document.documentElement.scrollWidth-window.innerWidth")<=2, f"Horizontal overflow at {width}px"
            # The selected champion must be visible in the dedicated tactical preview.
            page.locator(".tactcard:not([disabled])").first.click()
            selected=page.locator(".turn-tactic").get_attribute("data-selected-tactic")
            assert selected and selected!="none"
            assert page.locator(".turn-tactic .tactic-identity img").count()==1
            assert page.locator(".turn-tactic .tactic-focus").inner_text().find("FOCUS")!=-1
            page.locator('.turn-tactic [data-act="clear"]').click()
            assert page.locator(".turn-tactic").get_attribute("data-selected-tactic")=="none"
            # A standard prediction should show position -> odds -> confirmation.
            page.locator(".war-panel.player .play-tile.eligible").first.click()
            assert page.locator(".turn-tactic .tactic-target").inner_text().startswith("TERRITORY")
            assert "CHOOSE HIGHER OR LOWER" in page.locator(".tactic-next").inner_text().upper()
            page.locator('[data-act="guess"][data-value="HIGHER"]').click()
            assert page.locator(".turn-steps .turn-step.is-complete").count()>=2
            assert page.locator('[data-act="lock"]').is_enabled()
            page.locator('[data-act="lock"]').click()
            page.get_by_text("THE CARD REVEALS.").wait_for()
            assert page.evaluate("window.ArenaApp.getState().m.history.length===1")
            page.locator('[data-act="continue"]').click()
            assert page.evaluate("window.ArenaApp.getState().m.turn===2")
            assert not errors,errors
            print(f"PASS V5 combat workstation {width}px")
            page.close()
        browser.close()
finally:
    server.terminate()
    try:server.wait(timeout=5)
    except subprocess.TimeoutExpired:server.kill()
