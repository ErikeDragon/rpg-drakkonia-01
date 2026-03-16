const TILE_SIZE = 32;
const VISION_RADIUS = 6;
const MAP_WIDTH = 29;
const MAP_HEIGHT = 23;
const MINOR_ENEMY_IDS = new Set(["ratPack", "robber", "giantGoblin"]);

const TILE_TYPES = {
  "#": { kind: "wall", baseColor: "#33414c" },
  ".": { kind: "floor", baseColor: "#5f584b" },
  S: { kind: "start", baseColor: "#56794d" },
  D: { kind: "stairs", baseColor: "#5a86d7" },
  M: { kind: "market", baseColor: "#b87934" },
  m: { kind: "vendor", baseColor: "#c18a3e" },
  T: { kind: "treasure", baseColor: "#d0af47" },
  t: { kind: "treasure", baseColor: "#be9a34" },
  g: { kind: "gold", baseColor: "#c8b65d" },
  r: { kind: "enemy", enemyId: "ratPack", baseColor: "#8b5c3f" },
  b: { kind: "enemy", enemyId: "robber", baseColor: "#776257" },
  q: { kind: "enemy", enemyId: "giantGoblin", baseColor: "#5e9b45" },
  h: { kind: "enemy", enemyId: "cryptHound", baseColor: "#7d4f48" },
  z: { kind: "enemy", enemyId: "evilWizard", baseColor: "#824341" },
  e: { kind: "enemy", enemyId: "earthMonster", baseColor: "#7d6543" },
  s: { kind: "enemy", enemyId: "skeletonKnight", baseColor: "#b7b0a2" },
  w: { kind: "enemy", enemyId: "evilWarlock", baseColor: "#546b98" },
  c: { kind: "enemy", enemyId: "ciclops", baseColor: "#a35b46" },
  o: { kind: "enemy", enemyId: "armoredOgre", baseColor: "#5f7c6c" },
  x: { kind: "enemy", enemyId: "mimic", baseColor: "#9b7a39" },
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
  musicToggle.textContent = musicMuted ? "Unmute Music" : "Mute Music";
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
  const strong = tone === "important" ? "<strong>Notice:</strong> " : "";
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
  weaponValue.textContent = player.weapon;
  armorValue.textContent = player.armor;
  shieldValue.textContent = player.shield;
  levelValue.textContent = `${player.level} · ${player.xp} / ${player.nextLevelXp} XP`;
  depthValue.textContent = `Level ${player.depth}`;
}

function showDeathNotice(text) {
  deathNotice.textContent = text;
  deathNotice.style.display = "block";
}

function clearDeathNotice() {
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
    setEncounterDisplay("Area", "Quiet Hall", null, "Quiet Hall");
    return;
  }

  const tileType = getTileKind(symbol);
  const { kind } = tileType;

  if (kind === "market") {
    setEncounterDisplay("Market", "Ember Market Stall", "market");
    return;
  }

  if (kind === "vendor") {
    setEncounterDisplay("Vendor", "Ironmonger", "vendor");
    return;
  }

  if (kind === "enemy") {
    setEncounterDisplay("Enemy", ENEMIES[tileType.enemyId].name, tileType.enemyId);
    return;
  }

  if (kind === "treasure" || kind === "gold") {
    setEncounterDisplay("Treasure", "Dungeon Loot", "treasure");
    return;
  }

  if (kind === "stairs") {
    setEncounterDisplay("Exit", "Stairs to Level 2", "stairs");
    return;
  }

  if (kind === "start") {
    setEncounterDisplay("Area", "Entry Chamber", null, "Entry Chamber");
    return;
  }

  setEncounterDisplay("Area", "Quiet Hall", null, "Quiet Hall");
}

function formatEnemySpecs(enemy) {
  return `HP ${enemy.hp} | ATK ${enemy.attackMin}-${enemy.attackMax} | DEF ${enemy.defense} | Reward ${enemy.gold}g | XP ${enemy.xp}`;
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
    addStory(
      `You drink a potion and recover <strong>${gained}</strong> HP. Your breath steadies.`,
      "important"
    );
    updateHud();
    draw();
    return;
  }

  if (itemKey === "leather") {
    player.armor = "Leather Armor";
    player.armorDefense = 1;
    player.purchased.add(itemKey);
    addStory(
      "You strap on leather armor. The dungeon suddenly feels a little less eager to kill you."
    );
    updateHud();
    return;
  }

  if (itemKey === "buckler") {
    player.shield = "Buckler";
    player.shieldDefense = 1;
    player.purchased.add(itemKey);
    addStory("You raise a round buckler and test its balance with your wood sword.");
    updateHud();
    return;
  }

  if (itemKey === "ironSword") {
    player.weapon = "Iron Sword";
    player.weaponPower = 4;
    player.purchased.add(itemKey);
    addStory("The smith hands you an iron sword. It bites the air with a sharper promise.");
    updateHud();
  }
}

