# 🕌 Salah Module — Project Dua

> **Part of [Project Dua](https://github.com/nawavazhi/dua)** — an open-source Islamic learning ecosystem built by the Nawavazhi mission.

---

## 👨‍💻 Developer & Mission

**Developer:** nawavazhi@gmail.com
**GitHub:** [nawavazhi](https://github.com/nawavazhi)

**About Nawavazhi**
Nawavazhi (നവവഴി — "New Path") is a personal mission of building practical tools — engineering software, apps, games, learning platforms, and utilities — that the developer uses daily and shares freely so others can benefit too. The goal is simple: if a tool helps one person, it was worth building. This Salah learning guide is one such tool. The ecosystem spans many domains and all tools are open to use, fork, and improve.

---

## 📌 Purpose

Most people memorise the prayer phonetically without understanding the meaning. This module fixes that by showing every Arabic word spoken during Salah alongside its transliteration, English meaning, and Malayalam meaning — so the learner can pray with genuine focus (*Khushoo*).

**Live URL:** `https://nawavazhi.github.io/dua/salah/`

---

## 📂 This Folder

```
salah/
└── index.html    ← Clean HTML shell. No Arabic text hardcoded here.
                    All content is fetched from JSON data files at runtime.
```

---

## 🏗️ How It Works (v3.0 Architecture)

```
salah/index.html
       │
       └──▶ assets/js/builder.js  (v3.0)
                    │
                    ├──▶ assets/data/dictionary.json   ← word dictionary + UI strings
                    ├──▶ assets/data/salah.json         ← duas, rak'ah structure, schedule
                    └──▶ assets/data/quran.json         ← surah verses with word-by-word data

         builder.js builds: nav groups, schedule table,
                            word-by-word cards (duas + surahs),
                            complete dua blocks, notes, audio buttons
```

> **Note:** The old single-file `database.json` was split into three separate files in v3.0 for cleaner separation of concerns — Quran data, prayer dua data, and dictionary/UI data are now independently maintainable.

---

## 📁 Required Files (outside this folder)

| File | Location | Purpose |
|------|----------|---------| 
| `dictionary.json` | `assets/data/` | Global word dictionary + UI label strings |
| `salah.json` | `assets/data/` | Duas, rak'ah sequence, prayer schedule |
| `quran.json` | `assets/data/` | Surah verses with per-word Arabic / transliteration / English / Malayalam |
| `builder.js` | `assets/js/` | Builds the entire page from the three JSON files |
| `style.css` | `assets/css/` | Global theme shared by all modules |
| Amiri font | Google Fonts CDN | Arabic text rendering |

---

## 🌐 Translation Sources & Verification

This section is critical for contributors. All translations should come from verified sources, not generated text.

### ✅ English Translations

**For Quranic Surahs** (Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas, Al-Asr, Al-Kawtar):
Use word-by-word translations from:
- **[quranwbw.com](https://quranwbw.com)** — word-by-word in English, Malayalam, and 15+ other languages. Best source for this project.
- **[quran.com](https://quran.com)** — verse-level, multiple scholar translations (Saheeh International, Hilali & Khan, Clear Quran)
- **[corpus.quran.com](https://corpus.quran.com/wordbyword.jsp)** — morphological analysis, most precise word-level meanings

**For Prayer Duas** (Sana, Tashahhud, Durood, Ruku, Sujood, etc.):
These come from Hadith, not Quran. Use:
- **[sunnah.com](https://sunnah.com)** — authenticated Hadith text with English translations
- **[islamqa.info](https://islamqa.info)** — scholarly Q&A with verified wording and translations (e.g., Tashahhud variants from Sahih Bukhari)

---

### 📋 English Translation Audit

Here is an honest review of the English column. Most is correct; a few items to note:

| Term | In database | Verified wording | Status |
|------|-------------|-----------------|--------|
| الرَّحْمَنِ | "The Most Gracious" | Also valid: "Most Compassionate" (Saheeh Int'l), "Most Beneficent" (Hilali) | ✅ Valid — multiple accepted translations exist |
| الرَّحِيمِ | "The Most Merciful" | Confirmed across all major translators | ✅ Correct |
| مَالِكِ يَوْمِ الدِّينِ | "Master of the Day of Judgment" | Also: "Owner/Sovereign of the Day of Recompense" | ✅ Acceptable |
| التَّحِيَّاتُ | "All greetings" | Also: "All compliments", "All veneration" | ✅ Acceptable |
| عَبْدُهُ | "servant" | Literal Arabic is "slave" (ʿabd). "Servant" is the accessible translation used in most English materials. | ✅ Standard usage |
| وَالطَّيِّبَاتُ | "pure/good things" | Confirmed — "good words" or "pure words" also used | ✅ Correct |
| الصَّمَدُ | "Eternal Refuge" | Also: "Self-Sufficient Master", "The Eternal, The Absolute" | ✅ Valid |
| حَنِيفًا | "inclining to truth / upright" | Also: "as a monotheist", "in pure faith" | ✅ Correct concept |
| الْخَنَّاسِ | "who withdraws" | Also: "the retreater", "who slinks away" | ✅ Correct |

**Summary:** English translations are verified and acceptable. Minor wording variants exist because multiple equally valid English translations of Quran exist — this is normal in Islamic scholarship.

---

### 📋 Malayalam Translation Audit

**Honest status:** The Quranic terms use standard Kerala Islamic Malayalam vocabulary. The non-Quranic prayer duas (Sana, Wajjahtu, Tashahhud, etc.) follow common Kerala Islamic usage but should be verified against published Kerala Islamic sources before wide distribution.

**Recommended Malayalam sources (in order of authority):**

1. **[quranwbw.com](https://quranwbw.com)** — Has certified word-by-word Malayalam translation for all Quranic verses. Use this directly for all Surah sections. Go to any Surah, set language to Malayalam, and copy the per-word translation.

2. **Islamic Publishing House (IPH), Kozhikode, Kerala** — The most widely used Malayalam Quran translation (by Abdul Hameed Madani & Parappur). Their word meanings are considered authoritative for Malayali Muslims.

3. **SAMASTHA (Samastha Kerala Jamiyyathul Ulama) publications** — Educational materials including Salah guides in Malayalam, published and reviewed by Kerala Islamic scholars.

4. **Niche of Truth / Satyamarga** — Malayalam Islamic educational publications covering prayer duas with verified translations.

**Key Malayalam terms verified as standard:**
- الرَّحْمَنِ → പരമകാരുണികൻ ✅ (standard across all Kerala Islamic texts)
- الرَّحِيمِ → കരുണാനിധി ✅
- رَبِّ الْعَالَمِينَ → ലോകങ്ങളുടെ രക്ഷിതാവ് ✅
- لَا إِلَهَ إِلَّا اللَّهُ → അല്ലാഹു അല്ലാതെ ആരാധ്യനില്ല ✅
- الصِّرَاطَ الْمُسْتَقِيمَ → നേരായ വഴി ✅

**Items to double-check with a Kerala scholar:**
- The word-level Malayalam for Wajjahtu (not a Quranic verse — scholars may use slightly different phrasing)
- The word-level Malayalam for Mil'as-samawati (same reason)
- The word-level Malayalam for Dua Before Tasleem (Hadith-based, Kerala usage may vary)

---

### 🔑 Arabic Text Verification

All Arabic text matches the standard Uthmani script Quran and authenticated Hadith collections. Verified against:
- Quran text: matches the Medina Mushaf (King Fahd Complex standard)
- Prayer duas: match narrations from Sahih Bukhari, Sahih Muslim, Abu Dawud, and Tirmidhi

---

## 📋 Sections Covered

| # | Section | Position | Arabic Source |
|---|---------|----------|--------------|
| 1 | Takbeer & Sana | Qiyam | Hadith (Abu Dawud 775, Tirmidhi 243) |
| 2 | Wajjahtu (alternative opening) | Qiyam | Hadith (Muslim 771) |
| 3 | Surah Al-Fatihah | Qiyam | Quran 1:1–7 |
| 4 | Ruku & Standing | Ruku / I'tidal | Hadith (Muslim 772) |
| 5 | Mil'as-samawati | I'tidal | Hadith (Muslim 476) |
| 6 | Sujood | Sajdah | Hadith (Muslim 772) |
| 7 | Rabbighfir li | Jalsah | Hadith (Abu Dawud 850, Ibn Majah 898) |
| 8 | Tashahhud (Attahiyyat) | Qa'dah | Hadith (Bukhari 6265, Muslim 402) |
| 9 | Durood Ibrahim | Qa'dah | Hadith (Bukhari 3370, Muslim 406) |
| 10 | Dua Before Tasleem | Qa'dah | Hadith (Muslim 771) |
| 11 | Tasleem | Final Sitting | Established Sunnah |
| 12 | Surah Al-Ikhlas | After Fatihah | Quran 112:1–4 |
| 13 | Surah Al-Falaq | After Fatihah | Quran 113:1–5 |
| 14 | Surah An-Nas | After Fatihah | Quran 114:1–6 |
| 15 | Surah Al-Asr | After Fatihah | Quran 103:1–3 |
| 16 | Surah Al-Kawtar | After Fatihah | Quran 108:1–3 |

---

## ⚙️ builder.js v3.0 — What It Does

### Boot sequence

On `DOMContentLoaded`, builder.js fetches all three JSON files in parallel via `Promise.all`, then calls `buildPage(salahData, quranData, ui)`.

### Key functions

| Function | What it builds |
|----------|---------------|
| `buildPage(salah, quran, ui)` | Assembles section list from rak'ah sequence + recommended surahs, then calls all sub-builders |
| `buildNav(sections)` | Two-group sidebar: "🕌 Salah Steps" and "📖 Short Surahs" |
| `buildScheduleCard(schedule)` | Prayer schedule table with Sunnah Before / Fardh / Sunnah After columns |
| `buildSectionCards(sections)` | All word-by-word section cards; inserts section divider before Short Surahs |
| `buildCard(section)` | Single card: header, word table, complete dua block, notes block |
| `buildWordRows(item)` | Dua words from `salah.json` **or** verse words from `quran.json` (two separate paths) |
| `buildDuaBlock(dua)` | Gold "Complete Recitation" block at card bottom |
| `buildNotesBlock(notes)` | Pronunciation / notes list |
| `toggleDark()` | Dark/light mode (localStorage) |
| `markDone(cb)` | Memorised checkbox (localStorage) |
| `updateProgress()` | Progress bar + nav tick marks |
| `playSurahWord(surah, verse, word)` | Streams word audio from `audio.qurancdn.com/wbw/` for Quranic words |
| `playDuaWord(duaId, wordIndex)` | Plays `assets/audio/words/{duaId}_{index}.mp3` for prayer dua words |
| `activateScrollSpy()` | Highlights active section while scrolling |
| `getPostureIcon(posture)` | Maps posture string → emoji (🧍 🙇 🛐 🧎) |

### Rak'ah structure parsing

`builder.js` reads `salah["rak'ah_structure"].standard_sequence` from `salah.json` and injects the Wajjahtu section right after Sana at runtime. Recommended short surahs are appended after the standard sequence and rendered under a separate nav group.

---

## 🗃️ Data File Structures

### dictionary.json

```json
{
  "ui": { "...UI label strings..." },
  "global_dictionary": {
    "word_key": { "ar": "...", "tr": "...", "en": "...", "ml": "..." }
  }
}
```

### salah.json

```json
{
  "schedule": [ { "prayer": "Fajr", "time_en": "...", "rak'ahs": { "sunnah_before": 2, "fardh": 2 } } ],
  "rak'ah_structure": {
    "standard_sequence": [
      { "step": "1", "name": "...", "dua_id": "sana", "posture": "standing" },
      { "step": "3", "surah_id": 1, "posture": "standing" }
    ]
  },
  "surah_usage": {
    "recommended_short": [ { "surah_id": 112, "note": "..." } ]
  },
  "duas": {
    "sana": {
      "name_en": "Opening Supplication (Sana)",
      "posture": "standing",
      "words": [ { "ar": "سُبْحَانَكَ", "tr": "Subhanaaka", "en": "Glory be to You", "ml": "..." } ],
      "complete": { "ar": "...", "en": "...", "ml": "..." },
      "notes": [ "..." ]
    }
  }
}
```

### quran.json

```json
{
  "surahs": [
    {
      "number": 1,
      "name_en": "Al-Fatihah",
      "verses_data": [
        {
          "verse": 1,
          "words": [ { "ar": "بِسْمِ", "tr": "Bismi", "en": "In (the) name", "ml": "...", "w": 1 } ]
        }
      ],
      "complete_text": { "ar": "...", "en": "...", "ml": "..." },
      "tajweed_notes": [ "..." ]
    }
  ]
}
```

> The `w` field in Surah word objects is the word position number used for the Quran CDN audio URL (`audio.qurancdn.com/wbw/{surah}/{verse}/{w}.mp3`).

---

## ✨ Features

| Feature | Detail |
|---------|--------|
| Word-by-word table | Arabic · Transliteration · English · Malayalam |
| Arabic font | Amiri (Google Fonts), full diacritics, RTL |
| Complete dua block | Full text (Arabic + English + Malayalam) per section |
| Pronunciation notes | Tajweed + posture notes per section |
| Dark mode | Toggle, saved in localStorage |
| Progress tracking | Memorised checkboxes, saved in localStorage |
| Sidebar navigation | Two groups (Salah Steps / Short Surahs); hamburger on mobile |
| Scroll spy | Active section highlights in nav |
| Surah audio | Streams from Quran CDN (`audio.qurancdn.com/wbw/`) — live, no local files needed |
| Dua audio | Plays `assets/audio/words/{duaId}_{index}.mp3`; shows toast if absent |
| Print | Clean A4 format, all interactive elements hidden |
| Responsive | iPhone, Android, tablet, desktop |
| No backend | Pure HTML + CSS + JS — GitHub Pages |

---

## 🔊 Audio Setup

### Surah words (already working)
Surah word audio is live — it streams directly from `https://audio.qurancdn.com/wbw/{surah}/{verse}/{word}.mp3`. No local files required.

> ⚠️ **Known bug in `playSurahWord()`:** The variable `wordNum` is used but `word` is the correct parameter. Fix:
> ```js
> // Current (broken):
> const w = String(wordNum).padStart(3, '0');
> // Fix:
> const w = String(word).padStart(3, '0');
> ```

### Prayer dua words (pending)
To activate local dua audio:

1. Create `assets/audio/words/`
2. Add MP3 files named `{duaId}_{wordIndex}.mp3` — e.g. `sana_0.mp3`, `sana_1.mp3`, `tashahhud_0.mp3`

**Dua audio sources:**
- Record with a local scholar for clearest pronunciation
- Source from open-licence Islamic learning platforms in Kerala
- Kerala mosque recitations available through SAMASTHA educational audio materials

---

## 🌍 Adding a Language

1. Add a field to every word object in `dictionary.json` (e.g. `"ur"` for Urdu) and in `salah.json`/`quran.json` word entries
2. In `builder.js`, add a column in `buildWordRows()` and `buildCard()`
3. Add the column header in the table header in `buildCard()`

The change propagates to all sections automatically.

---

## 🤝 Contribution Guide

### Translation contributions
- **Do not write translations from scratch.** Use the verified sources listed in the Translation Sources section.
- For Quranic words: copy Malayalam from quranwbw.com (set language to Malayalam)
- For prayer duas: cite the source you used in a PR comment
- If unsure, mark the entry with `"ml_unverified": true` so it can be flagged for review

### Adding a section / dua
1. Add new words to the `duas` object in `salah.json`
2. Add the dua entry with `words`, `complete`, and `notes`
3. Add the step to `rak'ah_structure.standard_sequence` (or `surah_usage.recommended_short` for surahs)
4. Nav link and card are built automatically

### Adding a surah
1. Add the surah object to `quran.json` → `surahs[]`
2. Include `number`, `name_en`, `verses_data`, `complete_text`, `tajweed_notes`
3. Reference the surah by `surah_id` in `salah.json` → `surah_usage.recommended_short`

### Fixing a translation
Find the word entry in the relevant JSON file, edit the field. One change fixes it everywhere that word is used.

### Code rules
- No frameworks — vanilla HTML5, CSS3, JavaScript
- All interactive elements hidden in `@media print`
- Arabic always: `font-family: var(--amiri); direction: rtl`
- localStorage keys: `dua-{feature}-{id}`
- Fetch paths in builder.js: `../assets/data/{filename}.json`

### Design tokens
```
--green:  #1f4e3d    Primary colour
--gold:   #c79c60    Accent
--amiri:  'Amiri', serif    Always use for Arabic
```

---

## 🗺️ Planned

- [ ] Fix `playSurahWord()` variable bug (`wordNum` → `word`)
- [ ] Real word-by-word dua audio (all prayer sections)
- [ ] Full-section recitation audio player
- [ ] Quiz Mode — hide translations, reveal on tap
- [ ] Posture SVG illustrations per section
- [ ] Urdu + Tamil columns
- [ ] Tajweed colour coding on Arabic text
- [ ] Prayer reminder integration (`reminder/` module)
- [ ] Malayalam translations fully verified against IPH/SAMASTHA sources

---

## 📎 Other Nawavazhi Modules

| Module | Path | Status |
|--------|------|--------|
| Salah Guide | `salah/` | ✅ Active |
| Ablution (Wudu) | `ablution/` | 🔜 Planned |
| Quran Tajweed | `quran/` | 🔜 Planned |
| Prayer Reminders | `reminder/` | 🔜 Planned |

All modules share `assets/` and follow the same JSON → builder.js → index.html pattern.

---

## 🌟 About

Built to help people pray with understanding, not just memorisation. If this helped you, share it — that is the goal.

**Nawavazhi** — tools built to help, freely shared.
Contact: nawavazhi@gmail.com | https://github.com/nawavazhi

---

*Repository: https://github.com/nawavazhi/dua*
