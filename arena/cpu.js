/* HIGH / LOW: BATTLEGROUNDS — fair local CPU opponent.
   Does not read the dealer shoe, the human's committed prediction, or private human hand.
   All probabilities derive from the 16 public starting cards and prior revealed draws.
   Difficulty affects policy, not underlying card order or player rules. */
(function(root,factory){
  const api=factory(typeof require==='function'?require('./engine.js'):root.ArenaEngine);
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.ArenaCPU=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(A){
 'use strict';
 if(!A)throw Error('Arena engine required before CPU strategy');
 const DIFFICULTIES=Object.freeze({
   casual:Object.freeze({label:'Casual',mistake:.30,randomTarget:.36,useTactics:.25,noise:.17,spendPenalty:.07}),
   standard:Object.freeze({label:'Standard',mistake:.085,randomTarget:.12,useTactics:.62,noise:.065,spendPenalty:.057}),
   expert:Object.freeze({label:'Expert',mistake:0,randomTarget:0,useTactics:.94,noise:.013,spendPenalty:.045})
 });
 const clampRandom=rng=>{
   const value=Number(rng());
   if(!Number.isFinite(value)||value<0||value>=1)throw Error('CPU random source must return [0,1)');
   return value;
 };
 function oddsFor(reference, initialBoard, history, round){
   if(!Array.isArray(initialBoard)||initialBoard.length!==16||new Set(initialBoard).size!==16||
      initialBoard.some(id=>!Number.isInteger(id)||id<0||id>51))throw Error('CPU requires the public original 16-card board');
   const known=new Set(initialBoard);
   for(const event of history)if(event.round===round)known.add(event.draw);
   let higher=0,lower=0,tie=0;
   for(let id=0;id<52;id++)if(!known.has(id)){
     const relative=Math.sign(A.rank(id)-A.rank(reference));
     if(relative>0)higher++;else if(relative<0)lower++;else tie++;
   }
   const total=higher+lower+tie;
   if(total<=0)throw Error('No unseen dealer cards remain');
   return {HIGHER:higher/total,LOWER:lower/total,tie:tie/total,total};
 }
 function candidateScore(match, move, chances, difficulty){
   const cpu=match.players[1],opp=match.players[0],slot=cpu.board[move.idx];
   const p=chances[move.guess], id=move.cardId, cost=id?A.price(match,1,id):0;
   let score=p*1.30;
   if(slot.heat===1&&match.turn<match.maxTurns-1)score-=p*.035;
   if(slot.restUntil>=match.turn&&id==='secondwind')score+=.05;
   if(!id)return score;
   // Abilities always pay their standard Focus cost. No free actions or altered odds.
   let benefit=0;
   switch(id){
     case 'heartward': benefit=(1-p)*.89;break;
     case 'steady': benefit=chances.tie*.73;break;
     case 'rooted': benefit=p*(slot.heat===1?.17:.052);break;
     case 'secondwind': benefit=(slot.restUntil>=match.turn?.19:.015);break;
     case 'reserve':benefit=Math.min(2,Math.max(0,5-(cpu.focus-cost)))*.085;break;
     case 'exchange':benefit=cpu.hand.length<5&&cpu.drawPile.length>0?.13:.02;break;
     case 'investment':benefit=p*Math.min(3,Math.max(0,5-(cpu.focus-cost)))*.085;break;
     case 'reckoning':benefit=p<.40?p*.26:0;break;
     case 'precision':benefit=.02;break;
     case 'survey':benefit=.016;break;
     case 'crosswind':benefit=A.remaining(opp)>1?.14:.05;break;
     case 'irongrip':benefit=match.turn<match.maxTurns-1?.15:.015;break;
   }
   const focusScarcity=cpu.focus<=2?.08:cpu.focus>=5?-.035:0;
   return score+benefit-cost*(difficulty.spendPenalty+focusScarcity);
 }
 function enemyTarget(match,initialBoard,random){
   const board=match.players[0].board,publicHistory=match.history;
   const alive=board.map((cell,idx)=>({cell,idx})).filter(x=>x.cell.alive);
   if(!alive.length)return null;
   // Target the opponent's strongest PUBLIC probability position; not the player's locked action.
   const ranked=alive.map(({cell,idx})=>{
     const o=oddsFor(cell.card,initialBoard,publicHistory,match.round);
     return {idx,score:Math.max(o.HIGHER,o.LOWER)+(cell.restUntil>=match.turn+1?-.16:0)};
   }).sort((a,b)=>b.score-a.score||a.idx-b.idx);
   return ranked[Math.floor(random()*Math.min(2,ranked.length))].idx;
 }
 function choose(match, options={}){
   const difficultyName=options.difficulty||'standard',level=DIFFICULTIES[difficultyName];
   if(!level)throw Error('Unknown CPU difficulty: '+difficultyName);
   if(!match||match.phase!=='commit'||match.next!==1)throw Error('CPU can act only on its own commitment turn');
   const initialBoard=options.initialBoard,random=options.rng||Math.random;
   // Validate public history availability before looking at any position.
   oddsFor(match.players[1].board.find(c=>c.alive)?.card||0,initialBoard,match.history,match.round);
   const cpu=match.players[1], isSudden=match.round==='sudden';
   const cards=isSudden?[]:[...new Set(cpu.hand)].filter(id=>A.CARDS[id]&&cpu.focus>=A.price(match,1,id));
   const enemy=cards.includes('crosswind')?enemyTarget(match,initialBoard,random):null;
   let choices=[];
   const add=(cardId,idx,target)=>{
     const chance=oddsFor(cpu.board[idx].card,initialBoard,match.history,match.round);
     for(const guess of ['HIGHER','LOWER']){
       const move={idx,guess,cardId,cardTarget:target};
       if(!A.inspectMove(match,1,move)){
         const score=candidateScore(match,move,chance,level);
         choices.push({move,score:score+(clampRandom(random)-.5)*level.noise});
       }
     }
   };
   for(const idx of A.offer(match,1))add(null,idx,null);
   if(!isSudden){
     for(const id of cards){
       if(id==='crosswind'&&enemy===null)continue;
       const c=A.CARDS[id];
       if(c.target==='selected'&&id==='secondwind'){
         for(let idx=0;idx<cpu.board.length;idx++)if(cpu.board[idx].alive&&A.offer(match,1,id,idx).includes(idx))add(id,idx,idx);
       }else{
         const target=c.target==='enemy'?enemy:null;
         for(const idx of A.offer(match,1,id,target))add(id,idx,c.target==='selected'?idx:target);
       }
     }
   }
   if(!choices.length)throw Error('CPU has no legal action');
   // Casual makes more genuine mistakes; Expert always selects the strongest evaluated move.
   if(clampRandom(random)<level.randomTarget){
     const legal=choices.filter(c=>!c.move.cardId);
     if(legal.length)choices=legal;
     return choices[Math.floor(clampRandom(random)*choices.length)].move;
   }
   if(clampRandom(random)>level.useTactics){
     const simple=choices.filter(c=>!c.move.cardId);
     if(simple.length)choices=simple;
   }
   choices.sort((a,b)=>b.score-a.score||a.move.idx-b.move.idx||
     (a.move.guess==='HIGHER'?-1:1));
   let decision=choices[0].move;
   if(clampRandom(random)<level.mistake){
     const same=choices.find(c=>c.move.idx===decision.idx && c.move.cardId===decision.cardId &&
       c.move.cardTarget===decision.cardTarget&&c.move.guess!==decision.guess);
     if(same)decision=same.move;
   }
   return decision;
 }
 return Object.freeze({DIFFICULTIES,oddsFor,choose});
});