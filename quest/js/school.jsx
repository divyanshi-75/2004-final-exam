/* ============================================================
   SCHOOL / ACADEMY — codex, algorithms, data structures, review
   ============================================================ */
function School({onBack}){
  const [tab,setTab] = React.useState('codex');
  const D = window.SCHOOL_DATA;
  const tabs = [['codex','📖 Concept Codex'],['algos','⚙️ Algorithms'],['ds','🧱 Data Structures'],['review','🃏 Flashcard Review']];

  return (
    <div className="view pop">
      <div className="view-inner">
        <button className="back-link" onClick={onBack}>← Back to the map</button>
        <div className="panel" style={{marginTop:16, padding:'22px 26px', display:'flex', gap:20, alignItems:'center',
          background:'linear-gradient(120deg, rgba(84,240,200,.14), rgba(12,17,38,.92) 60%)', borderColor:'rgba(84,240,200,.4)'}}>
          <div style={{width:64,height:64}}><SchoolBuilding size={64}/></div>
          <div>
            <h1 className="h-title">The Academy</h1>
            <p className="h-sub">Learn and revise the ideas — no scoring here. Quick references, then drill the deck when you're ready.</p>
          </div>
        </div>

        <div className="school-tabs">
          {tabs.map(([k,l])=>(<button key={k} className={"hud-btn"+(tab===k?' active':'')} onClick={()=>setTab(k)}>{l}</button>))}
        </div>

        {tab==='codex' && <CodexTab data={D.glossary}/>}
        {tab==='algos' && <AlgoTab data={D.algorithms}/>}
        {tab==='ds' && <DSTab data={D.structures}/>}
        {tab==='review' && <ReviewTab/>}
      </div>
    </div>
  );
}

function CodexTab({data}){
  const groups = ['All', ...Array.from(new Set(data.map(d=>d.group)))];
  const [g,setG] = React.useState('All');
  const list = g==='All'? data : data.filter(d=>d.group===g);
  return <div>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:16}}>
      {groups.map(x=><button key={x} className={"hud-btn"+(g===x?' active':'')} style={{padding:'6px 14px',fontSize:13}} onClick={()=>setG(x)}>{x}</button>)}
    </div>
    <div className="codex-grid">
      {list.map((c,i)=>(<div key={i} className="codex-card">
        <div className="ct">{c.term}</div>
        <div className="cg">{c.group}</div>
        <div className="cd">{c.def}</div>
      </div>))}
    </div>
  </div>;
}

function AlgoTab({data}){
  return <div style={{overflowX:'auto'}}>
    <table className="ref-table">
      <thead><tr><th>Algorithm</th><th>Time</th><th>Space</th><th>Notes</th></tr></thead>
      <tbody>{data.map((a,i)=>(<tr key={i}>
        <td className="nm">{a.name}</td><td className="mono">{a.time}</td><td className="mono" style={{color:'var(--violet)'}}>{a.space}</td>
        <td style={{color:'var(--muted)'}}>{a.note}</td></tr>))}</tbody>
    </table>
  </div>;
}
function DSTab({data}){
  return <div style={{overflowX:'auto'}}>
    <table className="ref-table">
      <thead><tr><th>Data structure</th><th>Key operations</th></tr></thead>
      <tbody>{data.map((d,i)=>(<tr key={i}><td className="nm">{d.name}</td><td className="mono" style={{color:'#cfe0ff',fontWeight:500}}>{d.ops}</td></tr>))}</tbody>
    </table>
  </div>;
}

/* flashcard review — flip & browse, NO scoring */
function ReviewTab(){
  const topics = Array.from(new Set(window.GAME_DATA.questions.map(q=>q.topic))).filter(t=>t!=='General');
  const [topic,setTopic] = React.useState(topics[0]);
  const pool = window.GAME_DATA.questions.filter(q=>q.topic===topic && q.solution);
  const [i,setI] = React.useState(0);
  const [flip,setFlip] = React.useState(false);
  React.useEffect(()=>{ setI(0); setFlip(false); },[topic]);
  React.useEffect(()=>{ setFlip(false); },[i]);
  const q = pool[i];
  return <div>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:16}}>
      {topics.map(t=><button key={t} className={"hud-btn"+(topic===t?' active':'')} style={{padding:'6px 14px',fontSize:13}} onClick={()=>setTopic(t)}>{t}</button>)}
    </div>
    <div style={{color:'var(--muted)',fontSize:13,margin:'14px 2px 4px'}}>Pure revision — flip freely, nothing is scored. {pool.length} cards in <b style={{color:'var(--ink)'}}>{topic}</b>.</div>
    {q && <div className="card-stage" style={{padding:'8px 0 0'}}>
      <div className={"flip"+(flip?' is-flipped':'')} style={{height:'min(52vh,460px)'}}>
        <div className="flip-inner">
          <div className="face front">
            <div className="face-head"><span style={{fontFamily:'var(--display)',fontWeight:800,fontSize:18}}>{q.label}</span><span style={{display:'flex',gap:8,alignItems:'center'}}><SecPill section={q.section} small/><span style={{color:'var(--muted)',fontSize:12}}>Wk {q.week}</span></span></div>
            <div className="face-body"><SolutionText text={q.problem}/></div>
            <div className="face-foot"><span className="paper-note">Try it in your head, then peek.</span><button className="btn primary sm" onClick={()=>setFlip(true)}>Reveal ↻</button></div>
          </div>
          <div className="face back">
            <div className="face-head"><span style={{fontFamily:'var(--display)',fontWeight:800,fontSize:16,color:'var(--mint)'}}>Solution</span><button className="btn ghost sm" onClick={()=>setFlip(false)}>↻ Hide</button></div>
            <div className="face-body">{q.tip && <div className="tip-callout"><span className="tip-ic">💡</span><div><b>Approach tip</b><div>{q.tip}</div></div></div>}<SolutionText text={q.solution}/></div>
          </div>
        </div>
      </div>
      <div className="card-nav">
        <button className="btn ghost sm" onClick={()=>setI(Math.max(0,i-1))} disabled={i===0} style={{opacity:i===0?.4:1}}>← Prev</button>
        <span style={{color:'var(--muted)',fontSize:13,alignSelf:'center',fontWeight:600}}>{i+1} / {pool.length}</span>
        <button className="btn ghost sm" onClick={()=>setI(Math.min(pool.length-1,i+1))} disabled={i===pool.length-1} style={{opacity:i===pool.length-1?.4:1}}>Next →</button>
      </div>
    </div>}
  </div>;
}
window.School = School;
