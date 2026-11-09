/* Original character identities for HIGH / LOW: BATTLEGROUNDS. 
   Characters are cosmetic personas: the existing card ability ID remains authoritative. */
(function(root){
  'use strict';
  const roster = [
    ['precision','Astra Vale','The Glass-Eyed Marshal','A marshal who sees the smallest opening and never wastes a wager.','S'],
    ['survey','Orion Voss','The Star Cartographer','Every route through the unknown begins with an honest map.','S'],
    ['reckoning','Nyx Ardent','The Probability Seer','She reads possibility, never fate.','S'],
    ['heartward','Seraphine Rose','The Scarlet Bastion','No kingdom is lost while one heart remains unbroken.','H'],
    ['secondwind','Ember Sol','The Phoenix Healer','When the embers fade, he brings the dawn again.','H'],
    ['steady','Kael Veridian','The Crimson Duelist','His pulse never quickens, even at the edge of defeat.','H'],
    ['reserve','Cassian Gold','The Treasury Lord','His reserves are never empty, only strategically concealed.','D'],
    ['exchange','Vesper Kade','The Masked Broker','Every exchange has its price and its hidden benefit.','D'],
    ['investment','Solenne Prism','The Diamond Regent','She can turn a small advantage into an empire.','D'],
    ['crosswind','Thorne Wren','The Briar Witch','She bends the wind so enemies find no straight road.','C'],
    ['irongrip','Dagan Iron','The Chain Marshal','No lock holds forever; no grip yields willingly.','C'],
    ['rooted','Elder Rowan','The Verdant Sentinel','The forest stands because its oldest roots refuse to move.','C'],
    ['longrange','Iris North','The Horizon Hunter','She finds a passage beyond every imposed boundary.','S'],
    ['openledger','Silas Quill','The Ledger Keeper','What the world calls luck, he writes down as evidence.','S'],
    ['coldcalculation','Eira Frost','The Winter Tactician','A colder hand can still make a fair choice.','S'],
    ['lastember','Liora Pyre','The Last Flame','She keeps one final spark alive through the darkness.','H'],
    ['mendingthread','Elowen Thread','The Rose Stitcher','Her patient hands can mend even a fractured oath.','H'],
    ['quietpulse','Tavian Hearth','The Silent Guardian','He waits until the moment protection truly matters.','H'],
    ['collateral','Auric Flint','The Risk Alchemist','Great rewards demand that someone understand the cost.','D'],
    ['dividend','Lady Marcelle','The Yield Duchess','She watches the smallest seeds of fortune blossom.','D'],
    ['arbitrage','Riven Lux','The Golden Gambit','One card traded at the right hour can change a war.','D'],
    ['lockdown','Morrigan Thorn','The Gatekeeper','Her gate opens only for those she has chosen.','C'],
    ['briarsnare','Fenn Bramble','The Wild Trapper','He understands the tangle before it has been woven.','C'],
    ['reckoningmark','Vera Nightroot','The Thorn Sovereign','Her warning appears long before the fall.','C']
  ];
  const factions = Object.freeze({
    S:{name:'Spades',description:'Precision & intelligence'},
    H:{name:'Hearts',description:'Preservation & recovery'},
    D:{name:'Diamonds',description:'Resources & tempo'},
    C:{name:'Clubs',description:'Pressure & disruption'}
  });
  const entries = roster.map(([id,name,title,lore,suit])=>Object.freeze({
    id,name,title,lore,suit,portrait:'./art/'+id+'.svg'
  }));
  root.ArenaCharacters = Object.freeze({
    list:Object.freeze(entries),
    byId:Object.freeze(Object.fromEntries(entries.map(v=>[v.id,v]))),
    factions
  });
})(typeof globalThis!=='undefined'?globalThis:this);
