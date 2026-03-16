const TILE_SIZE = 32;
const VISION_RADIUS = 6;
const MAP_WIDTH = 29;
const MAP_HEIGHT = 23;
const MINOR_ENEMY_IDS = new Set(["ratPack", "robber", "giantGoblin"]);
const LANG_STORAGE_KEY = "drakkonia-language";

let currentLanguage = "en";
try {
  const storedLanguage = window.localStorage.getItem(LANG_STORAGE_KEY);
  if (storedLanguage === "en" || storedLanguage === "pt") {
    currentLanguage = storedLanguage;
  }
} catch (error) {
  currentLanguage = "en";
}

const TRANSLATIONS = {
  en: {
    title: {
      eyebrow: "Old School Top-Down RPG Prototype",
      main: "The Shifting Dungeons of Drakkonia",
      byline: 'by Erik "eDragon" Lingerfelt',
      subtitle:
        "Descend through a haunted, shifting ruin beneath Drakkonia, survive the maze, and reach the stair to level 2.",
    },
    hud: {
      hp: "HP",
      gold: "Gold",
      weapon: "Weapon",
      armor: "Armor",
      shield: "Shield",
      level: "Level",
      depth: "Depth",
    },
    story: {
      eyebrow: "Story Log",
      title: "Level 1: The Shifting Halls",
      noticePrefix: "Notice:",
    },
    portrait: {
      heroLabel: "Hero",
      heroName: "Adventurer",
    },
    legend: {
      controlsTitle: "Controls",
      move: "`W A S D` to move",
      fight: "`F` fight, `R` retreat during encounters",
      interact: "Step onto a tile to interact",
      muteMusic: "Mute Music",
      unmuteMusic: "Unmute Music",
      backLink: "Back to main website",
      mapTitle: "Map Key",
      wall: "Wall",
      floor: "Floor",
      market: "Market / Vendor",
      enemy: "Enemy",
      treasure: "Treasure",
      stairs: "Stairs to level 2",
    },
    encounter: {
      area: "Area",
      market: "Market",
      vendor: "Vendor",
      enemy: "Enemy",
      treasure: "Treasure",
      exit: "Exit",
      quietHall: "Quiet Hall",
      entryChamber: "Entry Chamber",
      dungeonLoot: "Dungeon Loot",
      emberMarketStall: "Ember Market Stall",
      ironmonger: "Ironmonger",
      stairsToLevel2: "Stairs to Level 2",
    },
    ui: {
      leave: "Leave",
      fight: "Fight [F]",
      retreat: "Retreat [R]",
      respawn: "Respawn",
      chooseItem: "{shop}: choose an item while you stand here.",
      respawnPrompt: "You are down. Respawn to return to the entrance.",
      encounterStatus: "{enemy}: {current} / {max} HP remaining. {specs}",
      mimicStatus: "{enemy}: {current} / {max} HP remaining. {specs}. The mimic has trapped you. There is no escape.",
    },
    stats: {
      hp: "HP",
      atk: "ATK",
      def: "DEF",
      reward: "Reward",
      xp: "XP",
    },
    equipment: {
      none: "None",
      woodSword: "Wood Sword",
      leatherArmor: "Leather Armor",
      buckler: "Buckler",
      ironSword: "Iron Sword",
    },
    hudValues: {
      depth: "Level {depth}",
      level: "{level} · {xp} / {next} XP",
    },
    tips: {
      interactOnly: "You only interact when you step onto the same tile as something.",
      start:
        "You began with a wood sword, no armor, no shield, and 5 gold. Shops only work when you stand on them.",
      market: "You are standing on a market tile. Use the buttons below to buy gear.",
      vendor: "You are standing on a vendor tile. Better weapons wait here.",
      enemy: "A foe blocks the room. Review its stats, then choose to fight or flee.",
      treasure: "Treasure is collected only when you land on its tile.",
      stairs: "Level 1 ends here for now.",
      explore: "Keep exploring. The deeper halls hold tougher enemies, richer treasure, and the way down.",
      dungeonSicknessClaimed: "The Dungeon sickness claimed you. Respawn to face a shifted level.",
      defeated: "You were defeated. Use Respawn to return to the start of level 1.",
    },
    messages: {
      potionHeal: "You drink a potion and recover <strong>{gained}</strong> HP. Your breath steadies.",
      leatherEquip:
        "You strap on leather armor. The dungeon suddenly feels a little less eager to kill you.",
      bucklerEquip: "You raise a round buckler and test its balance with your wood sword.",
      ironSwordEquip:
        "The smith hands you an iron sword. It bites the air with a sharper promise.",
      needGold: "You need {cost} gold for {item}, but only have {gold}.",
      leaveShop: "You step away from the stall and listen to the dungeon breathe around you.",
      gainXp: "You gain <strong>{amount}</strong> XP.",
      levelUp:
        "Level up to <strong>{level}</strong>. Max HP rises to {maxHp} and your attacks grow stronger.",
      encounterIntro:
        "{intro} <strong>{enemy}</strong> stands before you. {specs}. Choose whether to fight or try to retreat. Shortcuts: <strong>F</strong> to fight, <strong>R</strong> to retreat.",
      mimicIntro:
        "{intro} <strong>{enemy}</strong> stands before you. {specs}. The mimic bars all escape. <strong>F</strong> to fight. There is no retreat.",
      defeatGoldLoss:
        "{context} You lost 3 gold. Press Respawn to return to the dungeon entrance.",
      defeatByEnemy: "You were defeated by {enemy}.",
      dungeonSicknessDeath:
        "The Dungeon sickness gnaws through your strength. The stones whisper that the halls will not look the same when you rise again.",
      dungeonSicknessKilled: "The Dungeon sickness killed you.",
      mimicNoEscape:
        "The mimic snaps its lid shut behind you. There is no retreat now, only the fight.",
      fleeSuccess:
        "You slip away from the {enemy} and fall back to the previous corridor before it can pin you down.",
      fleeFail:
        "You try to flee, but the {enemy} clips you for <strong>{taken}</strong> damage. {specs}. Fight or try fleeing again.",
      guardedTreasure:
        "The treasure glints in the dark, but its guardian still stalks the room. Beat the creature before you can claim it.",
      mimicReveal:
        "You reach for the chest and its hinges twist like jaws. The treasure was a mimic.",
      looseCoins: "You scoop up a loose purse of coins worth <strong>{amount}</strong> gold.",
      satchelCoins:
        "A forgotten satchel yields <strong>{amount}</strong> gold and a torn trade map.",
      emberChest:
        "Inside the ember chest you find <strong>{reward}</strong> gold and an old charm that raises your max HP by 2.",
      stairsReached:
        "You descend to the sealed stair of level 2. Cold air rises from below, but this prototype ends at the threshold.",
      moveWhileDown: "You are down. Use Respawn before trying to move again.",
      moveWhileEncounter:
        "The enemy is still in front of you. Choose Fight or Retreat before moving again.",
      wallSickness:
        "The Dungeon sickness is affecting you. You keep ramming the same wall and the stone feeds on your life. You'll die if you continue.",
      wallBlock: "Stone blocks your way. The wall gives nothing back.",
      introOne:
        "You enter The Shifting Dungeons of Drakkonia with a wood sword, no armor, no shield, and only 5 gold. People in the market whisper that its halls change when they tire of a dying adventurer.",
      introTwo:
        "No two descents are quite the same, yet the dungeon remembers what was truly lost. Major monsters stay dead, spent treasure stays gone, and only lesser pests creep back through the shifting halls.",
      battleWin:
        "Round {round}: you strike for <strong>{dealt}</strong> and defeat the {enemy}. You collect <strong>{gold}</strong> gold. {xpText}",
      battleContinue:
        "Round {round}: you hit the {enemy} for <strong>{dealt}</strong>. It has <strong>{enemyHp}</strong> HP left and hits back for <strong>{taken}</strong>. Choose your next move.",
      battleDeath:
        "Round {round}: you hit the {enemy} for <strong>{dealt}</strong>, but it answers with <strong>{taken}</strong> and drops you.",
      fleeDeath:
        "You try to retreat, but the {enemy} lands <strong>{taken}</strong> damage before you can escape.",
    },
  },
  pt: {
    title: {
      eyebrow: "Protótipo de RPG Top-Down Old School",
      main: "As Masmorras Móveis de Drakkonia",
      byline: 'por Erik "eDragon" Lingerfelt',
      subtitle:
        "Desça por uma ruína mutante e assombrada sob Drakkonia, sobreviva ao labirinto e alcance a escada para o nível 2.",
    },
    hud: {
      hp: "HP",
      gold: "Ouro",
      weapon: "Arma",
      armor: "Armadura",
      shield: "Escudo",
      level: "Nível",
      depth: "Profundidade",
    },
    story: {
      eyebrow: "Registro",
      title: "Nível 1: Os Salões Móveis",
      noticePrefix: "Aviso:",
    },
    portrait: {
      heroLabel: "Herói",
      heroName: "Aventureiro",
    },
    legend: {
      controlsTitle: "Controles",
      move: "`W A S D` para mover",
      fight: "`F` luta, `R` recua durante encontros",
      interact: "Pise no bloco para interagir",
      muteMusic: "Silenciar Música",
      unmuteMusic: "Ativar Música",
      backLink: "Voltar ao site principal",
      mapTitle: "Legenda do Mapa",
      wall: "Parede",
      floor: "Chão",
      market: "Mercado / Vendedor",
      enemy: "Inimigo",
      treasure: "Tesouro",
      stairs: "Escadas para o nível 2",
    },
    encounter: {
      area: "Área",
      market: "Mercado",
      vendor: "Vendedor",
      enemy: "Inimigo",
      treasure: "Tesouro",
      exit: "Saída",
      quietHall: "Corredor Silencioso",
      entryChamber: "Câmara de Entrada",
      dungeonLoot: "Espólio da Masmorra",
      emberMarketStall: "Banca das Brasas",
      ironmonger: "Ferreiro",
      stairsToLevel2: "Escadas para o Nível 2",
    },
    ui: {
      leave: "Sair",
      fight: "Lutar [F]",
      retreat: "Recuar [R]",
      respawn: "Renascer",
      chooseItem: "{shop}: escolha um item enquanto estiver aqui.",
      respawnPrompt: "Você caiu. Renasça para voltar à entrada.",
      encounterStatus: "{enemy}: {current} / {max} de HP restantes. {specs}",
      mimicStatus: "{enemy}: {current} / {max} de HP restantes. {specs}. O mímico prendeu você. Não há escapatória.",
    },
    stats: {
      hp: "HP",
      atk: "ATQ",
      def: "DEF",
      reward: "Recompensa",
      xp: "XP",
    },
    equipment: {
      none: "Nenhum",
      woodSword: "Espada de Madeira",
      leatherArmor: "Armadura de Couro",
      buckler: "Broquel",
      ironSword: "Espada de Ferro",
    },
    hudValues: {
      depth: "Nível {depth}",
      level: "{level} · {xp} / {next} XP",
    },
    tips: {
      interactOnly: "Você só interage quando pisa exatamente no mesmo bloco de algo.",
      start:
        "Você começou com uma espada de madeira, sem armadura, sem escudo e com 5 moedas. As lojas só funcionam quando você está sobre elas.",
      market: "Você está sobre um bloco de mercado. Use os botões abaixo para comprar equipamento.",
      vendor: "Você está sobre um bloco de vendedor. Armas melhores esperam aqui.",
      enemy: "Um inimigo bloqueia a sala. Veja seus atributos e então escolha lutar ou recuar.",
      treasure: "Tesouros só são coletados quando você pisa no bloco deles.",
      stairs: "O nível 1 termina aqui por enquanto.",
      explore:
        "Continue explorando. Os salões mais profundos guardam inimigos mais fortes, tesouros melhores e o caminho para baixo.",
      dungeonSicknessClaimed:
        "A doença da Masmorra venceu você. Renasça para enfrentar um nível alterado.",
      defeated: "Você foi derrotado. Use Renascer para voltar ao início do nível 1.",
    },
    messages: {
      potionHeal: "Você bebe uma poção e recupera <strong>{gained}</strong> de HP. Sua respiração se acalma.",
      leatherEquip:
        "Você veste a armadura de couro. A masmorra parece um pouco menos ansiosa para matar você.",
      bucklerEquip:
        "Você ergue um broquel redondo e testa o equilíbrio dele junto da espada de madeira.",
      ironSwordEquip:
        "O ferreiro lhe entrega uma espada de ferro. Ela corta o ar com uma promessa mais afiada.",
      needGold: "Você precisa de {cost} de ouro para {item}, mas só tem {gold}.",
      leaveShop:
        "Você se afasta da banca e escuta a respiração da masmorra ao seu redor.",
      gainXp: "Você ganha <strong>{amount}</strong> XP.",
      levelUp:
        "Subiu para o nível <strong>{level}</strong>. Seu HP máximo sobe para {maxHp} e seus ataques ficam mais fortes.",
      encounterIntro:
        "{intro} <strong>{enemy}</strong> fica diante de você. {specs}. Escolha lutar ou tentar recuar. Atalhos: <strong>F</strong> para lutar, <strong>R</strong> para recuar.",
      mimicIntro:
        "{intro} <strong>{enemy}</strong> fica diante de você. {specs}. O mímico bloqueia toda fuga. <strong>F</strong> para lutar. Não há recuo.",
      defeatGoldLoss:
        "{context} Você perdeu 3 moedas de ouro. Pressione Renascer para voltar à entrada da masmorra.",
      defeatByEnemy: "Você foi derrotado por {enemy}.",
      dungeonSicknessDeath:
        "A doença da Masmorra rói suas forças. As pedras sussurram que os salões não parecerão os mesmos quando você se erguer de novo.",
      dungeonSicknessKilled: "A doença da Masmorra matou você.",
      mimicNoEscape:
        "O mímico fecha a tampa atrás de você. Não existe recuo agora, apenas a luta.",
      fleeSuccess:
        "Você escapa do {enemy} e recua para o corredor anterior antes que ele consiga cercá-lo.",
      fleeFail:
        "Você tenta fugir, mas o {enemy} acerta <strong>{taken}</strong> de dano. {specs}. Lute ou tente fugir de novo.",
      guardedTreasure:
        "O tesouro brilha no escuro, mas seu guardião ainda ronda a sala. Derrote a criatura antes de pegá-lo.",
      mimicReveal:
        "Você alcança o baú e suas dobradiças se retorcem como mandíbulas. O tesouro era um mímico.",
      looseCoins: "Você recolhe uma bolsa solta com <strong>{amount}</strong> moedas de ouro.",
      satchelCoins:
        "Uma sacola esquecida rende <strong>{amount}</strong> moedas de ouro e um mapa comercial rasgado.",
      emberChest:
        "Dentro do baú das brasas você encontra <strong>{reward}</strong> moedas de ouro e um velho amuleto que aumenta seu HP máximo em 2.",
      stairsReached:
        "Você chega à escada selada do nível 2. Um ar frio sobe lá de baixo, mas este protótipo termina neste limiar.",
      moveWhileDown: "Você caiu. Use Renascer antes de tentar se mover novamente.",
      moveWhileEncounter:
        "O inimigo ainda está à sua frente. Escolha Lutar ou Recuar antes de tentar se mover de novo.",
      wallSickness:
        "A doença da Masmorra está afetando você. Você continua batendo na mesma parede e a pedra se alimenta da sua vida. Você vai morrer se continuar.",
      wallBlock: "Pedra bloqueia seu caminho. A parede não devolve nada.",
      introOne:
        "Você entra nas Masmorras Móveis de Drakkonia com uma espada de madeira, sem armadura, sem escudo e apenas 5 moedas de ouro. As pessoas no mercado sussurram que os salões mudam quando se cansam de um aventureiro moribundo.",
      introTwo:
        "Nenhuma descida é exatamente igual, mas a masmorra se lembra do que foi realmente perdido. Grandes monstros continuam mortos, tesouros gastos continuam vazios, e apenas pestes menores rastejam de volta pelos salões mutantes.",
      battleWin:
        "Rodada {round}: você acerta <strong>{dealt}</strong> e derrota o {enemy}. Você coleta <strong>{gold}</strong> moedas de ouro. {xpText}",
      battleContinue:
        "Rodada {round}: você acerta o {enemy} em <strong>{dealt}</strong>. Ele ainda tem <strong>{enemyHp}</strong> de HP e revida com <strong>{taken}</strong>. Escolha seu próximo movimento.",
      battleDeath:
        "Rodada {round}: você acerta o {enemy} em <strong>{dealt}</strong>, mas ele responde com <strong>{taken}</strong> e derruba você.",
      fleeDeath:
        "Você tenta recuar, mas o {enemy} causa <strong>{taken}</strong> de dano antes que você consiga escapar.",
    },
  },
};

