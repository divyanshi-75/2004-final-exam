/* ============================================================
   UTIL — fit scaling, section metadata, solution text renderer
   ============================================================ */
function useFitScale(W, H, padX=40, padY=90){
  const [scale,setScale] = React.useState(1);
  React.useEffect(()=>{
    const calc = ()=>{
      const sw = (window.innerWidth - padX) / W;
      const sh = (window.innerHeight - padY) / H;
      setScale(Math.min(sw, sh, 1.18));
    };
    calc(); window.addEventListener('resize', calc);
    return ()=>window.removeEventListener('resize', calc);
  },[W,H,padX,padY]);
  return scale;
}

const SECTION_META = {
  '1':   { short:'S1', label:'Section 1', cls:'sec-1', marks:'1 mark',  color:'#3ee0ff',
           blurb:'Short definitions & justifications · all-or-nothing' },
  '2':   { short:'S2', label:'Section 2', cls:'sec-2', marks:'2 marks', color:'#b49bff',
           blurb:'Apply your understanding · partial marks' },
  '3':   { short:'S3', label:'Section 3', cls:'sec-3', marks:'5 marks', color:'#ffce4d',
           blurb:'Choose-your-best mini-problems' },
  '2/3': { short:'S2–3', label:'Section 2 or 3', cls:'sec-23', marks:'2–5 marks', color:'#ff9be0',
           blurb:'Flexible weight' },
  'null':{ short:'Practice', label:'Practice', cls:'sec-prac', marks:'practice', color:'#8593c2',
           blurb:'No fixed exam weight · build fluency' },
};
function secMeta(s){ return SECTION_META[s===null ? 'null' : s] || SECTION_META['null']; }

function SecPill({section, small}){
  const m = secMeta(section);
  return <span className={"sec-pill "+m.cls} style={small?{fontSize:11,padding:'3px 9px'}:null}>
    <span className="dot"></span>{m.short}
    {!small && m.marks!=='practice' && <span style={{opacity:.7,fontWeight:600}}>· {m.marks}</span>}
  </span>;
}

// Render a string that may contain $...$ (inline) or $$...$$ (display) KaTeX math.
function renderMath(str){
  // Split on $$...$$ first (display), then $...$ (inline)
  const segments = [];
  const re = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
  let last = 0, m;
  while((m = re.exec(str)) !== null){
    if(m.index > last) segments.push({t:'text', s: str.slice(last, m.index)});
    const raw = m[1];
    const display = raw.startsWith('$$');
    const expr = display ? raw.slice(2,-2) : raw.slice(1,-1);
    try{
      const html = window.katex.renderToString(expr, {displayMode: display, throwOnError: false});
      segments.push({t:'math', html, display});
    } catch(e){
      segments.push({t:'text', s: raw});
    }
    last = m.index + m[0].length;
  }
  if(last < str.length) segments.push({t:'text', s: str.slice(last)});
  return segments.map((seg,i)=>{
    if(seg.t === 'text') return <span key={i}>{seg.s}</span>;
    if(seg.display) return <div key={i} className="math-display" dangerouslySetInnerHTML={{__html: seg.html}}/>;
    return <span key={i} className="math-inline" dangerouslySetInnerHTML={{__html: seg.html}}/>;
  });
}

function SolutionText({text}){
  if(!text) return <div style={{color:'var(--faint)'}}>No solution recorded for this one.</div>;
  const parts = text.split(/\n{2,}/);
  return <div className="soln-body">
    {parts.map((p,i)=> <p key={i} className="soln-para">{renderMath(p)}</p>)}
  </div>;
}
window.useFitScale=useFitScale; window.secMeta=secMeta; window.SecPill=SecPill;
window.SolutionText=SolutionText; window.SECTION_META=SECTION_META;
