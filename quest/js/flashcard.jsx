/* ============================================================
   FLASHCARD — front: problem · flip: solution + tip · self-mark
   ============================================================ */
function TechniquePanel({week}){
  const demos = (window.weekDemoBlocks ? window.weekDemoBlocks(week) : []);
  const [open,setOpen] = React.useState(false);
  const [sel,setSel] = React.useState(0);
  const DemoComp = window.Demo;
  if(!demos.length || !DemoComp) return null;
  return (
    <div className="tech-panel">
      {!open
        ? <button className="btn ghost sm tech-toggle" onClick={()=>setOpen(true)}>🎬 Visualise the technique behind this question</button>
        : <div className="tech-open">
            <div className="tech-head">
              <span className="tech-title">🎬 See the technique in action</span>
              <span style={{flex:1}}></span>
              <button className="btn ghost sm" onClick={()=>setOpen(false)}>Hide</button>
            </div>
            {demos.length>1 && <div className="tech-tabs">
              {demos.map((d,i)=><button key={i} className={"hud-btn"+(i===sel?' active':'')} style={{padding:'5px 12px',fontSize:12.5}} onClick={()=>setSel(i)}>{d.icon} {d.chapter}</button>)}
            </div>}
            <DemoComp block={demos[Math.min(sel,demos.length-1)].demo}/>
            <div className="tech-foot">This is the core algorithm this question builds on. Open the <b>Library → Week {week}</b> for the full walk-through.</div>
          </div>}
    </div>
  );
}

function Flashcard({qid, queue, onClose}){
  const game = useGame();
  const Q = window.GAME_DATA.questions;
  const [idx, setIdx] = React.useState(Math.max(0, queue.indexOf(qid)));
  const [flipped, setFlipped] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [scratch, setScratch] = React.useState('');
  const [showPad, setShowPad] = React.useState(false);
  const q = Q.find(x=>x.id===queue[idx]);
  const wk = window.GAME_DATA.weeks.find(w=>w.week===q.week);
  const padKey = 'fit2004q_scratch_'+q.id;

  React.useEffect(()=>{ setFlipped(false); setShowPad(false);
    try{ setScratch(localStorage.getItem(padKey)||''); }catch(e){ setScratch(''); }
  },[idx]);
  React.useEffect(()=>{ const t=setTimeout(()=>{ try{localStorage.setItem(padKey,scratch);}catch(e){} },400); return ()=>clearTimeout(t); },[scratch]);

  const status = game.qStatus(q.id);
  const mark = (gotIt)=>{
    const r = game.record(q.id, gotIt);
    if(gotIt && r.firstSolve){ setToast({xp:r.xpGained, lvl:r.leveledUp?r.newLevel:null}); setTimeout(()=>setToast(null), 2600); }
    else if(gotIt){ setToast({xp:0, msg:'Already cleared — nice review!'}); setTimeout(()=>setToast(null),2000); }
    else { setToast({xp:0, msg:"Marked to revisit. You've got this next time."}); setTimeout(()=>setToast(null),2000); }
  };
  const go = (d)=>{ const n=idx+d; if(n>=0 && n<queue.length) setIdx(n); };

  return (
    <div className="view pop" style={{display:'flex', flexDirection:'column'}}>
      <div className="card-stage">
        {/* top bar */}
        <div className="card-topbar">
          <button className="back-link" onClick={onClose}>← {wk.name}</button>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <SecPill section={q.section}/>
            {q.key && <span className="sec-pill tag-key">★ Key question</span>}
            {q.rec && !q.key && <span className="sec-pill tag-rec">Recommended</span>}
          </div>
          <span style={{flex:1}}></span>
          <span style={{color:'var(--muted)', fontSize:13, fontWeight:600}}>{idx+1} / {queue.length}</span>
        </div>

        {/* the card */}
        <div className={"flip"+(flipped?' is-flipped':'')}>
          <div className="flip-inner">
            {/* FRONT */}
            <div className="face front">
              <div className="face-head">
                <span style={{fontFamily:'var(--display)',fontWeight:800,fontSize:20}}>{q.label}</span>
                <span style={{color:'var(--muted)',fontSize:13}}>Week {q.week} · {q.topic}</span>
              </div>
              <div className="face-body"><SolutionText text={q.problem}/></div>
              <div className="face-foot">
                <div className="paper-note">✍️ Work it out on your own paper, then flip to check.</div>
                <button className="btn primary" onClick={()=>setFlipped(true)}>Flip to solution ↻</button>
              </div>
            </div>
            {/* BACK */}
            <div className="face back">
              <div className="face-head">
                <span style={{fontFamily:'var(--display)',fontWeight:800,fontSize:18, color:'var(--mint)'}}>Model solution</span>
                <button className="btn ghost sm" onClick={()=>setFlipped(false)}>↻ Back to question</button>
              </div>
              <div className="face-body">
                {q.tip && <div className="tip-callout"><span className="tip-ic">💡</span><div><b>Approach tip</b><div>{q.tip}</div></div></div>}
                <SolutionText text={q.solution}/>
              </div>
              <div className="face-foot selfmark">
                <span style={{color:'var(--muted)',fontSize:13.5,fontWeight:600}}>How did you go?</span>
                <div style={{display:'flex',gap:10}}>
                  <button className="btn ghost" onClick={()=>mark(false)} style={{borderColor:'rgba(255,122,150,.4)'}}>✕ Missed it</button>
                  <button className="btn primary" onClick={()=>mark(true)}>✓ Got it{status!=='solved' && <span style={{opacity:.8,fontWeight:600}}>· +{game.xpForQuestion(q)} XP</span>}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* nav + scratchpad toggle */}
        <div className="card-nav">
          <button className="btn ghost sm" onClick={()=>go(-1)} disabled={idx===0} style={{opacity:idx===0?.4:1}}>← Prev</button>
          <button className="btn ghost sm" onClick={()=>setShowPad(s=>!s)}>{showPad?'Hide':'Open'} scratchpad</button>
          <button className="btn ghost sm" onClick={()=>go(1)} disabled={idx===queue.length-1} style={{opacity:idx===queue.length-1?.4:1}}>Next →</button>
        </div>
        {showPad && <textarea className="scratchpad" value={scratch} onChange={e=>setScratch(e.target.value)}
          placeholder="Optional scratchpad — jot working or notes (saved locally). The real exam is on paper, so practising by hand is best."/>}

        {flipped && <TechniquePanel week={q.week}/>}
      </div>

      {toast && <div className="xp-toast pop">
        {toast.xp>0 ? <><span style={{fontSize:22}}>⭐</span><b>+{toast.xp} XP</b>{toast.lvl && <span className="lvlup">LEVEL {toast.lvl}!</span>}</>
                    : <span>{toast.msg}</span>}
      </div>}
    </div>
  );
}
window.Flashcard = Flashcard;
