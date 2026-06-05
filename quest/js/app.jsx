/* ============================================================
   APP — HUD + screen router
   ============================================================ */
function HUD({screen, go, onSwapChar}){
  const game = useGame();
  const li = game.levelInfo();
  const char = game.getChar()||'pip';
  const navItem = (name,label,icon)=> (
    <button className={"hud-btn"+(screen.name===name?' active':'')} onClick={()=>go(name)}>{icon} {label}</button>
  );
  return (
    <div className="hud">
      <div className="brand" onClick={()=>go('world')} style={{cursor:'pointer'}}>
        <span style={{fontSize:20}}>🧭</span> FIT2004 <b>QUEST</b>
      </div>
      <div className="spacer"></div>
      {navItem('world','Map','🗺️')}
      {navItem('library','Library','📚')}
      {navItem('school','Academy','📖')}
      {navItem('castle','Castle','🏰')}
      <div className="xp-chip" title={`${li.xp} XP · Level ${li.level}`}>
        <div className="lvl-badge">{li.level}</div>
        <div className="xp-bar">
          <div className="lab"><span>LV {li.level}</span><span>{li.into}/{li.per}</span></div>
          <div className="xp-track"><div className="xp-fill" style={{width:(li.pct*100)+'%'}}></div></div>
        </div>
      </div>
      <button className="hud-avatar" title="Swap hero" onClick={onSwapChar} style={{cursor:'pointer'}}><Avatar id={char} size={34}/></button>
    </div>
  );
}

function WorldStage(props){
  const scale = useFitScale(WORLD.W, WORLD.H, 40, 96);
  return (
    <div className="stage" style={{top:62}}>
      <div style={{width:WORLD.W*scale, height:WORLD.H*scale, position:'relative'}}>
        <div style={{transform:`scale(${scale})`, transformOrigin:'top left', position:'absolute', top:0, left:0}}>
          <World {...props}/>
        </div>
      </div>
    </div>
  );
}

function App(){
  const game = useGame();
  const [screen, setScreen] = React.useState(()=> game.getChar()? {name:'world'} : {name:'select'});
  const [focusWeek, setFocusWeek] = React.useState(1);
  const [swapping, setSwapping] = React.useState(false);

  const go = (name)=> setScreen({name});
  const openWeek = (w)=>{ setFocusWeek(w); setScreen({name:'mountain', week:w}); };
  const openQuestion = (qid, queue)=> setScreen(s=>({name:'card', qid, queue, week:s.week}));

  const showHud = screen.name!=='select' && !swapping;

  return (
    <React.Fragment>
      <div className="sky"><div className="aurora"></div></div>
      {showHud && <HUD screen={screen} go={go} onSwapChar={()=>setSwapping(true)}/>}

      {swapping && <CharacterSelect initial={game.getChar()} onConfirm={()=>setSwapping(false)}/>}

      {!swapping && screen.name==='select' && <CharacterSelect onConfirm={()=>setScreen({name:'world'})}/>}
      {!swapping && screen.name==='world' && <WorldStage onOpenWeek={openWeek} onOpenSchool={()=>go('school')} onOpenCastle={()=>go('castle')} onOpenLibrary={()=>go('library')} focusWeek={focusWeek}/>}
      {!swapping && screen.name==='library' && <Library onBack={()=>go('world')}/>}
      {!swapping && screen.name==='mountain' && <Mountain week={screen.week} onBack={()=>go('world')} onOpenQuestion={openQuestion}/>}
      {!swapping && screen.name==='card' && <Flashcard qid={screen.qid} queue={screen.queue} onClose={()=>openWeek(screen.week)}/>}
      {!swapping && screen.name==='school' && <School onBack={()=>go('world')}/>}
      {!swapping && screen.name==='castle' && <Castle onBack={()=>go('world')}/>}

      {showHud && screen.name==='world' && <div className="world-hint">Tap an island to practise · the Library to learn · the Academy to revise · the Castle for a mock exam — nothing's ever locked</div>}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
