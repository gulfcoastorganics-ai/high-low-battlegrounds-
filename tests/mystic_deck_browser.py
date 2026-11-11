"""Mystic Royale asset integration and gameplay smoke tests."""
from pathlib import Path
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
server=subprocess.Popen([sys.executable,"-m","http.server","8895","--bind","127.0.0.1"],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        for width in (390,1366):
            page=browser.new_page(viewport={"width":width,"height":768})
            errors=[]
            page.on("pageerror",lambda exc:errors.append(str(exc)))
            for attempt in range(15):
                try:
                    page.goto("http://127.0.0.1:8895/arena/deck-gallery.html",wait_until="domcontentloaded",timeout=3000)
                    break
                except Exception:
                    if attempt==14:raise
                    time.sleep(.25)
            assert page.locator("#deck img").count()==52
            assert page.locator('.back-card img').count()==1
            valid=page.evaluate("""async () => {
                const paths=[...document.querySelectorAll('#deck img, .back-card img')].map(img=>img.getAttribute('src'));
                const results=await Promise.all(paths.map(async path=>{
                    const image=new Image(); image.src=path;
                    try { await image.decode(); return image.naturalWidth>0 && image.naturalHeight>0; }
                    catch(e) { return false; }
                }));
                return {count:results.length,valid:results.filter(Boolean).length};
            }""")
            assert valid=={"count":53,"valid":53},valid
            page.locator('[data-suit="H"]').click()
            assert page.locator("#deck img").count()==13
            assert page.locator("#deck img").first.get_attribute("src")=="./cards-mystic/H-A.svg"
            page.locator('[data-suit="all"]').click()
            assert page.locator("#deck img").count()==52
            page.goto("http://127.0.0.1:8895/arena/index.html",wait_until="domcontentloaded")
            page.locator('[data-act="start-cpu"]').click()
            cards=page.locator(".war-panel .play-tile img")
            assert cards.count()==32
            assert all("cards-mystic/" in src for src in cards.evaluate_all("(els)=>els.map(x=>x.getAttribute('src'))"))
            assert cards.first.evaluate("(el)=>el.complete&&el.naturalWidth>0")
            assert "cards-mystic/back.svg" in page.locator(".dealer-panel .shoe").evaluate("(el)=>getComputedStyle(el).backgroundImage")
            page.locator(".war-panel.player .play-tile.eligible").first.click()
            page.locator('[data-act="guess"][data-value="HIGHER"]').click()
            page.locator('[data-act="lock"]').click()
            page.get_by_text("THE CARD REVEALS.").wait_for()
            reveal=page.locator(".dealer-large")
            assert "cards-mystic/" in reveal.get_attribute("src")
            assert reveal.evaluate("(el)=>el.complete&&el.naturalWidth>0")
            page.locator('[data-act="continue"]').click()
            assert page.evaluate("window.ArenaApp.getState().m.turn===2")
            assert not errors,errors
            print(f"PASS Mystic Royale 53/53 images + CPU turn at {width}px")
            page.close()
        browser.close()
finally:
    server.terminate()
    try:server.wait(timeout=5)
    except subprocess.TimeoutExpired:server.kill()