function openShop(type) {
  const shop = SHOP_CATALOG[type];
  addStory(shop.intro, "important");

  const actions = shop.items
    .filter((item) => !(item.oneTime && player.purchased.has(item.key)))
    .map((item) => ({
      label: `${item.label} (${item.cost}g)`,
      onClick: () => {
        if (player.gold < item.cost) {
          addStory(`You need ${item.cost} gold for ${item.label}, but only have ${player.gold}.`);
          return;
        }
        player.gold -= item.cost;
        applyPurchase(item.key);
        updateHud();
        openShop(type);
      },
    }));

  actions.push({
    label: "Leave",
    onClick: () => {
      clearActions();
      addStory("You step away from the stall and listen to the dungeon breathe around you.");
    },
  });

  setActions(`${shop.name}: choose an item while you stand here.`, actions);
}

function enemyAttack(enemy) {
  return randomInt(enemy.attackMin, enemy.attackMax);
}

function playerAttack() {
  return randomInt(2, 5) + player.weaponPower + player.levelBonus;
}

function gainExperience(amount) {
  player.xp += amount;
  const notes = [`You gain <strong>${amount}</strong> XP.`];
  let leveledUp = false;

  while (player.xp >= player.nextLevelXp) {
    player.xp -= player.nextLevelXp;
    player.level += 1;
    player.levelBonus += 1;
    player.maxHp += 3;
    player.hp = player.maxHp;
    player.nextLevelXp = Math.ceil(player.nextLevelXp * 1.55);
    leveledUp = true;
    notes.push(
      `Level up to <strong>${player.level}</strong>. Max HP rises to ${player.maxHp} and your attacks grow stronger.`
    );
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
  const actions = [
    {
      label: "Fight [F]",
      onClick: () => {
        battleRound();
      },
    },
  ];
  const intro =
    pendingEncounter.sourceType === "mimic"
      ? `${enemy.name}: ${pendingEncounter.enemyHp} / ${enemy.hp} HP remaining. ${formatEnemySpecs(enemy)}. The mimic has trapped you. There is no escape.`
      : `${enemy.name}: ${pendingEncounter.enemyHp} / ${enemy.hp} HP remaining. ${formatEnemySpecs(enemy)}`;

  if (pendingEncounter.sourceType !== "mimic") {
    actions.push({
      label: "Retreat [R]",
      onClick: () => {
        attemptFlee();
      },
    });
  }

  setActions(intro, actions);
}

function setRespawnAction() {
  setActions("You are down. Respawn to return to the entrance.", [
    {
      label: "Respawn",
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
  addStory(
    "The Dungeon sickness gnaws through your strength. The stones whisper that the halls will not look the same when you rise again.",
    "important"
  );
  storyTip.textContent = "The Dungeon sickness claimed you. Respawn to face a shifted level.";
  showDeathNotice("The Dungeon sickness killed you.");
  setRespawnAction();
  updateHud();
  draw();
}

function presentEncounter(enemyId, x, y, fromPosition, enemyKey = null, sourceType = "enemy") {
  const baseEnemy = ENEMIES[enemyId];
  setEncounterDisplay("Enemy", baseEnemy.name, enemyId);
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
    `${baseEnemy.intro} <strong>${baseEnemy.name}</strong> stands before you. ${formatEnemySpecs(
      baseEnemy
    )}.${
      sourceType === "mimic"
        ? " The mimic bars all escape. <strong>F</strong> to fight. There is no retreat."
        : " Choose whether to fight or try to retreat. Shortcuts: <strong>F</strong> to fight, <strong>R</strong> to retreat."
    }`,
    "important"
  );
  setEncounterActions();
}

function handlePlayerDefeat(enemy, contextText) {
  playDeathSound();
  awaitingRespawn = true;
  pendingEncounter = null;
  player.hp = 0;
  player.gold = Math.max(0, player.gold - 3);
  clearActions();
  clearHeroLevelupTimeout();
  refreshHeroPortrait();
  addStory(`${contextText} You lost 3 gold. Press Respawn to return to the dungeon entrance.`, "important");
  storyTip.textContent = "You were defeated. Use Respawn to return to the start of level 1.";
  showDeathNotice(`You were defeated by ${enemy.name}.`);
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
      `Round ${round}: you strike for <strong>${dealt}</strong> and defeat the ${enemy.name}. You collect <strong>${enemy.gold}</strong> gold. ${xpResult.text}`,
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
      `Round ${round}: you hit the ${enemy.name} for <strong>${dealt}</strong>, but it answers with <strong>${taken}</strong> and drops you.`
    );
    return;
  }

  addStory(
    `Round ${round}: you hit the ${enemy.name} for <strong>${dealt}</strong>. It has <strong>${encounter.enemyHp}</strong> HP left and hits back for <strong>${taken}</strong>. Choose your next move.`,
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
    addStory("The mimic snaps its lid shut behind you. There is no retreat now, only the fight.", "important");
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
    addStory(
      `You slip away from the ${enemy.name} and fall back to the previous corridor before it can pin you down.`,
      "important"
    );
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
      `You try to retreat, but the ${enemy.name} lands <strong>${taken}</strong> damage before you can escape.`
    );
    return;
  }

  addStory(
    `You try to flee, but the ${enemy.name} clips you for <strong>${taken}</strong> damage. ${formatEnemySpecs(
      enemy
    )}. Fight or try fleeing again.`,
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
    addStory(
      "The treasure glints in the dark, but its guardian still stalks the room. Beat the creature before you can claim it.",
      "important"
    );
    return;
  }

  if (record.mimicEnemyId) {
    if (record.key) {
      persistentResolvedChests.add(record.key);
    }
    addStory(
      "You reach for the chest and its hinges twist like jaws. The treasure was a mimic.",
      "important"
    );
    presentEncounter(record.mimicEnemyId, x, y, lastPlayerPosition, null, "mimic");
    return;
  }

  if (symbol === "g") {
    const amount = randomInt(3, 6);
    player.gold += amount;
    addStory(`You scoop up a loose purse of coins worth <strong>${amount}</strong> gold.`);
  } else if (symbol === "t") {
    const amount = randomInt(5, 8);
    player.gold += amount;
    addStory(`A forgotten satchel yields <strong>${amount}</strong> gold and a torn trade map.`);
  } else {
    const reward = randomInt(8, 12);
    player.gold += reward;
    player.maxHp += 2;
    player.hp = Math.min(player.maxHp, player.hp + 2);
    addStory(
      `Inside the ember chest you find <strong>${reward}</strong> gold and an old charm that raises your max HP by 2.`,
      "important"
    );
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
    storyTip.textContent =
      "You began with a wood sword, no armor, no shield, and 5 gold. Shops only work when you stand on them.";
    return;
  }

  if (kind === "market") {
    storyTip.textContent = "You are standing on a market tile. Use the buttons below to buy gear.";
    openShop("market");
    return;
  }

  if (kind === "vendor") {
    storyTip.textContent = "You are standing on a vendor tile. Better weapons wait here.";
    openShop("vendor");
    return;
  }

  if (kind === "enemy") {
    storyTip.textContent = "A foe blocks the room. Review its stats, then choose to fight or flee.";
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
    storyTip.textContent = "Treasure is collected only when you land on its tile.";
    openTreasure(symbol, player.x, player.y);
    draw();
    return;
  }

  if (kind === "stairs") {
    storyTip.textContent = "Level 1 ends here for now.";
    clearActions();
    addStory(
      "You descend to the sealed stair of level 2. Cold air rises from below, but this prototype ends at the threshold.",
      "important"
    );
    return;
  }

  storyTip.textContent =
    "Keep exploring. The deeper halls hold tougher enemies, richer treasure, and the way down.";
}

