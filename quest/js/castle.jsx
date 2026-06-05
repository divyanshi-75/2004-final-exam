/* ============================================================
   CASTLE — pick weeks → generate a mock exam (real S1/S2/S3 shape)
   ============================================================ */
const BLUEPRINT = [ {sec:'1',n:10,marks:1}, {sec:'2',n:5,marks:2}, {sec:'3',n:3,marks:5} ];

function sample(arr,n){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a.slice(0,n); }

function buildExam(weeks){
  const Q = window.GAME_DATA.questions.filter(q=>weeks.includes(q.week));
  const used = new Set(); const paper = [];
  for(const b of BLUEPRINT){
    let pool = Q.filter(q=> (q.section===b.sec || (q.section==='2/3' && (b.sec==='2'||b.sec==='3'))) && q.solution && !used.has(q.id));
    const picked = sample(pool, b.n);
    picked.forEach(q=>used.add(q.id));
    picked.forEach(q=> paper.push({...q, examMarks:b.marks, examSec:b.sec}));
  }
  return paper;
}
function availability(weeks){
  const Q = window.GAME_DATA.questions.filter(q=>weeks.includes(q.week) && q.solution);
  return BLUEPRINT.map(b=>({...b, have: Q.filter(q=>q.section===b.sec||(q.section==='2/3'&&(b.sec==='2'||b.sec==='3'))).length }));
}

function Castle({onBack}){
  const game = useGame();
  const weeksMeta = window.GAME_DATA.weeks;
  const [picked,setPicked] = React.useState(()=>weeksMeta.map(w=>w.week)); // all by default
  const [mode,setMode] = React.useState('setup');
  const [paper,setPaper] = React.useState([]);

  const toggle = (w)=> setPicked(p=> p.includes(w)? p.filter(x=>x!==w) : [...p,w].sort((a,b)=>a-b));
  const avail = availability(picked);
  const totalAvail = avail.reduce((s,a)=>s+Math.min(a.have,a.n),0);
  const maxMarks = avail.reduce((s,a)=>s+Math.min(a.have,a.n)*a.marks,0);

  const begin = ()=>{ const p = buildExam(picked); setPaper(p); setMode('run'); };

  if(mode==='run') return <ExamRunner paper={paper} onQuit={()=>setMode('setup')} onFinish={onBack}/>;
  return <CastleSetup {...{picked,toggle,setPicked,weeksMeta,avail,totalAvail,maxMarks,begin,onBack}}/>;
}

