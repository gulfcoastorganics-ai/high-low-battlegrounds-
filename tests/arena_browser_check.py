"""Browser smoke tests for the standalone Arena. Run: python tests/arena_browser_check.py"""
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
server = subprocess.Popen(
    [sys.executable, "-m", "http.server", "8898", "--bind", "127.0.0.1"],
    cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width in (320, 390, 768, 1366):
            page = browser.new_page(viewport={"width": width, "height": 850}, device_scale_factor=1)
            problems = []
            page.on("pageerror", lambda err: problems.append(str(err)))
            for attempt in range(20):
                try:
                    page.goto("http://127.0.0.1:8898/arena/index.html", wait_until="domcontentloaded", timeout=3000)
                    break
                except Exception:
                    if attempt == 19:
                        raise
                    time.sleep(0.3)
            page.get_by_text("RULE THE ARENA.").wait_for()
            assert page.locator(".hero-character img").count() == 4
            assert page.locator('.hero-character[data-character="precision"] img').get_attribute("src").endswith("precision.webp")
            assert page.locator('.hero-character[data-character="heartward"] img').get_attribute("src").endswith("heartward.webp")
            assert page.locator('.hero-character[data-character="reserve"] img').get_attribute("src").endswith("reserve.webp")
            assert page.locator('.hero-character[data-character="rooted"] img').get_attribute("src").endswith("rooted.webp")
            page.wait_for_function("Array.from(document.querySelectorAll('.hero-character img')).every(img => img.complete && img.naturalWidth > 0)")
            assert page.evaluate("Object.keys(window.ArenaCharacters.byId).length") == 24
            page.locator('.hero-character[data-id="precision"]').click()
            page.locator(".inspect-modal").get_by_text("The Glass-Eyed Marshal").wait_for()
            assert page.locator(".inspect-visual img").count() == 1
            assert page.locator(".inspect-visual img").evaluate("(img) => img.complete && img.naturalWidth > 0")
            page.locator('[data-act="close-inspect"]').click()
            if width == 390:
                page.locator('[data-act="builder"][data-player="0"]').click()
                page.get_by_text("THE DECK FORGE").wait_for()
                assert page.locator(".builder-collection .builder-row").count() == 24
                assert page.locator(".builder-portrait").count() == 24
                page.locator('.builder-inspect[data-id="heartward"]').click()
                page.locator(".inspect-modal").get_by_text("The Scarlet Bastion").wait_for()
                page.locator('[data-act="close-inspect"]').click()
                assert page.get_by_text("THE DECK FORGE").count() == 1
                page.locator('[data-act="close"]').click()
            page.locator('[data-act="start"]').first.click()
            assert page.locator(".tactcard .tc-art img").count() >= 3
            page.locator(".tactcard-inspect").first.click()
            assert page.locator(".inspect-modal").count() == 1
            page.locator('[data-act="close-inspect"]').click()
            page.locator(".war-panel.player .play-tile.eligible").first.click()
            page.locator('[data-act="guess"][data-value="HIGHER"]').click()
            page.locator('[data-act="lock"]').click()
            page.get_by_text("PASS THE TABLE.").wait_for()
            assert page.locator(".tactcard").count() == 0
            assert page.get_by_text("THE TABLE IS SEALED").count() == 1
            assert page.evaluate("window.ArenaApp.getState().m.last === null")
            page.locator('[data-act="ready"]').click()
            page.locator(".war-panel.player .play-tile.eligible").first.click()
            page.locator('[data-act="guess"][data-value="LOWER"]').click()
            page.locator('[data-act="lock"]').click()
            page.get_by_text("THE CARD REVEALS.").wait_for()
            assert page.evaluate("window.ArenaApp.getState().m.history.length === 1")
            page.locator('[data-act="continue"]').click()
            assert page.evaluate("window.ArenaApp.getState().m.turn === 2")
            assert page.locator(".war-panel.player .play-tile").count() == 16
            assert page.locator(".war-panel.enemy .play-tile").count() == 16
            assert not problems, problems
            if width in (320, 390):
                horizontal = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                assert horizontal <= 2, "Mobile horizontal overflow: %s px" % horizontal
            print("PASS: Arena browser %spx" % width)
            page.close()
        browser.close()
finally:
    server.terminate()
    try:
        server.wait(timeout=5)
    except subprocess.TimeoutExpired:
        server.kill()
