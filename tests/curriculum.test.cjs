const {test}=require('node:test');
const assert=require('node:assert/strict');
const {setup}=require('./helpers.cjs');
test('Semester has 15 equal four-hour lessons, 168 unique questions and a shared final review',()=>{
 const app=setup('{}',true);
 assert.equal(app.run('COURSE_SETS.length'),15);
 assert(app.run('COURSE_SETS.every(s=>s.hours===4&&s.cards.length===12)'));
 assert.equal(app.run('new Set(COURSE_SETS.flatMap(s=>s.cards.map(c=>c.id))).size'),168);
 assert.equal(app.run('JSON.stringify(COURSE_SECTIONS.map((_,i)=>COURSE_SETS.filter(s=>s.section===i).length))'),'[4,3,7,1]');
 assert.match(app.element('view-home').innerHTML,/Мышцы, фасции и топография голени и стопы/);
 assert(app.run('COURSE_SETS.every(s=>s.cards.every(c=>c.sourceUrl.startsWith("https://")))'));
});
test('Objective feedback waits for next, survives reload and cannot score twice',()=>{
 let app=setup('{}',true);app.run('openStudy("course-1","test");courseChoose(courseChoices().indexOf(currentCard().a));courseChoose(courseChoices().indexOf(currentCard().a))');
 assert.equal(app.run('current.session.answers'),1);assert.equal(app.run('current.index'),0);
 const saved=app.run('JSON.stringify(state)');app=setup(saved,true);app.run('resumeStudy();courseChoose(courseChoices().indexOf(currentCard().a))');
 assert.equal(app.run('current.session.answers'),1);assert.equal(app.run('courseChecked()'),true);
 app.run('courseNext()');assert.equal(app.run('current.index'),1);assert.equal(app.run('courseChecked()'),false);
 assert.doesNotMatch(app.element('view-study').innerHTML,/Почему это правильно|Карточка предназначена|Точная цитата|Сложно|Легко/);
});
test('Completing a set records actual score; retry only contains errors and does not replace full score',()=>{
 const app=setup('{}',true);app.run('openStudy("course-2","test");courseChoose(courseChoices().findIndex(a=>a!==currentCard().a));courseNext();while(current.session){courseChoose(courseChoices().indexOf(currentCard().a));courseNext()}');
 assert.equal(app.run('state.courseResults["course-2"].correct'),11);
 assert.equal(app.run('state.sessions[0].answers'),12);
 app.run('courseRetry()');assert.equal(app.run('current.order.length'),1);
 app.run('courseChoose(courseChoices().indexOf(currentCard().a));courseNext()');
 assert.equal(app.run('state.courseResults["course-2"].correct'),11);
 assert.equal(app.run('state.sessions[0].correct'),1);
});
test('Written answer is required; accepts optional anatomical noun and rejects unrelated text',()=>{
 const app=setup('{}',true);app.run('openStudy("course-2","write");current.order=[COURSE_SETS[1].cards[0],COURSE_SETS[1].cards[1]];studyView();checkWrite()');
 assert.equal(app.run('current.session.answers'),0);
 app.element('writeAnswer').value='Лобная кость';app.run('checkWrite();checkWrite()');assert.equal(app.run('current.session.correct'),1);
 app.run('courseNext()');app.element('writeAnswer').value='не знаю';app.run('checkWrite()');assert.equal(app.run('current.session.correct'),1);assert.equal(app.run('current.session.answers'),2);
});
test('Browsing, leaving midway and switching modes never mark a lesson complete',()=>{
 const app=setup('{}',true);app.run('openStudy("course-3","cards");while(current.session)courseNext()');
 assert.equal(app.run('Object.keys(state.courseResults||{}).length'),0);
 app.run('openStudy("course-3","test");courseChoose(courseChoices().indexOf(currentCard().a));showView("home")');
 assert.equal(app.run('Object.keys(state.courseResults||{}).length'),0);
 app.run('openStudy("course-3","test");switchMode("write")');assert.equal(app.run('current.session.answers'),0);
});
test('Course progress and active feedback round trip through existing backups',()=>{
 const app=setup('{}',true);app.run('openStudy("course-4","test");courseChoose(courseChoices().indexOf(currentCard().a))');
 const saved=app.run('JSON.stringify(checkedBackup(JSON.parse(JSON.stringify({version:APP_VERSION,state}))))');
 const restored=setup(saved,true);restored.run('resumeStudy()');assert.equal(restored.run('courseChecked()'),true);assert.equal(restored.run('current.session.correct'),1);
});
