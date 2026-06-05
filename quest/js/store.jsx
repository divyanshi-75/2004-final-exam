/* ============================================================
   STORE — XP / progress / character, persisted to localStorage
   ============================================================ */
const LS = {
  prog: 'fit2004q_progress_v1',
  char: 'fit2004q_char_v1',
};
const XP_BY_SECTION = { '1':10, '2':20, '3':50, '2/3':30, null:15 };
const XP_PER_LEVEL = 220;

function xpForQuestion(q){ return XP_BY_SECTION[q.section] ?? 15; }
function levelFromXp(xp){ return Math.floor(xp / XP_PER_LEVEL) + 1; }

function loadProg(){ try{ return JSON.parse(localStorage.getItem(LS.prog)) || {}; }catch(e){ return {}; } }
function saveProg(p){ try{ localStorage.setItem(LS.prog, JSON.stringify(p)); }catch(e){} }

// ---- tiny pub/sub store ----
const Store = (function(){
  let progress = loadProg();
  let character = localStorage.getItem(LS.char) || null;
  const subs = new Set();
  const emit = () => subs.forEach(fn => fn());
  const Q = () => (window.GAME_DATA ? window.GAME_DATA.questions : []);
  const qById = (id) => Q().find(q => q.id === id);

  function totalXp(){
    let xp = 0;
    for (const q of Q()) { if (progress[q.id] && progress[q.id].solved) xp += xpForQuestion(q); }
    return xp;
  }
  return {
    subscribe(fn){ subs.add(fn); return () => subs.delete(fn); },
    getProgress(){ return progress; },
    getChar(){ return character; },
    setChar(id){ character = id; localStorage.setItem(LS.char, id); emit(); },
    qStatus(id){ const p = progress[id]; if(!p) return 'new'; if(p.solved) return 'solved'; return 'tried'; },
    // record a self-marked attempt. returns {xpGained, leveledUp, newLevel, firstSolve}
    record(id, gotIt){
      const q = qById(id); if(!q) return {xpGained:0};
      const before = totalXp(); const beforeLvl = levelFromXp(before);
      const p = progress[id] || { solved:false, attempts:0, missed:0 };
      p.attempts += 1;
      let firstSolve = false;
      if (gotIt){ if(!p.solved){ p.solved = true; firstSolve = true; } }
      else { p.missed += 1; }
      progress[id] = p; saveProg(progress);
      const after = totalXp(); const afterLvl = levelFromXp(after);
      emit();
      return { xpGained: after-before, leveledUp: afterLvl>beforeLvl, newLevel: afterLvl, firstSolve };
    },
    reset(){ progress = {}; saveProg(progress); emit(); },
    // ---- derived selectors ----
    totalXp, levelFromXp,
    levelInfo(){
      const xp = totalXp(); const lvl = levelFromXp(xp);
      const into = xp - (lvl-1)*XP_PER_LEVEL;
      return { xp, level:lvl, into, per:XP_PER_LEVEL, pct: into/XP_PER_LEVEL };
    },
    weekStats(week){
      const qs = Q().filter(q=>q.week===week);
      const secOrder = ['1','2','3','2/3',null];
      const bySec = {};
      for (const s of secOrder) bySec[s] = { total:0, solved:0, tried:0 };
      let solved=0, tried=0, recRemain=0, keyRemain=0, xp=0;
      for (const q of qs){
        const st = this.qStatus(q.id); const b = bySec[q.section];
        b.total++; if(st==='solved'){b.solved++;solved++;xp+=xpForQuestion(q);} else if(st==='tried'){b.tried++;tried++;}
        if(q.rec && st!=='solved') recRemain++;
        if(q.key && st!=='solved') keyRemain++;
      }
      return { total:qs.length, solved, tried, bySec, recRemain, keyRemain, xp,
               pct: qs.length? solved/qs.length : 0 };
    },
    globalStats(){
      const qs = Q(); let solved=0;
      for(const q of qs){ if(this.qStatus(q.id)==='solved') solved++; }
      return { total:qs.length, solved };
    },
    xpForQuestion,
  };
})();

// React hook
function useGame(){
  const [,force] = React.useReducer(x=>x+1,0);
  React.useEffect(()=>Store.subscribe(force),[]);
  return Store;
}
window.Store = Store; window.useGame = useGame;
