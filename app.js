const APP_VERSION="1.2.0";
const CACHE_PREFIX="almazovqwiz-";
const BUILD_KEY="aq_app_version";
const THEME_KEY="aq_theme";

const DEFAULT_SETS=[
{id:"temporal",title:"Височная кость",subject:"Анатомия",progress:42,description:"Строение, части, отростки и каналы височной кости.",cards:[
{q:"Какие основные части выделяют в височной кости?",a:"Каменную, барабанную и чешуйчатую части; также выделяют сосцевидный и шиловидный отростки."},
{q:"Как называется каменная часть височной кости?",a:"Pars petrosa."},{q:"Как называется сонный канал?",a:"Canalis caroticus."},{q:"Как называется сосцевидный отросток?",a:"Processus mastoideus."}]},
{id:"skull",title:"Череп — общий обзор",subject:"Анатомия",progress:58,description:"Основные кости и ориентиры мозгового и лицевого отдела.",cards:[
{q:"Как называется большое затылочное отверстие?",a:"Foramen magnum."},{q:"Какие отделы выделяют в черепе?",a:"Мозговой и лицевой отделы."}]},
{id:"headneck",title:"Мышцы головы и шеи",subject:"Анатомия",progress:36,description:"Основные мышцы головы и шеи.",cards:[{q:"Что изучает миология?",a:"Раздел анатомии, посвящённый мышцам."}]},
{id:"spine",title:"Позвоночник",subject:"Анатомия",progress:47,description:"Отделы позвоночного столба и позвонки.",cards:[{q:"Как называется позвоночный столб?",a:"Columna vertebralis."}]},
{id:"heart",title:"Сердце",subject:"Анатомия",progress:53,description:"Внешнее строение и камеры сердца.",cards:[{q:"Как называется сердце на латыни?",a:"Cor."}]},
{id:"cell",title:"Клеточный цикл",subject:"Биология",progress:28,description:"Основные этапы клеточного цикла.",cards:[{q:"Какие основные периоды включает клеточный цикл?",a:"Интерфазу и период деления клетки."}]},
{id:"medical",title:"Medical terminology",subject:"Английский язык",progress:35,description:"Базовая медицинская терминология.",cards:[{q:"What does bone mean?",a:"Кость."}]},
{id:"histology",title:"Кровь — основы",subject:"Гистология",progress:31,description:"Основы изучения крови.",cards:[{q:"Что изучает гистология?",a:"Микроскопическое строение тканей и органов."}]}
];

const SUBJECTS=[
{title:"Анатомия",count:"12 наборов",icon:"⌬"},{title:"Гистология",count:"8 наборов",icon:"◉"},
{title:"Биология",count:"10 наборов",icon:"DNA"},{title:"Латинский язык",count:"6 наборов",icon:"Aa"}
];

let state=JSON.parse(localStorage.getItem("aq_state")||"{}");
state.betaAccepted=state.betaAccepted||false;
state.seen=Number(state.seen||0); state.correct=Number(state.correct||0);
state.customSets=state.customSets||[]; state.favorites=state.favorites||[];
state.profile=state.profile||{notifications:true,autoRepeat:true};

function save(){localStorage.setItem("aq_state",JSON.stringify(state))}
function allSets(){return [...DEFAULT_SETS,...state.customSets]}
function esc(x){return String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),2200)}
function applyTheme(theme){
  const actual=theme==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):theme;
  document.documentElement.dataset.theme=actual;
  localStorage.setItem(THEME_KEY,theme);
  const meta=document.getElementById("themeColor"); if(meta)meta.content=actual==="dark"?"#0b1421":"#0d2b52";
}
function currentTheme(){return localStorage.getItem(THEME_KEY)||"system"}

function iconSvg(){return `<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="27" stroke="currentColor" stroke-width="2"/><path d="M28 39c-4-9 5-18 13-13 4-8 17-4 16 5 7 2 7 13 0 16-1 9-13 12-18 5-7 5-15-2-11-9Z" stroke="currentColor" stroke-width="2"/><path d="M40 28v25M30 40h20M48 33l-5 8 7 8" stroke="currentColor" stroke-width="1.7"/></svg>`}

