"""Browser regression for Play vs CPU (separate from local hotseat tests)."""
from pathlib import Path
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
PORT=8897
server=subprocess.Popen([sys.executable,'-m','http.server',str(PORT),'--bind','127.0.0.1'],
                        cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)

def check_turn(page):
    assert page.evaluate("window.ArenaApp.getState().mode === 'cpu'")
    page.locator('.war-panel.player .play-tile.eligible').first.click()
    page.locator('[data-act="guess"][data-value="HIGHER"]').click()
    page.locator('[data-act="lock"]').click()
    assert page.locator('[data-act="ready"]').count()==0, 'Solo mode incorrectly showed a handoff screen'
    assert page.evaluate("window.ArenaApp.getState().m.next !== 1"), 'CPU did not finish its own turn'

try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        for width in (320,390,768,1366):
            page=browser.new_page(viewport={'width':width,'height':850})
            errors=[]
            page.on('pageerror',lambda exc: errors.append(str(exc)))
            for attempt in range(15):
                try:
                    page.goto(f'http://127.0.0.1:{PORT}/arena/index.html',wait_until='domcontentloaded',timeout=3000)
                    break
                except Exception:
                    if attempt==14:raise
                    time.sleep(.3)
            assert page.locator('[data-act="start-cpu"]').count()==1
            assert page.locator('[data-act="start"]').count()>=1
            page.locator('#cpu-difficulty').select_option('expert' if width>=768 else 'casual')
            page.locator('[data-act="start-cpu"]').click()
            assert page.evaluate("window.ArenaApp.getState().m.players[1].name.startsWith('CPU')")
            assert page.evaluate("window.ArenaApp.getState().cpuInitial.length === 16")
            check_turn(page)
            page.get_by_text('THE CARD REVEALS.').wait_for()
            assert page.evaluate("window.ArenaApp.getState().m.history.length===1")
            assert page.evaluate("window.ArenaApp.getState().m.last.detail.length===2")
            page.locator('[data-act="continue"]').click()
            assert page.evaluate("window.ArenaApp.getState().m.turn===2")
            check_turn(page)
            assert page.evaluate("window.ArenaApp.getState().m.history.length===2")
            if width==390:
                # Play through the end of the match, including sudden death if necessary.
                for _ in range(26):
                    state=page.evaluate("({phase:window.ArenaApp.getState().m.phase,overlay:window.ArenaApp.getState().overlay})")
                    if state['overlay']=='finish':break
                    if state['overlay']=='sudden':
                        page.locator('[data-act="sudden"]').click()
                    elif state['overlay']=='reveal':
                        page.locator('[data-act="continue"]').click()
                    if page.evaluate("window.ArenaApp.getState().m.phase==='finished'"):break
                    if page.evaluate("window.ArenaApp.getState().m.phase==='intermission'"):continue
                    check_turn(page)
                assert page.evaluate("window.ArenaApp.getState().m.phase==='finished'")
                assert page.locator('[data-act="rematch"]').count()==1
                page.locator('[data-act="rematch"]').click()
                assert page.evaluate("window.ArenaApp.getState().mode==='cpu'")
                assert page.evaluate("window.ArenaApp.getState().m.turn===1")
                assert page.evaluate("window.ArenaApp.getState().m.history.length===0")
            assert not errors,errors
            if width<=390:
                horizontal=page.evaluate('document.documentElement.scrollWidth - innerWidth')
                assert horizontal<=2,f'CPU UI mobile overflow at {width}px: {horizontal}px'
            print(f'PASS CPU solo browser: {width}px')
            page.close()
        browser.close()
finally:
    server.terminate()
    try:server.wait(timeout=5)
    except subprocess.TimeoutExpired:server.kill()
