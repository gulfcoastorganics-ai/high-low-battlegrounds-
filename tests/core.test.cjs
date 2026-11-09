const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const core=html.match(/\/\* BATTLEGROUND_V6_RULES_START \*\/[\s\S]*?\/\* BATTLEGROUND_V6_RULES_END \*\//)?.[0];
assert.ok(core,'The exact production rules source is embedded in index.html');
const context={Uint32Array,Set,Array,Number,Error,Object};
vm.runInNewContext(core+';globalThis.rules=Rules;',context);const R=context.rules;
const clone=x=>JSON.parse(JSON.stringify(x));
function example(blind=false,actions=[]){
const deck=Array.from({length:52},(_,i)=>i),size=3,n=9;
const cells=deck.slice(0,n).map(card=>({card,alive:true,visible:!blind})),steps=[clone(cells)],moves=[],known=new Set(blind?[]:deck.slice(0,n));
let hits=0,burns=0;
actions.forEach(({idx,guess},turn)=>{const cell=cells[idx],ref=cell.card,draw=deck[n+turn],wasVisible=cell.visible,ok=R.compare(ref,draw,guess);
if(ok){cell.card=draw;cell.visible=true;hits++}else{cell.alive=false;burns++}
known.add(ref);known.add(draw);moves.push({idx,ref,draw,guess,ok,tie:R.rank(ref)===R.rank(draw),wasVisible});steps.push(clone(cells))});
return {grid:size,blind,stake:5,cells,steps,moves,shoe:deck.slice(n+actions.length),known:[...known],hits,burns};
}
for(let i=0;i<13;i++)test('ranks ascend from 2 to ace #'+i,()=>assert.equal(R.rank(i),i+2));
test('ties are not correct higher or lower',()=>{assert.equal(R.compare(0,13,'HIGHER'),false);assert.equal(R.compare(0,13,'LOWER'),false)});
test('higher/lower strict',()=>{assert.equal(R.compare(0,1,'HIGHER'),true);assert.equal(R.compare(1,0,'LOWER'),true)});
test('invalid direction is rejected',()=>assert.throws(()=>R.compare(0,1,'EVEN')));
test('rejection sampling discards overflow',()=>{let i=0;assert.equal(R.uniform(7,()=>i++===0?4294967295:5),5)});
test('shuffled deck has exactly 52 unique cards',()=>{let i=0;const d=R.shuffle(()=>i++*2654435761>>>0);assert.equal(new Set(d).size,52);assert.deepEqual([...d].sort((a,b)=>a-b),Array.from({length:52},(_,j)=>j))});
test('odds use only visible information',()=>{const d=R.odds([0,13],0);assert.equal(d.total,50);assert.equal(d.higher,48);assert.equal(d.tie,2);assert.equal(d.lower,0)});
test('ace has no higher rank',()=>{const d=R.odds([],12);assert.equal(d.higher,0);assert.equal(d.tie,4);assert.equal(d.lower,48)});
test('valid face-up save',()=>assert.equal(R.validSaved(example()),true));
test('valid blind revealed draw save',()=>assert.equal(R.validSaved(example(true,[{idx:0,guess:'HIGHER'}])),true));
test('valid burned-card save',()=>assert.equal(R.validSaved(example(false,[{idx:8,guess:'HIGHER'}])),true));
const bad={
 'duplicate card':a=>a.shoe[0]=a.shoe[1],
 'forged move draw':a=>a.moves[0].draw=8,
 'forged move correctness':a=>a.moves[0].ok=!a.moves[0].ok,
 'forged tie':a=>a.moves[0].tie=!a.moves[0].tie,
 'forged cell':a=>a.cells[0].card=51,
 'forged snapshot':a=>a.steps[1][0].card=33,
 'forged known card':a=>a.known.push(40),
 'forged opening':a=>a.steps[0][0].card=51,
 'forged score':a=>a.hits++,
 'invalid position':a=>a.moves[0].idx=99,
 'invalid guess':a=>a.moves[0].guess='MAYBE',
 'missing snapshot':a=>a.steps.pop(),
 'forged visibility':a=>a.cells[0].visible=false
};
for(const [name,mutate] of Object.entries(bad))test('reject '+name,()=>{const a=example(false,[{idx:0,guess:'HIGHER'}]);mutate(a);assert.equal(R.validSaved(a),false)});
