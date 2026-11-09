/* BATTLEGROUND V8 Tactical mechanics. node --test tests/v8-tactical.test.cjs */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const start=html.indexOf('function tacticalCooldowns(){'),end=html.indexOf('function v8CardPath(',start);
assert.ok(start>=0&&end>start,'Production tactical functions must be present');
const production=html.slice(start,end);
function engine({mode='tactical',grid=4,cells, moves=[]}={}){
 const cfg={ruleset:mode,grid};
 const game={cells:cells||Array(grid*grid).fill(0).map((_,i)=>({card:i,alive:true})),moves,shoe:[]};
 const context={cfg,game,numPlayed:()=>game.moves.length};
 vm.createContext(context);
 vm.runInContext(production+';this.api={targetOffer,tacticalCooldowns,eligibleTarget}',context);
 return {api:context.api,game};
}
test('Classic preserves free selection of every living position',()=>{
 const {api}=engine({mode:'classic'});assert.equal(api.targetOffer().length,16);
 assert.equal(api.eligibleTarget(15),true);
});
test('Tactical offers exactly three positions from 4x4 or 3x3',()=>{
 for(const grid of [3,4]){
  const {api}=engine({grid});
  assert.deepEqual(Array.from(api.targetOffer()),[2,3,4]);
 }
});
test('Target offers are deterministic and independent of hidden dealer cards',()=>{
 const a=engine(),b=engine();
 a.game.shoe=[4,18,27];b.game.shoe=[42,30,10];
 assert.deepEqual(Array.from(a.api.targetOffer()),Array.from(b.api.targetOffer()));
});
test('Two successful uses put a space on a two-turn cooldown',()=>{
 const moves=[{idx:2,ok:true},{idx:2,ok:true}];
 const {api,game}=engine({moves});
 assert.equal(api.tacticalCooldowns().until[2],4);
 assert.equal(api.tacticalCooldowns().heat[2],0);
 assert.equal(api.eligibleTarget(2),false);
 game.moves.push({idx:1,ok:false});
 assert.equal(api.tacticalCooldowns().until[2],4);
 game.moves.push({idx:1,ok:false});
 assert.equal(api.tacticalCooldowns().until[2],4);
});
test('Never deadlocks when all surviving positions are resting',()=>{
 const cells=Array(9).fill(0).map((_,i)=>({card:i,alive:i<2}));
 const {api}=engine({grid:3,cells,moves:[{idx:0,ok:true},{idx:0,ok:true},{idx:1,ok:true},{idx:1,ok:true}]});
 assert.ok(api.targetOffer().length>0);
});
test('Burned positions are never offered',()=>{
 const cells=Array(16).fill(0).map((_,i)=>({card:i,alive:i!==2&&i!==3}));
 const {api}=engine({cells});
 assert.equal(api.targetOffer().includes(2),false);
 assert.equal(api.targetOffer().includes(3),false);
});
