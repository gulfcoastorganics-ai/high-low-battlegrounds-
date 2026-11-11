'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const base=path.join(__dirname,'..','arena','cards-mystic');
const suits=['S','H','D','C'];
const ranks=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const app=fs.readFileSync(path.join(__dirname,'..','arena','app.js'),'utf8');
const index=fs.readFileSync(path.join(__dirname,'..','arena','index.html'),'utf8');
test('complete mystic deck has exactly 52 unique playing faces and one dealer back',()=>{
  const files=fs.readdirSync(base).filter(f=>f.endsWith('.svg'));
  assert.equal(files.length,53);
  const expected=[...suits.flatMap(s=>ranks.map(r=>s+'-'+r+'.svg')),'back.svg'];
  assert.deepEqual(files.sort(),expected.sort());
  const seen=new Set();
  for(const file of files){
    const svg=fs.readFileSync(path.join(base,file),'utf8');
    assert.match(svg,/<svg[^>]+viewBox="0 0 240 336"/);
    assert.match(svg,/<\/svg>\s*$/);
    assert.match(svg,/data-theme="mystic-royale-v3"/);
    assert.doesNotMatch(svg,/<script\b|<foreignObject\b|\sonload=|\sonerror=|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i);
    assert.ok(svg.length>2500,file+' image unexpectedly small');
    let hash=crypto.createHash('sha256').update(svg).digest('hex');
    assert.ok(!seen.has(hash),'duplicate illustration '+file);seen.add(hash);
  }
});
test('suits/ranks and Ace/court card art are readable and correctly labeled',()=>{
 const suitName={S:'Spades',H:'Hearts',D:'Diamonds',C:'Clubs'};
 for(const suit of suits)for(const rank of ranks){
   const file=suit+'-'+rank+'.svg',svg=fs.readFileSync(path.join(base,file),'utf8');
   assert.ok(svg.includes('data-card="'+suit+'-'+rank+'"'));
   assert.ok(svg.includes('data-rank="'+rank+'"'));
   assert.ok(svg.includes('data-suit="'+suit+'"'));
   assert.ok(svg.includes('of '+suitName[suit]),file);
   assert.match(svg,/id="suit"/);
   assert.match(svg,/url\(#gold\)/);
   if(['J','Q','K'].includes(rank)){ assert.match(svg,/<image\b[^>]*href="data:image\/webp;base64,/); assert.match(svg,/clip-path="url\(#portraitClip\)"/); }
   if(rank==='A')assert.match(svg,/aria-label="ACE of/);
   if(/^\d+$/.test(rank)) {
     const visible=Number(rank);
     const count=(svg.match(/class="royal-pip"/g)||[]).length-2;
     assert.equal(count,visible,file+' wrong visible suit pip count');
   }
 }
});
test('Arena swaps only regular playing card faces; Classic originals unchanged in routing',()=>{
 assert.ok(app.includes("const image=id=>'./cards-mystic/'+A.cardCode(id)+'.svg'"));
 assert.ok(index.includes('href="./mystic-deck.css"'));
 const css=fs.readFileSync(path.join(__dirname,'..','arena','mystic-deck.css'),'utf8');
 assert.match(css,/cards-mystic\/back\.svg/);
 assert.ok(!css.includes('.tactcard') && !css.includes('.hero-character'));
});

test('court portraits embed distinct premium illustrations, with no runtime fetches',()=>{
 const images=new Set();
 for(const suit of suits)for(const rank of ['J','Q','K']){
  const svg=fs.readFileSync(path.join(base,suit+'-'+rank+'.svg'),'utf8');
  const found=svg.match(/href="data:image\/webp;base64,([A-Za-z0-9+/=]+)"/);
  assert.ok(found,suit+'-'+rank+' needs an embedded portrait');
  const bytes=Buffer.from(found[1],'base64');
  assert.ok(bytes.length>10000,'Portrait too small');
  assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF');
  images.add(crypto.createHash('sha256').update(bytes).digest('hex'));
 }
 assert.equal(images.size,12,'Each illustrated royal portrait must be unique');
});

test('all card corners use contrast-backed rank plaques',()=>{
 for(const suit of suits)for(const rank of ranks){
  const svg=fs.readFileSync(path.join(base,suit+'-'+rank+'.svg'),'utf8');
  assert.equal((svg.match(/class="corner-index"/g)||[]).length,2,suit+'-'+rank);
  assert.match(svg,/id="indexBg"/);
  assert.match(svg,/<text[^>]+font-size="(?:43|54)"/);
 }
});
test('all court portraits share a large consistent framed picture window',()=>{
 for(const suit of suits)for(const rank of ['J','Q','K']){
  const svg=fs.readFileSync(path.join(base,suit+'-'+rank+'.svg'),'utf8');
  assert.match(svg,/<image x="41" y="76" width="158" height="190"/);
  assert.match(svg,/<rect x="41" y="76" width="158" height="190" rx="10" fill="url\(#portraitFade\)"/);
  assert.match(svg,/font-size="22" font-weight="bold"/);
  assert.ok(svg.length<185000,'Overlarge court SVG '+suit+'-'+rank);
 }
});
test('numbered pip positions are distinct and do not overlap at native size',()=>{
 for(const suit of suits)for(let rank=2;rank<=10;rank++){
  const svg=fs.readFileSync(path.join(base,suit+'-'+rank+'.svg'),'utf8');
  const matches=[...svg.matchAll(/class="royal-pip" transform="translate\((\d+) (\d+)\) rotate\((\d+)\) scale\(([.\d]+)\)"/g)];
  assert.equal(matches.length,rank+2,suit+'-'+rank);
  const spots=matches.slice(0,rank).map(m=>({x:+m[1],y:+m[2],scale:+m[4]}));
  for(let i=0;i<spots.length;i++)for(let j=i+1;j<spots.length;j++){
    const a=spots[i],b=spots[j],d=Math.hypot(a.x-b.x,a.y-b.y);
    assert.ok(d >= (a.scale+b.scale)*39-1,suit+'-'+rank+' overlapping pips '+i+','+j);
  }
 }
});
