// Pure grading and persistence boundary; no DOM dependency.
const MQ_BY_ID = new Map(MQ_TASKS.map(t=>[t.id,t]));
function mqNormalize(value){return String(value??'').normalize('NFKC').trim().toLocaleLowerCase('ru').replace(/ё/g,'е').replace(/\s+/g,' ')}
function mqGrade(task,value){
  if(task.type==='text')return task.answers.some(a=>mqNormalize(a)===mqNormalize(value));
  if(['single','diagram','hotspot'].includes(task.type))return Number.isInteger(value)&&value===task.answer;
  if(!Array.isArray(value)||value.length!==task.answer.length||value.some(x=>!Number.isInteger(x)))return false;
  if(task.type==='multi')return new Set(value).size===value.length&&task.answer.every(x=>value.includes(x));
  return task.answer.every((x,i)=>value[i]===x);
}
function mqDay(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')}
function mqDaily(day=mqDay()){
  let seed=[...day].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0);
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  return MQ_PACKS.flatMap(p=>{const a=MQ_TASKS.filter(t=>t.pack===p.id).map(t=>t.id);for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,2)});
}
function mqClean(raw){
  const q={solved:[],mistakes:[],attempts:0,correct:0,days:[],active:null};
  if(!raw||typeof raw!=='object')return q;
  for(const k of ['solved','mistakes'])q[k]=[...new Set(Array.isArray(raw[k])?raw[k].filter(id=>MQ_BY_ID.has(id)):[])];
  q.days=[...new Set(Array.isArray(raw.days)?raw.days.filter(x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)):[])].sort().slice(-366);
  q.attempts=Number.isSafeInteger(raw.attempts)&&raw.attempts>=0?raw.attempts:0;
  q.correct=Number.isSafeInteger(raw.correct)?Math.max(0,Math.min(q.attempts,raw.correct)):0;
  const a=raw.active;
  if(a&&Array.isArray(a.ids)&&a.ids.length>0&&a.ids.length<=MQ_TASKS.length&&new Set(a.ids).size===a.ids.length&&a.ids.every(id=>MQ_BY_ID.has(id))&&Array.isArray(a.results)&&a.results.length<=a.ids.length&&a.results.every(r=>typeof r==='boolean')){
    q.active={ids:a.ids.slice(),results:a.results.slice(),title:typeof a.title==='string'?a.title.slice(0,100):'Тренировка',index:a.results.length, draft:null,checked:false};
    // A checked answer remains on screen after reload; it must not be rewarded twice.
    if(a.checked===true&&a.results.length>0&&a.index===a.results.length-1){q.active.index=a.index;q.active.checked=true;}
    const task=MQ_BY_ID.get(a.ids[q.active.index]);
    if(task){const d=a.draft,limit=(task.options||task.items||task.right||[]).length;
      if(task.type==='text'&&typeof d==='string')q.active.draft=d.slice(0,500);
      else if(['single','diagram','hotspot'].includes(task.type)&&Number.isInteger(d)&&d>=0&&d<limit)q.active.draft=d;
      else if(Array.isArray(d)&&d.length<=limit&&d.every(x=>Number.isInteger(x)&&x>=-1&&x<limit)){
        if(task.type==='match'&&d.length===task.left.length)q.active.draft=d.slice();
        if(task.type==='multi'&&d.every(x=>x>=0)&&new Set(d).size===d.length)q.active.draft=d.slice();
        if(task.type==='order'&&d.length===limit&&d.every(x=>x>=0)&&new Set(d).size===limit)q.active.draft=d.slice();
      }
    }
  }
  return q;
}
function mqRecord(q,task,value,date=new Date()){
  const a=q.active;if(!a||a.checked||a.ids[a.index]!==task.id||a.index>=a.ids.length)return false;
  const correct=mqGrade(task,value);a.draft=value;a.checked=true;a.results.push(correct);
  q.attempts++;if(correct){q.correct++;if(!q.solved.includes(task.id))q.solved.push(task.id);q.mistakes=q.mistakes.filter(id=>id!==task.id)}else if(!q.mistakes.includes(task.id))q.mistakes.push(task.id);
  const day=mqDay(date);if(!q.days.includes(day))q.days.push(day);q.days=q.days.sort().slice(-366);return true;
}
function mqStreak(days,date=new Date()){
  const cursor=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);let count=0;
  if(!days.includes(mqDay(cursor)))cursor.setDate(cursor.getDate()-1);
  while(days.includes(mqDay(cursor))){count++;cursor.setDate(cursor.getDate()-1)}return count;
}
