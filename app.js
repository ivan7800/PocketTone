/**
 * POCKETTONE ARCHIVE PRO v3 — app.js
 * New in v3: SongEditorEngine, RhythmEditorEngine, ArcadeEngine,
 *   AchievementEngine, MetronomeEngine, PerformanceMode, PresetEngine,
 *   quantized recording, difficulty selector, custom patterns, fullscreen perf.
 * Carries forward all v2 fixes (scheduler drift, note-stuck, slot logic,
 *   black-key detection, distinct model voices, safe watch-mode).
 */
'use strict';

/* =========================================
   MODEL REGISTRY
   ========================================= */
const ModelRegistry = {
  models: [
    { id:'pocket-p1', name:'Pocket P-1', tagline:'The original classroom companion', era:'1981',
      keys:29, octaveStart:4, polyphony:1,
      voices:['piano-toy','flute-air','violin-soft','organ-mini'], defaultVoice:'piano-toy',
      rhythms:['march','waltz','4beat','rock1'], defaultRhythm:'march', defaultTempo:108,
      sequencerLimit:100,
      lessonSongs:['ode_to_joy','twinkle','frere_jacques','mary_lamb','london_bridge','retro_01','tiny_waltz'],
      skin:'cream-gray', hasLessonLights:true, hasDemoMode:true,
      description:'Used in schools across imaginary Europe from 1981 to 1987. Beloved for its cream casing and honest monophonic piano.',
      rarity:'COMMON', catalogQuote:'"Small enough for a school bag. Strange enough for midnight melodies."',
      demoSong:'demo_p1' },
    { id:'pocket-p10', name:'Pocket P-10', tagline:'The cheerful starter — age 4+', era:'1983',
      keys:25, octaveStart:4, polyphony:1,
      voices:['square-bee','music-box','kalimba','toy-horn'], defaultVoice:'square-bee',
      rhythms:['march','kids-pop','waltz'], defaultRhythm:'kids-pop', defaultTempo:118,
      sequencerLimit:60,
      lessonSongs:['twinkle','mary_lamb','london_bridge','frere_jacques','retro_02','space_lullaby'],
      skin:'white-red', hasLessonLights:true, hasDemoMode:true,
      description:'The P-10 shipped with a bright red case and a sticker set. The "Square Bee" voice became iconic among young composers.',
      rarity:'COMMON', catalogQuote:'"Every child is a musician. Every P-10 is proof."',
      demoSong:'demo_p10' },
    { id:'pocket-p20', name:'Pocket P-20', tagline:'The intermediate performer', era:'1985',
      keys:32, octaveStart:4, polyphony:1,
      voices:['piano-toy','fantasy-bell','strings-ensemble','harmonica','brass-toy','flute-air'], defaultVoice:'fantasy-bell',
      rhythms:['march','waltz','4beat','rock1','swing','bossa','cha-cha'], defaultRhythm:'bossa', defaultTempo:100,
      sequencerLimit:150,
      lessonSongs:['ode_to_joy','twinkle','frere_jacques','greensleeves','amazing_grace','sakura','retro_01','retro_02','robot_march','tiny_waltz'],
      skin:'gray-blue', hasLessonLights:true, hasDemoMode:true,
      description:'The P-20 was the first Pocket model with a dedicated Bossa rhythm and 6 voices. Cult favourite among cassette-culture enthusiasts.',
      rarity:'UNCOMMON', catalogQuote:'"Not just a toy. Not quite a keyboard. Perfectly between."',
      demoSong:'demo_p20' },
    { id:'pocket-p50', name:'Pocket P-50', tagline:'Advanced portable powerhouse', era:'1987',
      keys:37, octaveStart:3, polyphony:3,
      voices:['piano-bright','fantasy-bell','strings-ensemble','digital-choir','brass-toy','clarinet-plastic','pipe-organ','space-pad'], defaultVoice:'piano-bright',
      rhythms:['march','waltz','4beat','rock1','rock2','swing','bossa','samba','rumba','disco-toy','slow-ballad','cha-cha'], defaultRhythm:'swing', defaultTempo:95,
      sequencerLimit:300,
      lessonSongs:['ode_to_joy','twinkle','frere_jacques','greensleeves','amazing_grace','sakura','retro_01','retro_02','robot_march','tiny_waltz','space_lullaby','arcade_tune'],
      skin:'black-gray', hasLessonLights:true, hasDemoMode:true,
      description:'The flagship. 37 keys, 8 unique voices, 12 rhythms, 300-note sequencer. Soft polyphony of 3 voices. The only model that can play chords.',
      rarity:'RARE', catalogQuote:'"When you outgrow toys but still want magic."',
      demoSong:'demo_p50' },
    { id:'pocket-vl', name:'Pocket VL', tagline:'Calculator. Synth. Legend.', era:'1982',
      keys:29, octaveStart:4, polyphony:1,
      voices:['synth-lead','synth-bass','space-pad','glitch-pulse'], defaultVoice:'synth-lead',
      rhythms:['electro-click','disco-toy','rock1','march'], defaultRhythm:'electro-click', defaultTempo:128,
      sequencerLimit:100,
      lessonSongs:['retro_01','retro_02','robot_march','arcade_tune','space_lullaby'],
      skin:'silver-black', hasLessonLights:false, hasDemoMode:true,
      description:'The VL looked like a calculator and sounded like science fiction. The "Synth Bass" cuts through any mix.',
      rarity:'RARE', catalogQuote:'"Calculate the melody. Synthesize the dream."',
      demoSong:'demo_vl' },
    { id:'pocket-sa', name:'Pocket SA-Kid', tagline:'Arcade fun in keyboard form', era:'1991',
      keys:32, octaveStart:4, polyphony:1,
      voices:['music-box','kalimba','toy-horn','digital-choir','fantasy-bell','square-bee'], defaultVoice:'music-box',
      rhythms:['kids-pop','disco-toy','march','rock1','swing','beguine','electro-click'], defaultRhythm:'kids-pop', defaultTempo:120,
      sequencerLimit:120,
      lessonSongs:['twinkle','mary_lamb','frere_jacques','london_bridge','robot_march','space_lullaby','arcade_tune','retro_02'],
      skin:'blue-yellow', hasLessonLights:true, hasDemoMode:true,
      description:'The SA-Kid arrived at the dawn of the 90s with an unmistakable blue-and-yellow shell.',
      rarity:'UNCOMMON', catalogQuote:'"Level up your practice. Insert coin. Press any key."',
      demoSong:'demo_sa' }
  ],
  getById(id){ return this.models.find(m=>m.id===id); },
  getAll(){ return this.models; }
};

/* =========================================
   SONG LIBRARY
   ========================================= */