const ENEMY_LOCALIZATION = {
  ratPack: {
    name: { en: "Rat Pack", pt: "Matilha de Ratos" },
    intro: {
      en: "A twitching mass of dungeon rats spills out from the shadows.",
      pt: "Uma massa convulsiva de ratos da masmorra escorre das sombras.",
    },
  },
  robber: {
    name: { en: "Robber", pt: "Ladrão" },
    intro: {
      en: "A desperate robber slips from behind a pillar with a knife already drawn.",
      pt: "Um ladrão desesperado surge de trás de uma coluna com a faca já em punho.",
    },
  },
  giantGoblin: {
    name: { en: "Giant Goblin", pt: "Goblin Gigante" },
    intro: {
      en: "A giant goblin stamps forward, grinning as it spots your weak starting gear.",
      pt: "Um goblin gigante avança batendo os pés, sorrindo ao ver seu equipamento fraco de início.",
    },
  },
  cryptHound: {
    name: { en: "Crypt Hound", pt: "Cão da Cripta" },
    intro: {
      en: "A crypt hound prowls low, red eyes shining in the dark.",
      pt: "Um cão da cripta ronda rente ao chão, com olhos vermelhos brilhando no escuro.",
    },
  },
  evilWizard: {
    name: { en: "Evil Wizard", pt: "Mago Maligno" },
    intro: {
      en: "An evil wizard mutters a curse and lifts a crooked hand toward you.",
      pt: "Um mago maligno murmura uma maldição e ergue uma mão torta em sua direção.",
    },
  },
  earthMonster: {
    name: { en: "Earth Monster", pt: "Monstro da Terra" },
    intro: {
      en: "Chunks of living earth grind together into a hulking monster ahead.",
      pt: "Blocos de terra viva se esmagam uns contra os outros formando um monstro enorme adiante.",
    },
  },
  skeletonKnight: {
    name: { en: "Skeleton Knight", pt: "Cavaleiro Esqueleto" },
    intro: {
      en: "A skeleton knight lifts its ancient weapon with a dry hiss of bone.",
      pt: "Um cavaleiro esqueleto ergue sua arma antiga com um seco sibilar de ossos.",
    },
  },
  evilWarlock: {
    name: { en: "Evil Warlock", pt: "Bruxo Maligno" },
    intro: {
      en: "An evil warlock narrows his eyes and opens a palm full of dark sparks.",
      pt: "Um bruxo maligno estreita os olhos e abre a mão cheia de faíscas sombrias.",
    },
  },
  ciclops: {
    name: { en: "Ciclops", pt: "Ciclope" },
    intro: {
      en: "A snarling ciclops lumbers in, each step shaking dust from the ceiling.",
      pt: "Um ciclope rosnando avança pesadamente, cada passo sacudindo poeira do teto.",
    },
  },
  armoredOgre: {
    name: { en: "Armored Ogre", pt: "Ogro Blindado" },
    intro: {
      en: "An armored ogre plants itself before the stair, armored plates clanging in warning.",
      pt: "Um ogro blindado se planta diante da escada, com as placas de armadura tilintando em aviso.",
    },
  },
  mimic: {
    name: { en: "Mimic", pt: "Mímico" },
    intro: {
      en: "The chest splits open into rows of teeth. It was a mimic all along.",
      pt: "O baú se abre em fileiras de dentes. Era um mímico o tempo todo.",
    },
  },
};

const SHOP_LOCALIZATION = {
  market: {
    name: { en: "Ember Market Stall", pt: "Banca das Brasas" },
    intro: {
      en: "A lantern-lit stall is somehow still open. The merchant bows and says, 'Buy only what you can carry back alive.'",
      pt: "Uma banca iluminada por lanternas ainda está aberta de algum jeito. O mercador faz uma reverência e diz: 'Compre apenas o que conseguir levar de volta com vida.'",
    },
  },
  vendor: {
    name: { en: "Ironmonger", pt: "Ferreiro" },
    intro: {
      en: "A soot-covered smith leans over a cracked anvil. 'Wood sword, eh? Let me fix that.'",
      pt: "Um ferreiro coberto de fuligem se inclina sobre uma bigorna rachada. 'Espada de madeira, é? Deixe eu resolver isso.'",
    },
  },
};

