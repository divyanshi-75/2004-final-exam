/* ============================================================
   LIBRARY VIZ — reusable interactive step-players
   Data-driven: author frames as data, these render + animate them.
   ============================================================ */
const VC = { // viz state colors
  idle:'#26315c', active:'#3ee0ff', done:'#54f0c8', pivot:'#ffce4d',
  compare:'#b49bff', frontier:'#ff7ac0', bad:'#ff6b8b', dim:'#1a2342',
  less:'#54f0c8', greater:'#ff9be0', text:'#eaf0ff',
};
function vcol(s){ return VC[s] || VC.idle; }

/* ---- core stepper shell: Prev / Next / dots + caption ---- */
function StepPlayer({frames, render, accent='#3ee0ff', autoKey}){
  const [i,setI] = React.useState(0);
  React.useEffect(()=>{ setI(0); },[autoKey]);
  const f = frames[i];
  const go = (d)=> setI(p=> Math.max(0, Math.min(frames.length-1, p+d)));
  return (
    <div className="viz">
      <div className="viz-stage">{render(f, i)}</div>
      <div className="viz-caption" style={{borderColor:accent+'44'}}>
        <span className="viz-step-ic" style={{background:accent}}>{i+1}</span>
        <span dangerouslySetInnerHTML={{__html: f.note||''}}/>
      </div>
      <div className="viz-controls">
        <button className="btn ghost sm" onClick={()=>go(-1)} disabled={i===0} style={{opacity:i===0?.4:1}}>‹ Back</button>
        <div className="viz-dots">
          {frames.map((_,k)=><span key={k} className={"vd"+(k===i?' on':'')} style={k===i?{background:accent,boxShadow:`0 0 8px ${accent}`}:null} onClick={()=>setI(k)}></span>)}
        </div>
        {i<frames.length-1
          ? <button className="btn primary sm" onClick={()=>go(1)}>Next ›</button>
          : <button className="btn sm" style={{background:accent,color:'#06131f'}} onClick={()=>setI(0)}>↻ Replay</button>}
      </div>
    </div>
  );
}

