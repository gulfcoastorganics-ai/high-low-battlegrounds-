// Regenerate the 52 original Mystic Royale card-face SVGs and the dealer back.
// Run from repository root: node arena/tools/generate_mystic_deck.cjs
const fs=require('node:fs');
const path=require('node:path');
const files=(function buildMysticDeck(){
 const suits={
  S:{name:"Spades",tone:"#79cfff",tone2:"#b0e9ff",base:"#101f69",shadow:"#06133c",glow:"#387cf8",title:"THE STARWARD",accent:"#b7efff"},
  H:{name:"Hearts",tone:"#ff82d1",tone2:"#ffbfeb",base:"#3a125e",shadow:"#190b3e",glow:"#c44fff",title:"THE HEARTBOUND",accent:"#ffb2e4"},
  D:{name:"Diamonds",tone:"#ffc878",tone2:"#fff1be",base:"#222169",shadow:"#0a1640",glow:"#ac7cfc",title:"THE GILDED",accent:"#ffe2a3"},
  C:{name:"Clubs",tone:"#b5acff",tone2:"#e3daff",base:"#231269",shadow:"#101047",glow:"#8667ff",title:"THE VEILKEEPER",accent:"#d9c8ff"}
 };
 const pip={
  S:"M0 -45 C-11 -26 -40 -7 -40 15 C-40 35 -23 42 -8 29 L-16 45 H16 L8 29 C23 42 40 35 40 15 C40 -7 11 -26 0 -45Z",
  H:"M0 42 C-13 32 -42 8 -42 -15 C-42 -35 -19 -47 0 -25 C19 -47 42 -35 42 -15 C42 8 13 32 0 42Z",
  D:"M0 -46 L39 0 L0 46 L-39 0Z",
  C:"M0 -43 C-14 -43 -22 -33 -22 -23 C-22 -17 -19 -11 -15 -8 C-36 -21 -45 -7 -40 10 C-36 26 -16 31 -7 19 L-16 44 H16 L7 19 C16 31 36 26 40 10 C45 -7 36 -21 15 -8 C19 -11 22 -17 22 -23 C22 -33 14 -43 0 -43Z"
 };
 const names={A:"ACE",J:"JACK",Q:"QUEEN",K:"KING"};
 const ranks=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
 const escapes=s=>s.replace(/&/g,"&amp;").replace(/"/g,"&quot;");
 function defs(c){
 return `<defs>
  <linearGradient id="paper" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#151046"/><stop offset=".30" stop-color="${c.base}"/><stop offset=".63" stop-color="#26125a"/><stop offset="1" stop-color="${c.shadow}"/></linearGradient>
  <radialGradient id="nebula" cx=".53" cy=".38" r=".8"><stop stop-color="${c.glow}" stop-opacity=".48"/><stop offset=".5" stop-color="${c.glow}" stop-opacity=".07"/><stop offset="1" stop-color="${c.glow}" stop-opacity="0"/></radialGradient>
  <linearGradient id="gilt" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff3bb"/><stop offset=".22" stop-color="#ba7a3a"/><stop offset=".42" stop-color="#ffdc84"/><stop offset=".69" stop-color="#8b4d2b"/><stop offset=".85" stop-color="#f5d185"/><stop offset="1" stop-color="#fff0bc"/></linearGradient>
  <linearGradient id="pipFill" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#fef8ff"/><stop offset=".19" stop-color="${c.tone2}"/><stop offset=".58" stop-color="${c.tone}"/><stop offset="1" stop-color="${c.glow}"/></linearGradient>
  <radialGradient id="orb"><stop stop-color="#f9ebff" stop-opacity=".7"/><stop offset=".33" stop-color="${c.glow}" stop-opacity=".33"/><stop offset="1" stop-color="${c.glow}" stop-opacity="0"/></radialGradient>
  <linearGradient id="silk" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.tone2}"/><stop offset=".25" stop-color="${c.base}"/><stop offset=".6" stop-color="${c.shadow}"/><stop offset="1" stop-color="${c.glow}"/></linearGradient>
  <linearGradient id="face" x1=".27" y1="0" x2=".8" y2="1"><stop stop-color="#ffe8bf"/><stop offset=".37" stop-color="#d49c87"/><stop offset="1" stop-color="#795069"/></linearGradient>
  <filter id="halo" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.6"/></filter>
  <pattern id="stars" width="51" height="59" patternUnits="userSpaceOnUse">
    <circle cx="10" cy="17" r=".85" fill="#f9edff" opacity=".5"/>
    <circle cx="42" cy="43" r="1.1" fill="${c.tone2}" opacity=".45"/>
    <path d="M29 5v6m-3-3h6" stroke="#ddd6ff" stroke-width=".7" opacity=".45"/>
  </pattern>
  <path id="glyph" d="${pip[c.key]}"/>
 </defs>`;
 }
 function framework(c,code){
 return `<rect x="1" y="1" width="238" height="334" rx="15" fill="#06091d" stroke="#29134d" stroke-width="2"/>
 <rect x="5" y="5" width="230" height="326" rx="13" fill="url(#paper)"/>
 <rect x="8" y="8" width="224" height="320" rx="11" fill="url(#nebula)"/>
 <rect x="8" y="8" width="224" height="320" rx="11" fill="url(#stars)"/>
 <path d="M26 67Q68 49 120 64Q173 49 214 67V269Q171 286 120 272Q67 286 26 269Z" fill="none" stroke="${c.tone}" stroke-width=".6" opacity=".27"/>
 <circle cx="120" cy="166" r="96" fill="none" stroke="${c.tone2}" stroke-width=".9" opacity=".16"/>
 <circle cx="120" cy="166" r="82" fill="none" stroke="url(#gilt)" stroke-width=".85" opacity=".39" stroke-dasharray="2 5"/>
 <path d="M120 64v16m0 172v16m-95-102h16m158 0h16M55 95l13 13m104 116 13 13M185 95l-13 13M68 224l-13 13" stroke="${c.tone2}" opacity=".28" stroke-width="1"/>
 <rect x="8" y="8" width="224" height="320" rx="11" fill="none" stroke="url(#gilt)" stroke-width="3"/>
 <rect x="12" y="12" width="216" height="312" rx="9" fill="none" stroke="#e8c882" stroke-opacity=".6" stroke-width=".8"/>
 <path d="M13 56V25Q13 13 25 13H55M185 13h30q13 0 13 13v30M13 280v30q0 13 13 13h30M185 323h30q13 0 13-13v-30" stroke="#f7d596" stroke-width="1.8" fill="none" opacity=".72"/>
 <path d="M21 72l5-9 5 9-5 9Z M214 72l-5-9-5 9 5 9Z M21 264l5-9 5 9-5 9Z M214 264l-5-9-5 9 5 9Z" fill="${c.tone2}" opacity=".6"/>
 <path d="M120 18l6 9-6 9-6-9Z M120 300l6 9-6 9-6-9Z" fill="url(#gilt)" stroke="#fff1bc" stroke-width=".8"/>
 <g opacity=".6"><circle cx="120" cy="27" r="3.5" fill="url(#orb)"/><circle cx="120" cy="309" r="3.5" fill="url(#orb)"/></g>`;
 }
 function badge(r,c){
 const size=r==="10"?29:35;
 const rankY=r==="10"?43:47;
 const side=`<g><text x="18" y="${rankY}" font-family="Georgia,Times New Roman,serif" font-size="${size}" font-weight="700" fill="#fff4d5" stroke="#36205d" stroke-width=".35" paint-order="stroke" letter-spacing="-1.5">${r}</text>
 <use href="#glyph" transform="translate(${r==="10"?32:26} 61) scale(.17)" fill="url(#pipFill)" stroke="${c.tone2}" stroke-width="3"/></g>`;
 return side+`<g transform="translate(240 336) rotate(180)">${side}</g>`;
 }
 function pipAt(x,y,scale,c,rot=0){
 return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">
   <use href="#glyph" fill="${c.tone}" opacity=".42" filter="url(#halo)"/>
   <use href="#glyph" fill="url(#pipFill)" stroke="#fff4da" stroke-width="2.4"/>
   <use href="#glyph" fill="none" stroke="#191149" stroke-width="1.2" transform="scale(.85)"/>
  </g>`;
 }
 function points(n){
  const pt={2:[[120,112],[120,220]],3:[[120,106],[120,166],[120,226]],
    4:[[90,117],[150,117],[90,213],[150,213]],
    5:[[90,114],[150,114],[120,165],[90,216],[150,216]],
    6:[[91,108],[149,108],[91,165],[149,165],[91,222],[149,222]],
    7:[[91,108],[149,108],[120,137],[91,165],[149,165],[91,222],[149,222]],
    8:[[91,102],[149,102],[91,144],[149,144],[91,186],[149,186],[91,228],[149,228]],
    9:[[91,102],[149,102],[91,143],[149,143],[120,165],[91,187],[149,187],[91,228],[149,228]],
    10:[[90,99],[150,99],[90,133],[150,133],[90,167],[150,167],[90,201],[150,201],[90,235],[150,235]]
   };
  return pt[n];
 }
 function pipLayout(n,c){
   const pos=points(n),scale=n>=8?.265:n>=5?.29:.38;
   const ring=`<circle cx="120" cy="166" r="59" fill="url(#orb)" opacity=".38"/>
    <circle cx="120" cy="166" r="62" fill="none" stroke="${c.tone}" stroke-width=".8" opacity=".3"/>
    <path d="M120 89l7 13-7 13-7-13Z M120 218l7 13-7 13-7-13Z" fill="${c.tone2}" opacity=".19"/>`;
   return ring+pos.map(([x,y])=>pipAt(x,y,scale,c,y>170?180:0)).join("");
 }
 function ace(c){
 return `<g>
   <circle cx="120" cy="165" r="67" fill="url(#orb)" opacity=".86"/>
   <circle cx="120" cy="165" r="69" fill="none" stroke="url(#gilt)" stroke-width="1.7"/>
   <circle cx="120" cy="165" r="60" fill="none" stroke="${c.tone2}" stroke-width=".8" stroke-dasharray="2 4"/>
   <path d="M120 77l12 37-12-10-12 10Z M120 253l12-37-12 10-12-10Z M34 166l37-12-10 12 10 12Z M206 166l-37-12 10 12-10 12Z" fill="${c.tone2}" opacity=".55"/>
   ${pipAt(120,166,1.19,c)}
   <path d="M82 93L88 79L102 91L120 72L138 91L151 79L158 93Z" fill="url(#gilt)" stroke="#fff0ba" stroke-width="1.2"/>
   <circle cx="120" cy="86" r="4.2" fill="${c.tone}" stroke="#fff5e9" stroke-width=".7"/>
   <text x="120" y="273" text-anchor="middle" fill="#f8dfad" font-size="7.6" font-family="Georgia,serif" letter-spacing="1.8">${c.title}</text>
   </g>`;
 }
 function court(r,c){
  const king=r==="K",queen=r==="Q",jack=r==="J";
  const head=king?`<path d="M78 125L82 100L101 113L119 89L138 113L158 100L162 125Z" fill="url(#gilt)" stroke="#fff1bf" stroke-width="1.8"/>
  <path d="M84 125h74v10H84z" fill="url(#gilt)" stroke="#fff1bf" stroke-width="1"/><path d="M117 103l7 8-7 8-7-8Z" fill="${c.glow}" stroke="#fff1d3" stroke-width="1.4"/>`:
  queen?`<path d="M89 130Q99 100 119 97Q139 100 150 130" fill="none" stroke="url(#gilt)" stroke-width="8"/>
  <path d="M91 112L103 121L120 91L136 121L147 112" fill="none" stroke="#ffe6ac" stroke-width="5"/><path d="M119 103l7 9-7 8-7-8Z" fill="${c.tone}" stroke="#fff6e8" stroke-width="2"/>`:
  `<path d="M76 137Q75 104 120 101Q156 102 163 137L154 143Q120 123 83 144Z" fill="url(#silk)" stroke="url(#gilt)" stroke-width="2"/>
   <path d="M126 110Q137 77 149 70Q149 105 136 130" fill="${c.tone}" stroke="#ffdda6" stroke-width="1.4"/>`;
  const hair=queen?`<path d="M90 143Q89 98 121 102Q155 99 154 144L170 213L144 222L136 154Q125 135 109 151L103 214L80 219Z" fill="${c.shadow}" stroke="${c.tone2}" stroke-width="2"/>`:
   `<path d="M90 146Q82 105 119 108Q155 103 155 147L143 157Q121 126 96 155Z" fill="${c.shadow}" stroke="url(#gilt)" stroke-width="2"/>`;
  const beard=king?`<path d="M104 177Q120 195 135 177L133 200Q120 218 107 200Z" fill="${c.shadow}" stroke="#deb77b" stroke-width="2"/>
  <path d="M111 186l7 6 8-6" fill="none" stroke="#cba47f" stroke-width="1.5"/>`:"";
  const armor=`<path d="M62 230Q64 194 98 196L119 218L142 196Q177 195 181 230L177 241Q120 265 63 241Z" fill="url(#silk)" stroke="url(#gilt)" stroke-width="3"/>
  <path d="M99 200L120 225L141 200" fill="none" stroke="#fff2c7" stroke-width="2.5"/>
  <path d="M68 220Q85 212 96 231M172 220Q155 211 143 231" fill="none" stroke="${c.tone2}" stroke-width="2"/>`;
  return `<g>
    <circle cx="120" cy="167" r="75" fill="url(#orb)" opacity=".71"/>
    <path d="M120 77L171 99L189 166L164 233L120 259L76 233L51 166L69 99Z" fill="${c.shadow}" stroke="url(#gilt)" stroke-width="2.8"/>
    <circle cx="120" cy="166" r="65" fill="url(#paper)" stroke="${c.tone2}" stroke-width="1" opacity=".85"/>
    <path d="M120 83l11 13-11 13-11-13Z M120 239l11 13-11 13-11-13Z" fill="${c.tone2}" opacity=".46"/>
    ${hair}
    ${armor}
    <path d="M101 135Q118 118 138 135L144 175Q136 195 121 197Q102 192 97 172Z" fill="url(#face)" stroke="#f3c99a" stroke-width="1"/>
    ${head}
    <path d="M102 154Q111 148 117 153M125 153Q132 149 139 154" stroke="#412c45" stroke-width="2.8" fill="none"/>
    <path d="M106 158l9 0m12 0h9" stroke="${c.shadow}" stroke-width="1.4"/>
    <circle cx="112" cy="156" r="2" fill="${c.tone}"/><circle cx="130" cy="156" r="2" fill="${c.tone}"/>
    <path d="M120 160l-3 14 6 2" stroke="#986e65" stroke-width="1.2" fill="none"/>
    <path d="M113 183Q120 186 128 182" stroke="#7e455e" stroke-width="1.3" fill="none"/>
    ${beard}
    <g transform="translate(120 230) scale(.19)"><use href="#glyph" fill="url(#pipFill)" stroke="#fff2c1" stroke-width="4"/></g>
    <path d="M55 166l14-8-8 14M185 166l-14-8 8 14" stroke="url(#gilt)" stroke-width="2" fill="none"/>
    <text x="120" y="279" font-family="Georgia,serif" font-size="10" text-anchor="middle" letter-spacing="2" fill="#ffecc3">${names[r]}</text>
   </g>`;
 }
 function createCard(suit,rank){
  const c={...suits[suit],key:suit};
  const label=(names[rank]||rank)+" of "+c.name+" — Mystic Royale";
  const numeric=Number(rank);
  const art=rank==="A"?ace(c):["J","Q","K"].includes(rank)?court(rank,c):pipLayout(numeric,c);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 336" width="240" height="336" role="img" aria-label="${escapes(label)}" data-card="${suit}-${rank}" data-rank="${rank}" data-suit="${suit}" data-theme="mystic-royale">
 ${defs(c)}
 ${framework(c,`${suit}-${rank}`)}
 ${art}
 ${badge(rank,c)}
 </svg>`;
 }
 function back(){
 const c={...suits.S,key:"S"};
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 336" width="240" height="336" role="img" aria-label="Mystic Royale dealer card back" data-theme="mystic-royale">
 ${defs(c)}
 <rect x="2" y="2" width="236" height="332" rx="14" fill="#080d2b" stroke="#f1d48b" stroke-width="3"/>
 <rect x="7" y="7" width="226" height="322" rx="11" fill="url(#paper)" stroke="url(#gilt)" stroke-width="3"/>
 <rect x="13" y="13" width="214" height="310" rx="8" fill="url(#stars)" stroke="#deb980" stroke-width="1"/>
 <path d="M120 17L224 166L120 319L16 166Z" fill="none" stroke="${c.tone2}" stroke-width="1.2" opacity=".55"/>
 <path d="M120 36L203 166L120 300L37 166Z" fill="none" stroke="url(#gilt)" stroke-width="3.5"/>
 <circle cx="120" cy="166" r="81" fill="url(#nebula)" stroke="url(#gilt)" stroke-width="2.5"/>
 <circle cx="120" cy="166" r="69" fill="none" stroke="#ba92ff" stroke-width="2" stroke-dasharray="3 4"/>
 <circle cx="120" cy="166" r="60" fill="none" stroke="#eed59f" stroke-width="1.5"/>
 <path d="M120 75L130 146L201 166L130 186L120 257L110 186L39 166L110 146Z" fill="#653bb1" stroke="url(#gilt)" stroke-width="3"/>
 <path d="M120 110L135 166L120 224L105 166Z" fill="url(#pipFill)" stroke="#fff3c2" stroke-width="2"/>
 <path d="M72 125L87 104L101 122L120 96L139 122L153 104L168 125L161 146H79Z" fill="url(#gilt)" stroke="#fff2bc" stroke-width="2"/>
 <circle cx="120" cy="129" r="7" fill="#8b55df" stroke="#fff0c0" stroke-width="2"/>
 <g fill="none" stroke="#f0d39c" stroke-width="1.2">
   <path d="M33 32h41l12 12m121-12h-41l-12 12M33 304h41l12-12m121 12h-41l-12-12"/>
   <path d="M42 85l15-8-7-17m148 25-15-8 7-17M42 251l15 8-7 17m148-25-15 8 7 17"/>
 </g>
 <path d="M119 20l7 8-7 8-7-8ZM120 299l7 8-7 8-7-8Z" fill="${c.tone2}"/>
 <text x="120" y="284" text-anchor="middle" fill="#ffe1a1" font-family="Georgia,serif" font-size="10" font-weight="bold" letter-spacing="2">THE ARCANA</text>
 </svg>`;
 }
 const files=[];
 for(const suit of ["S","H","D","C"])for(const rank of ranks)files.push({path:`arena/cards-mystic/${suit}-${rank}.svg`,content:createCard(suit,rank)});
 files.push({path:"arena/cards-mystic/back.svg",content:back()});
 return files;
})();
for(const entry of files){const target=path.resolve(entry.path);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,entry.content,'utf8');}
console.log('Generated '+files.length+' Mystic Royale card assets');
