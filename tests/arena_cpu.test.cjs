'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const A=require('../arena/engine.js'),CPU=require('../arena/cpu.js');
const standard=()=>Array.from({length:52},(_,i)=>i);
function make(){const m=A.createMatch({dealer:standard()});return {m,initial:m.players[0].board.map(x=>x.card)};}
const human=m=>({idx:A.offer(m,0)[0],guess:'HIGHER'});
test('CPU provides three distinct difficulty configurations',()=>{
 assert.deepEqual(Object.keys(CPU.DIFFICULTIES),['casual','standard','expert']);
 assert.ok(CPU.DIFFICULTIES.casual.mistake>CPU.DIFFICULTIES.standard.mistake);
 assert.ok(CPU.DIFFICULTIES.standard.mistake>CPU.DIFFICULTIES.expert.mistake);
});
test('CPU public odds exclude known cards and never use the hidden dealer',()=>{
 const {m,initial}=make();
 const o=CPU.oddsFor(0,initial,[],m.round);
 assert.equal(o.total,36);
 assert.equal(o.HIGHER+o.LOWER+o.tie,1);
 const o2=CPU.oddsFor(0,initial,[{round:'arena',draw:16}],m.round);
 assert.equal(o2.total,35);
 assert.equal(CPU.oddsFor(0,initial,[{round:'sudden',draw:16}],m.round).total,36);
 assert.throws(()=>CPU.oddsFor(0,[],[],m.round));
});
test('CPU cannot act before the player locks a decision',()=>{
 const {m,initial}=make();
 assert.throws(()=>CPU.choose(m,{initialBoard:initial}),/own commitment turn/);
});
test('CPU never reads future dealer or human committed prediction',()=>{
 const {m,initial}=make();
 A.commit(m,0,human(m));
 const originalDealer=m.dealer,originalCommits=m.commits;
 Object.defineProperty(m,'dealer',{configurable:true,get(){throw Error('CHEATED: future dealer accessed');}});
 m.commits=new Proxy(originalCommits,{get(t,prop){if(prop==='0')throw Error('CHEATED: human commitment accessed');return Reflect.get(t,prop);}});
 const move=CPU.choose(m,{difficulty:'expert',initialBoard:initial,rng:()=>.42});
 assert.equal(A.inspectMove(m,1,move),'');
 m.commits=originalCommits;
 Object.defineProperty(m,'dealer',{configurable:true,value:originalDealer,writable:true});
 A.commit(m,1,move);
 assert.equal(m.history.length,1);
});
test('CPU decisions do not change when only future dealer ordering changes',()=>{
 const x=make(),y=make();
 [y.m.dealer[16],y.m.dealer[51]]=[y.m.dealer[51],y.m.dealer[16]];
 y.m.players[1].hand=x.m.players[1].hand.slice();
 y.m.players[1].drawPile=x.m.players[1].drawPile.slice();
 A.commit(x.m,0,human(x.m));A.commit(y.m,0,human(y.m));
 const opts={difficulty:'expert',initialBoard:x.initial,rng:()=>.23};
 assert.deepEqual(CPU.choose(x.m,opts),CPU.choose(y.m,opts));
});
test('CPU respects Focus and target validity across all difficulty levels',()=>{
 for(const difficulty of Object.keys(CPU.DIFFICULTIES)){
   const {m,initial}=make();A.commit(m,0,human(m));
   const move=CPU.choose(m,{difficulty,initialBoard:initial,rng:()=>.54});
   assert.equal(A.inspectMove(m,1,move),'',difficulty);
   if(move.cardId)assert.ok(m.players[1].focus>=A.price(m,1,move.cardId));
 }
});
test('CPU stops using tactical abilities during sudden death',()=>{
 const {m,initial}=make();m.round='sudden';m.turn=1;m.maxTurns=3;
 A.commit(m,0,human(m));
 const move=CPU.choose(m,{difficulty:'expert',initialBoard:initial,rng:()=>.22});
 assert.equal(move.cardId,null);
 assert.equal(A.inspectMove(m,1,move),'');
});
test('CPU never uses human private hand or opponent choice even with different cards',()=>{
 const x=make(),y=make();
 x.m.players[0].hand=['irongrip'];y.m.players[0].hand=['precision','precision','reserve'];
 y.m.players[1].hand=x.m.players[1].hand.slice();
 y.m.players[1].drawPile=x.m.players[1].drawPile.slice();
 A.commit(x.m,0,{idx:0,guess:'LOWER'});
 A.commit(y.m,0,{idx:0,guess:'HIGHER'});
 const options={difficulty:'expert',initialBoard:x.initial,rng:()=>.6};
 assert.deepEqual(CPU.choose(x.m,options),CPU.choose(y.m,options));
});
test('250 full solo matches resolve with legal CPU actions, no stalled games',()=>{
 const levels=Object.keys(CPU.DIFFICULTIES);
 let total=0,completed=0,sudden=0;
 for(let game=0;game<250;game++){
   const source=standard();const rot=game%52;
   const d=source.map((_,i)=>source[(i+rot)%52]);
   const m=A.createMatch({dealer:d}),difficulty=levels[game%3];
   let initial=m.players[0].board.map(x=>x.card),steps=0;
   while(m.phase!=='finished'){
     if(++steps>28)throw Error('Stalled match '+game);
     if(m.phase==='intermission'){
       A.continueSuddenDeath(m);initial=m.players[0].board.map(x=>x.card);sudden++;
     }
     A.commit(m,0,{idx:A.offer(m,0)[0],guess:game%2?'HIGHER':'LOWER'});
     const move=CPU.choose(m,{difficulty,initialBoard:initial,rng:()=>.425});
     assert.equal(A.inspectMove(m,1,move),'');
     A.commit(m,1,move);
   }
   assert.ok(m.result);assert.ok(m.result.winner===0||m.result.winner===1||m.result.winner===null);
   total+=m.history.length;completed++;
 }
 assert.equal(completed,250);
 assert.ok(total>=250);
});