function setCard(s){return `<article class="card set-card"><div class="set-cover">${iconSvg()}</div><div class="set-body"><div class="set-title-row"><h3>${esc(s.title)}</h3><button class="fav" onclick="toggleFav('${s.id}',event)">${state.favorites.includes(s.id)?"★":"☆"}</button></div><p>${esc(s.subject)} · ${s.cards.length} карточек</p><div class="mini-progress"><span style="width:${s.progress||0}%"></span></div><div class="set-row"><small class="muted">${s.progress||0}% изучено</small><button class="btn primary" onclick="openStudy('${s.id}')">Изучать</button></div></div></article>`}

function home(){
document.getElementById("view-home").innerHTML=`
<div class="hero"><span class="eyebrow">ALMAZOVQWIZ · CLOSED BETA 1.2</span><h1>Учись эффективнее</h1><p>Карточки, тесты, повторение и создание собственных учебных наборов — в одном месте.</p><button class="btn light" onclick="openStudy('temporal')">Продолжить обучение →</button></div>
<div class="section-head"><div><h2>Мои предметы</h2><p>Учебная библиотека</p></div><button class="link" onclick="showView('subjects')">Все предметы →</button></div>
<div class="grid subjects-grid">${SUBJECTS.map(x=>`<article class="card subject-card" onclick="showView('sets')"><div class="subject-icon">${x.icon}</div><h3>${x.title}</h3><p>${x.count}</p></article>`).join("")}</div>
<div class="section-head"><div><h2>Недавние наборы</h2><p>Продолжите обучение</p></div><button class="link" onclick="showView('sets')">Все наборы →</button></div>
<div class="grid sets-grid">${allSets().slice(0,4).map(setCard).join("")}</div>
<div class="section-head"><div><h2>Быстрый прогресс</h2></div></div>
<div class="stat-grid"><div class="card stat"><small>Общий прогресс</small><strong>72%</strong><div class="progress-line"><span style="width:72%"></span></div></div><div class="card stat"><small>Изучено в сессии</small><strong>${state.seen}</strong><small>карточек</small></div><div class="card stat"><small>Точность</small><strong>${state.seen?Math.round(state.correct/state.seen*100):78}%</strong><small>на этом устройстве</small></div></div>`;
}

function setsView(filter=""){
const arr=allSets().filter(s=>(s.title+" "+s.subject).toLowerCase().includes(filter.toLowerCase()));
document.getElementById("view-sets").innerHTML=`<h1 class="page-title">Учебные наборы</h1><p class="page-sub">Готовые и созданные вами материалы</p><div class="toolbar"><button class="btn primary" onclick="showView('create')">+ Новый набор</button><button class="select" onclick="filterSets('Анатомия')">Анатомия</button><button class="select" onclick="filterSets('Биология')">Биология</button><button class="select" onclick="filterSets('')">Все</button></div><div class="grid sets-grid">${arr.length?arr.map(setCard).join(""):'<div class="empty">Ничего не найдено.</div>'}</div>`;
}
function filterSets(x){setsView(x)}
function subjectsView(){document.getElementById("view-subjects").innerHTML=`<h1 class="page-title">Предметы</h1><p class="page-sub">Учебная библиотека</p><div class="grid subjects-grid">${SUBJECTS.map(x=>`<article class="card subject-card" onclick="showView('sets')"><div class="subject-icon">${x.icon}</div><h3>${x.title}</h3><p>${x.count}</p></article>`).join("")}</div>`}

function progressView(){document.getElementById("view-progress").innerHTML=`<h1 class="page-title">Мой прогресс</h1><p class="page-sub">Статистика обучения сохраняется на этом устройстве</p><div class="stat-grid"><div class="card stat"><small>Общий прогресс</small><strong>72%</strong><div class="progress-line"><span style="width:72%"></span></div></div><div class="card stat"><small>Изучено карточек</small><strong>${state.seen}</strong></div><div class="card stat"><small>Точность</small><strong>${state.seen?Math.round(state.correct/state.seen*100):78}%</strong></div></div><div class="two-col" style="margin-top:18px"><div class="card panel"><h3>Прогресс по предметам</h3>${[["Анатомия",76],["Биология",81],["Гистология",64],["Латинский язык",58]].map(r=>`<div class="topic-row"><span class="label">${r[0]}</span><div class="bar"><div class="progress-line"><span style="width:${r[1]}%"></span></div></div><small>${r[1]}%</small></div>`).join("")}</div><div class="card panel"><h3>Статистика сессии</h3><p class="muted" style="font-size:12px;line-height:1.7">Изучено: ${state.seen}<br>Правильных ответов: ${state.correct}<br>Точность: ${state.seen?Math.round(state.correct/state.seen*100):78}%</p></div></div>`}

