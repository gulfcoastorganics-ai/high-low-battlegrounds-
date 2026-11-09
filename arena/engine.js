/* HIGH / LOW: BATTLEGROUNDS — Arena core. UMD, no DOM dependencies.
   Local hotseat simulator only. Online ranked requires a trusted authoritative backend. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ArenaEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SUITS = ['C', 'D', 'H', 'S'];
  const REGISTRY = [
    {id:'precision',name:'Precision Strike',suit:'S',rarity:'rare',cost:2,kind:'offer',target:'none',text:'Choose from every ready position instead of three.'},
    {id:'survey',name:'Wide Angle',suit:'S',rarity:'common',cost:1,kind:'offer',target:'none',text:'Expand this turn\'s offer from three to six.'},
    {id:'reckoning',name:'Dead Reckoning',suit:'S',rarity:'uncommon',cost:1,kind:'success',target:'none',text:'On a correct prediction at under 40% displayed odds, gain 2 Focus.'},
    {id:'heartward',name:'Heartward',suit:'H',rarity:'rare',cost:2,kind:'defense',target:'selected',text:'If this prediction fails, preserve the selected position instead of burning it.'},
    {id:'secondwind',name:'Second Wind',suit:'H',rarity:'common',cost:1,kind:'offer',target:'selected',text:'Refresh your selected position, making it eligible despite fatigue.'},
    {id:'steady',name:'Steady Hand',suit:'H',rarity:'uncommon',cost:1,kind:'defense',target:'selected',text:'Preserve the selected position if the next dealer rank ties it.'},
    {id:'reserve',name:'Golden Reserve',suit:'D',rarity:'common',cost:1,kind:'resource',target:'none',text:'Gain 2 Focus after paying this card\'s cost, up to the cap of 5.'},
    {id:'exchange',name:'Calculated Exchange',suit:'D',rarity:'uncommon',cost:1,kind:'draw',target:'none',text:'Draw one tactical card after resolution, if your deck and hand permit.'},
    {id:'investment',name:'Investment',suit:'D',rarity:'epic',cost:2,kind:'success',target:'none',text:'If your prediction succeeds, gain 3 Focus, up to the cap.'},
    {id:'crosswind',name:'Crosswind',suit:'C',rarity:'rare',cost:2,kind:'disrupt',target:'enemy',text:'Block one enemy position from its next target offer. Cannot prevent all legal moves.'},
    {id:'irongrip',name:'Iron Grip',suit:'C',rarity:'uncommon',cost:2,kind:'disrupt',target:'none',text:'Opponent tactical cards cost 1 more Focus next turn.'},
    {id:'rooted',name:'Rooted Defense',suit:'C',rarity:'common',cost:1,kind:'defense',target:'selected',text:'Your selected position does not gain fatigue on a success this turn.'}
  ];
  const CARDS = Object.fromEntries(REGISTRY.map(c => [c.id, Object.freeze(c)]));
  const STARTERS = Object.freeze({
    balanced:REGISTRY.map(c => c.id),
    guardian:['heartward','heartward','secondwind','secondwind','steady','steady','rooted','rooted','survey','precision','reserve','exchange'],
    tactician:['precision','precision','survey','survey','reckoning','reckoning','crosswind','crosswind','irongrip','reserve','investment','exchange']
  });
  const MAX_FOCUS = 5;
  const rank = id => id % 13 + 2;
  const cardCode = id => SUITS[Math.floor(id / 13)] + '-' + (rank(id) === 14 ? 'A' : rank(id) === 13 ? 'K' : rank(id) === 12 ? 'Q' : rank(id) === 11 ? 'J' : rank(id));
  const compare = (ref, draw, guess) => guess === 'HIGHER' ? rank(draw) > rank(ref) : guess === 'LOWER' ? rank(draw) < rank(ref) : false;
  const remaining = p => p.board.filter(c => c.alive).length;
  function randInt(max) {
    const cap = Math.floor(4294967296 / max) * max;
    let n;
    do {
      if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
        const data = new Uint32Array(1); globalThis.crypto.getRandomValues(data); n = data[0];
      } else if (typeof require === 'function') {
        n = require('node:crypto').randomBytes(4).readUInt32BE();
      } else throw new Error('A secure random source is required');
    } while (n >= cap);
    return n % max;
  }
  function shuffle(items) {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; --i) {
      const j = randInt(i+1); [out[i],out[j]] = [out[j],out[i]];
    }
    return out;
  }
  function validDealer(deck) {
    return Array.isArray(deck) && deck.length === 52 &&
      deck.every(x => Number.isInteger(x) && x >= 0 && x < 52) && new Set(deck).size === 52;
  }
  function validateDeck(deck) {
    if (!Array.isArray(deck) || deck.length !== 12) return 'A deck must contain exactly 12 cards.';
    const count = {};
    for (const id of deck) {
      if (!CARDS[id]) return 'Unknown card: ' + id;
      count[id] = (count[id] || 0) + 1;
      if (count[id] > (CARDS[id].rarity === 'legendary' ? 1 : 2)) return 'Too many copies of ' + CARDS[id].name + '.';
    }
    return '';
  }
  function newPlayer(name, initial, deck) {
    const ordered = shuffle(deck);
    return {name,board:initial.map(card => ({card,alive:true,heat:0,restUntil:0})),
      focus:2,hits:0,burns:0,hand:ordered.slice(0,3),drawPile:ordered.slice(3),discard:[],
      blocked:null,tax:null,played:0};
  }
  function drawTactical(p) { if (p.hand.length < 5 && p.drawPile.length) p.hand.push(p.drawPile.shift()); }
  function startTurn(m) {
    for (const p of m.players) { p.focus = Math.min(MAX_FOCUS,p.focus+1); drawTactical(p); }
    m.phase = 'commit'; m.next = 0; m.commits = [null,null];
  }
  function createMatch(opts = {}) {
    const dealer = opts.dealer ? opts.dealer.slice() : shuffle(Array.from({length:52},(_,i)=>i));
    if (!validDealer(dealer)) throw new Error('Dealer must be a permutation of 52 unique standard cards.');
    const decks = opts.decks || [STARTERS.balanced,STARTERS.balanced];
    for (const d of decks) { const why = validateDeck(d); if (why) throw new Error(why); }
    const initial = dealer.slice(0,16), names = opts.names || ['PLAYER ONE','PLAYER TWO'];
    const m = {version:1,turn:1,maxTurns:18,round:'arena',phase:'commit',next:0,
      dealer,players:[newPlayer(names[0],initial,decks[0]),newPlayer(names[1],initial,decks[1])],
      commits:[null,null],history:[],last:null,result:null};
    startTurn(m);
    return m;
  }
  function knownOdds(m, ref) {
    // Only public starting board and PREVIOUS dealer draws, never unrevealed cards.
    const known = new Set(m.dealer.slice(0,16+m.turn-1));
    let higher=0,lower=0,tie=0;
    for (let i=0;i<52;i++) if (!known.has(i)) {
      if(rank(i)>rank(ref)) higher++;
      else if(rank(i)<rank(ref)) lower++;
      else tie++;
    }
    return {higher,lower,tie,total:higher+lower+tie};
  }
  function offer(m, playerIndex, cardId=null, cardTarget=null) {
    const p = m.players[playerIndex], turn = m.turn;
    if (!p || m.phase === 'finished') return [];
    const live = p.board.map((cell,idx)=>({cell,idx})).filter(x=>x.cell.alive);
    if(!live.length) return [];
    let available=live.filter(x=>x.cell.restUntil<turn || (cardId==='secondwind' && x.idx===cardTarget));
    if(!available.length) available=[live.reduce((a,b)=>a.cell.restUntil<=b.cell.restUntil?a:b)];
    if(p.blocked && p.blocked.turn===turn) {
      const unrestricted=available.filter(x=>x.idx!==p.blocked.idx);
      if(unrestricted.length) available=unrestricted;
    }
    const ids=available.map(x=>x.idx).sort((a,b)=>a-b);
    if(cardId==='precision') return ids;
    const limit=cardId==='survey'?6:3;
    if(ids.length<=limit) return ids;
    const start=((turn-1)*3)%ids.length, result=[];
    for(let i=0;i<limit;i++) result.push(ids[(start+i)%ids.length]);
    // Second Wind explicitly makes its selected recovering slot a legal target.
    if(cardId==='secondwind' && ids.includes(cardTarget) && !result.includes(cardTarget)) result[result.length-1]=cardTarget;
    return result;
  }
  function price(m,playerIndex,id) {
    const p=m.players[playerIndex], c=CARDS[id];
    return c.cost + (p.tax && p.tax.turn===m.turn ? p.tax.value : 0);
  }
  function inspectMove(m,playerIndex,action) {
    if (m.phase!=='commit') return 'Match is not accepting decisions.';
    if (playerIndex!==m.next || m.commits[playerIndex]) return 'Not this player\'s turn to commit.';
    if (!action || !Number.isInteger(action.idx) || !['HIGHER','LOWER'].includes(action.guess)) return 'Choose a position and HIGHER or LOWER.';
    if (m.round==='sudden' && action.cardId) return 'Sudden death uses standard cards only.';
    const p=m.players[playerIndex], id=action.cardId || null, c=id && CARDS[id], target=action.cardTarget;
    if (id) {
      if(!c || !p.hand.includes(id)) return 'Card is not in your hand.';
      if(p.focus < price(m,playerIndex,id)) return 'Insufficient Focus.';
      if(c.target==='selected' && target!==action.idx) return 'Ability must target the selected position.';
      if(c.target==='enemy' && (!Number.isInteger(target)||!m.players[1-playerIndex].board[target]?.alive)) return 'Choose a living enemy position.';
      if(c.target==='none' && target!=null) return 'This ability does not require a target.';
    }
    if(!offer(m,playerIndex,id,target).includes(action.idx)) return 'Target is not available this turn.';
    return '';
  }
  function commit(m,playerIndex,action) {
    const error=inspectMove(m,playerIndex,action); if(error) throw new Error(error);
    m.commits[playerIndex]={idx:action.idx,guess:action.guess,cardId:action.cardId||null,
      cardTarget:action.cardTarget==null?null:action.cardTarget};
    if(playerIndex===0) { m.next=1; return null; }
    return resolve(m);
  }
  function resolve(m) {
    if(!m.commits[0] || !m.commits[1]) throw new Error('Two locked actions required.');
    const draw=m.dealer[16+m.turn-1], detail=[];
    if(draw===undefined) throw new Error('Dealer exhausted.');
    // All resource payments and effects use the same pre-reveal state.
    for(let i=0;i<2;i++) {
      const p=m.players[i],a=m.commits[i],id=a.cardId;
      if(id) {
        p.focus -= price(m,i,id);
        p.hand.splice(p.hand.indexOf(id),1); p.discard.push(id); p.played++;
        if(id==='secondwind') { p.board[a.idx].restUntil=0; p.board[a.idx].heat=0; }
        if(id==='reserve') p.focus=Math.min(MAX_FOCUS,p.focus+2);
        if(id==='crosswind') m.players[1-i].blocked={turn:m.turn+1,idx:a.cardTarget};
        if(id==='irongrip') m.players[1-i].tax={turn:m.turn+1,value:1};
      }
    }
    for(let i=0;i<2;i++) {
      const p=m.players[i],a=m.commits[i],slot=p.board[a.idx],reference=slot.card;
      const odds=knownOdds(m,reference);
      const success=compare(reference,draw,a.guess),tie=rank(reference)===rank(draw);
      const shield=!success && (a.cardId==='heartward' || (a.cardId==='steady' && tie));
      if(success) {
        slot.card=draw; p.hits++;
        if(a.cardId!=='rooted') {slot.heat++; if(slot.heat>=2){slot.restUntil=m.turn+2; slot.heat=0;}}
        if(a.cardId==='reckoning' && (a.guess==='HIGHER'?odds.higher:odds.lower)/odds.total<.4) p.focus=Math.min(MAX_FOCUS,p.focus+2);
        if(a.cardId==='investment') p.focus=Math.min(MAX_FOCUS,p.focus+3);
      } else if(!shield) { slot.alive=false; p.burns++; }
      if(a.cardId==='exchange') drawTactical(p);
      detail.push({player:i,idx:a.idx,reference,guess:a.guess,draw,ok:success,tie,shield,
        cardId:a.cardId,odds,remaining:remaining(p)});
    }
    const event={round:m.round,turn:m.turn,draw,detail};
    m.history.push(event);m.last=event;
    const a=remaining(m.players[0]),b=remaining(m.players[1]);
    if(a===0 || b===0 || m.turn>=m.maxTurns) {
      const winner=compareScores(m);
      if(winner===null && m.round==='arena') {
        const fresh=shuffle(Array.from({length:52},(_,i)=>i));
        m.dealer=fresh;m.round='sudden';m.turn=1;m.maxTurns=3;
        for(const p of m.players){p.board=fresh.slice(0,16).map(card=>({card,alive:true,heat:0,restUntil:0}));p.hits=0;p.burns=0;p.blocked=null;p.tax=null;}
        m.phase='intermission';m.next=0;m.commits=[null,null];
        return event;
      }
      m.result={winner,round:m.round,reason:winner===null?'DRAW':'TERRITORY',
        scores:m.players.map(p=>({name:p.name,survivors:remaining(p),hits:p.hits,burns:p.burns}))};
      m.phase='finished'; m.next=-1;return event;
    }
    m.turn++;
    startTurn(m);
    return event;
  }
  function compareScores(m) {
    const [a,b]=m.players,liveA=remaining(a),liveB=remaining(b);
    if(liveA!==liveB) return liveA>liveB?0:1;
    if(a.hits!==b.hits) return a.hits>b.hits?0:1;
    return null;
  }
  function continueSuddenDeath(m) {
    if(m.phase!=='intermission') throw new Error('No sudden death intermission.');
    m.phase='commit';m.next=0;return m;
  }
  return {REGISTRY,CARDS,STARTERS,rank,cardCode,compare,shuffle,validDealer,validateDeck,
    createMatch,knownOdds,offer,price,inspectMove,commit,remaining,compareScores,continueSuddenDeath};
});