// A single study renderer for both the scheduled course and the existing library.
function courseResult(id){const r=state.courseResults?.[id];return r&&Number.isInteger(r.correct)&&r.correct>=0&&r.total===12&&r.correct<=r.total?r:null}
home=function(){
 const completed=COURSE_SETS.filter(s=>courseResult(s.id)).length;
 document.getElementById('view-home').innerHTML=`<div class="course-heading"><div><span class="eyebrow">1 КУРС · I СЕМЕСТР · 2026/27</span><h1>Анатомия человека</h1><p class="muted">15 занятий · 60 часов · пройдено ${completed} из 15</p></div><button class="btn" onclick="showView('anatomy')">Атлас →</button></div>${state.activeStudy?'<div class="course-resume"><span>Сохранено незавершённое занятие</span><button class="btn primary" onclick="resumeStudy()">Продолжить занятие</button></div>':''}${state.quest?.active?'<div class="course-resume"><span>Сохранена интерактивная практика</span><button class="btn" onclick="showView(\'quests\')">Продолжить практику</button></div>':''}<div class="course-sections">${COURSE_SECTIONS.map((title,i)=>{const sets=COURSE_SETS.filter(s=>s.section===i);return `<section class="course-section"><header><h2>${title}</h2><span>${sets.length*4} ч · ${sets.length*12} вопросов</span></header>${sets.map(s=>{const r=courseResult(s.id);return `<article class="course-lesson"><span class="course-number">${String(s.lesson).padStart(2,'0')}</span><div class="course-topic"><h3>${esc(s.title)}</h3><p>4 ч · 12 вопросов${r?` · последняя проверка: ${r.correct}/${r.total}`:''}</p></div><div class="course-actions"><button class="btn" onclick="openStudy('${s.id}','cards')">Карточки</button><button class="btn primary" onclick="openStudy('${s.id}','test')">Проверка</button></div></article>`}).join('')}</section>`}).join('')}</div><details class="course-notes"><summary>О программе и материалах</summary><p>Темы и часы — по вашему тематическому плану практических занятий, 1 курс, I семестр 2026/2027. Все занятия по 4 часа, поэтому базовые наборы равные: по 12 вопросов. Число вопросов выбрано для приложения.</p><p>Всего 168 новых вопросов и 12 повторных в итоговом наборе. Это базовое повторение, а не полный перечень экзаменационных вопросов. Дополнительные наборы — в библиотеке, задания по схемам — в атласе и практике.</p><p>Источники: OpenStax Anatomy and Physiology 2e, главы 7–11; ссылки и границы покрытия — в документации программы. Вопросы по фасциям и топографии требуют дальнейшего расширения.</p></details>`;
};
const courseOpenBase=openStudy;
openStudy=function(id,mode='cards'){courseOpenBase(id,mode);if(current.session){current.session.setId=current.setId;checkpointStudy()}};
const courseShowBase=showView;
showView=function(view){
 // Navigation pauses a lesson; only the explicit final step completes it.
 if(view!=='study'&&current.session){checkpointStudy();current.session=null}
 courseShowBase(view);
};
function courseIsCards(){return ['cards','learn'].includes(current.mode)}
function courseChecked(){return current.session?.checkedAt===current.index}
function courseChoices(){
 const c=currentCard();if(current.options)return current.options;
 const answers=[...new Set(getSet(current.setId).cards.map(x=>x.a))].filter(a=>a!==c.a);
 // Shuffle once and persist the order with the question, including across reloads.
 const shuffled=answers.sort(()=>Math.random()-.5).slice(0,3);
 const choices=[c.a,...shuffled].sort(()=>Math.random()-.5);
 if(current.session.choiceAt===current.index&&Array.isArray(current.session.choices))return current.options=current.session.choices;
 current.session.choiceAt=current.index;current.session.choices=choices;return current.options=choices;
}
studyView=function(){
 if(!current.session)return;
 const s=getSet(current.setId),c=currentCard();if(!s||!c)return;
 current.session.setId=s.id;
 const cards=courseIsCards(),checked=courseChecked(),back=current.revealed;
 const choices=!cards&&current.mode!=='write'?courseChoices():[];
 document.getElementById('view-study').innerHTML=`<div class="course-study"><div class="course-study-top"><button class="btn" onclick="showView('home')">← Программа</button><span>${current.index+1} / ${current.order.length}</span></div><h1>${esc(s.title)}</h1><div class="vl-study-tabs" aria-label="Режим занятия">${[['cards','Карточки'],['test','Выбор ответа'],['write','Ввод ответа']].map(([id,label])=>`<button class="${current.mode===id||id==='cards'&&cards?'active':''}" onclick="switchMode('${id}')">${label}</button>`).join('')}</div><progress max="${current.order.length}" value="${current.index}" aria-label="Пройдено вопросов"></progress><div class="course-question">${cards?`<span class="eyebrow">${back?'ОТВЕТ':'ВОПРОС'}</span>${!back&&c.image?visualMarkup(c):''}<button class="vl-card-face" onclick="vlFlip()" aria-label="Перевернуть карточку"><span>${esc(back?c.a:c.q)}</span></button><button class="btn" onclick="vlFlip()">${back?'Показать вопрос':'Показать ответ'}</button>`:`<h2 tabindex="-1" id="course-question-title">${esc(c.q)}</h2>${c.image?visualMarkup(c):''}${current.mode==='write'?`<form onsubmit="event.preventDefault();checkWrite()"><label for="writeAnswer">Ваш ответ</label><input id="writeAnswer" class="input" autocomplete="off" ${checked?'disabled':''} oninput="current.session.draftAt=current.index;current.session.draft=this.value;checkpointStudy()" value="${esc(checked?current.session.given||'':current.session.draftAt===current.index?current.session.draft||'':'')}"><button class="btn primary" ${checked?'disabled':''}>Проверить</button><p id="course-input-error" role="status"></p></form>`:`<div class="course-options">${choices.map((a,i)=>`<button class="course-option ${checked&&a===c.a?'correct':''} ${checked&&a===current.session.given&&a!==c.a?'incorrect':''}" ${checked?'disabled':''} onclick="courseChoose(${i})"><span>${i+1}</span>${esc(a)}</button>`).join('')}</div>`}${checked?`<div class="course-feedback ${current.session.wasRight?'correct':'incorrect'}" role="status"><strong>${current.session.wasRight?'Верно':'Неверно'}</strong>${!current.session.wasRight?`<p>Ответ: ${esc(c.a)}</p>`:''}</div>`:''}`}</div><div class="course-study-bottom">${cards?`<button class="btn" ${current.index===0?'disabled':''} onclick="coursePrevious()">← Назад</button>`:`<span>${current.session.correct} / ${current.session.answers} верно</span>`}<button class="btn primary" ${!cards&&!checked?'disabled':''} onclick="courseNext()">${current.index===current.order.length-1?'Завершить':'Далее →'}</button></div>${c.sourceUrl?`<details class="course-source"><summary>Источник</summary><a href="${esc(c.sourceUrl)}" target="_blank" rel="noopener">${c.sourceUrl.includes("ncbi.nlm.nih.gov")?"NCBI Bookshelf · анатомия":"OpenStax · Anatomy and Physiology 2e"}</a></details>`:''}</div>`;
 checkpointStudy();
};
function courseMark(given,right){
 if(!current.session||courseIsCards()||courseChecked())return;
 const session=current.session;session.checkedAt=current.index;session.wasRight=right;session.given=given;
 session.answers++;session.correct+=Number(right);session.mistakes??=[];if(!right)session.mistakes.push(currentCard().id);
 answer(currentCard(),right?'good':'again');studyView();
}
function courseChoose(index){if(!current.session||courseIsCards()||courseChecked())return;const choice=courseChoices()[index];if(choice===undefined)return;courseMark(choice,choice===currentCard().a)}
checkWrite=function(){
 if(!current.session||current.mode!=='write'||courseChecked())return;
 const value=document.getElementById('writeAnswer').value.trim();
 if(!value){document.getElementById('course-input-error').textContent='Введите ответ';return}
 const c=currentCard(),normalize=s=>aqNormalizeAnswer(s).replace(/[.,;:!?]/g,'').replace(/(?:\s+(?:кость|мышца|сустав))$/u,'').replace(/^(?:кость|мышца|сустав)\s+/u,'').trim();
 const right=[c.a,...(c.acceptedAnswers||[])].some(a=>normalize(value)===normalize(a));courseMark(value,right);
};
// Retire legacy rating handlers as well as their buttons.
vlGrade=function(){};
grade=function(){};
chooseOption=courseChoose;
function coursePrevious(){if(!current.session||!courseIsCards()||current.index===0)return;current.index--;current.revealed=false;studyView()}
let courseLast=null;
function courseNext(){
 if(!current.session||!courseIsCards()&&!courseChecked())return;
 if(current.index+1<current.order.length){current.index++;current.revealed=false;current.options=null;studyView();document.getElementById('course-question-title')?.focus?.();return}
 const result={setId:current.setId,total:current.order.length,correct:current.session.correct,mode:current.mode,mistakes:[...(current.session.mistakes||[])],date:now(),review:!!current.session.review};
 courseLast=result;
 if(!courseIsCards()&&!result.review){if(!state.courseResults||typeof state.courseResults!=='object'||Array.isArray(state.courseResults))state.courseResults={};state.courseResults[result.setId]=result}
 finishSession();save();
 document.getElementById('view-study').innerHTML=`<div class="course-summary"><span class="eyebrow">${result.review?'ПОВТОРЕНИЕ ОШИБОК':'ЗАНЯТИЕ ЗАВЕРШЕНО'}</span><h1>${['cards','learn'].includes(result.mode)?'Карточки просмотрены':`${result.correct} из ${result.total}`}</h1><p>${esc(getSet(result.setId).title)}</p><div class="course-actions">${result.mistakes.length?'<button class="btn primary" onclick="courseRetry()">Повторить ошибки ('+result.mistakes.length+')</button>':''}<button class="btn" onclick="openStudy('${result.setId}','test')">Пройти проверку заново</button><button class="btn" onclick="showView('home')">К программе</button></div></div>`;
}
nextCard=courseNext;
function courseRetry(){if(!courseLast?.mistakes.length)return;const result=courseLast;openStudy(result.setId,result.mode);current.order=getSet(result.setId).cards.filter(c=>result.mistakes.includes(c.id));current.session.total=current.order.length;current.session.review=true;current.options=null;delete current.session.choices;delete current.session.choiceAt;studyView()}
