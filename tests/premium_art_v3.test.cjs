'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {REGISTRY}=require('../arena/engine.js');

test('every playable tactical character has a distinct optimized premium portrait asset',()=>{
  assert.equal(REGISTRY.length,12);
  const checks=new Set();
  for(const c of REGISTRY){
    const file=path.join(__dirname,'..','arena','art-premium',c.id+'.webp');
    assert.ok(fs.existsSync(file),'Missing art for '+c.id);
    const buf=fs.readFileSync(file);
    assert.equal(buf.toString('ascii',0,4),'RIFF','Not a WebP RIFF: '+c.id);
    assert.equal(buf.toString('ascii',8,12),'WEBP','Not WebP: '+c.id);
    assert.ok(buf.length>=2000,'Image too small: '+c.id);
    assert.ok(buf.length<=200000,'Image exceeds mobile asset budget: '+c.id);
    const sha=crypto.createHash('sha256').update(buf).digest('hex');
    assert.ok(!checks.has(sha),'Duplicated exact artwork '+c.id);
    checks.add(sha);
  }
});
test('Arena visual layer is loaded and layout preserves clean gameplay rules',()=>{
  const html=fs.readFileSync(path.join(__dirname,'..','arena','index.html'),'utf8');
  const js=fs.readFileSync(path.join(__dirname,'..','arena','app.js'),'utf8');
  const css=fs.readFileSync(path.join(__dirname,'..','arena','unified.css'),'utf8');
  assert.match(html,/href="\.\/unified\.css"/);
  assert.match(js,/new Set\(A\.REGISTRY\.map\(c=>c\.id\)\)/);
  assert.match(js,/class="arena-main-grid"/);
  assert.match(css,/\.play-tile:disabled\s*\{\s*opacity:1/);
});
