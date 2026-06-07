/**
 * POCKETTONE ARCHIVE PRO v2 — app.js
 * Fixed: rhythm scheduler drift, note-stuck bugs, slot logic,
 * lesson-stop visibility, octave shift, black-key detection,
 * distinct model voices, safe watch-mode playback, beat-dot clearing.
 */
'use strict';

/* =========================================
   MODEL REGISTRY
   ========================================= */
const ModelRegistry = {
  models: [
    {
      id: 'pocket-p1',
      name: 'Pocket P-1',
      tagline: 'The original classroom companion',
      era: '1981',
      keys: 29,
      octaveStart: 4,
      polyphony: 1,
      voices: ['piano-toy', 'flute-air', 'violin-soft', 'organ-mini'],
      defaultVoice: 'piano-toy',
      rhythms: ['march', 'waltz', '4beat', 'rock1'],
      defaultRhythm: 'march',
      defaultTempo: 108,
      sequencerLimit: 100,
      lessonSongs: ['ode_to_joy','twinkle','frere_jacques','mary_lamb','london_bridge','retro_01','tiny_waltz'],
      skin: 'cream-gray',
      hasLessonLights: true, hasDemoMode: true,
      description: 'Used in schools across imaginary Europe from 1981 to 1987. Beloved for its cream casing and forgiving monophonic piano voice. Simple and honest.',
      rarity: 'COMMON',
      catalogQuote: '"Small enough for a school bag. Strange enough for midnight melodies."',
      demoSong: 'demo_p1',
    },
    {
      id: 'pocket-p10',
      name: 'Pocket P-10',
      tagline: 'The cheerful starter — age 4+',
      era: '1983',
      keys: 25,
      octaveStart: 4,
      polyphony: 1,
      voices: ['square-bee', 'music-box', 'kalimba', 'toy-horn'],
      defaultVoice: 'square-bee',
      rhythms: ['march', 'kids-pop', 'waltz'],
      defaultRhythm: 'kids-pop',
      defaultTempo: 118,
      sequencerLimit: 60,
      lessonSongs: ['twinkle','mary_lamb','london_bridge','frere_jacques','retro_02','space_lullaby'],
      skin: 'white-red',
      hasLessonLights: true, hasDemoMode: true,
      description: 'The P-10 shipped with a bright red case and a sheet of animal stickers. The "Square Bee" voice became iconic. Its 25-key layout was perfect for small hands.',
      rarity: 'COMMON',
      catalogQuote: '"Every child is a musician. Every P-10 is proof."',
      demoSong: 'demo_p10',
    },
    {
      id: 'pocket-p20',
      name: 'Pocket P-20',
      tagline: 'The intermediate performer',
      era: '1985',
      keys: 32,
      octaveStart: 4,
      polyphony: 1,
      voices: ['piano-toy', 'fantasy-bell', 'strings-ensemble', 'harmonica', 'brass-toy', 'flute-air'],
      defaultVoice: 'fantasy-bell',
      rhythms: ['march', 'waltz', '4beat', 'rock1', 'swing', 'bossa', 'cha-cha'],
      defaultRhythm: 'bossa',
      defaultTempo: 100,
      sequencerLimit: 150,
      lessonSongs: ['ode_to_joy','twinkle','frere_jacques','greensleeves','amazing_grace','sakura','retro_01','retro_02','robot_march','tiny_waltz'],
      skin: 'gray-blue',
      hasLessonLights: true, hasDemoMode: true,
      description: 'The P-20 was the first Pocket model with a dedicated Bossa rhythm and 6 voices. It gained a cult following among cassette-culture enthusiasts.',
      rarity: 'UNCOMMON',
      catalogQuote: '"Not just a toy. Not quite a keyboard. Perfectly between."',
      demoSong: 'demo_p20',
    },
    {
      id: 'pocket-p50',
      name: 'Pocket P-50',
      tagline: 'Advanced portable powerhouse',
      era: '1987',
      keys: 37,
      octaveStart: 3,
      polyphony: 3,
      voices: ['piano-bright', 'fantasy-bell', 'strings-ensemble', 'digital-choir', 'brass-toy', 'clarinet-plastic', 'pipe-organ', 'space-pad'],
      defaultVoice: 'piano-bright',
      rhythms: ['march', 'waltz', '4beat', 'rock1', 'rock2', 'swing', 'bossa', 'samba', 'rumba', 'disco-toy', 'slow-ballad', 'cha-cha'],
      defaultRhythm: 'swing',
      defaultTempo: 95,
      sequencerLimit: 300,
      lessonSongs: ['ode_to_joy','twinkle','frere_jacques','greensleeves','amazing_grace','sakura','retro_01','retro_02','robot_march','tiny_waltz','space_lullaby','arcade_tune'],
      skin: 'black-gray',
      hasLessonLights: true, hasDemoMode: true,
      description: 'The flagship. 37 keys, 8 unique voices, 12 rhythms and a 300-note sequencer. Soft polyphony of 3 voices. The only model that can play chords.',
      rarity: 'RARE',
      catalogQuote: '"When you outgrow toys but still want magic."',
      demoSong: 'demo_p50',
    },
    {
      id: 'pocket-vl',
      name: 'Pocket VL',
      tagline: 'Calculator. Synth. Legend.',
      era: '1982',
      keys: 29,
      octaveStart: 4,
      polyphony: 1,
      voices: ['synth-lead', 'synth-bass', 'space-pad', 'glitch-pulse'],
      defaultVoice: 'synth-lead',
      rhythms: ['electro-click', 'disco-toy', 'rock1', 'march'],
      defaultRhythm: 'electro-click',
      defaultTempo: 128,
      sequencerLimit: 100,
      lessonSongs: ['retro_01','retro_02','robot_march','arcade_tune','space_lullaby'],
      skin: 'silver-black',
      hasLessonLights: false, hasDemoMode: true,
      description: 'The VL looked like a calculator and sounded like science fiction. Urban legend says a famous producer used one on a number one hit. The "Synth Bass" cuts through any mix.',
      rarity: 'RARE',
      catalogQuote: '"Calculate the melody. Synthesize the dream."',
      demoSong: 'demo_vl',
    },
    {
      id: 'pocket-sa',
      name: 'Pocket SA-Kid',
      tagline: 'Arcade fun in keyboard form',
      era: '1991',
      keys: 32,
      octaveStart: 4,
      polyphony: 1,
      voices: ['music-box', 'kalimba', 'toy-horn', 'digital-choir', 'fantasy-bell', 'square-bee'],
      defaultVoice: 'music-box',
      rhythms: ['kids-pop', 'disco-toy', 'march', 'rock1', 'swing', 'beguine', 'electro-click'],
      defaultRhythm: 'kids-pop',
      defaultTempo: 120,
      sequencerLimit: 120,
      lessonSongs: ['twinkle','mary_lamb','frere_jacques','london_bridge','robot_march','space_lullaby','arcade_tune','retro_02'],
      skin: 'blue-yellow',
      hasLessonLights: true, hasDemoMode: true,
      description: 'The SA-Kid arrived at the dawn of the 90s with an unmistakable blue-and-yellow shell. The "Digital Choir" patch let children recreate video game music.',
      rarity: 'UNCOMMON',
      catalogQuote: '"Level up your practice. Insert coin. Press any key."',
      demoSong: 'demo_sa',
    }
  ],
  getById(id) { return this.models.find(m => m.id === id); },
  getAll() { return this.models; }
};

/* =========================================
   SONG LIBRARY
   ========================================= */