const ITEM_LOCALIZATION = {
  potion: {
    label: { en: "Potion", pt: "Poção" },
    description: { en: "Restore 6 HP", pt: "Recupera 6 de HP" },
  },
  leather: {
    label: { en: "Leather Armor", pt: "Armadura de Couro" },
    description: { en: "+1 armor", pt: "+1 armadura" },
  },
  buckler: {
    label: { en: "Buckler", pt: "Broquel" },
    description: { en: "+1 shield", pt: "+1 escudo" },
  },
  ironSword: {
    label: { en: "Iron Sword", pt: "Espada de Ferro" },
    description: { en: "+2 weapon power", pt: "+2 poder de arma" },
  },
};

const EQUIPMENT_LOCALIZATION = {
  None: { en: "None", pt: "Nenhum" },
  "Wood Sword": { en: "Wood Sword", pt: "Espada de Madeira" },
  "Leather Armor": { en: "Leather Armor", pt: "Armadura de Couro" },
  Buckler: { en: "Buckler", pt: "Broquel" },
  "Iron Sword": { en: "Iron Sword", pt: "Espada de Ferro" },
};

function getTranslation(path) {
  return path.split(".").reduce((value, part) => value?.[part], TRANSLATIONS[currentLanguage]);
}

function interpolate(template, vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

function t(path, vars = {}) {
  const value = getTranslation(path) ?? path;
  return typeof value === "function" ? value(vars) : interpolate(value, vars);
}

function localize(value) {
  if (value && typeof value === "object" && ("en" in value || "pt" in value)) {
    return value[currentLanguage] ?? value.en ?? "";
  }

  return value;
}

function translateEquipmentName(name) {
  return localize(EQUIPMENT_LOCALIZATION[name]) || name;
}

function getEnemyName(enemyId) {
  return localize(ENEMY_LOCALIZATION[enemyId]?.name) || ENEMIES[enemyId].name;
}

function getEnemyIntro(enemyId) {
  return localize(ENEMY_LOCALIZATION[enemyId]?.intro) || ENEMIES[enemyId].intro;
}

function getShopName(type) {
  return localize(SHOP_LOCALIZATION[type]?.name) || SHOP_CATALOG[type].name;
}

function getShopIntro(type) {
  return localize(SHOP_LOCALIZATION[type]?.intro) || SHOP_CATALOG[type].intro;
}

function getItemLabel(itemKey) {
  return localize(ITEM_LOCALIZATION[itemKey]?.label) || itemKey;
}

function getItemDescription(itemKey) {
  return localize(ITEM_LOCALIZATION[itemKey]?.description) || "";
}

const TILE_TYPES = {
  "#": { kind: "wall", baseColor: "#17211c" },
  ".": { kind: "floor", baseColor: "#243129" },
  S: { kind: "start", baseColor: "#10b981" },
  D: { kind: "stairs", baseColor: "#0ea5a4" },
  M: { kind: "market", baseColor: "#0f8f63" },
  m: { kind: "vendor", baseColor: "#13a06f" },
  T: { kind: "treasure", baseColor: "#d4a017" },
  t: { kind: "treasure", baseColor: "#b98912" },
  g: { kind: "gold", baseColor: "#d6b24a" },
  r: { kind: "enemy", enemyId: "ratPack", baseColor: "#5b3a2b" },
  b: { kind: "enemy", enemyId: "robber", baseColor: "#4b3a34" },
  q: { kind: "enemy", enemyId: "giantGoblin", baseColor: "#3d6a3a" },
  h: { kind: "enemy", enemyId: "cryptHound", baseColor: "#6a3d36" },
  z: { kind: "enemy", enemyId: "evilWizard", baseColor: "#6b2f31" },
  e: { kind: "enemy", enemyId: "earthMonster", baseColor: "#6e5630" },
  s: { kind: "enemy", enemyId: "skeletonKnight", baseColor: "#889289" },
  w: { kind: "enemy", enemyId: "evilWarlock", baseColor: "#35546d" },
  c: { kind: "enemy", enemyId: "ciclops", baseColor: "#8b4630" },
  o: { kind: "enemy", enemyId: "armoredOgre", baseColor: "#39584a" },
  x: { kind: "enemy", enemyId: "mimic", baseColor: "#8f6b1e" },
};

const ENEMY_SYMBOLS = {
  ratPack: "r",
  robber: "b",
  giantGoblin: "q",
  cryptHound: "h",
  evilWizard: "z",
  earthMonster: "e",
  skeletonKnight: "s",
  evilWarlock: "w",
  ciclops: "c",
  armoredOgre: "o",
  mimic: "x",
};

const ENEMIES = {
  ratPack: {
    name: "Rat Pack",
    hp: 5,
    attackMin: 1,
    attackMax: 3,
    defense: 0,
    gold: 2,
    xp: 4,
    intro: "A twitching mass of dungeon rats spills out from the shadows.",
  },
  robber: {
    name: "Robber",
    hp: 7,
    attackMin: 1,
    attackMax: 4,
    defense: 1,
    gold: 3,
    xp: 5,
    intro: "A desperate robber slips from behind a pillar with a knife already drawn.",
  },
  giantGoblin: {
    name: "Giant Goblin",
    hp: 8,
    attackMin: 2,
    attackMax: 4,
    defense: 1,
    gold: 4,
    xp: 7,
    intro: "A giant goblin stamps forward, grinning as it spots your weak starting gear.",
  },
  cryptHound: {
    name: "Crypt Hound",
    hp: 10,
    attackMin: 2,
    attackMax: 5,
    defense: 1,
    gold: 5,
    xp: 8,
    intro: "A crypt hound prowls low, red eyes shining in the dark.",
  },
  evilWizard: {
    name: "Evil Wizard",
    hp: 11,
    attackMin: 3,
    attackMax: 6,
    defense: 2,
    gold: 6,
    xp: 9,
    intro: "An evil wizard mutters a curse and lifts a crooked hand toward you.",
  },
  earthMonster: {
    name: "Earth Monster",
    hp: 12,
    attackMin: 3,
    attackMax: 6,
    defense: 2,
    gold: 7,
    xp: 10,
    intro: "Chunks of living earth grind together into a hulking monster ahead.",
  },
  skeletonKnight: {
    name: "Skeleton Knight",
    hp: 15,
    attackMin: 4,
    attackMax: 7,
    defense: 2,
    gold: 9,
    xp: 12,
    intro: "A skeleton knight lifts its ancient weapon with a dry hiss of bone.",
  },
  evilWarlock: {
    name: "Evil Warlock",
    hp: 15,
    attackMin: 5,
    attackMax: 8,
    defense: 3,
    gold: 10,
    xp: 13,
    intro: "An evil warlock narrows his eyes and opens a palm full of dark sparks.",
  },
  ciclops: {
    name: "Ciclops",
    hp: 17,
    attackMin: 5,
    attackMax: 8,
    defense: 3,
    gold: 11,
    xp: 15,
    intro: "A snarling ciclops lumbers in, each step shaking dust from the ceiling.",
  },
  armoredOgre: {
    name: "Armored Ogre",
    hp: 20,
    attackMin: 6,
    attackMax: 9,
    defense: 4,
    gold: 12,
    xp: 18,
    intro: "An armored ogre plants itself before the stair, armored plates clanging in warning.",
  },
  mimic: {
    name: "Mimic",
    hp: 13,
    attackMin: 3,
    attackMax: 6,
    defense: 2,
    gold: 9,
    xp: 11,
    intro: "The chest splits open into rows of teeth. It was a mimic all along.",
  },
};

const SHOP_CATALOG = {
  market: {
    name: "Ember Market Stall",
    intro:
      "A lantern-lit stall is somehow still open. The merchant bows and says, 'Buy only what you can carry back alive.'",
    items: [
      { key: "potion", label: "Potion", cost: 4, description: "Restore 6 HP", oneTime: false },
      { key: "leather", label: "Leather Armor", cost: 10, description: "+1 armor", oneTime: true },
      { key: "buckler", label: "Buckler", cost: 8, description: "+1 shield", oneTime: true },
    ],
  },
  vendor: {
    name: "Ironmonger",
    intro:
      "A soot-covered smith leans over a cracked anvil. 'Wood sword, eh? Let me fix that.'",
    items: [
      { key: "ironSword", label: "Iron Sword", cost: 12, description: "+2 weapon power", oneTime: true },
      { key: "potion", label: "Potion", cost: 4, description: "Restore 6 HP", oneTime: false },
    ],
  },
};

const SPRITE_CONFIG = {
  player: "assets/sprites/hero.webp",
  playerBruised: "assets/sprites/hero-bruised.webp",
  playerDefeat: "assets/sprites/hero-defeat.webp",
  playerLevelup: "assets/sprites/hero-levelup.webp",
  market: "assets/sprites/market.webp",
  vendor: "assets/sprites/market.webp",
  treasure: "assets/sprites/treasure.webp",
  gold: "assets/sprites/treasure.webp",
  stairs: "assets/sprites/stair-descend.webp",
  ratPack: "assets/sprites/rat-pack.webp",
  robber: "assets/sprites/robber.webp",
  giantGoblin: "assets/sprites/giant-goblin.webp",
  cryptHound: "assets/sprites/crypt-hound.webp",
  evilWizard: "assets/sprites/evil-wizard.webp",
  earthMonster: "assets/sprites/earth-monster.webp",
  skeletonKnight: "assets/sprites/skeleton-knight.webp",
  evilWarlock: "assets/sprites/evil-warlock.webp",
  ciclops: "assets/sprites/ciclops.webp",
  armoredOgre: "assets/sprites/armored-ogre.webp",
  mimic: "assets/sprites/treasure-mimic.webp",
};

function createLevelOneTemplate() {
  const width = MAP_WIDTH;
  const height = MAP_HEIGHT;
  const grid = Array.from({ length: height }, () => Array(width).fill("#"));

  const carveRoom = (x, y, roomWidth, roomHeight) => {
    for (let row = y; row < y + roomHeight; row += 1) {
      for (let col = x; col < x + roomWidth; col += 1) {
        grid[row][col] = ".";
      }
    }
  };

  const carveHallH = (x1, x2, y) => {
    const from = Math.min(x1, x2);
    const to = Math.max(x1, x2);
    for (let col = from; col <= to; col += 1) {
      grid[y][col] = ".";
    }
  };

  const carveHallV = (x, y1, y2) => {
    const from = Math.min(y1, y2);
    const to = Math.max(y1, y2);
    for (let row = from; row <= to; row += 1) {
      grid[row][x] = ".";
    }
  };

  const place = (x, y, symbol) => {
    grid[y][x] = symbol;
  };

  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  };

  carveRoom(1, 1, 6, 4);
  carveRoom(11, 1, 6, 4);
  carveRoom(21, 1, 6, 4);
  carveRoom(2, 8, 5, 4);
  carveRoom(10, 8, 6, 4);
  carveRoom(20, 8, 6, 4);
  carveRoom(1, 15, 6, 5);
  carveRoom(11, 15, 6, 5);
  carveRoom(21, 15, 6, 5);

  carveHallH(4, 14, 3);
  carveHallH(14, 24, 3);
  carveHallH(4, 24, 10);
  carveHallH(4, 24, 17);
  carveHallV(4, 3, 17);
  carveHallV(14, 3, 17);
  carveHallV(24, 3, 17);
  carveHallV(7, 3, 10);
  carveHallV(18, 3, 17);
  carveHallH(6, 10, 9);
  carveHallH(15, 20, 9);

  const rooms = [
    { id: "entry", x: 1, y: 1, w: 6, h: 4, role: "entry" },
    { id: "northGuard", x: 11, y: 1, w: 6, h: 4, role: "early" },
    { id: "northTreasure", x: 21, y: 1, w: 6, h: 4, role: "treasure" },
    { id: "westGuard", x: 2, y: 8, w: 5, h: 4, role: "early" },
    { id: "middleGuard", x: 10, y: 8, w: 6, h: 4, role: "mid" },
    { id: "vendor", x: 20, y: 8, w: 6, h: 4, role: "vendor" },
    { id: "vault", x: 1, y: 15, w: 6, h: 5, role: "vault" },
    { id: "gate", x: 11, y: 15, w: 6, h: 5, role: "late" },
    { id: "exit", x: 21, y: 15, w: 6, h: 5, role: "exit" },
  ];
  const enemyPlacements = [];
  const chestPlacements = [];
  const roomEnemyCounts = new Map();
  const roomChestCounts = new Map();
  const earlyPool = shuffle(["ratPack", "robber", "giantGoblin"]);
  const midPool = shuffle(["cryptHound", "evilWizard", "earthMonster"]);
  const latePool = shuffle(["skeletonKnight", "evilWarlock", "ciclops"]);
  const finalPool = shuffle(["armoredOgre", "ciclops", "evilWarlock"]);

  place(2, 2, "S");
  place(5, 3, "M");
  place(22, 9, "m");
  place(25, 17, "D");
  const addEnemy = (enemyId, x, y, roomId, blocksPassage = false) => {
    const nextCount = (roomEnemyCounts.get(roomId) || 0) + 1;
    roomEnemyCounts.set(roomId, nextCount);
    enemyPlacements.push({
      key: `${roomId}-enemy-${nextCount}`,
      enemyId,
      symbol: ENEMY_SYMBOLS[enemyId],
      x,
      y,
      spawnX: x,
      spawnY: y,
      roomId,
      blocksPassage,
    });
  };
  const addChest = (x, y, symbol, roomId, options = {}) => {
    const nextCount = (roomChestCounts.get(roomId) || 0) + 1;
    roomChestCounts.set(roomId, nextCount);
    chestPlacements.push({
      key: `${roomId}-chest-${nextCount}`,
      x,
      y,
      symbol,
      roomId,
      ...options,
    });
  };

  addEnemy(earlyPool[0], 13, 2, "northGuard");
  addEnemy(earlyPool[1], 15, 4, "northGuard");
  addEnemy(earlyPool[2], 4, 10, "westGuard");
  addEnemy(earlyPool[0], 5, 8, "westGuard");
  addEnemy(midPool[0], 12, 9, "middleGuard");
  addEnemy(midPool[1], 14, 10, "middleGuard");
  addEnemy(midPool[2], 24, 8, "vendor");
  addEnemy(latePool[0], 12, 17, "gate", true);
  addEnemy(latePool[1], 15, 18, "gate");
  addEnemy(finalPool[0], 22, 17, "exit", true);
  addEnemy(finalPool[1], 24, 18, "exit");

  addChest(24, 3, "t", "northTreasure", { guardRoomId: "northTreasure" });
  addEnemy(midPool[0], 23, 2, "northTreasure");

  const mimicIndex = Math.floor(Math.random() * 3);
  [
    [2, 16],
    [3, 17],
    [5, 18],
  ].forEach(([x, y], index) => {
    addChest(x, y, index === 1 ? "T" : "t", "vault", {
      guardRoomId: "vault",
      mimicEnemyId: index === mimicIndex ? "mimic" : null,
    });
  });
  addEnemy(latePool[2], 4, 18, "vault");

  return {
    grid: grid.map((row) => row.join("")),
    rooms,
    enemies: enemyPlacements,
    chests: chestPlacements,
  };
}
let currentDungeon = null;
let mapData = [];
const mapHeight = MAP_HEIGHT;
const mapWidth = MAP_WIDTH;
let dungeonRooms = [];
let dungeonRoomsById = new Map();
let enemyState = new Map();
let lastPlayerPosition = { x: 1, y: 1 };
let wallHitTracker = { x: null, y: null, count: 0 };
const persistentResolvedChests = new Set();
const persistentSlainDangerKeys = new Set();

