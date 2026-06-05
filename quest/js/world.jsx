/* ============================================================
   WORLD — floating-island overworld map
   ============================================================ */
const WORLD = { W:1500, H:770 };

const TOPIC_COLOR = {
  'Complexity':'#3ee0ff', 'Proofs & Induction':'#b49bff', 'Sorting & Selection':'#ffce4d',
  'Graphs':'#54f0c8', 'Divide & Conquer':'#ff7ac0', 'Dynamic Programming':'#a6ff5c',
  'Trees & Tries':'#7dd3fc', 'Network Flow':'#5eead4', 'Greedy':'#ffa24d',
  'Heaps':'#ff9be0', 'Hashing':'#c2a3ff', 'Mixed':'#9fb0e0', 'General':'#9fb0e0',
};
const NODE_POS = {
  1:[135,565], 2:[285,420], 3:[223,257], 4:[403,183], 5:[567,273],
  6:[513,473], 7:[687,559], 8:[843,447], 9:[787,267], 10:[975,221], 11:[1131,335],
};
const SCHOOL_POS = [1135,585];
const CASTLE_POS = [1357,165];
const LIBRARY_POS = [345,632];

function shade(hex, amt){ // darken toward navy
  const c = hex.replace('#',''); const r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b=parseInt(c.slice(4,6),16);
  const f=(x,t)=>Math.round(x+(t-x)*amt);
  return `rgb(${f(r,18)},${f(g,26)},${f(b,64)})`;
}

function Island({color, size=170}){
  const dark = shade(color,.62), darker = shade(color,.82);
  const gid = 'cap'+color.replace('#','');
  return (
    <svg viewBox="0 0 160 170" width={size} height={size*170/160} style={{overflow:'visible'}}>
      <defs>
        <radialGradient id={gid} cx="42%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".85"/>
          <stop offset="40%" stopColor={color}/>
          <stop offset="100%" stopColor={shade(color,.35)}/>
        </radialGradient>
      </defs>
      {/* glow halo */}
      <ellipse cx="80" cy="58" rx="60" ry="26" fill={color} opacity=".22"/>
      {/* underside rock */}
      <path d="M30 58 L80 168 L130 58 Q80 84 30 58Z" fill={darker}/>
      <path d="M30 58 L80 168 L66 96 Q44 80 30 58Z" fill={dark} opacity=".75"/>
      <path d="M80 168 L94 100 Q116 82 130 58 L80 168Z" fill="#0b1024" opacity=".5"/>
      {/* floating debris */}
      <path d="M50 120 l8 5 -3 9 -9 -3Z" fill={dark}/>
      <path d="M104 112 l9 4 -2 9 -9 -2Z" fill={dark} opacity=".8"/>
      {/* top plateau */}
      <ellipse cx="80" cy="56" rx="52" ry="21" fill={'url(#'+gid+')'}/>
      <ellipse cx="80" cy="54" rx="52" ry="20" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5"/>
      {/* crystals on top */}
      <path d="M64 44 L70 22 L76 44Z" fill={color} stroke="#fff" strokeOpacity=".6" strokeWidth="1"/>
      <path d="M82 46 L92 18 L100 46Z" fill={color} stroke="#fff" strokeOpacity=".6" strokeWidth="1"/>
      <path d="M82 46 L92 18 L92 46Z" fill="#fff" opacity=".25"/>
      <ellipse cx="66" cy="50" rx="14" ry="5" fill="#fff" opacity=".3"/>
    </svg>
  );
}

function SchoolBuilding({size=150}){
  return (
    <svg viewBox="0 0 180 168" width={size} height={size*168/180} style={{overflow:'visible'}}>
      <ellipse cx="90" cy="150" rx="70" ry="14" fill="#54f0c8" opacity=".2"/>
      <path d="M30 150 L90 166 L150 150 Q90 130 30 150Z" fill="#101a3a"/>
      {/* base */}
      <rect x="40" y="92" width="100" height="54" rx="4" fill="#1a2654"/>
      <rect x="40" y="92" width="100" height="54" rx="4" fill="url(#schoolG)"/>
      <defs><linearGradient id="schoolG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3a7a"/><stop offset="1" stopColor="#16204a"/></linearGradient></defs>
      {/* columns */}
      {[50,68,86,104,122].map((x,i)=><rect key={i} x={x} y={98} width="8" height="44" rx="2" fill="#3a4d92"/>)}
      {/* pediment roof */}
      <path d="M30 96 L90 58 L150 96Z" fill="#54f0c8"/>
      <path d="M30 96 L90 58 L90 96Z" fill="#7afad8"/>
      <path d="M40 96 L90 66 L140 96Z" fill="#14233f" opacity=".25"/>
      {/* glowing knowledge orb */}
      <circle cx="90" cy="82" r="7" fill="#aef9e6"/><circle cx="90" cy="82" r="11" fill="none" stroke="#54f0c8" strokeWidth="1.5" opacity=".6"/>
      {/* door */}
      <rect x="80" y="116" width="20" height="30" rx="9" fill="#0c1430"/>
      <rect x="80" y="116" width="20" height="30" rx="9" fill="none" stroke="#54f0c8" strokeWidth="1.5" opacity=".7"/>
    </svg>
  );
}

