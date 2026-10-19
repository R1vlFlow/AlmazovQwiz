// Catalogue and home presentation. Loaded after the study engine, before bootstrap.
let catalogFilter={subject:'',status:'all',page:1};
const CATALOG_PAGE_SIZE=18;
function setPalette(set){
  const text=(set.title+' '+(set.tags||[]).join(' ')).toLowerCase();
  if(/череп|кость|скелет|позвон|остеолог|конечност/.test(text))return ['bone','Костная система','blue'];
  if(/мыш|сустав|соединени/.test(text))return ['layers','Движение и опора','purple'];
  if(/нерв|мозг|чувств/.test(text))return ['brain','Нервная система','violet'];
  if(/серд|сосуд|кров|лимф/.test(text))return ['heart','Сердце и сосуды','rose'];
  if(/дых|лёг|легк/.test(text))return ['cell','Дыхательная система','teal'];
  if(/пищевар|желуд|киш|печен|печён/.test(text))return ['book','Пищеварительная система','amber'];
  return ['book',set.subject||'Мой набор','blue'];
}
function handlerArg(value){return esc(JSON.stringify(String(value)))}
setCard=function(set){
  const p=setProgress(set),[symbol,label,color]=setPalette(set),due=set.cards.filter(c=>stat(c.id).seen&&stat(c.id).dueAt<=now()).length;
  return `<article class="set-card catalog-card"><div class="catalog-art ${color}"><span>${icon(symbol)}</span><small>${esc(label)}</small></div><div class="set-meta"><span class="tag">${esc(set.subject||'Мой набор')}</span><span class="muted">${set.cards.length} карточек</span></div><h3>${esc(set.title)}</h3><p>${esc(set.description||'Собственный учебный набор')}</p><div class="catalog-progress"><span>${p}% освоено</span><span>${due?due+' к повторению':'В своём темпе'}</span></div><div class="progress" aria-label="Освоено ${p}%"><span style="width:${p}%"></span></div><div class="set-footer"><button class="btn primary" onclick="openStudy(${handlerArg(set.id)},'cards')">${p?'Продолжить':'Учить'}</button><button class="btn soft" onclick="aq37ExamSetup(${handlerArg(set.id)})">Экзамен</button></div></article>`;
};
function filteredCatalog(query){
  const q=query.trim().toLocaleLowerCase('ru');
  return catalogSets().filter(s=>{
    if(catalogFilter.subject&&s.subject!==catalogFilter.subject)return false;
    if(catalogFilter.status==='mine'&&!state.customSets.some(x=>x.id===s.id))return false;
    if(catalogFilter.status==='due'&&!s.cards.some(c=>stat(c.id).seen&&stat(c.id).dueAt<=now()))return false;
    if(catalogFilter.status==='started'&&!s.cards.some(c=>stat(c.id).seen))return false;
    return !q||[s.title,s.description,...(s.tags||[]),...s.cards.map(c=>c.q+' '+c.a)].join(' ').toLocaleLowerCase('ru').includes(q);
  });
}
function renderCatalog(query){
  const sets=filteredCatalog(query),pages=Math.max(1,Math.ceil(sets.length/CATALOG_PAGE_SIZE));catalogFilter.page=Math.min(catalogFilter.page,pages);
  document.getElementById('catalogCount').textContent=`${sets.length} наборов · страница ${catalogFilter.page} из ${pages}`;
  document.getElementById('setsGrid').innerHTML=sets.length?sets.slice((catalogFilter.page-1)*CATALOG_PAGE_SIZE,catalogFilter.page*CATALOG_PAGE_SIZE).map(setCard).join(''):'<div class="empty">Ничего не найдено. Измените запрос или сбросьте фильтры.</div>';
  document.getElementById('catalogPages').innerHTML=pages>1?`<button class="btn" ${catalogFilter.page===1?'disabled':''} onclick="changeCatalogPage(-1)">← Назад</button><span>${catalogFilter.page} / ${pages}</span><button class="btn" ${catalogFilter.page===pages?'disabled':''} onclick="changeCatalogPage(1)">Далее →</button>`:'';
}
function changeCatalogPage(delta){catalogFilter.page+=delta;renderCatalog(document.getElementById('setSearch').value);document.getElementById('catalogCount').scrollIntoView({block:'start'});}
function changeCatalogStatus(status){catalogFilter.status=status;catalogFilter.page=1;document.querySelectorAll('[data-catalog-status]').forEach(b=>{const active=b.dataset.catalogStatus===status;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});renderCatalog(document.getElementById('setSearch').value)}
function resetCatalog(){catalogFilter={subject:'',status:'all',page:1};setsView('');}
setsView=function(query=''){
  document.getElementById('view-sets').innerHTML=`<div class="page-heading"><div><span class="eyebrow">БИБЛИОТЕКА</span><h1 class="page-title">Ваш следующий шаг в анатомии</h1><p class="page-sub">Найдите тему, повторите сложное или проверьте себя на экзамене.</p></div><button class="btn primary" onclick="showView('create')">${icon('plus')} Создать набор</button></div><div class="catalog-controls panel"><div class="toolbar"><div class="search-wrap">${icon('search')}<input id="setSearch" aria-label="Поиск наборов" value="${esc(query)}" placeholder="Тема, орган или термин…"></div><select class="select" id="setSubject" aria-label="Предмет"><option value="">Все предметы</option>${[...new Set([...SUBJECTS.map(x=>x[0]),...allSets().map(s=>s.subject)])].filter(Boolean).map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('')}</select><button class="btn soft" onclick="resetCatalog()">Сбросить</button></div><div class="catalog-tabs">${[['all','Все наборы'],['started','Изучаю'],['due','К повторению'],['mine','Созданные мной']].map(([id,label])=>`<button class="tab ${catalogFilter.status===id?'active':''}" data-catalog-status="${id}" aria-pressed="${catalogFilter.status===id}" onclick="changeCatalogStatus('${id}')">${label}</button>`).join('')}</div></div><p id="catalogCount" class="muted" role="status" aria-live="polite"></p><div id="setsGrid" class="grid grid-3"></div><div id="catalogPages" class="catalog-pages"></div>`;
  const search=document.getElementById('setSearch'),subject=document.getElementById('setSubject');subject.value=catalogFilter.subject;
  search.oninput=()=>{catalogFilter.page=1;renderCatalog(search.value)};
  subject.onchange=()=>{catalogFilter.subject=subject.value;catalogFilter.page=1;renderCatalog(search.value)};
  renderCatalog(query);
};
home=function(){
  const g=global(),today=new Date().toDateString(),done=state.sessions.filter(s=>new Date(s.date).toDateString()===today).reduce((n,s)=>n+s.answers,0),goal=state.profile.dailyGoal;
  const continueSets=catalogSets().filter(s=>s.cards.some(c=>stat(c.id).seen)).slice(0,3),recommended=continueSets.length?continueSets:catalogSets().slice(0,3);
  document.getElementById('view-home').innerHTML=`<div class="home-welcome"><span class="eyebrow">ALMAZOVQWIZ · УЧИТЬ И ПОНИМАТЬ</span><h1>Большие знания.<br><span>Небольшие шаги каждый день.</span></h1><p>Начните с короткого повторения. Мы соберём карточки, которым сейчас нужно ваше внимание.</p><div class="hero-actions"><button class="btn primary" onclick="aq35StartReview(20)">${icon('cards')} Начать повторение</button><button class="btn" onclick="showView('sets')">Выбрать тему →</button></div><div class="daily-goal"><span>Сегодня <b>${done} / ${goal}</b> ответов</span><div class="progress"><span style="width:${Math.min(100,pct(done,goal))}%"></span></div></div></div>${state.activeStudy?'<div class="resume-banner panel"><div><b>Продолжим с того же места?</b><p class="muted">На устройстве сохранено незавершённое занятие.</p></div><button class="btn primary" onclick="resumeStudy()">Продолжить занятие</button></div>':''}<div class="stats-grid home-stats"><div class="stat"><small>К повторению</small><strong>${g.due}</strong><span class="muted">карточек на сегодня</span></div><div class="stat"><small>Освоено</small><strong>${g.learned}</strong><span class="muted">из ${g.total} карточек</span></div><div class="stat"><small>Точность</small><strong>${g.answers?g.accuracy+'%':'—'}</strong><span class="muted">${g.answers} ответов</span></div><div class="stat"><small>Ваши наборы</small><strong>${state.customSets.length}</strong><span class="muted">личная библиотека</span></div></div><div class="section"><div class="section-head"><div><h2>${continueSets.length?'Продолжить обучение':'Выберите первую тему'}</h2><p class="muted">От терминов к уверенному пониманию.</p></div><button class="btn soft" onclick="showView('sets')">Все наборы →</button></div><div class="grid grid-3">${recommended.map(setCard).join('')}</div></div><div class="grid grid-2 section"><div class="panel feature-panel"><span class="eyebrow">УМНОЕ ПОВТОРЕНИЕ</span><h2>Что учить сейчас?</h2><p class="muted">Сначала просроченные карточки, затем ошибки и новые темы.</p><button class="btn" onclick="aq35StartReview(10)">Повторить 10 карточек</button></div><div class="panel feature-panel"><span class="eyebrow">ВИЗУАЛЬНЫЙ АТЛАС</span><h2>Узнавайте анатомию на схемах</h2><p class="muted">Рассмотрите изображение, назовите структуру и проверьте ответ.</p><button class="btn" onclick="aq36OpenAtlas()">Открыть визуальный атлас</button></div></div>`;
};
profileView=function(){
  document.getElementById('view-profile').innerHTML=`<h1 class="page-title">Настройки и данные</h1><p class="page-sub">Всё хранится в этом браузере. Резервная копия помогает перенести обучение на другое устройство.</p><div class="grid grid-2"><div class="panel"><h2>Как вам удобно учиться</h2><div class="settings-row"><label for="profileTheme">Тема оформления</label><select id="profileTheme" class="select" onchange="setTheme(this.value)">${[['system','Как на устройстве'],['light','Светлая'],['dark','Тёмная']].map(([v,t])=>`<option value="${v}" ${state.theme===v?'selected':''}>${t}</option>`).join('')}</select></div><div class="settings-row"><label for="dailyGoal">Ответов в день</label><input id="dailyGoal" class="select" type="number" min="1" max="500" value="${state.profile.dailyGoal}" onchange="state.profile.dailyGoal=Math.max(1,Math.min(500,Math.round(Number(this.value)||20)));this.value=state.profile.dailyGoal;save()"></div><p class="muted">Цель помогает держать ритм. Её можно изменить в любой момент.</p></div><div class="panel"><h2>Резервная копия</h2><p class="muted">Файл содержит наборы, прогресс и историю занятий. Загруженные учебники в него не входят.</p><div class="backup-actions"><button class="btn primary" onclick="exportData()">Скачать копию</button><button class="btn" onclick="document.getElementById('backupFile').click()">Восстановить из файла</button><input hidden id="backupFile" type="file" accept=".json,application/json"></div><p id="backupResult" role="status" class="muted"></p><hr><button class="btn danger" onclick="resetData()">Сбросить локальные данные</button><p class="form-note">Версия ${APP_VERSION} · независимый учебный проект.</p></div></div>`;
  document.getElementById('backupFile').onchange=restoreBackup;
};
async function restoreBackup(event){
 const file=event.target.files?.[0];if(!file)return;
 const result=document.getElementById('backupResult');
 try{
  if(file.size>30*1024*1024)throw Error('Файл слишком большой: предел 30 МБ.');
  const next=checkedBackup(JSON.parse(await file.text()));
  next.betaAccepted=state.betaAccepted||next.betaAccepted;
  if(!confirm(`Восстановить ${next.customSets.length} наборов и ${next.sessions.length} занятий? Текущие данные будут заменены. Сначала скачайте их копию, если хотите сохранить.`))return;
  // Commit storage first. If quota is exceeded, current in-memory data remains intact.
  localStorage.setItem('aq_state',JSON.stringify(next));
  Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,next);current.session=null;
  try{localStorage.setItem(THEME_KEY,state.theme)}catch{}
  applyTheme();result.textContent='Данные восстановлены. Можно продолжать обучение.';
 }catch(error){result.textContent='Не удалось восстановить: '+error.message;}
 event.target.value='';
}
function checkpointStudy(){
 if(!current.session)return;
 const index=current.index+(current.session.pending?1:0);
 state.activeStudy={setId:current.setId,index,mode:current.mode,order:current.order.map(c=>c.id),session:{...current.session,pending:false},temporary:current.setId===window.__aq35Temp?.id?window.__aq35Temp:current.setId===window.__aq37Temp?.id?window.__aq37Temp:null};
 // Temporary sets need only IDs; avoid copying an entire bank into localStorage.
 if(state.activeStudy.temporary){const {cards,...meta}=state.activeStudy.temporary;state.activeStudy.temporary={...meta,cardIds:cards.map(c=>c.id)}}
 save();
}
function resumeStudy(){
 const saved=state.activeStudy;if(!saved)return;
 const cards=new Map(uniqueCards().map(({c})=>[c.id,c]));
 if(saved.temporary){const temp={...saved.temporary,cards:(saved.temporary.cardIds||[]).map(id=>cards.get(AQ_BANK.aliases[id]||id)).filter(Boolean)};if(temp.id==='aq35-smart-review')window.__aq35Temp=temp;else window.__aq37Temp=temp;}
 const order=(saved.order||[]).map(id=>cards.get(AQ_BANK.aliases[id]||id)).filter(Boolean);
 if(!order.length||!getSet(saved.setId)){delete state.activeStudy;save();home();toast('Этот набор больше недоступен');return;}
 current={setId:saved.setId,index:Math.max(0,Math.min(saved.index,order.length)),mode:saved.mode,order,session:{...saved.session,pending:false},revealed:false,options:null};
 if(current.index===order.length){finishSession();showView('analytics');return;}
 showView('study');
}
const renderStudy=studyView;
studyView=function(){renderStudy();checkpointStudy();};
window.addEventListener('pagehide',checkpointStudy);
