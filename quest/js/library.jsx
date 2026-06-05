/* ============================================================
   LIBRARY — bookshelf island + gamified chapter reader
   ============================================================ */

/* ---- reading-progress store (separate from XP economy) ---- */
const READ_KEY = 'fit2004q_read_v1';
const ReadStore = (function(){
  let data; try{ data = JSON.parse(localStorage.getItem(READ_KEY)) || {}; }catch(e){ data = {}; }
  const subs = new Set();
  const emit = ()=>subs.forEach(f=>f());
  const save = ()=>{ try{ localStorage.setItem(READ_KEY, JSON.stringify(data)); }catch(e){} };
  return {
    subscribe(f){ subs.add(f); return ()=>subs.delete(f); },
    isRead(w,ch){ return !!(data[w] && data[w][ch]); },
    markRead(w,ch){ data[w]=data[w]||{}; if(!data[w][ch]){ data[w][ch]=1; save(); emit(); } },
    weekProgress(w){
      const total = (WEEK_LESSONS[w]?WEEK_LESSONS[w].chapters.length:0);
      const read = data[w] ? Object.keys(data[w]).length : 0;
      return { read, total, pct: total? read/total : 0, done: total>0 && read>=total };
    },
  };
})();
function useRead(){ const [,f]=React.useReducer(x=>x+1,0); React.useEffect(()=>ReadStore.subscribe(f),[]); return ReadStore; }

/* ---- one spine on the shelf ---- */
function Book({week, onOpen}){
  const read = useRead();
  const wk = window.GAME_DATA.weeks.find(w=>w.week===week);
  const color = (window.TOPIC_COLOR && TOPIC_COLOR[wk.topic]) || '#b49bff';
  const pr = read.weekProgress(week);
  const dark = `color-mix(in srgb, ${color} 64%, #0a0e1f)`;
  return (
    <div className="book" onClick={()=>onOpen(week)}
      style={{background:`linear-gradient(100deg, ${dark}, ${color})`}}>
      <div className="book-wk">WK {week}</div>
      {pr.done && <div className="book-read-badge" title="Mastered">✓</div>}
      <div className="book-title">{wk.topic}</div>
      <div className="book-topic">{wk.name}</div>
      <div className="book-prog">
        <div className="t"><div className="f" style={{width:(pr.pct*100)+'%'}}></div></div>
        <div className="n">{pr.read}/{pr.total} chapters</div>
      </div>
    </div>
  );
}

/* ---- block renderers ---- */
function Demo({block}){
  const a = block.accent || '#3ee0ff';
  if(block.kind==='array') return <ArrayViz frames={block.frames} accent={a}/>;
  if(block.kind==='graph') return <GraphViz nodes={block.nodes} edges={block.edges} frames={block.frames} accent={a} directed={block.directed} w={block.w} h={block.h}/>;
  if(block.kind==='grid')  return <GridViz rows={block.rows} cols={block.cols} rowLabels={block.rowLabels} colLabels={block.colLabels} cap={block.cap} frames={block.frames} accent={a}/>;
  if(block.kind==='tree')  return <TreeViz frames={block.frames} accent={a} w={block.w} h={block.h}/>;
  return null;
}
function Checkpoint({block}){
  const [open,setOpen] = React.useState(false);
  return (
    <div className="check">
      <div className="q"><span className="qic">🧩</span><span dangerouslySetInnerHTML={{__html:block.q}}/></div>
      {!open
        ? <div className="reveal"><button className="btn ghost sm" onClick={()=>setOpen(true)}>Reveal answer</button></div>
        : <div className="ans"><b>Answer · </b><span dangerouslySetInnerHTML={{__html:block.a}}/></div>}
    </div>
  );
}
function Block({block}){
  switch(block.t){
    case 'p': return <p className="blk-p" dangerouslySetInnerHTML={{__html:block.x}}/>;
    case 'h': return <div className="blk-h"><span className="hbar"></span>{block.x}</div>;
    case 'insight': case 'analogy': case 'warn': {
      const ic = block.t==='insight'?'💡':block.t==='analogy'?'🎮':'⚠️';
      return <div className={"callout "+block.t}><span className="ic">{ic}</span><div>{block.title&&<b>{block.title}</b>}<div className="ctext" dangerouslySetInnerHTML={{__html:block.x}}/></div></div>;
    }
    case 'code': return <div className="blk-code"><pre>{block.x}</pre></div>;
    case 'cx': return <div className="cx-row">{block.items.map((it,i)=>(
      <div key={i} className={"cx-badge "+(it.cls||'')}><span className="l">{it.k}</span><span className="v">{it.v}</span>{it.note&&<span className="note">{it.note}</span>}</div>
    ))}</div>;
    case 'check': return <Checkpoint block={block}/>;
    case 'demo': return <Demo block={block}/>;
    default: return null;
  }
}

