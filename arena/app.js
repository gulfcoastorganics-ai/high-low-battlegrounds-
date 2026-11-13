(function arenaApp(){
'use strict';
const A=globalThis.ArenaEngine,S={S:'♠',H:'♥',D:'♦',C:'♣'},G={precision:'✥',survey:'◉',reckoning:'⌖',heartward:'♥',secondwind:'❧',steady:'✧',reserve:'◆',exchange:'⟡',investment:'✦',crosswind:'✣',irongrip:'⚒',rooted:'♣'};
const screen=document.getElementById('screen'),overlay=document.getElementById('overlay');
const CH=globalThis.ArenaCharacters.byId,FACTIONS=globalThis.ArenaCharacters.factions;
const CPU=globalThis.ArenaCPU;
const PREMIUM_IDS=new Set(A.REGISTRY.map(c=>c.id));
const portrait=id=>PREMIUM_IDS.has(id)?'./art-premium/'+id+'.webp':CH[id]?.portrait||'./art/precision.svg';
const state={scene:'lobby',overlay:null,m:null,mode:'hotseat',cpuDifficulty:'standard',cpuInitial:null,decks:[A.STARTERS.balanced.slice(),A.STARTERS.balanced.slice()],editor:0,chosen:null,guess:null,card:null,target:null,error:''};
try{const d=JSON.parse(localStorage.getItem('hl-arena-decks-v1')||'null');if(Array.isArray(d)&&d.length===2&&d.every(x=>!A.validateDeck(x)))state.decks=d;}catch(_){}
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=id=>'./cards-mystic/'+A.cardCode(id)+'.svg',pct=(n,d)=>d?Math.round(n/d*100):0,me=()=>state.m?.next??0;
const reset=()=>{state.chosen=null;state.guess=null;state.card=null;state.target=null;state.error='';};
function starterName(deck){return Object.keys(A.STARTERS).find(n=>JSON.stringify(deck)===JSON.stringify(A.STARTERS[n]))||'custom';}
function showcase(){
const leaders=['precision','heartward','reserve','rooted'];
return '<section class="character-showcase"><div class="showcase-heading"><div><div class="overline">YOUR CHAMPIONS · FOUR FACTIONS</div><h3>THE LEGENDS OF THE TABLE</h3></div><span>24 CHARACTERS · 12 PLAYABLE</span></div><div class="showcase-grid">'+
leaders.map(id=>{const ch=CH[id];return '<button type="button" class="hero-character s-'+ch.suit+'" data-character="'+id+'" data-act="inspect" data-id="'+id+'"><img src="'+portrait(id)+'" alt="" loading="lazy"><span><b>'+esc(ch.name)+'</b><small>'+esc(ch.title)+'</small></span></button>';}).join('')+'</div></section>';
}
function difficultyOptions(){return Object.entries(CPU.DIFFICULTIES).map(([key,p])=>'<option value="'+key+'"'+(state.cpuDifficulty===key?' selected':'')+'>'+p.label+'</option>').join('');}
function lobby(){
const panel=i=>`<article class="panel panel-glow">
 <img class="contender-portrait" src="${portrait(i===0?'precision':'heartward')}" alt="" aria-hidden="true" loading="eager" decoding="async">
 <div class="player-ident"><span class="portrait">${i+1}</span><div><div class="section-label">CONTENDER 0${i+1}</div><h3 class="panel-title" style="margin:4px 0">PLAYER ${i+1}</h3></div></div>
 <label class="section-label">TACTICAL LOADOUT</label>
 <select class="selector" data-change="preset" data-player="${i}">
 ${['balanced','guardian','tactician','custom'].map(n=>`<option value="${n}" ${starterName(state.decks[i])===n?'selected':''}>${n==='balanced'?'Balanced · all four factions':n==='guardian'?'Guardian · protect territory':n==='tactician'?'Tactician · pressure & precision':'Custom loadout'}</option>`).join('')}
 </select><div class="deck-preview">${Array.from({length:5},()=>'<span class="mini-back"></span>').join('')}</div>
 <p class="fineprint">${state.decks[i].length}/12 cards · ${esc(A.validateDeck(state.decks[i])||'Arena-ready loadout')}</p>
 <button class="button" style="width:100%;margin-top:12px" data-act="builder" data-player="${i}">DECK BUILDER / COLLECTION</button></article>`;
return `<section class="page-title"><div class="overline">♠ &nbsp; ♥ &nbsp; THE COMPETITIVE TABLE &nbsp; ♦ &nbsp; ♣</div>
 <h2>RULE THE <em>ARENA.</em></h2>
 <p>Challenge a CPU opponent or battle a friend on one device. Shared draws, tactical abilities, and sixteen territories.</p>
 <div class="hero-cta-row"><button class="cta hero-play cpu-play" data-act="start-cpu">⚔ PLAY VS CPU</button><button class="cta-secondary local-play" data-act="start">♟ LOCAL 2-PLAYER</button><a href="../index.html" class="ghost-button hero-classic">ORIGINAL CLASSIC V8 ↗</a></div>
 <div class="cpu-setup"><label for="cpu-difficulty" class="section-label">CPU DIFFICULTY</label><select id="cpu-difficulty" aria-label="CPU difficulty" class="selector" data-change="cpu-difficulty">${difficultyOptions()}</select><p><b>Casual</b> makes beginner mistakes · <b>Standard</b> balances tactical choices · <b>Expert</b> evaluates public odds and abilities. No hidden dealer peeking.</p></div>
 </section>
 ${showcase()}
 <section class="loadout-heading"><div class="overline">THE WAR ROOM</div><h3>CHOOSE YOUR LOADOUT.</h3><p>Customize both decks before battling a friend or the CPU opponent.</p></section>
 <section class="lobby-grid">${panel(0)}${panel(1)}</section>
 <section class="rules-strip"><div class="rule"><b>01 &nbsp; THE COMMON DRAW</b><span>Each player faces the same dealer sequence, but your battlegrounds evolve independently.</span></div>
 <div class="rule"><b>02 &nbsp; TERRITORY IS LIFE</b><span>Incorrect guesses and ties burn spaces. Use defense to survive.</span></div>
 <div class="rule"><b>03 &nbsp; STRATEGIC FOCUS</b><span>Collect Focus each turn and spend it on powerful tactical abilities.</span></div></section>
 <p class="fineprint" style="margin:17px auto 22px">Play the CPU instantly or pass the device for local two-player battles. Online matchmaking is not active.</p>`;
}
function tileGrid(m,index,ours){
const p=m.players[index],isActive=ours&&m.phase==='commit',offer=A.offer(m,index,ours?state.card:null,ours?state.target:null);
const enemyTarget=!ours&&state.card==='crosswind'&&m.phase==='commit';
const tiles=p.board.map((c,i)=>{
const available=ours&&isActive&&offer.includes(i),canClick=c.alive&&(ours?(isActive&&(available||state.card==='secondwind')):enemyTarget);
const selected=ours?state.chosen===i:enemyTarget&&state.target===i;
const cls=['play-tile',!c.alive?'burned':'',available?'eligible':'',selected?'selected':'',c.alive&&c.restUntil>=m.turn?'fatigued':'',c.alive&&p.blocked?.turn===m.turn&&p.blocked.idx===i?'targeted':''].filter(Boolean).join(' ');
return `<button type="button" class="${cls}" ${canClick?`data-act="${ours?'own':'enemy'}" data-idx="${i}"`:'disabled'} aria-label="Position ${i+1}${c.alive?' '+A.cardCode(c.card):' burned'}">${c.alive?`<img src="${image(c.card)}" alt="" loading="lazy">`:''}</button>`;
}).join('');
return `<section class="war-panel ${ours?'player active':'enemy'}"><div class="war-label">${ours?'YOUR BATTLEGROUND':'OPPONENT TERRITORY'}<small>${ours?'SELECT YOUR TARGET':enemyTarget?'SELECT DISRUPTION TARGET':'EACH BOARD IS INDEPENDENT'}</small></div>
<div class="card-grid">${tiles}</div><div class="war-metrics"><span>LIVE <b>${A.remaining(p)}/16</b></span><span>CORRECT <b>${p.hits}</b></span><span>FOCUS <b>${m.round==='sudden'?'—':p.focus}</b></span></div></section>`;
}
function tactical(id){
const c=A.CARDS[id],ch=CH[id],active=state.card===id,cost=state.m?A.price(state.m,me(),id):c.cost,afford=state.m.players[me()].focus>=cost;
return `<div class="tactcard-wrap">
<button type="button" class="tactcard s-${c.suit} rarity-${c.rarity}${active?' active':''}" data-character="${id}" data-act="card" data-id="${id}" ${!afford?'disabled':''}
 aria-pressed="${active}" aria-label="Play ${esc(ch.name)}: ${esc(c.name)}. ${esc(c.text)}">
  <span class="tc-top"><span>${S[c.suit]} ${c.rarity.toUpperCase()}</span><span class="tc-cost">${cost}</span></span>
  <span class="tc-art" data-character="${id}"><img src="${portrait(id)}" alt="" loading="lazy"><span class="tc-art-shine"></span></span>
  <span class="tc-bottom"><strong>${esc(ch.name)}</strong><small>${esc(c.name)}</small></span>
</button><button type="button" class="tactcard-inspect" data-act="inspect" data-id="${id}" aria-label="Inspect ${esc(ch.name)}">ⓘ <span>DETAILS</span></button>
</div>`;
}
function tacticSummary(m,i){
  const id=state.card,card=id?A.CARDS[id]:null,ch=id?CH[id]:null;
  const cost=card?A.price(m,i,id):0;
  const selected=state.chosen!=null&&m.players[i].board[state.chosen]?.alive;
  const enemyRequired=card?.target==='enemy'&&state.target==null;
  const ready=selected&&state.guess&&!A.inspectMove(m,i,{idx:state.chosen,guess:state.guess,cardId:id,cardTarget:state.target});
  let next;
  if(state.error)next=state.error;
  else if(enemyRequired)next='Choose a living enemy position for your disruption.';
  else if(!selected)next='Select one of your gold-highlighted territory cards.';
  else if(!state.guess)next='Choose HIGHER or LOWER using the public odds.';
  else if(ready)next='Ready to lock. Both predictions will use the same dealer card.';
  else next='Check your card target and available Focus before locking.';
  const targetText=selected?'TERRITORY '+String(state.chosen+1).padStart(2,'0')+' · '+A.cardCode(m.players[i].board[state.chosen].card):'NO TERRITORY SELECTED';
  const portraitElement=card?`<img src="${portrait(id)}" alt="" loading="lazy">`:'<span class="tactic-empty-mark">✦</span>';
  const identity=card?`<strong>${esc(ch.name)}</strong><span>${esc(card.name)}</span>`:'<strong>STANDARD PREDICTION</strong><span>No ability armed · tactical cards are optional</span>';
  const costBadge=card?`<span class="tactic-focus">✦ ${cost} FOCUS</span>`:'<span class="tactic-focus">FREE</span>';
  const effect=card?`<p class="tactic-description">${esc(card.text)}</p>`:'<p class="tactic-description">Choose a character from your tactical hand to activate an ability, or predict without one.</p>';
  const steps=[
    ['1','TARGET',selected&&!enemyRequired],
    ['2','PREDICT',!!state.guess],
    ['3','LOCK',!!ready]
  ];
  const current=enemyRequired||!selected?0:!state.guess?1:2;
  return `<div class="turn-tactic decision" data-selected-tactic="${id||'none'}">
    <div class="turn-tactic-top"><span class="label">YOUR TACTIC</span>${costBadge}</div>
    <div class="tactic-identity"><span class="tactic-thumb">${portraitElement}</span>
      <span class="tactic-name">${identity}</span>
      ${card?'<button class="tactic-clear" type="button" data-act="clear" aria-label="Cancel tactical ability">✕</button>':''}
    </div>
    ${effect}
    <div class="tactic-target" aria-label="Selected position"><span>${esc(targetText)}${card?.target==='enemy'&&state.target!=null?' · ENEMY '+(state.target+1):''}</span>${selected?'<button type="button" class="inspect-playing-btn" data-act="view-playing" aria-label="Enlarge selected playing card" title="Enlarge selected card">⌕</button>':''}</div>
    <div class="turn-steps" aria-label="Steps to complete your turn">${steps.map(([num,label,done],index)=>`<span class="turn-step ${done?'is-complete':''} ${index===current?'is-current':''}"><b>${done?'✓':num}</b><span>${label}</span></span>`).join('')}</div>
    <p class="tactic-next" role="status">${esc(next)}</p>
  </div>`;
}
function game(){
const m=state.m,i=m.next===-1?0:m.next,j=1-i,p=m.players[i],o=m.players[j],idx=state.chosen;
const cell=idx!=null?p.board[idx]:null,od=cell?.alive?A.knownOdds(m,cell.card):null;
const odds=(name,key,color)=>`<div class="prob-col"><b>${od?pct(od[key],od.total):'—'}%</b>${name}<div class="meter"><i style="width:${od?pct(od[key],od.total):0}%;background:${color}"></i></div></div>`;
const a={idx,guess:state.guess,cardId:state.card,cardTarget:state.target};
const valid=m.phase==='commit'&&idx!=null&&state.guess&&!A.inspectMove(m,i,a);
const ability=state.card?A.CARDS[state.card]:null;
const hint=state.error||(ability?(ability.target==='enemy'&&state.target==null?'Choose a living enemy target first.':ability.text):'Tactical cards are optional. Choose a gold-lit position and then HIGHER or LOWER.');
return `<div class="arena-match-shell"><nav class="match-quick-nav" aria-label="Jump between Arena controls"><button type="button" data-act="jump-board">♠ BOARD</button><button type="button" data-act="jump-controls">▲ PREDICT</button><button type="button" data-act="jump-hand">✦ HAND</button></nav><div class="arena-combat"><section class="matchhead"><div class="score-head enemy"><div><small>CONTENDER 0${j+1}</small><b>${esc(o.name)}</b></div><span class="score">${A.remaining(o)}</span></div>
<div class="roundlabel"><strong>${m.round==='sudden'?'SUDDEN DEATH':state.mode==='cpu'?'VS CPU · '+CPU.DIFFICULTIES[state.cpuDifficulty].label.toUpperCase():'ARENA DUEL'}</strong><span>DRAW ${String(m.turn).padStart(2,'0')} / ${m.maxTurns}</span></div>
<div class="score-head"><span class="score">${A.remaining(p)}</span><div><small>NOW DECIDING</small><b>${esc(p.name)}</b></div></div></section>
<div class="arena-main-grid"><section class="arena-stage">${tileGrid(m,j,false)}
<div class="dealer-panel"><div class="overline">♠ &nbsp; THE SHARED DEALER &nbsp; ♠</div><div class="dealer-title">THE NEXT CARD</div><div class="dealer-stage"><div class="shoe"></div></div>
<p class="muted">One hidden draw. Two locked predictions. No preview.</p><span class="counter">DRAW ${m.turn} OF ${m.maxTurns}</span></div>
${tileGrid(m,i,true)}</section>
<section class="action-dock">${tacticSummary(m,i)}<div class="decision odds-decision"><div class="label">PUBLIC ODDS</div><div class="selected-summary">${cell?.alive?`CARD ${A.cardCode(cell.card)} · RANK ${A.rank(cell.card)}`:'Select your territory to calculate the odds.'}</div>
<div class="prob-line">${odds('LOWER','lower','#e28f76')}${odds('HIGHER','higher','#8edcaa')}${odds('TIE / LOSS','tie','#ad9198')}</div></div>
<div class="decision play-controls" aria-label="Prediction controls"><button class="guess-btn low${state.guess==='LOWER'?' active':''}" data-act="guess" data-value="LOWER">▼ LOWER</button>
<button class="guess-btn high${state.guess==='HIGHER'?' active':''}" data-act="guess" data-value="HIGHER">▲ HIGHER</button>
<button class="cta" data-act="lock" ${valid?'':'disabled'}>LOCK DECISION →</button><div class="action-hint">${esc(state.error||(!cell?.alive?"Select your territory first.":!state.guess?"Choose a direction.":valid?"Decision ready to lock.":hint))}</div></div></section></div></div>
<section class="hand-shell"><div class="hand-header"><div><div class="section-label">SELECT A CHARACTER</div><b>TACTICAL HAND · ${p.hand.length} CARDS</b></div><div class="focus"><i>✦</i> FOCUS ${m.round==='sudden'?'—':p.focus}/5</div></div>
<div class="hand-cards">${m.round==='sudden'?'Sudden death is standard-card only.':p.hand.length?p.hand.map(tactical).join(''):'Your tactical hand is empty. Continue predicting with standard cards.'}</div>
</section></div>`;
}
function builder(){
const deck=state.decks[state.editor],count={};deck.forEach(id=>count[id]=(count[id]||0)+1);
const catalog=A.REGISTRY.map(c=>{
const ch=CH[c.id];return `<div class="builder-item"><button class="builder-row" data-act="add" data-id="${c.id}" ${deck.length>=12||(count[c.id]||0)>=2?'disabled':''}>
<span class="builder-portrait-wrap" data-character="${c.id}"><img class="builder-portrait" src="${portrait(c.id)}" alt="" loading="lazy"></span><span class="builder-copy"><strong>${esc(ch.name)}</strong><small>${esc(ch.title)} · ${c.cost} Focus</small><small>${esc(c.name)} · ${esc(c.text)}</small></span></button>
<button type="button" class="builder-inspect" data-act="inspect" data-id="${c.id}">VIEW CHARACTER ↗</button></div>`;}).join('');
const future=(globalThis.ArenaExpansion||[]).map(c=>{
const ch=CH[c.id];return `<div class="builder-item preview"><button class="builder-row preview" disabled>
<img class="builder-portrait" src="${portrait(c.id)}" alt="" loading="lazy"><span class="builder-copy"><strong>${esc(ch.name)} · PREVIEW</strong><small>${esc(ch.title)} · ${c.cost} Focus</small><small>${esc(c.name)} · NOT PLAYABLE YET</small></span></button>
<button type="button" class="builder-inspect" data-act="inspect" data-id="${c.id}">VIEW CONCEPT ↗</button></div>`;}).join('');
const chosen=Object.entries(count).map(([id,n])=>`<div class="deck-row"><span>${S[A.CARDS[id].suit]} ${esc(A.CARDS[id].name)} ×${n}</span><button data-act="remove" data-id="${id}" aria-label="Remove ${esc(A.CARDS[id].name)}">−</button></div>`).join('');
const invalid=A.validateDeck(deck);
return `<div class="modal" role="dialog" aria-modal="true" aria-label="Tactical deck builder"><div class="builder-top"><div><div class="overline">THE COLLECTION VAULT · FAIR ACCESS</div><h2 style="margin-bottom:7px">THE DECK FORGE</h2></div><button class="button" data-act="close">CLOSE ✕</button></div>
<label class="section-label">STARTER RECIPE</label><select class="selector" data-change="starter"><option value="custom">Choose a starter…</option><option value="balanced">Balanced</option><option value="guardian">Guardian</option><option value="tactician">Tactician</option></select>
<div class="builder-layout"><div><h3 class="section-label">12 PLAYABLE · 12 EXPANSION PREVIEWS</h3><div class="builder-collection">${catalog+future}</div></div><div><h3 class="section-label">PLAYER ${state.editor+1} · SELECTED DECK</h3><div class="builder-picked">${chosen||'<p>Choose cards from the collection.</p>'}</div></div></div>
<div class="valid-message">${deck.length}/12 CARDS · ${esc(invalid||'VALID DECK · MAX 2 COPIES PER CARD')}</div>
<button class="cta" data-act="save" ${invalid?'disabled':''}>SAVE DECK ✦</button></div>`;
}
function inspectModal(){
 const id=state.inspect,ch=CH[id],c=A.CARDS[id]||globalThis.ArenaExpansion.find(x=>x.id===id);
 if(!ch||!c)return '<div class="modal">Character unavailable.</div>';
 const live=!!A.CARDS[id],suit=S[ch.suit];
 return `<div class="modal inspect-modal s-${ch.suit}" role="dialog" aria-modal="true" aria-label="Character details">
  <div class="inspect-layout"><div class="inspect-visual" data-character="${id}"><img src="${portrait(id)}" alt="${esc(ch.name)}, ${esc(ch.title)}"><span class="inspect-rarity">${suit} ${esc(c.rarity.toUpperCase())} · ${live?'ARENA READY':'EXPANSION PREVIEW'}</span></div>
  <div class="inspect-copy"><div class="overline">${esc(FACTIONS[ch.suit].name)} · ${esc(FACTIONS[ch.suit].description)}</div>
  <h2>${esc(ch.name)}</h2><h3>${esc(ch.title)}</h3><blockquote>“${esc(ch.lore)}”</blockquote>
  <div class="inspect-ability"><div class="section-label">TACTICAL ABILITY</div><strong>${esc(c.name)} <span class="inspect-cost">✦ ${c.cost}</span></strong>
  <p>${esc(c.text)}</p><small>${live?'PLAYABLE · 12-CARD DECK':'CONCEPT ONLY · CANNOT ENTER DECKS'}</small></div>
  <button type="button" class="cta" data-act="close-inspect">RETURN TO ${state.returnOverlay==='builder'?'COLLECTION':'ARENA'}</button></div></div>
 </div>`;
}
function modalView(){
const m=state.m,k=state.overlay;if(!k)return '';if(k==='inspect')return inspectModal();if(k==='builder')return builder();
if(k==='view-playing'){
 const selected=state.chosen!=null?m?.players[me()]?.board[state.chosen]:null;
 if(!selected?.alive)return '';
 const code=A.cardCode(selected.card),ranks={A:'Ace',K:'King',Q:'Queen',J:'Jack'},suits={S:'Spades',H:'Hearts',D:'Diamonds',C:'Clubs'};
 const suit=code[0],rank=code.slice(2),label=(ranks[rank]||rank)+' of '+(suits[suit]||'Unknown');
 return `<div class="modal playing-card-inspector" role="dialog" aria-modal="true" aria-label="Enlarged playing card">
  <div class="overline">MYSTIC ROYALE · CARD INSPECTOR</div><h2>${esc(label)}</h2>
  <img src="${image(selected.card)}" alt="${esc(label)}" width="240" height="336">
  <p>Territory ${state.chosen+1} · Rank ${A.rank(selected.card)} · Current selection is preserved.</p>
  <button type="button" class="cta" data-act="close-playing">RETURN TO DECISION</button>
 </div>`;
}
if(k==='pass')return `<div class="modal" role="dialog" aria-modal="true" style="max-width:540px;text-align:center"><div class="overline">DECISION LOCKED & SEALED</div><h2>PASS THE TABLE.</h2><p>Player 1 has committed a hidden decision. Hand the device to Player 2 without revealing the tactical hand.</p><button class="cta" data-act="ready">PLAYER 2 IS READY →</button></div>`;
if(k==='sudden')return `<div class="modal" role="dialog" aria-modal="true" style="max-width:570px;text-align:center"><div class="overline">A DRAW AFTER REGULATION</div><h2>SUDDEN DEATH.</h2><p>Three new dealer draws. Equal fresh battlegrounds. No collectible abilities. If the game remains tied, a draw is declared.</p><button class="cta" data-act="sudden">BEGIN SUDDEN DEATH →</button></div>`;
const ev=m.last;if(!ev)return '';
const playerResults=ev.detail.map((d,i)=>`<div class="outcome ${d.ok?'win':d.shield?'':'lose'}"><strong>${state.mode==='cpu'?(i===0?'YOU':'CPU'):'PLAYER '+(i+1)} · ${d.ok?'CORRECT':d.shield?'PROTECTED':'BURNED'}</strong><small>Target ${d.idx+1}: ${A.cardCode(d.reference)}<br>${d.guess} → ${A.cardCode(d.draw)}${d.tie?' · TIED RANK':''}</small><small>${d.cardId?esc(A.CARDS[d.cardId].name):'No tactical card'} · ${d.remaining} survivors</small></div>`).join('');
if(k==='finish'){
const r=m.result,title=r.winner===null?'MATCH DRAW':state.mode==='cpu'?(r.winner===0?'YOU WIN!':'CPU WINS!'):'PLAYER '+(r.winner+1)+' WINS';
return `<div class="modal" role="dialog" aria-modal="true"><div class="overline">✦ THE FINAL VERDICT ✦</div><h2>${title}</h2><p>${r.winner===null?'Even sudden death could not separate the contenders.':'Territory preservation decides the victor.'}</p>
<img class="dealer-large" alt="Final dealer card" src="${image(ev.draw)}"><div class="results-grid">${r.scores.map((p,i)=>`<div class="outcome ${r.winner===i?'win':''}"><strong>${state.mode==='cpu'?(i===0?'YOU':'CPU'):'PLAYER '+(i+1)}</strong><small>${p.survivors} live · ${p.hits} correct · ${p.burns} burned</small></div>`).join('')}</div>
<button class="cta" data-act="rematch">REMATCH / NEW SHUFFLE</button><button class="button" style="width:100%;margin-top:13px" data-act="lobby">RETURN TO DECK HALL</button></div>`;
}
return `<div class="modal" role="dialog" aria-modal="true"><div class="overline">SHARED DEALER · ${ev.round.toUpperCase()} DRAW ${ev.turn}</div><h2>THE CARD REVEALS.</h2><img class="dealer-large" alt="Dealer ${A.cardCode(ev.draw)}" src="${image(ev.draw)}"><div class="results-grid">${playerResults}</div><button class="cta" data-act="continue">CONTINUE →</button></div>`;
}
function render(){
 const sealed=['pass','reveal','finish','sudden'].includes(state.overlay);
 screen.innerHTML=state.scene==='lobby'?lobby():sealed?
 '<section class="sealed-table"><span>✥</span><h2>THE TABLE IS SEALED</h2><p>Decisions and tactical hands are hidden during handoffs and reveals.</p></section>':game();
 overlay.innerHTML=modalView();
}
function start(){
 const invalid=state.decks.map(A.validateDeck).filter(Boolean);
 if(invalid.length){state.error=invalid[0];alert(state.error);return;}
 const names=state.mode==='cpu'?['YOU','CPU · '+CPU.DIFFICULTIES[state.cpuDifficulty].label.toUpperCase()]:['PLAYER ONE','PLAYER TWO'];
 state.m=A.createMatch({decks:state.decks.map(x=>x.slice()),names});
 state.cpuInitial=state.mode==='cpu'?state.m.players[0].board.map(c=>c.card):null;
 state.scene='game';state.overlay=null;reset();render();
}
document.addEventListener('click',event=>{
const b=event.target.closest('[data-act]');if(!b)return;const x=b.dataset.act,id=b.dataset.id,i=Number(b.dataset.idx),m=state.m;
if(x==='jump-board'||x==='jump-controls'||x==='jump-hand'){
 const selector=x==='jump-board'?'.war-panel.player':x==='jump-controls'?'.action-dock':'.hand-shell';
 document.querySelector(selector)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 return;
}
if(x==='builder'){state.editor=Number(b.dataset.player);state.overlay='builder';}
if(x==='inspect'){state.inspect=id;state.returnOverlay=state.overlay;state.overlay='inspect';}
if(x==='close-inspect'){state.overlay=state.returnOverlay||null;state.inspect=null;state.returnOverlay=null;}
if(x==='close')state.overlay=null;
if(x==='view-playing'&&m?.phase==='commit'&&state.chosen!=null&&m.players[me()]?.board[state.chosen]?.alive){state.overlay='view-playing';}
if(x==='close-playing')state.overlay=null;
if(x==='add'){const d=state.decks[state.editor];if(d.length<12&&d.filter(k=>k===id).length<2)d.push(id);}
if(x==='remove'){const d=state.decks[state.editor],idx=d.indexOf(id);if(idx>=0)d.splice(idx,1);}
if(x==='save'&&!A.validateDeck(state.decks[state.editor])){try{localStorage.setItem('hl-arena-decks-v1',JSON.stringify(state.decks));}catch(_){}state.overlay=null;}
if(x==='start-cpu'){state.mode='cpu';start();return;}
if(x==='start'){state.mode='hotseat';start();return;}
if(x==='rematch'){start();return;}
if(x==='lobby'){state.scene='lobby';state.overlay=null;state.m=null;state.cpuInitial=null;reset();}
if(x==='ready'){state.overlay=null;reset();}
if(x==='sudden'){A.continueSuddenDeath(m);if(state.mode==='cpu')state.cpuInitial=m.players[0].board.map(c=>c.card);state.overlay=null;reset();}
if(x==='continue'){state.overlay=m.phase==='intermission'?'sudden':null;reset();}
if(x==='card'){
 const idx=state.chosen;
 state.card=state.card===id?null:id;
 state.target=idx!=null&&['heartward','steady','rooted','secondwind'].includes(state.card)?idx:null;
 if(idx!=null&&!A.offer(m,me(),state.card,state.target).includes(idx))state.chosen=null;
 state.error='';
}
if(x==='clear'){state.card=null;state.target=null;state.chosen=null;}
if(x==='enemy'&&state.card==='crosswind'&&m.players[1-me()].board[i]?.alive)state.target=i;
if(x==='own'){
 if(state.card==='secondwind')state.target=i;
 if(A.offer(m,me(),state.card,state.target).includes(i)){state.chosen=i;state.error='';if(['heartward','steady','rooted','secondwind'].includes(state.card))state.target=i;}
 else state.error="That position is resting or outside the current offer.";
}
if(x==='guess')state.guess=b.dataset.value;
if(x==='lock'){
 const n=me(),move={idx:state.chosen,guess:state.guess,cardId:state.card,cardTarget:state.target},err=A.inspectMove(m,n,move);
 if(err)state.error=err;else{
  A.commit(m,n,move);
  if(state.mode==='cpu'){
    const response=CPU.choose(m,{difficulty:state.cpuDifficulty,initialBoard:state.cpuInitial});
    A.commit(m,1,response);
  }
  reset();
  state.overlay=state.mode==='hotseat'&&m.next===1?'pass':m.phase==='finished'?'finish':'reveal';
}
}
render();
});
document.addEventListener('change',event=>{
const b=event.target.closest('[data-change]');if(!b)return;
if(b.dataset.change==='cpu-difficulty'&&CPU.DIFFICULTIES[b.value])state.cpuDifficulty=b.value;
if(b.dataset.change==='preset'&&A.STARTERS[b.value])state.decks[Number(b.dataset.player)]=A.STARTERS[b.value].slice();
if(b.dataset.change==='starter'&&A.STARTERS[b.value])state.decks[state.editor]=A.STARTERS[b.value].slice();
render();
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&state.overlay==='view-playing'){state.overlay=null;render();}
});
globalThis.ArenaApp={getState:()=>state,render,start};
render();
})();
