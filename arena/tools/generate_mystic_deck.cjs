// Mystic Royale V4: visual hierarchy, art framing, and card legibility of all 52 playing cards and dealer back.
// Regenerate: node arena/tools/generate_mystic_deck.cjs
// Source portrait art: arena/art-premium/*.webp. Art is embedded in court card SVGs for reliable browser/offline rendering.
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const characters=["precision","reckoning","survey","secondwind","heartward","steady","exchange","investment","reserve","irongrip","crosswind","rooted"];
const portraits={};for(const id of characters)portraits[id]=fs.readFileSync(path.join(root,'arena','art-premium',id+'.webp')).toString('base64');
const files=(function buildCinematicDeck(portraits){
 const suits={
 S:{name:"Spades",base:"#0b1d59",mid:"#1d3785",deep:"#070e35",glow:"#30a7fb",bright:"#e9f5ff",gem:"#77d6ff",outline:"#7cc6fd",subtitle:"THE ASTRAL COURT"},
 H:{name:"Hearts",base:"#381050",mid:"#64134e",deep:"#170827",glow:"#f52375",bright:"#fff1fb",gem:"#ff476e",outline:"#ff98d1",subtitle:"THE CRIMSON COURT"},
 D:{name:"Diamonds",base:"#30134f",mid:"#491a63",deep:"#130c31",glow:"#f34b47",bright:"#fff3e7",gem:"#ff6c3a",outline:"#ffbf7d",subtitle:"THE GILDED COURT"},
 C:{name:"Clubs",base:"#171453",mid:"#39206c",deep:"#09092d",glow:"#7647e9",bright:"#ded0ff",gem:"#9870f4",outline:"#cdaeff",subtitle:"THE VEILED COURT"}
 };
 const suitPath={
 S:"M0 -42 C-14 -21 -39 -8 -39 14 C-39 36 -17 38 -8 24 L-15 43 H15 L8 24 C17 38 39 36 39 14 C39 -8 14 -21 0 -42Z",
 H:"M0 41 C-19 24 -42 5 -42 -16 C-42 -38 -16 -45 0 -23 C16 -45 42 -38 42 -16 C42 5 19 24 0 41Z",
 D:"M0 -43 L36 0 L0 43 L-36 0Z",
 C:"M0 -37 C-10 -46 -27 -40 -31 -27 C-35 -16 -26 -6 -19 -3 C-32 -12 -45 -4 -43 12 C-41 29 -22 34 -8 22 L-15 43 H15 L8 22 C22 34 41 29 43 12 C45 -4 32 -12 19 -3 C26 -6 35 -16 31 -27 C27 -40 10 -46 0 -37 Z"
 };
 const portraitId={
 "S-J":"crosswind","S-Q":"reckoning","S-K":"survey",
 "H-J":"secondwind","H-Q":"heartward","H-K":"steady",
 "D-J":"exchange","D-Q":"investment","D-K":"reserve",
 "C-J":"irongrip","C-Q":"precision","C-K":"rooted"
 };
 const ranks=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
 const locations={
 2:[[120,122],[120,210]],
 3:[[120,100],[120,166],[120,232]],
 4:[[81,120],[159,120],[81,208],[159,208]],
 5:[[81,112],[159,112],[120,166],[81,220],[159,220]],
 6:[[85,104],[155,104],[85,166],[155,166],[85,228],[155,228]],
 7:[[85,102],[155,102],[120,137],[85,167],[155,167],[85,232],[155,232]],
 8:[[83,96],[157,96],[83,141],[157,141],[83,191],[157,191],[83,236],[157,236]],
 9:[[83,96],[157,96],[83,141],[157,141],[120,166],[83,191],[157,191],[83,236],[157,236]],
 10:[[86,92],[154,92],[86,127],[154,127],[86,162],[154,162],[86,197],[154,197],[86,232],[154,232]]
 };
 function defs(c) {
  return `<defs>
<linearGradient id="velvet" x1="0%" y1="0%" x2="96%" y2="100%">
 <stop offset="0%" stop-color="${c.deep}"/><stop offset="28%" stop-color="${c.base}"/><stop offset="56%" stop-color="${c.mid}"/><stop offset="100%" stop-color="${c.deep}"/>
</linearGradient>
<radialGradient id="aura" cx="51%" cy="48%" r="59%">
 <stop offset="0%" stop-color="${c.glow}" stop-opacity=".27"/>
 <stop offset="60%" stop-color="${c.glow}" stop-opacity=".08"/>
 <stop offset="100%" stop-color="${c.glow}" stop-opacity="0"/>
</radialGradient>
<linearGradient id="gold" x1="0%" y1="0%" x2="84%" y2="100%">
 <stop offset="0%" stop-color="#fff8cb"/><stop offset="18%" stop-color="#d9a75a"/>
 <stop offset="35%" stop-color="#85532c"/><stop offset="53%" stop-color="#ffdc8c"/>
 <stop offset="77%" stop-color="#b47b41"/><stop offset="94%" stop-color="#fff0b8"/>
</linearGradient>
<linearGradient id="gem" x1="17%" y1="3%" x2="91%" y2="100%">
 <stop offset="0%" stop-color="#fffdf8"/><stop offset="15%" stop-color="${c.bright}"/>
 <stop offset="40%" stop-color="${c.gem}"/><stop offset="78%" stop-color="${c.glow}"/>
 <stop offset="100%" stop-color="${c.base}"/>
</linearGradient>
<linearGradient id="gemshine" x1="20%" y1="3%" x2="91%" y2="92%">
 <stop offset="0%" stop-color="#ffffff" stop-opacity=".91"/>
 <stop offset="43%" stop-color="#ffffff" stop-opacity=".16"/>
 <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
</linearGradient>
<radialGradient id="halo">
 <stop offset="0%" stop-color="${c.glow}" stop-opacity=".64"/>
 <stop offset="54%" stop-color="${c.glow}" stop-opacity=".14"/>
 <stop offset="100%" stop-color="${c.glow}" stop-opacity="0"/>
</radialGradient>
<linearGradient id="portraitFade" x1="0%" y1="0%" x2="0%" y2="100%">
 <stop offset="0%" stop-color="${c.deep}" stop-opacity=".03"/>
 <stop offset="69%" stop-color="${c.deep}" stop-opacity=".05"/>
 <stop offset="100%" stop-color="${c.deep}" stop-opacity=".89"/>
</linearGradient>
<linearGradient id="indexBg" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stop-color="#10133b" stop-opacity=".98"/>
 <stop offset="100%" stop-color="${c.deep}" stop-opacity=".98"/>
</linearGradient>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
 <feGaussianBlur stdDeviation="2.6"/>
</filter>
<pattern id="stars" width="52" height="57" patternUnits="userSpaceOnUse">
 <circle cx="11" cy="14" r=".62" fill="#fff9ff" opacity=".39"/>
 <circle cx="43" cy="46" r=".86" fill="${c.outline}" opacity=".3"/>
 <path d="M35 8v5m-2.5-2.5h5" stroke="#fff2d7" stroke-width=".7" opacity=".26"/>
</pattern>
<path id="suit" d="${suitPath[c.key]}"/>
<clipPath id="portraitClip">
 <rect x="41" y="76" width="158" height="190" rx="10"/>
</clipPath>
</defs>`;
}
 function cornerFiligree(){
  return `<g stroke="url(#gold)" stroke-width="1.7" fill="none" opacity=".9">
  <path d="M15 67Q15 25 50 17Q28 29 29 46Q41 29 51 31Q36 44 36 68"/>
  <path d="M225 67Q225 25 190 17Q212 29 211 46Q199 29 189 31Q204 44 204 68"/>
  <path d="M15 269Q15 311 50 319Q28 307 29 290Q41 307 51 305Q36 292 36 268"/>
  <path d="M225 269Q225 311 190 319Q212 307 211 290Q199 307 189 305Q204 292 204 268"/>
  </g>
  <g fill="#fff4c7" opacity=".83"><path d="M22 22l4 7-4 7-4-7Z M218 22l4 7-4 7-4-7Z M22 314l4-7-4-7-4 7Z M218 314l4-7-4-7-4 7Z"/></g>`;
 }
 function frame(c) {
return `<rect width="240" height="336" rx="12" fill="#05091a"/>
<rect x="2" y="2" width="236" height="332" rx="11" fill="url(#gold)" stroke="#fff1be" stroke-width="1.3"/>
<rect x="7" y="7" width="226" height="322" rx="9" fill="url(#velvet)"/>
<rect x="8" y="8" width="224" height="320" rx="8" fill="url(#aura)"/>
<rect x="9" y="9" width="222" height="318" rx="8" fill="url(#stars)"/>
<rect x="11" y="11" width="218" height="314" rx="7" fill="none" stroke="#e9c588" stroke-width="1.6"/>
<rect x="16" y="16" width="208" height="304" rx="5" fill="none" stroke="${c.outline}" stroke-opacity=".46" stroke-width=".65"/>
<path d="M29 105L29 230M211 105L211 230" stroke="url(#gold)" stroke-width=".7" opacity=".46"/>
${cornerFiligree()}
<g fill="url(#gold)">
  <path d="M120 17l5 8-5 8-5-8Z M120 319l5-8-5-8-5 8Z"/>
  <circle cx="120" cy="25" r="2.2"/><circle cx="120" cy="311" r="2.2"/>
</g>
<path d="M64 21h112M64 315h112" stroke="#dfb97e" stroke-width=".8" opacity=".35"/>`;
}
 function suitShape(c,x,y,scale,rot=0){
 return `<g class="royal-pip" transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">
 <circle r="42" fill="url(#halo)" opacity=".22"/>
 <use href="#suit" fill="${c.glow}" stroke="${c.glow}" stroke-width="3.1" filter="url(#soft)" opacity=".18"/>
 <use href="#suit" fill="url(#gem)" stroke="${c.bright}" stroke-width="2.6" stroke-linejoin="round"/>
 <use href="#suit" fill="url(#gemshine)" opacity=".30"/>
 <path d="M-11 -10L-5 -20L0 -15" fill="none" stroke="#ffffff" stroke-width="2.4" opacity=".64" stroke-linecap="round"/>
 </g>`;
}
 function indexes(c,rank){
 const size=rank==="10"?43:54;
 const x=rank==="10"?39:36;
 const index=`<rect x="12" y="12" width="50" height="82" rx="9" fill="url(#indexBg)" stroke="url(#gold)" stroke-width="1.8"/>
 <path d="M16 16h42M16 89h42" stroke="#fff2bd" stroke-width=".75" opacity=".65"/>
 <text x="${x}" y="61" text-anchor="middle" font-family="Georgia,Times New Roman,serif" font-weight="bold" font-size="${size}" fill="#fff9e7" stroke="#081329" stroke-width="2" paint-order="stroke">${rank}</text>
 ${suitShape(c,37,77,.215)}`;
 const sigil=`<g class="corner-sigil" transform="translate(211 308)">
 <circle r="13.5" fill="${c.deep}" stroke="url(#gold)" stroke-width="2"/>
 <circle r="10.8" fill="none" stroke="${c.outline}" stroke-width=".8" opacity=".75"/>
 <use href="#suit" fill="${c.gem}" stroke="${c.bright}" stroke-width="2" transform="scale(.20)"/>
 </g>`;
 return `<g class="corner-index">${index}</g>${sigil}`;
}
 function numbered(c,n){
 const layouts={
 2:[[120,111],[120,220]],
 3:[[120,99],[120,166],[120,233]],
 4:[[80,119],[160,119],[80,213],[160,213]],
 5:[[78,111],[162,111],[120,166],[78,221],[162,221]],
 6:[[83,101],[157,101],[83,166],[157,166],[83,231],[157,231]],
 7:[[80,99],[160,99],[120,144],[80,186],[160,186],[80,233],[160,233]],
 8:[[74,105],[120,105],[166,105],[94,164],[146,164],[74,224],[120,224],[166,224]],
 9:[[73,105],[120,105],[167,105],[73,166],[120,166],[167,166],[73,227],[120,227],[167,227]],
 10:[[73,96],[120,96],[167,96],[95,141],[145,141],[95,191],[145,191],[73,237],[120,237],[167,237]]
 };
 const size={2:1.01,3:.80,4:.76,5:.72,6:.62,7:.57,8:.49,9:.49,10:.45}[n];
 const decor=`<ellipse cx="120" cy="167" rx="76" ry="111" fill="${c.deep}" opacity=".27"/>
 <ellipse cx="120" cy="167" rx="76" ry="111" fill="none" stroke="${c.outline}" stroke-width=".85" opacity=".36"/>
 <path d="M120 64l5 7-5 7-5-7ZM120 259l5 7-5 7-5-7Z" fill="url(#gold)" opacity=".76"/>
 <path d="M44 153l6 13-6 13-6-13ZM196 153l6 13-6 13-6-13Z" fill="${c.outline}" opacity=".36"/>`;
 return decor+layouts[n].map(([x,y])=>suitShape(c,x,y,size,y>167?180:0)).join("");
}
 function crown(c,rank){
 if(rank==="J")return `<g><path d="M79 91Q120 75 161 91" fill="none" stroke="url(#gold)" stroke-width="5"/>
 <path d="M83 88l7-10 10 8M157 88l-7-10-10 8" fill="none" stroke="#fff5c9" stroke-width="2.2"/>
 <path d="M120 75l5 9-5 8-5-8Z" fill="${c.gem}" stroke="#fff1bc" stroke-width="1"/></g>`;
 if(rank==="Q")return `<g><path d="M81 92l15-17 11 12 13-25 13 25 11-12 15 17" fill="none" stroke="url(#gold)" stroke-width="5.5" stroke-linejoin="round"/>
 <path d="M120 68l6 9-6 9-6-9Z" fill="${c.gem}" stroke="#fff" stroke-width="1.2"/></g>`;
 return `<g><path d="M74 93L75 70L93 83L120 53L147 83L165 70L166 93L153 99H87Z" fill="url(#gold)" stroke="#fff4cb" stroke-width="1.7"/>
 <path d="M120 62l7 9-7 9-7-9Z" fill="${c.glow}" stroke="#fff6d3" stroke-width="1.4"/>
 <circle cx="95" cy="89" r="3" fill="${c.gem}"/><circle cx="145" cy="89" r="3" fill="${c.gem}"/></g>`;
}
 function court(c,rank,base64){
 if(!base64)throw Error("Missing premium portrait: "+c.key+"-"+rank);
 const title={K:"KING",Q:"QUEEN",J:"JACK"}[rank];
 const subtitle={K:"SOVEREIGN",Q:"ORACLE",J:"CHAMPION"}[rank];
 return `<g>
 <rect x="36" y="70" width="168" height="208" rx="13" fill="url(#gold)" stroke="#fff1c7" stroke-width="1.6"/>
 <rect x="41" y="76" width="158" height="190" rx="10" fill="${c.deep}"/>
 <image x="41" y="76" width="158" height="190" preserveAspectRatio="xMidYMid slice"
 clip-path="url(#portraitClip)" href="data:image/webp;base64,${base64}"/>
 <rect x="41" y="76" width="158" height="190" rx="10" fill="url(#portraitFade)" clip-path="url(#portraitClip)"/>
 <rect x="41" y="76" width="158" height="190" rx="10" fill="none" stroke="${c.outline}" stroke-width="1.1" stroke-opacity=".72"/>
 <path d="M42 102Q120 53 198 102" fill="none" stroke="url(#gold)" stroke-width="3.2"/>
 <path d="M46 106Q120 62 194 106" fill="none" stroke="#fff4bf" stroke-width=".9" opacity=".70"/>
 <g transform="translate(45 -5) scale(.63)">${crown(c,rank)}</g>
 <path d="M45 241Q120 260 195 241V280H45Z" fill="${c.deep}" opacity=".90"/>
 <path d="M49 255H191" stroke="url(#gold)" stroke-width="1.2"/>
 <text x="120" y="286" font-family="Georgia,Times New Roman,serif" font-size="22" font-weight="bold" text-anchor="middle" letter-spacing="2.2" fill="#fff1cf">${title}</text>
 <text x="120" y="300" font-family="Georgia,serif" font-size="7.8" text-anchor="middle" letter-spacing="1.6" fill="${c.outline}">${subtitle}</text>
 ${suitShape(c,47,288,.18)}${suitShape(c,193,288,.18)}
 </g>`;
}
 function ace(c){
 return `<g>
 <circle cx="120" cy="165" r="96" fill="url(#halo)" opacity=".63"/>
 <circle cx="120" cy="165" r="82" fill="none" stroke="url(#gold)" stroke-width="2.8"/>
 <circle cx="120" cy="165" r="72" fill="none" stroke="${c.outline}" stroke-opacity=".76" stroke-width="1.8" stroke-dasharray="3 5"/>
 <path d="M120 65l11 21-11-9-11 9Z M120 265l11-21-11 9-11-9Z M24 165l22-11-9 11 9 11Z M216 165l-22-11 9 11-9 11Z" fill="url(#gold)" stroke="#fff2bd" stroke-width=".7"/>
 ${suitShape(c,120,166,1.45)}
 <g transform="translate(45 -5) scale(.63)">${crown(c,"K")}</g>
 <path d="M70 267H170" stroke="url(#gold)" stroke-width="1.2"/>
 <text x="120" y="285" text-anchor="middle" font-family="Georgia,serif" font-size="9" letter-spacing="1.2" font-weight="bold" fill="#fff0be">${c.subtitle}</text>
 </g>`;
}
 function face(suit,rank){
  const c={...suits[suit],key:suit};
  let art;
  if(rank==="A")art=ace(c);
  else if(["K","Q","J"].includes(rank))art=court(c,rank,portraits[portraitId[suit+"-"+rank]]);
  else art=numbered(c,Number(rank));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 336" width="240" height="336" role="img" aria-label="${rank==="A"?"ACE":rank==="K"?"KING":rank==="Q"?"QUEEN":rank==="J"?"JACK":rank} of ${c.name} — Mystic Royale V4" data-theme="mystic-royale-v4" data-rank="${rank}" data-suit="${suit}" data-card="${suit}-${rank}">
  ${defs(c)}
  ${frame(c)}
  ${art}
  ${indexes(c,rank)}
  </svg>`;
 }
 function back(){
  const c={...suits.S,key:"S"};
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 336" width="240" height="336" role="img" aria-label="Mystic Royale V3 dealer card back" data-theme="mystic-royale-v3">
 ${defs(c)}
 ${frame(c)}
 <circle cx="120" cy="166" r="99" fill="url(#halo)" opacity=".38"/>
 <path d="M120 37l98 129-98 132-98-132Z" fill="none" stroke="url(#gold)" stroke-width="2.6"/>
 <circle cx="120" cy="166" r="89" fill="none" stroke="${c.outline}" stroke-width=".9" stroke-dasharray="2 5"/>
 <circle cx="120" cy="166" r="75" fill="none" stroke="url(#gold)" stroke-width="2"/>
 <path d="M120 73L132 145L205 166L132 187L120 259L108 187L35 166L108 145Z" fill="#43237e" stroke="url(#gold)" stroke-width="3"/>
 <path d="M120 93L139 166L120 239L101 166Z" fill="url(#gem)" stroke="#fff1cc" stroke-width="1.8"/>
 <circle cx="120" cy="166" r="29" fill="${c.deep}" stroke="url(#gold)" stroke-width="2.5"/>
 <path d="M120 137l13 28-13 31-13-31Z" fill="url(#gem)" stroke="#fff" stroke-width="1.7"/>
 ${crown(c,"K")}
 <g fill="${c.gem}" stroke="#fff4d3" stroke-width=".8"><path d="M120 59l7 12-7 12-7-12Z M120 249l7 12-7 12-7-12Z M32 166l10-7 10 7-10 7Z M188 166l10-7 10 7-10 7Z"/></g>
 <text x="120" y="285" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="bold" fill="#fff1c3" letter-spacing="2.1">MYSTIC ROYALE</text>
 </svg>`;
 }
 const files=[];
 for(const suit of ["S","H","D","C"])for(const rank of ranks)files.push({path:`arena/cards-mystic/${suit}-${rank}.svg`,content:face(suit,rank)});
 files.push({path:"arena/cards-mystic/back.svg",content:back()});
 return files;
})(portraits);
for(const file of files){const target=path.join(root,file.path);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,file.content,'utf8');}
console.log('Regenerated '+files.length+' cinematic Mystic Royale SVG assets');