const tileState = new Map();
const exploredTiles = new Set();
const imageCache = {};
let audioContext = null;
let pendingEncounter = null;
let heroLevelupTimeout = null;
let awaitingRespawn = false;
let dungeonLoopStarted = false;
let dungeonLoopTimer = null;
let musicMuted = false;
let musicGainNode = null;
let storyTipState = { key: "tips.interactOnly", vars: {} };
let deathNoticeState = null;

let startPosition = { x: 1, y: 1 };

const player = {
  x: 1,
  y: 1,
  level: 1,
  xp: 0,
  nextLevelXp: 10,
  maxHp: 12,
  hp: 12,
  gold: 5,
  weapon: "Wood Sword",
  weaponPower: 2,
  levelBonus: 0,
  armor: "None",
  armorDefense: 0,
  shield: "None",
  shieldDefense: 0,
  depth: 1,
  purchased: new Set(),
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = mapWidth * TILE_SIZE;
canvas.height = mapHeight * TILE_SIZE;

const hpValue = document.getElementById("hpValue");
const goldValue = document.getElementById("goldValue");
const weaponValue = document.getElementById("weaponValue");
const armorValue = document.getElementById("armorValue");
const shieldValue = document.getElementById("shieldValue");
const levelValue = document.getElementById("levelValue");
const depthValue = document.getElementById("depthValue");
const storyLog = document.getElementById("storyLog");
const actionArea = document.getElementById("actionArea");
const storyTip = document.getElementById("storyTip");
const deathNotice = document.getElementById("deathNotice");
const heroPortrait = document.getElementById("heroPortrait");
const encounterLabel = document.getElementById("encounterLabel");
const encounterName = document.getElementById("encounterName");
const encounterPortrait = document.getElementById("encounterPortrait");
const encounterFallback = document.getElementById("encounterFallback");
const musicToggle = document.getElementById("musicToggle");
const translatableNodes = document.querySelectorAll("[data-i18n]");
const langButtons = document.querySelectorAll("[data-lang-btn]");

function getAudioContext() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioCtor();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function setStoryTip(key, vars = {}) {
  storyTipState = { key, vars };
  storyTip.textContent = t(key, vars);
}

function refreshStoryTip() {
  if (!storyTipState) {
    return;
  }

  storyTip.textContent = t(storyTipState.key, storyTipState.vars);
}

function refreshMusicToggleLabel() {
  musicToggle.textContent = musicMuted ? t("legend.unmuteMusic") : t("legend.muteMusic");
}

function applyStaticTranslations() {
  translatableNodes.forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.documentElement.lang = currentLanguage;
  document.title = t("title.main");
  refreshStoryTip();
  refreshMusicToggleLabel();
  langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.langBtn === currentLanguage);
  });
}

function refreshLanguageState() {
  applyStaticTranslations();
  updateHud();

  if (deathNoticeState) {
    deathNotice.textContent = t(deathNoticeState.key, deathNoticeState.vars);
  }

  if (!tileState.size) {
    return;
  }

  if (pendingEncounter) {
    setEncounterDisplay(t("encounter.enemy"), getEnemyName(pendingEncounter.enemyId), pendingEncounter.enemyId);
    setEncounterActions();
    return;
  }

  if (awaitingRespawn) {
    setRespawnAction();
    return;
  }

  const record = getTileRecord(player.x, player.y);
  if (!record) {
    return;
  }

  updateEncounterDisplay(record.symbol, record.consumed);
  const kind = getTileKind(record.consumed ? "." : record.symbol).kind;
  if (kind === "market") {
    openShop("market");
    return;
  }

  if (kind === "vendor") {
    openShop("vendor");
    return;
  }

  if (kind !== "enemy") {
    clearActions();
  }
}

function setupLanguageToggle() {
  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const { langBtn } = button.dataset;
      if (langBtn !== "en" && langBtn !== "pt") {
        return;
      }

      currentLanguage = langBtn;
      try {
        window.localStorage.setItem(LANG_STORAGE_KEY, currentLanguage);
      } catch (error) {
        // Ignore storage issues and keep the in-memory language.
      }
      refreshLanguageState();
      draw();
    });
  });
}

function getMusicGainNode() {
  const audio = getAudioContext();
  if (!audio) {
    return null;
  }

  if (!musicGainNode) {
    musicGainNode = audio.createGain();
    musicGainNode.gain.value = musicMuted ? 0 : 1;
    musicGainNode.connect(audio.destination);
  }

  return musicGainNode;
}

function playTone(config) {
  const audio = getAudioContext();
  if (!audio) {
    return;
  }

  const oscillator = audio.createOscillator();
  const gainNode = audio.createGain();
  const startTime = audio.currentTime + (config.startOffset || 0);
  const endTime = startTime + config.duration;

  oscillator.type = config.type || "sine";
  oscillator.frequency.setValueAtTime(config.frequency, startTime);
  if (config.endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(1, config.endFrequency),
      endTime
    );
  }

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(config.volume || 0.03, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gainNode);
  gainNode.connect(audio.destination);
  oscillator.start(startTime);
  oscillator.stop(endTime);
}

