#!/usr/bin/env node
/* Arena balance harness. Run node tests/arena_balance.cjs --games 100000
   This is an exploratory bot simulation, not evidence of balanced human play. */
const A=require('../arena/engine.js');
const countArg=process.argv.indexOf('--games');
const GAMES=countArg>=0?Number(process.argv[countArg+1]):100000;
if(!Number.isSafeInteger(GAMES)||GAMES<1||GAMES>1000000)throw Error('--games must be an integer between 1 and 1000000');
let seed=0xC0FFEE;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
const pick=xs=>xs[Math.floor(random()*xs.length)];
function bot(m,index){
 const p=m.players[index],op=m.players[1-index];
 const affordable=p.hand.filter(id=>A.CARDS[id].cost<=p.focus).filter(id=>m.round!=='sudden');
 let cardId=affordable.length && random()<.35?pick(affordable):null,target=null;
 if(cardId==='crosswind'){
   const enemy=A.offer(m,1-index);target=enemy.length?pick(enemy):op.board.findIndex(c=>c.alive);
   if(target<0)cardId=null;
 }
 const offers=A.offer(m,index,cardId);
 if(!offers.length)throw Error('No legal move while game is active');
 const idx=pick(offers);
 if(['heartward','secondwind','steady','rooted'].includes(cardId))target=idx;
 const odds=A.knownOdds(m,p.board[idx].card);
 let guess=odds.higher>=odds.lower?'HIGHER':'LOWER';
 if(random()<.12)guess=guess==='HIGHER'?'LOWER':'HIGHER';
 const action={idx,guess,cardId,cardTarget:target};
 if(A.inspectMove(m,index,action))return {idx:A.offer(m,index)[0],guess};
 return action;
}
const totals={games:0,p1:0,p2:0,draws:0,rounds:0,hits:[0,0],burns:[0,0],cards:{},error:0};
for(let i=0;i<GAMES;i++){
 const m=A.createMatch({decks:[A.STARTERS.balanced,A.STARTERS.balanced]});
 let guard=0;
 while(m.phase!=='finished'){
   if(++guard>24)throw Error('Game never finished (guard)');
   if(m.phase==='intermission'){A.continueSuddenDeath(m);continue;}
   const a=bot(m,0);
   A.commit(m,0,a);
   const b=bot(m,1);
   if(a.cardId)totals.cards[a.cardId]=(totals.cards[a.cardId]||0)+1;
   if(b.cardId)totals.cards[b.cardId]=(totals.cards[b.cardId]||0)+1;
   A.commit(m,1,b);
 }
 totals.games++;totals.rounds+=m.history.length;
 for(let j=0;j<2;j++){totals.hits[j]+=m.players[j].hits;totals.burns[j]+=m.players[j].burns;}
 if(m.result.winner===0)totals.p1++;
 else if(m.result.winner===1)totals.p2++;
 else totals.draws++;
}
console.log(JSON.stringify({...totals,averageTurns:Number((totals.rounds/GAMES).toFixed(2)),
p1WinRate:Number((totals.p1/GAMES*100).toFixed(2)),
p2WinRate:Number((totals.p2/GAMES*100).toFixed(2)),
drawRate:Number((totals.draws/GAMES*100).toFixed(2))},null,2));