const SongLibrary = {
  songs: {
    ode_to_joy: { id:'ode_to_joy', title:'Ode to Joy', difficulty:1, tempo:100,
      notes:[{n:'E4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},
             {n:'C4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'E4',d:1.5},{n:'D4',d:0.5},{n:'D4',d:2},
             {n:'E4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},
             {n:'C4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'D4',d:1.5},{n:'C4',d:0.5},{n:'C4',d:2}]},
    twinkle: { id:'twinkle', title:'Twinkle Twinkle', difficulty:1, tempo:110,
      notes:[{n:'C4',d:1},{n:'C4',d:1},{n:'G4',d:1},{n:'G4',d:1},{n:'A4',d:1},{n:'A4',d:1},{n:'G4',d:2},
             {n:'F4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'D4',d:1},{n:'C4',d:2},
             {n:'G4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'D4',d:2},
             {n:'G4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'D4',d:2}]},
    frere_jacques: { id:'frere_jacques', title:'Frère Jacques', difficulty:1, tempo:105,
      notes:[{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'C4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'C4',d:1},
             {n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},
             {n:'G4',d:0.5},{n:'A4',d:0.5},{n:'G4',d:0.5},{n:'F4',d:0.5},{n:'E4',d:1},{n:'C4',d:1},
             {n:'G4',d:0.5},{n:'A4',d:0.5},{n:'G4',d:0.5},{n:'F4',d:0.5},{n:'E4',d:1},{n:'C4',d:1},
             {n:'C4',d:1},{n:'G3',d:1},{n:'C4',d:2},{n:'C4',d:1},{n:'G3',d:1},{n:'C4',d:2}]},
    mary_lamb: { id:'mary_lamb', title:'Mary Had a Little Lamb', difficulty:1, tempo:110,
      notes:[{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'E4',d:2},
             {n:'D4',d:1},{n:'D4',d:1},{n:'D4',d:2},{n:'E4',d:1},{n:'G4',d:1},{n:'G4',d:2},
             {n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'E4',d:1},
             {n:'D4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:4}]},
    london_bridge: { id:'london_bridge', title:'London Bridge', difficulty:1, tempo:115,
      notes:[{n:'G4',d:1},{n:'A4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},
             {n:'D4',d:1},{n:'E4',d:1},{n:'F4',d:2},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},
             {n:'G4',d:1},{n:'A4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},
             {n:'D4',d:1},{n:'G4',d:1},{n:'E4',d:1},{n:'C4',d:1},{n:'C4',d:2}]},
    greensleeves: { id:'greensleeves', title:'Greensleeves', difficulty:2, tempo:76,
      notes:[{n:'A4',d:1},{n:'C5',d:1.5},{n:'D5',d:0.5},{n:'E5',d:1},
             {n:'F5',d:1.5},{n:'E5',d:0.5},{n:'D5',d:1},{n:'B4',d:1.5},{n:'G4',d:0.5},{n:'A4',d:1},
             {n:'A4',d:1.5},{n:'B4',d:0.5},{n:'C5',d:1},{n:'E5',d:1.5},{n:'D5',d:0.5},{n:'C5',d:1},
             {n:'A4',d:1.5},{n:'F4',d:0.5},{n:'G4',d:1},{n:'A4',d:3}]},
    sakura: { id:'sakura', title:'Sakura Sakura', difficulty:2, tempo:72,
      notes:[{n:'A4',d:2},{n:'A4',d:2},{n:'B4',d:2},{n:'A4',d:2},{n:'A4',d:2},{n:'B4',d:2},{n:'A4',d:4},
             {n:'A4',d:2},{n:'C5',d:2},{n:'E5',d:2},{n:'C5',d:2},{n:'A4',d:2},{n:'B4',d:2},{n:'A4',d:4},
             {n:'E5',d:2},{n:'C5',d:2},{n:'A4',d:2},{n:'B4',d:2},{n:'C5',d:2},{n:'B4',d:2},{n:'A4',d:4}]},
    amazing_grace: { id:'amazing_grace', title:'Amazing Grace', difficulty:2, tempo:78,
      notes:[{n:'G4',d:1},{n:'C5',d:1.5},{n:'E5',d:0.5},{n:'C5',d:1},{n:'E5',d:2},{n:'D5',d:1},
             {n:'C5',d:1.5},{n:'A4',d:0.5},{n:'A4',d:1},{n:'G4',d:1},{n:'C5',d:1.5},{n:'E5',d:0.5},{n:'C5',d:1},
             {n:'G5',d:3},{n:'E5',d:1},{n:'G5',d:1.5},{n:'E5',d:0.5},{n:'C5',d:1},
             {n:'E5',d:2},{n:'D5',d:1},{n:'C5',d:1.5},{n:'A4',d:0.5},{n:'G4',d:1},{n:'C5',d:3}]},
    retro_01: { id:'retro_01', title:'Retro Lesson 01', difficulty:1, tempo:100,
      notes:[{n:'C4',d:1},{n:'E4',d:1},{n:'G4',d:1},{n:'E4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:2},
             {n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'C4',d:2},
             {n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'E4',d:1},{n:'G4',d:2}]},
    retro_02: { id:'retro_02', title:'Retro Lesson 02', difficulty:1, tempo:110,
      notes:[{n:'E4',d:1},{n:'G4',d:1},{n:'A4',d:1},{n:'G4',d:1},{n:'E4',d:2},{n:'C4',d:2},
             {n:'D4',d:1},{n:'F4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'D4',d:2},{n:'B3',d:2},
             {n:'C4',d:1},{n:'E4',d:1},{n:'G4',d:1},{n:'A4',d:1},{n:'G4',d:1},{n:'E4',d:1},{n:'C4',d:2}]},
    robot_march: { id:'robot_march', title:'Robot March', difficulty:1, tempo:120,
      notes:[{n:'C4',d:0.5},{n:'C4',d:0.5},{n:'G4',d:1},{n:'G4',d:0.5},{n:'G4',d:0.5},{n:'E4',d:1},{n:'C4',d:1},
             {n:'F4',d:0.5},{n:'F4',d:0.5},{n:'E4',d:1},{n:'D4',d:0.5},{n:'D4',d:0.5},{n:'C4',d:2},
             {n:'G4',d:0.5},{n:'G4',d:0.5},{n:'A4',d:1},{n:'G4',d:0.5},{n:'G4',d:0.5},{n:'F4',d:1},{n:'E4',d:1},
             {n:'D4',d:0.5},{n:'D4',d:0.5},{n:'E4',d:1},{n:'F4',d:0.5},{n:'G4',d:0.5},{n:'C4',d:2}]},
    tiny_waltz: { id:'tiny_waltz', title:'Tiny Waltz', difficulty:2, tempo:88,
      notes:[{n:'C4',d:1},{n:'E4',d:1},{n:'G4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},
             {n:'D4',d:1},{n:'F4',d:1},{n:'A4',d:1},{n:'G4',d:3},
             {n:'A4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},
             {n:'G3',d:1},{n:'B3',d:1},{n:'D4',d:1},{n:'C4',d:3}]},
    space_lullaby: { id:'space_lullaby', title:'Space Lullaby', difficulty:1, tempo:68,
      notes:[{n:'A4',d:2},{n:'G4',d:1},{n:'E4',d:1},{n:'F4',d:2},{n:'D4',d:2},
             {n:'E4',d:2},{n:'C4',d:1},{n:'D4',d:1},{n:'C4',d:4},
             {n:'G4',d:2},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:2},{n:'C4',d:2},
             {n:'E4',d:2},{n:'D4',d:1},{n:'C4',d:1},{n:'C4',d:4}]},
    arcade_tune: { id:'arcade_tune', title:'Arcade Tune', difficulty:3, tempo:130,
      notes:[{n:'C5',d:0.5},{n:'E5',d:0.5},{n:'G5',d:0.5},{n:'C5',d:0.5},{n:'B4',d:0.5},{n:'G4',d:0.5},{n:'E4',d:0.5},{n:'C4',d:0.5},
             {n:'D4',d:0.5},{n:'F4',d:0.5},{n:'A4',d:0.5},{n:'D5',d:0.5},{n:'C5',d:0.5},{n:'A4',d:0.5},{n:'F4',d:0.5},{n:'D4',d:0.5},
             {n:'E4',d:0.5},{n:'G4',d:0.5},{n:'B4',d:0.5},{n:'E5',d:0.5},{n:'D5',d:0.5},{n:'B4',d:0.5},{n:'G4',d:0.5},{n:'E4',d:0.5},
             {n:'G4',d:1},{n:'E4',d:1},{n:'C4',d:2}]},
    // Demos — per model
    demo_p1: { id:'demo_p1', title:'P-1 Demo', difficulty:0, tempo:108,
      notes:[{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},{n:'E4',d:1},{n:'C4',d:1},
             {n:'D4',d:2},{n:'G4',d:2},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:4}]},
    demo_p10: { id:'demo_p10', title:'P-10 Demo', difficulty:0, tempo:120,
      notes:[{n:'C4',d:0.5},{n:'E4',d:0.5},{n:'G4',d:1},{n:'E4',d:0.5},{n:'C4',d:0.5},{n:'G4',d:2},
             {n:'A4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:3}]},
    demo_p20: { id:'demo_p20', title:'P-20 Demo', difficulty:0, tempo:100,
      notes:[{n:'E4',d:1},{n:'G4',d:1},{n:'B4',d:1},{n:'G4',d:1},{n:'E4',d:2},
             {n:'F4',d:1},{n:'A4',d:1},{n:'C5',d:1},{n:'A4',d:1},{n:'F4',d:2},
             {n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:2}]},
    demo_p50: { id:'demo_p50', title:'P-50 Demo', difficulty:0, tempo:92,
      notes:[{n:'C4',d:0.5},{n:'E4',d:0.5},{n:'G4',d:0.5},{n:'B4',d:0.5},{n:'C5',d:1},{n:'B4',d:0.5},{n:'G4',d:0.5},
             {n:'E4',d:1},{n:'D4',d:0.5},{n:'F4',d:0.5},{n:'A4',d:0.5},{n:'C5',d:0.5},{n:'B4',d:2},
             {n:'G4',d:1},{n:'E4',d:1},{n:'C4',d:2}]},
    demo_vl: { id:'demo_vl', title:'VL Demo', difficulty:0, tempo:132,
      notes:[{n:'C4',d:0.5},{n:'C4',d:0.5},{n:'G4',d:1},{n:'G4',d:0.5},{n:'F4',d:0.5},{n:'E4',d:1},{n:'D4',d:1},
             {n:'C4',d:0.5},{n:'E4',d:0.5},{n:'G4',d:1},{n:'A4',d:0.5},{n:'G4',d:0.5},{n:'F4',d:1},{n:'E4',d:1},{n:'C4',d:2}]},
    demo_sa: { id:'demo_sa', title:'SA-Kid Demo', difficulty:0, tempo:124,
      notes:[{n:'E4',d:0.5},{n:'E4',d:0.5},{n:'G4',d:1},{n:'A4',d:0.5},{n:'G4',d:0.5},{n:'E4',d:1},
             {n:'C4',d:0.5},{n:'D4',d:0.5},{n:'E4',d:1},{n:'F4',d:0.5},{n:'G4',d:0.5},{n:'A4',d:1},
             {n:'G4',d:0.5},{n:'F4',d:0.5},{n:'E4',d:2}]},
  },
  get(id) { return this.songs[id] || null; }
};

/* =========================================
   STORAGE
   ========================================= */
const Storage = {
  KEY: 'pockettone_v2',
  save(data) { try { localStorage.setItem(this.KEY, JSON.stringify(data)); } catch(e) {} },
  load() { try { const d = localStorage.getItem(this.KEY); return d ? JSON.parse(d) : null; } catch(e) { return null; } },
};

/* =========================================
   AUDIO ENGINE — WebAudio-clock scheduled
   ========================================= */
const AudioEngine = {
  ctx: null,
  masterGain: null,
  comp: null,
  activeNodes: {}, // note -> {gain, oscs, vibratoOsc}
  settings: { masterVol:.8, sustainPct:.3, lofiPct:.4, vibratoPct:.2, tuneCents:0, driftPct:.2, filterCutoff:.7 },

  VOICE: {
    // Piano family
    'piano-toy':    { osc:[{t:'triangle',d:0,g:.8},{t:'sine',d:7,g:.35}],          A:.004,D:.12,S:.25,R:.7,  fHz:3500,fQ:1, vRate:5,  vAmt:0,   lofiMul:1   },
    'piano-bright': { osc:[{t:'triangle',d:0,g:.75},{t:'sine',d:7,g:.4},{t:'sine',d:12,g:.15}], A:.003,D:.1,S:.3,R:.6,  fHz:5000,fQ:.8,vRate:5,  vAmt:0,   lofiMul:.8  },
    // Flute/winds
    'flute-air':    { osc:[{t:'sine',d:0,g:.8},{t:'sine',d:1200,g:.08}],            A:.07,D:.04,S:.75,R:.4,  fHz:4500,fQ:1, vRate:5,  vAmt:8,   noise:.1    },
    'harmonica':    { osc:[{t:'sawtooth',d:0,g:.6},{t:'square',d:7,g:.3},{t:'sawtooth',d:-5,g:.25}], A:.02,D:.06,S:.7,R:.25, fHz:2000,fQ:2, vRate:6,  vAmt:10,  lofiMul:1.2 },
    'toy-horn':     { osc:[{t:'square',d:0,g:.5},{t:'sawtooth',d:5,g:.4}],          A:.04,D:.1, S:.65,R:.2,  fHz:1800,fQ:3, vRate:5.5,vAmt:6                },
    // Strings
    'violin-soft':  { osc:[{t:'sawtooth',d:0,g:.65},{t:'sawtooth',d:5,g:.3}],      A:.09,D:.08,S:.7, R:.5,  fHz:2500,fQ:2, vRate:5.5,vAmt:10               },
    'strings-ensemble': { osc:[{t:'sawtooth',d:0,g:.5},{t:'sawtooth',d:3,g:.4},{t:'sawtooth',d:-4,g:.35}], A:.18,D:.1,S:.75,R:.8, fHz:2200,fQ:1.5,vRate:4.5,vAmt:12 },
    // Bells/box
    'fantasy-bell': { osc:[{t:'sine',d:0,g:1},{t:'sine',d:1200,g:.3},{t:'sine',d:2700,g:.08}], A:.001,D:.35,S:.15,R:1.5, fHz:7000,fQ:.5,vRate:6,  vAmt:3               },
    'music-box':    { osc:[{t:'sine',d:0,g:.9},{t:'sine',d:2400,g:.12},{t:'triangle',d:3600,g:.05}], A:.001,D:.45,S:.04,R:.9, fHz:8000,fQ:.5,vRate:6, vAmt:0 },
    'kalimba':      { osc:[{t:'sine',d:0,g:.9},{t:'sine',d:1900,g:.2},{t:'sine',d:2800,g:.06}], A:.001,D:.5,S:.02,R:1.2, fHz:9000,fQ:.3,vRate:7, vAmt:2 },
    // Organ/brass
    'organ-mini':   { osc:[{t:'square',d:0,g:.55},{t:'square',d:1200,g:.3},{t:'square',d:1900,g:.1}], A:.005,D:.01,S:.9,R:.06, fHz:2000,fQ:.5,vRate:6, vAmt:4 },
    'brass-toy':    { osc:[{t:'sawtooth',d:0,g:.75},{t:'square',d:-5,g:.3}],        A:.055,D:.18,S:.6, R:.28, fHz:2200,fQ:2.5,vRate:5, vAmt:4               },
    'clarinet-plastic': { osc:[{t:'square',d:0,g:.75},{t:'sine',d:1200,g:.2}],     A:.04,D:.1, S:.7, R:.35, fHz:2800,fQ:1.5,vRate:5.5,vAmt:6              },
    'pipe-organ':   { osc:[{t:'square',d:0,g:.5},{t:'square',d:1200,g:.35},{t:'square',d:1900,g:.2},{t:'square',d:2400,g:.1}], A:.02,D:.01,S:.95,R:.12, fHz:3000,fQ:.8,vRate:7,vAmt:5 },
    'digital-choir':{ osc:[{t:'sine',d:0,g:.55},{t:'sine',d:-5,g:.45},{t:'sine',d:1200,g:.2}], A:.2,D:.1,S:.8,R:.7, fHz:3500,fQ:1, vRate:4.5,vAmt:8 },
    // Synth
    'synth-lead':   { osc:[{t:'sawtooth',d:0,g:.7},{t:'sawtooth',d:7,g:.4},{t:'square',d:-1200,g:.2}], A:.01,D:.1,S:.7,R:.3, fHz:1800,fQ:4, vRate:7, vAmt:3 },
    'synth-bass':   { osc:[{t:'sawtooth',d:0,g:.8},{t:'sine',d:-1200,g:.5}],       A:.005,D:.15,S:.5,R:.18, fHz:800,fQ:5,  vRate:0, vAmt:0               },
    'space-pad':    { osc:[{t:'sawtooth',d:0,g:.4},{t:'sawtooth',d:7,g:.35},{t:'sine',d:600,g:.3}], A:.35,D:.2,S:.7,R:1.4, fHz:1000,fQ:5, vRate:3, vAmt:12 },
    'glitch-pulse': { osc:[{t:'square',d:0,g:.6},{t:'square',d:1199,g:.3}],        A:.002,D:.05,S:.6,R:.1,  fHz:1400,fQ:6, vRate:9, vAmt:5               },
    // Square/toy
    'square-bee':   { osc:[{t:'square',d:0,g:.65},{t:'square',d:1200,g:.3}],       A:.005,D:.08,S:.6, R:.2,  fHz:1500,fQ:1, vRate:8, vAmt:3               },
  },

  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.settings.masterVol;
    this.comp = this.ctx.createDynamicsCompressor();
    this.comp.threshold.value = -20; this.comp.ratio.value = 4;
    this.masterGain.connect(this.comp);
    this.comp.connect(this.ctx.destination);
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  noteToHz(noteStr, octaveShift = 0) {
    const SEMI = {C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
    const m = noteStr.match(/^([A-G][#b]?)(\d)$/);
    if (!m) return 440;
    const semi = SEMI[m[1]] ?? 0;
    const oct = parseInt(m[2]) + octaveShift;
    const midi = (oct + 1) * 12 + semi;
    const drift = (Math.random() - .5) * this.settings.driftPct * 0.12;
    return 440 * Math.pow(2, (midi - 69 + this.settings.tuneCents/100 + drift) / 12);
  },

  playNote(noteStr, voiceId, poly = 1, vel = 1, octShift = 0) {
    if (!this.ctx) return;
    this.resume();
    const vp = this.VOICE[voiceId] || this.VOICE['piano-toy'];
    if (poly === 1) this._killAll();
    else if (this.activeNodes[noteStr]) this._killNote(noteStr);

    const now = this.ctx.currentTime;
    const freq = this.noteToHz(noteStr, octShift);
    const s = this.settings;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(vel * .7, now + vp.A);
    gainNode.gain.linearRampToValueAtTime(vp.S * vel * .7, now + vp.A + vp.D);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoffScale = (s.filterCutoff ?? .7);
    const lofiScale = 1 - s.lofiPct * .5;
    filter.frequency.value = Math.min(20000, (vp.fHz ?? 3000) * cutoffScale * lofiScale * (vp.lofiMul ?? 1));
    filter.Q.value = vp.fQ ?? 1;

    const vibratoOsc = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibratoOsc.frequency.value = vp.vRate ?? 5;
    vibratoGain.gain.value = (vp.vAmt ?? 0) * s.vibratoPct;
    vibratoOsc.connect(vibratoGain);
    vibratoOsc.start(now);

    const oscs = [];
    for (const mix of (vp.osc ?? [])) {
      const osc = this.ctx.createOscillator();
      osc.type = mix.t;
      osc.frequency.value = freq * Math.pow(2, (mix.d || 0) / 1200);
      vibratoGain.connect(osc.frequency);
      const g2 = this.ctx.createGain();
      g2.gain.value = mix.g ?? 1;
      osc.connect(g2); g2.connect(filter);
      osc.start(now);
      oscs.push(osc);
    }

    if (vp.noise) {
      const sr = this.ctx.sampleRate;
      const buf = this.ctx.createBuffer(1, sr * .4, sr);
      const dat = buf.getChannelData(0);
      for (let i = 0; i < dat.length; i++) dat[i] = Math.random()*2-1;
      const ns = this.ctx.createBufferSource();
      ns.buffer = buf; ns.loop = true;
      const ng = this.ctx.createGain();
      ng.gain.value = vp.noise;
      ns.connect(ng); ng.connect(filter);
      ns.start(now);
      oscs.push(ns);
    }

    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    this.activeNodes[noteStr] = { gainNode, filter, oscs, vibratoOsc, vibratoGain, vp };
  },

  stopNote(noteStr, voiceId) {
    const nd = this.activeNodes[noteStr];
    if (!nd || !this.ctx) return;
    delete this.activeNodes[noteStr];
    const vp = nd.vp || this.VOICE[voiceId] || this.VOICE['piano-toy'];
    const now = this.ctx.currentTime;
    const rel = vp.R + this.settings.sustainPct * .6;
    nd.gainNode.gain.cancelScheduledValues(now);
    nd.gainNode.gain.setValueAtTime(nd.gainNode.gain.value, now);
    nd.gainNode.gain.linearRampToValueAtTime(0, now + rel);
    const stop = now + rel + .05;
    nd.oscs.forEach(o => { try { o.stop(stop); } catch(e){} });
    try { nd.vibratoOsc.stop(stop); } catch(e){}
  },

  _killNote(noteStr) {
    const nd = this.activeNodes[noteStr];
    if (!nd || !this.ctx) return;
    delete this.activeNodes[noteStr];
    const now = this.ctx.currentTime;
    nd.gainNode.gain.cancelScheduledValues(now);
    nd.gainNode.gain.setValueAtTime(0, now + .02);
    nd.oscs.forEach(o => { try { o.stop(now + .03); } catch(e){} });
    try { nd.vibratoOsc.stop(now + .03); } catch(e){}
  },

  _killAll() {
    const keys = Object.keys(this.activeNodes);
    keys.forEach(k => this._killNote(k));
  },

  stopAllNotes() { this._killAll(); },

  playError() {
    if (!this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'square'; osc.frequency.value = 160;
    g.gain.setValueAtTime(.12, now);
    g.gain.linearRampToValueAtTime(0, now+.14);
    osc.connect(g); g.connect(this.masterGain);
    osc.start(now); osc.stop(now+.15);
  },

  playSuccess() {
    if (!this.ctx) return;
    this.resume();
    [880,1108,1319].forEach((f,i) => {
      const now = this.ctx.currentTime + i*.08;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = f;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(.14, now+.02);
      g.gain.linearRampToValueAtTime(0, now+.28);
      osc.connect(g); g.connect(this.masterGain);
      osc.start(now); osc.stop(now+.3);
    });
  }
};

/* =========================================
   RHYTHM ENGINE — AudioContext clock scheduler
   No setTimeout drift: uses ctx.currentTime lookahead
   ========================================= */
const RhythmEngine = {
  PATTERNS: {
    march:       { sig:4, steps:8,  bpm:120, tracks:{ kick:[1,0,0,0,1,0,0,0], snare:[0,0,1,0,0,0,1,0], hihat:[1,1,1,1,1,1,1,1] }},
    waltz:       { sig:3, steps:6,  bpm:100, tracks:{ kick:[1,0,0,1,0,0], snare:[0,1,0,0,1,0], hihat:[1,0,1,1,0,1], clave:[1,0,0,0,1,0] }},
    '4beat':     { sig:4, steps:16, bpm:110, tracks:{ kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0] }},
    rock1:       { sig:4, steps:16, bpm:128, tracks:{ kick:[1,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], tom:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1] }},
    rock2:       { sig:4, steps:16, bpm:140, tracks:{ kick:[1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], tom:[0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0] }},
    swing:       { sig:4, steps:12, bpm:104, tracks:{ kick:[1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,1,0,0,0,1,0,0,0,1,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0], blip:[0,0,0,1,0,0,0,1,0,0,0,1] }},
    bossa:       { sig:4, steps:16, bpm:100, tracks:{ kick:[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clave:[1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0] }},
    samba:       { sig:2, steps:16, bpm:122, tracks:{ kick:[1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0], snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], clave:[1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,0] }},
    rumba:       { sig:4, steps:16, bpm:100, tracks:{ kick:[1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0], snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clave:[1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0] }},
    'disco-toy': { sig:4, steps:16, bpm:124, tracks:{ kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], clap:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], blip:[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1] }},
    'slow-ballad':{ sig:4,steps:8,  bpm:64,  tracks:{ kick:[1,0,0,0,1,0,0,0], snare:[0,0,1,0,0,0,1,0], hihat:[1,0,1,0,1,0,1,0], clap:[0,0,1,0,0,0,1,0] }},
    'cha-cha':   { sig:4, steps:16, bpm:108, tracks:{ kick:[1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], clave:[0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0] }},
    beguine:     { sig:4, steps:16, bpm:104, tracks:{ kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], hihat:[1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1], clave:[1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0] }},
    'electro-click':{ sig:4,steps:16,bpm:134,tracks:{ kick:[1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0], snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], blip:[0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1], clave:[1,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0] }},
    'kids-pop':  { sig:4, steps:8,  bpm:116, tracks:{ kick:[1,0,0,0,1,0,0,0], snare:[0,0,1,0,0,0,1,0], hihat:[1,1,1,1,1,1,1,1], blip:[0,0,0,1,0,0,0,1], clap:[0,1,0,0,0,1,0,0] }},
  },

  running: false,
  currentStep: 0,
  patternId: 'march',
  bpm: 120,
  _raf: null,
  _nextStepTime: 0,
  LOOK_AHEAD: 0.1,
  SCHEDULE_INTERVAL: 50, // ms

  _drumNode(type, when) {
    const ctx = AudioEngine.ctx;
    if (!ctx) return;
    const vol = App.state.masterVol / 100 * 0.48;
    const g = ctx.createGain();
    g.connect(AudioEngine.masterGain);

    if (type === 'kick') {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(160, when);
      o.frequency.exponentialRampToValueAtTime(28, when + .13);
      g.gain.setValueAtTime(vol*.95, when);
      g.gain.exponentialRampToValueAtTime(.001, when + .22);
      o.connect(g); o.start(when); o.stop(when + .23);
    } else if (type === 'snare') {
      const buf = ctx.createBuffer(1, ctx.sampleRate * .16, ctx.sampleRate);
      const d = buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
      const ns = ctx.createBufferSource(); ns.buffer = buf;
      const filt = ctx.createBiquadFilter(); filt.type='bandpass'; filt.frequency.value=1900; filt.Q.value=.8;
      ns.connect(filt); filt.connect(g);
      const o2 = ctx.createOscillator(); o2.type='triangle'; o2.frequency.value=188;
      const g2 = ctx.createGain(); g2.gain.setValueAtTime(vol*.28, when); g2.gain.linearRampToValueAtTime(0, when+.1);
      o2.connect(g2); g2.connect(AudioEngine.masterGain);
      g.gain.setValueAtTime(vol*.52, when); g.gain.exponentialRampToValueAtTime(.001, when+.2);
      ns.start(when); ns.stop(when+.22); o2.start(when); o2.stop(when+.12);
    } else if (type === 'hihat') {
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate*.065), ctx.sampleRate);
      const d = buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
      const ns = ctx.createBufferSource(); ns.buffer = buf;
      const filt = ctx.createBiquadFilter(); filt.type='highpass'; filt.frequency.value=6500;
      ns.connect(filt); filt.connect(g);
      g.gain.setValueAtTime(vol*.32, when); g.gain.exponentialRampToValueAtTime(.001, when+.065);
      ns.start(when); ns.stop(when+.07);
    } else if (type === 'clap') {
      const o = ctx.createOscillator(); o.type='square'; o.frequency.value=1300;
      const filt = ctx.createBiquadFilter(); filt.type='bandpass'; filt.frequency.value=1400; filt.Q.value=2.5;
      o.connect(filt); filt.connect(g);
      g.gain.setValueAtTime(vol*.42, when); g.gain.exponentialRampToValueAtTime(.001, when+.07);
      o.start(when); o.stop(when+.08);
    } else if (type === 'clave') {
      const o = ctx.createOscillator(); o.type='square'; o.frequency.value=920;
      const filt = ctx.createBiquadFilter(); filt.type='bandpass'; filt.frequency.value=920; filt.Q.value=4;
      o.connect(filt); filt.connect(g);
      g.gain.setValueAtTime(vol*.38, when); g.gain.exponentialRampToValueAtTime(.001, when+.055);
      o.start(when); o.stop(when+.06);
    } else if (type === 'tom') {
      const o = ctx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(82, when);
      o.frequency.exponentialRampToValueAtTime(44, when+.18);
      g.gain.setValueAtTime(vol*.62, when); g.gain.exponentialRampToValueAtTime(.001, when+.22);
      o.connect(g); o.start(when); o.stop(when+.24);
    } else if (type === 'blip') {
      const o = ctx.createOscillator(); o.type='square'; o.frequency.value=1500;
      g.gain.setValueAtTime(vol*.22, when); g.gain.exponentialRampToValueAtTime(.001, when+.04);
      o.connect(g); o.start(when); o.stop(when+.045);
    }
  },

  start(patternId, bpm) {
    this.stop();
    this.patternId = patternId;
    this.bpm = bpm;
    this.currentStep = 0;
    this.running = true;
    if (AudioEngine.ctx) this._nextStepTime = AudioEngine.ctx.currentTime + .05;
    this._schedule();
  },

  stop() {
    this.running = false;
    if (this._raf) { clearTimeout(this._raf); this._raf = null; }
    this.currentStep = 0;
    UI.updateBeatLeds(-1);
  },

  _schedule() {
    if (!this.running || !AudioEngine.ctx) return;
    const pat = this.PATTERNS[this.patternId];
    if (!pat) { this.stop(); return; }
    const stepSec = (60 / this.bpm) / (pat.steps / pat.sig);
    const ctx = AudioEngine.ctx;

    while (this._nextStepTime < ctx.currentTime + this.LOOK_AHEAD) {
      const step = this.currentStep % pat.steps;
      const when = this._nextStepTime;
      for (const [track, arr] of Object.entries(pat.tracks)) {
        if (arr[step]) this._drumNode(track, when);
      }
      // schedule UI beat update
      const beatIdx = Math.floor(step / (pat.steps / pat.sig));
      const delay = Math.max(0, (when - ctx.currentTime) * 1000);
      setTimeout(() => { if (this.running) UI.updateBeatLeds(beatIdx); }, delay);
      this.currentStep = (step + 1) % pat.steps;
      this._nextStepTime += stepSec;
    }
    this._raf = setTimeout(() => this._schedule(), this.SCHEDULE_INTERVAL);
  }
};

/* =========================================
   SEQUENCER ENGINE
   ========================================= */
const SequencerEngine = {
  recording: false,
  playing: false,
  looping: false,
  sequence: [],
  _recStart: null,
  _playTimers: [],

  get limit() { return ModelRegistry.getById(App.state.modelId)?.sequencerLimit || 100; },

  startRec() {
    this.stopPlay();
    this.sequence = [];
    this.recording = true;
    this._recStart = performance.now();
    UI.setMode('● REC');
    UI.toast('● Recording — play notes');
  },

  stopRec() {
    this.recording = false;
    UI.setMode('STOP');
    UI.refreshSeqCounter();
    App.autosave();
    UI.toast(`Recorded ${this.sequence.length} notes`);
  },

  addNote(note, durationSec) {
    if (!this.recording) return;
    if (this.sequence.length >= this.limit) { UI.toast('Memory full!'); return; }
    const ts = performance.now() - this._recStart;
    this.sequence.push({ note, duration: durationSec, ts, voice: App.state.voiceId, vel: .8 + Math.random()*.2 });
    UI.refreshSeqCounter();
  },

  play() {
    if (!this.sequence.length) { UI.toast('Nothing recorded'); return; }
    this.stopPlay();
    this.playing = true;
    UI.setMode('▶ PLAY');
    AudioEngine.resume();
    const go = () => {
      const base = this.sequence[0].ts;
      this.sequence.forEach(ev => {
        const t = setTimeout(() => {
          if (!this.playing) return;
          AudioEngine.playNote(ev.note, ev.voice || App.state.voiceId, 1, ev.vel || 1, App.state.octaveShift);
          const k = document.querySelector(`.key[data-note="${ev.note}"]`);
          if (k) { k.classList.add('pressed'); setTimeout(() => k.classList.remove('pressed'), (ev.duration||.3)*1000); }
          setTimeout(() => AudioEngine.stopNote(ev.note, ev.voice || App.state.voiceId), (ev.duration||.3)*1000);
        }, ev.ts - base);
        this._playTimers.push(t);
      });
      const last = this.sequence.at(-1);
      const total = (last.ts - base) + (last.duration||.3)*1000 + 300;
      const end = setTimeout(() => {
        if (this.looping && this.playing) go(); else this.stopPlay();
      }, total);
      this._playTimers.push(end);
    };
    go();
  },

  stopPlay() {
    this.playing = false;
    this._playTimers.forEach(t => clearTimeout(t));
    this._playTimers = [];
    if (!this.recording) UI.setMode('STOP');
    document.getElementById('btn-play').classList.remove('playing');
  },

  clear() {
    this.stopPlay();
    if (this.recording) this.stopRec();
    this.sequence = [];
    UI.refreshSeqCounter();
    UI.toast('Sequence cleared');
  },

  toggleLoop() {
    this.looping = !this.looping;
    document.getElementById('btn-loop').classList.toggle('looping', this.looping);
    UI.toast(this.looping ? '↺ Loop ON' : '↺ Loop OFF');
  },

  toJSON() {
    return { app:'PocketTone Archive Pro', version:'2.0.0', model:App.state.modelId, skin:App.state.skin, tempo:App.state.bpm, voice:App.state.voiceId, rhythm:App.state.rhythmId, sequence:this.sequence };
  },

  fromJSON(obj) {
    if (!obj?.sequence) return false;
    this.sequence = obj.sequence;
    UI.refreshSeqCounter();
    return true;
  }
};

/* =========================================
   KEYBOARD ENGINE
   ========================================= */
const KeyboardEngine = {
  CHROMATIC: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
  IS_BLACK:  [false,true,false,true,false,false,true,false,true,false,true,false],
  KB_LOW:  {z:'C4',s:'C#4',x:'D4',d:'D#4',c:'E4',v:'F4',g:'F#4',b:'G4',h:'G#4',n:'A4',j:'A#4',m:'B4'},
  KB_HIGH: {q:'C5','2':'C#5',w:'D5','3':'D#5',e:'E5',r:'F5','5':'F#5',t:'G5','6':'G#5',y:'A5','7':'A#5',u:'B5',i:'C6','9':'C#6',o:'D6','0':'D#6',p:'E6'},
  keysDown: new Set(),
  noteArray: [],

  get KB_MAP() { return {...this.KB_LOW, ...this.KB_HIGH}; },

  _noteIsBlack(noteStr) {
    const name = noteStr.replace(/\d+$/,'');
    const idx = this.CHROMATIC.indexOf(name);
    return idx >= 0 && this.IS_BLACK[idx];
  },

  buildNoteArray(model) {
    const arr = [];
    let oct = model.octaveStart, idx = 0;
    while (arr.length < model.keys) {
      arr.push(`${this.CHROMATIC[idx]}${oct}`);
      idx++;
      if (idx >= 12) { idx = 0; oct++; }
    }
    return arr;
  },

  render(model) {
    const container = document.getElementById('keyboard-container');
    const lightsRow = document.getElementById('lesson-lights-row');
    this.noteArray = this.buildNoteArray(model);
    container.innerHTML = ''; lightsRow.innerHTML = '';
    this.keysDown.clear();

    const mobile = window.innerWidth < 640;
    const ww = mobile ? 26 : 34;
    const gap = 1;

    // Count whites
    const whites = this.noteArray.filter(n => !this._noteIsBlack(n));
    const totalW = whites.length * (ww + gap);
    container.style.width = totalW + 'px';
    container.style.height = (mobile ? 88 : 110) + 'px';

    let whiteX = 0;
    this.noteArray.forEach((note, i) => {
      const isBlk = this._noteIsBlack(note);
      const key = document.createElement('div');
      key.className = `key ${isBlk ? 'black' : 'white'}`;
      key.dataset.note = note;

      if (!isBlk) {
        key.style.left = whiteX + 'px';
        // kb label
        const kb = Object.entries(this.KB_MAP).find(([k,v]) => v === note);
        if (kb) {
          const lbl = document.createElement('span');
          lbl.className = 'key-label';
          lbl.textContent = kb[0].toUpperCase();
          key.appendChild(lbl);
        }
        // lesson light
        if (model.hasLessonLights) {
          const light = document.createElement('div');
          light.className = 'lesson-light';
          light.dataset.note = note;
          lightsRow.appendChild(light);
        }
        whiteX += ww + gap;
      } else {
        key.style.left = (whiteX - Math.floor((mobile?16:21)/2)) + 'px';
      }

      // Mouse/touch
      const pressHandler = e => { e.preventDefault(); this.pressKey(note); };
      const releaseHandler = e => { e.preventDefault(); this.releaseKey(note); };
      key.addEventListener('mousedown', pressHandler);
      key.addEventListener('mouseenter', e => { if (e.buttons === 1) this.pressKey(note); });
      key.addEventListener('mouseup', releaseHandler);
      key.addEventListener('mouseleave', releaseHandler);
      key.addEventListener('touchstart', pressHandler, {passive:false});
      key.addEventListener('touchend', releaseHandler, {passive:false});
      key.addEventListener('touchcancel', releaseHandler, {passive:false});

      container.appendChild(key);
    });
  },

  pressKey(note) {
    if (this.keysDown.has(note)) return;
    this.keysDown.add(note);
    const model = ModelRegistry.getById(App.state.modelId);
    const poly = App.state.polyphony || model.polyphony;
    AudioEngine.playNote(note, App.state.voiceId, poly, 1, App.state.octaveShift);
    document.querySelector(`.key[data-note="${note}"]`)?.classList.add('pressed');
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (key) key._pressedAt = performance.now();
    if (LessonEngine.active) LessonEngine.handleKey(note);
  },

  releaseKey(note) {
    if (!this.keysDown.has(note)) return;
    this.keysDown.delete(note);
    AudioEngine.stopNote(note, App.state.voiceId);
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (key) {
      key.classList.remove('pressed');
      if (SequencerEngine.recording && key._pressedAt) {
        const dur = (performance.now() - key._pressedAt) / 1000;
        SequencerEngine.addNote(note, Math.max(.05, dur));
        delete key._pressedAt;
      }
    }
  },

  releaseAll() {
    [...this.keysDown].forEach(n => this.releaseKey(n));
  },

  attachKeyboard() {
    document.addEventListener('keydown', e => {
      if (e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.repeat) return;
      const note = this.KB_MAP[e.key.toLowerCase()];
      if (note) { e.preventDefault(); this.pressKey(note); return; }
      if (e.key === '[' || e.key === ',') { e.preventDefault(); App.octaveDown(); }
      if (e.key === ']' || e.key === '.') { e.preventDefault(); App.octaveUp(); }
    });
    document.addEventListener('keyup', e => {
      const note = this.KB_MAP[e.key.toLowerCase()];
      if (note) this.releaseKey(note);
    });
    // kill stuck notes on window blur
    window.addEventListener('blur', () => this.releaseAll());
  }
};

/* =========================================
   LESSON ENGINE
   ========================================= */
const LessonEngine = {
  active: false,
  mode: 'watch',
  song: null,
  noteIdx: 0,
  score: 0,
  errors: 0,
  _watchTimers: [],
  _startMs: 0,

  MODE_DESC: {
    watch:     'WATCH: app plays the song and lights the keys. Just listen.',
    slow:      'SLOW: same as Watch but at half tempo.',
    follow:    'FOLLOW: light stays until you press the right key. No time limit.',
    practice:  'PRACTICE: lights guide you but wrong keys don\'t stop progress.',
    challenge: 'CHALLENGE: scored mode. Every error is recorded.',
  },

  load(songId) {
    const song = SongLibrary.get(songId);
    if (!song) return false;
    this.song = song;
    this.noteIdx = 0; this.score = 0; this.errors = 0;
    return true;
  },

  start(mode) {
    if (!this.song) { UI.toast('Select a song first'); return; }
    this.stop();
    this.mode = mode;
    this.active = true;
    this.noteIdx = 0; this.score = 0; this.errors = 0;
    this._startMs = Date.now();
    UI.setMode('LESSON');
    UI.clearLessonLights();

    if (mode === 'watch' || mode === 'slow') {
      this._runWatch(mode === 'slow' ? .5 : 1);
    } else {
      this._lightNext();
    }
  },

  stop() {
    this.active = false;
    this._watchTimers.forEach(t => clearTimeout(t));
    this._watchTimers = [];
    AudioEngine.stopAllNotes();
    UI.clearLessonLights();
    UI.setMode('STOP');
  },

  _lightNext() {
    UI.clearLessonLights();
    if (this.noteIdx >= this.song.notes.length) { this._finish(); return; }
    const n = this.song.notes[this.noteIdx].n;
    UI.lightKey(n, 'target');
  },

  handleKey(note) {
    if (!this.active || this.mode === 'watch' || this.mode === 'slow') return;
    const expected = this.song.notes[this.noteIdx];
    if (!expected) return;

    if (note === expected.n) {
      this.score += 10;
      UI.clearLessonLights();
      this.noteIdx++;
      if (this.noteIdx >= this.song.notes.length) {
        setTimeout(() => this._finish(), 200);
      } else {
        this._lightNext();
      }
    } else {
      if (this.mode === 'challenge' || this.mode === 'follow') {
        this.errors++;
        AudioEngine.playError();
        UI.flashKey(note, 'wrong');
      } else {
        // practice: advance anyway after flash
        AudioEngine.playError();
        UI.flashKey(note, 'wrong');
      }
    }
    UI.updateLessonHud(this.score, this.noteIdx, this.song.notes.length, this.errors);
  },

  _runWatch(speed) {
    let t = 0;
    const bps = (this.song.tempo * speed) / 60;
    this.song.notes.forEach((nd, i) => {
      const dur = nd.d / bps;
      const noteStart = t;
      const t1 = setTimeout(() => {
        if (!this.active) return;
        UI.clearLessonLights();
        UI.lightKey(nd.n, 'target');
        AudioEngine.playNote(nd.n, App.state.voiceId, 1, .72, App.state.octaveShift);
        const t2 = setTimeout(() => {
          if (!this.active) return;
          AudioEngine.stopNote(nd.n, App.state.voiceId);
          UI.clearLessonLights();
          if (i === this.song.notes.length - 1) { setTimeout(() => this.stop(), 300); }
        }, dur * 1000);
        this._watchTimers.push(t2);
      }, noteStart * 1000);
      this._watchTimers.push(t1);
      t += dur;
    });
  },

  _finish() {
    this.active = false;
    UI.clearLessonLights();
    AudioEngine.playSuccess();
    UI.setMode('STOP');
    const elapsed = (Date.now() - this._startMs) / 1000;
    const total = this.song.notes.length;
    const acc = total > 0 ? Math.round(this.score / (total * 10) * 100) : 100;
    const stars = acc >= 95 ? 3 : acc >= 72 ? 2 : 1;
    UI.showLessonResult(this.score, acc, elapsed, stars);
    const key = `ls_${App.state.modelId}_${this.song.id}`;
    const prev = App.state.lessonProgress[key] || 0;
    if (stars > prev) { App.state.lessonProgress[key] = stars; App.autosave(); }
  }
};

/* =========================================
   DEMO ENGINE
   ========================================= */
const DemoEngine = {
  playing: false,
  _timers: [],

  play(model) {
    this.stop();
    const song = SongLibrary.get(model.demoSong);
    if (!song) return;
    this.playing = true;
    UI.setMode('DEMO');
    UI.lcdMsg('DEMO PLAY ►');
    let t = 0;
    const bps = song.tempo / 60;
    song.notes.forEach((nd, i) => {
      const dur = nd.d / bps;
      const t1 = setTimeout(() => {
        if (!this.playing) return;
        AudioEngine.playNote(nd.n, model.defaultVoice, 1, .75, 0);
        const k = document.querySelector(`.key[data-note="${nd.n}"]`);
        if (k) { k.classList.add('pressed'); }
        const ll = document.querySelector(`.lesson-light[data-note="${nd.n}"]`);
        if (ll) ll.classList.add('lit');
        const t2 = setTimeout(() => {
          AudioEngine.stopNote(nd.n, model.defaultVoice);
          if (k) k.classList.remove('pressed');
          if (ll) ll.classList.remove('lit');
          if (i === song.notes.length - 1) this.stop();
        }, dur * 1000);
        this._timers.push(t2);
      }, t * 1000);
      this._timers.push(t1);
      t += dur;
    });
  },

  stop() {
    this.playing = false;
    this._timers.forEach(t => clearTimeout(t));
    this._timers = [];
    AudioEngine.stopAllNotes();
    document.querySelectorAll('.key.pressed').forEach(k => k.classList.remove('pressed'));
    document.querySelectorAll('.lesson-light.lit').forEach(l => l.classList.remove('lit'));
    UI.setMode('STOP');
    UI.lcdMsg('READY — PRESS A KEY');
    document.getElementById('btn-demo').classList.remove('active');
  }
};

/* =========================================
   SKIN ENGINE
   ========================================= */
const SkinEngine = {
  MODEL_CLASS: { 'cream-gray':'msk-cream-gray','white-red':'msk-white-red','gray-blue':'msk-gray-blue','black-gray':'msk-black-gray','silver-black':'msk-silver-black','blue-yellow':'msk-blue-yellow' },
  apply(skinId, modelSkin) {
    const body = document.body;
    body.className = body.className.replace(/skin-\S+/g,'').replace(/msk-\S+/g,'').trim();
    if (skinId === 'auto') body.classList.add(this.MODEL_CLASS[modelSkin] || 'msk-cream-gray');
    else body.classList.add(`skin-${skinId}`);
  }
};

/* =========================================
   UI MODULE
   ========================================= */
const UI = {
  _toastTimer: null,

  setMode(m) {
    App.state.mode = m;
    document.getElementById('lcd-mode-badge').textContent = m;
  },
  lcdMsg(msg) { document.getElementById('lcd-message').textContent = msg; },

  updateLCD() {
    const m = ModelRegistry.getById(App.state.modelId);
    if (!m) return;
    document.getElementById('lcd-model').textContent = m.name.toUpperCase();
    document.getElementById('lcd-voice').textContent = App.state.voiceId.replace(/-/g,' ').toUpperCase();
    document.getElementById('lcd-rhythm-name').textContent = App.state.rhythmId.replace(/-/g,' ').toUpperCase();
    document.getElementById('lcd-bpm').textContent = `♩${App.state.bpm}`;
    document.getElementById('lcd-octave').textContent = `OCT ${App.state.octaveShift >= 0 ? '+':''}${App.state.octaveShift}`;
    this.refreshSeqCounter();
  },

  refreshSeqCounter() {
    const m = ModelRegistry.getById(App.state.modelId);
    const n = SequencerEngine.sequence.length;
    const lim = m?.sequencerLimit || 100;
    document.getElementById('seq-counter').textContent = `${n} / ${lim} notes`;
    document.getElementById('lcd-memory').textContent = `MEM ${n}/${lim}`;
  },

  updateBeatLeds(beat) {
    for (let i = 0; i < 4; i++) {
      document.getElementById(`beat-${i}`)?.classList.toggle('on', i === beat);
    }
  },

  buildVoiceButtons(model) {
    const c = document.getElementById('voice-buttons');
    c.innerHTML = '';
    model.voices.forEach(v => {
      const btn = document.createElement('button');
      btn.className = 'voice-btn' + (v === App.state.voiceId ? ' active' : '');
      btn.textContent = v.replace(/-/g,' ').toUpperCase();
      btn.addEventListener('click', () => {
        App.state.voiceId = v;
        c.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateLCD();
        App.autosave();
      });
      c.appendChild(btn);
    });
  },

  buildRhythmButtons(model) {
    const c = document.getElementById('rhythm-buttons');
    c.innerHTML = '';
    model.rhythms.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'rhythm-btn' + (r === App.state.rhythmId ? ' active' : '');
      btn.textContent = r.replace(/-/g,' ').toUpperCase();
      btn.addEventListener('click', () => {
        App.state.rhythmId = r;
        c.querySelectorAll('.rhythm-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateLCD();
        if (RhythmEngine.running) RhythmEngine.start(r, App.state.bpm);
        App.autosave();
      });
      c.appendChild(btn);
    });
  },

  buildLessonList(model) {
    const c = document.getElementById('lesson-song-list');
    c.innerHTML = '';
    model.lessonSongs.forEach(sid => {
      const song = SongLibrary.get(sid);
      if (!song) return;
      const prog = App.state.lessonProgress[`ls_${model.id}_${sid}`] || 0;
      const stars = '⭐'.repeat(prog) + '☆'.repeat(3-prog);
      const btn = document.createElement('button');
      btn.className = 'lsong-btn';
      btn.innerHTML = `<b>${song.title}</b><span class="lsong-diff">${'●'.repeat(song.difficulty)}${'○'.repeat(3-song.difficulty)}</span><span class="lsong-stars">${stars}</span>`;
      btn.addEventListener('click', () => {
        c.querySelectorAll('.lsong-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (LessonEngine.load(sid)) this.lcdMsg(`♪ ${song.title.toUpperCase()}`);
        document.getElementById('lesson-result').classList.add('hidden');
      });
      c.appendChild(btn);
    });
  },

  buildMuseum() {
    const c = document.getElementById('museum-content');
    c.innerHTML = '';
    ModelRegistry.getAll().forEach(model => {
      const div = document.createElement('div');
      div.className = 'museum-card' + (model.id === App.state.modelId ? ' active-model' : '');
      const rCol = {COMMON:'#5a9050',UNCOMMON:'#5070b0',RARE:'#a05820'}[model.rarity] || '#888';
      div.innerHTML = `
        <h3>${model.name} <span class="m-rarity" style="color:${rCol}">${model.rarity}</span></h3>
        <div class="m-year">${model.era} — ${model.tagline}</div>
        <div class="m-specs">
          <span>Keys: <b>${model.keys}</b></span><span>Polyphony: <b>${model.polyphony}v</b></span>
          <span>Memory: <b>${model.sequencerLimit} notes</b></span><span>Voices: <b>${model.voices.length}</b></span>
          <span>Rhythms: <b>${model.rhythms.length}</b></span><span>Lessons: <b>${model.lessonSongs.length} songs</b></span>
        </div>
        <div class="m-desc">${model.description}</div>
        <div class="m-quote">${model.catalogQuote}</div>
      `;
      div.addEventListener('click', () => {
        App.loadModel(model.id);
        document.getElementById('modal-museum').classList.add('hidden');
      });
      c.appendChild(div);
    });
  },

  updateLessonHud(score, cur, total, errors) {
    document.getElementById('lesson-result').classList.add('hidden');
  },

  showLessonResult(score, acc, elapsed, stars) {
    const r = document.getElementById('lesson-result');
    r.classList.remove('hidden');
    document.getElementById('lesson-stars-display').textContent = '⭐'.repeat(stars) + '☆'.repeat(3-stars);
    document.getElementById('lesson-result-details').innerHTML =
      `Score: ${score} pts · Accuracy: ${acc}% · Time: ${elapsed.toFixed(1)}s`;
  },

  clearLessonLights() {
    document.querySelectorAll('.lesson-light').forEach(l => l.classList.remove('lit','wrong'));
    document.querySelectorAll('.key').forEach(k => k.classList.remove('lesson-target','lesson-wrong'));
  },

  lightKey(noteStr, type) {
    const key = document.querySelector(`.key[data-note="${noteStr}"]`);
    if (key) key.classList.add(type === 'target' ? 'lesson-target' : 'lesson-wrong');
    const light = document.querySelector(`.lesson-light[data-note="${noteStr}"]`);
    if (light) light.classList.add(type === 'target' ? 'lit' : 'wrong');
  },

  flashKey(noteStr, type) {
    this.lightKey(noteStr, type);
    setTimeout(() => {
      document.querySelector(`.key[data-note="${noteStr}"]`)?.classList.remove('lesson-wrong');
      document.querySelector(`.lesson-light[data-note="${noteStr}"]`)?.classList.remove('wrong');
    }, 380);
  },

  refreshSlotButtons() {
    document.querySelectorAll('.slot-btn').forEach(btn => {
      const slot = +btn.dataset.slot;
      const hasData = !!App.state.slots[slot];
      btn.classList.toggle('has-data', hasData);
      const label = hasData ? `SL${slot+1} ●` : `SL${slot+1} —`;
      btn.textContent = label;
      btn.title = hasData ? 'Click = LOAD · Shift+Click = OVERWRITE SAVE' : 'Click = SAVE here';
    });
  },

  toast(msg, ms = 2200) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.add('hidden'), ms);
  },

  bindModals() {
    document.querySelectorAll('.modal-close').forEach(btn => {
      const id = btn.dataset.target;
      btn.addEventListener('click', () => document.getElementById(id)?.classList.add('hidden'));
    });
    document.querySelectorAll('.modal').forEach(m => {
      m.addEventListener('click', e => { if (e.target === m) m.classList.add('hidden'); });
    });
  }
};

/* =========================================
   APP — MAIN CONTROLLER
   ========================================= */
const App = {
  state: {
    modelId: 'pocket-p1',
    skin: 'auto',
    voiceId: 'piano-toy',
    rhythmId: 'march',
    bpm: 108,
    masterVol: 80,
    sustainPct: 30,
    lofiPct: 40,
    vibratoPct: 20,
    tuneCents: 0,
    driftPct: 20,
    filterCutoff: 70,
    polyphony: 1,
    octaveShift: 0,
    currentSlot: 0,
    slots: [null, null, null, null],
    lessonProgress: {},
    mode: 'STOP'
  },

  autosave() { Storage.save(this.state); },

  octaveDown() {
    if (this.state.octaveShift <= -3) return;
    this.state.octaveShift--;
    document.getElementById('oct-display').textContent = (this.state.octaveShift >= 0 ? '+' : '') + this.state.octaveShift;
    document.getElementById('lcd-octave').textContent = `OCT ${this.state.octaveShift >= 0 ? '+' : ''}${this.state.octaveShift}`;
    this.autosave();
  },

  octaveUp() {
    if (this.state.octaveShift >= 3) return;
    this.state.octaveShift++;
    document.getElementById('oct-display').textContent = (this.state.octaveShift >= 0 ? '+' : '') + this.state.octaveShift;
    document.getElementById('lcd-octave').textContent = `OCT ${this.state.octaveShift >= 0 ? '+' : ''}${this.state.octaveShift}`;
    this.autosave();
  },

  init() {
    const saved = Storage.load();
    if (saved) {
      Object.assign(this.state, saved);
      // migrate: if slots were sequences from v1, reset
      if (!Array.isArray(this.state.slots)) this.state.slots = [null,null,null,null];
    }

    AudioEngine.init();

    // Model selector
    const modelSel = document.getElementById('model-select');
    ModelRegistry.getAll().forEach(m => {
      const o = document.createElement('option');
      o.value = m.id; o.textContent = `${m.name} (${m.era})`;
      modelSel.appendChild(o);
    });
    modelSel.value = this.state.modelId;
    modelSel.addEventListener('change', e => this.loadModel(e.target.value));

    // Skin
    document.getElementById('skin-select').value = this.state.skin;
    document.getElementById('skin-select').addEventListener('change', e => {
      this.state.skin = e.target.value;
      SkinEngine.apply(this.state.skin, ModelRegistry.getById(this.state.modelId).skin);
      this.autosave();
    });

    // Volume/FX sliders
    const bindSlider = (id, stateKey, audioFn) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = this.state[stateKey];
      el.addEventListener('input', e => {
        this.state[stateKey] = +e.target.value;
        if (audioFn) audioFn(+e.target.value);
        this.autosave();
      });
    };
    bindSlider('master-vol', 'masterVol', v => AudioEngine.masterGain.gain.value = v/100);
    bindSlider('sustain-ctrl', 'sustainPct', v => AudioEngine.settings.sustainPct = v/100);
    bindSlider('lofi-ctrl', 'lofiPct', v => AudioEngine.settings.lofiPct = v/100);
    bindSlider('vibrato-ctrl', 'vibratoPct', v => AudioEngine.settings.vibratoPct = v/100);

    // Tempo
    const tempoSlider = document.getElementById('tempo-slider');
    const tempoDisplay = document.getElementById('tempo-display');
    tempoSlider.value = this.state.bpm;
    tempoDisplay.textContent = this.state.bpm;
    tempoSlider.addEventListener('input', e => {
      this.state.bpm = +e.target.value;
      tempoDisplay.textContent = this.state.bpm;
      UI.updateLCD();
      if (RhythmEngine.running) RhythmEngine.start(this.state.rhythmId, this.state.bpm);
      this.autosave();
    });

    // Tap tempo
    let lastTap = 0; const taps = [];
    document.getElementById('btn-tap').addEventListener('click', () => {
      const now = Date.now();
      if (lastTap && now - lastTap < 2500) {
        taps.push(now - lastTap);
        if (taps.length > 5) taps.shift();
        const avg = taps.reduce((a,b)=>a+b,0)/taps.length;
        this.state.bpm = Math.max(40, Math.min(240, Math.round(60000/avg)));
        tempoSlider.value = this.state.bpm;
        tempoDisplay.textContent = this.state.bpm;
        UI.updateLCD();
        if (RhythmEngine.running) RhythmEngine.start(this.state.rhythmId, this.state.bpm);
      } else { taps.length = 0; }
      lastTap = now;
    });

    // Rhythm play/stop
    const rhythmPlayBtn = document.getElementById('btn-rhythm-play');
    rhythmPlayBtn.addEventListener('click', () => {
      AudioEngine.resume();
      if (RhythmEngine.running) {
        RhythmEngine.stop();
        rhythmPlayBtn.textContent = '▶ BEAT';
        rhythmPlayBtn.classList.remove('running');
      } else {
        RhythmEngine.start(this.state.rhythmId, this.state.bpm);
        rhythmPlayBtn.textContent = '■ BEAT';
        rhythmPlayBtn.classList.add('running');
      }
    });

    // Sequencer
    document.getElementById('btn-rec').addEventListener('click', () => {
      AudioEngine.resume();
      const recBtn = document.getElementById('btn-rec');
      if (!SequencerEngine.recording) {
        SequencerEngine.startRec();
        recBtn.classList.add('recording');
        document.getElementById('btn-play').classList.remove('playing');
      } else {
        SequencerEngine.stopRec();
        recBtn.classList.remove('recording');
      }
    });
    document.getElementById('btn-play').addEventListener('click', () => {
      AudioEngine.resume();
      const playBtn = document.getElementById('btn-play');
      if (!SequencerEngine.playing) {
        if (SequencerEngine.recording) { SequencerEngine.stopRec(); document.getElementById('btn-rec').classList.remove('recording'); }
        SequencerEngine.play();
        playBtn.classList.add('playing');
      } else {
        SequencerEngine.stopPlay();
        playBtn.classList.remove('playing');
      }
    });
    document.getElementById('btn-stop').addEventListener('click', () => {
      SequencerEngine.stopRec();
      SequencerEngine.stopPlay();
      LessonEngine.stop();
      DemoEngine.stop();
      RhythmEngine.stop();
      rhythmPlayBtn.textContent = '▶ BEAT';
      rhythmPlayBtn.classList.remove('running');
      document.getElementById('btn-rec').classList.remove('recording');
      document.getElementById('btn-play').classList.remove('playing');
      AudioEngine.stopAllNotes();
      KeyboardEngine.releaseAll();
    });
    document.getElementById('btn-clear').addEventListener('click', () => {
      if (SequencerEngine.sequence.length && !confirm('Clear the current sequence?')) return;
      SequencerEngine.clear();
    });
    document.getElementById('btn-loop').addEventListener('click', () => SequencerEngine.toggleLoop());

    // Demo
    document.getElementById('btn-demo').addEventListener('click', () => {
      AudioEngine.resume();
      if (DemoEngine.playing) {
        DemoEngine.stop();
      } else {
        DemoEngine.play(ModelRegistry.getById(this.state.modelId));
        document.getElementById('btn-demo').classList.add('active');
      }
    });

    // Lesson
    document.getElementById('btn-lesson').addEventListener('click', () => {
      const modal = document.getElementById('modal-lesson');
      modal.classList.remove('hidden');
      UI.buildLessonList(ModelRegistry.getById(this.state.modelId));
      document.getElementById('lesson-result').classList.add('hidden');
    });

    document.getElementById('btn-museum-inline').addEventListener('click', () => {
      UI.buildMuseum();
      document.getElementById('modal-museum').classList.remove('hidden');
    });
    document.getElementById('btn-museum').addEventListener('click', () => {
      UI.buildMuseum();
      document.getElementById('modal-museum').classList.remove('hidden');
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      document.getElementById('modal-settings').classList.remove('hidden');
    });
    document.getElementById('btn-help').addEventListener('click', () => {
      this._buildHelpKeymap();
      document.getElementById('modal-help').classList.remove('hidden');
    });

    // Lesson mode buttons
    document.querySelectorAll('.lmode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lmode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        LessonEngine.mode = btn.dataset.mode;
        document.getElementById('lesson-mode-desc').textContent = LessonEngine.MODE_DESC[btn.dataset.mode] || '';
      });
    });
    document.getElementById('btn-lesson-start').addEventListener('click', () => {
      AudioEngine.resume();
      if (!LessonEngine.song) { UI.toast('Select a song first'); return; }
      document.getElementById('modal-lesson').classList.add('hidden');
      document.getElementById('lesson-result').classList.add('hidden');
      LessonEngine.start(LessonEngine.mode);
    });
    document.getElementById('btn-lesson-cancel').addEventListener('click', () => {
      LessonEngine.stop();
      document.getElementById('modal-lesson').classList.add('hidden');
    });

    // Slots: click = SAVE, shift+click = LOAD
    document.querySelectorAll('.slot-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const slot = +btn.dataset.slot;
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active-slot'));
        btn.classList.add('active-slot');
        this.state.currentSlot = slot;
        if (e.shiftKey && this.state.slots[slot]) {
          // LOAD
          SequencerEngine.fromJSON(this.state.slots[slot]);
          UI.toast(`Slot ${slot+1} loaded (Shift+Click to load)`);
        } else {
          // SAVE
          this.state.slots[slot] = SequencerEngine.toJSON();
          UI.toast(`Saved to slot ${slot+1} · Shift+Click to load`);
          this.autosave();
          UI.refreshSlotButtons();
        }
      });
    });

    // Export/Import
    document.getElementById('btn-export').addEventListener('click', () => {
      const data = JSON.stringify(SequencerEngine.toJSON(), null, 2);
      const blob = new Blob([data], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `pockettone_${this.state.modelId}_${Date.now()}.json`;
      a.click(); URL.revokeObjectURL(url);
      UI.toast('Exported as JSON');
    });
    document.getElementById('btn-import').addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.json';
      inp.addEventListener('change', e => {
        const f = e.target.files[0]; if (!f) return;
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            const data = JSON.parse(ev.target.result);
            if (!data.sequence) throw new Error('No sequence data');
            SequencerEngine.fromJSON(data);
            if (data.model && ModelRegistry.getById(data.model)) this.loadModel(data.model, true);
            if (data.tempo) { this.state.bpm = data.tempo; tempoSlider.value = data.tempo; tempoDisplay.textContent = data.tempo; }
            UI.toast('Sequence imported!');
            this.autosave();
          } catch(err) { UI.toast('Import failed: invalid file'); }
        };
        reader.readAsText(f);
      });
      inp.click();
    });

    // Settings modal controls
    document.getElementById('poly-select').addEventListener('change', e => {
      this.state.polyphony = +e.target.value;
      this.autosave();
    });
    const tuneCtrl = document.getElementById('tune-ctrl');
    tuneCtrl.value = this.state.tuneCents;
    tuneCtrl.addEventListener('input', e => {
      this.state.tuneCents = +e.target.value;
      AudioEngine.settings.tuneCents = this.state.tuneCents;
      document.getElementById('tune-display').textContent = e.target.value + '¢';
    });
    document.getElementById('drift-ctrl').value = this.state.driftPct;
    document.getElementById('drift-ctrl').addEventListener('input', e => {
      this.state.driftPct = +e.target.value;
      AudioEngine.settings.driftPct = this.state.driftPct / 100;
      document.getElementById('drift-display').textContent = e.target.value;
    });
    document.getElementById('filter-ctrl').value = this.state.filterCutoff ?? 70;
    document.getElementById('filter-ctrl').addEventListener('input', e => {
      this.state.filterCutoff = +e.target.value;
      AudioEngine.settings.filterCutoff = this.state.filterCutoff / 100;
      document.getElementById('filter-display').textContent = e.target.value;
    });
    document.getElementById('btn-reset').addEventListener('click', () => {
      if (confirm('Reset everything? All sequences and progress will be lost.')) {
        localStorage.clear(); location.reload();
      }
    });

    // Octave shift buttons
    document.getElementById('btn-oct-down').addEventListener('click', () => this.octaveDown());
    document.getElementById('btn-oct-up').addEventListener('click', () => this.octaveUp());

    // Sync audio settings from state
    AudioEngine.masterGain.gain.value = this.state.masterVol / 100;
    AudioEngine.settings.sustainPct = this.state.sustainPct / 100;
    AudioEngine.settings.lofiPct = this.state.lofiPct / 100;
    AudioEngine.settings.vibratoPct = this.state.vibratoPct / 100;
    AudioEngine.settings.tuneCents = this.state.tuneCents;
    AudioEngine.settings.driftPct = this.state.driftPct / 100;
    AudioEngine.settings.filterCutoff = (this.state.filterCutoff ?? 70) / 100;

    // Octave display
    document.getElementById('oct-display').textContent = (this.state.octaveShift >= 0 ? '+' : '') + this.state.octaveShift;

    // Bind modals
    UI.bindModals();

    // Keyboard
    KeyboardEngine.attachKeyboard();

    // Load model (silent)
    this.loadModel(this.state.modelId, true);

    // Slot button visual state
    UI.refreshSlotButtons();
  },

  loadModel(modelId, silent = false) {
    const model = ModelRegistry.getById(modelId);
    if (!model) return;

    // Halt everything safely
    KeyboardEngine.releaseAll();
    AudioEngine.stopAllNotes();
    DemoEngine.stop();
    LessonEngine.stop();
    SequencerEngine.stopPlay();
    if (SequencerEngine.recording) SequencerEngine.stopRec();
    RhythmEngine.stop();

    const rhythmBtn = document.getElementById('btn-rhythm-play');
    if (rhythmBtn) { rhythmBtn.textContent = '▶ BEAT'; rhythmBtn.classList.remove('running'); }
    document.getElementById('btn-rec')?.classList.remove('recording');
    document.getElementById('btn-play')?.classList.remove('playing');
    document.getElementById('btn-demo')?.classList.remove('active');

    this.state.modelId = modelId;
    document.getElementById('model-select').value = modelId;

    // Validate voice & rhythm for this model
    if (!model.voices.includes(this.state.voiceId)) this.state.voiceId = model.defaultVoice;
    if (!model.rhythms.includes(this.state.rhythmId)) this.state.rhythmId = model.defaultRhythm;

    // Polyphony: only P-50 can go poly
    if (model.polyphony === 1) {
      this.state.polyphony = 1;
      const ps = document.getElementById('poly-select');
      if (ps) ps.value = '1';
    }

    // Apply skin, rebuild UI
    SkinEngine.apply(this.state.skin, model.skin);
    UI.buildVoiceButtons(model);
    UI.buildRhythmButtons(model);
    KeyboardEngine.render(model);
    UI.updateLCD();
    UI.setMode('STOP');
    UI.lcdMsg(`${model.name.toUpperCase()} — READY`);
    UI.refreshSeqCounter();
    UI.refreshSlotButtons();

    // Default tempo per model
    if (!silent) {
      this.state.bpm = model.defaultTempo;
      document.getElementById('tempo-slider').value = model.defaultTempo;
      document.getElementById('tempo-display').textContent = model.defaultTempo;
      UI.updateLCD();
      UI.toast(`Loaded: ${model.name} — ${model.tagline}`);
      this.autosave();
    }
  },

  _buildHelpKeymap() {
    const el = document.getElementById('keymap-visual');
    if (!el) return;
    el.innerHTML = '';
    Object.entries(KeyboardEngine.KB_MAP).forEach(([k,n]) => {
      const d = document.createElement('div');
      d.className = 'km-item';
      d.innerHTML = `${k.toUpperCase()}<span>${n}</span>`;
      el.appendChild(d);
    });
  }
};

/* =========================================
   BOOTSTRAP
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  // Unlock AudioContext on first gesture
  const unlock = () => { AudioEngine.resume(); document.body.removeEventListener('click', unlock); document.body.removeEventListener('touchstart', unlock); };
  document.body.addEventListener('click', unlock);
  document.body.addEventListener('touchstart', unlock);
});
