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
                    All content is fetched from database.json at runtime.
```

---

## 🏗️ How It Works

```
salah/index.html  →  assets/js/builder.js  →  assets/data/database.json
                            ↓
         Builds: nav, schedule, word-by-word cards,
                 complete duas, notes, audio buttons
```

Data-driven architecture: fix one entry in `database.json` → it updates everywhere.

---

## 📁 Required Files (outside this folder)

| File | Location | Purpose |
|------|----------|---------|
| `database.json` | `assets/data/` | All words, sections, translations |
| `builder.js` | `assets/js/` | Builds the page from JSON |
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

## ⚙️ builder.js — What It Does

| Function | What it builds |
|----------|---------------|
| `buildNav()` | Sidebar links from section data |
| `buildScheduleCard()` | Daily prayer schedule table |
| `buildSectionCards()` | All word-by-word section cards |
| `buildWordRows()` | Looks up each key in `global_dictionary` |
| `buildDuaBlock()` | Gold "Complete Recitation" block at card bottom |
| `buildNotesBlock()` | Pronunciation notes list |
| `toggleDark()` | Dark/light mode (localStorage) |
| `markDone()` | Memorised checkbox (localStorage) |
| `updateProgress()` | Progress bar + nav tick marks |
| `playWord()` | Plays `assets/audio/words/{key}.mp3` |
| `activateScrollSpy()` | Highlights active section while scrolling |

---

## 🗃️ database.json — Structure

```json
{
  "meta": { ... project + developer info ... },
  "global_dictionary": { "word_key": { "ar", "tr", "en", "ml" } },
  "salah_guide": {
    "schedule": [ ... ],
    "sections": [
      {
        "id": 1,
        "title": "...",
        "posture": "...",
        "posture_icon": "...",
        "sequence": ["word_key1", "word_key2"],
        "complete_dua": { "ar", "en", "ml" },
        "notes": [ "..." ]
      }
    ]
  }
}
```

One word in `global_dictionary` = one row in the table. A word shared across sections is stored once and referenced by key everywhere.

---

## ✨ Features

| Feature | Detail |
|---------|--------|
| Word-by-word table | Arabic · Transliteration · English · Malayalam |
| Arabic font | Amiri (Google Fonts), 1.55rem, full diacritics |
| Complete dua block | Full text (Arabic + English + Malayalam) per section |
| Pronunciation notes | Tajweed + posture notes per section |
| Dark mode | Toggle, saved in localStorage |
| Progress tracking | Memorised checkboxes, saved in localStorage |
| Sidebar navigation | Always on desktop, hamburger on mobile |
| Scroll spy | Active section highlights in nav |
| Audio buttons | Tries `assets/audio/words/{key}.mp3`, shows toast if absent |
| Print | Clean A4 format, all interactive elements hidden |
| Responsive | iPhone, Android, tablet, desktop |
| No backend | Pure HTML + CSS + JS — GitHub Pages |

---

## 🔊 Audio Setup (Pending)

Audio is wired and waiting. To activate:

1. Create `assets/audio/words/`
2. Add MP3 files named by `global_dictionary` key: `allahu.mp3`, `akbar.mp3`, etc.

**Free audio sources for Quranic words:**
- [Quran.com Audio API](https://api.quran.com/documentation/v4) — word-by-word audio by verse/word position
- [EveryAyah.com](https://everyayah.com) — full Surah MP3s by Qari

**For prayer dua audio** (Sana, Tashahhud, etc.) — these are Sunnah, not Quran, so Quran APIs don't cover them. Options:
- Record with a local scholar for clearest pronunciation
- Source from open-licence Islamic learning platforms in Kerala

---

## 🌍 Adding a Language

1. Add a field to every `global_dictionary` entry (e.g. `"ur"` for Urdu)
2. In `builder.js`, add a column in `buildWordRows()` and `buildCard()`
3. Add the column header in the table header

Only one change per place — it propagates to all 16 sections automatically.

---

## 🤝 Contribution Guide

### Translation contributions
- **Do not write translations from scratch.** Use the verified sources listed in the Translation Sources section.
- For Quranic words: copy Malayalam from quranwbw.com (set language to Malayalam)
- For prayer duas: cite the source you used in a PR comment
- If unsure, mark the entry with `"ml_unverified": true` so it can be flagged for review

### Adding a section
1. Add new words to `global_dictionary`
2. Add the section object to `salah_guide.sections`
3. Fill `sequence`, `complete_dua`, `notes`
4. Update `TOTAL_SECTIONS` in `builder.js`
5. Nav link is built automatically

### Fixing a translation
Find the key in `global_dictionary`, edit the field. One change fixes it everywhere.

### Code rules
- No frameworks — vanilla HTML5, CSS3, JavaScript
- All interactive elements hidden in `@media print`
- Arabic always: `font-family: var(--amiri); direction: rtl`
- localStorage keys: `dua-{feature}-{id}`
- Fetch path in builder.js: `../assets/data/database.json`

### Design tokens
```
--green:  #1f4e3d    Primary colour
--gold:   #c79c60    Accent
--amiri:  'Amiri', serif    Always use for Arabic
```

---

## 🗺️ Planned

- [ ] Real word-by-word audio (all 16 sections)
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
