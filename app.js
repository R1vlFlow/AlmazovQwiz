const sets = [
  {id:'temporal', title:'Височная кость', subject:'Анатомия', meta:'42 карточки', icon:'◈', progress:42},
  {id:'skull', title:'Череп — общий обзор', subject:'Анатомия', meta:'58 карточек', icon:'◉', progress:58},
  {id:'headneck', title:'Мышцы головы и шеи', subject:'Анатомия', meta:'36 карточек', icon:'◇', progress:36},
  {id:'spine', title:'Позвоночник', subject:'Анатомия', meta:'47 карточек', icon:'▥', progress:47},
  {id:'heart', title:'Сердце', subject:'Анатомия', meta:'53 карточки', icon:'♥', progress:53},
  {id:'cell', title:'Клеточный цикл', subject:'Биология', meta:'28 карточек', icon:'◎', progress:28},
  {id:'medical', title:'Medical terminology', subject:'Английский язык', meta:'35 карточек', icon:'Aa', progress:35},
  {id:'histology', title:'Кровь — основы', subject:'Гистология', meta:'31 карточка', icon:'◌', progress:31}
];

const subjects = [
  {title:'Анатомия', count:'12 наборов', icon:'⌬'},
  {title:'Гистология', count:'8 наборов', icon:'◉'},
  {title:'Биология', count:'10 наборов', icon:'DNA'},
  {title:'Латинский язык', count:'6 наборов', icon:'Aa'}
];

const cards = [
  {q:'Что относится к частям височной кости?', a:'Каменная, барабанная и чешуйчатая части; также выделяют шиловидный и сосцевидный отростки.'},
  {q:'Как называется сонный канал?', a:'Canalis caroticus — сонный канал височной кости.'},
  {q:'Какая часть височной кости содержит костный лабиринт?', a:'Каменная часть (pars petrosa).'},
  {q:'Как называется сосцевидный отросток?', a:'Processus mastoideus.'}
];

const quiz = [
  {q:'Как называется структура, обозначенная на изображении?', options:['Canalis caroticus','Meatus acusticus internus','Foramen jugulare','Canalis nervi facialis'], correct:0},
  {q:'Какая часть височной кости называется pars petrosa?', options:['Барабанная','Каменная','Чешуйчатая','Сосцевидная'], correct:1},
  {q:'Как называется сосцевидный отросток?', options:['Processus styloideus','Processus mastoideus','Processus zygomaticus','Processus jugularis'], correct:1}
];

