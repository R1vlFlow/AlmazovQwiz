const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ctx=vm.createContext({Date,console});
vm.runInContext(['data/quests.js','visual-learning.js','anatomy-data.js','quest-core.js'].map(f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8')).join('\n'),ctx);
const run=s=>vm.runInContext(s,ctx);
test('84 tasks: six formats, valid answers and provenance',()=>{
 assert.equal(run('MQ_TASKS.length'),84);assert.equal(run('new Set(MQ_TASKS.map(t=>t.id)).size'),84);assert.equal(run('new Set(MQ_TASKS.map(t=>t.type)).size'),6);
 assert(run('MQ_TASKS.every(t=>t.explanation && t.sources.length && t.sources.every(id=>MQ_SOURCES[id]) && MQ_PACKS.some(p=>p.id===t.pack))'));
 assert(run('MQ_TASKS.every(t=>mqGrade(t,t.type==="text"?t.answers[0]:t.answer))'));assert(run('MQ_TASKS.every(t=>!mqGrade(t,null))'));
});
test('Grading: normalization, exact sets, duplicates and order',()=>{
 assert(run('mqGrade(MQ_BY_ID.get("l3"),"  CoStA  ")'));assert(!run('mqGrade(MQ_BY_ID.get("l3"),"cos")'));
 assert(run('mqGrade(MQ_BY_ID.get("l4"),[3,1,0])'));assert(!run('mqGrade(MQ_BY_ID.get("l4"),[0,1,1])'));assert(!run('mqGrade(MQ_BY_ID.get("l4"),[0,1,2,3])'));
 assert(!run('mqGrade(MQ_BY_ID.get("h1"),[0,1,2])'));assert(!run('mqGrade(MQ_BY_ID.get("l1"),"0")'));
});
test('Daily mix is deterministic, unique, balanced and changes',()=>{
 assert.equal(run('JSON.stringify(mqDaily("2026-11-13"))'),run('JSON.stringify(mqDaily("2026-11-13"))'));assert.notEqual(run('JSON.stringify(mqDaily("2026-11-13"))'),run('JSON.stringify(mqDaily("2026-11-14"))'));
 assert.equal(run('new Set(mqDaily()).size'),14);assert(run('MQ_PACKS.every(p=>mqDaily().filter(id=>MQ_BY_ID.get(id).pack===p.id).length===2)'));
});
test('Reload cannot double reward; retries clear mistakes without farming XP',()=>{
 run('var q=mqClean();q.active={ids:["l1"],index:0,results:[],draft:null,checked:false,title:"Test"};mqRecord(q,MQ_BY_ID.get("l1"),1)');assert.equal(run('q.attempts'),1);assert.equal(run('q.mistakes.length'),1);
 run('q=mqClean(JSON.parse(JSON.stringify(q)));mqRecord(q,MQ_BY_ID.get("l1"),0)');assert.equal(run('q.attempts'),1);assert.equal(run('q.active.checked'),true);
 run('q.active={ids:["l1"],index:0,results:[],draft:null,checked:false};mqRecord(q,MQ_BY_ID.get("l1"),0)');assert.equal(run('q.solved.length'),1);assert.equal(run('q.mistakes.length'),0);
 run('q.active={ids:["l1"],index:0,results:[],draft:null,checked:false};mqRecord(q,MQ_BY_ID.get("l1"),0)');assert.equal(run('q.solved.length'),1);
});
test('Malformed saved data is repaired; old backups have empty quests',()=>{
 assert.equal(run('mqClean().solved.length'),0);assert.equal(run('mqClean({solved:["l1","l1","fake"],attempts:-3,correct:99}).solved.length'),1);
 assert.equal(run('mqClean({active:{ids:["fake"],results:[]}}).active'),null);assert.equal(run('mqClean({active:{ids:["l1"],results:["true"]}}).active'),null);
 assert.equal(run('mqClean({attempts:5,correct:99}).correct'),5);assert.equal(run('mqClean({active:{ids:["l1"],results:[],draft:999}}).active.draft'),null);
});
test('Streak counts calendar days',()=>{
 assert.equal(run('mqStreak(["2026-11-11","2026-11-12"],new Date(2026,10,13))'),2);assert.equal(run('mqStreak(["2026-11-10"],new Date(2026,10,13))'),0);
 assert.equal(run('mqStreak(["2026-10-31","2026-11-01","2026-11-02"],new Date(2026,10,2))'),3);
});
test('Actual product bootstrap preserves old progress and backups include quests',()=>{
 const {setup}=require('./helpers.cjs');const app=setup(JSON.stringify({betaAccepted:true,sessions:[{date:1,answers:3,correct:2}],customSets:[],cardStats:{}}),true);
 assert.match(app.element('view-home').innerHTML,/Как будем учиться/);assert.equal(app.run('state.sessions[0].answers'),3);
 app.run('mqStart("latin");mqSet(0);mqRecord(state.quest,mqTask(),0)');
 assert.equal(app.run('checkedBackup(JSON.parse(JSON.stringify({version:APP_VERSION,state}))).quest.solved.length'),1);
 assert.equal(app.run('checkedBackup({version:"3.8.0",state:defaults()}).quest.solved.length'),0);
});
test('Visual tasks have valid points, no out-of-bounds answers, and persist selection',()=>{
 assert.equal(run('MQ_TASKS.filter(t=>t.type==="hotspot").length'),34);
 assert(run('MQ_TASKS.filter(t=>t.type==="hotspot").every(t=>MQ_VISUALS[t.visual].points[t.answer] && MQ_VISUALS[t.visual].points.every(p=>p.every(n=>n>=0&&n<=100)))'));
 assert.equal(run('mqClean({active:{ids:["v1"],results:[],draft:1}}).active.draft'),1);
 assert(!run('mqGrade(MQ_BY_ID.get("v1"),0)'));assert(run('mqGrade(MQ_BY_ID.get("v1"),1)'));
});
test('Card self-grading requires reveal and rejects a stale double click',()=>{
 const {setup}=require('./helpers.cjs');const app=setup('{}',true);
 app.run('openStudy(allSets()[0].id,"cards");vlGrade("good",0)');assert.equal(app.run('current.session.answers'),0);
 app.run('current.revealed=true;vlGrade("good",0);vlGrade("good",0)');assert.equal(app.run('current.session.answers'),1);assert.equal(app.run('current.index'),1);
});
test('Anatomy plates cover 22 structures with both recognition and written recall',()=>{
 assert.equal(run('AN_PLATES.reduce((n,p)=>n+p.regions.length,0)'),22);
 assert.equal(run('MQ_TASKS.filter(t=>t.id.startsWith("an-")).length'),44);
 assert(run('AN_PLATES.every(p=>p.regions.every((r,i)=>{const a=MQ_BY_ID.get("an-"+p.id+"-"+r[0]),b=MQ_BY_ID.get(a.id+"-name");return a.answer===i&&b.marker===i&&mqGrade(b,r[1])&&mqGrade(b,r[2])&&a.sources.every(id=>MQ_SOURCES[id])}))'));
});
test('Anatomy source files and adaptations are local safe SVGs with attribution',()=>{
 const plates=JSON.parse(run('JSON.stringify(AN_PLATES)'));
 for(const p of plates){for(const file of [p.image,'assets/anatomy/'+p.id+'-source.svg']){const s=fs.readFileSync(path.join(__dirname,'..',file),'utf8');assert.match(s,/<svg/);assert(!/<script\b|<foreignObject\b|\sonload\s*=/i.test(s));}assert(p.author&&p.license&&p.licenseUrl&&p.source&&p.changes)}
});
test('Anatomy written drafts survive reload without leaking a correct answer',()=>{
 assert.equal(run('mqClean({active:{ids:["an-skull-frontal-name"],results:[],draft:"Os frontale"}}).active.draft'),'Os frontale');
 assert.equal(run('mqGrade(MQ_BY_ID.get("an-skull-frontal-name"),"mandibula")'),false);
 assert.equal(run('mqClean({active:{ids:["an-heart-aorta"],results:[],draft:4}}).active.draft'),4);
});
