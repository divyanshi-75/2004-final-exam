/* ============================================================
   MOUNTAIN — a week's stage: progress + section-grouped cards
   ============================================================ */
function StatRing({pct, size=84, stroke=9, color='#54f0c8', label, sub}){
  const r=(size-stroke)/2, c=2*Math.PI*r, off=c*(1-pct);
  return (
    <div style={{position:'relative', width:size, height:size}}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} style={{transition:'stroke-dashoffset .7s cubic-bezier(.2,.9,.3,1)', filter:`drop-shadow(0 0 5px ${color})`}}/>
      </svg>
      <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', textAlign:'center'}}>
        <div><div style={{fontFamily:'var(--display)', fontWeight:800, fontSize:18, lineHeight:1}}>{label}</div>
        {sub && <div style={{fontSize:10, color:'var(--muted)'}}>{sub}</div>}</div>
      </div>
    </div>
  );
}

function Mountain({week, onBack, onOpenQuestion}){
  const game = useGame();
  const wk = window.GAME_DATA.weeks.find(w=>w.week===week);
  const all = window.GAME_DATA.questions.filter(q=>q.week===week);
  const st = game.weekStats(week);
  const char = game.getChar()||'pip';
  const [filter,setFilter] = React.useState('all');
  const color = TOPIC_COLOR[wk.topic]||'#9fb0e0';

  const secOrder = ['1','2','3','2/3',null];
  const queue = all.map(q=>q.id);
  const match = (q)=> filter==='all' ? true : filter==='left' ? game.qStatus(q.id)!=='solved' : filter==='rec' ? q.rec : q.key;

  return (
    <div className="view pop">
      <div className="view-inner">
        <button className="back-link" onClick={onBack}>← Back to the map</button>

        {/* hero band */}
        <div className="panel" style={{marginTop:16, padding:'22px 26px', display:'flex', gap:24, alignItems:'center', flexWrap:'wrap',
          background:`linear-gradient(120deg, ${color}1f, rgba(12,17,38,.92) 60%)`, borderColor:color+'55'}}>
          <div style={{filter:`drop-shadow(0 8px 16px ${color}66)`}}><Avatar id={char} size={92}/></div>
          <div style={{flex:1, minWidth:220}}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <span className="isle-week" style={{position:'static', transform:'none', borderColor:color, color}}>WEEK {week}</span>
              <span style={{color:'var(--muted)', fontWeight:600, fontSize:13}}>{wk.topic}</span>
            </div>
            <h1 className="h-title" style={{marginTop:8}}>{wk.name}</h1>
            <p className="h-sub" style={{marginTop:4}}>Roam freely — attempt anything, in any order, as many times as you like.</p>
          </div>
          <StatRing pct={st.pct} color={color} label={Math.round(st.pct*100)+'%'} sub="cleared" size={96}/>
          <div style={{display:'flex', flexDirection:'column', gap:10, minWidth:150}}>
            <div className="mini-stat"><b>{st.solved}</b><span>of {st.total} cleared</span></div>
            <div className="mini-stat" style={{color:'var(--gold)'}}><b>{st.recRemain}</b><span>recommended left</span></div>
            <div className="mini-stat" style={{color:'var(--key)'}}><b>{st.keyRemain}</b><span>★ key left</span></div>
          </div>
        </div>

        {/* section legend / clarity strip */}
        <div className="sec-legend">
          {['1','2','3'].map(s=>{
            const m=secMeta(s); const b=st.bySec[s]||{total:0,solved:0};
            return <div key={s} className="sec-legend-card" style={{borderColor:m.color+'55'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <SecPill section={s}/>
                <span style={{fontFamily:'var(--display)',fontWeight:800,fontSize:15}}>{b.solved}<span style={{color:'var(--faint)',fontWeight:600,fontSize:13}}>/{b.total}</span></span>
              </div>
              <div className="xp-track" style={{marginTop:10}}><div className="xp-fill" style={{width:(b.total? b.solved/b.total*100:0)+'%', background:m.color, boxShadow:`0 0 8px ${m.color}`}}></div></div>
              <div style={{fontSize:11.5, color:'var(--muted)', marginTop:8}}>{m.blurb}</div>
            </div>;
          })}
        </div>

        {/* filters */}
        <div style={{display:'flex', gap:8, margin:'22px 0 6px', flexWrap:'wrap', alignItems:'center'}}>
          <span style={{color:'var(--muted)', fontSize:13, fontWeight:600, marginRight:4}}>Show</span>
          {[['all','All'],['left','Not cleared'],['rec','Recommended'],['key','★ Key']].map(([k,l])=>(
            <button key={k} className={"hud-btn"+(filter===k?' active':'')} style={{padding:'6px 14px', fontSize:13}} onClick={()=>setFilter(k)}>{l}</button>
          ))}
        </div>

        {/* sections with question chips */}
        {secOrder.map(s=>{
          const qs = all.filter(q=>q.section===s && match(q));
          if(!qs.length) return null;
          const m = secMeta(s);
          return (
            <section key={String(s)} style={{marginTop:22}}>
              <div className="sec-head">
                <SecPill section={s}/>
                <span className="sec-head-blurb">{m.blurb}</span>
                <span style={{flex:1}}></span>
                <span style={{color:'var(--faint)', fontSize:12.5, fontWeight:600}}>{qs.length} question{qs.length>1?'s':''}</span>
              </div>
              <div className="chip-grid">
                {qs.map(q=>{
                  const status = game.qStatus(q.id);
                  return (
                    <button key={q.id} className={"q-chip status-"+status} onClick={()=>onOpenQuestion(q.id, queue)}>
                      <span className={"pip "+(status==='solved'?'solved':status==='tried'?'tried':'')}></span>
                      <span className="q-chip-label">{q.label}</span>
                      <span style={{flex:1}}></span>
                      {q.key && <span className="sec-pill tag-key" style={{fontSize:10,padding:'2px 7px'}}>★</span>}
                      {q.rec && !q.key && <span className="sec-pill tag-rec" style={{fontSize:10,padding:'2px 7px'}}>REC</span>}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
window.Mountain = Mountain;