let state = JSON.parse(localStorage.getItem('aq_state') || '{"cardIndex":0,"seen":0,"correct":0,"betaAccepted":false,"theme":"light"}');
function save(){localStorage.setItem('aq_state',JSON.stringify(state));}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function iconSvg(type='brain'){return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="27" stroke="currentColor" stroke-width="2"/><path d="M28 39c-4-9 5-18 13-13 4-8 17-4 16 5 7 2 7 13 0 16-1 9-13 12-18 5-7 5-15-2-11-9Z" stroke="currentColor" stroke-width="2"/><path d="M40 28v25M30 40h20M48 33l-5 8 7 8" stroke="currentColor" stroke-width="1.7"/></svg>`}
function setCard(s){
 return `<article class="card set-card"><div class="set-cover">${iconSvg(s.id)}</div><div class="set-body"><h3>${s.title}</h3><p>${s.subject} · ${s.meta}</p><div class="set-row"><small class="muted">Последнее изучение: сегодня</small><button class="btn primary" onclick="openStudy('${s.id}')">Изучать</button></div></div></article>`
}
function home(){
 document.getElementById('view-home').innerHTML=`
  <div class="hero"><span class="eyebrow">ALMAZOVQWIZ · CLOSED BETA</span><h1>Учись эффективнее</h1><p>Интерактивные карточки, тесты, повторение и интеллектуальные учебные наборы для студентов.</p><button class="btn light" onclick="openStudy('temporal')">Продолжить обучение <b>→</b></button></div>
  <div class="section-head"><div><h2>Мои предметы</h2><p>Учебная библиотека</p></div><button class="link" onclick="showView('subjects')">Все предметы →</button></div>
  <div class="grid subjects-grid">${subjects.map(x=>`<article class="card subject-card" onclick="showView('sets')"><div class="subject-icon">${x.icon}</div><h3>${x.title}</h3><p>${x.count}</p></article>`).join('')}</div>
  <div class="section-head"><div><h2>Недавние наборы</h2><p>Продолжите с того места, где остановились</p></div><button class="link" onclick="showView('sets')">Все наборы →</button></div>
  <div class="grid sets-grid">${sets.slice(0,4).map(setCard).join('')}</div>
  <div class="section-head"><div><h2>Быстрый прогресс</h2></div></div>
  <div class="stat-grid"><div class="card stat"><small>Общий прогресс</small><strong>72%</strong><div class="progress-line"><span style="width:72%"></span></div></div><div class="card stat"><small>Изучено сегодня</small><strong>${state.seen}</strong><small>карточек</small></div><div class="card stat"><small>Точность</small><strong>${state.seen?Math.round(state.correct/state.seen*100):78}%</strong><small>за текущую сессию</small></div></div>`;
}
function setsView(){
 document.getElementById('view-sets').innerHTML=`<h1 class="page-title">Мои наборы</h1><p class="page-sub">Карточки и учебные материалы</p><div class="toolbar"><button class="select">Все предметы ▾</button><button class="select">1 курс ▾</button><button class="select">Сначала новые ▾</button></div><div class="grid sets-grid">${sets.map(setCard).join('')}</div>`;
}
function subjectsView(){
 document.getElementById('view-subjects').innerHTML=`<h1 class="page-title">Предметы</h1><p class="page-sub">Учебная библиотека beta-версии</p><div class="grid subjects-grid">${subjects.map(x=>`<article class="card subject-card" onclick="showView('sets')"><div class="subject-icon">${x.icon}</div><h3>${x.title}</h3><p>${x.count}</p></article>`).join('')}</div><div class="section-head"><div><h2>Темы</h2><p>Выберите предмет, чтобы перейти к наборам</p></div></div><div class="empty">Каталог учебных материалов будет расширяться по мере закрытого тестирования.</div>`;
}
function progressView(){
 const rows=[['Анатомия',76],['Биология',81],['Гистология',64],['Латинский язык',58]];
 document.getElementById('view-progress').innerHTML=`<h1 class="page-title">Мой прогресс</h1><p class="page-sub">Следите за изучением и повторяйте сложные темы</p><div class="stat-grid"><div class="card stat"><small>Общий прогресс</small><strong>72%</strong><div class="progress-line"><span style="width:72%"></span></div></div><div class="card stat"><small>Изучено наборов</small><strong>18</strong><small>из 42</small></div><div class="card stat"><small>Время обучения</small><strong>12 ч</strong><small>36 мин</small></div></div><div class="two-col" style="margin-top:18px"><div class="card panel"><h3>Прогресс по предметам</h3>${rows.map(r=>`<div class="topic-row"><span class="label">${r[0]}</span><div class="bar"><div class="progress-line"><span style="width:${r[1]}%"></span></div></div><small>${r[1]}%</small></div>`).join('')}</div><div class="card panel"><h3>Темы для повторения</h3>${['Височная кость','Клиновидная кость','Каналы основания черепа','Сердце'].map(x=>`<div class="topic-row"><span class="label">${x}</span><small>Повторить</small></div>`).join('')}<button class="btn primary" style="margin-top:15px" onclick="openStudy('temporal')">Повторить всё</button></div></div>`;
}
function aiView(){
 document.getElementById('view-ai').innerHTML=`<h1 class="page-title">Создать учебный набор</h1><p class="page-sub">Подготовьте карточки и вопросы из собственных материалов</p><div class="card panel"><div class="ai-box"><div class="upload-icon">↑</div><h3>Загрузите файл с материалами</h3><p>PDF, DOCX, TXT — в будущих версиях анализ будет выполняться автоматически.</p><button class="btn primary" onclick="toast('Загрузка файлов будет подключена в следующей beta-версии')">Выбрать файл</button></div><textarea class="textarea" placeholder="Или вставьте текст лекции или конспекта..."></textarea><button class="btn primary" style="margin-top:12px" onclick="toast('Генератор пока работает в режиме preview')">Создать набор</button><div class="feature-row"><div class="feature"><b>Автоматическое распознавание</b><p>Структурирование текста по темам.</p></div><div class="feature"><b>Генерация карточек</b><p>Вопросы и определения на основе материала.</p></div><div class="feature"><b>Проверка</b><p>Редактирование результата перед сохранением.</p></div></div></div>`;
}
function profileView(){
 document.getElementById('view-profile').innerHTML=`<h1 class="page-title">Профиль</h1><p class="page-sub">Настройки аккаунта и приложения</p><div class="profile-grid"><div class="card profile-card"><div class="big-avatar">И</div><h2 style="margin:0 0 4px">Илья</h2><p class="muted" style="font-size:11px">Студент · AlmazovQwiz Beta</p><button class="btn outline" style="margin-top:15px" onclick="toast('Редактирование профиля появится позже')">Редактировать профиль</button></div><div class="card profile-card"><div class="setting"><div><b>Уведомления</b><p>Напоминания о повторении</p></div><div class="switch on"></div></div><div class="setting"><div><b>Автоматическое повторение</b><p>Показывать сложные карточки чаще</p></div><div class="switch on"></div></div><div class="setting"><div><b>Тёмная тема</b><p>Интерфейс в тёмном оформлении</p></div><div class="switch" onclick="toast('Тёмная тема будет добавлена в beta 1.1')"></div></div><div class="setting"><div><b>Версия</b><p>AlmazovQwiz Beta 1.0</p></div><small>1.0.0</small></div></div></div>`;
}
function helpView(){
 document.getElementById('view-help').innerHTML=`<h1 class="page-title">Помощь</h1><p class="page-sub">Информация о закрытой beta</p><div class="two-col"><div class="card panel"><h3>Что уже работает</h3><div class="topic-row"><span class="label">Навигация и адаптивный интерфейс</span><small>✓</small></div><div class="topic-row"><span class="label">Учебные наборы</span><small>✓</small></div><div class="topic-row"><span class="label">Карточки</span><small>✓</small></div><div class="topic-row"><span class="label">Тестовый режим</span><small>✓</small></div><div class="topic-row"><span class="label">Локальное сохранение прогресса</span><small>✓</small></div><div class="topic-row"><span class="label">PWA / офлайн-кэш</span><small>✓</small></div></div><div class="card panel"><h3>Важно</h3><p class="muted" style="font-size:12px;line-height:1.7">AlmazovQwiz — независимый проект в стадии закрытого тестирования. Он не является официальным продуктом НМИЦ им. В. А. Алмазова. Если вы нашли ошибку, сообщите разработчику, указав страницу и последовательность действий.</p><button class="btn primary" onclick="toast('Спасибо за участие в закрытом тестировании')">Сообщить об ошибке</button></div></div>`;
}
let studyIndex=0, studyMode='cards', revealed=false, quizIndex=0, quizScore=0;
function studyView(id){
 const s=sets.find(x=>x.id===id)||sets[0];
 document.getElementById('view-study').innerHTML=`<div class="study-shell"><div class="study-head"><div><button class="link" onclick="showView('sets')">← Назад</button><h2>${s.title}</h2><small class="muted">${s.subject} · ${s.meta}</small></div><button class="btn outline" onclick="studyMode=studyMode==='cards'?'quiz':'cards'; studyIndex=0; quizIndex=0; quizScore=0; revealed=false; renderStudy('${s.id}')">${studyMode==='cards'?'Тест':'Карточки'}</button></div><div id="studyContent"></div></div>`;
 renderStudy(id);
}
function renderStudy(id){
 const s=sets.find(x=>x.id===id)||sets[0];
 const box=document.getElementById('studyContent'); if(!box)return;
 if(studyMode==='cards'){
  const c=cards[studyIndex%cards.length];
  box.innerHTML=`<div class="progress-line" style="margin-bottom:16px"><span style="width:${((studyIndex+1)/cards.length)*100}%"></span></div><div class="card study-card"><div class="study-label">КАРТОЧКА ${studyIndex+1} ИЗ ${cards.length}</div><h1>${c.q}</h1>${revealed?`<div class="study-answer">${c.a}</div>`:`<p class="muted">Нажмите, чтобы показать ответ</p>`}<div class="study-actions">${!revealed?`<button class="btn primary" onclick="revealed=true;renderStudy('${s.id}')">Показать ответ</button>`:`<button class="btn outline" onclick="answerCard(false,'${s.id}')">Не знаю</button><button class="btn primary" onclick="answerCard(true,'${s.id}')">Знаю</button>`}</div></div><div class="study-footer"><span>${state.seen} карточек изучено</span><span>Прогресс сохраняется на этом устройстве</span></div>`;
 }else{
  const q=quiz[quizIndex%quiz.length];
  box.innerHTML=`<div class="progress-line" style="margin-bottom:16px"><span style="width:${(quizIndex/quiz.length)*100}%"></span></div><div class="card panel"><div class="study-label">ВОПРОС ${quizIndex+1} ИЗ ${quiz.length}</div><h1 style="font-size:22px;margin-bottom:20px">${q.q}</h1><div>${q.options.map((o,i)=>`<button class="option" onclick="answerQuiz(${i},'${s.id}')">${String.fromCharCode(65+i)} <span style="margin-left:8px">${o}</span></button>`).join('')}</div><div class="study-footer"><span>Результат: ${quizScore}/${quizIndex}</span></div></div>`;
 }
}
function answerCard(ok,id){state.seen++;if(ok)state.correct++;state.cardIndex++;save();studyIndex++;revealed=false;renderStudy(id)}
function answerQuiz(i,id){const q=quiz[quizIndex%quiz.length];state.seen++;if(i===q.correct){state.correct++;quizScore++;toast('Ответ верный')}else toast('Ответ неверный');quizIndex++;save();if(quizIndex>=quiz.length){document.getElementById('studyContent').innerHTML=`<div class="card study-card"><div class="study-label">ТЕСТ ЗАВЕРШЁН</div><h1>Результат: ${quizScore} из ${quiz.length}</h1><p class="muted">Результат сохранён локально.</p><button class="btn primary" onclick="quizIndex=0;quizScore=0;renderStudy('${id}')">Пройти ещё раз</button></div>`}else renderStudy(id)}
function openStudy(id){studyMode='cards';studyIndex=0;revealed=false;showView('study');studyView(id)}
function showView(name){
 document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
 const target=document.getElementById('view-'+name); if(target)target.classList.add('active');
 document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===name));
 if(name==='home')home();if(name==='sets')setsView();if(name==='subjects')subjectsView();if(name==='progress')progressView();if(name==='ai')aiView();if(name==='profile')profileView();if(name==='help')helpView();
 document.querySelector('.sidebar')?.classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b)showView(b.dataset.view)});
document.getElementById('mobileMenu').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');
document.getElementById('enterBeta').onclick=()=>{state.betaAccepted=true;save();document.getElementById('betaNotice').style.display='none'};
document.getElementById('globalSearch').addEventListener('input',e=>{
 const q=e.target.value.trim().toLowerCase(); if(!q){showView('sets');return}
 showView('sets'); const items=document.querySelectorAll('.set-card');items.forEach((el,i)=>{el.style.display=(sets[i].title+' '+sets[i].subject).toLowerCase().includes(q)?'block':'none'})
});
home();
if(state.betaAccepted)document.getElementById('betaNotice').style.display='none';
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
