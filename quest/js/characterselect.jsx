/* ============================================================
   CHARACTER SELECT
   ============================================================ */
function CharacterSelect({onConfirm, initial}){
  const game = useGame();
  const [sel, setSel] = React.useState(initial || game.getChar() || null);
  return (
    <div className="view pop" style={{inset:0}}>
      <div className="view-inner" style={{maxWidth:1040, paddingTop:74}}>
        <div style={{textAlign:'center', marginBottom:6}}>
          <div style={{fontFamily:'var(--display)', fontWeight:800, letterSpacing:'.5px', color:'var(--cyan)', fontSize:14}}>FIT2004 · QUEST</div>
          <h1 className="h-title" style={{fontSize:'clamp(30px,5vw,52px)'}}>Choose your hero</h1>
          <p className="h-sub" style={{maxWidth:560, margin:'8px auto 0'}}>Pick the adventurer who'll roam the islands with you. You can swap any time — your progress stays.</p>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18, marginTop:30}}>
          {HERO_LIST.map(id=>{
            const h = HEROES[id]; const on = sel===id;
            return (
              <button key={id} onClick={()=>setSel(id)} className="hero-card"
                style={{
                  position:'relative', padding:'24px 18px 20px', borderRadius:'var(--r-lg)', textAlign:'center',
                  background: on ? `linear-gradient(180deg, ${h.color}22, rgba(12,17,38,.9))` : 'linear-gradient(180deg,rgba(20,28,58,.7),rgba(12,17,38,.85))',
                  border: '2px solid '+(on? h.color : 'var(--bd)'),
                  boxShadow: on ? `0 0 0 4px ${h.color}22, 0 20px 50px -18px ${h.color}88` : 'var(--shadow)',
                  transform: on ? 'translateY(-4px)' : 'none', transition:'.2s', cursor:'pointer'
                }}>
                {on && <div style={{position:'absolute',top:12,right:12,width:24,height:24,borderRadius:'50%',background:h.color,color:'#0b1024',display:'grid',placeItems:'center',fontWeight:900,fontSize:14}}>✓</div>}
                <div style={{height:120, display:'grid', placeItems:'center'}}>
                  <div style={{transition:'.3s', transform: on?'scale(1.08)':'scale(1)'}}><Avatar id={id} size={108}/></div>
                </div>
                <div style={{fontFamily:'var(--display)', fontWeight:800, fontSize:21, marginTop:4}}>{h.name}</div>
                <div style={{color:h.color, fontWeight:700, fontSize:12.5, letterSpacing:'.4px', textTransform:'uppercase'}}>{h.title}</div>
                <div style={{color:'var(--muted)', fontSize:13, marginTop:7}}>{h.archetype}</div>
              </button>
            );
          })}
        </div>

        <div style={{textAlign:'center', marginTop:30}}>
          <button className="btn primary" disabled={!sel} style={{opacity:sel?1:.4, pointerEvents:sel?'auto':'none', padding:'15px 40px', fontSize:17}}
            onClick={()=>{ game.setChar(sel); onConfirm(); }}>
            {initial? 'Save hero' : 'Start the adventure'} →
          </button>
        </div>
      </div>
    </div>
  );
}
window.CharacterSelect = CharacterSelect;