const SongLibrary = {
  songs: {
    ode_to_joy:   { id:'ode_to_joy',   title:'Ode to Joy',              difficulty:1, tempo:100, notes:[{n:'E4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'E4',d:1.5},{n:'D4',d:0.5},{n:'D4',d:2},{n:'E4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'D4',d:1.5},{n:'C4',d:0.5},{n:'C4',d:2}] },
    twinkle:      { id:'twinkle',      title:'Twinkle Twinkle',         difficulty:1, tempo:110, notes:[{n:'C4',d:1},{n:'C4',d:1},{n:'G4',d:1},{n:'G4',d:1},{n:'A4',d:1},{n:'A4',d:1},{n:'G4',d:2},{n:'F4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'D4',d:1},{n:'C4',d:2},{n:'G4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'D4',d:2},{n:'G4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'D4',d:2}] },
    frere_jacques:{ id:'frere_jacques',title:'Frère Jacques',           difficulty:1, tempo:105, notes:[{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'C4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'C4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},{n:'G4',d:0.5},{n:'A4',d:0.5},{n:'G4',d:0.5},{n:'F4',d:0.5},{n:'E4',d:1},{n:'C4',d:1},{n:'G4',d:0.5},{n:'A4',d:0.5},{n:'G4',d:0.5},{n:'F4',d:0.5},{n:'E4',d:1},{n:'C4',d:1},{n:'C4',d:1},{n:'G3',d:1},{n:'C4',d:2}] },
    mary_lamb:    { id:'mary_lamb',    title:'Mary Had a Little Lamb',  difficulty:1, tempo:110, notes:[{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'E4',d:2},{n:'D4',d:1},{n:'D4',d:1},{n:'D4',d:2},{n:'E4',d:1},{n:'G4',d:1},{n:'G4',d:2},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:4}] },
    london_bridge:{ id:'london_bridge',title:'London Bridge',           difficulty:1, tempo:115, notes:[{n:'G4',d:1},{n:'A4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},{n:'D4',d:1},{n:'E4',d:1},{n:'F4',d:2},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},{n:'G4',d:1},{n:'A4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},{n:'D4',d:1},{n:'G4',d:1},{n:'E4',d:1},{n:'C4',d:1},{n:'C4',d:2}] },
    greensleeves: { id:'greensleeves', title:'Greensleeves',            difficulty:2, tempo:76,  notes:[{n:'A4',d:1},{n:'C5',d:1.5},{n:'D5',d:0.5},{n:'E5',d:1},{n:'F5',d:1.5},{n:'E5',d:0.5},{n:'D5',d:1},{n:'B4',d:1.5},{n:'G4',d:0.5},{n:'A4',d:1},{n:'A4',d:1.5},{n:'B4',d:0.5},{n:'C5',d:1},{n:'E5',d:1.5},{n:'D5',d:0.5},{n:'C5',d:1},{n:'A4',d:1.5},{n:'F4',d:0.5},{n:'G4',d:1},{n:'A4',d:3}] },
    sakura:       { id:'sakura',       title:'Sakura Sakura',           difficulty:2, tempo:72,  notes:[{n:'A4',d:2},{n:'A4',d:2},{n:'B4',d:2},{n:'A4',d:2},{n:'A4',d:2},{n:'B4',d:2},{n:'A4',d:4},{n:'A4',d:2},{n:'C5',d:2},{n:'E5',d:2},{n:'C5',d:2},{n:'A4',d:2},{n:'B4',d:2},{n:'A4',d:4},{n:'E5',d:2},{n:'C5',d:2},{n:'A4',d:2},{n:'B4',d:2},{n:'C5',d:2},{n:'B4',d:2},{n:'A4',d:4}] },
    amazing_grace:{ id:'amazing_grace',title:'Amazing Grace',           difficulty:2, tempo:78,  notes:[{n:'G4',d:1},{n:'C5',d:1.5},{n:'E5',d:0.5},{n:'C5',d:1},{n:'E5',d:2},{n:'D5',d:1},{n:'C5',d:1.5},{n:'A4',d:0.5},{n:'A4',d:1},{n:'G4',d:1},{n:'C5',d:1.5},{n:'E5',d:0.5},{n:'C5',d:1},{n:'G5',d:3},{n:'E5',d:1},{n:'G5',d:1.5},{n:'E5',d:0.5},{n:'C5',d:1},{n:'E5',d:2},{n:'D5',d:1},{n:'C5',d:1.5},{n:'A4',d:0.5},{n:'G4',d:1},{n:'C5',d:3}] },
    retro_01:     { id:'retro_01',     title:'Retro Lesson 01',         difficulty:1, tempo:100, notes:[{n:'C4',d:1},{n:'E4',d:1},{n:'G4',d:1},{n:'E4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:2},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'C4',d:2},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'E4',d:1},{n:'G4',d:2}] },
    retro_02:     { id:'retro_02',     title:'Retro Lesson 02',         difficulty:1, tempo:110, notes:[{n:'E4',d:1},{n:'G4',d:1},{n:'A4',d:1},{n:'G4',d:1},{n:'E4',d:2},{n:'C4',d:2},{n:'D4',d:1},{n:'F4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'D4',d:2},{n:'B3',d:2},{n:'C4',d:1},{n:'E4',d:1},{n:'G4',d:1},{n:'A4',d:1},{n:'G4',d:1},{n:'E4',d:1},{n:'C4',d:2}] },
    robot_march:  { id:'robot_march',  title:'Robot March',             difficulty:1, tempo:120, notes:[{n:'C4',d:0.5},{n:'C4',d:0.5},{n:'G4',d:1},{n:'G4',d:0.5},{n:'G4',d:0.5},{n:'E4',d:1},{n:'C4',d:1},{n:'F4',d:0.5},{n:'F4',d:0.5},{n:'E4',d:1},{n:'D4',d:0.5},{n:'D4',d:0.5},{n:'C4',d:2},{n:'G4',d:0.5},{n:'G4',d:0.5},{n:'A4',d:1},{n:'G4',d:0.5},{n:'G4',d:0.5},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:0.5},{n:'D4',d:0.5},{n:'E4',d:1},{n:'F4',d:0.5},{n:'G4',d:0.5},{n:'C4',d:2}] },
    tiny_waltz:   { id:'tiny_waltz',   title:'Tiny Waltz',              difficulty:2, tempo:88,  notes:[{n:'C4',d:1},{n:'E4',d:1},{n:'G4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'F4',d:1},{n:'A4',d:1},{n:'G4',d:3},{n:'A4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:1},{n:'G3',d:1},{n:'B3',d:1},{n:'D4',d:1},{n:'C4',d:3}] },
    space_lullaby:{ id:'space_lullaby',title:'Space Lullaby',           difficulty:1, tempo:68,  notes:[{n:'A4',d:2},{n:'G4',d:1},{n:'E4',d:1},{n:'F4',d:2},{n:'D4',d:2},{n:'E4',d:2},{n:'C4',d:1},{n:'D4',d:1},{n:'C4',d:4},{n:'G4',d:2},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:2},{n:'C4',d:2},{n:'E4',d:2},{n:'D4',d:1},{n:'C4',d:1},{n:'C4',d:4}] },
    arcade_tune:  { id:'arcade_tune',  title:'Arcade Tune',             difficulty:3, tempo:130, notes:[{n:'C5',d:0.5},{n:'E5',d:0.5},{n:'G5',d:0.5},{n:'C5',d:0.5},{n:'B4',d:0.5},{n:'G4',d:0.5},{n:'E4',d:0.5},{n:'C4',d:0.5},{n:'D4',d:0.5},{n:'F4',d:0.5},{n:'A4',d:0.5},{n:'D5',d:0.5},{n:'C5',d:0.5},{n:'A4',d:0.5},{n:'F4',d:0.5},{n:'D4',d:0.5},{n:'E4',d:0.5},{n:'G4',d:0.5},{n:'B4',d:0.5},{n:'E5',d:0.5},{n:'D5',d:0.5},{n:'B4',d:0.5},{n:'G4',d:0.5},{n:'E4',d:0.5},{n:'G4',d:1},{n:'E4',d:1},{n:'C4',d:2}] },
    demo_p1:   { id:'demo_p1',   title:'P-1 Demo',   difficulty:0, tempo:108, notes:[{n:'C4',d:1},{n:'D4',d:1},{n:'E4',d:1},{n:'F4',d:1},{n:'G4',d:2},{n:'E4',d:1},{n:'C4',d:1},{n:'D4',d:2},{n:'G4',d:2},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:4}] },
    demo_p10:  { id:'demo_p10',  title:'P-10 Demo',  difficulty:0, tempo:120, notes:[{n:'C4',d:0.5},{n:'E4',d:0.5},{n:'G4',d:1},{n:'E4',d:0.5},{n:'C4',d:0.5},{n:'G4',d:2},{n:'A4',d:1},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:3}] },
    demo_p20:  { id:'demo_p20',  title:'P-20 Demo',  difficulty:0, tempo:100, notes:[{n:'E4',d:1},{n:'G4',d:1},{n:'B4',d:1},{n:'G4',d:1},{n:'E4',d:2},{n:'F4',d:1},{n:'A4',d:1},{n:'C5',d:1},{n:'A4',d:1},{n:'F4',d:2},{n:'G4',d:1},{n:'F4',d:1},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:2}] },
    demo_p50:  { id:'demo_p50',  title:'P-50 Demo',  difficulty:0, tempo:92,  notes:[{n:'C4',d:0.5},{n:'E4',d:0.5},{n:'G4',d:0.5},{n:'B4',d:0.5},{n:'C5',d:1},{n:'B4',d:0.5},{n:'G4',d:0.5},{n:'E4',d:1},{n:'D4',d:0.5},{n:'F4',d:0.5},{n:'A4',d:0.5},{n:'C5',d:0.5},{n:'B4',d:2},{n:'G4',d:1},{n:'E4',d:1},{n:'C4',d:2}] },
    demo_vl:   { id:'demo_vl',   title:'VL Demo',    difficulty:0, tempo:132, notes:[{n:'C4',d:0.5},{n:'C4',d:0.5},{n:'G4',d:1},{n:'G4',d:0.5},{n:'F4',d:0.5},{n:'E4',d:1},{n:'D4',d:1},{n:'C4',d:0.5},{n:'E4',d:0.5},{n:'G4',d:1},{n:'A4',d:0.5},{n:'G4',d:0.5},{n:'F4',d:1},{n:'E4',d:1},{n:'C4',d:2}] },
    demo_sa:   { id:'demo_sa',   title:'SA-Kid Demo',difficulty:0, tempo:124, notes:[{n:'E4',d:0.5},{n:'E4',d:0.5},{n:'G4',d:1},{n:'A4',d:0.5},{n:'G4',d:0.5},{n:'E4',d:1},{n:'C4',d:0.5},{n:'D4',d:0.5},{n:'E4',d:1},{n:'F4',d:0.5},{n:'G4',d:0.5},{n:'A4',d:1},{n:'G4',d:0.5},{n:'F4',d:0.5},{n:'E4',d:2}] },
  },
  custom: [],
  get(id){ return this.songs[id] || this.custom.find(s=>s.id===id) || null; },
  getCustom(){ return this.custom; },
  saveCustom(song){ const i=this.custom.findIndex(s=>s.id===song.id); if(i>=0) this.custom[i]=song; else this.custom.push(song); Storage.saveCustomSongs(this.custom); },
  deleteCustom(id){ this.custom=this.custom.filter(s=>s.id!==id); Storage.saveCustomSongs(this.custom); },
  loadCustomFromStorage(arr){ this.custom = arr||[]; }
};

/* =========================================
   STORAGE
   ========================================= */
const Storage = {
  KEY:'pockettone_v3',
  SONGS_KEY:'pockettone_v3_songs',
  PATTERNS_KEY:'pockettone_v3_patterns',
  save(data){ try{ localStorage.setItem(this.KEY,JSON.stringify(data)); }catch(e){} },
  load(){ try{ const d=localStorage.getItem(this.KEY); return d?JSON.parse(d):null; }catch(e){ return null; } },
  saveCustomSongs(arr){ try{ localStorage.setItem(this.SONGS_KEY,JSON.stringify(arr)); }catch(e){} },
  loadCustomSongs(){ try{ const d=localStorage.getItem(this.SONGS_KEY); return d?JSON.parse(d):[]; }catch(e){ return []; } },
  saveCustomPatterns(arr){ try{ localStorage.setItem(this.PATTERNS_KEY,JSON.stringify(arr)); }catch(e){} },
  loadCustomPatterns(){ try{ const d=localStorage.getItem(this.PATTERNS_KEY); return d?JSON.parse(d):[]; }catch(e){ return []; } }
};

/* =========================================
   AUDIO ENGINE — WebAudio-clock scheduled
   ========================================= */
const AudioEngine = {
  ctx:null, masterGain:null, comp:null, activeNodes:{},
  settings:{ masterVol:.8, sustainPct:.3, lofiPct:.4, vibratoPct:.2, tuneCents:0, driftPct:.2, filterCutoff:.7 },
  VOICE:{
    'piano-toy':      { osc:[{t:'triangle',d:0,g:.8},{t:'sine',d:7,g:.35}],                                                      A:.004,D:.12,S:.25,R:.7,  fHz:3500,fQ:1,   vRate:5,  vAmt:0  },
    'piano-bright':   { osc:[{t:'triangle',d:0,g:.75},{t:'sine',d:7,g:.4},{t:'sine',d:12,g:.15}],                                A:.003,D:.1, S:.3, R:.6,  fHz:5000,fQ:.8,  vRate:5,  vAmt:0  },
    'flute-air':      { osc:[{t:'sine',d:0,g:.8},{t:'sine',d:1200,g:.08}],                                        noise:.1,      A:.07, D:.04,S:.75,R:.4,  fHz:4500,fQ:1,   vRate:5,  vAmt:8  },
    'harmonica':      { osc:[{t:'sawtooth',d:0,g:.6},{t:'square',d:7,g:.3},{t:'sawtooth',d:-5,g:.25}],                           A:.02, D:.06,S:.7, R:.25, fHz:2000,fQ:2,   vRate:6,  vAmt:10 },
    'toy-horn':       { osc:[{t:'square',d:0,g:.5},{t:'sawtooth',d:5,g:.4}],                                                     A:.04, D:.1, S:.65,R:.2,  fHz:1800,fQ:3,   vRate:5.5,vAmt:6  },
    'violin-soft':    { osc:[{t:'sawtooth',d:0,g:.65},{t:'sawtooth',d:5,g:.3}],                                                  A:.09, D:.08,S:.7, R:.5,  fHz:2500,fQ:2,   vRate:5.5,vAmt:10 },
    'strings-ensemble':{ osc:[{t:'sawtooth',d:0,g:.5},{t:'sawtooth',d:3,g:.4},{t:'sawtooth',d:-4,g:.35}],                        A:.18, D:.1, S:.75,R:.8,  fHz:2200,fQ:1.5, vRate:4.5,vAmt:12 },
    'fantasy-bell':   { osc:[{t:'sine',d:0,g:1},{t:'sine',d:1200,g:.3},{t:'sine',d:2700,g:.08}],                                A:.001,D:.35,S:.15,R:1.5, fHz:7000,fQ:.5,  vRate:6,  vAmt:3  },
    'music-box':      { osc:[{t:'sine',d:0,g:.9},{t:'sine',d:2400,g:.12},{t:'triangle',d:3600,g:.05}],                           A:.001,D:.45,S:.04,R:.9,  fHz:8000,fQ:.5,  vRate:6,  vAmt:0  },
    'kalimba':        { osc:[{t:'sine',d:0,g:.9},{t:'sine',d:1900,g:.2},{t:'sine',d:2800,g:.06}],                                A:.001,D:.5, S:.02,R:1.2, fHz:9000,fQ:.3,  vRate:7,  vAmt:2  },
    'organ-mini':     { osc:[{t:'square',d:0,g:.55},{t:'square',d:1200,g:.3},{t:'square',d:1900,g:.1}],                          A:.005,D:.01,S:.9, R:.06, fHz:2000,fQ:.5,  vRate:6,  vAmt:4  },
    'brass-toy':      { osc:[{t:'sawtooth',d:0,g:.75},{t:'square',d:-5,g:.3}],                                                   A:.055,D:.18,S:.6, R:.28, fHz:2200,fQ:2.5, vRate:5,  vAmt:4  },
    'clarinet-plastic':{ osc:[{t:'square',d:0,g:.75},{t:'sine',d:1200,g:.2}],                                                    A:.04, D:.1, S:.7, R:.35, fHz:2800,fQ:1.5, vRate:5.5,vAmt:6  },
    'pipe-organ':     { osc:[{t:'square',d:0,g:.5},{t:'square',d:1200,g:.35},{t:'square',d:1900,g:.2},{t:'square',d:2400,g:.1}], A:.02, D:.01,S:.95,R:.12, fHz:3000,fQ:.8,  vRate:7,  vAmt:5  },
    'digital-choir':  { osc:[{t:'sine',d:0,g:.55},{t:'sine',d:-5,g:.45},{t:'sine',d:1200,g:.2}],                                A:.2,  D:.1, S:.8, R:.7,  fHz:3500,fQ:1,   vRate:4.5,vAmt:8  },
    'synth-lead':     { osc:[{t:'sawtooth',d:0,g:.7},{t:'sawtooth',d:7,g:.4},{t:'square',d:-1200,g:.2}],                         A:.01, D:.1, S:.7, R:.3,  fHz:1800,fQ:4,   vRate:7,  vAmt:3  },
    'synth-bass':     { osc:[{t:'sawtooth',d:0,g:.8},{t:'sine',d:-1200,g:.5}],                                                   A:.005,D:.15,S:.5, R:.18, fHz:800, fQ:5,   vRate:0,  vAmt:0  },
    'space-pad':      { osc:[{t:'sawtooth',d:0,g:.4},{t:'sawtooth',d:7,g:.35},{t:'sine',d:600,g:.3}],                            A:.35, D:.2, S:.7, R:1.4, fHz:1000,fQ:5,   vRate:3,  vAmt:12 },
    'glitch-pulse':   { osc:[{t:'square',d:0,g:.6},{t:'square',d:1199,g:.3}],                                                    A:.002,D:.05,S:.6, R:.1,  fHz:1400,fQ:6,   vRate:9,  vAmt:5  },
    'square-bee':     { osc:[{t:'square',d:0,g:.65},{t:'square',d:1200,g:.3}],                                                   A:.005,D:.08,S:.6, R:.2,  fHz:1500,fQ:1,   vRate:8,  vAmt:3  },
  },
  presetOverrides:{},
  getVoiceParams(voiceId){ const base=this.VOICE[voiceId]||this.VOICE['piano-toy']; const ov=this.presetOverrides[voiceId]; return ov?{...base,...ov}:base; },

  init(){
    this.ctx=new(window.AudioContext||window.webkitAudioContext)();
    this.masterGain=this.ctx.createGain();
    this.masterGain.gain.value=this.settings.masterVol;
    this.comp=this.ctx.createDynamicsCompressor();
    this.comp.threshold.value=-20; this.comp.ratio.value=4;
    this.masterGain.connect(this.comp); this.comp.connect(this.ctx.destination);
  },
  resume(){ if(this.ctx&&this.ctx.state==='suspended') this.ctx.resume(); },

  noteToHz(noteStr,octShift=0){
    const SEMI={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
    const m=noteStr.match(/^([A-G][#b]?)(\d)$/); if(!m) return 440;
    const semi=SEMI[m[1]]??0, oct=parseInt(m[2])+octShift, midi=(oct+1)*12+semi;
    const drift=(Math.random()-.5)*this.settings.driftPct*0.12;
    return 440*Math.pow(2,(midi-69+this.settings.tuneCents/100+drift)/12);
  },

  playNote(noteStr,voiceId,poly=1,vel=1,octShift=0){
    if(!this.ctx) return; this.resume();
    const vp=this.getVoiceParams(voiceId);
    if(poly===1) this._killAll(); else if(this.activeNodes[noteStr]) this._killNote(noteStr);
    const now=this.ctx.currentTime, freq=this.noteToHz(noteStr,octShift), s=this.settings;
    const gainNode=this.ctx.createGain();
    gainNode.gain.setValueAtTime(0,now);
    gainNode.gain.linearRampToValueAtTime(vel*.7,now+vp.A);
    gainNode.gain.linearRampToValueAtTime(vp.S*vel*.7,now+vp.A+vp.D);
    const filter=this.ctx.createBiquadFilter(); filter.type='lowpass';
    filter.frequency.value=Math.min(20000,(vp.fHz??3000)*(s.filterCutoff??1)*(1-s.lofiPct*.5));
    filter.Q.value=vp.fQ??1;
    const vibratoOsc=this.ctx.createOscillator(), vibratoGain=this.ctx.createGain();
    vibratoOsc.frequency.value=vp.vRate??5; vibratoGain.gain.value=(vp.vAmt??0)*s.vibratoPct;
    vibratoOsc.connect(vibratoGain); vibratoOsc.start(now);
    const oscs=[];
    for(const mix of(vp.osc??[])){
      const osc=this.ctx.createOscillator(); osc.type=mix.t;
      osc.frequency.value=freq*Math.pow(2,(mix.d||0)/1200);
      vibratoGain.connect(osc.frequency);
      const g2=this.ctx.createGain(); g2.gain.value=mix.g??1;
      osc.connect(g2); g2.connect(filter); osc.start(now); oscs.push(osc);
    }
    if(vp.noise){ const sr=this.ctx.sampleRate, buf=this.ctx.createBuffer(1,sr*.4,sr), dat=buf.getChannelData(0); for(let i=0;i<dat.length;i++) dat[i]=Math.random()*2-1; const ns=this.ctx.createBufferSource(); ns.buffer=buf; ns.loop=true; const ng=this.ctx.createGain(); ng.gain.value=vp.noise; ns.connect(ng); ng.connect(filter); ns.start(now); oscs.push(ns); }
    filter.connect(gainNode); gainNode.connect(this.masterGain);
    this.activeNodes[noteStr]={gainNode,filter,oscs,vibratoOsc,vibratoGain,vp};
  },
  stopNote(noteStr){
    const nd=this.activeNodes[noteStr]; if(!nd||!this.ctx) return;
    delete this.activeNodes[noteStr];
    const vp=nd.vp, now=this.ctx.currentTime, rel=vp.R+this.settings.sustainPct*.6;
    nd.gainNode.gain.cancelScheduledValues(now); nd.gainNode.gain.setValueAtTime(nd.gainNode.gain.value,now);
    nd.gainNode.gain.linearRampToValueAtTime(0,now+rel);
    const stop=now+rel+.05;
    nd.oscs.forEach(o=>{try{o.stop(stop);}catch(e){}});
    try{nd.vibratoOsc.stop(stop);}catch(e){}
  },
  _killNote(noteStr){
    const nd=this.activeNodes[noteStr]; if(!nd||!this.ctx) return;
    delete this.activeNodes[noteStr]; const now=this.ctx.currentTime;
    nd.gainNode.gain.cancelScheduledValues(now); nd.gainNode.gain.setValueAtTime(0,now+.02);
    nd.oscs.forEach(o=>{try{o.stop(now+.03);}catch(e){}});
    try{nd.vibratoOsc.stop(now+.03);}catch(e){}
  },
  _killAll(){ Object.keys(this.activeNodes).forEach(k=>this._killNote(k)); },
  stopAllNotes(){ this._killAll(); },
  playError(){ if(!this.ctx) return; this.resume(); const now=this.ctx.currentTime, o=this.ctx.createOscillator(), g=this.ctx.createGain(); o.type='square'; o.frequency.value=160; g.gain.setValueAtTime(.12,now); g.gain.linearRampToValueAtTime(0,now+.14); o.connect(g); g.connect(this.masterGain); o.start(now); o.stop(now+.15); },
  playSuccess(){ if(!this.ctx) return; this.resume(); [880,1108,1319].forEach((f,i)=>{ const now=this.ctx.currentTime+i*.08, o=this.ctx.createOscillator(), g=this.ctx.createGain(); o.type='sine'; o.frequency.value=f; g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(.14,now+.02); g.gain.linearRampToValueAtTime(0,now+.28); o.connect(g); g.connect(this.masterGain); o.start(now); o.stop(now+.3); }); },
  playCoin(){ if(!this.ctx) return; this.resume(); [1047,1319].forEach((f,i)=>{ const now=this.ctx.currentTime+i*.06, o=this.ctx.createOscillator(), g=this.ctx.createGain(); o.type='square'; o.frequency.value=f; g.gain.setValueAtTime(.1,now); g.gain.linearRampToValueAtTime(0,now+.12); o.connect(g); g.connect(this.masterGain); o.start(now); o.stop(now+.14); }); }
};

/* =========================================
   RHYTHM ENGINE — AudioContext lookahead scheduler
   ========================================= */
const RhythmEngine = {
  BUILT_IN:{
    march:       {sig:4,steps:8, bpm:120,tracks:{kick:[1,0,0,0,1,0,0,0],snare:[0,0,1,0,0,0,1,0],hihat:[1,1,1,1,1,1,1,1]}},
    waltz:       {sig:3,steps:6, bpm:100,tracks:{kick:[1,0,0,1,0,0],snare:[0,1,0,0,1,0],hihat:[1,0,1,1,0,1],clave:[1,0,0,0,1,0]}},
    '4beat':     {sig:4,steps:16,bpm:110,tracks:{kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]}},
    rock1:       {sig:4,steps:16,bpm:128,tracks:{kick:[1,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],tom:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1]}},
    rock2:       {sig:4,steps:16,bpm:140,tracks:{kick:[1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],tom:[0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0]}},
    swing:       {sig:4,steps:12,bpm:104,tracks:{kick:[1,0,0,0,1,0,0,0,1,0,0,0],snare:[0,0,1,0,0,0,1,0,0,0,1,0],hihat:[1,0,1,0,1,0,1,0,1,0,1,0],blip:[0,0,0,1,0,0,0,1,0,0,0,1]}},
    bossa:       {sig:4,steps:16,bpm:100,tracks:{kick:[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0],hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],clave:[1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0]}},
    samba:       {sig:2,steps:16,bpm:122,tracks:{kick:[1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0],snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],clave:[1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,0]}},
    rumba:       {sig:4,steps:16,bpm:100,tracks:{kick:[1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],clave:[1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0]}},
    'disco-toy': {sig:4,steps:16,bpm:124,tracks:{kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],hihat:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],clap:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],blip:[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1]}},
    'slow-ballad':{sig:4,steps:8, bpm:64, tracks:{kick:[1,0,0,0,1,0,0,0],snare:[0,0,1,0,0,0,1,0],hihat:[1,0,1,0,1,0,1,0],clap:[0,0,1,0,0,0,1,0]}},
    'cha-cha':   {sig:4,steps:16,bpm:108,tracks:{kick:[1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],clave:[0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0]}},
    beguine:     {sig:4,steps:16,bpm:104,tracks:{kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],hihat:[1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],clave:[1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0]}},
    'electro-click':{sig:4,steps:16,bpm:134,tracks:{kick:[1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],hihat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],blip:[0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],clave:[1,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0]}},
    'kids-pop':  {sig:4,steps:8, bpm:116,tracks:{kick:[1,0,0,0,1,0,0,0],snare:[0,0,1,0,0,0,1,0],hihat:[1,1,1,1,1,1,1,1],blip:[0,0,0,1,0,0,0,1],clap:[0,1,0,0,0,1,0,0]}},
  },
  customPatterns:[],
  running:false, currentStep:0, patternId:'march', bpm:120,
  _raf:null, _nextStepTime:0, LOOK_AHEAD:.1, SCHEDULE_INTERVAL:50,

  getPattern(id){ return this.BUILT_IN[id] || this.customPatterns.find(p=>p.id===id) || this.BUILT_IN.march; },

  _drum(type,when){
    const ctx=AudioEngine.ctx; if(!ctx) return;
    const vol=App.state.masterVol/100*.48;
    const g=ctx.createGain(); g.connect(AudioEngine.masterGain);
    if(type==='kick'){const o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(160,when);o.frequency.exponentialRampToValueAtTime(28,when+.13);g.gain.setValueAtTime(vol*.95,when);g.gain.exponentialRampToValueAtTime(.001,when+.22);o.connect(g);o.start(when);o.stop(when+.23);}
    else if(type==='snare'){const buf=ctx.createBuffer(1,ctx.sampleRate*.16,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const ns=ctx.createBufferSource();ns.buffer=buf;const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=1900;f.Q.value=.8;ns.connect(f);f.connect(g);const o2=ctx.createOscillator();o2.type='triangle';o2.frequency.value=188;const g2=ctx.createGain();g2.gain.setValueAtTime(vol*.28,when);g2.gain.linearRampToValueAtTime(0,when+.1);o2.connect(g2);g2.connect(AudioEngine.masterGain);g.gain.setValueAtTime(vol*.52,when);g.gain.exponentialRampToValueAtTime(.001,when+.2);ns.start(when);ns.stop(when+.22);o2.start(when);o2.stop(when+.12);}
    else if(type==='hihat'){const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.065),ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const ns=ctx.createBufferSource();ns.buffer=buf;const f=ctx.createBiquadFilter();f.type='highpass';f.frequency.value=6500;ns.connect(f);f.connect(g);g.gain.setValueAtTime(vol*.32,when);g.gain.exponentialRampToValueAtTime(.001,when+.065);ns.start(when);ns.stop(when+.07);}
    else if(type==='clap'){const o=ctx.createOscillator();o.type='square';o.frequency.value=1300;const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=1400;f.Q.value=2.5;o.connect(f);f.connect(g);g.gain.setValueAtTime(vol*.42,when);g.gain.exponentialRampToValueAtTime(.001,when+.07);o.start(when);o.stop(when+.08);}
    else if(type==='clave'){const o=ctx.createOscillator();o.type='square';o.frequency.value=920;const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=920;f.Q.value=4;o.connect(f);f.connect(g);g.gain.setValueAtTime(vol*.38,when);g.gain.exponentialRampToValueAtTime(.001,when+.055);o.start(when);o.stop(when+.06);}
    else if(type==='tom'){const o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(82,when);o.frequency.exponentialRampToValueAtTime(44,when+.18);g.gain.setValueAtTime(vol*.62,when);g.gain.exponentialRampToValueAtTime(.001,when+.22);o.connect(g);o.start(when);o.stop(when+.24);}
    else if(type==='blip'){const o=ctx.createOscillator();o.type='square';o.frequency.value=1500;g.gain.setValueAtTime(vol*.22,when);g.gain.exponentialRampToValueAtTime(.001,when+.04);o.connect(g);o.start(when);o.stop(when+.045);}
  },

  start(patternId,bpm){
    this.stop(); this.patternId=patternId; this.bpm=bpm; this.currentStep=0; this.running=true;
    if(AudioEngine.ctx) this._nextStepTime=AudioEngine.ctx.currentTime+.05;
    this._schedule();
  },
  stop(){ this.running=false; if(this._raf){clearTimeout(this._raf);this._raf=null;} this.currentStep=0; UI.updateBeatLeds(-1); },
  _schedule(){
    if(!this.running||!AudioEngine.ctx) return;
    const pat=this.getPattern(this.patternId); if(!pat){this.stop();return;}
    const stepSec=(60/this.bpm)/(pat.steps/pat.sig);
    const ctx=AudioEngine.ctx;
    while(this._nextStepTime<ctx.currentTime+this.LOOK_AHEAD){
      const step=this.currentStep%pat.steps, when=this._nextStepTime;
      for(const[track,arr] of Object.entries(pat.tracks)){ if(arr[step]) this._drum(track,when); }
      const beatIdx=Math.floor(step/(pat.steps/pat.sig));
      const delay=Math.max(0,(when-ctx.currentTime)*1000);
      const s=step;
      setTimeout(()=>{ if(this.running){ UI.updateBeatLeds(beatIdx); MetronomeEngine.onBeat(beatIdx); } RhythmEditorEngine.highlightStep(s); },delay);
      this.currentStep=(step+1)%pat.steps;
      this._nextStepTime+=stepSec;
    }
    this._raf=setTimeout(()=>this._schedule(),this.SCHEDULE_INTERVAL);
  }
};