/* ---- the chapter reader ---- */
function BookReader({week, onBack}){
  const read = useRead();
  const wk = window.GAME_DATA.weeks.find(w=>w.week===week);
  const lesson = WEEK_LESSONS[week];
  const color = (window.TOPIC_COLOR && TOPIC_COLOR[wk.topic]) || '#b49bff';
  const [ci, setCi] = React.useState(0);
  const chapter = lesson.chapters[ci];
  const viewRef = React.useRef(null);

  React.useEffect(()=>{ if(viewRef.current) viewRef.current.scrollTop = 0; },[ci]);
  const soft = `color-mix(in srgb, ${color} 16%, transparent)`;

  const finishChapter = ()=>{
    read.markRead(week, chapter.id);
    if(ci < lesson.chapters.length-1) setCi(ci+1);
  };

  return (
    <div className="view" ref={viewRef} style={{['--accent']:color, ['--accent-soft']:soft}}>
      <div className="view-inner reader">
        <button className="back-link" onClick={onBack}>← Back to the Library</button>

        <div className="panel lib-hero" style={{background:`linear-gradient(120deg, ${soft}, rgba(12,17,38,.92) 62%)`, borderColor:color+'55', marginTop:14}}>
          <div className="book" style={{width:74,height:108,cursor:'default',background:`linear-gradient(100deg, color-mix(in srgb, ${color} 64%, #0a0e1f), ${color})`, flexShrink:0}}>
            <div className="book-wk" style={{fontSize:9}}>WK {week}</div>
          </div>
          <div style={{flex:1,minWidth:200}}>
            <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
              <span className="isle-week" style={{position:'static',transform:'none',borderColor:color,color}}>WEEK {week}</span>
              <span style={{color:'var(--muted)',fontWeight:600,fontSize:13}}>{wk.name}</span>
            </div>
            <h1 className="h-title" style={{marginTop:8}}>{wk.topic}</h1>
            <p className="h-sub" style={{marginTop:4}}>{lesson.hook}</p>
          </div>
        </div>

        {/* chapter rail */}
        <div className="chapter-rail">
          {lesson.chapters.map((c,i)=>{
            const isRead = read.isRead(week,c.id);
            return <button key={c.id} className={"chapter-tab"+(i===ci?' on':'')+(isRead?' read':'')}
              style={i===ci?{borderColor:color,background:soft}:null} onClick={()=>setCi(i)}>
              <span className="ci">{isRead?'✓':i+1}</span><span>{c.icon} {c.title}</span>
            </button>;
          })}
        </div>

        {/* blocks */}
        <div className="blocks" key={chapter.id}>
          {chapter.blocks.map((b,i)=><Block key={i} block={b}/>)}
        </div>

        {/* footer nav */}
        <div className="reader-nav">
          <button className="btn ghost sm" onClick={()=>setCi(Math.max(0,ci-1))} disabled={ci===0} style={{opacity:ci===0?.4:1}}>‹ Previous chapter</button>
          {ci < lesson.chapters.length-1
            ? <button className="btn sm mark-read-btn" style={{background:color,color:'#06131f'}} onClick={finishChapter}>Mark read &amp; continue ›</button>
            : <button className="btn sm mark-read-btn" style={{background:color,color:'#06131f'}} onClick={()=>{read.markRead(week,chapter.id); onBack();}}>✓ Finish book</button>}
        </div>
      </div>
    </div>
  );
}

/* ---- library island interior (shelves) ---- */
function Library({onBack}){
  const read = useRead();
  const [open, setOpen] = React.useState(null);
  if(open!=null) return <BookReader week={open} onBack={()=>setOpen(null)}/>;

  const weeks = window.GAME_DATA.weeks;
  const shelves = [weeks.slice(0,4), weeks.slice(4,8), weeks.slice(8,11)];
  const mastered = weeks.filter(w=>read.weekProgress(w.week).done).length;

  return (
    <div className="view pop">
      <div className="view-inner">
        <button className="back-link" onClick={onBack}>← Back to the map</button>
        <div className="panel lib-hero">
          <div style={{fontSize:54,lineHeight:1}}>📚</div>
          <div style={{flex:1,minWidth:220}}>
            <h1 className="h-title">The Great Library</h1>
            <p className="h-sub">Every week's lectures, retold as interactive chapters. Pull a tome off the shelf and actually <i>learn</i> the content — step through the algorithms, don't just read about them.</p>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:'var(--display)',fontWeight:800,fontSize:34,color:'var(--violet)',lineHeight:1}}>{mastered}<span style={{color:'var(--faint)',fontSize:18}}>/11</span></div>
            <div style={{color:'var(--muted)',fontSize:12,fontWeight:600}}>tomes mastered</div>
          </div>
        </div>

        <div className="shelf-wrap">
          {shelves.map((row,i)=>(
            <div key={i} className="shelf">
              <div className="shelf-row">
                {row.map(w=><Book key={w.week} week={w.week} onOpen={setOpen}/>)}
              </div>
              <div className="shelf-plank"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
window.Library = Library;
window.Demo = Demo;
// pull authored demo blocks for a given week (reused in the flashcard technique panel)
window.weekDemoBlocks = function(week){
  const L = window.WEEK_LESSONS && WEEK_LESSONS[week];
  if(!L) return [];
  const out = [];
  L.chapters.forEach(ch=> ch.blocks.forEach(b=>{ if(b.t==='demo') out.push({demo:b, chapter:ch.title, icon:ch.icon}); }));
  return out;
};
