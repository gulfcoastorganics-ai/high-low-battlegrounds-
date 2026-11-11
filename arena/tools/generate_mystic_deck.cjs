// Mystic Royale Cinematic: original illustrated 52-card deck plus dealer back.
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
 C:{name:"Clubs",base:"#151752",mid:"#342873",deep:"#0b0b35",glow:"#a78aff",bright:"#f8f6ff",gem:"#c2d3ff",outline:"#e1dbff",subtitle:"THE VEILED COURT"}
 };
 const suitPath={
 S:"M0 -42 C-14 -21 -39 -8 -39 14 C-39 36 -17 38 -8 24 L-15 43 H15 L8 24 C17 38 39 36 39 14 C39 -8 14 -21 0 -42Z",
 H:"M0 41 C-19 24 -42 5 -42 -16 C-42 -38 -16 -45 0 -23 C16 -45 42 -38 42 -16 C42 5 19 24 0 41Z",
 D:"M0 -43 L36 0 L0 43 L-36 0Z",
 C:"M-8 24 C-24 35 -44 25 -43 9 C-43 -8 -25 -18 -13 -7 C-31 -31 -7 -53 0 -37 C7 -53 31 -31 13 -7 C25 -18 43 -8 43 9 C44 25 24 35 8 24 L16 44 H-16Z"
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
 function defs(c){
  return `<defs>
 <linearGradient id="velvet" x1=".1" y1="0" x2=".9" y2="1"><stop stop-color="${c.deep}"/><stop offset=".25" stop-color="${c.base}"/><stop offset=".59" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.deep}"/></linearGradient>
 <radialGradient id="aura" cx=".54" cy=".45" r=".68"><stop stop-color="${c.glow}" stop-opacity=".37"/><stop offset=".33" stop-color="${c.glow}" stop-opacity=".19"/><stop offset=".8" stop-color="${c.deep}" stop-opacity=".06"/><stop offset="1" stop-color="${c.deep}" stop-opacity="0"/></radialGradient>
 <linearGradient id="gold" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="#fff8cb"/><stop offset=".17" stop-color="#d9a75a"/><stop offset=".32" stop-color="#80512b"/><stop offset=".51" stop-color="#ffdb8b"/><stop offset=".71" stop-color="#ad7339"/><stop offset=".89" stop-color="#ffe6ae"/><stop offset="1" stop-color="#85552f"/></linearGradient>
 <linearGradient id="gem" x1=".21" y1="0" x2=".86" y2="1"><stop stop-color="#fff" stop-opacity=".99"/><stop offset=".16" stop-color="${c.bright}"/><stop offset=".44" stop-color="${c.gem}"/><stop offset=".72" stop-color="${c.glow}"/><stop offset="1" stop-color="${c.base}"/></linearGradient>
 <radialGradient id="gemshine" cx=".25" cy=".14" r=".92"><stop stop-color="#ffffff" stop-opacity=".91"/><stop offset=".21" stop-color="${c.bright}" stop-opacity=".46"/><stop offset=".72" stop-color="${c.glow}" stop-opacity=".23"/><stop offset="1" stop-color="${c.glow}" stop-opacity="0"/></radialGradient>
 <radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop stop-color="${c.glow}" stop-opacity=".75"/><stop offset=".65" stop-color="${c.glow}" stop-opacity=".21"/><stop offset="1" stop-color="${c.glow}" stop-opacity="0"/></radialGradient>
 <filter id="blur"><feGaussianBlur stdDeviation="5"/></filter>
 <filter id="soft"><feGaussianBlur stdDeviation="2.2"/></filter>
 <pattern id="stars" width="38" height="49" patternUnits="userSpaceOnUse"><circle cx="9" cy="14" r=".65" fill="#faf8ff" opacity=".52"/><circle cx="29" cy="39" r="1.1" fill="${c.outline}" opacity=".44"/><path d="M24 6v7m-3.5-3.5h7" stroke="#fff7e4" stroke-width=".8" opacity=".35"/></pattern>
 <path id="suit" d="${suitPath[c.key]}"/>
 <clipPath id="portraitClip"><path d="M53 107Q120 60 187 107V226Q120 267 53 226Z"/></clipPath>
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
 function frame(c){
 return `<rect width="240" height="336" rx="13" fill="#04071a"/>
 <rect x="3" y="3" width="234" height="330" rx="12" fill="url(#gold)" stroke="#fff1c4" stroke-width=".6"/>
 <rect x="8" y="8" width="224" height="320" rx="9" fill="url(#velvet)" stroke="#180b36" stroke-width="1"/>
 <rect x="8" y="8" width="224" height="320" rx="9" fill="url(#aura)"/>
 <rect x="10" y="10" width="220" height="316" rx="7" fill="url(#stars)"/>
 <rect x="13" y="13" width="214" height="310" rx="7" fill="none" stroke="url(#gold)" stroke-width="1.3"/>
 <rect x="17" y="17" width="206" height="302" rx="5" fill="none" stroke="${c.outline}" stroke-opacity=".47" stroke-width=".7"/>
 <path d="M120 36L199 165L120 300L41 165Z" fill="none" stroke="${c.outline}" stroke-opacity=".15" stroke-width=".8"/>
 <path d="M120 67L175 166L120 265L65 166Z" fill="none" stroke="#f4d99e" stroke-opacity=".17" stroke-width="1"/>
 ${cornerFiligree()}
 <path d="M120 15l6 8-6 8-6-8Z M120 321l6-8-6-8-6 8Z" fill="${c.gem}" stroke="#fff4c9" stroke-width=".9"/>
 <path d="M50 21h140M50 315h140" stroke="#e9c88b" stroke-width=".75" opacity=".48"/>`;
 }
 function suitShape(c,x,y,scale,rot=0){
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})" class="royal-pip">
  <circle r="63" fill="url(#halo)" opacity=".6"/>
  <use href="#suit" fill="${c.glow}" opacity=".62" filter="url(#soft)" stroke="${c.glow}" stroke-width="8"/>
  <use href="#suit" fill="url(#gem)" stroke="${c.bright}" stroke-width="2.3" stroke-linejoin="round"/>
  <use href="#suit" fill="url(#gemshine)" opacity=".56"/>
  <path d="M-11 -10L-4 -21 L1 -15" fill="none" stroke="#fff" stroke-width="2.7" opacity=".83" stroke-linecap="round"/>
  </g>`;
 }
 function indexes(c,rank){
  const big=rank==="10"?37:43;
  function one(){
   return `<text x="20" y="56" font-family="Georgia,Times New Roman,serif" font-size="${big}" font-weight="bold" fill="#fff6d8" stroke="${c.deep}" stroke-width="1.1" paint-order="stroke">${rank}</text>
   ${suitShape(c,rank==="10"?42:34,77,.23)}
   `;
  }
  return `<g>${one()}</g><g transform="translate(240 336) rotate(180)">${one()}</g>`;
 }
 function numbered(c,n){
  const scale=n===2?.88:n===3?.76:n===4?.72:n===5?.68:n===6?.62:n===7?.58:n===8?.53:n===9?.50:.46;
  const mid=`<circle cx="120" cy="166" r="83" fill="url(#halo)" opacity=".15"/><circle cx="120" cy="166" r="89" fill="none" stroke="#e9b5fd" stroke-width=".7" opacity=".17" stroke-dasharray="3 6"/>`;
  return mid+locations[n].map(([x,y])=>suitShape(c,x,y,scale,y>167?180:0)).join("");
 }
 function crown(c,rank){
  if(rank==="J")return `<g transform="translate(0 -2)"><path d="M67 111Q120 87 173 111" fill="none" stroke="url(#gold)" stroke-width="4"/><path d="M77 105l4-10 8 7m68 3-4-10-8 7" fill="none" stroke="#ffe4aa" stroke-width="2"/></g>`;
  return `<g>
  <path d="M74 104L74 78L94 93L120 64L146 93L166 78L166 104L153 112H87Z" fill="url(#gold)" stroke="#fff4c5" stroke-width="2"/>
  <path d="M81 98L98 101L120 76L141 101L160 98" fill="none" stroke="#e6c77c" stroke-width="1.2"/>
  <path d="M120 75l7 10-7 10-7-10Z" fill="${c.glow}" stroke="#fff" stroke-width="1"/>
  <circle cx="93" cy="98" r="3" fill="${c.gem}"/><circle cx="147" cy="98" r="3" fill="${c.gem}"/>
  </g>`;
 }
 function court(c,rank,base64){
  if(!base64)throw Error("Missing portrait for "+c.key+"-"+rank);
  const title={K:"THE KING",Q:"THE QUEEN",J:"THE JACK"}[rank];
  return `<g>
  <ellipse cx="120" cy="166" rx="91" ry="110" fill="url(#halo)" opacity=".45"/>
  <path d="M45 105Q120 47 195 105V231Q120 280 45 231Z" fill="url(#gold)" stroke="#fff4cd" stroke-width="1.5"/>
  <path d="M50 107Q120 57 190 107V227Q120 268 50 227Z" fill="${c.deep}"/>
  <image x="48" y="78" width="144" height="180" preserveAspectRatio="xMidYMin slice" clip-path="url(#portraitClip)" href="data:image/webp;base64,${base64}"/>
  <path d="M52 192Q120 225 188 192V228Q120 265 52 228Z" fill="${c.deep}" opacity=".10"/>
  <path d="M53 107Q120 60 187 107V226Q120 267 53 226Z" stroke="url(#gold)" stroke-width="2.5" fill="none"/>
  <path d="M48 108Q120 57 192 108M48 228Q120 275 192 228" fill="none" stroke="#fff2c4" stroke-width="1" opacity=".7"/>
  <g transform="translate(0 -12)">${crown(c,rank)}</g>
  <path d="M55 241L78 253H162L185 241L176 272H64Z" fill="${c.deep}" stroke="url(#gold)" stroke-width="2.6"/>
  ${suitShape(c,120,248,.24)}
  <text x="120" y="282" font-family="Georgia,Times New Roman,serif" font-size="12.8" text-anchor="middle" fill="#fff2cb" font-weight="bold" letter-spacing="1.6">${title}</text>
  <path d="M70 291h100" stroke="url(#gold)" stroke-width="1.1" opacity=".7"/>
  </g>`;
 }
 function ace(c){
  return `<g>
  <circle cx="120" cy="163" r="91" fill="url(#halo)" opacity=".9"/>
  <circle cx="120" cy="163" r="84" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
  <circle cx="120" cy="163" r="73" fill="none" stroke="${c.outline}" stroke-width="1.6" stroke-dasharray="2 5" opacity=".75"/>
  <path d="M120 58L131 89L120 82L109 89Z M120 266L131 235L120 242L109 235Z M20 163L52 152L45 163L52 174Z M220 163L188 152L195 163L188 174Z" fill="url(#gold)" stroke="#fff2c7" stroke-width=".6"/>
  <circle cx="120" cy="163" r="60" fill="url(#halo)" opacity=".7"/>
  ${suitShape(c,120,164,1.35)}
  ${crown(c,"K")}
  <text x="120" y="280" text-anchor="middle" font-family="Georgia,serif" font-size="9" font-weight="bold" letter-spacing="1.5" fill="#ffdfae">${c.subtitle}</text>
  </g>`;
 }
 function face(suit,rank){
  const c={...suits[suit],key:suit};
  let art;
  if(rank==="A")art=ace(c);
  else if(["K","Q","J"].includes(rank))art=court(c,rank,portraits[portraitId[suit+"-"+rank]]);
  else art=numbered(c,Number(rank));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 336" width="240" height="336" role="img" aria-label="${rank==="A"?"ACE":rank==="K"?"KING":rank==="Q"?"QUEEN":rank==="J"?"JACK":rank} of ${c.name} — Mystic Royale Cinematic" data-theme="mystic-royale-cinematic" data-rank="${rank}" data-suit="${suit}" data-card="${suit}-${rank}">
  ${defs(c)}
  ${frame(c)}
  ${art}
  ${indexes(c,rank)}
  </svg>`;
 }
 function back(){
  const c={...suits.S,key:"S"};
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 336" width="240" height="336" role="img" aria-label="Mystic Royale Cinematic dealer card back" data-theme="mystic-royale-cinematic">
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
