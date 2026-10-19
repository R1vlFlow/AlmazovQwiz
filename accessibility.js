(() => {
 const root=document.getElementById('modalRoot');let returnFocus=null;
 const focusable=dialog=>[...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex="0"]')].filter(el=>!el.hidden&&el.getClientRects().length);
 new MutationObserver(()=>{
  const dialog=root.querySelector('.modal,.mode-sheet');
  if(dialog){
   if(!returnFocus)returnFocus=document.activeElement;
   dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label',dialog.querySelector('h2')?.textContent||'Учебное окно');
   dialog.querySelectorAll('.icon-btn').forEach(b=>{if(b.textContent.trim()==='×')b.setAttribute('aria-label','Закрыть')});
   if(!dialog.contains(document.activeElement)){const target=focusable(dialog)[0]||dialog;dialog.tabIndex=-1;target.focus()}
  }else if(returnFocus){if(returnFocus.isConnected)returnFocus.focus();returnFocus=null;}
 }).observe(root,{childList:true});
 document.addEventListener('keydown',event=>{
  const dialog=root.querySelector('.modal,.mode-sheet')||(!state.betaAccepted?document.querySelector('#betaNotice .modal'):null);
  if(event.key==='Escape'){if(root.children.length)closeModeSheet();document.getElementById('sidebar').classList.remove('open');document.getElementById('mobileMenu').setAttribute('aria-expanded','false');}
  if(event.key==='Tab'&&dialog){const items=focusable(dialog);if(!items.length)return;const first=items[0],last=items.at(-1);if(event.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){event.preventDefault();last.focus()}else if(!event.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){event.preventDefault();first.focus()}}
  if(event.key==='Enter'&&event.target.id==='writeAnswer'){event.preventDefault();checkWrite()}
 });
 document.getElementById('dueBtn').innerHTML=icon('brain');
 const menu=document.getElementById('mobileMenu');menu.setAttribute('aria-controls','sidebar');menu.setAttribute('aria-expanded','false');
 menu.addEventListener('click',()=>menu.setAttribute('aria-expanded',String(document.getElementById('sidebar').classList.contains('open'))));
 document.addEventListener('click',event=>{if(!event.target.closest('#sidebar,#mobileMenu')){document.getElementById('sidebar').classList.remove('open');menu.setAttribute('aria-expanded','false')}});
})();