/* =========================================
   METRONOME ENGINE — visual pendulum + click
   ========================================= */
const MetronomeEngine = {
  active:false, tock:false,
  toggle(){
    this.active=!this.active;
    document.getElementById('btn-metronome').classList.toggle('active',this.active);
    if(!this.active){ const arm=document.getElementById('metronome-arm'); if(arm){ arm.style.transform='rotate(0deg)'; arm.classList.remove('tick'); } }
    UI.toast(this.active?'Metronome ON':'Metronome OFF');
  },
  onBeat(beat){
    if(!this.active) return;
    if(beat===0||beat===2){
      this._click(beat===0?0.12:0.07);
      const arm=document.getElementById('metronome-arm');
      if(arm){ this.tock=!this.tock; arm.classList.add('tick'); arm.style.transform=`rotate(${this.tock?-28:28}deg)`; }
    }
  },
  _click(vol){
    const ctx=AudioEngine.ctx; if(!ctx) return;
    const now=ctx.currentTime, o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.value=880; g.gain.setValueAtTime(vol,now); g.gain.exponentialRampToValueAtTime(.001,now+.08);
    o.connect(g); g.connect(AudioEngine.masterGain); o.start(now); o.stop(now+.09);
  }
};

/* =========================================
   SEQUENCER ENGINE — with quantized recording
   ========================================= */
const SequencerEngine = {
  recording:false, playing:false, looping:false, sequence:[],
  _recStart:null, _playTimers:[],
  get limit(){ return ModelRegistry.getById(App.state.modelId)?.sequencerLimit||100; },

  startRec(){ this.stopPlay(); this.sequence=[]; this.recording=true; this._recStart=performance.now(); UI.setMode('● REC'); UI.toast('● Recording — play notes'); },
  stopRec(){ this.recording=false; UI.setMode('STOP'); UI.refreshSeqCounter(); App.autosave(); UI.toast(`Recorded ${this.sequence.length} notes`); },

  addNote(note,durationSec){
    if(!this.recording) return;
    if(this.sequence.length>=this.limit){ UI.toast('Memory full!'); return; }
    let ts=performance.now()-this._recStart;
    const grid=App.state.quantizeGrid;
    if(grid>0){
      const bps=App.state.bpm/60, beatMs=1000/bps, gridMs=beatMs*grid;
      ts=Math.round(ts/gridMs)*gridMs;
      const gridSec=grid/bps;
      durationSec=Math.max(gridSec*0.5, Math.round(durationSec/gridSec)*gridSec);
    }
    this.sequence.push({note,duration:durationSec,ts,voice:App.state.voiceId,vel:.8+Math.random()*.2});
    UI.refreshSeqCounter();
  },

  play(){
    if(!this.sequence.length){ UI.toast('Nothing recorded'); return; }
    this.stopPlay(); this.playing=true; UI.setMode('▶ PLAY'); AudioEngine.resume();
    const go=()=>{
      const base=this.sequence[0].ts;
      this.sequence.forEach(ev=>{
        const t=setTimeout(()=>{
          if(!this.playing) return;
          AudioEngine.playNote(ev.note,ev.voice||App.state.voiceId,1,ev.vel||1,App.state.octaveShift);
          const k=document.querySelector(`.key[data-note="${ev.note}"]`);
          if(k){ k.classList.add('pressed'); setTimeout(()=>k.classList.remove('pressed'),(ev.duration||.3)*1000); }
          setTimeout(()=>AudioEngine.stopNote(ev.note),(ev.duration||.3)*1000);
        },ev.ts-base);
        this._playTimers.push(t);
      });
      const last=this.sequence[this.sequence.length-1];
      const total=(last.ts-base)+(last.duration||.3)*1000+300;
      const end=setTimeout(()=>{ if(this.looping&&this.playing) go(); else this.stopPlay(); },total);
      this._playTimers.push(end);
    };
    go();
  },
  stopPlay(){ this.playing=false; this._playTimers.forEach(t=>clearTimeout(t)); this._playTimers=[]; if(!this.recording) UI.setMode('STOP'); document.getElementById('btn-play')?.classList.remove('playing'); },
  clear(){ this.stopPlay(); if(this.recording) this.stopRec(); this.sequence=[]; UI.refreshSeqCounter(); UI.toast('Sequence cleared'); },
  toggleLoop(){ this.looping=!this.looping; document.getElementById('btn-loop').classList.toggle('looping',this.looping); UI.toast(this.looping?'↺ Loop ON':'↺ Loop OFF'); },
  toJSON(){ return {app:'PocketTone Archive Pro',version:'3.0.0',model:App.state.modelId,skin:App.state.skin,tempo:App.state.bpm,voice:App.state.voiceId,rhythm:App.state.rhythmId,sequence:this.sequence}; },
  fromJSON(obj){ if(!obj?.sequence) return false; this.sequence=obj.sequence; UI.refreshSeqCounter(); return true; }
};