function aiView(){document.getElementById("view-ai").innerHTML=`<h1 class="page-title">Создать с помощью ИИ</h1><p class="page-sub">Подготовка набора из текста или файла</p><div class="card panel"><div class="ai-box"><div class="upload-icon">↑</div><h3>Загрузите учебный материал</h3><p>В Beta 1.2 можно вставить текст. Обработка PDF/DOCX будет подключена отдельным модулем.</p><input type="file" id="sourceFile" accept=".pdf,.doc,.docx,.txt" hidden><button class="btn primary" onclick="document.getElementById('sourceFile').click()">Выбрать файл</button><div id="fileName" class="muted" style="margin-top:9px;font-size:11px"></div></div><textarea id="sourceText" class="textarea" placeholder="Вставьте текст лекции или конспекта..."></textarea><div class="toolbar" style="margin-top:12px"><button class="btn primary" onclick="generateFromText()">Создать набор из текста</button><button class="btn outline" onclick="loadDemoText()">Загрузить пример</button></div></div></div>`;document.getElementById("sourceFile").onchange=e=>{document.getElementById("fileName").textContent=e.target.files[0]?.name||""}}
function loadDemoText(){document.getElementById("sourceText").value="Pars petrosa — каменная часть височной кости.\\nCanalis caroticus — сонный канал.\\nProcessus mastoideus — сосцевидный отросток.";toast("Пример загружен")}
function generateFromText(){const text=document.getElementById("sourceText").value.trim();if(!text){toast("Сначала вставьте текст");return}const lines=text.split(/\n+/).map(x=>x.trim()).filter(Boolean);const cards=lines.map((l,i)=>{const m=l.split(/\s+[—:-]\s+/);return{q:m[0]||("Термин "+(i+1)),a:m[1]||l}});state.customSets.unshift({id:"custom_"+Date.now(),title:"Новый набор",subject:"Мой материал",progress:0,description:"Создано из текста",cards});save();toast("Набор создан");showView("sets")}

function createView(){
document.getElementById("view-create").innerHTML=`<h1 class="page-title">Новый набор</h1><p class="page-sub">Создайте набор вручную</p><div class="card panel"><input id="newTitle" class="field" placeholder="Название набора"><input id="newSubject" class="field" placeholder="Предмет"><textarea id="newDesc" class="textarea" placeholder="Описание"></textarea><div id="manualCards"></div><button class="btn outline" onclick="addManualCard()">+ Добавить карточку</button><button class="btn primary" style="margin-top:12px" onclick="saveManualSet()">Сохранить набор</button></div>`;addManualCard();addManualCard()}
function addManualCard(){const box=document.getElementById("manualCards");if(!box){toast("Не удалось открыть редактор");return}const n=box.children.length+1;box.insertAdjacentHTML("beforeend",`<div class="manual-card"><b>Карточка ${n}</b><input class="field cq" placeholder="Вопрос"><textarea class="field ca" placeholder="Ответ"></textarea><button class="remove" onclick="this.parentElement.remove()">Удалить</button></div>`)}
function saveManualSet(){const title=document.getElementById("newTitle").value.trim()||"Новый набор";const subject=document.getElementById("newSubject").value.trim()||"Мой материал";const cards=[...document.querySelectorAll(".manual-card")].map(x=>({q:x.querySelector(".cq").value.trim(),a:x.querySelector(".ca").value.trim()})).filter(x=>x.q&&x.a);if(!cards.length){toast("Добавьте хотя бы одну заполненную карточку");return}state.customSets.unshift({id:"custom_"+Date.now(),title,subject,progress:0,description:document.getElementById("newDesc").value,cards});save();toast("Набор сохранён");showView("sets")}