function playEncounterSound() {
  playTone({ frequency: 220, endFrequency: 160, duration: 0.18, volume: 0.04, type: "sawtooth" });
  playTone({ frequency: 130, endFrequency: 96, duration: 0.24, volume: 0.025, type: "triangle", startOffset: 0.03 });
}

function playVictorySound() {
  playTone({ frequency: 620, endFrequency: 910, duration: 0.12, volume: 0.04, type: "square" });
  playTone({ frequency: 820, endFrequency: 1180, duration: 0.1, volume: 0.03, type: "triangle", startOffset: 0.05 });
}

function playDeathSound() {
  playTone({ frequency: 260, endFrequency: 90, duration: 0.5, volume: 0.05, type: "triangle" });
  playTone({ frequency: 160, endFrequency: 60, duration: 0.6, volume: 0.025, type: "sine", startOffset: 0.04 });
}

function scheduleSquarePulse(audio, destination, config) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const startTime = config.startTime;
  const endTime = config.endTime;

  osc.type = config.type || "square";
  osc.frequency.setValueAtTime(config.frequency, startTime);
  if (config.detune) {
    osc.detune.setValueAtTime(config.detune, startTime);
  }

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(config.volume || 1, startTime + (config.attack || 0.015));
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(startTime);
  osc.stop(endTime);
}

