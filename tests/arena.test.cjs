(function arenaTests(){
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),A=require('../arena/engine.js');
const deck=()=>Array.from({length:52},(_,i)=>i);
const newMatch=()=>A.createMatch({dealer:deck()});
function pair(m,a,b){A.commit(m,0,a);return A.commit(m,1,b);}
function open(m,player=0,guess='HIGHER'){return {idx:A.offer(m,player)[0],guess};}
test('all 52 standard cards have 13 ranks, ace high, all unique',()=>{
 assert.equal(A.rank(12),14);assert.equal(A.rank(0),2);
 assert.equal(A.cardCode(0),'C-2');assert.equal(A.cardCode(51),'S-A');
 assert.equal(new Set(A.shuffle(deck())).size,52);
 assert.equal(A.compare(0,1,'HIGHER'),true);
 assert.equal(A.compare(3,16,'HIGHER'),false);
 assert.equal(A.compare(3,16,'LOWER'),false);
});
test('starter decks are valid and 12 cards, copy limit enforced',()=>{
 for(const name of Object.keys(A.STARTERS))assert.equal(A.validateDeck(A.STARTERS[name]),'');
 assert.match(A.validateDeck(['precision']),/exactly 12/i);
 assert.match(A.validateDeck(Array(12).fill('precision')),/many copies/i);
});
test('match starts with equal independent 4x4 boards, focus, hands and dealer',()=>{
 const m=newMatch();
 assert.deepEqual(m.players[0].board.map(c=>c.card),deck().slice(0,16));
 assert.deepEqual(m.players[0].board,m.players[1].board);
 assert.notEqual(m.players[0].board,m.players[1].board);
 assert.equal(m.players[0].focus,3);
 assert.equal(m.players[1].hand.length,4);
 assert.equal(m.maxTurns,18);
 assert.equal(A.offer(m,0).length,3);
 assert.deepEqual(A.offer(m,0),A.offer(m,1));
});
test('first choice remains secret and does not mutate public board until both commit',()=>{
 const m=newMatch(),a=open(m);
 const before=JSON.stringify(m.players[0].board);
 assert.equal(A.commit(m,0,a),null);
 assert.equal(m.turn,1);
 assert.equal(JSON.stringify(m.players[0].board),before);
 assert.equal(m.next,1);
 assert.throws(()=>A.commit(m,0,a));
 const ev=A.commit(m,1,open(m,1));
 assert.equal(ev.draw,16);
 assert.equal(m.turn,2);
 assert.equal(m.players[0].hits,1);
 assert.equal(m.players[1].hits,1);
});
test('public target offers and odds ignore unrevealed dealer order',()=>{
 const a=newMatch(),b=newMatch();
 [b.dealer[16],b.dealer[51]]=[b.dealer[51],b.dealer[16]];
 assert.deepEqual(A.offer(a,0),A.offer(b,0));
 assert.deepEqual(A.knownOdds(a,0),A.knownOdds(b,0));
 assert.equal(A.knownOdds(a,0).total,36);
});
test('wrong and equal-rank predictions permanently burn, right ones replace',()=>{
 const m=newMatch();
 const ev=pair(m,{idx:0,guess:'LOWER'},{idx:0,guess:'HIGHER'});
 assert.equal(ev.draw,16);
 assert.equal(m.players[0].board[0].alive,false);
 assert.equal(m.players[1].board[0].alive,true);
 assert.equal(m.players[1].board[0].card,16);
 assert.equal(A.offer(m,0).includes(0),false);
 const n=newMatch();
 n.players[0].hand=['precision'];n.players[0].focus=5;
 const tie=pair(n,{idx:3,guess:'HIGHER',cardId:'precision'},open(n,1));
 assert.equal(tie.detail[0].tie,true);assert.equal(n.players[0].board[3].alive,false);
});
test('Heartward prevents a failed prediction burn and consumes Focus',()=>{
 const m=newMatch();m.players[0].hand=['heartward'];
 const ev=pair(m,{idx:0,guess:'LOWER',cardId:'heartward',cardTarget:0},{idx:0,guess:'LOWER'});
 assert.equal(ev.detail[0].shield,true);
 assert.equal(m.players[0].board[0].alive,true);
 assert.equal(m.players[1].board[0].alive,false);
 assert.ok(m.players[0].discard.includes('heartward'));
});
test('Second Wind permits explicitly targeting a resting slot outside the three-card offer',()=>{
 const m=newMatch();m.players[0].hand=['secondwind'];
 m.players[0].board[14].restUntil=4;
 assert.ok(A.offer(m,0,'secondwind',14).includes(14));
 const ev=pair(m,{idx:14,guess:'HIGHER',cardId:'secondwind',cardTarget:14},open(m,1));
 assert.equal(ev.detail[0].ok,false);
 assert.equal(m.players[0].board[14].restUntil,0);
});
test('position fatigue begins after two correct uses and blocks two following turns',()=>{
 const m=newMatch();m.turn=1;
 m.players[0].board[0].heat=1;
 const ev=pair(m,{idx:0,guess:'HIGHER'},open(m,1));
 assert.equal(ev.detail[0].ok,true);
 assert.equal(m.players[0].board[0].restUntil,3);
 assert.equal(m.turn,2);
 assert.equal(A.offer(m,0,'precision').includes(0),false);
 m.turn=3;assert.equal(A.offer(m,0,'precision').includes(0),false);
 m.turn=4;assert.equal(A.offer(m,0,'precision').includes(0),true);
});
test('all-fatigued territory never leaves player without a legal target',()=>{
 const m=newMatch();
 for(const p of m.players)for(const c of p.board)c.restUntil=3;
 assert.equal(A.offer(m,0).length,1);
 assert.ok(A.offer(m,0).every(i=>m.players[0].board[i].alive));
});
test('disruption cannot disable last remaining eligible target',()=>{
 const m=newMatch(),p=m.players[0];
 for(let i=1;i<16;i++)p.board[i].alive=false;
 p.blocked={idx:0,turn:1};
 assert.deepEqual(A.offer(m,0),[0]);
});
test('Crosswind and Iron Grip apply only to opponent next turn',()=>{
 const m=newMatch();
 m.players[0].hand=['crosswind'];m.players[0].focus=5;
 pair(m,{idx:0,guess:'HIGHER',cardId:'crosswind',cardTarget:3},open(m,1));
 assert.equal(m.players[1].blocked.turn,2);
 assert.equal(m.players[1].blocked.idx,3);
 assert.equal(A.offer(m,1,'precision').includes(3),false);
 const n=newMatch();n.players[0].hand=['irongrip'];n.players[0].focus=5;
 pair(n,{idx:0,guess:'HIGHER',cardId:'irongrip'},open(n,1));
 assert.equal(A.price(n,1,'reserve'),2);
 assert.equal(A.price(n,0,'reserve'),1);
});
test('reserve grants Focus under cap; illegal cards and targets reject safely',()=>{
 const m=newMatch();m.players[0].hand=['reserve'];m.players[0].focus=3;
 pair(m,{idx:0,guess:'HIGHER',cardId:'reserve'},open(m,1));
 assert.equal(m.players[0].focus,5);
 const n=newMatch();
 assert.match(A.inspectMove(n,0,{idx:0,guess:'HIGHER',cardId:'made-up'}),/not in your hand/i);
 assert.match(A.inspectMove(n,0,{idx:99,guess:'HIGHER'}),/not available/i);
 assert.match(A.inspectMove(n,0,{idx:0,guess:'MAYBE'}),/HIGHER or LOWER/i);
});
test('every implemented ability has a distinct registry entry and effect category',()=>{
 assert.equal(A.REGISTRY.length,12);
 assert.equal(new Set(A.REGISTRY.map(c=>c.id)).size,12);
 for(const c of A.REGISTRY){assert.ok(c.text.length>10);assert.ok(c.cost>=1&&c.cost<=4);}
});
test('end-of-match tiebreak initiates short sudden death; second tie is declared draw',()=>{
 const m=newMatch();
 m.turn=18;
 pair(m,{idx:0,guess:'HIGHER'}, {idx:0,guess:'HIGHER'});
 assert.equal(m.round,'sudden');
 assert.equal(m.phase,'intermission');
 assert.equal(m.maxTurns,3);
 A.continueSuddenDeath(m);
 assert.equal(m.phase,'commit');
 assert.match(A.inspectMove(m,0,{idx:0,guess:'HIGHER',cardId:'heartward',cardTarget:0}),/Sudden death/i);
 m.turn=3;
 const a=open(m,0),b=open(m,1);
 pair(m,a,b);
 assert.equal(m.phase,'finished');
 assert.equal(m.result.winner,null);
});
test('playing a single turn never reveals the next shuffled draw in recorded history',()=>{
 const m=newMatch();
 const ev=pair(m,open(m),open(m,1));
 assert.equal(m.history.length,1);
 assert.equal(m.history[0].draw,ev.draw);
 assert.equal(Object.hasOwn(m.history[0],'nextDraw'),false);
});
})();