/* =========================================
   KEYBOARD ENGINE
   ========================================= */
const KeyboardEngine = {
  CHROMATIC:['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
  IS_BLACK:[false,true,false,true,false,false,true,false,true,false,true,false],
  KB_LOW:{z:'C4',s:'C#4',x:'D4',d:'D#4',c:'E4',v:'F4',g:'F#4',b:'G4',h:'G#4',n:'A4',j:'A#4',m:'B4'},
  KB_HIGH:{q:'C5','2':'C#5',w:'D5','3':'D#5',e:'E5',r:'F5','5':'F#5',t:'G5','6':'G#5',y:'A5','7':'A#5',u:'B5',i:'C6','9':'C#6',o:'D6','0':'D#6',p:'E6'},
  keysDown:new Set(), noteArray:[],
  get KB_MAP(){ return {...this.KB_LOW,...this.KB_HIGH}; },
  _isBlack(noteStr){ const name=noteStr.replace(/\d+$/,''); const idx=this.CHROMATIC.indexOf(name); return idx>=0&&this.IS_BLACK[idx]; },
  buildNoteArray(model){ const arr=[]; let oct=model.octaveStart, idx=0; while(arr.length<model.keys){ arr.push(`${this.CHROMATIC[idx]}${oct}`); idx++; if(idx>=12){idx=0;oct++;} } return arr; },

  render(model,container,lightsRow,isPerf=false){
    if(!container) container=document.getElementById('keyboard-container');
    if(!lightsRow) lightsRow=document.getElementById('lesson-lights-row');
    this.noteArray=this.buildNoteArray(model);
    container.innerHTML=''; if(lightsRow) lightsRow.innerHTML='';
    this.keysDown.clear();
    const mobile=window.innerWidth<680;
    const ww=isPerf?36:(mobile?24:34), bw=isPerf?18:(mobile?15:21), gap=1;
    const whites=this.noteArray.filter(n=>!this._isBlack(n));
    container.style.width=(whites.length*(ww+gap))+'px';
    container.style.height=(isPerf?120:mobile?84:110)+'px';
    let whiteX=0;
    this.noteArray.forEach(note=>{
      const isBlk=this._isBlack(note);
      const key=document.createElement('div');
      key.className=`key ${isBlk?'black':'white'}`; key.dataset.note=note;
      if(!isBlk){
        key.style.left=whiteX+'px';
        const kb=Object.entries(this.KB_MAP).find(([k,v])=>v===note);
        if(kb&&!isPerf){ const lbl=document.createElement('span'); lbl.className='key-label'; lbl.textContent=kb[0].toUpperCase(); key.appendChild(lbl); }
        if(lightsRow&&model.hasLessonLights){ const l=document.createElement('div'); l.className='lesson-light'+(isPerf?' perf-light':''); l.dataset.note=note; lightsRow.appendChild(l); }
        whiteX+=ww+gap;
      } else { key.style.left=(whiteX-Math.floor(bw/2))+'px'; }
      const press=e=>{ e.preventDefault(); this.pressKey(note); };
      const release=e=>{ e.preventDefault(); this.releaseKey(note); };
      key.addEventListener('mousedown',press);
      key.addEventListener('mouseenter',e=>{ if(e.buttons===1) this.pressKey(note); });
      key.addEventListener('mouseup',release);
      key.addEventListener('mouseleave',release);
      key.addEventListener('touchstart',press,{passive:false});
      key.addEventListener('touchend',release,{passive:false});
      key.addEventListener('touchcancel',release,{passive:false});
      container.appendChild(key);
    });
  },

  pressKey(note){
    if(this.keysDown.has(note)) return; this.keysDown.add(note);
    const model=ModelRegistry.getById(App.state.modelId);
    const poly=App.state.polyphony||model.polyphony;
    AudioEngine.playNote(note,App.state.voiceId,poly,1,App.state.octaveShift);
    document.querySelectorAll(`.key[data-note="${note}"]`).forEach(k=>{ k.classList.add('pressed'); k._pressedAt=performance.now(); });
    if(LessonEngine.active) LessonEngine.handleKey(note);
    if(ArcadeEngine.active) ArcadeEngine.handleKey(note);
    AchievementEngine.onKeyPress();
  },
  releaseKey(note){
    if(!this.keysDown.has(note)) return; this.keysDown.delete(note);
    AudioEngine.stopNote(note);
    document.querySelectorAll(`.key[data-note="${note}"]`).forEach(k=>{
      k.classList.remove('pressed');
      if(SequencerEngine.recording&&k._pressedAt){ const dur=(performance.now()-k._pressedAt)/1000; SequencerEngine.addNote(note,Math.max(.05,dur)); delete k._pressedAt; }
    });
  },
  releaseAll(){ [...this.keysDown].forEach(n=>this.releaseKey(n)); },

  attachKeyboard(){
    document.addEventListener('keydown',e=>{
      if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.repeat) return;
      const note=this.KB_MAP[e.key.toLowerCase()];
      if(note){ e.preventDefault(); this.pressKey(note); return; }
      if(e.key==='['||e.key===','){ e.preventDefault(); App.octaveDown(); }
      if(e.key===']'||e.key==='.'){ e.preventDefault(); App.octaveUp(); }
      if(e.key==='Escape'){ PerformanceMode.exit(); }
    });
    document.addEventListener('keyup',e=>{ const note=this.KB_MAP[e.key.toLowerCase()]; if(note) this.releaseKey(note); });
    window.addEventListener('blur',()=>this.releaseAll());
  }
};

/* =========================================
   LESSON ENGINE — 5 modes, difficulty-aware scoring
   ========================================= */
const LessonEngine = {
  active:false, mode:'watch', song:null, noteIdx:0, score:0, errors:0,
  _watchTimers:[], _startMs:0,
  MODE_DESC:{
    watch:'WATCH: app plays the song and lights the keys. Just listen.',
    slow:'SLOW: same as Watch at half tempo.',
    follow:'FOLLOW: the light stays until you press the right key.',
    practice:"PRACTICE: lights guide you, mistakes don't stop you.",
    challenge:'CHALLENGE: scored — every error is counted.'
  },
  load(songId){ const song=SongLibrary.get(songId); if(!song) return false; this.song=song; this.noteIdx=0; this.score=0; this.errors=0; return true; },
  start(mode){
    if(!this.song){ UI.toast('Select a song first'); return; }
    this.stop(); this.mode=mode; this.active=true;
    this.noteIdx=0; this.score=0; this.errors=0; this._startMs=Date.now();
    UI.setMode('LESSON'); UI.clearLessonLights();
    if(mode==='watch'||mode==='slow') this._runWatch(mode==='slow'?.5:1);
    else this._lightNext();
  },
  stop(){ this.active=false; this._watchTimers.forEach(t=>clearTimeout(t)); this._watchTimers=[]; AudioEngine.stopAllNotes(); UI.clearLessonLights(); UI.setMode('STOP'); },
  _lightNext(){ UI.clearLessonLights(); if(this.noteIdx>=this.song.notes.length){ this._finish(); return; } UI.lightKey(this.song.notes[this.noteIdx].n,'target'); },
  handleKey(note){
    if(!this.active||this.mode==='watch'||this.mode==='slow') return;
    const expected=this.song.notes[this.noteIdx]; if(!expected) return;
    const diffMult={easy:1.2,normal:1,hard:.8}[App.state.difficulty]||1;
    if(note===expected.n){
      this.score+=Math.round(10*diffMult); UI.clearLessonLights(); this.noteIdx++;
      if(this.noteIdx>=this.song.notes.length) setTimeout(()=>this._finish(),200); else this._lightNext();
    } else {
      if(this.mode==='challenge'||this.mode==='follow'){ this.errors++; }
      AudioEngine.playError(); UI.flashKey(note,'wrong');
    }
  },
  _runWatch(speed){
    let t=0; const bps=(this.song.tempo*speed)/60;
    this.song.notes.forEach((nd,i)=>{
      const dur=nd.d/bps;
      const t1=setTimeout(()=>{
        if(!this.active) return;
        UI.clearLessonLights(); UI.lightKey(nd.n,'target');
        AudioEngine.playNote(nd.n,App.state.voiceId,1,.72,App.state.octaveShift);
        const t2=setTimeout(()=>{ if(!this.active) return; AudioEngine.stopNote(nd.n); UI.clearLessonLights(); if(i===this.song.notes.length-1) setTimeout(()=>this.stop(),300); },dur*1000);
        this._watchTimers.push(t2);
      },t*1000);
      this._watchTimers.push(t1); t+=dur;
    });
  },
  _finish(){
    this.active=false; UI.clearLessonLights(); AudioEngine.playSuccess(); UI.setMode('STOP');
    const elapsed=(Date.now()-this._startMs)/1000, total=this.song.notes.length;
    const diffMult={easy:1.2,normal:1,hard:.8}[App.state.difficulty]||1;
    const acc=total>0?Math.round(this.score/(total*10*diffMult)*100):100;
    const stars=acc>=95?3:acc>=72?2:1;
    UI.showLessonResult(this.score,acc,elapsed,stars);
    const key=`ls_${App.state.modelId}_${this.song.id}`, prev=App.state.lessonProgress[key]||0;
    if(stars>prev){ App.state.lessonProgress[key]=stars; App.autosave(); }
    AchievementEngine.onLessonComplete(stars,acc);
  }
};

/* =========================================
   DEMO ENGINE
   ========================================= */
const DemoEngine = {
  playing:false, _timers:[],
  play(model){
    this.stop(); const song=SongLibrary.get(model.demoSong); if(!song) return;
    this.playing=true; UI.setMode('DEMO'); UI.lcdMsg('DEMO PLAY ►');
    let t=0; const bps=song.tempo/60;
    song.notes.forEach((nd,i)=>{
      const dur=nd.d/bps;
      const t1=setTimeout(()=>{
        if(!this.playing) return;
        AudioEngine.playNote(nd.n,model.defaultVoice,1,.75,0);
        document.querySelectorAll(`.key[data-note="${nd.n}"]`).forEach(k=>k.classList.add('pressed'));
        document.querySelectorAll(`.lesson-light[data-note="${nd.n}"]`).forEach(l=>l.classList.add('lit'));
        const t2=setTimeout(()=>{ AudioEngine.stopNote(nd.n); document.querySelectorAll(`.key[data-note="${nd.n}"]`).forEach(k=>k.classList.remove('pressed')); document.querySelectorAll(`.lesson-light[data-note="${nd.n}"]`).forEach(l=>l.classList.remove('lit')); if(i===song.notes.length-1) this.stop(); },dur*1000);
        this._timers.push(t2);
      },t*1000);
      this._timers.push(t1); t+=dur;
    });
  },
  stop(){ this.playing=false; this._timers.forEach(t=>clearTimeout(t)); this._timers=[]; AudioEngine.stopAllNotes(); document.querySelectorAll('.key.pressed').forEach(k=>k.classList.remove('pressed')); document.querySelectorAll('.lesson-light.lit').forEach(l=>l.classList.remove('lit')); UI.setMode('STOP'); UI.lcdMsg('READY — PRESS A KEY'); document.getElementById('btn-demo')?.classList.remove('active'); }
};

/* =========================================
   ARCADE ENGINE — lives, combo, scored learning
   ========================================= */
const ArcadeEngine = {
  active:false, song:null, noteIdx:0, score:0, combo:0, maxCombo:0,
  lives:3, _noteTimer:null, _timeLimitMs:3000, _startMs:0,
  DIFF_LIVES:{ easy:5, normal:3, hard:2 },
  DIFF_TIME:{ easy:4000, normal:3000, hard:1800 },
  load(songId){ const s=SongLibrary.get(songId); if(!s||s.difficulty===0) return false; this.song=s; return true; },
  start(){
    if(!this.song){ UI.toast('Pick a song first'); return; }
    this.active=true; this.noteIdx=0; this.score=0; this.combo=0; this.maxCombo=0;
    this.lives=this.DIFF_LIVES[App.state.difficulty]||3;
    this._timeLimitMs=this.DIFF_TIME[App.state.difficulty]||3000;
    this._startMs=Date.now();
    document.getElementById('arcade-pre').classList.add('hidden');
    document.getElementById('arcade-result').classList.add('hidden');
    document.getElementById('arcade-hud').classList.remove('hidden');
    UI.setMode('ARCADE'); UI.clearLessonLights();
    this._updateHud(); this._showNext();
    AchievementEngine.onArcadeStart();
  },
  _showNext(){
    clearTimeout(this._noteTimer); UI.clearLessonLights();
    if(this.noteIdx>=this.song.notes.length){ this._finish(); return; }
    const nd=this.song.notes[this.noteIdx];
    UI.lightKey(nd.n,'target');
    document.querySelectorAll(`.key[data-note="${nd.n}"]`).forEach(k=>k.classList.add('arcade-target'));
    document.getElementById('arcade-note-name').textContent=nd.n;
    document.getElementById('arcade-progress-fill').style.width=(this.noteIdx/this.song.notes.length*100)+'%';
    this._noteTimer=setTimeout(()=>this._miss(),this._timeLimitMs);
  },
  handleKey(note){
    if(!this.active) return;
    const expected=this.song.notes[this.noteIdx]; if(!expected) return;
    document.querySelectorAll('.key.arcade-target').forEach(k=>k.classList.remove('arcade-target'));
    if(note===expected.n){
      clearTimeout(this._noteTimer);
      this.combo++; if(this.combo>this.maxCombo) this.maxCombo=this.combo;
      const mult=App.state.difficulty==='hard'?2:App.state.difficulty==='easy'?.7:1;
      this.score+=Math.round(10*(1+Math.floor(this.combo/5))*mult);
      AudioEngine.playCoin(); this.noteIdx++; this._updateHud(); this._showNext();
    } else { this._miss(); }
  },
  _miss(){
    clearTimeout(this._noteTimer);
    document.querySelectorAll('.key.arcade-target').forEach(k=>k.classList.remove('arcade-target'));
    this.lives--; this.combo=0; AudioEngine.playError(); this._updateHud();
    if(this.lives<=0){ this._finish(); return; }
    this.noteIdx=Math.min(this.noteIdx+1,this.song.notes.length);
    setTimeout(()=>this._showNext(),400);
  },
  _updateHud(){
    document.getElementById('arcade-score-display').textContent=this.score;
    document.getElementById('arcade-combo-display').textContent=`COMBO ×${this.combo}`;
    document.getElementById('arcade-lives-display').textContent='♥'.repeat(Math.max(0,this.lives))+'♡'.repeat(Math.max(0,5-this.lives));
  },
  _finish(){
    this.active=false; clearTimeout(this._noteTimer); UI.clearLessonLights(); UI.setMode('STOP');
    document.getElementById('arcade-hud').classList.add('hidden');
    document.getElementById('arcade-result').classList.remove('hidden');
    const won=this.lives>0&&this.noteIdx>=this.song.notes.length;
    document.getElementById('arcade-result-title').textContent=won?'🏆 STAGE CLEAR!':'💀 GAME OVER';
    document.getElementById('arcade-result-score').textContent=`Score: ${this.score}`;
    document.getElementById('arcade-result-combo').textContent=`Max Combo: ×${this.maxCombo}`;
    const key=`arcade_${this.song.id}`, prev=App.state.highscores[key]||0;
    if(this.score>prev){ App.state.highscores[key]=this.score; App.autosave(); }
    AchievementEngine.onArcadeEnd(this.score,won,this.maxCombo);
  },
  quit(){ this.active=false; clearTimeout(this._noteTimer); UI.clearLessonLights(); UI.setMode('STOP'); document.getElementById('arcade-hud')?.classList.add('hidden'); document.getElementById('arcade-pre')?.classList.remove('hidden'); }
};

