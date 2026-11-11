"""Create a visual preview from the ACTUAL game card assets, not from concept art."""
from pathlib import Path
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/tmp/mystic-royale-cinematic-preview.png')
server=subprocess.Popen([sys.executable,'-m','http.server','8894','--bind','127.0.0.1'],
                        cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
cards=['S-K','H-Q','D-K','C-Q','S-A','H-4','D-9','C-10']
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        page=browser.new_page(viewport={'width':1060,'height':770},device_scale_factor=1)
        for attempt in range(12):
            try:
                page.goto('http://127.0.0.1:8894/arena/deck-gallery.html',wait_until='domcontentloaded',timeout=3000)
                break
            except Exception:
                if attempt==11:raise
                time.sleep(.2)
        page.evaluate("""cards => {
            const style=document.createElement('style');
            style.textContent='body{margin:0;background:radial-gradient(ellipse at top,#30207a,#130e35 60%,#08091c);color:#fcebc7;font-family:Georgia,serif} #preview{width:1040px;margin:0 auto;padding:24px;box-sizing:border-box}h1{font-size:34px;margin:4px 0 6px;text-align:center;letter-spacing:4px}p{text-align:center;font:12px Arial,sans-serif;color:#cfc1e8;margin:0 0 23px}.samples{display:grid;grid-template-columns:repeat(4,1fr);gap:17px;justify-items:center}.sample{margin:0;text-align:center;width:181px}.sample img{display:block;width:181px;height:auto;filter:drop-shadow(0 10px 10px #000a)}.sample figcaption{font-size:15px;color:#ffe4b3;letter-spacing:1px;margin-top:8px}';
            document.head.appendChild(style);
            document.body.innerHTML='<div id="preview"><h1>MYSTIC ROYALE · CINEMATIC</h1><p>REAL, IN-GAME SVG CARD ASSETS · 12 ILLUSTRATED COURT CARDS · JEWELED PIPS · NO MOCKUPS</p><div class="samples">'+cards.map(s=>'<figure class="sample"><img src="./cards-mystic/'+s+'.svg" alt="'+s+'"><figcaption>'+s+'</figcaption></figure>').join('')+'</div></div>';
        }""",cards)
        count=page.evaluate("""async () => {
            const imgs=[...document.querySelectorAll('#preview img')];
            return (await Promise.all(imgs.map(i=>i.decode().then(()=>i.naturalWidth>0).catch(()=>false)))).filter(Boolean).length
        }""")
        assert count==8, f'Some preview assets failed to load: {count}/8'
        page.screenshot(path=str(OUT),full_page=True,animations='disabled')
        print('Captured 8/8 real game asset samples at '+str(OUT))
        browser.close()
finally:
    server.terminate()
    try:server.wait(timeout=5)
    except subprocess.TimeoutExpired:server.kill()