function movePlayer(dx, dy) {
  if (!awaitingRespawn) {
    clearDeathNotice();
  }
  clearHeroLevelupTimeout();
  refreshHeroPortrait();

  if (awaitingRespawn) {
    addStory("You are down. Use Respawn before trying to move again.", "important");
    setRespawnAction();
    return;
  }

  if (pendingEncounter) {
    addStory("The enemy is still in front of you. Choose Fight or Retreat before moving again.", "important");
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

      addStory(
        "The Dungeon sickness is affecting you. You keep ramming the same wall and the stone feeds on your life. You'll die if you continue.",
        "important"
      );
    } else {
      addStory("Stone blocks your way. The wall gives nothing back.");
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
  updateHud();
  setupKeyboard();
  setupMusicToggle();
  setupDungeonLoopStart();
  addStory(
    "You enter The Shifting Dungeons of Drakkonia with a wood sword, no armor, no shield, and only 5 gold. People in the market whisper that its halls change when they tire of a dying adventurer."
  );
  addStory(
    "No two descents are quite the same, yet the dungeon remembers what was truly lost. Major monsters stay dead, spent treasure stays gone, and only lesser pests creep back through the shifting halls."
  );
  clearDeathNotice();
  resetWallHits();
  refreshHeroPortrait();
  handleTile();
  draw();
}

init();
