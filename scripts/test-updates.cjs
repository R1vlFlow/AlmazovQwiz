// Browser integration test: run with PLAYWRIGHT_MODULE pointing to an installed Playwright.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),legacy=new Map();
for(const name of ['sw.js','app.js','index.html'])legacy.set(name,cp.execFileSync('git',['show','93ca84e:'+name],{cwd:root}));
let release=0,failInstall=false;
const server=http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;const name=pathname==='/'?'index.html':pathname.slice(1);
 if(failInstall&&name==='updates.js'){res.writeHead(503);return res.end()}
 try{let body=release===0&&legacy.has(name)?legacy.get(name):fs.readFileSync(path.join(root,name));if(release===2&&/\.(js|html)$/.test(name))body=Buffer.from(body.toString().replaceAll('4.3.1','4.3.2'));
 res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':name.endsWith('.svg')?'image/svg+xml':name.endsWith('.html')?'text/html':'application/json');res.setHeader('Cache-Control',name==='sw.js'?'no-store':'public, max-age=3600');res.end(body);
 }catch{res.writeHead(404);res.end()}
});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({channel:'msedge',headless:true});const context=await browser.newContext(),page=await context.newPage();const url='http://127.0.0.1:'+server.address().port;let navigations=0;page.on('request',r=>{if(r.isNavigationRequest()&&r.frame()===page.mainFrame())navigations++});
 await page.goto(url);await page.locator('#enterBeta').click();await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>navigator.serviceWorker.controller);
 await page.evaluate(async()=>{state.profile.dailyGoal=37;openStudy('course-1','test');courseChoose(courseChoices().indexOf(currentCard().a));await caches.open('unrelated-app-cache');localStorage.setItem('user-marker','keep');await new Promise((resolve,reject)=>{const request=indexedDB.open('test-user-books',1);request.onupgradeneeded=()=>request.result.createObjectStore('books');request.onsuccess=()=>{const db=request.result,tx=db.transaction('books','readwrite');tx.objectStore('books').put('book-content','book');tx.oncomplete=()=>{db.close();resolve()};tx.onerror=reject}})});
 const second=await context.newPage();await second.goto(url);assert.equal(await second.evaluate(()=>APP_VERSION),'4.3.0');
 release=1;failInstall=true;await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();const w=r.installing;if(w)await new Promise(resolve=>{w.addEventListener('statechange',()=>{if(w.state==='redundant')resolve()})})});
 assert.equal(await page.evaluate(()=>APP_VERSION),'4.3.0');assert((await page.evaluate(()=>caches.keys())).includes('almazovqwiz-4.3.0'));
 failInstall=false;await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update()});
 await page.waitForFunction(()=>typeof APP_VERSION!=='undefined'&&APP_VERSION==='4.3.1');await second.waitForFunction(()=>typeof APP_VERSION!=='undefined'&&APP_VERSION==='4.3.1');
 assert.equal(await page.evaluate(()=>state.profile.dailyGoal),37);assert.equal(await page.evaluate(()=>localStorage.getItem('user-marker')),'keep');
 await page.getByRole('button',{name:'Продолжить занятие',exact:true}).click();assert.equal(await page.evaluate(()=>current.session.correct),1);assert.equal(await page.evaluate(()=>courseChecked()),true);
 assert.equal(await page.evaluate(()=>new Promise(resolve=>{const r=indexedDB.open('test-user-books');r.onsuccess=()=>{const db=r.result,q=db.transaction('books').objectStore('books').get('book');q.onsuccess=()=>{db.close();resolve(q.result)}}})),'book-content');
 release=2;await page.evaluate(()=>checkAppUpdate(true));await page.waitForFunction(()=>typeof APP_VERSION!=='undefined'&&APP_VERSION==='4.3.2');await second.waitForFunction(()=>typeof APP_VERSION!=='undefined'&&APP_VERSION==='4.3.2');
 const keys=await page.evaluate(()=>caches.keys());assert(keys.includes('unrelated-app-cache'));assert(keys.includes('almazovqwiz-4.3.2'));assert(!keys.some(x=>/almazovqwiz-4.3.[01]$/.test(x)));assert.equal(navigations,3);
 await context.setOffline(true);await page.reload();assert.equal(await page.evaluate(()=>APP_VERSION),'4.3.2');await page.getByRole('button',{name:'Продолжить занятие',exact:true}).click();assert.equal(await page.evaluate(()=>current.session.correct),1);
 console.log('PASS: failed install retains old version; legacy and modern tabs auto-update once; old caches removed; unrelated cache, progress, localStorage and IndexedDB preserved; offline works.');
 }finally{await browser?.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