function CastleBuilding({size=210}){
  const A='#ffce4d', V='#b49bff';
  return (
    <svg viewBox="0 0 220 210" width={size} height={size*210/220} style={{overflow:'visible'}}>
      <ellipse cx="110" cy="190" rx="92" ry="18" fill={A} opacity=".2"/>
      <path d="M24 188 L110 208 L196 188 Q110 162 24 188Z" fill="#0e1736"/>
      {/* curtain wall */}
      <rect x="46" y="120" width="128" height="64" fill="#2a2150"/>
      <rect x="46" y="120" width="128" height="64" fill="url(#castG)"/>
      <defs><linearGradient id="castG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2f6e"/><stop offset="1" stopColor="#1c1640"/></linearGradient></defs>
      {/* battlements */}
      {[46,66,86,106,126,146].map((x,i)=><rect key={i} x={x} y={112} width="12" height="12" fill="#2a2150"/>)}
      {/* towers */}
      {[[40,96],[170,96]].map(([x,y],i)=>(<g key={i}>
        <rect x={x-2} y={y} width="26" height="92" fill="#332866"/>
        <path d={`M${x-8} ${y} L${x+11} ${y-34} L${x+30} ${y}Z`} fill={V}/>
        <path d={`M${x-8} ${y} L${x+11} ${y-34} L${x+11} ${y}Z`} fill="#fff" opacity=".18"/>
        <circle cx={x+11} cy={y-36} r="3" fill={A}/>
      </g>))}
      {/* big central keep */}
      <rect x="86" y="70" width="48" height="116" fill="#3a2f6e"/>
      <path d="M78 70 L110 24 L142 70Z" fill={A}/>
      <path d="M78 70 L110 24 L110 70Z" fill="#fff" opacity=".2"/>
      <path d="M110 18 l16 8 -16 6Z" fill="#ff7ac0"/>
      <circle cx="110" cy="18" r="3.4" fill={A}/>
      {/* windows */}
      <rect x="56" y="120" width="8" height="18" rx="4" fill="#0c1430"/>
      <rect x="156" y="120" width="8" height="18" rx="4" fill="#0c1430"/>
      <path d="M102 150 a8 8 0 0 1 16 0 v34 h-16Z" fill="#0c1430"/>
      <path d="M102 150 a8 8 0 0 1 16 0 v34 h-16Z" fill="none" stroke={A} strokeWidth="1.6" opacity=".7"/>
      <circle cx="110" cy="50" r="6" fill="#fff" opacity=".9"/>
      <circle cx="110" cy="50" r="10" fill="none" stroke={A} strokeWidth="1.5" opacity=".6"/>
    </svg>
  );
}

function LibraryBuilding({size=164}){
  const V='#b49bff', C='#3ee0ff';
  return (
    <svg viewBox="0 0 190 180" width={size} height={size*180/190} style={{overflow:'visible'}}>
      <ellipse cx="95" cy="162" rx="80" ry="16" fill={V} opacity=".16"/>
      <path d="M22 162 L95 178 L168 162 Q95 140 22 162Z" fill="#101a3a"/>
      {/* stepped base */}
      <rect x="34" y="120" width="122" height="34" rx="3" fill="#1a2654"/>
      <rect x="42" y="112" width="106" height="12" fill="#243066"/>
      {/* columns */}
      {[52,72,92,112,132].map((x,i)=>(<g key={i}><rect x={x} y={86} width="11" height="30" fill="#cdd9ff" opacity=".9"/><rect x={x} y={86} width="4" height="30" fill="#fff" opacity=".5"/></g>))}
      {/* architrave */}
      <rect x="42" y="80" width="106" height="9" rx="2" fill="#2f3d80"/>
      {/* rotunda + dome */}
      <rect x="66" y="52" width="58" height="30" fill="#27316a"/>
      <path d="M62 54 a33 22 0 0 1 66 0 Z" fill={V}/>
      <path d="M62 54 a33 22 0 0 1 66 0 Z" fill="#fff" opacity=".16"/>
      <path d="M70 54 a25 16 0 0 1 50 0" fill="none" stroke="#0c1430" strokeWidth="1" opacity=".4"/>
      {/* finial: glowing book */}
      <circle cx="95" cy="30" r="9" fill={C} opacity=".25"/>
      <path d="M88 26 q7 -4 7 1 q0 -5 7 -1 v8 q-7 -4 -7 1 q0 -5 -7 -1 Z" fill="#eaf2ff"/>
      <line x1="95" y1="27" x2="95" y2="35" stroke={V} strokeWidth="1.2"/>
      {/* facade book emblem */}
      <circle cx="95" cy="135" r="11" fill="#0c1430"/>
      <path d="M89 131 q6 -3 6 1 q0 -4 6 -1 v7 q-6 -3 -6 1 q0 -4 -6 -1 Z" fill={C}/>
    </svg>
  );
}