/* =========================================
   SONG EDITOR ENGINE — visual step editor
   ========================================= */
const SongEditorEngine = {
  currentSong:null, editingSongId:null,
  newSong(){ this.currentSong={id:'custom_'+Date.now(),title:'My Song',difficulty:2,tempo:100,notes:[]}; this.editingSongId=null; this.renderGrid(); },
  loadSong(id){ const s=SongLibrary.get(id); if(!s) return; this.currentSong=JSON.parse(JSON.stringify(s)); this.editingSongId=id; this.renderGrid(); document.getElementById('se-song-name').value=s.title; document.getElementById('se-tempo').value=s.tempo; document.getElementById('se-diff').value=s.difficulty; this.renderSavedList(); },
  addNote(n,d){ if(!this.currentSong) this.newSong(); this.currentSong.notes.push({n,d:parseFloat(d)}); this.renderGrid(); },
  deleteNote(idx){ if(!this.currentSong) return; this.currentSong.notes.splice(idx,1); this.renderGrid(); },
  renderGrid(){
    const grid=document.getElementById('se-grid'); if(!grid) return; grid.innerHTML='';
    if(!this.currentSong||!this.currentSong.notes.length){ grid.innerHTML='<div style="color:var(--label);font-size:.7rem;padding:8px">No notes yet — add notes below ↓</div>'; return; }
    this.currentSong.notes.forEach((nd,i)=>{
      const cell=document.createElement('div'); cell.className='se-cell';
      cell.innerHTML=`<div class="se-note">${nd.n}</div><div class="se-dur">${nd.d}b</div><span class="se-del" data-idx="${i}">✕</span>`;
      cell.addEventListener('click',()=>{ AudioEngine.resume(); AudioEngine.playNote(nd.n,App.state.voiceId,1,.7,App.state.octaveShift); setTimeout(()=>AudioEngine.stopNote(nd.n),400); });
      cell.querySelector('.se-del').addEventListener('click',e=>{ e.stopPropagation(); this.deleteNote(i); });
      grid.appendChild(cell);
    });
  },
  saveSong(){
    if(!this.currentSong) return;
    this.currentSong.title=document.getElementById('se-song-name').value||'My Song';
    this.currentSong.tempo=parseInt(document.getElementById('se-tempo').value)||100;
    this.currentSong.difficulty=parseInt(document.getElementById('se-diff').value)||2;
    if(!this.currentSong.id) this.currentSong.id='custom_'+Date.now();
    if(!this.currentSong.notes.length){ UI.toast('Add some notes first'); return; }
    SongLibrary.saveCustom(this.currentSong); this.editingSongId=this.currentSong.id;
    this.renderSavedList(); UI.toast('Song saved: '+this.currentSong.title);
    AchievementEngine.onSongCreated();
  },
  listen(){
    if(!this.currentSong||!this.currentSong.notes.length){ UI.toast('No notes to play'); return; }
    AudioEngine.resume();
    const bps=(parseInt(document.getElementById('se-tempo').value)||100)/60; let t=0;
    this.currentSong.notes.forEach((nd,i)=>{
      const dur=nd.d/bps;
      setTimeout(()=>{
        AudioEngine.playNote(nd.n,App.state.voiceId,1,.7,App.state.octaveShift);
        const cell=document.querySelectorAll('.se-cell')[i];
        if(cell){ cell.style.background='var(--btn-active)'; setTimeout(()=>cell.style.background='',dur*800); }
        setTimeout(()=>AudioEngine.stopNote(nd.n),dur*1000);
      },t*1000);
      t+=dur;
    });
  },
  exportSong(){
    if(!this.currentSong) return;
    const blob=new Blob([JSON.stringify(this.currentSong,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url; a.download=`pockettone_song_${this.currentSong.id}.json`; a.click(); URL.revokeObjectURL(url);
  },
  importSong(){
    const inp=document.createElement('input'); inp.type='file'; inp.accept='.json';
    inp.addEventListener('change',e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{ try{ const data=JSON.parse(ev.target.result); if(!data.notes) throw new Error('Invalid'); data.id='custom_'+Date.now(); this.currentSong=data; document.getElementById('se-song-name').value=data.title||'Imported'; document.getElementById('se-tempo').value=data.tempo||100; this.renderGrid(); UI.toast('Song imported: '+(data.title||'')); }catch(err){ UI.toast('Invalid song file'); } }; r.readAsText(f); });
    inp.click();
  },
  renderSavedList(){
    const c=document.getElementById('se-saved-songs'); if(!c) return; c.innerHTML='';
    SongLibrary.getCustom().forEach(s=>{
      const btn=document.createElement('button'); btn.className='saved-song-btn'+(this.editingSongId===s.id?' active':''); btn.textContent=s.title;
      btn.addEventListener('click',()=>this.loadSong(s.id));
      const del=document.createElement('span'); del.textContent=' ✕'; del.style.cursor='pointer'; del.style.color='var(--accent2)';
      del.addEventListener('click',e=>{ e.stopPropagation(); if(confirm('Delete "'+s.title+'"?')){ SongLibrary.deleteCustom(s.id); this.renderSavedList(); } });
      btn.appendChild(del); c.appendChild(btn);
    });
  },
  populateNoteSelect(){
    const sel=document.getElementById('se-note-select'); if(!sel||sel.children.length) return; sel.innerHTML='';
    ['C3','D3','E3','F3','G3','A3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5','F5','F#5','G5','G#5','A5','A#5','B5','C6'].forEach(n=>{ const o=document.createElement('option'); o.value=n; o.textContent=n; if(n==='C4')o.selected=true; sel.appendChild(o); });
  }
};

/* =========================================
   RHYTHM EDITOR ENGINE — step sequencer grid
   ========================================= */
const RhythmEditorEngine = {
  TRACKS:['kick','snare','hihat','clap','clave','tom','blip'],
  steps:16, sig:4, pattern:null, _previewPlaying:false, _customPatterns:[], _currentHighlight:-1,
  init(){ this._customPatterns=Storage.loadCustomPatterns(); RhythmEngine.customPatterns=this._customPatterns; this.newPattern(); },
  newPattern(){ const p={id:'custom_'+Date.now(),name:'My Pattern',sig:this.sig,steps:this.steps,tracks:{}}; this.TRACKS.forEach(t=>p.tracks[t]=Array(this.steps).fill(0)); this.pattern=p; this.renderGrid(); this.renderSaved(); },
  setSteps(n){ this.steps=n; if(!this.pattern) return; this.pattern.steps=n; this.TRACKS.forEach(t=>{ const cur=this.pattern.tracks[t]||[]; this.pattern.tracks[t]=Array(n).fill(0).map((_,i)=>cur[i]||0); }); this.renderGrid(); },
  setSig(n){ this.sig=n; if(this.pattern) this.pattern.sig=n; this.renderGrid(); },
  toggle(track,step){ if(!this.pattern) return; this.pattern.tracks[track][step]^=1; this.renderGrid(); },
  clearAll(){ if(!this.pattern) return; this.TRACKS.forEach(t=>this.pattern.tracks[t]=Array(this.steps).fill(0)); this.renderGrid(); },
  renderGrid(){
    const grid=document.getElementById('re-grid'); if(!grid) return; grid.innerHTML='';
    const steps=this.pattern?.steps||16, sig=this.pattern?.sig||4, stepsPerBeat=steps/sig;
    this.TRACKS.forEach(track=>{
      const row=document.createElement('div'); row.className='re-row';
      const label=document.createElement('div'); label.className='re-track-label'; label.textContent=track.toUpperCase(); row.appendChild(label);
      for(let i=0;i<steps;i++){
        const cell=document.createElement('div');
        cell.className='re-step'+(this.pattern?.tracks[track][i]?' active':'')+(i%stepsPerBeat===0?' beat-marker':'')+(i===this._currentHighlight?' playing':'');
        cell.dataset.track=track; cell.dataset.step=i;
        cell.addEventListener('click',()=>this.toggle(track,i));
        row.appendChild(cell);
      }
      grid.appendChild(row);
    });
  },
  highlightStep(step){ const m=document.getElementById('modal-rhythm-editor'); if(!m||m.classList.contains('hidden')) return; this._currentHighlight=step; this.renderGrid(); },
  savePattern(){
    if(!this.pattern) return;
    this.pattern.name=document.getElementById('re-name').value||'My Pattern';
    this.pattern.steps=this.steps; this.pattern.sig=this.sig;
    const ex=this._customPatterns.findIndex(p=>p.id===this.pattern.id);
    if(ex>=0) this._customPatterns[ex]=this.pattern; else this._customPatterns.push(this.pattern);
    Storage.saveCustomPatterns(this._customPatterns);
    RhythmEngine.customPatterns=this._customPatterns;
    App.state.rhythmId=this.pattern.id;
    this.stopPreview();
    RhythmEngine.start(this.pattern.id,App.state.bpm);
    document.getElementById('btn-rhythm-play').textContent='■ BEAT';
    document.getElementById('btn-rhythm-play').classList.add('running');
    UI.buildRhythmButtons(ModelRegistry.getById(App.state.modelId));
    this.renderSaved(); UI.toast('Pattern active: '+this.pattern.name);
    AchievementEngine.onPatternCreated();
  },
  renderSaved(){
    const c=document.getElementById('re-saved-patterns'); if(!c) return; c.innerHTML='';
    this._customPatterns.forEach(p=>{
      const btn=document.createElement('button'); btn.className='re-saved-btn'; btn.textContent=p.name;
      btn.addEventListener('click',()=>{ this.pattern=JSON.parse(JSON.stringify(p)); this.steps=p.steps; this.sig=p.sig; document.getElementById('re-name').value=p.name; document.getElementById('re-steps').value=p.steps; document.getElementById('re-sig').value=p.sig; this.renderGrid(); });
      const del=document.createElement('span'); del.textContent=' ✕'; del.style.cursor='pointer'; del.style.color='var(--accent2)';
      del.addEventListener('click',e=>{ e.stopPropagation(); if(confirm('Delete "'+p.name+'"?')){ this._customPatterns=this._customPatterns.filter(x=>x.id!==p.id); Storage.saveCustomPatterns(this._customPatterns); RhythmEngine.customPatterns=this._customPatterns; this.renderSaved(); UI.buildRhythmButtons(ModelRegistry.getById(App.state.modelId)); } });
      btn.appendChild(del); c.appendChild(btn);
    });
  },
  preview(){ if(this._previewPlaying){ this.stopPreview(); return; } this._previewPlaying=true; if(!this._customPatterns.find(p=>p.id===this.pattern.id)) RhythmEngine.customPatterns=[this.pattern,...this._customPatterns]; RhythmEngine.start(this.pattern.id,App.state.bpm); document.getElementById('re-play').textContent='■ STOP'; },
  stopPreview(){ this._previewPlaying=false; this._currentHighlight=-1; RhythmEngine.customPatterns=this._customPatterns; RhythmEngine.stop(); const b=document.getElementById('re-play'); if(b) b.textContent='▶ PREVIEW'; this.renderGrid(); }
};

/* =========================================
   PRESET ENGINE — editable voice params
   ========================================= */
const PresetEngine = {
  PRESETS:{
    'Warm Piano':    {voice:'piano-toy',       params:{fHz:2800,fQ:.8, A:.005,D:.15,S:.28,R:.9,  vAmt:0}},
    'Bright Piano':  {voice:'piano-bright',    params:{fHz:5000,fQ:.7, A:.003,D:.08,S:.3, R:.55, vAmt:0}},
    'Dark Strings':  {voice:'strings-ensemble',params:{fHz:1400,fQ:2,  A:.25,D:.12,S:.7, R:1.0, vAmt:16}},
    'Soft Choir':    {voice:'digital-choir',   params:{fHz:2800,fQ:1.2,A:.3, D:.15,S:.75,R:.8,  vAmt:10}},
    'Lo-Fi Bell':    {voice:'fantasy-bell',    params:{fHz:4000,fQ:.4, A:.001,D:.5, S:.1, R:1.2, vAmt:1}},
    'Synth Growl':   {voice:'synth-lead',      params:{fHz:1200,fQ:6,  A:.015,D:.2, S:.65,R:.25, vAmt:6}},
    'Deep Bass':     {voice:'synth-bass',      params:{fHz:600, fQ:6,  A:.004,D:.2, S:.45,R:.14, vAmt:0}},
    'Toy Box':       {voice:'music-box',       params:{fHz:9000,fQ:.3, A:.001,D:.6, S:.02,R:1.0, vAmt:0}},
    'Space Choir':   {voice:'space-pad',       params:{fHz:800, fQ:6,  A:.4,  D:.25,S:.65,R:1.6, vAmt:15}},
    'Crispy Organ':  {voice:'organ-mini',      params:{fHz:2400,fQ:.6, A:.005,D:.01,S:.92,R:.05, vAmt:6}},
  },
  customPresets:{}, selectedPreset:null,
  getParamNames(){ return ['A','D','S','R','fHz','fQ','vRate','vAmt']; },
  getParamLabel(k){ return {A:'Attack',D:'Decay',S:'Sustain',R:'Release',fHz:'Filter Hz',fQ:'Filter Q',vRate:'Vib Rate',vAmt:'Vib Depth'}[k]||k; },
  getParamRange(k){ return {A:[0,1,.005],D:[0,2,.01],S:[0,1,.01],R:[0,4,.01],fHz:[100,20000,10],fQ:[.1,20,.1],vRate:[0,15,.1],vAmt:[0,30,.5]}[k]||[0,100,1]; },
  renderList(){
    const c=document.getElementById('preset-list'); if(!c) return; c.innerHTML='';
    const allP={...this.PRESETS,...this.customPresets};
    Object.entries(allP).forEach(([name,p])=>{
      const btn=document.createElement('button'); btn.className='preset-btn'+(this.selectedPreset===name?' selected':'');
      btn.innerHTML=`<span class="preset-name">${name}</span><span class="preset-type">${p.voice.replace(/-/g,' ')}</span>`;
      btn.addEventListener('click',()=>{ this.selectedPreset=name; this.renderList(); this.renderEditor(name,p); });
      c.appendChild(btn);
    });
  },
  renderEditor(name,preset){
    document.getElementById('preset-editing-name').textContent=name;
    const c=document.getElementById('preset-params'); if(!c) return; c.innerHTML='';
    const vp=AudioEngine.getVoiceParams(preset.voice), merged={...vp,...preset.params};
    const ov=AudioEngine.presetOverrides[preset.voice]||{};
    this.getParamNames().forEach(k=>{
      const [min,max,step]=this.getParamRange(k), val=ov[k]??merged[k]??0;
      const lbl=document.createElement('label'); lbl.textContent=this.getParamLabel(k);
      const slider=document.createElement('input'); slider.type='range'; slider.min=min; slider.max=max; slider.step=step; slider.value=val;
      const disp=document.createElement('span'); disp.textContent=parseFloat(val).toFixed(2);
      slider.addEventListener('input',e=>{ disp.textContent=parseFloat(e.target.value).toFixed(2); if(!AudioEngine.presetOverrides[preset.voice]) AudioEngine.presetOverrides[preset.voice]={}; AudioEngine.presetOverrides[preset.voice][k]=parseFloat(e.target.value); AudioEngine.resume(); AudioEngine.playNote('C4',preset.voice,1,.5,0); setTimeout(()=>AudioEngine.stopNote('C4'),500); });
      c.appendChild(lbl); c.appendChild(slider); c.appendChild(disp);
    });
  },
  applyPreset(){
    if(!this.selectedPreset) return;
    const allP={...this.PRESETS,...this.customPresets}, p=allP[this.selectedPreset]; if(!p) return;
    App.state.voiceId=p.voice;
    if(!AudioEngine.presetOverrides[p.voice]) AudioEngine.presetOverrides[p.voice]={};
    Object.assign(AudioEngine.presetOverrides[p.voice],p.params);
    UI.buildVoiceButtons(ModelRegistry.getById(App.state.modelId)); UI.updateLCD(); UI.toast('Preset applied: '+this.selectedPreset);
  },
  saveCustom(){
    if(!this.selectedPreset) return;
    const allP={...this.PRESETS,...this.customPresets}, p=allP[this.selectedPreset];
    const name=prompt('Name for custom preset:',this.selectedPreset+' Custom'); if(!name) return;
    const ov=AudioEngine.presetOverrides[p.voice]||{};
    this.customPresets[name]={voice:p.voice,params:{...p.params,...ov}};
    App.state.customPresets=this.customPresets; App.autosave(); this.renderList(); UI.toast('Saved: '+name);
  }
};

/* =========================================
   ACHIEVEMENT ENGINE — 12 unlockables
   ========================================= */
const AchievementEngine = {
  DEFS:[
    {id:'first_key',  icon:'🎹',name:'First Note', desc:'Press your first key'},
    {id:'lesson_1',   icon:'⭐',name:'Gold Star',  desc:'Complete a lesson with 3 stars'},
    {id:'lesson_10',  icon:'🎓',name:'Graduate',   desc:'Complete 10 lessons total'},
    {id:'arcade_win', icon:'🏆',name:'Stage Clear',desc:'Win an arcade round'},
    {id:'arcade_100', icon:'💯',name:'Century',    desc:'Score 100+ in arcade'},
    {id:'all_models', icon:'📦',name:'Collector',  desc:'Try all 6 keyboard models'},
    {id:'record_seq', icon:'⏺', name:'Composer',   desc:'Record a sequence with 10+ notes'},
    {id:'custom_song',icon:'✏', name:'Songwriter', desc:'Create and save a custom song'},
    {id:'custom_beat',icon:'⬛',name:'Beat Maker',  desc:'Create a custom rhythm pattern'},
    {id:'all_voices', icon:'🔊',name:'Tone Seeker', desc:'Try every voice in the archive'},
    {id:'secret_vl',  icon:'🖩', name:'Calculator Hero',desc:'Play 20 notes on the Pocket VL'},
    {id:'marathon',   icon:'⏱', name:'Marathon',   desc:'Play for 5+ minutes in one session'},
  ],
  unlocked:new Set(),
  _lessonsComplete:0, _modelsUsed:new Set(), _voicesUsed:new Set(), _vlNotes:0, _sessionStart:Date.now(),
  load(state){ if(state?.achievements) state.achievements.forEach(id=>this.unlocked.add(id)); },
  save(){ return [...this.unlocked]; },
  unlock(id){ if(this.unlocked.has(id)) return; this.unlocked.add(id); const def=this.DEFS.find(d=>d.id===id); if(!def) return; this._showPopup(def); App.autosave(); },
  _showPopup(def){ const p=document.getElementById('achievement-popup'); document.getElementById('ach-icon').textContent=def.icon; document.getElementById('ach-title').textContent='🏆 '+def.name; document.getElementById('ach-desc').textContent=def.desc; p.classList.remove('hidden'); clearTimeout(this._popupTimer); this._popupTimer=setTimeout(()=>p.classList.add('hidden'),3500); },
  onKeyPress(){
    if(!this.unlocked.has('first_key')) this.unlock('first_key');
    if(App.state.modelId==='pocket-vl'){ this._vlNotes++; if(this._vlNotes>=20) this.unlock('secret_vl'); }
    this._voicesUsed.add(App.state.voiceId);
    if(this._voicesUsed.size>=Object.keys(AudioEngine.VOICE).length) this.unlock('all_voices');
    if((Date.now()-this._sessionStart)>300000) this.unlock('marathon');
  },
  onModelChange(id){ this._modelsUsed.add(id); if(this._modelsUsed.size>=6) this.unlock('all_models'); },
  onLessonComplete(stars){ this._lessonsComplete++; if(stars===3) this.unlock('lesson_1'); if(this._lessonsComplete>=10) this.unlock('lesson_10'); },
  onArcadeStart(){},
  onArcadeEnd(score,won){ if(won) this.unlock('arcade_win'); if(score>=100) this.unlock('arcade_100'); },
  onSongCreated(){ this.unlock('custom_song'); },
  onPatternCreated(){ this.unlock('custom_beat'); },
  onNoteRecorded(count){ if(count>=10) this.unlock('record_seq'); },
  renderModal(){
    const c=document.getElementById('achievements-content'); if(!c) return; c.innerHTML='';
    this.DEFS.forEach(def=>{ const card=document.createElement('div'); const locked=!this.unlocked.has(def.id); card.className='ach-card'+(locked?' ach-locked':' unlocked'); card.innerHTML=`<div class="ach-icon">${def.icon}</div><div class="ach-name">${def.name}</div><div class="ach-desc">${locked?'???':def.desc}</div>`; c.appendChild(card); });
  }
};

/* =========================================
   PERFORMANCE MODE — fullscreen overlay
   ========================================= */
const PerformanceMode = {
  active:false,
  enter(){
    this.active=true;
    document.getElementById('perf-overlay').classList.remove('hidden');
    const model=ModelRegistry.getById(App.state.modelId);
    document.getElementById('perf-model-name').textContent=model.name.toUpperCase()+' — '+model.era;
    document.getElementById('perf-message').textContent='PERFORMANCE MODE — '+model.tagline.toUpperCase();
    const vsel=document.getElementById('perf-voice-select'); vsel.innerHTML='';
    model.voices.forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v.replace(/-/g,' ').toUpperCase(); o.selected=v===App.state.voiceId; vsel.appendChild(o); });
    vsel.onchange=e=>{ App.state.voiceId=e.target.value; document.getElementById('perf-voice').textContent=e.target.value.replace(/-/g,' ').toUpperCase(); };
    document.getElementById('perf-voice').textContent=App.state.voiceId.replace(/-/g,' ').toUpperCase();
    document.getElementById('perf-bpm').textContent='♩'+App.state.bpm;
    document.getElementById('perf-oct').textContent=(App.state.octaveShift>=0?'+':'')+App.state.octaveShift;
    KeyboardEngine.render(model,document.getElementById('perf-keyboard'),document.getElementById('perf-lights-row'),true);
    if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{});
  },
  exit(){
    if(!this.active) return;
    this.active=false;
    document.getElementById('perf-overlay').classList.add('hidden');
    KeyboardEngine.releaseAll();
    // restore main keyboard (perf render overwrote KeyboardEngine.noteArray binding targets)
    KeyboardEngine.render(ModelRegistry.getById(App.state.modelId));
    if(document.exitFullscreen&&document.fullscreenElement) document.exitFullscreen().catch(()=>{});
  }
};