function scheduleSustainedMelody(audio, destination, config) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const startTime = config.startTime;
  const endTime = config.endTime;
  const holdTime = Math.max(startTime + 0.04, endTime - 0.08);

  osc.type = config.type || "triangle";
  osc.frequency.setValueAtTime(config.frequency, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(config.volume || 1, startTime + 0.03);
  gain.gain.setValueAtTime(config.volume || 1, holdTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(startTime);
  osc.stop(endTime);
}

function scheduleStringPulse(audio, destination, config) {
  const startTime = config.startTime;
  const endTime = config.endTime;
  const filter = audio.createBiquadFilter();
  const gain = audio.createGain();
  const lfo = audio.createOscillator();
  const lfoGain = audio.createGain();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(420, startTime);
  filter.frequency.linearRampToValueAtTime(300, endTime);
  filter.Q.setValueAtTime(8, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(config.volume || 0.8, startTime + 0.06);
  gain.gain.linearRampToValueAtTime((config.volume || 0.8) * 0.72, startTime + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  lfo.type = "sine";
  lfo.frequency.setValueAtTime(4.8, startTime);
  lfoGain.gain.setValueAtTime(7, startTime);

  lfo.connect(lfoGain);

  [-9, 9].forEach((detune) => {
    const osc = audio.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(config.frequency, startTime);
    osc.detune.setValueAtTime(detune, startTime);
    lfoGain.connect(osc.detune);
    osc.connect(filter);
    osc.start(startTime);
    osc.stop(endTime);
  });

  filter.connect(gain);
  gain.connect(destination);
  lfo.start(startTime);
  lfo.stop(endTime);
}

function scheduleDungeonLoop() {
  const audio = getAudioContext();
  const musicBus = getMusicGainNode();
  if (!audio) {
    return;
  }
  if (!musicBus) {
    return;
  }

  const bpm = (112 / 2.6) * 1.2;
  const beatDuration = 60 / bpm;
  const stepBeats = 0.5;
  const stepDuration = beatDuration * stepBeats;
  const bassDuration = stepDuration * 0.72;
  const notes = {
    C2: 65.41,
    D2: 73.42,
    "D#2": 77.78,
    F2: 87.31,
    C3: 130.81,
    D3: 146.83,
    "D#3": 155.56,
    "G#3": 207.65,
    "A#3": 233.08,
    B3: 246.94,
    C4: 261.63,
  };
  const bassPattern = [
    "C3", "C3", "C3",
    "D3", "D3", "D3", "D3", "D3",
    "D#3", "D#3", "D#3",
    "D3", "D3", "D3", "D3", "D3",
  ];
  const melodyEvents = [
    { startStep: 0, endStep: 3, note: "C4" },
    { startStep: 3, endStep: 8, note: "A#3" },
    { startStep: 8, endStep: 11, note: "G#3" },
    { startStep: 11, endStep: 16, note: "B3" },
  ];
  const supportEvents = [
    { startStep: 0, note: "C2" },
    { startStep: 3, note: "D#2" },
    { startStep: 8, note: "F2" },
    { startStep: 11, note: "D2" },
  ];
  const loopRepeats = 4;
  const loopSteps = bassPattern.length;
  const loopDuration = loopSteps * stepDuration;
  const totalDuration = loopDuration * loopRepeats;
  const now = audio.currentTime + 0.05;
  const gainBass = audio.createGain();
  const gainMelody = audio.createGain();
  const gainSupport = audio.createGain();

  gainBass.gain.value = 0.075;
  gainMelody.gain.value = 0.05;
  gainSupport.gain.value = 0.1;

  for (let repeat = 0; repeat < loopRepeats; repeat += 1) {
    for (let step = 0; step < bassPattern.length; step += 1) {
      const startTime = now + repeat * loopDuration + step * stepDuration;
      const endTime = startTime + bassDuration;
      scheduleSquarePulse(audio, gainBass, {
        frequency: notes[bassPattern[step]],
        startTime,
        endTime,
        type: "square",
        volume: 1,
      });
    }

    melodyEvents.forEach((event) => {
      const startTime = now + repeat * loopDuration + event.startStep * stepDuration;
      const endTime = now + repeat * loopDuration + event.endStep * stepDuration;
      scheduleSustainedMelody(audio, gainMelody, {
        frequency: notes[event.note],
        startTime,
        endTime,
        type: "triangle",
        volume: 0.95,
      });
      scheduleSquarePulse(audio, gainMelody, {
        frequency: notes[event.note] * 2,
        startTime,
        endTime: startTime + (endTime - startTime) * 0.35,
        type: "square",
        volume: 0.18,
        attack: 0.01,
      });
    });

    supportEvents.forEach((event) => {
      for (let hit = 0; hit < 2; hit += 1) {
        const startTime =
          now + repeat * loopDuration + (event.startStep + hit) * stepDuration;
        const endTime = startTime + stepDuration * 0.95;
        scheduleStringPulse(audio, gainSupport, {
          frequency: notes[event.note],
          startTime,
          endTime,
          volume: hit === 0 ? 0.95 : 0.72,
        });
      }
    });
  }

  gainBass.connect(musicBus);
  gainMelody.connect(musicBus);
  gainSupport.connect(musicBus);

  if (dungeonLoopTimer) {
    window.clearTimeout(dungeonLoopTimer);
  }

  dungeonLoopTimer = window.setTimeout(() => {
    if (dungeonLoopStarted) {
      scheduleDungeonLoop();
    }
  }, totalDuration * 1000 - 120);
}

function startDungeonLoop() {
  if (dungeonLoopStarted) {
    return;
  }

  const audio = getAudioContext();
  if (!audio) {
    return;
  }

  dungeonLoopStarted = true;
  scheduleDungeonLoop();
}

function updateMusicToggleLabel() {
  refreshMusicToggleLabel();
}

function toggleMusicMute() {
  musicMuted = !musicMuted;
  const musicBus = getMusicGainNode();
  if (musicBus) {
    musicBus.gain.setValueAtTime(musicMuted ? 0 : 1, getAudioContext().currentTime);
  }
  updateMusicToggleLabel();
}

function setupDungeonLoopStart() {
  document.addEventListener("click", startDungeonLoop, { once: true });
  window.addEventListener("keydown", startDungeonLoop, { once: true });
}

function setupMusicToggle() {
  updateMusicToggleLabel();
  musicToggle.addEventListener("click", toggleMusicMute);
}

function keyFor(x, y) {
  return `${x},${y}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isWalkable(x, y) {
  const tile = mapData[y]?.[x];
  return tile && tile !== "#";
}

function isWalkableForEnemy(x, y) {
  if (!isWalkable(x, y)) {
    return false;
  }

  if (getEnemyAt(x, y)) {
    return false;
  }

  const record = tileState.get(keyFor(x, y));
  if (!record) {
    return true;
  }

  return !["market", "vendor", "treasure", "gold", "stairs"].includes(getTileKind(record.symbol).kind);
}

function getTileKind(symbol) {
  return TILE_TYPES[symbol] || TILE_TYPES["."];
}

function generateDungeonRun() {
  currentDungeon = createLevelOneTemplate();
  mapData = currentDungeon.grid.map((row) => row.split(""));
  dungeonRooms = currentDungeon.rooms;
  dungeonRoomsById = new Map(dungeonRooms.map((room) => [room.id, room]));
}

function getEnemyAt(x, y) {
  for (const enemy of enemyState.values()) {
    if (enemy.alive && enemy.x === x && enemy.y === y) {
      return enemy;
    }
  }
  return null;
}

function getTileRecord(x, y) {
  const enemy = getEnemyAt(x, y);
  if (enemy) {
    return {
      symbol: enemy.symbol,
      consumed: false,
      dynamicEnemy: true,
      enemyId: enemy.enemyId,
      roomId: enemy.roomId,
      blocksPassage: enemy.blocksPassage,
    };
  }

  const state = tileState.get(keyFor(x, y));
  if (state) {
    return state;
  }
  return { symbol: mapData[y][x], consumed: false };
}

function setTileRecord(x, y, next) {
  tileState.set(keyFor(x, y), next);
}

function resetWallHits() {
  wallHitTracker = { x: null, y: null, count: 0 };
}

function findRoomAt(x, y) {
  return dungeonRooms.find(
    (room) =>
      x >= room.x &&
      x < room.x + room.w &&
      y >= room.y &&
      y < room.y + room.h
  ) || null;
}

function getAliveEnemiesInRoom(roomId) {
  return [...enemyState.values()].filter((enemy) => enemy.alive && enemy.roomId === roomId);
}

function roomHasAliveEnemies(roomId) {
  return getAliveEnemiesInRoom(roomId).length > 0;
}

function getOccupiedPositionKeys() {
  const occupied = new Set();

  for (const enemy of enemyState.values()) {
    if (enemy.alive) {
      occupied.add(keyFor(enemy.x, enemy.y));
    }
  }

  for (const [positionKey, record] of tileState.entries()) {
    if (record.consumed) {
      continue;
    }

    const kind = getTileKind(record.symbol).kind;
    if (["market", "vendor", "treasure", "gold", "stairs"].includes(kind)) {
      occupied.add(positionKey);
    }
  }

  occupied.add(keyFor(player.x, player.y));
  return occupied;
}

function spawnMinorReplacementsFor(enemy) {
  const room = dungeonRoomsById.get(enemy.roomId);
  if (!room) {
    return;
  }

  const occupied = getOccupiedPositionKeys();
  const candidateTiles = [];

  for (let y = room.y; y < room.y + room.h; y += 1) {
    for (let x = room.x; x < room.x + room.w; x += 1) {
      if (!isWalkable(x, y)) {
        continue;
      }

      const positionKey = keyFor(x, y);
      if (occupied.has(positionKey)) {
        continue;
      }

      candidateTiles.push({
        x,
        y,
        distance: Math.abs(x - enemy.spawnX) + Math.abs(y - enemy.spawnY),
      });
    }
  }

  candidateTiles.sort((left, right) => left.distance - right.distance);

  const spawnCount = Math.min(candidateTiles.length, 1 + (Math.random() < 0.6 ? 1 : 0));
  for (let index = 0; index < spawnCount; index += 1) {
    const tile = candidateTiles[index];
    const minorIds = ["ratPack", "robber", "giantGoblin"];
    const minorId = minorIds[randomInt(0, minorIds.length - 1)];
    const replacementKey = `${enemy.key}-vermin-${index + 1}`;

    enemyState.set(replacementKey, {
      key: replacementKey,
      enemyId: minorId,
      symbol: ENEMY_SYMBOLS[minorId],
      x: tile.x,
      y: tile.y,
      spawnX: tile.x,
      spawnY: tile.y,
      roomId: enemy.roomId,
      blocksPassage: false,
      alive: true,
      currentHp: ENEMIES[minorId].hp,
    });
    occupied.add(keyFor(tile.x, tile.y));
  }
}

function addStory(text, tone = "neutral") {
  storyLog.innerHTML = "";
  const item = document.createElement("li");
  const strong = tone === "important" ? `<strong>${t("story.noticePrefix")}</strong> ` : "";
  item.innerHTML = `${strong}${text}`;
  storyLog.appendChild(item);
}

function clearActions() {
  actionArea.innerHTML = "";
}

function setActions(title, actions) {
  clearActions();
  if (!actions.length) {
    return;
  }

  const card = document.createElement("div");
  card.className = "action-card";
  card.textContent = title;
  actionArea.appendChild(card);

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.className = "action-button";
    button.textContent = action.label;
    button.addEventListener("click", action.onClick);
    actionArea.appendChild(button);
  });
}

function updateHud() {
  hpValue.textContent = `${player.hp} / ${player.maxHp}`;
  goldValue.textContent = String(player.gold);
  weaponValue.textContent = translateEquipmentName(player.weapon);
  armorValue.textContent = translateEquipmentName(player.armor);
  shieldValue.textContent = translateEquipmentName(player.shield);
  levelValue.textContent = t("hudValues.level", {
    level: player.level,
    xp: player.xp,
    next: player.nextLevelXp,
  });
  depthValue.textContent = t("hudValues.depth", { depth: player.depth });
}

function showDeathNotice(key, vars = {}) {
  deathNoticeState = { key, vars };
  deathNotice.textContent = t(key, vars);
  deathNotice.style.display = "block";
}

function clearDeathNotice() {
  deathNoticeState = null;
  deathNotice.textContent = "";
  deathNotice.style.display = "none";
}

function clearHeroLevelupTimeout() {
  if (heroLevelupTimeout) {
    window.clearTimeout(heroLevelupTimeout);
    heroLevelupTimeout = null;
  }
}

function setHeroPortrait(spriteId, altText) {
  heroPortrait.src = SPRITE_CONFIG[spriteId];
  heroPortrait.alt = altText;
}

function refreshHeroPortrait() {
  if (awaitingRespawn || player.hp <= 0) {
    setHeroPortrait("playerDefeat", "Defeated hero portrait");
    return;
  }

  if (player.hp <= player.maxHp / 2) {
    setHeroPortrait("playerBruised", "Bruised hero portrait");
    return;
  }

  setHeroPortrait("player", "Hero portrait");
}

function showLevelupPortrait() {
  clearHeroLevelupTimeout();
  setHeroPortrait("playerLevelup", "Level up hero portrait");
  heroLevelupTimeout = window.setTimeout(() => {
    heroLevelupTimeout = null;
    refreshHeroPortrait();
  }, 1400);
}

function setEncounterDisplay(label, name, spriteId = null, fallbackText = name) {
  encounterLabel.textContent = label;
  encounterName.textContent = name;

  const src = spriteId ? SPRITE_CONFIG[spriteId] : null;
  if (src) {
    encounterPortrait.src = src;
    encounterPortrait.style.display = "block";
    encounterFallback.style.display = "none";
    encounterPortrait.alt = `${name} portrait`;
    return;
  }

  encounterPortrait.removeAttribute("src");
  encounterPortrait.style.display = "none";
  encounterFallback.style.display = "grid";
  encounterFallback.textContent = fallbackText;
}

function updateEncounterDisplay(symbol, consumed = false) {
  if (consumed) {
    setEncounterDisplay(
      t("encounter.area"),
      t("encounter.quietHall"),
      null,
      t("encounter.quietHall")
    );
    return;
  }

  const tileType = getTileKind(symbol);
  const { kind } = tileType;

  if (kind === "market") {
    setEncounterDisplay(
      t("encounter.market"),
      t("encounter.emberMarketStall"),
      "market"
    );
    return;
  }

  if (kind === "vendor") {
    setEncounterDisplay(t("encounter.vendor"), t("encounter.ironmonger"), "vendor");
    return;
  }

  if (kind === "enemy") {
    setEncounterDisplay(t("encounter.enemy"), getEnemyName(tileType.enemyId), tileType.enemyId);
    return;
  }

  if (kind === "treasure" || kind === "gold") {
    setEncounterDisplay(t("encounter.treasure"), t("encounter.dungeonLoot"), "treasure");
    return;
  }

  if (kind === "stairs") {
    setEncounterDisplay(t("encounter.exit"), t("encounter.stairsToLevel2"), "stairs");
    return;
  }

  if (kind === "start") {
    setEncounterDisplay(
      t("encounter.area"),
      t("encounter.entryChamber"),
      null,
      t("encounter.entryChamber")
    );
    return;
  }

  setEncounterDisplay(
    t("encounter.area"),
    t("encounter.quietHall"),
    null,
    t("encounter.quietHall")
  );
}

function formatEnemySpecs(enemy) {
  return `${t("stats.hp")} ${enemy.hp} | ${t("stats.atk")} ${enemy.attackMin}-${enemy.attackMax} | ${t(
    "stats.def"
  )} ${enemy.defense} | ${t("stats.reward")} ${enemy.gold}g | ${t("stats.xp")} ${enemy.xp}`;
}

function preloadSprites() {
  Object.entries(SPRITE_CONFIG).forEach(([id, src]) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      imageCache[id] = image;
      draw();
    };
    image.onerror = () => {
      imageCache[id] = null;
    };
  });
}

function findStart() {
  for (let y = 0; y < mapHeight; y += 1) {
    for (let x = 0; x < mapWidth; x += 1) {
      if (mapData[y][x] === "S") {
        player.x = x;
        player.y = y;
        startPosition = { x, y };
        return;
      }
    }
  }
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function hasLineOfSight(x0, y0, x1, y1) {
  let x = x0;
  let y = y0;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (!(x === x1 && y === y1)) {
    if (!(x === x0 && y === y0) && mapData[y][x] === "#") {
      return false;
    }
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  return true;
}

function getVisibility() {
  const visible = new Set();

  for (let y = 0; y < mapHeight; y += 1) {
    for (let x = 0; x < mapWidth; x += 1) {
      const dist = distance(player.x, player.y, x, y);
      if (dist <= VISION_RADIUS && hasLineOfSight(player.x, player.y, x, y)) {
        const id = keyFor(x, y);
        visible.add(id);
        exploredTiles.add(id);
      }
    }
  }

  return visible;
}

function drawTileBackground(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
  ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawGlyph(x, y, glyph, color) {
  ctx.fillStyle = color;
  ctx.font = "bold 16px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 1);
}

function drawSprite(id, x, y) {
  const image = imageCache[id];
  if (!image) {
    return false;
  }
  ctx.drawImage(image, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  return true;
}

function getTileVisual(symbol, record) {
  const tileType = getTileKind(symbol);
  const kind = tileType.kind;

  if (kind === "wall") {
    return { sprite: "wall", color: tileType.baseColor, glyph: "" };
  }
  if (kind === "floor" || kind === "start") {
    return { sprite: "floor", color: "#6a6152", glyph: "" };
  }
  if (kind === "stairs") {
    return { sprite: "stairs", color: tileType.baseColor, glyph: ">" };
  }
  if (kind === "market") {
    return { sprite: "market", color: tileType.baseColor, glyph: "$" };
  }
  if (kind === "vendor") {
    return { sprite: "vendor", color: tileType.baseColor, glyph: "!" };
  }
  if (kind === "treasure") {
    return { sprite: "treasure", color: tileType.baseColor, glyph: "T" };
  }
  if (kind === "gold") {
    return { sprite: "gold", color: tileType.baseColor, glyph: "G" };
  }
  if (kind === "enemy") {
    return {
      sprite: tileType.enemyId,
      color: tileType.baseColor,
      glyph: ENEMIES[tileType.enemyId].name.charAt(0),
    };
  }
  return { sprite: "floor", color: "#6a6152", glyph: "" };
}

function draw() {
  const visible = getVisibility();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < mapHeight; y += 1) {
    for (let x = 0; x < mapWidth; x += 1) {
      const id = keyFor(x, y);
      const record = getTileRecord(x, y);
      const currentSymbol = record.consumed ? "." : record.symbol;
      const visual = getTileVisual(currentSymbol, record);

      if (visible.has(id)) {
        drawTileBackground(x, y, visual.color);
        const drawn = drawSprite(visual.sprite, x, y);
        if (!drawn && visual.glyph) {
          drawGlyph(x, y, visual.glyph, "rgba(255, 245, 221, 0.92)");
        }

        const dist = distance(player.x, player.y, x, y);
        const shade = clamp((dist - 1) / (VISION_RADIUS - 1), 0, 1);
        ctx.fillStyle = `rgba(4, 8, 12, ${shade * 0.8})`;
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else if (exploredTiles.has(id)) {
        drawTileBackground(x, y, "#2a3038");
        ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = "#020406";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  ctx.fillStyle = "#f6d289";
  ctx.beginPath();
  ctx.arc(
    player.x * TILE_SIZE + TILE_SIZE / 2,
    player.y * TILE_SIZE + TILE_SIZE / 2,
    TILE_SIZE * 0.34,
    0,
    Math.PI * 2
  );
  ctx.fill();
  drawSprite("player", player.x, player.y);
}

function heal(amount) {
  const before = player.hp;
  player.hp = clamp(player.hp + amount, 0, player.maxHp);
  refreshHeroPortrait();
  return player.hp - before;
}

function applyPurchase(itemKey) {
  if (itemKey === "potion") {
    const gained = heal(6);
    addStory(t("messages.potionHeal", { gained }), "important");
    updateHud();
    draw();
    return;
  }

  if (itemKey === "leather") {
    player.armor = "Leather Armor";
    player.armorDefense = 1;
    player.purchased.add(itemKey);
    addStory(t("messages.leatherEquip"));
    updateHud();
    return;
  }

  if (itemKey === "buckler") {
    player.shield = "Buckler";
    player.shieldDefense = 1;
    player.purchased.add(itemKey);
    addStory(t("messages.bucklerEquip"));
    updateHud();
    return;
  }

  if (itemKey === "ironSword") {
    player.weapon = "Iron Sword";
    player.weaponPower = 4;
    player.purchased.add(itemKey);
    addStory(t("messages.ironSwordEquip"));
    updateHud();
  }
}

function openShop(type) {
  const shop = SHOP_CATALOG[type];
  addStory(getShopIntro(type), "important");

  const actions = shop.items
    .filter((item) => !(item.oneTime && player.purchased.has(item.key)))
    .map((item) => ({
      label: `${getItemLabel(item.key)} (${item.cost}g)`,
      onClick: () => {
        if (player.gold < item.cost) {
          addStory(
            t("messages.needGold", {
              cost: item.cost,
              item: getItemLabel(item.key),
              gold: player.gold,
            })
          );
          return;
        }
        player.gold -= item.cost;
        applyPurchase(item.key);
        updateHud();
        openShop(type);
      },
    }));

  actions.push({
    label: t("ui.leave"),
    onClick: () => {
      clearActions();
      addStory(t("messages.leaveShop"));
    },
  });

  setActions(t("ui.chooseItem", { shop: getShopName(type) }), actions);
}

function enemyAttack(enemy) {
  return randomInt(enemy.attackMin, enemy.attackMax);
}

function playerAttack() {
  return randomInt(2, 5) + player.weaponPower + player.levelBonus;
}

function gainExperience(amount) {
  player.xp += amount;
  const notes = [t("messages.gainXp", { amount })];
  let leveledUp = false;

  while (player.xp >= player.nextLevelXp) {
    player.xp -= player.nextLevelXp;
    player.level += 1;
    player.levelBonus += 1;
    player.maxHp += 3;
    player.hp = player.maxHp;
    player.nextLevelXp = Math.ceil(player.nextLevelXp * 1.55);
    leveledUp = true;
    notes.push(t("messages.levelUp", { level: player.level, maxHp: player.maxHp }));
  }

  updateHud();
  refreshHeroPortrait();
  return { text: notes.join(" "), leveledUp };
}

function setEncounterActions() {
  if (!pendingEncounter) {
    clearActions();
    return;
  }

  const enemy = ENEMIES[pendingEncounter.enemyId];
  const enemyName = getEnemyName(pendingEncounter.enemyId);
  const actions = [
    {
      label: t("ui.fight"),
      onClick: () => {
        battleRound();
      },
    },
  ];
  const intro =
    pendingEncounter.sourceType === "mimic"
      ? t("ui.mimicStatus", {
          enemy: enemyName,
          current: pendingEncounter.enemyHp,
          max: enemy.hp,
          specs: formatEnemySpecs(enemy),
        })
      : t("ui.encounterStatus", {
          enemy: enemyName,
          current: pendingEncounter.enemyHp,
          max: enemy.hp,
          specs: formatEnemySpecs(enemy),
        });

  if (pendingEncounter.sourceType !== "mimic") {
    actions.push({
      label: t("ui.retreat"),
      onClick: () => {
        attemptFlee();
      },
    });
  }

  setActions(intro, actions);
}

function setRespawnAction() {
  setActions(t("ui.respawnPrompt"), [
    {
      label: t("ui.respawn"),
      onClick: () => {
        respawnPlayer();
      },
    },
  ]);
}

function handleDungeonSicknessDeath() {
  awaitingRespawn = true;
  pendingEncounter = null;
  player.hp = 0;
  clearActions();
  clearHeroLevelupTimeout();
  refreshHeroPortrait();
  addStory(t("messages.dungeonSicknessDeath"), "important");
  setStoryTip("tips.dungeonSicknessClaimed");
  showDeathNotice("messages.dungeonSicknessKilled");
  setRespawnAction();
  updateHud();
  draw();
}

function presentEncounter(enemyId, x, y, fromPosition, enemyKey = null, sourceType = "enemy") {
  const baseEnemy = ENEMIES[enemyId];
  const enemyName = getEnemyName(enemyId);
  setEncounterDisplay(t("encounter.enemy"), enemyName, enemyId);
  pendingEncounter = {
    enemyId,
    x,
    y,
    fromX: fromPosition.x,
    fromY: fromPosition.y,
    enemyHp: enemyKey ? enemyState.get(enemyKey)?.currentHp || baseEnemy.hp : baseEnemy.hp,
    enemyKey,
    round: 1,
    sourceType,
  };
  playEncounterSound();
  addStory(
    t(sourceType === "mimic" ? "messages.mimicIntro" : "messages.encounterIntro", {
      intro: getEnemyIntro(enemyId),
      enemy: enemyName,
      specs: formatEnemySpecs(baseEnemy),
    }),
    "important"
  );
  setEncounterActions();
}

function handlePlayerDefeat(enemy, contextText, enemyId) {
  playDeathSound();
  awaitingRespawn = true;
  pendingEncounter = null;
  player.hp = 0;
  player.gold = Math.max(0, player.gold - 3);
  clearActions();
  clearHeroLevelupTimeout();
  refreshHeroPortrait();
  addStory(t("messages.defeatGoldLoss", { context: contextText }), "important");
  setStoryTip("tips.defeated");
  showDeathNotice("messages.defeatByEnemy", { enemy: getEnemyName(enemyId) });
  setRespawnAction();
  updateHud();
  draw();
}

function respawnPlayer() {
  awaitingRespawn = false;
  pendingEncounter = null;
  generateDungeonRun();
  initializeMapState();
  exploredTiles.clear();
  resetWallHits();
  player.hp = Math.max(1, Math.floor(player.maxHp / 2));
  findStart();
  lastPlayerPosition = { x: player.x, y: player.y };
  clearActions();
  handleTile();
  refreshHeroPortrait();
  updateHud();
  draw();
}

function resetRoomEnemies(roomId) {
  getAliveEnemiesInRoom(roomId).forEach((enemy) => {
    enemy.x = enemy.spawnX;
    enemy.y = enemy.spawnY;
  });
}

function chooseEnemyStep(enemy, targetX, targetY) {
  const room = dungeonRoomsById.get(enemy.roomId);
  if (!room) {
    return null;
  }

  const dx = targetX - enemy.x;
  const dy = targetY - enemy.y;
  const primaryFirst = Math.abs(dx) >= Math.abs(dy)
    ? [
        [Math.sign(dx), 0],
        [0, Math.sign(dy)],
      ]
    : [
        [0, Math.sign(dy)],
        [Math.sign(dx), 0],
      ];

  for (const [stepX, stepY] of primaryFirst) {
    if (!stepX && !stepY) {
      continue;
    }

    const nextX = enemy.x + stepX;
    const nextY = enemy.y + stepY;
    const insideRoom =
      nextX >= room.x &&
      nextX < room.x + room.w &&
      nextY >= room.y &&
      nextY < room.y + room.h;

    if (!insideRoom) {
      continue;
    }

    if (nextX === player.x && nextY === player.y) {
      return { x: nextX, y: nextY, touchesPlayer: true };
    }

    if (isWalkableForEnemy(nextX, nextY)) {
      return { x: nextX, y: nextY, touchesPlayer: false };
    }
  }

  return null;
}

function moveRoomEnemies(roomId) {
  const room = dungeonRoomsById.get(roomId);
  if (!room || pendingEncounter || awaitingRespawn) {
    return;
  }

  for (const enemy of getAliveEnemiesInRoom(roomId)) {
    const nextStep = chooseEnemyStep(enemy, player.x, player.y);
    if (!nextStep) {
      continue;
    }

    if (nextStep.touchesPlayer) {
      presentEncounter(enemy.enemyId, enemy.x, enemy.y, lastPlayerPosition, enemy.key);
      return;
    }

    enemy.x = nextStep.x;
    enemy.y = nextStep.y;
  }
}

function battleRound() {
  if (!pendingEncounter) {
    return;
  }

  const encounter = pendingEncounter;
  const enemy = ENEMIES[encounter.enemyId];
  const round = encounter.round;
  const dealt = Math.max(1, playerAttack() - enemy.defense);
  encounter.enemyHp -= dealt;
  if (encounter.enemyKey) {
    const liveEnemy = enemyState.get(encounter.enemyKey);
    if (liveEnemy) {
      liveEnemy.currentHp = Math.max(0, encounter.enemyHp);
    }
  }

  if (encounter.enemyHp <= 0) {
    player.gold += enemy.gold;
    if (encounter.enemyKey) {
      const liveEnemy = enemyState.get(encounter.enemyKey);
      if (liveEnemy) {
        liveEnemy.alive = false;
        if (!MINOR_ENEMY_IDS.has(liveEnemy.enemyId)) {
          persistentSlainDangerKeys.add(liveEnemy.key);
        }
      }
    } else if (encounter.sourceType === "mimic") {
      setTileRecord(encounter.x, encounter.y, {
        symbol: "T",
        consumed: true,
      });
    }
    pendingEncounter = null;
    playVictorySound();
    clearActions();
    const xpResult = gainExperience(enemy.xp);
    if (xpResult.leveledUp) {
      showLevelupPortrait();
    }
    addStory(
      t("messages.battleWin", {
        round,
        dealt,
        enemy: getEnemyName(encounter.enemyId),
        gold: enemy.gold,
        xpText: xpResult.text,
      }),
      "important"
    );
    updateEncounterDisplay(mapData[encounter.y][encounter.x], true);
    draw();
    return;
  }

  const reducedBy = player.armorDefense + player.shieldDefense;
  const taken = Math.max(1, enemyAttack(enemy) - reducedBy);
  player.hp -= taken;
  encounter.round += 1;
  refreshHeroPortrait();

  if (player.hp <= 0) {
    handlePlayerDefeat(
      enemy,
      t("messages.battleDeath", {
        round,
        dealt,
        taken,
        enemy: getEnemyName(encounter.enemyId),
      }),
      encounter.enemyId
    );
    return;
  }

  addStory(
    t("messages.battleContinue", {
      round,
      dealt,
      enemy: getEnemyName(encounter.enemyId),
      enemyHp: encounter.enemyHp,
      taken,
    }),
    "important"
  );
  setEncounterActions();
  updateHud();
  draw();
}

function attemptFlee() {
  if (!pendingEncounter || awaitingRespawn) {
    return;
  }

  if (pendingEncounter.sourceType === "mimic") {
    addStory(t("messages.mimicNoEscape"), "important");
    setEncounterActions();
    return;
  }

  const enemy = ENEMIES[pendingEncounter.enemyId];
  const fleeChance = clamp(0.72 - enemy.defense * 0.08 - enemy.attackMax * 0.03, 0.28, 0.72);
  const escaped = Math.random() < fleeChance;

  if (escaped) {
    const escapedFromRoom = pendingEncounter.enemyKey
      ? dungeonRoomsById.get(enemyState.get(pendingEncounter.enemyKey)?.roomId || "")
      : null;
    const fallbackRoom = findRoomAt(pendingEncounter.fromX, pendingEncounter.fromY);
    player.x = pendingEncounter.fromX;
    player.y = pendingEncounter.fromY;
    pendingEncounter = null;
    clearActions();
    if (escapedFromRoom && (!fallbackRoom || fallbackRoom.id !== escapedFromRoom.id)) {
      resetRoomEnemies(escapedFromRoom.id);
    }
    addStory(t("messages.fleeSuccess", { enemy: getEnemyName(pendingEncounter.enemyId) }), "important");
    handleTile();
    updateHud();
    draw();
    return;
  }

  const taken = Math.max(1, enemyAttack(enemy) - (player.armorDefense + player.shieldDefense));
  player.hp -= taken;
  refreshHeroPortrait();

  if (player.hp <= 0) {
    handlePlayerDefeat(
      enemy,
      t("messages.fleeDeath", { enemy: getEnemyName(pendingEncounter.enemyId), taken }),
      pendingEncounter.enemyId
    );
    return;
  }

  addStory(
    t("messages.fleeFail", {
      enemy: getEnemyName(pendingEncounter.enemyId),
      taken,
      specs: formatEnemySpecs(enemy),
    }),
    "important"
  );
  setEncounterActions();
  updateHud();
  draw();
}

function openTreasure(symbol, x, y) {
  const record = tileState.get(keyFor(x, y));
  if (!record || record.consumed) {
    return;
  }

  if (record.guardRoomId && roomHasAliveEnemies(record.guardRoomId)) {
    addStory(t("messages.guardedTreasure"), "important");
    return;
  }

  if (record.mimicEnemyId) {
    if (record.key) {
      persistentResolvedChests.add(record.key);
    }
    addStory(t("messages.mimicReveal"), "important");
    presentEncounter(record.mimicEnemyId, x, y, lastPlayerPosition, null, "mimic");
    return;
  }

  if (symbol === "g") {
    const amount = randomInt(3, 6);
    player.gold += amount;
    addStory(t("messages.looseCoins", { amount }));
  } else if (symbol === "t") {
    const amount = randomInt(5, 8);
    player.gold += amount;
    addStory(t("messages.satchelCoins", { amount }));
  } else {
    const reward = randomInt(8, 12);
    player.gold += reward;
    player.maxHp += 2;
    player.hp = Math.min(player.maxHp, player.hp + 2);
    addStory(t("messages.emberChest", { reward }), "important");
  }

  setTileRecord(x, y, { symbol, consumed: true });
  if (record.key) {
    persistentResolvedChests.add(record.key);
  }
  refreshHeroPortrait();
  updateHud();
}

function handleTile(fromPosition = { x: player.x, y: player.y }) {
  const record = getTileRecord(player.x, player.y);
  const symbol = record.consumed ? "." : record.symbol;
  const kind = getTileKind(symbol).kind;
  updateEncounterDisplay(record.symbol, record.consumed);

  if (kind !== "market" && kind !== "vendor" && kind !== "enemy") {
    clearActions();
  }

  if (kind === "start") {
    setStoryTip("tips.start");
    return;
  }

  if (kind === "market") {
    setStoryTip("tips.market");
    openShop("market");
    return;
  }

  if (kind === "vendor") {
    setStoryTip("tips.vendor");
    openShop("vendor");
    return;
  }

  if (kind === "enemy") {
    setStoryTip("tips.enemy");
    const roomEnemy = getEnemyAt(player.x, player.y);
    presentEncounter(
      getTileKind(symbol).enemyId,
      player.x,
      player.y,
      fromPosition,
      roomEnemy?.key || null
    );
    return;
  }

  if (kind === "gold" || kind === "treasure") {
    setStoryTip("tips.treasure");
    openTreasure(symbol, player.x, player.y);
    draw();
    return;
  }

  if (kind === "stairs") {
    setStoryTip("tips.stairs");
    clearActions();
    addStory(t("messages.stairsReached"), "important");
    return;
  }

  setStoryTip("tips.explore");
}

function movePlayer(dx, dy) {
  if (!awaitingRespawn) {
    clearDeathNotice();
  }
  clearHeroLevelupTimeout();
  refreshHeroPortrait();

  if (awaitingRespawn) {
    addStory(t("messages.moveWhileDown"), "important");
    setRespawnAction();
    return;
  }

  if (pendingEncounter) {
    addStory(t("messages.moveWhileEncounter"), "important");
    setEncounterActions();
    return;
  }

  const targetX = player.x + dx;
  const targetY = player.y + dy;

  if (!isWalkable(targetX, targetY)) {
    if (wallHitTracker.x === targetX && wallHitTracker.y === targetY) {
      wallHitTracker.count += 1;
    } else {
      wallHitTracker = { x: targetX, y: targetY, count: 1 };
    }

    if (wallHitTracker.count > 3) {
      player.hp -= 1;
      refreshHeroPortrait();
      updateHud();

      if (player.hp <= 0) {
        handleDungeonSicknessDeath();
        return;
      }

      addStory(t("messages.wallSickness"), "important");
    } else {
      addStory(t("messages.wallBlock"));
    }
    draw();
    return;
  }

  resetWallHits();
  const fromPosition = { x: player.x, y: player.y };
  const previousRoom = findRoomAt(player.x, player.y);
  lastPlayerPosition = fromPosition;
  player.x = targetX;
  player.y = targetY;
  handleTile(fromPosition);
  if (!pendingEncounter && !awaitingRespawn) {
    const currentRoom = findRoomAt(player.x, player.y);

    if (previousRoom && (!currentRoom || currentRoom.id !== previousRoom.id)) {
      resetRoomEnemies(previousRoom.id);
    }

    if (currentRoom) {
      moveRoomEnemies(currentRoom.id);
      if (!pendingEncounter) {
        const chargingEnemy = getEnemyAt(player.x, player.y);
        if (chargingEnemy) {
          presentEncounter(
            chargingEnemy.enemyId,
            chargingEnemy.x,
            chargingEnemy.y,
            fromPosition,
            chargingEnemy.key
          );
        }
      }
    }
  }
  updateHud();
  draw();
}

function setupKeyboard() {
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (
      ["w", "a", "s", "d", "f", "r", "arrowup", "arrowleft", "arrowdown", "arrowright"].includes(
        key
      )
    ) {
      event.preventDefault();
    }

    if (pendingEncounter && key === "f") {
      battleRound();
      return;
    }

    if (pendingEncounter && key === "r") {
      attemptFlee();
      return;
    }

    if (key === "w" || key === "arrowup") {
      movePlayer(0, -1);
    } else if (key === "s" || key === "arrowdown") {
      movePlayer(0, 1);
    } else if (key === "a" || key === "arrowleft") {
      movePlayer(-1, 0);
    } else if (key === "d" || key === "arrowright") {
      movePlayer(1, 0);
    }
  });
}

function initializeMapState() {
  tileState.clear();
  enemyState.clear();
  const deferredMinorRespawns = [];
  for (let y = 0; y < mapHeight; y += 1) {
    for (let x = 0; x < mapWidth; x += 1) {
      setTileRecord(x, y, {
        symbol: mapData[y][x],
        consumed: false,
      });
    }
  }

  currentDungeon.chests.forEach((chest) => {
    if (persistentResolvedChests.has(chest.key)) {
      return;
    }
    setTileRecord(chest.x, chest.y, {
      key: chest.key,
      symbol: chest.symbol,
      consumed: false,
      roomId: chest.roomId,
      guardRoomId: chest.guardRoomId || null,
      mimicEnemyId: chest.mimicEnemyId || null,
    });
  });

  currentDungeon.enemies.forEach((enemy) => {
    if (!MINOR_ENEMY_IDS.has(enemy.enemyId) && persistentSlainDangerKeys.has(enemy.key)) {
      deferredMinorRespawns.push(enemy);
      return;
    }
    enemyState.set(enemy.key, {
      ...enemy,
      alive: true,
      currentHp: ENEMIES[enemy.enemyId].hp,
    });
  });

  deferredMinorRespawns.forEach((enemy) => {
    spawnMinorReplacementsFor(enemy);
  });
}

function init() {
  generateDungeonRun();
  initializeMapState();
  findStart();
  lastPlayerPosition = { x: player.x, y: player.y };
  preloadSprites();
  applyStaticTranslations();
  updateHud();
  setupKeyboard();
  setupMusicToggle();
  setupDungeonLoopStart();
  setupLanguageToggle();
  addStory(t("messages.introOne"));
  addStory(t("messages.introTwo"));
  clearDeathNotice();
  resetWallHits();
  refreshHeroPortrait();
  handleTile();
  draw();
}

init();
