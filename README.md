# 🎹 PocketTone Archive Pro v3

A browser-based **playable museum of six imaginary vintage pocket keyboards** (1981–1991). Pure HTML, CSS and JavaScript — **no frameworks, no build step, no external assets**. Every sound is synthesized live with the Web Audio API. Drop the three files on any static host (GitHub Pages included) and it just runs.

> *"Calculate the melody. Synthesize the dream."* — Pocket VL catalog, 1982

---

## ✨ What's new in v3

v3 turns the archive into a reference-quality instrument suite. Everything from v2 is preserved; these are additions:

- **Visual lesson song editor** — build your own lessons on a step grid, audition them, save, and play them back in Lesson mode under the *My Songs* tab.
- **Step rhythm editor** — a 7-track step sequencer (kick / snare / hihat / clap / clave / tom / blip) with 8/12/16 steps and 2/4, 3/4, 4/4 signatures. Saved patterns become selectable rhythms.
- **Full song mode** — custom songs flow straight into the lesson engine.
- **Visual metronome** — a CSS pendulum plus an audible click locked to the beat scheduler.
- **Improved quantized recording** — snap recorded notes to OFF / 1/16 / 1/8 / 1/4 grids.
- **Arcade learning mode** — lives, combo multipliers, a timing window, per-song high scores and Stage Clear / Game Over states.
- **Local achievements** — 12 unlockables tracked in `localStorage`, with a slide-in popup.
- **Difficulty selector** — Easy / Normal / Hard adjusts lesson scoring and arcade lives + timing.
- **Song import / export** — share custom songs as JSON.
- **Editable sound presets** — tweak ADSR, filter and vibrato per voice and save custom presets.
- **Redesigned museum panel** — richer cards with gradient headers, full specs, voice tags and catalog quotes.
- **Better mobile responsive** — dedicated breakpoints at 680px and 400px.
- **Per-model casing design** — each model carries its own colour strip and auto-skin.
- **Fullscreen + performance mode** — a distraction-free, full-window performance keyboard.

---

## 🎛 The six models

| Model | Year | Keys | Poly | Voices | Memory | Rarity |
|-------|------|------|------|--------|--------|--------|
| **Pocket P-1** | 1981 | 29 | mono | 4 | 100 | Common |
| **Pocket P-10** | 1983 | 25 | mono | 4 | 60 | Common |
| **Pocket P-20** | 1985 | 32 | mono | 6 | 150 | Uncommon |
| **Pocket P-50** | 1987 | 37 | 3-voice | 8 | 300 | Rare — *the only chordable model* |
| **Pocket VL** | 1982 | 29 | mono | 4 | 100 | Rare — *calculator-synth* |
| **Pocket SA-Kid** | 1991 | 32 | mono | 6 | 120 | Uncommon |

All instruments, model histories and catalog quotes are **fictional** and created for this project.

---

## 🚀 Running it

Just open `index.html` — or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

For **GitHub Pages**: commit `index.html`, `style.css`, `app.js` to a repo and enable Pages on the branch root.

---

## ⌨️ Keyboard

```
Low octave  (C4–B4):  Z S X D C V G B H N J M
High octave (C5–E6):  Q 2 W 3 E R 5 T 6 Y 7 U I 9 O 0 P
Octave shift:         [  ]   (also  ,  . )
Exit performance:     Esc
```

Click/tap the on-screen keys too. Click a memory slot to **save**, shift-click to **load**.

---

## 🗂 Files

| File | Role |
|------|------|
| `index.html` | Markup: device shell, panels, all modals |
| `style.css` | Tokens, skins, per-model casings, responsive, performance overlay |
| `app.js` | 19 engines: audio, rhythm scheduler, sequencer, lessons, arcade, editors, presets, achievements, performance, UI, app controller |

Local data lives in three `localStorage` keys: `pockettone_v3`, `pockettone_v3_songs`, `pockettone_v3_patterns`.

---

## 📄 License

MIT — see [LICENSE](LICENSE).