function profileView(){
const t=currentTheme();
document.getElementById("view-profile").innerHTML=`<h1 class="page-title">Профиль</h1><p class="page-sub">Настройки аккаунта и приложения</p>
<div class="profile-grid">
<div class="card profile-card"><div class="big-avatar">И</div><h2 style="margin:0 0 4px">Илья</h2><p class="muted" style="font-size:11px">Студент · AlmazovQwiz Beta</p><div class="update-badge">VERSION ${APP_VERSION}</div></div>
<div class="card profile-card"><h3 style="margin-top:0">Интерфейс</h3>
<div class="setting-row"><div><b>Тема</b><p>Выберите оформление приложения</p><div class="theme-options">${["light","dark","system"].map(x=>`<button class="theme-choice ${t===x?"active":""}" onclick="setTheme('${x}')">${x==="light"?"Светлая":x==="dark"?"Тёмная":"Системная"}</button>`).join("")}</div></div></div>
<div class="setting-row"><div><b>Уведомления</b><p>Напоминания о повторении и событиях</p></div><button class="switch ${state.profile.notifications?"on":""}" onclick="toggleSetting('notifications')"></button></div>
<div class="setting-row"><div><b>Умное повторение</b><p>Чаще показывать сложные карточки</p></div><button class="switch ${state.profile.autoRepeat?"on":""}" onclick="toggleSetting('autoRepeat')"></button></div>
</div>
<div class="card profile-card"><h3 style="margin-top:0">Поддержка</h3><p class="muted" style="font-size:11px;line-height:1.6">Нашли ошибку или хотите предложить функцию?</p><a class="btn primary" href="https://t.me/R1vlFlow_GY" target="_blank" rel="noopener">Написать в Telegram</a><div class="settings-note">Telegram: @R1vlFlow_GY</div></div>
<div class="card profile-card"><h3 style="margin-top:0">Данные и обновления</h3><div class="setting-row"><div><b>Сбросить локальные данные</b><p>Удалит ваши созданные наборы и статистику на этом устройстве.</p></div><button class="danger-btn" onclick="resetLocalData()">Сбросить</button></div><div class="setting-row"><div><b>Проверить обновление</b><p>Принудительно обновит кэш приложения.</p></div><button class="btn outline" onclick="forceUpdate()">Обновить</button></div><p class="settings-note">При каждом новом обновлении AlmazovQwiz автоматически распознаёт новую версию и очищает старый технический кэш, не удаляя ваши учебные данные.</p></div>
</div>`}

function setTheme(theme){applyTheme(theme);profileView();toast(theme==="light"?"Светлая тема включена":theme==="dark"?"Тёмная тема включена":"Тема следует настройкам системы")}
function toggleSetting(key){state.profile[key]=!state.profile[key];save();profileView();toast(state.profile[key]?"Настройка включена":"Настройка выключена")}
function resetLocalData(){if(!confirm("Удалить созданные наборы, статистику и настройки? Готовые наборы останутся."))return;localStorage.removeItem("aq_state");state={betaAccepted:true,seen:0,correct:0,customSets:[],favorites:[],profile:{notifications:true,autoRepeat:true}};save();toast("Локальные данные сброшены");profileView()}
async function clearAppCaches(){if("caches" in window){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)).map(k=>caches.delete(k)))}}
async function forceUpdate(){await clearAppCaches();localStorage.setItem(BUILD_KEY,APP_VERSION);toast("Кэш обновлён");setTimeout(()=>location.reload(),450)}

function helpView(){document.getElementById("view-help").innerHTML=`<h1 class="page-title">Помощь</h1><p class="page-sub">Информация о закрытой beta</p><div class="two-col"><div class="card panel"><h3>Beta 1.2</h3>${["Карточки и тесты","Создание наборов вручную","Создание набора из текста","Поиск и фильтры","Светлая / тёмная / системная тема","Профиль и настройки","Telegram-поддержка","Автоматическое обновление кэша"].map(x=>`<div class="topic-row"><span class="label">${x}</span><small>✓</small></div>`).join("")}</div><div class="card panel"><h3>Статус проекта</h3><p class="muted" style="font-size:12px;line-height:1.7">AlmazovQwiz — независимый проект в стадии закрытого тестирования и не является официальным продуктом НМИЦ им. В. А. Алмазова.</p></div></div>`}

