const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {setup}=require('./helpers.cjs');
const bank=require('../data/bank.json');
test('every set reference and legacy alias resolves to a unique card',()=>{
 const ids=new Set(bank.cards.map(c=>c.id));assert.equal(ids.size,bank.cards.length);
 for(const set of bank.sets){assert.equal(set.cardIds.length,new Set(set.cardIds).size);for(const id of set.cardIds)assert(ids.has(id),id)}
 for(const id of Object.values(bank.aliases))assert(ids.has(id)&&!Object.hasOwn(bank.aliases,id));
});
test('all cards have an answer and every preset quiz offers its answer',()=>{for(const c of bank.cards){assert(c.q.trim()&&c.a.trim(),c.id);if(c.options){assert(c.options.includes(c.a),c.id);assert.equal(new Set(c.options).size,c.options.length)}}});
test('extracted embedded images exist',()=>{for(const c of bank.cards)if(c.image?.startsWith('assets/'))assert(fs.existsSync(path.join(__dirname,'..',c.image)),c.image)});
test('generated bank matches editable JSON source',()=>{const t=setup();assert.equal(t.run('JSON.stringify(AQ_BANK)'),JSON.stringify(bank))});
test('duplicate progress merges once, preserves answers and latest schedule',()=>{
 const t=setup(),[alias,id]=Object.entries(bank.aliases)[0];
 const raw={[alias]:{seen:3,correct:2,wrong:1,last:10,dueAt:100},[id]:{seen:2,correct:1,wrong:1,last:20,dueAt:200}};
 const result=JSON.parse(t.run(`JSON.stringify(migrateStats(${JSON.stringify(raw)}))`));assert.equal(result[id].seen,5);assert.equal(result[id].correct,3);assert.equal(result[id].dueAt,200);assert.equal(result[alias],undefined);assert.equal(t.run(`JSON.stringify(migrateStats(${JSON.stringify(result)}))`),JSON.stringify(result));
});
test('valid backup round trips and malformed backups are rejected',()=>{
 const t=setup();assert.equal(t.run("checkedBackup({version:'3.7.1',state:defaults()}).customSets.length"),0);
 for(const payload of [null,{}, {version:'3.8.0',state:{customSets:[],sessions:[],cardStats:[]}}])assert.throws(()=>t.run(`checkedBackup(${JSON.stringify(payload)})`));
 assert.throws(()=>t.run("checkedBackup({version:'3.8.0',state:{...defaults(),customSets:[{id:\"bad'id\",title:'X',cards:[{id:'c',q:'Q',a:'A'}]}]}})"));
});
test('checkpoint resumes pending feedback after the answered question',()=>{
 const t=setup();t.run("openStudy(BUILTIN_SETS[0].id,'test');current.session.answers=1;current.session.correct=1;current.session.pending=true;checkpointStudy();current.session=null;resumeStudy()");assert.equal(t.run('current.index'),1);assert.equal(t.run('current.session.answers'),1);assert.equal(t.run('current.session.pending'),false);
});
test('catalogue supports custom and due filters without mutating source',()=>{
 const t=setup();t.run("state.customSets=[{id:'custom-set',title:'TEST',subject:'Гистология',cards:[{id:'custom-card',q:'Q',a:'A'}]}];catalogFilter.subject='Гистология';catalogFilter.status='mine'");assert.equal(t.run("filteredCatalog('test').length"),1);t.run("catalogFilter.status='due'");assert.equal(t.run("filteredCatalog('').length"),0);
});
test('numbered respiratory cards match the reviewed source legend',()=>{const expected=[6,10,16,18,21,25,31,38];expected.forEach((number,i)=>{const c=bank.cards.find(c=>c.id==='vis25-'+(12+i));assert.equal(c.imageNumber,number);assert.match(c.q,new RegExp(' '+number+' '));assert(c.imageSourceUrl)})});
test('direct Cards navigation creates a usable session',()=>{const t=setup();t.run("showView('study');reveal();grade('good')");assert.equal(t.run('current.session.answers'),1);assert.equal(t.run('current.index'),1)});