function World({onOpenWeek, onOpenSchool, onOpenCastle, onOpenLibrary, focusWeek}){
  const game = useGame();
  const weeks = window.GAME_DATA.weeks;
  // path through islands -> castle
  const pts = [];
  for(let w=1; w<=11; w++) pts.push(NODE_POS[w]);
  pts.push(CASTLE_POS);
  const pathD = pts.map((p,i)=> (i?'L':'M')+p[0]+' '+p[1]).join(' ');
  const heroPos = focusWeek && NODE_POS[focusWeek] ? NODE_POS[focusWeek] : NODE_POS[1];
  const char = game.getChar() || 'pip';

  return (
    <div className="scene pop" style={{width:WORLD.W, height:WORLD.H}}>
      {/* connection paths */}
      <svg width={WORLD.W} height={WORLD.H} style={{position:'absolute',inset:0,zIndex:1,pointerEvents:'none'}}>
        <path d={pathD} fill="none" stroke="rgba(120,150,255,.28)" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 14"/>
        <path d={pathD} fill="none" stroke="rgba(180,200,255,.5)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 14" style={{animation:'dash 2.4s linear infinite'}}/>
        <path d={`M${NODE_POS[7][0]} ${NODE_POS[7][1]} Q 905 640 ${SCHOOL_POS[0]} ${SCHOOL_POS[1]}`} fill="none" stroke="rgba(84,240,200,.3)" strokeWidth="3" strokeDasharray="2 12"/>
        <path d={`M${NODE_POS[1][0]} ${NODE_POS[1][1]} Q 220 660 ${LIBRARY_POS[0]} ${LIBRARY_POS[1]}`} fill="none" stroke="rgba(180,155,255,.32)" strokeWidth="3" strokeDasharray="2 12"/>
      </svg>

      {/* islands */}
      {weeks.map(wk=>{
        const [x,y] = NODE_POS[wk.week];
        const st = game.weekStats(wk.week);
        const color = TOPIC_COLOR[wk.topic] || '#9fb0e0';
        return (
          <div key={wk.week} className="node" style={{left:x, top:y}} onClick={()=>onOpenWeek(wk.week)}>
            <div className="floaty"><div className="lift" style={{filter:`drop-shadow(0 16px 18px ${color}33)`}}>
              <Island color={color}/>
            </div></div>
            <div className="isle-week" style={{borderColor:color, color:color}}>WEEK {wk.week}</div>
            {st.keyRemain>0 && <div className="badge-float" style={{top:-6,right:18,background:'radial-gradient(circle at 35% 30%,#ffd0db,#ff6b8b)',color:'#5a0c1d'}} title="Key question here">★</div>}
            <div className="isle-label">
              <div className="isle-name">{wk.name}</div>
              <div className="isle-topic">{wk.topic}</div>
            </div>
            <div className="isle-prog">
              <div className="t"><div className="f" style={{width:(st.pct*100)+'%'}}></div></div>
              <div className="n">{st.solved}/{st.total} cleared</div>
            </div>
          </div>
        );
      })}

      {/* school */}
      <div className="node" style={{left:SCHOOL_POS[0], top:SCHOOL_POS[1]}} onClick={onOpenSchool}>
        <div className="floaty"><div className="lift"><SchoolBuilding/></div></div>
        <div className="isle-label"><div className="isle-name" style={{color:'#7afad8'}}>The Academy</div><div className="isle-topic">Learn &amp; revise · no testing</div></div>
      </div>

      {/* castle */}
      <div className="node" style={{left:CASTLE_POS[0], top:CASTLE_POS[1]}} onClick={onOpenCastle}>
        <div className="floaty"><div className="lift"><CastleBuilding/></div></div>
        <div className="isle-week" style={{borderColor:'#ffce4d', color:'#ffce4d', top:-2}}>FINAL</div>
        <div className="isle-label" style={{bottom:-14}}><div className="isle-name" style={{color:'#ffce4d',fontSize:19}}>Examination Castle</div><div className="isle-topic">Mixed mock exam · pick your weeks</div></div>
      </div>

      {/* library */}
      <div className="node" style={{left:LIBRARY_POS[0], top:LIBRARY_POS[1]}} onClick={onOpenLibrary}>
        <div className="floaty"><div className="lift"><LibraryBuilding/></div></div>
        <div className="isle-label" style={{bottom:-10}}><div className="isle-name" style={{color:'#c7b6ff'}}>The Great Library</div><div className="isle-topic">Learn every week's content · interactive</div></div>
      </div>

      {/* hero marker on focus island */}
      <div className="hero-marker" style={{left:heroPos[0]+38, top:heroPos[1]-6}}>
        <Avatar id={char} size={58}/>
      </div>
    </div>
  );
}
window.World = World;
window.TOPIC_COLOR = TOPIC_COLOR;
