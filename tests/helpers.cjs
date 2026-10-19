const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=['data/bank.js','library.js','app.js','ui.js'].map(file=>fs.readFileSync(require('node:path').join(__dirname,'..',file),'utf8')).join('\n')+'\nboot();';
function setup(saved='{}'){
  const elements=new Map(),timers=[];
  const element=id=>{if(!elements.has(id))elements.set(id,{value:'',innerHTML:'',textContent:'',style:{},remove(){},classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},querySelectorAll(){return []},insertAdjacentHTML(_,v){this.innerHTML+=v}});return elements.get(id)};
  const context=vm.createContext({console,Date,URL,Set,Math,Blob,encodeURIComponent,unescape,btoa:s=>Buffer.from(s,'binary').toString('base64'),setTimeout:fn=>timers.push(fn),clearTimeout(){},localStorage:{getItem:k=>k==='aq_state'?saved:null,setItem(){}},matchMedia:()=>({matches:false}),navigator:{},document:{getElementById:element,querySelectorAll:()=>[],addEventListener(){},body:element('body')},history:{replaceState(){}},location:{href:'https://example.test/'},scrollTo(){},addEventListener(){}});
  context.window=context;vm.runInContext(source,context);return {run:code=>vm.runInContext(code,context),element,timers};
}

module.exports={setup};