/* =========================================
   SKIN ENGINE
   ========================================= */
const SkinEngine = {
  MODEL_CLASS:{'cream-gray':'msk-cream-gray','white-red':'msk-white-red','gray-blue':'msk-gray-blue','black-gray':'msk-black-gray','silver-black':'msk-silver-black','blue-yellow':'msk-blue-yellow'},
  apply(skinId,modelSkin){
    const body=document.body;
    body.className=body.className.replace(/skin-\S+/g,'').replace(/msk-\S+/g,'').trim();
    if(skinId==='auto') body.classList.add(this.MODEL_CLASS[modelSkin]||'msk-cream-gray');
    else body.classList.add(`skin-${skinId}`);
  }
};

/* =========================================
   UI MODULE
   ========================================= */
const UI = {
  _toastTimer:null,
  setMode(m){ App.state.mode=m; document.getElementById('lcd-mode-badge').textContent=m; },
  lcdMsg(msg){ document.getElementById('lcd-message').textContent=msg; },
  updateLCD(){
    const m=ModelRegistry.getById(App.state.modelId); if(!m) return;
    document.getElementById('lcd-model').textContent=m.name.toUpperCase();
    document.getElementById('lcd-voice').textContent=App.state.voiceId.replace(/-/g,' ').toUpperCase();
    document.getElementById('lcd-rhythm-name').textContent=(RhythmEngine.getPattern(App.state.rhythmId)?.name||App.state.rhythmId).replace(/-/g,' ').toUpperCase();
    document.getElementById('lcd-bpm').textContent='♩'+App.state.bpm;
    document.getElementById('lcd-octave').textContent='OCT '+(App.state.octaveShift>=0?'+':'')+App.state.octaveShift;
    document.getElementById('lcd-diff').textContent=App.state.difficulty.toUpperCase();
    this.refreshSeqCounter();
  },
  updateModelStrip(model){
    document.getElementById('model-strip-name').textContent=model.name.toUpperCase()+' — '+model.tagline;
    document.getElementById('model-strip-era').textContent=model.era;
    ['sled-0','sled-1','sled-2','sled-3'].forEach((id,i,a)=>{ document.getElementById(id)?.classList.toggle('active',i===a.length-1); });
  },
  refreshSeqCounter(){
    const m=ModelRegistry.getById(App.state.modelId), n=SequencerEngine.sequence.length, lim=m?.sequencerLimit||100;
    document.getElementById('seq-counter').textContent=`${n} / ${lim} notes`;
    document.getElementById('lcd-memory').textContent=`MEM ${n}/${lim}`;
  },
  updateBeatLeds(beat){ for(let i=0;i<4;i++) document.getElementById(`beat-${i}`)?.classList.toggle('on',i===beat); },
  buildVoiceButtons(model){
    const c=document.getElementById('voice-buttons'); c.innerHTML='';
    model.voices.forEach(v=>{
      const btn=document.createElement('button'); btn.className='voice-btn'+(v===App.state.voiceId?' active':''); btn.textContent=v.replace(/-/g,' ').toUpperCase();
      btn.addEventListener('click',()=>{ App.state.voiceId=v; c.querySelectorAll('.voice-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); this.updateLCD(); App.autosave(); });
      c.appendChild(btn);
    });
  },
  buildRhythmButtons(model){
    const c=document.getElementById('rhythm-buttons'); c.innerHTML='';
    const allIds=[...model.rhythms,...RhythmEngine.customPatterns.map(p=>p.id)];
    allIds.forEach(r=>{
      const pat=RhythmEngine.getPattern(r), label=(pat?.name||r.replace(/-/g,' ')).toUpperCase();
      const btn=document.createElement('button'); btn.className='rhythm-btn'+(r===App.state.rhythmId?' active':''); btn.textContent=label.length>12?label.slice(0,11)+'…':label;
      btn.addEventListener('click',()=>{ App.state.rhythmId=r; c.querySelectorAll('.rhythm-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); this.updateLCD(); if(RhythmEngine.running) RhythmEngine.start(r,App.state.bpm); App.autosave(); });
      c.appendChild(btn);
    });
  },
  buildLessonList(model,tab='built-in'){
    const c=document.getElementById('lesson-song-list'); c.innerHTML='';
    const songs=tab==='built-in'?model.lessonSongs:SongLibrary.getCustom().map(s=>s.id);
    if(!songs.length){ c.innerHTML='<div style="color:var(--label);font-size:.7rem;padding:8px">No songs yet. Use the Song Editor to create one.</div>'; return; }
    songs.forEach(sid=>{
      const song=SongLibrary.get(sid); if(!song) return;
      const prog=App.state.lessonProgress[`ls_${model.id}_${sid}`]||0, stars='⭐'.repeat(prog)+'☆'.repeat(3-prog);
      const btn=document.createElement('button'); btn.className='lsong-btn';
      btn.innerHTML=`<b>${song.title}</b><span class="lsong-diff">${'●'.repeat(song.difficulty||1)}${'○'.repeat(3-(song.difficulty||1))}</span><span class="lsong-stars">${stars}</span>`;
      btn.addEventListener('click',()=>{ c.querySelectorAll('.lsong-btn').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); if(LessonEngine.load(sid)) this.lcdMsg(`♪ ${song.title.toUpperCase()}`); document.getElementById('lesson-result').classList.add('hidden'); });
      c.appendChild(btn);
    });
  },
  buildMuseum(){
    const c=document.getElementById('museum-content'); c.innerHTML='';
    ModelRegistry.getAll().forEach(model=>{
      const card=document.createElement('div'); card.className='museum-card'+(model.id===App.state.modelId?' active-model':'');
      const rCol={COMMON:'#5a9050',UNCOMMON:'#5070b0',RARE:'#a05820'}[model.rarity]||'#888';
      const voiceTags=model.voices.map(v=>`<span class="m-voice-tag">${v.replace(/-/g,' ')}</span>`).join('');
      card.innerHTML=`<div class="museum-card-header"><h3>${model.name} <span class="m-rarity" style="color:${rCol}">${model.rarity}</span></h3><div class="m-year">${model.era} — ${model.tagline}</div></div><div class="museum-card-body"><div class="m-specs"><span>Keys <b>${model.keys}</b></span><span>Poly <b>${model.polyphony}v</b></span><span>Memory <b>${model.sequencerLimit}</b></span><span>Voices <b>${model.voices.length}</b></span><span>Rhythms <b>${model.rhythms.length}</b></span><span>Songs <b>${model.lessonSongs.length}</b></span></div><div class="m-voices-preview">${voiceTags}</div><div class="m-desc">${model.description}</div><div class="m-quote">${model.catalogQuote}</div></div>`;
      card.addEventListener('click',()=>{ App.loadModel(model.id); document.getElementById('modal-museum').classList.add('hidden'); });
      c.appendChild(card);
    });
  },
  buildArcadeSongPick(){
    const c=document.getElementById('arcade-song-pick'); c.innerHTML='';
    const model=ModelRegistry.getById(App.state.modelId);
    model.lessonSongs.forEach(sid=>{
      const song=SongLibrary.get(sid); if(!song||song.difficulty===0) return;
      const hs=App.state.highscores[`arcade_${sid}`]||0;
      const btn=document.createElement('button'); btn.className='arcade-pick-btn';
      btn.innerHTML=`<b>${song.title}</b><br><span style="font-size:.58rem;opacity:.6">${'●'.repeat(song.difficulty)} · Best: ${hs}</span>`;
      btn.addEventListener('click',()=>{ document.querySelectorAll('.arcade-pick-btn').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); ArcadeEngine.load(sid); });
      c.appendChild(btn);
    });
    const hs=document.getElementById('arcade-highscores');
    const entries=Object.entries(App.state.highscores).filter(([k])=>k.startsWith('arcade_')).sort((a,b)=>b[1]-a[1]).slice(0,5);
    hs.innerHTML='<div style="font-size:.62rem;opacity:.6;margin-bottom:4px">TOP SCORES</div>'+(entries.length?entries.map(([k,v])=>`<div>${SongLibrary.get(k.replace('arcade_',''))?.title||k}: ${v}</div>`).join(''):'<div style="opacity:.5">No scores yet</div>');
  },
  showLessonResult(score,acc,elapsed,stars){
    const r=document.getElementById('lesson-result'); r.classList.remove('hidden');
    document.getElementById('lesson-stars-display').textContent='⭐'.repeat(stars)+'☆'.repeat(3-stars);
    document.getElementById('lesson-result-details').innerHTML=`Score: ${score} pts · Accuracy: ${acc}% · Time: ${elapsed.toFixed(1)}s`;
  },
  clearLessonLights(){
    document.querySelectorAll('.lesson-light,.perf-light').forEach(l=>l.classList.remove('lit','wrong'));
    document.querySelectorAll('.key').forEach(k=>k.classList.remove('lesson-target','lesson-wrong','arcade-target'));
  },
  lightKey(noteStr,type){
    document.querySelectorAll(`.key[data-note="${noteStr}"]`).forEach(k=>k.classList.add(type==='target'?'lesson-target':'lesson-wrong'));
    document.querySelectorAll(`.lesson-light[data-note="${noteStr}"],.perf-light[data-note="${noteStr}"]`).forEach(l=>l.classList.add(type==='target'?'lit':'wrong'));
  },
  flashKey(noteStr,type){
    this.lightKey(noteStr,type);
    setTimeout(()=>{ document.querySelectorAll(`.key[data-note="${noteStr}"]`).forEach(k=>k.classList.remove('lesson-wrong','lesson-target')); document.querySelectorAll(`.lesson-light[data-note="${noteStr}"],.perf-light[data-note="${noteStr}"]`).forEach(l=>l.classList.remove('wrong','lit')); },380);
  },
  refreshSlotButtons(){
    document.querySelectorAll('.slot-btn').forEach(btn=>{ const slot=+btn.dataset.slot, has=!!App.state.slots[slot]; btn.classList.toggle('has-data',has); btn.textContent=`SL${slot+1} ${has?'●':'—'}`; btn.title=has?'Click = SAVE · Shift+Click = LOAD':'Click = SAVE here'; });
  },
  toast(msg,ms=2200){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.remove('hidden'); clearTimeout(this._toastTimer); this._toastTimer=setTimeout(()=>t.classList.add('hidden'),ms); },
  bindModals(){
    document.querySelectorAll('.modal-close').forEach(btn=>{ btn.addEventListener('click',()=>document.getElementById(btn.dataset.target)?.classList.add('hidden')); });
    document.querySelectorAll('.modal').forEach(m=>{ m.addEventListener('click',e=>{ if(e.target===m) m.classList.add('hidden'); }); });
  }
};

/* =========================================
   APP — MAIN CONTROLLER
   ========================================= */
const App = {
  state:{
    modelId:'pocket-p1', skin:'auto', voiceId:'piano-toy', rhythmId:'march',
    bpm:108, masterVol:80, sustainPct:30, lofiPct:40, vibratoPct:20,
    tuneCents:0, driftPct:20, filterCutoff:70, polyphony:1, octaveShift:0,
    quantizeGrid:0.5, difficulty:'normal',
    currentSlot:0, slots:[null,null,null,null],
    lessonProgress:{}, highscores:{}, achievements:[], customPresets:{}, mode:'STOP'
  },

  autosave(){ this.state.achievements=AchievementEngine.save(); this.state.customPresets=PresetEngine.customPresets; Storage.save(this.state); },

  octaveDown(){ if(this.state.octaveShift<=-3) return; this.state.octaveShift--; this._updateOctDisplay(); this.autosave(); },
  octaveUp(){ if(this.state.octaveShift>=3) return; this.state.octaveShift++; this._updateOctDisplay(); this.autosave(); },
  _updateOctDisplay(){
    const s=(this.state.octaveShift>=0?'+':'')+this.state.octaveShift;
    document.getElementById('oct-display').textContent=s;
    document.getElementById('lcd-octave').textContent='OCT '+s;
    if(PerformanceMode.active) document.getElementById('perf-oct').textContent=s;
  },

  init(){
    const saved=Storage.load();
    if(saved){ Object.assign(this.state,saved); if(!Array.isArray(this.state.slots)) this.state.slots=[null,null,null,null]; }

    SongLibrary.loadCustomFromStorage(Storage.loadCustomSongs());
    PresetEngine.customPresets=this.state.customPresets||{};
    AchievementEngine.load(this.state);
    RhythmEditorEngine.init();
    AudioEngine.init();

    // Model selector
    const modelSel=document.getElementById('model-select');
    ModelRegistry.getAll().forEach(m=>{ const o=document.createElement('option'); o.value=m.id; o.textContent=`${m.name} (${m.era})`; modelSel.appendChild(o); });
    modelSel.value=this.state.modelId;
    modelSel.addEventListener('change',e=>this.loadModel(e.target.value));

    // Skin
    document.getElementById('skin-select').value=this.state.skin;
    document.getElementById('skin-select').addEventListener('change',e=>{ this.state.skin=e.target.value; SkinEngine.apply(this.state.skin,ModelRegistry.getById(this.state.modelId).skin); this.autosave(); });

    // FX sliders
    const bindSlider=(id,sk,fn)=>{ const el=document.getElementById(id); if(!el) return; el.value=this.state[sk]??el.value; el.addEventListener('input',e=>{ this.state[sk]=+e.target.value; if(fn) fn(+e.target.value); this.autosave(); }); };
    bindSlider('master-vol','masterVol',v=>AudioEngine.masterGain.gain.value=v/100);
    bindSlider('sustain-ctrl','sustainPct',v=>AudioEngine.settings.sustainPct=v/100);
    bindSlider('lofi-ctrl','lofiPct',v=>AudioEngine.settings.lofiPct=v/100);
    bindSlider('vibrato-ctrl','vibratoPct',v=>AudioEngine.settings.vibratoPct=v/100);

    // Tempo
    const tempoSlider=document.getElementById('tempo-slider'), tempoDisplay=document.getElementById('tempo-display');
    tempoSlider.value=this.state.bpm; tempoDisplay.textContent=this.state.bpm;
    tempoSlider.addEventListener('input',e=>{ this.state.bpm=+e.target.value; tempoDisplay.textContent=this.state.bpm; UI.updateLCD(); if(RhythmEngine.running) RhythmEngine.start(this.state.rhythmId,this.state.bpm); this.autosave(); });

    // Tap tempo
    let lastTap=0; const taps=[];
    document.getElementById('btn-tap').addEventListener('click',()=>{ const now=Date.now(); if(lastTap&&now-lastTap<2500){ taps.push(now-lastTap); if(taps.length>5) taps.shift(); const avg=taps.reduce((a,b)=>a+b,0)/taps.length; this.state.bpm=Math.max(40,Math.min(240,Math.round(60000/avg))); tempoSlider.value=this.state.bpm; tempoDisplay.textContent=this.state.bpm; UI.updateLCD(); if(RhythmEngine.running) RhythmEngine.start(this.state.rhythmId,this.state.bpm); } else { taps.length=0; } lastTap=now; });

    // Metronome
    document.getElementById('btn-metronome').addEventListener('click',()=>MetronomeEngine.toggle());

    // Rhythm play/stop
    const rhythmBtn=document.getElementById('btn-rhythm-play');
    rhythmBtn.addEventListener('click',()=>{ AudioEngine.resume(); if(RhythmEngine.running){ RhythmEngine.stop(); rhythmBtn.textContent='▶ BEAT'; rhythmBtn.classList.remove('running'); } else { RhythmEngine.start(this.state.rhythmId,this.state.bpm); rhythmBtn.textContent='■ BEAT'; rhythmBtn.classList.add('running'); } });

    // Sequencer
    document.getElementById('btn-rec').addEventListener('click',()=>{ AudioEngine.resume(); const recBtn=document.getElementById('btn-rec'); if(!SequencerEngine.recording){ SequencerEngine.startRec(); recBtn.classList.add('recording'); document.getElementById('btn-play').classList.remove('playing'); } else { SequencerEngine.stopRec(); recBtn.classList.remove('recording'); } });
    document.getElementById('btn-play').addEventListener('click',()=>{ AudioEngine.resume(); const playBtn=document.getElementById('btn-play'); if(!SequencerEngine.playing){ if(SequencerEngine.recording){ SequencerEngine.stopRec(); document.getElementById('btn-rec').classList.remove('recording'); } SequencerEngine.play(); playBtn.classList.add('playing'); } else { SequencerEngine.stopPlay(); playBtn.classList.remove('playing'); } });
    document.getElementById('btn-stop').addEventListener('click',()=>{ SequencerEngine.stopRec(); SequencerEngine.stopPlay(); LessonEngine.stop(); DemoEngine.stop(); ArcadeEngine.quit(); RhythmEngine.stop(); RhythmEditorEngine.stopPreview(); rhythmBtn.textContent='▶ BEAT'; rhythmBtn.classList.remove('running'); document.getElementById('btn-rec').classList.remove('recording'); document.getElementById('btn-play').classList.remove('playing'); AudioEngine.stopAllNotes(); KeyboardEngine.releaseAll(); });
    document.getElementById('btn-clear').addEventListener('click',()=>{ if(SequencerEngine.sequence.length&&!confirm('Clear sequence?')) return; SequencerEngine.clear(); });
    document.getElementById('btn-loop').addEventListener('click',()=>SequencerEngine.toggleLoop());

    // Quantize toggle (cycles off → 1/16 → 1/8 → 1/4)
    const qBtn=document.getElementById('btn-quantize'), qGridValues=[0,0.25,0.5,1];
    const setQuantizeBtn=()=>{ const v=this.state.quantizeGrid; qBtn.textContent=v===0?'Q OFF':v===0.25?'Q 1/16':v===0.5?'Q 1/8':'Q 1/4'; qBtn.classList.toggle('quantize-on',v>0); };
    setQuantizeBtn();
    qBtn.addEventListener('click',()=>{ const idx=qGridValues.indexOf(this.state.quantizeGrid); this.state.quantizeGrid=qGridValues[(idx+1)%qGridValues.length]; setQuantizeBtn(); const qg=document.getElementById('quantize-grid'); if(qg) qg.value=this.state.quantizeGrid; UI.toast('Quantize: '+(this.state.quantizeGrid===0?'OFF':'1/'+(1/this.state.quantizeGrid))); this.autosave(); });

    // Mode buttons
    document.getElementById('btn-demo').addEventListener('click',()=>{ AudioEngine.resume(); if(DemoEngine.playing){ DemoEngine.stop(); } else { DemoEngine.play(ModelRegistry.getById(this.state.modelId)); document.getElementById('btn-demo').classList.add('active'); } });
    document.getElementById('btn-lesson').addEventListener('click',()=>{ document.getElementById('modal-lesson').classList.remove('hidden'); UI.buildLessonList(ModelRegistry.getById(this.state.modelId)); document.getElementById('lesson-result').classList.add('hidden'); });
    document.getElementById('btn-arcade').addEventListener('click',()=>{ document.getElementById('modal-arcade').classList.remove('hidden'); UI.buildArcadeSongPick(); document.getElementById('arcade-hud').classList.add('hidden'); document.getElementById('arcade-result').classList.add('hidden'); document.getElementById('arcade-pre').classList.remove('hidden'); });
    document.getElementById('btn-song-editor').addEventListener('click',()=>{ document.getElementById('modal-song-editor').classList.remove('hidden'); SongEditorEngine.populateNoteSelect(); SongEditorEngine.renderSavedList(); if(!SongEditorEngine.currentSong) SongEditorEngine.newSong(); else SongEditorEngine.renderGrid(); });
    document.getElementById('btn-rhythm-editor').addEventListener('click',()=>{ document.getElementById('modal-rhythm-editor').classList.remove('hidden'); RhythmEditorEngine.renderGrid(); RhythmEditorEngine.renderSaved(); });
    document.getElementById('btn-presets').addEventListener('click',()=>{ document.getElementById('modal-presets').classList.remove('hidden'); PresetEngine.renderList(); });
    document.getElementById('btn-settings').addEventListener('click',()=>document.getElementById('modal-settings').classList.remove('hidden'));
    document.getElementById('btn-museum').addEventListener('click',()=>{ UI.buildMuseum(); document.getElementById('modal-museum').classList.remove('hidden'); });
    document.getElementById('btn-achievements').addEventListener('click',()=>{ AchievementEngine.renderModal(); document.getElementById('modal-achievements').classList.remove('hidden'); });
    document.getElementById('btn-fullscreen').addEventListener('click',()=>PerformanceMode.enter());
    document.getElementById('btn-help').addEventListener('click',()=>{ this._buildHelpKeymap(); document.getElementById('modal-help').classList.remove('hidden'); });

    // Lesson modal
    document.querySelectorAll('.lmode-btn').forEach(btn=>{ btn.addEventListener('click',()=>{ document.querySelectorAll('.lmode-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); LessonEngine.mode=btn.dataset.mode; document.getElementById('lesson-mode-desc').textContent=LessonEngine.MODE_DESC[btn.dataset.mode]||''; }); });
    document.getElementById('btn-lesson-start').addEventListener('click',()=>{ AudioEngine.resume(); if(!LessonEngine.song){ UI.toast('Select a song first'); return; } document.getElementById('modal-lesson').classList.add('hidden'); document.getElementById('lesson-result').classList.add('hidden'); LessonEngine.start(LessonEngine.mode); });
    document.getElementById('btn-lesson-cancel').addEventListener('click',()=>{ LessonEngine.stop(); document.getElementById('modal-lesson').classList.add('hidden'); });
    document.getElementById('btn-lesson-retry').addEventListener('click',()=>{ document.getElementById('lesson-result').classList.add('hidden'); document.getElementById('modal-lesson').classList.add('hidden'); LessonEngine.start(LessonEngine.mode); });
    document.querySelectorAll('.ltab').forEach(tab=>{ tab.addEventListener('click',()=>{ document.querySelectorAll('.ltab').forEach(t=>t.classList.remove('active')); tab.classList.add('active'); UI.buildLessonList(ModelRegistry.getById(this.state.modelId),tab.dataset.tab); }); });

    // Arcade
    document.getElementById('btn-arcade-start').addEventListener('click',()=>{ AudioEngine.resume(); ArcadeEngine.start(); });
    document.getElementById('btn-arcade-quit').addEventListener('click',()=>ArcadeEngine.quit());
    document.getElementById('btn-arcade-retry').addEventListener('click',()=>{ AudioEngine.resume(); ArcadeEngine.start(); });
    document.getElementById('btn-arcade-back').addEventListener('click',()=>{ document.getElementById('arcade-result').classList.add('hidden'); document.getElementById('arcade-pre').classList.remove('hidden'); UI.buildArcadeSongPick(); });

    // Song editor
    document.getElementById('se-add-note').addEventListener('click',()=>SongEditorEngine.addNote(document.getElementById('se-note-select').value,document.getElementById('se-dur-select').value));
    document.getElementById('se-del-note').addEventListener('click',()=>{ if(SongEditorEngine.currentSong?.notes.length) SongEditorEngine.deleteNote(SongEditorEngine.currentSong.notes.length-1); });
    document.getElementById('se-listen').addEventListener('click',()=>{ AudioEngine.resume(); SongEditorEngine.listen(); });
    document.getElementById('se-stop-listen').addEventListener('click',()=>AudioEngine.stopAllNotes());
    document.getElementById('se-save').addEventListener('click',()=>SongEditorEngine.saveSong());
    document.getElementById('se-clear').addEventListener('click',()=>{ if(confirm('Clear all notes?')) SongEditorEngine.newSong(); });
    document.getElementById('se-export-song').addEventListener('click',()=>SongEditorEngine.exportSong());
    document.getElementById('se-import-song').addEventListener('click',()=>SongEditorEngine.importSong());

    // Rhythm editor
    document.getElementById('re-steps').addEventListener('change',e=>RhythmEditorEngine.setSteps(+e.target.value));
    document.getElementById('re-sig').addEventListener('change',e=>RhythmEditorEngine.setSig(+e.target.value));
    document.getElementById('re-play').addEventListener('click',()=>{ AudioEngine.resume(); RhythmEditorEngine.preview(); });
    document.getElementById('re-stop').addEventListener('click',()=>RhythmEditorEngine.stopPreview());
    document.getElementById('re-save').addEventListener('click',()=>RhythmEditorEngine.savePattern());
    document.getElementById('re-clear-all').addEventListener('click',()=>{ if(confirm('Clear all steps?')) RhythmEditorEngine.clearAll(); });

    // Presets
    document.getElementById('btn-preset-apply').addEventListener('click',()=>PresetEngine.applyPreset());
    document.getElementById('btn-preset-save-custom').addEventListener('click',()=>PresetEngine.saveCustom());

    // Settings
    document.getElementById('poly-select').value=String(this.state.polyphony);
    document.getElementById('poly-select').addEventListener('change',e=>{ this.state.polyphony=+e.target.value; this.autosave(); });
    const tuneCtrl=document.getElementById('tune-ctrl'); tuneCtrl.value=this.state.tuneCents;
    document.getElementById('tune-display').textContent=this.state.tuneCents+'¢';
    tuneCtrl.addEventListener('input',e=>{ this.state.tuneCents=+e.target.value; AudioEngine.settings.tuneCents=this.state.tuneCents; document.getElementById('tune-display').textContent=e.target.value+'¢'; this.autosave(); });
    const driftCtrl=document.getElementById('drift-ctrl'); driftCtrl.value=this.state.driftPct;
    document.getElementById('drift-display').textContent=this.state.driftPct;
    driftCtrl.addEventListener('input',e=>{ this.state.driftPct=+e.target.value; AudioEngine.settings.driftPct=this.state.driftPct/100; document.getElementById('drift-display').textContent=e.target.value; this.autosave(); });
    const filterCtrl=document.getElementById('filter-ctrl'); filterCtrl.value=this.state.filterCutoff??70;
    document.getElementById('filter-display').textContent=this.state.filterCutoff??70;
    filterCtrl.addEventListener('input',e=>{ this.state.filterCutoff=+e.target.value; AudioEngine.settings.filterCutoff=this.state.filterCutoff/100; document.getElementById('filter-display').textContent=e.target.value; this.autosave(); });
    const qGrid=document.getElementById('quantize-grid'); qGrid.value=this.state.quantizeGrid;
    qGrid.addEventListener('change',e=>{ this.state.quantizeGrid=+e.target.value; setQuantizeBtn(); this.autosave(); });
    document.getElementById('btn-reset').addEventListener('click',()=>{ if(confirm('Reset EVERYTHING (settings, songs, patterns, scores)?')){ localStorage.clear(); location.reload(); } });

    // Difficulty
    document.querySelectorAll('.diff-btn').forEach(btn=>{ btn.classList.toggle('active',btn.dataset.diff===this.state.difficulty); btn.addEventListener('click',()=>{ this.state.difficulty=btn.dataset.diff; document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); UI.updateLCD(); this.autosave(); }); });

    // Octave
    document.getElementById('btn-oct-down').addEventListener('click',()=>this.octaveDown());
    document.getElementById('btn-oct-up').addEventListener('click',()=>this.octaveUp());

    // Slots
    document.querySelectorAll('.slot-btn').forEach(btn=>{ btn.addEventListener('click',e=>{ const slot=+btn.dataset.slot; document.querySelectorAll('.slot-btn').forEach(b=>b.classList.remove('active-slot')); btn.classList.add('active-slot'); this.state.currentSlot=slot; if(e.shiftKey&&this.state.slots[slot]){ SequencerEngine.fromJSON(this.state.slots[slot]); UI.toast(`Slot ${slot+1} loaded`); } else { this.state.slots[slot]=SequencerEngine.toJSON(); UI.toast(`Saved to slot ${slot+1} · Shift+Click to load`); this.autosave(); UI.refreshSlotButtons(); } }); });

    // Export / Import sequence
    document.getElementById('btn-export').addEventListener('click',()=>{ const data=JSON.stringify(SequencerEngine.toJSON(),null,2); const blob=new Blob([data],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`pockettone_${this.state.modelId}_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url); UI.toast('Exported'); });
    document.getElementById('btn-import').addEventListener('click',()=>{ const inp=document.createElement('input'); inp.type='file'; inp.accept='.json'; inp.addEventListener('change',e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{ try{ const data=JSON.parse(ev.target.result); if(!data.sequence) throw new Error(); SequencerEngine.fromJSON(data); if(data.model&&ModelRegistry.getById(data.model)) this.loadModel(data.model,true); if(data.tempo){ this.state.bpm=data.tempo; tempoSlider.value=data.tempo; tempoDisplay.textContent=data.tempo; } UI.toast('Imported!'); this.autosave(); }catch(err){ UI.toast('Invalid file'); } }; r.readAsText(f); }); inp.click(); });

    // Performance mode controls
    document.getElementById('perf-exit').addEventListener('click',()=>PerformanceMode.exit());
    document.getElementById('perf-oct-down').addEventListener('click',()=>this.octaveDown());
    document.getElementById('perf-oct-up').addEventListener('click',()=>this.octaveUp());
    document.getElementById('perf-rhythm-toggle').addEventListener('click',()=>{ AudioEngine.resume(); const b=document.getElementById('perf-rhythm-toggle'); if(RhythmEngine.running){ RhythmEngine.stop(); b.textContent='▶ BEAT'; } else { RhythmEngine.start(this.state.rhythmId,this.state.bpm); b.textContent='■ BEAT'; } });

    // Sync audio settings from state
    AudioEngine.masterGain.gain.value=this.state.masterVol/100;
    AudioEngine.settings.sustainPct=this.state.sustainPct/100;
    AudioEngine.settings.lofiPct=this.state.lofiPct/100;
    AudioEngine.settings.vibratoPct=this.state.vibratoPct/100;
    AudioEngine.settings.tuneCents=this.state.tuneCents;
    AudioEngine.settings.driftPct=this.state.driftPct/100;
    AudioEngine.settings.filterCutoff=(this.state.filterCutoff??70)/100;

    this._updateOctDisplay();
    UI.bindModals();
    KeyboardEngine.attachKeyboard();
    this.loadModel(this.state.modelId,true);
    UI.refreshSlotButtons();
  },

  loadModel(modelId,silent=false){
    const model=ModelRegistry.getById(modelId); if(!model) return;
    KeyboardEngine.releaseAll(); AudioEngine.stopAllNotes();
    DemoEngine.stop(); LessonEngine.stop(); SequencerEngine.stopPlay(); ArcadeEngine.quit();
    if(SequencerEngine.recording) SequencerEngine.stopRec();
    RhythmEngine.stop(); RhythmEditorEngine.stopPreview();
    const rhythmBtn=document.getElementById('btn-rhythm-play');
    if(rhythmBtn){ rhythmBtn.textContent='▶ BEAT'; rhythmBtn.classList.remove('running'); }
    document.getElementById('btn-rec')?.classList.remove('recording');
    document.getElementById('btn-play')?.classList.remove('playing');
    document.getElementById('btn-demo')?.classList.remove('active');

    this.state.modelId=modelId;
    document.getElementById('model-select').value=modelId;
    if(!model.voices.includes(this.state.voiceId)) this.state.voiceId=model.defaultVoice;
    if(!model.rhythms.includes(this.state.rhythmId)&&!RhythmEngine.customPatterns.find(p=>p.id===this.state.rhythmId)) this.state.rhythmId=model.defaultRhythm;
    if(model.polyphony===1){ this.state.polyphony=1; const ps=document.getElementById('poly-select'); if(ps) ps.value='1'; }

    SkinEngine.apply(this.state.skin,model.skin);
    UI.buildVoiceButtons(model);
    UI.buildRhythmButtons(model);
    KeyboardEngine.render(model);
    UI.updateModelStrip(model);
    UI.updateLCD();
    UI.setMode('STOP');
    UI.lcdMsg(`${model.name.toUpperCase()} — READY`);
    UI.refreshSeqCounter();
    UI.refreshSlotButtons();
    AchievementEngine.onModelChange(modelId);

    if(!silent){
      this.state.bpm=model.defaultTempo;
      document.getElementById('tempo-slider').value=model.defaultTempo;
      document.getElementById('tempo-display').textContent=model.defaultTempo;
      UI.updateLCD();
      UI.toast(`${model.name} — ${model.tagline}`);
      this.autosave();
    }
  },

  _buildHelpKeymap(){
    const el=document.getElementById('keymap-visual'); if(!el) return; el.innerHTML='';
    Object.entries(KeyboardEngine.KB_MAP).forEach(([k,n])=>{ const d=document.createElement('div'); d.className='km-item'; d.innerHTML=`${k.toUpperCase()}<span>${n}</span>`; el.appendChild(d); });
  }
};

/* =========================================
   BOOTSTRAP
   ========================================= */
document.addEventListener('DOMContentLoaded',()=>{
  App.init();
  const unlock=()=>{ AudioEngine.resume(); document.body.removeEventListener('click',unlock); document.body.removeEventListener('touchstart',unlock); };
  document.body.addEventListener('click',unlock);
  document.body.addEventListener('touchstart',unlock);
  // wrap sequencer addNote to feed achievement tracking
  const origAddNote=SequencerEngine.addNote.bind(SequencerEngine);
  SequencerEngine.addNote=function(note,dur){ origAddNote(note,dur); AchievementEngine.onNoteRecorded(this.sequence.length); };
});
