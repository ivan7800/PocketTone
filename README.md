# 🎹 PocketTone Archive Pro

**A playable archive of imaginary vintage pocket keyboards**

> *Six fictional models. Eighteen voices. Fifteen rhythms. AudioContext-scheduled drums. One browser. Zero dependencies.*

---

## What Is This?

PocketTone Archive Pro is an original browser-based instrument and interactive museum inspired by the aesthetic of educational mini keyboards from the late 1970s and 1980s. It is **not** affiliated with any real manufacturer or product.

Built with pure HTML, CSS, and JavaScript — no frameworks, no audio samples, no external dependencies. Every sound is synthesized in real time using the Web Audio API.

---

## Six Imaginary Models

Each model is a genuinely distinct instrument with unique casing, voices, rhythms, lesson songs, demo, and behavior. Changing model changes everything.

| Model | Era | Keys | Polyphony | Memory | Character |
|-------|-----|------|-----------|--------|-----------|
| Pocket P-1 | 1981 | 29 | Mono | 100 notes | Classic learner, piano + flute |
| Pocket P-10 | 1983 | 25 | Mono | 60 notes | Toy starter, square + music-box |
| Pocket P-20 | 1985 | 32 | Mono | 150 notes | Intermediate, bells + strings |
| Pocket P-50 | 1987 | 37 | Soft Poly (3v) | 300 notes | Advanced flagship, 8 unique voices |
| Pocket VL | 1982 | 29 | Mono | 100 notes | Synth/calculator, lead + bass |
| Pocket SA-Kid | 1991 | 32 | Mono | 120 notes | Arcade toy, kalimba + digital choir |

---

## 18 Synthesized Voices

All synthesized — no samples. Each has a unique oscillator blend, ADSR envelope, filter, and vibrato character:

**Piano family:** Piano Toy, Piano Bright  
**Winds:** Flute Air (with breathiness), Harmonica, Toy Horn  
**Strings:** Violin Soft, Strings Ensemble  
**Bells:** Fantasy Bell, Music Box, Kalimba  
**Organ/Brass:** Organ Mini, Brass Toy, Clarinet Plastic, Pipe Organ  
**Choir:** Digital Choir  
**Synth:** Synth Lead, Synth Bass, Space Pad, Glitch Pulse  
**Square:** Square Bee  

---

## 15 Rhythm Patterns

AudioContext-clock scheduled — zero drift. Synthesized percussion only (kick, snare, hi-hat, clave, clap, tom, blip):

March · Waltz · 4 Beat · Rock 1 · Rock 2 · Swing · Bossa · Samba · Rumba · Disco Toy · Slow Ballad · Cha Cha · Beguine · Electro Click · Kids Pop

---

## Lesson Mode — Follow the Lights

Five learning modes:

| Mode | How it works |
|------|-------------|
| **Watch** | App plays and lights keys automatically |
| **Slow** | Watch mode at half tempo |
| **Follow** | Light holds until you press the right key |
| **Practice** | Lights guide you, errors don't block progress |
| **Challenge** | Scored — every error is counted |

**15 songs included** — all public domain or original compositions:
Ode to Joy, Twinkle Twinkle, Frère Jacques, Mary Had a Little Lamb, London Bridge, Greensleeves, Sakura Sakura, Amazing Grace, Retro Lesson 01 & 02, Robot March, Tiny Waltz, Space Lullaby, Arcade Tune, plus 6 model-specific demo songs.

Star ratings (1–3) saved per model per song in localStorage.

---

## Sequencer

- REC / PLAY / STOP / LOOP / CLEAR
- 4 save slots: **click to SAVE**, **Shift+click to LOAD** (distinct, unambiguous)
- Notes, timestamps, voice, and velocity recorded
- Per-model memory limits (60–300 notes)
- Export and import as JSON
- Auto-saved to localStorage on every change

---

## Computer Keyboard

**Low row — C4 to B4 (white keys):**
```
Z  S  X  D  C  V  G  B  H  N  J  M
C  C# D  D# E  F  F# G  G# A  A# B
```

**High row — C5 to E6:**
```
Q  2  W  3  E  R  5  T  6  Y  7  U  I  9  O  0  P
C  C# D  D# E  F  F# G  G# A  A# B  C  C# D  D# E
```

**Octave shift:** `[` / `]` keys, or the OCT▼ / OCT▲ buttons on screen (±3 octaves).  
**Notes stop on window blur** — no stuck notes when switching tabs.

---

## FX Controls

| Control | Effect |
|---------|--------|
| MASTER | Overall volume |
| SUSTAIN | Release time extension |
| LO-FI | Frequency roll-off (warmth/grit) |
| VIBRATO | Pitch modulation depth |
| TUNE | Global pitch in cents (±50) |
| ANALOG DRIFT | Random per-note pitch variation |
| FILTER CUTOFF | Global low-pass cutoff scale |

---

## Skins

**7 manual skins:** Classic Cream (auto) · Dark Studio · Toy Red · Catalog 1983 · Worn Vintage · LCD Green · Midnight Blue

Each model also applies its own automatic skin when "Auto" is selected.

---

## Museum Mode

Every model has a museum card: era, specs, description, rarity (COMMON / UNCOMMON / RARE), and an invented catalog quote. Click any card to switch to that model.

---

## Publishing to GitHub Pages

1. Create a new GitHub repository
2. Upload: `index.html`, `style.css`, `app.js`
3. Go to **Settings → Pages**
4. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`
5. Save — live at `https://yourusername.github.io/repo-name`

No build step. No npm. No config.

---

## File Structure

```
pockettone-archive-pro/
├── index.html   — App shell and all markup
├── style.css    — Design system, skins, responsive layout
├── app.js       — All logic: audio, models, UI, sequencer, lessons
├── README.md    — This file
└── LICENSE      — MIT License
```

---

## Technical Notes

- **Rhythm engine** uses AudioContext lookahead scheduling (not `setTimeout`) — zero timing drift at any BPM
- **AudioContext** is created once and resumed on first user gesture (browser policy compliant)
- **Black key detection** uses chromatic semitone index, not string matching
- **Stuck notes** prevented via `window.blur` listener and `releaseAll()` on model change
- **Slot logic** is explicit: click = save, Shift+click = load — no ambiguous toggle
- **color-mix()** avoided — compatible with Safari, Firefox, Chrome across all versions

---

## Roadmap

- [ ] MIDI output via Web MIDI API  
- [ ] Step sequencer grid view (16-step pattern editor)  
- [ ] Additional lesson songs  
- [ ] Fill button for rhythm engine  
- [ ] Export sequence as MIDI file  
- [ ] Chord mode for P-50 (auto-chord left hand)  
- [ ] Velocity sensitivity via pointer pressure (Pointer Events API)  

---

## Legal Notice

**PocketTone Archive Pro is an unofficial, original web instrument inspired by the general look and feel of vintage pocket keyboards. It is not affiliated with, endorsed by, or sponsored by any keyboard manufacturer. All models, names, skins, demos and lesson data in this project are fictional or original.**

All sounds are procedurally synthesized. No copyrighted audio samples are used. All lesson melodies are either in the public domain or original compositions created for this project. No trademarked names, logos, or designs are reproduced.

---

## License

MIT — see `LICENSE` file.

---

*Built with Web Audio API, pure CSS, and a sincere love for tiny plastic keyboards from decades that never quite existed.*
