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
    assert.match(svg,/data-theme="mystic-royale"/);
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
   assert.match(svg,/id="glyph"/);
   assert.match(svg,/url\(#gilt\)/);
   if(['J','Q','K'].includes(rank))assert.match(svg,/url\(#face\)/);
   if(rank==='A')assert.match(svg,/>ACE</);
   if(/^\d+$/.test(rank)) {
     const visible=Number(rank);
     const count=(svg.match(/class="pip-placement"/g)||[]).length;
     assert.equal(count,visible,file+' wrong visible suit pip count');
   }
 }
});
test('Arena swaps only regular playing card faces; Classic originals unchanged in routing',()=>{
 assert.ok(app.includes("const image=id=>'./cards-mystic/'+A.cardCode(id)+'.svg'"));
 assert.ok(index.includes('href="./mystic-deck.css"'));
 const css=fs.readFileSync(path.join(__dirname,'..','arena','mystic-deck.css'),'utf8');
 assert.match(css,/cards-mystic\/back\.svg/);
 assert.doesNotMatch(css,/tactcard|tactical|hero-character/);
});