/* ---- ARRAY stepper: cells + optional aux row + pointers + brackets ---- */
function ArrayViz({frames, accent}){
  return <StepPlayer frames={frames} accent={accent} render={(f)=>(
    <div style={{display:'flex',flexDirection:'column',gap:18,alignItems:'center',width:'100%'}}>
      {f.title && <div className="viz-title">{f.title}</div>}
      <ArrayRow cells={f.cells} pointers={f.pointers} brackets={f.brackets} label={f.label}/>
      {f.aux && <ArrayRow cells={f.aux} label={f.auxLabel} small/>}
      {f.out && <ArrayRow cells={f.out} label={f.outLabel||'output'} small/>}
    </div>
  )}/>;
}
function ArrayRow({cells, pointers, brackets, label, small}){
  const sz = small? 38 : 46;
  return (
    <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
      {label && <div className="viz-rowlabel" style={{height:sz,lineHeight:sz+'px'}}>{label}</div>}
      <div style={{position:'relative',display:'flex',gap:6,paddingTop:pointers?22:0}}>
        {brackets && brackets.map((b,k)=>(
          <div key={k} className="viz-bracket" style={{left:b.from*(sz+6), width:(b.to-b.from+1)*(sz+6)-6, borderColor:vcol(b.state||'compare'), bottom:-22}}>
            <span style={{color:vcol(b.state||'compare')}}>{b.label}</span>
          </div>
        ))}
        {cells.map((c,k)=>{
          const st = c.state||'idle';
          return <div key={k} className="viz-cell" style={{width:sz,height:sz,
            background: st==='idle'?'#141d3e':vcol(st)+'22', borderColor:vcol(st),
            color: c.muted?'#5e6a92':VC.text, fontSize:small?14:16}}>
            <span>{c.v}</span>
            {c.tag && <span className="viz-celltag" style={{color:vcol(st)}}>{c.tag}</span>}
          </div>;
        })}
        {pointers && pointers.map((p,k)=>(
          <div key={k} className="viz-ptr" style={{left:p.i*(sz+6)+sz/2, color:vcol(p.state||'active')}}>
            <span>{p.label}</span><span className="viz-ptr-arrow">▾</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- GRAPH stepper: nodes + edges with per-frame states & labels ---- */
function GraphViz({nodes, edges, frames, accent, directed, w=460, h=300}){
  const npos = {}; nodes.forEach(n=>npos[n.id]=n);
  return <StepPlayer frames={frames} accent={accent} render={(f)=>{
    const ns = f.nodeState||{}, es = f.edgeState||{}, dist=f.dist||{}, el=f.edgeLabel||{};
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="viz-graph" style={{maxWidth:'100%'}}>
        <defs>
          <marker id="ah" markerWidth="11" markerHeight="11" refX="9" refY="3.5" orient="auto"><path d="M0,0 L9,3.5 L0,7 Z" fill="#6b79a8"/></marker>
          <marker id="ah-on" markerWidth="11" markerHeight="11" refX="9" refY="3.5" orient="auto"><path d="M0,0 L9,3.5 L0,7 Z" fill={accent}/></marker>
        </defs>
        {edges.map((e,k)=>{
          const a=npos[e.u], b=npos[e.v]; const key=e.u+'-'+e.v;
          const st = es[key]||es[e.v+'-'+e.u]||'idle';
          const on = st!=='idle';
          const col = on? vcol(st):'#3a4775';
          // trim line to node boundary so the arrowhead sits outside the circle
          const dx=b.x-a.x, dy=b.y-a.y, len=Math.hypot(dx,dy)||1, ux=dx/len, uy=dy/len;
          const rA=21, rB=directed?26:21;
          const x1=a.x+ux*rA, y1=a.y+uy*rA, x2=b.x-ux*rB, y2=b.y-uy*rB;
          const mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
          const lab = (el[key]!=null? el[key] : e.w);
          return <g key={k}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={on?3.5:2.2}
              markerEnd={directed? (on?'url(#ah-on)':'url(#ah)'):null} opacity={on?1:.9}/>
            {lab!=null && <g><circle cx={mx} cy={my} r="11" fill="#0a1024" stroke={col} strokeWidth="1.5"/>
              <text x={mx} y={my+4} textAnchor="middle" fontSize="12" fill={on?VC.text:'#8493c0'} fontFamily="var(--mono)">{lab}</text></g>}
          </g>;
        })}
        {nodes.map((n,k)=>{
          const st = ns[n.id]||'idle'; const col=vcol(st);
          return <g key={k}>
            <circle cx={n.x} cy={n.y} r="19" fill={st==='idle'?'#141d3e':col+'22'} stroke={col} strokeWidth={st==='idle'?2:3}/>
            <text x={n.x} y={n.y+5} textAnchor="middle" fontSize="15" fontWeight="700" fill={VC.text} fontFamily="var(--display)">{n.label||n.id}</text>
            {dist[n.id]!=null && <g><rect x={n.x+12} y={n.y-26} width="26" height="17" rx="5" fill="#0a1024" stroke={accent} strokeWidth="1"/>
              <text x={n.x+25} y={n.y-14} textAnchor="middle" fontSize="11" fill={accent} fontFamily="var(--mono)">{dist[n.id]}</text></g>}
          </g>;
        })}
      </svg>
    );
  }}/>;
}

/* ---- GRID stepper: DP table that fills in ---- */
function GridViz({rows, cols, rowLabels, colLabels, frames, accent, cap}){
  return <StepPlayer frames={frames} accent={accent} render={(f)=>{
    const cells = f.cells||{};
    const cw = Math.min(46, 360/(cols+1));
    return <div style={{display:'flex',flexDirection:'column',gap:14,alignItems:'center',overflowX:'auto',maxWidth:'100%'}}>
      {f.title && <div className="viz-title">{f.title}</div>}
      <table className="viz-grid"><tbody>
        <tr><td className="vg-corner">{cap||''}</td>{Array.from({length:cols}).map((_,c)=><td key={c} className="vg-head" style={{width:cw,height:cw}}>{colLabels?colLabels[c]:c}</td>)}</tr>
        {Array.from({length:rows}).map((_,r)=>(
          <tr key={r}><td className="vg-head" style={{width:cw,height:cw}}>{rowLabels?rowLabels[r]:r}</td>
            {Array.from({length:cols}).map((_,c)=>{
              const cell = cells[r+','+c]; const st = cell?cell.state:'empty';
              return <td key={c} className="vg-cell" style={{width:cw,height:cw,
                background: !cell?'#0d1430': st==='idle'?'#141d3e':vcol(st)+'26',
                borderColor: cell?vcol(st):'#1a2342', color:VC.text,
                fontWeight: st==='done'||st==='active'?700:400}}>{cell?cell.v:''}</td>;
            })}
          </tr>
        ))}
      </tbody></table>
    </div>;
  }}/>;
}

/* ---- TREE stepper: positioned nodes + edges ---- */
function TreeViz({frames, accent, w=460, h=300}){
  return <StepPlayer frames={frames} accent={accent} render={(f)=>(
    <svg viewBox={`0 0 ${w} ${h}`} className="viz-graph" style={{maxWidth:'100%'}}>
      {(f.edges||[]).map((e,k)=>{
        const a=f.nodes.find(n=>n.id===e[0]), b=f.nodes.find(n=>n.id===e[1]);
        if(!a||!b) return null;
        const on=e[2]&&e[2]!=='idle';
        return <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on?vcol(e[2]):'#2c3760'} strokeWidth={on?3.5:2}/>;
      })}
      {f.nodes.map((n,k)=>{
        const st=n.state||'idle'; const col=vcol(st); const r=n.r||18;
        return <g key={k}>
          <circle cx={n.x} cy={n.y} r={r} fill={st==='idle'?'#141d3e':col+'22'} stroke={col} strokeWidth={st==='idle'?2:3}/>
          <text x={n.x} y={n.y+5} textAnchor="middle" fontSize={n.small?12:15} fontWeight="700" fill={VC.text} fontFamily="var(--display)">{n.label}</text>
          {n.bf!=null && <text x={n.x+r+2} y={n.y-r+2} fontSize="10" fill={accent} fontFamily="var(--mono)">{n.bf}</text>}
        </g>;
      })}
      {f.note2 && <text x={w/2} y={h-6} textAnchor="middle" fontSize="12" fill="#8493c0">{f.note2}</text>}
    </svg>
  )}/>;
}

Object.assign(window, { StepPlayer, ArrayViz, ArrayRow, GraphViz, GridViz, TreeViz, vcol, VC });