function CastleSetup({picked,toggle,setPicked,weeksMeta,avail,totalAvail,maxMarks,begin,onBack}){
  return (
    <div className="view pop">
      <div className="view-inner castle-wrap">
        <button className="back-link" onClick={onBack}>← Back to the map</button>
        <div className="panel" style={{marginTop:16, padding:'22px 26px', display:'flex', gap:20, alignItems:'center',
          background:'linear-gradient(120deg, rgba(255,206,77,.14), rgba(12,17,38,.92) 60%)', borderColor:'rgba(255,206,77,.4)'}}>
          <div style={{width:80,height:76}}><CastleBuilding size={80}/></div>
          <div style={{flex:1,minWidth:200}}>
            <h1 className="h-title">Examination Castle</h1>
            <p className="h-sub">Choose the weeks you want tested, and the castle assembles a mock paper in the real exam's shape — Sections 1, 2 &amp; 3.</p>
          </div>
        </div>

        <h3 style={{fontFamily:'var(--display)',marginTop:26,marginBottom:0,fontSize:18}}>1 · Pick your weeks</h3>
        <div style={{display:'flex',gap:8,marginTop:10}}>
          <button className="btn ghost sm" onClick={()=>setPicked(weeksMeta.map(w=>w.week))}>Select all</button>
          <button className="btn ghost sm" onClick={()=>setPicked([])}>Clear</button>
        </div>
        <div className="week-pick">
          {weeksMeta.map(w=>{
            const on = picked.includes(w.week);
            return <div key={w.week} className={"week-toggle"+(on?' on':'')} onClick={()=>toggle(w.week)}>
              <div className="wn" style={{color:on?'var(--amber)':'var(--ink)'}}>Wk {w.week}</div>
              <div className="wt">{w.topic}</div>
            </div>;
          })}
        </div>

        <h3 style={{fontFamily:'var(--display)',marginTop:28,marginBottom:0,fontSize:18}}>2 · Your paper</h3>
        <div className="exam-blueprint">
          {avail.map(b=>{
            const m=secMeta(b.sec); const take=Math.min(b.have,b.n);
            return <div key={b.sec} className="blueprint-card" style={{borderColor:m.color+'55'}}>
              <SecPill section={b.sec}/>
              <div className="bm" style={{marginTop:10, color:m.color}}>{take}<span style={{fontSize:14,color:'var(--faint)'}}> × {b.marks}m</span></div>
              <div style={{color:'var(--muted)',fontSize:12.5,marginTop:4}}>{take<b.n? `only ${b.have} available`:`${b.n} questions`} · {take*b.marks} marks</div>
            </div>;
          })}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:18,marginTop:22,flexWrap:'wrap'}}>
          <div style={{fontFamily:'var(--display)',fontWeight:800,fontSize:17}}>Total: {maxMarks} marks <span style={{color:'var(--muted)',fontWeight:600,fontSize:14}}>/ 35 · {totalAvail} questions</span></div>
          <span style={{flex:1}}></span>
          <button className="btn violet" disabled={totalAvail===0} style={{opacity:totalAvail?1:.4,pointerEvents:totalAvail?'auto':'none',padding:'14px 32px',fontSize:16}} onClick={begin}>⚔️ Begin examination</button>
        </div>
        <p style={{color:'var(--faint)',fontSize:12.5,marginTop:14}}>Real exam · 35 marks, 3 hours. Score bands — Credit 0–4, Distinction 5–14, High Distinction 15–35.</p>
      </div>
    </div>
  );
}

