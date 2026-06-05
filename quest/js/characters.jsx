/* ============================================================
   CHARACTERS — six original SVG heroes (pickable roster)
   ============================================================ */
const GLOSS = (cx,cy,rx,ry) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" opacity="0.32"/>;
const eye = (cx,cy,r=6,look=0) => (
  <g>
    <ellipse cx={cx} cy={cy} rx={r} ry={r*1.15} fill="#fff"/>
    <circle cx={cx+look} cy={cy+1.5} r={r*0.5} fill="#15203f"/>
    <circle cx={cx+look-1.4} cy={cy-0.6} r={r*0.18} fill="#fff"/>
  </g>
);

// each returns an <svg> sized to `size`
const HEROES = {
  pip: { name:"Pip", title:"The Squish", archetype:"Round blob hero", color:"#ff7ac0",
    draw:(s)=> (
      <svg viewBox="0 0 100 100" width={s} height={s}>
        <ellipse cx="50" cy="92" rx="26" ry="5" fill="#000" opacity="0.25"/>
        <ellipse cx="38" cy="86" rx="9" ry="6" fill="#ff5bb0"/>
        <ellipse cx="62" cy="86" rx="9" ry="6" fill="#ff5bb0"/>
        <path d="M50 22c20 0 30 16 30 36 0 20-14 30-30 30S20 78 20 58 30 22 50 22Z" fill="#ff7ac0"/>
        <path d="M50 22c20 0 30 16 30 36 0 6-1.4 11-4 15-3-26-16-40-38-42 3.6-5.7 7-9 12-9Z" fill="#ffa0d2"/>
        {GLOSS(40,42,12,9)}
        <ellipse cx="33" cy="66" rx="6" ry="4" fill="#ff5bb0" opacity="0.6"/>
        <ellipse cx="67" cy="66" rx="6" ry="4" fill="#ff5bb0" opacity="0.6"/>
        {eye(42,56,6)}{eye(60,56,6)}
        <path d="M45 70q6 7 13 0" stroke="#15203f" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>) },

  volt: { name:"Volt", title:"The Sprinter", archetype:"Plucky speed mascot", color:"#3ee0ff",
    draw:(s)=> (
      <svg viewBox="0 0 100 100" width={s} height={s}>
        <ellipse cx="50" cy="93" rx="24" ry="5" fill="#000" opacity="0.25"/>
        <path d="M50 16 70 30 78 24 74 40 86 46 72 52c4 18-8 34-22 34S24 70 28 52L14 46 26 40 22 24 30 30Z" fill="#3ee0ff"/>
        <path d="M50 16 70 30 78 24 74 40 86 46 72 52c1 4 1 8 0 12-6-26-22-40-46-40l-2-2L30 30Z" fill="#8af2ff"/>
        {GLOSS(40,40,11,8)}
        {eye(43,52,7,1)}{eye(60,52,7,1)}
        <path d="M44 67q7 6 14 0" stroke="#0a2c3a" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <ellipse cx="40" cy="90" rx="11" ry="6" fill="#ff5d5d"/>
        <ellipse cx="62" cy="90" rx="11" ry="6" fill="#ff5d5d"/>
        <ellipse cx="40" cy="88" rx="11" ry="3" fill="#fff"/>
        <ellipse cx="62" cy="88" rx="11" ry="3" fill="#fff"/>
      </svg>) },

  cubi: { name:"Cubi", title:"The Builder", archetype:"Blocky voxel explorer", color:"#54f0c8",
    draw:(s)=> (
      <svg viewBox="0 0 100 100" width={s} height={s}>
        <ellipse cx="50" cy="93" rx="24" ry="5" fill="#000" opacity="0.25"/>
        <rect x="46" y="14" width="4" height="12" fill="#9aa6c8"/>
        <circle cx="48" cy="12" r="4" fill="#ff7ac0"/>
        <path d="M28 30 50 22 72 30 50 38Z" fill="#7afad8"/>
        <path d="M28 30 50 38 50 70 28 62Z" fill="#3ad6ad"/>
        <path d="M72 30 50 38 50 70 72 62Z" fill="#54f0c8"/>
        <rect x="33" y="42" width="9" height="9" rx="1.5" fill="#0a2c24"/>
        <rect x="34.5" y="43.5" width="3" height="3" fill="#aef9e6"/>
        <rect x="50.5" y="44" width="9" height="9" rx="1.5" fill="#0a2c24"/>
        <rect x="52" y="45.5" width="3" height="3" fill="#aef9e6"/>
        <rect x="40" y="74" width="9" height="12" fill="#2bbf99"/>
        <rect x="51" y="74" width="9" height="12" fill="#2bbf99"/>
      </svg>) },

  byte: { name:"Sir Byte", title:"The Valiant", archetype:"Pixel-RPG knight", color:"#b49bff",
    draw:(s)=> (
      <svg viewBox="0 0 100 100" width={s} height={s}>
        <ellipse cx="50" cy="93" rx="24" ry="5" fill="#000" opacity="0.25"/>
        <path d="M50 8c-6 0-9 5-9 10 4-3 14-3 18 0 0-5-3-10-9-10Z" fill="#ff7ac0"/>
        <path d="M30 78c0-10 0-22 6-34l28 0c6 12 6 24 6 34Z" fill="#9f86f0"/>
        <path d="M32 40c2-14 12-22 18-22s16 8 18 22c-4 6-11 9-18 9s-14-3-18-9Z" fill="#b49bff"/>
        <path d="M32 40c2-14 12-22 18-22 3 0 6 2 9 5-16 1-25 9-27 21Z" fill="#cebcff" opacity="0.9"/>
        {GLOSS(42,30,9,6)}
        <rect x="40" y="34" width="20" height="7" rx="3.5" fill="#1a1140"/>
        <circle cx="45" cy="37.5" r="2.4" fill="#3ee0ff"/>
        <circle cx="55" cy="37.5" r="2.4" fill="#3ee0ff"/>
        <rect x="46" y="44" width="8" height="9" rx="2" fill="#1a1140"/>
        <rect x="40" y="60" width="20" height="4" rx="2" fill="#7a5fe0"/>
      </svg>) },

  nova: { name:"Nova", title:"The Voyager", archetype:"Astro explorer", color:"#ffce4d",
    draw:(s)=> (
      <svg viewBox="0 0 100 100" width={s} height={s}>
        <ellipse cx="50" cy="93" rx="24" ry="5" fill="#000" opacity="0.25"/>
        <rect x="30" y="60" width="40" height="28" rx="12" fill="#eef3ff"/>
        <rect x="44" y="64" width="12" height="10" rx="3" fill="#ffce4d"/>
        <circle cx="50" cy="40" r="26" fill="#dde6f7"/>
        <circle cx="50" cy="40" r="26" fill="none" stroke="#b9c6e2" strokeWidth="2"/>
        <path d="M30 40a20 20 0 0 1 40 0 20 20 0 0 1-40 0Z" fill="#12305c"/>
        <path d="M30 40a20 20 0 0 1 20-20c-10 4-17 12-18 24Z" fill="#2f6bc0" opacity="0.8"/>
        <circle cx="60" cy="33" r="2.4" fill="#fff"/><circle cx="42" cy="48" r="1.6" fill="#fff"/>
        <path d="M52 30l1.4 3 3.2.3-2.4 2.1.8 3.1-2.9-1.7-2.9 1.7.8-3.1-2.4-2.1 3.2-.3Z" fill="#ffce4d"/>
        {GLOSS(40,30,8,5)}
      </svg>) },

  glix: { name:"Glix", title:"The Phantom", archetype:"Neon AI sprite", color:"#a6ff5c",
    draw:(s)=> (
      <svg viewBox="0 0 100 100" width={s} height={s}>
        <ellipse cx="50" cy="93" rx="22" ry="4" fill="#000" opacity="0.2"/>
        <path d="M26 50c0-15 11-26 24-26s24 11 24 26v30l-8-7-8 7-8-7-8 7-8-7-8 7Z" fill="#9bf24e"/>
        <path d="M26 50c0-15 11-26 24-26 6 0 11 2 15 6-20 1-33 12-35 30l-4 4Z" fill="#c2ff86"/>
        {GLOSS(40,40,11,8)}
        <ellipse cx="42" cy="48" rx="6" ry="7.5" fill="#10220a"/>
        <ellipse cx="60" cy="48" rx="6" ry="7.5" fill="#10220a"/>
        <circle cx="43.5" cy="46" r="1.8" fill="#d6ffae"/>
        <circle cx="61.5" cy="46" r="1.8" fill="#d6ffae"/>
        <path d="M45 62q5 4 10 0" stroke="#10220a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>) },
};
const HERO_LIST = ['pip','volt','cubi','byte','nova','glix'];

function Avatar({id, size=64}){
  const h = HEROES[id] || HEROES.pip;
  return <span className="avatar-svg" style={{display:'grid',placeItems:'center',filter:`drop-shadow(0 4px 10px ${h.color}66)`}}>{h.draw(size)}</span>;
}
window.HEROES = HEROES; window.HERO_LIST = HERO_LIST; window.Avatar = Avatar;