let studyId="temporal",studyIndex=0,revealed=false,studyMode="cards",quizIndex=0,quizScore=0;
function openStudy(id){studyId=id;studyIndex=0;revealed=false;studyMode="cards";quizIndex=0;quizScore=0;showView("study")}
function studyView(){const s=allSets().find(x=>x.id===studyId)||allSets()[0];document.getElementById("view-study").innerHTML=`<div class="study-shell"><div class="study-head"><div><button class="link" onclick="showView('sets')">← Назад</button><h2>${esc(s.title)}</h2><small class="muted">Учебный режим</small></div><button class="btn outline" onclick="toggleStudyMode()">${studyMode==="cards"?"Тест":"Карточки"}</button></div><div id="studyContent"></div></div>`;renderStudy()}
function toggleStudyMode(){studyMode=studyMode==="cards"?"quiz":"cards";quizIndex=0;quizScore=0;revealed=false;studyView()}
function renderStudy(){const s=allSets().find(x=>x.id===studyId)||allSets()[0],box=document.getElementById("studyContent");if(studyMode==="cards"){const c=s.cards[studyIndex%s.cards.length];box.innerHTML=`<div class="progress-line"><span style="width:${((studyIndex+1)/s.cards.length)*100}%"></span></div><div class="card study-card"><div class="study-label">КАРТОЧКА ${studyIndex+1} ИЗ ${s.cards.length}</div><h1>${esc(c.q)}</h1>${revealed?`<div class="study-answer">${esc(c.a)}</div>`:`<p class="muted">Нажмите, чтобы показать ответ</p>`}<div class="study-actions">${!revealed?`<button class="btn primary" onclick="revealed=true;renderStudy()">Показать ответ</button>`:`<button class="btn outline" onclick="answerCard(false)">Не знаю</button><button class="btn primary" onclick="answerCard(true)">Знаю</button>`}</div></div>`}else{const q=s.cards[quizIndex%s.cards.length],opts=[q.a,"Ответ не связан с темой","Неверное определение","Другой вариант"];box.innerHTML=`<div class="progress-line"><span style="width:${quizIndex/s.cards.length*100}%"></span></div><div class="card panel"><div class="study-label">ВОПРОС ${quizIndex+1} ИЗ ${s.cards.length}</div><h1 style="font-size:22px">${esc(q.q)}</h1>${opts.map((o,i)=>`<button class="option" onclick="answerQuiz(${i})">${String.fromCharCode(65+i)} <span style="margin-left:8px">${esc(o)}</span></button>`).join("")}<div class="study-footer">Результат: ${quizScore}/${quizIndex}</div></div>`}}
function answerCard(ok){state.seen++;if(ok)state.correct++;save();studyIndex++;revealed=false;renderStudy()}
function answerQuiz(i){const s=allSets().find(x=>x.id===studyId)||allSets()[0];state.seen++;if(i===0){state.correct++;quizScore++;toast("Ответ верный")}else toast("Ответ неверный");quizIndex++;save();if(quizIndex>=s.cards.length){document.getElementById("studyContent").innerHTML=`<div class="card study-card"><div class="study-label">ТЕСТ ЗАВЕРШЁН</div><h1>Результат: ${quizScore} из ${s.cards.length}</h1><button class="btn primary" onclick="quizIndex=0;quizScore=0;renderStudy()">Пройти ещё раз</button></div>`}else renderStudy()}
function toggleFav(id,e){e.stopPropagation();state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();setsView()}

function showView(name){
document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
const t=document.getElementById("view-"+name);if(!t){toast("Раздел временно недоступен");return}
t.classList.add("active");document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===name));
if(name==="home")home();if(name==="sets")setsView();if(name==="subjects")subjectsView();if(name==="progress")progressView();if(name==="ai")aiView();if(name==="profile")profileView();if(name==="help")helpView();if(name==="create")createView();if(name==="study")studyView();
document.querySelector(".sidebar")?.classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});
}

document.addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(b){e.preventDefault();showView(b.dataset.view)}});

function boot(){
applyTheme(currentTheme());
document.getElementById("mobileMenu").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
document.getElementById("enterBeta").onclick=()=>{state.betaAccepted=true;save();document.getElementById("betaNotice").style.display="none"};
document.getElementById("notificationsBtn").onclick=()=>toast(state.profile.notifications?"Новых уведомлений нет":"Уведомления отключены");
document.getElementById("globalSearch").addEventListener("input",e=>{showView("sets");setsView(e.target.value)});
document.querySelectorAll(".profile-chip").forEach(x=>x.addEventListener("click",()=>showView("profile")));
home();
if(state.betaAccepted)document.getElementById("betaNotice").style.display="none";
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
}
boot();

/* ---------- automatic cache/update detection ---------- */
(async function updateGuard(){
  const previous=localStorage.getItem(BUILD_KEY);
  if(previous && previous!==APP_VERSION){
    await clearAppCaches();
    localStorage.setItem(BUILD_KEY,APP_VERSION);
    sessionStorage.setItem("aq_updated","1");
    setTimeout(()=>location.reload(),100);
  } else {
    localStorage.setItem(BUILD_KEY,APP_VERSION);
  }
})();
