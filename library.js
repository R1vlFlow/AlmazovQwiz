// Canonical cards share progress across overlapping sets. Legacy IDs remain aliases.
const BANK_CARDS = new Map(AQ_BANK.cards.map(card => [card.id, card]));
const BUILTIN_SETS = AQ_BANK.sets.map(({cardIds, ...set}) => ({...set, cards:cardIds.map(id => BANK_CARDS.get(id))}));
function migrateStats(stats) {
  const result = Object.create(null);
  for (const [oldId, raw] of Object.entries(stats || {})) {
    if (!raw || typeof raw !== 'object') continue;
    if(['__proto__','constructor','prototype'].includes(oldId))continue;
    const id = Object.hasOwn(AQ_BANK.aliases,oldId) ? AQ_BANK.aliases[oldId] : oldId;
    const previous = result[id];
    const entry = {...raw};
    for (const key of ['seen','correct','wrong','streak','interval','dueAt','last']) entry[key] = Math.max(0, Number(entry[key]) || 0);
    if (!previous) result[id] = entry;
    else result[id] = {...(entry.last > previous.last ? entry : previous), seen:previous.seen+entry.seen, correct:previous.correct+entry.correct, wrong:previous.wrong+entry.wrong};
  }
  return result;
}
function catalogSets() {
  const signatures = new Set();
  return allSets().filter(set => {
    const key = set.cards.map(c=>c.id).sort().join('|');
    if (signatures.has(key)) return false;
    signatures.add(key); return true;
  });
}
function checkedBackup(input) {
  if (!input || typeof input !== 'object' || typeof input.version !== 'string' || !input.state || typeof input.state !== 'object') throw Error('Это не резервная копия AlmazovQwiz.');
  const s=input.state;
  if (!Array.isArray(s.customSets)||!Array.isArray(s.sessions)||!s.cardStats||typeof s.cardStats!=='object'||Array.isArray(s.cardStats)) throw Error('В файле повреждена структура данных.');
  const idPattern=/^[a-zA-Z0-9а-яА-ЯёЁ_-]+$/;
  const used = new Set(BUILTIN_SETS.map(s=>s.id));
  const usedCards = new Set(BANK_CARDS.keys());
  for(const set of s.customSets){
    if(!set||!idPattern.test(set.id)||used.has(set.id)||typeof set.title!=='string'||!set.title.trim()||!Array.isArray(set.cards)||!set.cards.length)throw Error('Некорректный пользовательский набор.');
    used.add(set.id);
    if(set.tags!==undefined&&(!Array.isArray(set.tags)||set.tags.some(t=>typeof t!=='string')))throw Error('Некорректные теги набора.');
    for(const c of set.cards){
      if(!c||!idPattern.test(c.id)||usedCards.has(c.id)||typeof c.q!=='string'||!c.q.trim()||typeof c.a!=='string'||!c.a.trim())throw Error('Некорректная карточка в резервной копии.');
      if(c.options!==undefined&&(!Array.isArray(c.options)||c.options.some(x=>typeof x!=='string')||!c.options.includes(c.a)))throw Error('Некорректные варианты ответа.');
      if(c.tags!==undefined&&(!Array.isArray(c.tags)||c.tags.some(x=>typeof x!=='string')))throw Error('Некорректные теги карточки.');
      usedCards.add(c.id);
    }
  }
  for(const st of Object.values(s.cardStats))if(!st||!Number.isFinite(st.seen)||st.seen<0||!Number.isFinite(st.correct)||st.correct<0||st.correct>st.seen)throw Error('Некорректная статистика в резервной копии.');
  for(const session of s.sessions)if(!session||!Number.isFinite(session.answers)||session.answers<0||!Number.isFinite(session.correct)||session.correct<0||session.correct>session.answers||!Number.isFinite(session.date))throw Error('Некорректная история занятий.');
  const result={...defaults(),...s,cardStats:migrateStats(s.cardStats),profile:{...defaults().profile,...s.profile}};
  result.profile.dailyGoal=Math.max(1,Math.min(500,Number(result.profile.dailyGoal)||20));
  result.theme=['system','light','dark'].includes(s.theme)?s.theme:'system';
  if(result.activeStudy){const a=result.activeStudy;if(!Array.isArray(a.order)||a.order.some(id=>typeof id!=='string')||!Number.isInteger(a.index)||a.index<0||!['cards','learn','test','exam','write'].includes(a.mode)||!a.session||!Number.isFinite(a.session.answers)||!Number.isFinite(a.session.correct)||!Number.isFinite(a.session.date))delete result.activeStudy;}
  return result;
}
