# 🕌 Salah Module — Project Dua

> **Part of [Project Dua](https://github.com/nawavazhi/dua)** — an open-source Islamic learning ecosystem.
> This module teaches the daily Salah (Islamic prayer) word-by-word in Arabic, English, and Malayalam.

---

## 📌 Purpose

Most people memorise the prayer phonetically without understanding the meaning. This module fixes that.

It displays every Arabic word spoken during Salah alongside its transliteration, English meaning, and Malayalam meaning — so the learner can pray with genuine focus (*Khushoo*).

**Live URL:** `https://nawavazhi.github.io/dua/salah/`

---

## 📂 This Folder

```
salah/
└── index.html        ← The only file here. A clean HTML shell — contains no Arabic text.
                        All content is loaded from the database at runtime by builder.js.
```

---

## 🏗️ How It Works (Architecture)

This module is **data-driven**. The HTML shell is empty of content. When the page loads, JavaScript fetches a JSON database and builds all tables dynamically.

```
User opens salah/index.html
        │
        ▼
assets/js/builder.js  ←  fetches  →  assets/data/database.json
        │
        ▼
Builds: sidebar nav, schedule table, word-by-word section cards,
        complete dua blocks, pronunciation notes, audio buttons
```

**Why this architecture?**
- Fix a typo in one place → updates everywhere (salah, future apps, everything)
- The same `global_dictionary` in `database.json` is shared across Salah, Ablution, Quran modules
- Words like "Allahu", "Bismillah", "Rabbi" are stored once and reused by any module
- Adding a new language later = add one field to each dictionary entry

---

## 📁 Dependency Files

These files live outside this folder but are required. Do not move or rename them.

| File | Location | Purpose |
|------|----------|---------|
| `database.json` | `assets/data/database.json` | Master data — all words, sections, duas, notes |
| `builder.js` | `assets/js/builder.js` | JavaScript engine — reads JSON, builds the page |
| `style.css` | `assets/css/style.css` | Global stylesheet — shared with all modules |
| Amiri font | Google Fonts (CDN) | Required for Arabic text with correct diacritics |

---

## 🗃️ database.json — Structure

Path: `assets/data/database.json`

The database has three top-level keys:

```json
{
  "meta":              { ... project info ... },
  "global_dictionary": { ... every unique Arabic word/phrase ... },
  "salah_guide":       { ... schedule + ordered sections ... }
}
```

### global_dictionary

Every unique word or phrase in the entire project is stored here with a short snake_case key.

```json
"allahu": {
  "ar": "اللَّهُ",
  "tr": "Allahu",
  "en": "Allah",
  "ml": "അല്ലാഹു"
}
```

| Field | Description |
|-------|-------------|
| `ar` | Arabic text with full diacritics (fatha, kasra, shadda, etc.) |
| `tr` | Romanised transliteration |
| `en` | English meaning |
| `ml` | Malayalam meaning |

> **Rule:** If a word appears in two different sections, it gets **one entry** in `global_dictionary`, not two. The section just references the same key twice.

### salah_guide.sections

Each section is one card on the page.

```json
{
  "id": 3,
  "title": "Surah Al-Fatihah — The Opening Chapter (1)",
  "posture": "Qiyam (Standing)",
  "posture_icon": "🧍",
  "sequence": ["bismi", "llahi", "ar_rahman", ...],
  "complete_dua": {
    "ar": "بِسْمِ اللَّهِ ...",
    "en": "In the name of Allah ...",
    "ml": "അല്ലാഹുവിന്റെ നാമത്തിൽ ..."
  },
  "notes": [
    "Al-Fatihah is recited in every rak'ah.",
    "Stretch long vowels for 2 counts: Raḥmāān, Raḥīīm."
  ]
}
```

| Field | Description |
|-------|-------------|
| `id` | Unique number. Sections display in order of `id`. |
| `title` | Displayed as the card heading. |
| `posture` | Prayer position during this step. |
| `posture_icon` | Emoji shown beside posture label. |
| `sequence` | Ordered array of `global_dictionary` keys — one key per table row. |
| `complete_dua` | Full continuous text shown at the bottom of each card. |
| `notes` | Array of pronunciation/Tajweed notes. Can be empty `[]`. |

---

## ⚙️ builder.js — What It Does

Path: `assets/js/builder.js`

| Function | What it builds |
|----------|---------------|
| `buildNav()` | Sidebar navigation links from section data |
| `buildScheduleCard()` | Daily prayer schedule table |
| `buildSectionCards()` | All word-by-word section cards |
| `buildCard()` | One complete section card (table + dua + notes) |
| `buildWordRows()` | Table rows by looking up each key in `global_dictionary` |
| `buildDuaBlock()` | Gold "Complete Recitation" block at bottom of card |
| `buildNotesBlock()` | Pronunciation notes list |
| `toggleDark()` | Dark/light mode (saved in localStorage) |
| `markDone()` | "Memorised" checkbox (saved in localStorage) |
| `updateProgress()` | Progress bar + nav tick marks |
| `playWord()` | Plays `assets/audio/words/{key}.mp3` if it exists |
| `activateScrollSpy()` | Highlights active section in sidebar while scrolling |

---

## ✨ Features

| Feature | How it works |
|---------|-------------|
| **Word-by-word table** | 4 columns: Arabic · Transliteration · English · Malayalam |
| **Arabic font** | Amiri (Google Fonts) at 1.55rem — diacritics clearly readable |
| **Complete dua block** | Full Arabic text + English + Malayalam below each section |
| **Pronunciation notes** | Tajweed and posture tips per section |
| **Dark mode** | Toggle button in header, preference saved in browser |
| **Progress tracking** | "Memorised" checkbox per section, saved in localStorage (no account needed) |
| **Progress bar** | Shows X/16 sections memorised at top of page |
| **Sidebar navigation** | Always visible on desktop; hamburger menu on mobile |
| **Scroll spy** | Active section highlights in nav as you scroll |
| **Audio buttons** | 🔊 on each word — plays MP3 if present, shows toast if not yet uploaded |
| **Printable** | Print button formats the page as clean A4 — all buttons/nav hidden |
| **Responsive** | Works on iPhone, Android, tablet, desktop |
| **No backend** | Pure HTML + CSS + JS — hosted free on GitHub Pages |

---

## 📋 Sections Covered

| # | Section | Prayer Position |
|---|---------|----------------|
| 1 | Takbeer & Sana (Opening) | Qiyam (Standing) |
| 2 | Wajjahtu — Extended Opening (alternative) | Qiyam (Standing) |
| 3 | Surah Al-Fatihah | Qiyam (Standing) |
| 4 | Ruku & Standing Up | Ruku → I'tidal |
| 5 | Mil'as-samawati (Extended praise after Ruku) | I'tidal (Standing) |
| 6 | Sujood — Prostration | Sajdah |
| 7 | Sitting Between Two Sujoods (Rabbighfir li) | Jalsah (Sitting) |
| 8 | Tashahhud — Attahiyyat | Qa'dah (Sitting) |
| 9 | Durood — Salawat (Blessings on the Prophet) | Qa'dah (Final Sitting) |
| 10 | Dua Before Tasleem (Allahummaghfirli) | Qa'dah (Final Sitting) |
| 11 | Tasleem — Conclusion | Final Sitting |
| 12 | Surah Al-Ikhlas (112) | After Al-Fatihah |
| 13 | Surah Al-Falaq (113) | After Al-Fatihah |
| 14 | Surah An-Nas (114) | After Al-Fatihah |
| 15 | Surah Al-Asr (103) | After Al-Fatihah |
| 16 | Surah Al-Kawtar (108) | After Al-Fatihah |

---

## 🔊 Audio Setup (Not Yet Complete)

Audio buttons are wired and ready. To activate them:

1. Create the folder `assets/audio/words/`
2. Add MP3 files named exactly after their `global_dictionary` key
   - Example: key `"allahu"` → file `assets/audio/words/allahu.mp3`
3. No code changes needed — `builder.js` already tries the path `../assets/audio/words/{key}.mp3`

For full-section recitation audio, add files to `assets/audio/sections/` and update the `complete_dua` block in each section with an `audio` field.

**Free audio sources:**
- Quran word-by-word: [Quran.com API](https://api.quran.com/documentation/v4)
- Full Surahs: [EveryAyah.com](https://everyayah.com)
- Prayer duas (Sana, Ruku, Tashahhud, etc.): record locally or source from open-licence Islamic platforms

---

## 🌍 Adding a New Language

The architecture makes this straightforward.

1. Open `assets/data/database.json`
2. Add a new field to every entry in `global_dictionary` — e.g. `"ur"` for Urdu:

```json
"allahu": {
  "ar": "اللَّهُ",
  "tr": "Allahu",
  "en": "Allah",
  "ml": "അല്ലാഹു",
  "ur": "اللہ"
}
```

3. In `builder.js`, add a column to `buildWordRows()` to render the new field.
4. Add the column header in `buildCard()`.

---

## 🤝 Contribution Guide (For Humans and AI)

### Adding a new section
1. Add any new words to `global_dictionary` in `database.json`
2. Add the new section object to `salah_guide.sections` with a unique `id`
3. Write the `sequence` array using existing or new dictionary keys
4. Fill in `complete_dua` (ar, en, ml) and `notes`
5. Update the `TOTAL_SECTIONS` constant in `builder.js`
6. The nav link is generated automatically from the section data

### Fixing a translation
- Find the key in `global_dictionary` in `database.json`
- Edit the `en`, `ml`, or `tr` field
- The fix propagates to every section that uses that key automatically

### Code style rules
- No frameworks — vanilla HTML5, CSS3, JavaScript only
- All interactive elements (`memo` checkboxes, audio buttons, nav toggle) must be hidden in `@media print`
- Arabic text always uses the Amiri font and `direction: rtl`
- localStorage keys follow the pattern `dua-{feature}-{id}` (e.g. `dua-memo-3`)
- The fetch path inside `builder.js` is relative: `../assets/data/database.json`

### Design tokens (from style.css)
```
--green:  #1f4e3d   Primary colour (headers, Arabic text, buttons)
--gold:   #c79c60   Accent colour (borders, highlights, dua blocks)
--amiri:  'Amiri', serif   Arabic font — always use this for Arabic text
```

---

## 🗺️ Planned Improvements

- [ ] Real word-by-word audio for all 16 sections
- [ ] Full-section recitation audio player in each dua block
- [ ] Quiz Mode — hide English/Malayalam columns, reveal on tap
- [ ] Posture illustrations (SVG stick figures) in each card header
- [ ] Urdu and Tamil language columns
- [ ] Tajweed colour coding on Arabic text (madd = blue, ghunna = green, etc.)
- [ ] Prayer reminder integration (see `reminder/` module)

---

## 📎 Related Modules

| Module | Path | Status |
|--------|------|--------|
| Salah Guide | `salah/` | ✅ Active |
| Ablution (Wudu) | `ablution/` | 🔜 Planned |
| Quran Tajweed | `quran/` | 🔜 Planned |
| Prayer Reminders | `reminder/` | 🔜 Planned |

All modules share `assets/` (data, css, js, audio, icons) and follow the same JSON → builder.js → index.html pattern.

---

## 🌟 About This Project

**Project Dua** was built to help people pray with understanding, not just memorisation. Every feature — the word-by-word tables, the complete dua blocks, the progress tracker — exists to close the gap between reciting Arabic words and truly knowing what you are saying to Allah.

If this helped you, share it. That is the goal.

---

*Repository: https://github.com/nawavazhi/dua*
