"""Browser smoke tests for V6. Work around restricted local URL access with a simulated storage origin."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import os, json
HTML=Path(__file__).resolve().parents[1].joinpath('index.html').read_text()
CHROME=os.getenv('BATTLEGROUND_CHROME','/usr/bin/chromium')
CHROME=CHROME if Path(CHROME).exists() else None
STORAGE="""() => {window.__items={};Object.defineProperty(window,'localStorage',{configurable:true,get(){return {getItem(k){return window.__items[k]??null},setItem(k,v){window.__items[k]=String(v)},removeItem(k){delete window.__items[k]}}}})}"""
def boot(browser,width=390):
    p=browser.new_page(viewport={'width':width,'height':844},reduced_motion='reduce')
    p.set_default_timeout(4500)
    p.evaluate(STORAGE)
    p.set_content(HTML)
    errors=[]
    p.on('pageerror',lambda e:errors.append(str(e)))
    return p,errors
def run_round(p):
    for _ in range(55):
        if p.locator('#h5-again,#h5-next').count():return
        p.locator('[data-pos]:not([disabled])').first.click()
        p.locator('[data-guess="HIGHER"]:visible').first.click()
    raise AssertionError("Round never ended")
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path=CHROME,args=['--no-sandbox'])
    p,errors=boot(browser)
    p.locator('#h5-start').click()
    assert p.locator('[data-pos]').count()==16
    p.locator('[data-pos="0"]').click()
    p.emulate_media(reduced_motion='no-preference')
    p.locator('[data-guess="HIGHER"]:visible').first.click()
    p.set_content(HTML)
    assert p.locator('#h5-resume').count()==1
    p.locator('#h5-resume').click()
    p.emulate_media(reduced_motion='reduce')
    assert p.locator('.stat b').nth(1).inner_text()=='1'
    run_round(p)
    assert p.locator('.replaygrid .minicard').count()==16
    p.locator('[data-replay="prev"]').click()
    assert 'Move' in p.locator('#h5-replay-caption').inner_text()
    assert not errors,errors
    print("PASS solo interrupted save, replay, 4×4")
    p.close()
    p,errors=boot(browser,360)
    p.locator('[data-setting="grid"][data-value="3"]').click()
    p.locator('[data-setting="blind"][data-value="true"]').click()
    p.locator('#h5-start').click()
    assert p.locator('.card3d.is-back').count()==9
    p.locator('[data-pos="0"]').click()
    assert 'HIDDEN CARD' in p.locator('.odds').inner_text()
    p.locator('[data-guess="LOWER"]:visible').first.click()
    assert p.locator('.stat b').nth(1).inner_text()=='1'
    assert not errors,errors
    print("PASS blind visibility, concealed odds, 3×3")
    p.close()
    p,errors=boot(browser,1100)
    p.locator('[data-setting="mode"][data-value="local"]').click()
    p.locator('[data-setting="grid"][data-value="3"]').click()
    p.locator('#h5-start').click()
    opening=p.locator('[data-pos]').all_inner_texts()
    run_round(p)
    p.locator('#h5-next').click()
    assert p.locator('#h5-ready').count()==1
    assert p.locator('.history').count()==0
    p.locator('#h5-ready').click()
    assert p.locator('[data-pos]').all_inner_texts()==opening
    run_round(p)
    p.locator('#h5-next').click()
    assert p.locator('#h5-rematch').count()==1
    assert not errors,errors
    print("PASS same-deck local duel and private handoff")
    p.close()
    browser.close()