function ExamRunner({paper,onQuit,onFinish}){
  const game = useGame();
  const [i,setI] = React.useState(0);
  const [flip,setFlip] = React.useState(false);
  const [marks,setMarks] = React.useState(()=>paper.map(()=>null)); // null | true | false
  const [done,setDone] = React.useState(false);
  React.useEffect(()=>{ setFlip(false); },[i]);
  const q = paper[i];

  const grade = (got)=>{
    setMarks(m=>{ const n=[...m]; n[i]=got; return n; });
    game.record(q.id, got);
    if(i<paper.length-1) setTimeout(()=>setI(i+1), 180); else setTimeout(()=>setDone(true), 180);
  };

  if(done){
    const earned = paper.reduce((s,q,idx)=> s + (marks[idx]===true? q.examMarks:0), 0);
    const total = paper.reduce((s,q)=>s+q.examMarks,0);
    const bands = window.GAME_DATA.exam.bands;
    const band = bands.slice().reverse().find(b=> earned>=b.min) || bands[0];
    const bySec = {};
    paper.forEach((q,idx)=>{ const k=q.examSec; bySec[k]=bySec[k]||{got:0,tot:0}; bySec[k].tot+=q.examMarks; if(marks[idx]) bySec[k].got+=q.examMarks; });
    return <div className="view pop"><div className="view-inner castle-wrap" style={{maxWidth:720}}>
      <div className="panel" style={{padding:'34px 30px',textAlign:'center'}}>
        <div style={{fontFamily:'var(--display)',color:'var(--amber)',fontWeight:800,letterSpacing:1}}>EXAMINATION COMPLETE</div>
        <div style={{fontFamily:'var(--display)',fontWeight:800,fontSize:64,lineHeight:1,margin:'12px 0',background:'linear-gradient(90deg,var(--amber),var(--pink))',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>{earned}<span style={{fontSize:28,color:'var(--muted)'}}>/{total}</span></div>
        <div style={{fontFamily:'var(--display)',fontWeight:800,fontSize:24,color: band.name==='High Distinction'?'var(--mint)':band.name==='Distinction'?'var(--cyan)':'var(--violet)'}}>{band.name}</div>
        <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:22,flexWrap:'wrap'}}>
          {['1','2','3'].filter(s=>bySec[s]).map(s=>{const m=secMeta(s);return <div key={s} style={{padding:'10px 16px',borderRadius:12,border:'1px solid '+m.color+'55',background:m.color+'14'}}><SecPill section={s} small/><div style={{fontFamily:'var(--display)',fontWeight:800,fontSize:18,marginTop:4}}>{bySec[s].got}/{bySec[s].tot}</div></div>;})}
        </div>
        <p style={{color:'var(--muted)',fontSize:13.5,marginTop:20}}>Self-marked, all-or-nothing per question. XP for any first-time clears has been added to your hero.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:18}}>
          <button className="btn ghost" onClick={onQuit}>↺ New paper</button>
          <button className="btn primary" onClick={onFinish}>Return to map</button>
        </div>
      </div>
    </div></div>;
  }

  const m=secMeta(q.examSec);
  return <div className="view pop"><div className="card-stage">
    <div className="card-topbar">
      <button className="back-link" onClick={onQuit}>← Abandon exam</button>
      <SecPill section={q.examSec}/><span style={{color:m.color,fontFamily:'var(--display)',fontWeight:800,fontSize:13}}>{q.examMarks} mark{q.examMarks>1?'s':''}</span>
      <span style={{flex:1}}></span>
      <span style={{color:'var(--muted)',fontSize:13,fontWeight:600}}>Q{i+1} / {paper.length}</span>
    </div>
    <div className="xp-track" style={{marginBottom:14}}><div className="xp-fill" style={{width:((i)/paper.length*100)+'%',background:'linear-gradient(90deg,var(--amber),var(--pink))',boxShadow:'0 0 8px var(--amber)'}}></div></div>
    <div className={"flip"+(flip?' is-flipped':'')}>
      <div className="flip-inner">
        <div className="face front">
          <div className="face-head"><span style={{fontFamily:'var(--display)',fontWeight:800,fontSize:18}}>{q.label}</span><span style={{color:'var(--muted)',fontSize:12.5}}>Week {q.week} · {q.topic}</span></div>
          <div className="face-body"><SolutionText text={q.problem}/></div>
          <div className="face-foot"><span className="paper-note">✍️ Answer on paper as you would in the exam.</span><button className="btn primary" onClick={()=>setFlip(true)}>Flip to mark ↻</button></div>
        </div>
        <div className="face back">
          <div className="face-head"><span style={{fontFamily:'var(--display)',fontWeight:800,fontSize:16,color:'var(--mint)'}}>Model solution</span><button className="btn ghost sm" onClick={()=>setFlip(false)}>↻ Question</button></div>
          <div className="face-body">{q.tip && <div className="tip-callout"><span className="tip-ic">💡</span><div><b>Approach tip</b><div>{q.tip}</div></div></div>}<SolutionText text={q.solution}/></div>
          <div className="face-foot selfmark"><span style={{color:'var(--muted)',fontSize:13.5,fontWeight:600}}>Award yourself the {q.examMarks} mark{q.examMarks>1?'s':''}?</span><div style={{display:'flex',gap:10}}><button className="btn ghost" onClick={()=>grade(false)} style={{borderColor:'rgba(255,122,150,.4)'}}>✕ No</button><button className="btn primary" onClick={()=>grade(true)}>✓ Yes, +{q.examMarks}m</button></div></div>
        </div>
      </div>
    </div>
  </div></div>;
}
window.Castle = Castle;
