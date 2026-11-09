'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const A=require('../arena/engine.js');
const root={};vm.runInNewContext(fs.readFileSync('arena/characters.js','utf8'),{globalThis:root});
const cast=root.ArenaCharacters,list=cast.list,byId=cast.byId;
const expansion=fs.readFileSync('arena/expansion.js','utf8');
test('24 individual characters exist and are uniquely named',()=>{
 assert.equal(list.length,24);assert.equal(new Set(list.map(x=>x.id)).size,24);
 assert.equal(new Set(list.map(x=>x.name)).size,24);
 assert.equal(new Set(list.map(x=>x.title)).size,24);
});
test('each of 12 playable abilities has a complete original character identity',()=>{
 for(const card of A.REGISTRY){const c=byId[card.id];assert.ok(c,card.id);
 assert.equal(c.suit,card.suit);assert.ok(c.name.length>5);assert.ok(c.title.length>6);assert.ok(c.lore.length>15);}
});
test('expansion characters remain separated from playable engine registry',()=>{
 const pending=list.filter(x=>!A.CARDS[x.id]);
 assert.equal(pending.length,12);
 for(const c of pending){assert.match(expansion,new RegExp("id:'"+c.id+"'"));assert.equal(A.CARDS[c.id],undefined);}
});
test('24 portrait illustrations exist and contain safe standalone SVG images',()=>{
 const hashes=new Set();
 for(const c of list){
   const filepath=path.join('arena',c.portrait);
   const svg=fs.readFileSync(filepath,'utf8');
   assert.match(svg,/<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
   assert.match(svg,/<\/svg>\s*$/);
   assert.match(svg,/viewBox="0 0 360 480"/);
   assert.ok(svg.length>2500);
   assert.ok(!/\<script|\<foreignObject|href="https?:\/\/|onload\s*=/.test(svg),'Unsafe content in '+c.id);
   const imgHash=require('node:crypto').createHash('sha256').update(svg).digest('hex');
   assert.ok(!hashes.has(imgHash),'Duplicate image '+c.id);hashes.add(imgHash);
 }
});
