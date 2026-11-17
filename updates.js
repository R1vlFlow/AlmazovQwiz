// Update application files only. User data in localStorage/IndexedDB is retained.
let appUpdateRegistration=null;
let appUpdateCheck=null;
async function checkAppUpdate(manual=false){
 if(!('serviceWorker' in navigator)){if(manual)toast('Обновите страницу браузера');return}
 if(!navigator.onLine){if(manual)toast('Для обновления нужен интернет');return}
 if(appUpdateCheck)return appUpdateCheck;
 appUpdateCheck=(async()=>{
  try{
   appUpdateRegistration??=await navigator.serviceWorker.register('sw.js',{updateViaCache:'none'});
   await appUpdateRegistration.update();
   if(manual)toast(appUpdateRegistration.installing?'Загружается новая версия…':'Проверка выполнена. Новая версия применится автоматически.');
  }catch{if(manual)toast('Не удалось проверить обновление. Попробуйте позже.')}
  finally{appUpdateCheck=null}
 })();return appUpdateCheck;
}
if('serviceWorker' in navigator){
 navigator.serviceWorker.addEventListener('message',event=>{
  if(event.data?.type!=='APP_VERSION_REQUEST')return;
  if(current?.session)checkpointStudy();
  event.ports[0]?.postMessage({version:APP_VERSION});
 });
 window.addEventListener('online',()=>checkAppUpdate());
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkAppUpdate()});
 setInterval(()=>{if(document.visibilityState==='visible')checkAppUpdate()},5*60*1000);
}
const updateProfileBase=profileView;
profileView=function(){
 updateProfileBase();
 document.getElementById('view-profile').insertAdjacentHTML('beforeend',`<div class="panel section"><h2>Обновление приложения</h2><p class="muted">Версия ${APP_VERSION}. Старые файлы заменяются автоматически. Прогресс и наборы сохраняются.</p><button class="btn" onclick="checkAppUpdate(true)">Проверить обновление</button></div>`);
};
