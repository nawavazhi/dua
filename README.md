# dua

> Word-by-word Islamic prayer guide — Arabic, English, Malayalam.  
> No ads. No accounts. No tracking. Open source.

**[Open sujood](https://nawavazhi.github.io/dua/sujood/)** · [GitHub](https://github.com/nawavazhi/dua)

---

## What this is

Most Muslims recite Salah in Arabic without fully understanding each word. dua fixes that. Every phrase you recite is laid out word by word — Arabic, transliteration, English, and Malayalam — in prayer order, with audio, posture cues, and memorisation tracking.

---

## Modules

| Module | Status |
|---|---|
| **[sujood](https://nawavazhi.github.io/dua/sujood/)** — Salah word-by-word guide | Live |
| **miqat** — Prayer times, reminders, Qalah tracking | In development |
| **wudu** — Ablution guide (Wudu, Tayammum, Ghusl) | Planned |
| **quran** — Full Quran reader | Planned |

---

## sujood — steps covered

| # | Step | Posture |
|---|---|---|
| 1 | Takbeer ul-Ihram | Standing |
| 2 | Opening Dua — Sana | Standing |
| 2b | Opening Dua — Wajjahtu (alternative) | Standing |
| 3 | Surah Al-Fatihah | Standing |
| 4 | Additional Surah | Standing |
| 5 | Ruku | Bowing |
| 6 | Rising from Ruku — I'tidal | Standing |
| 7 | Extended Praise — Mil as-Samawati | Standing |
| 8 | First Sujood | Prostration |
| 9 | Sitting between Sujoods — Jalsah | Sitting |
| 10 | Second Sujood | Prostration |
| 11 | Tashahhud — middle | Sitting |
| 12 | Tashahhud — final | Sitting |
| 13 | Durood Ibrahim | Sitting |
| 14 | Dua Before Tasleem | Sitting |
| 15 | Tasleem | Sitting |

Short Surahs: Al-Ikhlas (112), Al-Falaq (113), An-Nas (114), Al-Asr (103), Al-Kawtar (108).

---

## Sources

| Type | Source |
|---|---|
| Hadith | Sahih Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Ibn Majah, Nasa'i |
| Fiqh | Fiqh us-Sunnah (Sayyid Sabiq), Al-Mulakhas Al-Fiqhi (Salih Al-Fawzan) |
| Arabic text | Uthmani script — King Fahd Complex (Medina Mushaf) |
| English | Saheeh International |
| Word audio | QuranCDN — wbw/{SSS}_{VVV}_{WWW}.mp3 (zero-padded, underscore) |

---

## File structure

```
/
├── index.html                  ← Landing hub page
├── README.md
├── salah/
│   └── index.html              ← Salah guide (live)
├── ablution/                   ← Planned
├── quran/                      ← Planned
└── reminder/
    └── notifications.js        ← Placeholder (0 bytes)
└── assets/
    ├── theme/
    │   ├── theme.css           ← 4-theme CSS variable system
    │   └── theme.js            ← Theme engine, topbar, print injection
    ├── css/
    │   └── style.css           ← Global layout (all modules)
    ├── icons/
    │   └── icons.js            ← SVG registry. No emojis. 1.75px stroke.
    ├── js/
    │   └── builder.js          ← Salah page builder v4.0
    └── data/
        ├── salah.json          ← All duas, schedule, rak'ah structure
        ├── quran.json          ← Surahs, API config, audio config
        ├── ablution.json       ← Wudu, Tayammum, Ghusl
        ├── reminder.json       ← Prayer time API + reminder quotes
        └── dictionary.json     ← UI strings (i18n — reserved, not yet wired)
```

---

## Script load order

Every module page must load in this order:

```html
<script src="../assets/icons/icons.js"></script>   <!-- 1st -->
<script src="../assets/theme/theme.js"></script>    <!-- 2nd -->
<script src="../assets/js/builder.js"></script>     <!-- 3rd -->
```

## Audio — critical rules

Quran word audio uses QuranCDN in this exact format:
```
https://audio.qurancdn.com/wbw/108_001_001.mp3
```
Zero-padded to 3 digits, underscore-separated. A forward-slash format was
tested and failed. Do not change this format.

Full verse audio (planned): EveryAyah.com
```
https://everyayah.com/data/Alafasy_128kbps/108001.mp3
```

---

## Development

```bash
python3 -m http.server 8000
```

Files must be served over HTTP — `fetch()` won't work on `file://`.

---

## Contributing

Fix content (Arabic text, transliteration, translations) by editing the JSON files in `assets/data/`. Validate at [jsonlint.com](https://jsonlint.com). Open a pull request with the hadith/scholarly source.

---

## Credits

Built by [Nawavazhi](https://github.com/nawavazhi). Freely shared for all.  
Audio from [QuranCDN](https://audio.qurancdn.com).  
Quran text: King Fahd Complex (Medina Mushaf).

*May Allah accept it.*

<!--
================================================================================
AI_CONTEXT — dua (nawavazhi/dua)
This section is machine-readable only. Hidden from rendered markdown.
Edit the raw file to read. Last updated: 2026-06.
================================================================================

PROJECT IDENTITY
  Name: dua (lowercase, always)
  Repo: https://github.com/nawavazhi/dua
  Pages: https://nawavazhi.github.io/dua/
  Stack: Vanilla HTML/CSS/JS. No build step. No framework. No dependencies.
  Audience: Malayalam-speaking Muslims learning prayer word-by-word.

DESIGN SYSTEM
  Colours:
    --primary:     #1f4e3d  (deep forest green)
    --primary-mid: #2a6953
    --primary-fg:  #FFFFFF
    --accent:      #c79c60  (warm gold)
    --accent-bg:   rgba(199,156,96,0.10)
    Dark mode primary: #3DB882, accent: #D7A055
  Themes: light (default), dark, dua (heritage green), noor (Islamic minimal)
  Icons: DuaIcons SVG registry in assets/icons/icons.js
         stroke-width: 1.75, 24x24 viewBox, width/height="24" set in SVG_ATTR
         No emojis anywhere in the codebase.
  Fonts: Inter (UI), Plus Jakarta Sans (display), Noto Naskh Arabic (Arabic)
  Rule: No emojis. Use SVG icons only.

ARCHITECTURE
  theme.js boot order (CRITICAL — do not reorder):
    1. _buildTopbar()     must run before init so #theme-btn exists
    2. DuaTheme.init()    reads localStorage, updates theme button
    3. _buildThemePanel() builds the theme switcher panel
  
  builder.js data flow:
    fetch(salah.json) + fetch(quran.json)
    → buildPage(salah, quran)
      → injects sana_wajjahtu after sana in sequence
      → iterates sequence (NO deduplication — sujood x2, tashahhud x2 intentional)
      → appends recommended_short surahs
      → buildNav() + buildScheduleCard() + buildSectionCards()
    → restoreProgress() + updateProgress() + activateScrollSpy()

AUDIO — DO NOT CHANGE
  Quran word-by-word:
    URL: https://audio.qurancdn.com/wbw/{SSS}_{VVV}_{WWW}.mp3
    Format: zero-padded to 3 digits, UNDERSCORE separated
    Example: https://audio.qurancdn.com/wbw/108_001_001.mp3
    HISTORY: Was changed to slash format (108/1/1.mp3) — BROKE audio.
             Reverted. The slash format does NOT work. Do not change.

  Full verse audio (not yet implemented in builder):
    Provider: EveryAyah.com
    URL: https://everyayah.com/data/{reciter}/{surah_3d}{verse_3d}.mp3
    Example: https://everyayah.com/data/Alafasy_128kbps/108001.mp3
    Reciters: Alafasy_128kbps, Husary_128kbps, AbdulSamad_128kbps_ketaab, Minshawi_128kbps
    Note: Returns 403 on server-to-server. Works fine in browser. Normal CDN.

  Dua word audio:
    assets/audio/words/ is empty. No CDN exists for this content.
    Planned solution: Web Speech API lang='ar-SA' reads Arabic text.
    iOS requires user gesture — already satisfied since triggered by button click.

  Malayalam translation audio:
    No per-verse CDN exists.
    Planned: Web Speech API lang='ml-IN'. Works if device has Malayalam voice.
    Most Kerala Android devices have it. Available on iOS since version 9.

  English translation audio:
    Web Speech API lang='en-US'. Works offline. Siri/Google TTS engine.

MODULES STATUS
  sujood/      LIVE  (was: salah/ — renamed)
    - builder.js v5.0, 15-step sequence, sujood x2, tashahhud x2
    - 6 short surahs locally: Al-Fatihah, Al-Asr, Al-Kawtar, Al-Ikhlas, Al-Falaq, An-Nas
    - Arabic: Uthmani Hafs from ara-quranuthmanihaf.json (extracted into sujood/quran.json)
    - English: Saheeh International from eng-ummmuhammad.json (extracted)
    - Malayalam: Abdul Hameed Madani from mal-abdulhameedmada.json (extracted)
    - Audio: QuranCDN word-by-word (108_001_001.mp3 padded underscore — DO NOT CHANGE)
    - Audio: EveryAyah verse audio, reciter selector (5 reciters), stored in localStorage
    - TTS: Web Speech API for dua words (ar-SA), English (en-US), Malayalam (ml-IN)
    - Verse translations displayed per verse below word table
    - sujood/index.html title: "sujood — dua"

  miqat/       IN DEVELOPMENT  (was: reminder/ — renamed)
    Files: miqat/index.html, miqat/builder.js, miqat/style.css, miqat/reminder.json
    miqat builder.js: 711 lines, Aladhan API, 5 calculation methods
    miqat features: prayer times, countdown, confirmation, rewards, chart, qalah
    miqat data: miqat/reminder.json (per-prayer hadith in EN+ML, qalah messages)
    miqat notifications: Web Notifications API with iOS Safari guard (isIOS check)
    miqat persistence: localStorage 'miqat-settings' + 'miqat-log'
    - Prayer times from Aladhan API (free, no key, by GPS or city)
    - Calculation methods: Karachi/ISNA/MWL/UmmAlQura/Egyptian
    - Countdown timer to next prayer, turns urgent at <15 min
    - Prayer confirmation per prayer with hadith reward message
    - Auto-miss detection when next prayer window opens
    - checkYesterdayIsha() prevents Isha staying null overnight
    - Qalah tracker: counts owed prayers, markQalah() clears oldest
    - 7/30 day prayer chart (CSS grid heatmap)
    - Streak counter with milestone messages (1/3/7/30 days)
    - Browser notifications via Notification API (iOS guard added)
    - toggleNav/closeNav stubs (theme.js topbar compatibility)
    - settings-overlay: method change + location reset
    - ALL data in localStorage — no server, no account

  wudu/        PLANNED  (was: ablution/ — renamed)
    - ablution.json complete: wudu 13 steps, tayammum 6 steps
    - NOTE: ghusl uses fardh_parts/sunnah_steps keys (not steps[]) — handle differently
    - No HTML yet

  quran/       PLANNED
    - quran.json will have 114 surah metadata + API config (not embedded verses)
    - Will fetch from ../assets/translations/ on demand
    - No HTML yet
    - reminder.json complete: prayer time API config (Aladhan), quotes per prayer
    - notifications.js: 0-byte placeholder, nothing references it
    - No HTML yet

  ablution/    PLANNED
    - ablution.json complete: wudu (13 steps), tayammum (6 steps), ghusl
    - SCHEMA NOTE: ghusl uses fardh_parts/sunnah_steps keys NOT a steps[] array
      like wudu and tayammum. Builder must handle this differently.
    - No HTML yet

  quran/       PLANNED
    - quran.json: all 114 surahs listed, 6 stored locally, rest fetch from API
    - Quran.com API v4 configured for word data
    - No HTML yet

DATA ISSUES (non-blocking)
  dua_istikharah: words key missing entirely (not an empty array []). Has
    complete text. Not in standard_sequence so never renders. Add words later.
  
  quran.json surahs order: [1,103,108,112,113,114,2,3,4...] — locally stored
    surahs placed first. builder uses .find() so order doesn't matter. Safe.
  
  dictionary.json: UI i18n strings. Fetched by old builder, removed in v4.0.
    Still exists as a resource. Not connected to any template rendering.

BUGS FIXED (complete list)
  BUG-01: seenDuas dedup — Second Sujood and Final Tashahhud missing from page
  BUG-02: Audio URL slash format — broke word audio, reverted to padded underscore
  BUG-03: builder.js header comment said wrong audio format — time-bomb, fixed
  BUG-04: section-divider invisible in Light/Noor themes (white on white)
  BUG-05: dictionary.json fetched but ui variable never used — removed fetch
  BUG-06: Scrollspy [id^="s"] matched sidebar/sections-container — changed to .card #intro
  BUG-07: Subtitle duplication in _buildTopbar() — clone-then-strip fix
  BUG-08: theme.js boot order — DuaTheme.init() before _buildTopbar() = btn always "Light"
  BUG-09: Print button had no icon after SVG removed — theme.js now injects it
  BUG-10: index.html topbar wrapper not .topbar-logo — CSS dua-icon rule didn't match
  BUG-11: salah/index.html missing meta/og tags
  BUG-12: stroke-width 2.5 too thick (2.5px on 12px icon = 21% of width)
  BUG-13: SVG_ATTR missing explicit width/height — auto-sizing in flex containers
  BUG-14: nav-link SVGs unsized — schedule icon 24px next to 12px text
  BUG-15: .dua-icon 28px too large in 54px topbar — reduced to 22px
  BUG-16: Posture icons unreadable — standing had downward-V skirt shape,
           sujood had 4 disconnected paths. Redesigned with filled-circle heads.

ICONS REGISTRY (assets/icons/icons.js)
  Navigation: menu, close, check, print, info, tip, home, arrow_right, external, lock, github, audio
  Theme: sun, moon, crescent, palette
  Islamic: mosque, quran, star, lantern, prayer, beads, calendar, schedule, scroll, bell, drop, book_open, layers
  Posture: standing, bowing, sujood, sitting, separator

PENDING — NEXT SESSION
  HIGH PRIORITY (audio):
    builder.js: Add playVerse(surah, verse) using EveryAyah.com
    builder.js: Add reciter selector to intro card
    builder.js: Replace playDuaWord() fetch with speechSynthesis lang='ar-SA'
    builder.js: Add speakEnglish(text) buttons for English TTS
    builder.js: Add speakMalayalam(text) buttons for Malayalam TTS
  
  HIGH PRIORITY (offline):
    sw.js: Service Worker — cache HTML/CSS/JS/JSON on first load
    manifest.json: PWA manifest for installability
  
  MEDIUM (content):
    salah.json: Add words[] to dua_istikharah
    ablution.json: Normalise ghusl to use steps[] array
    index.html + salah/index.html: Replace all "Project Dua" with "dua"
  
  LOW:
    reminder/: Build index.html + wire notifications.js
    quran/: Build index.html
    ablution/: Build index.html
    quran.json: Sort surahs array 1-114 in sequential order

FILES NOT YET PUSHED TO REPO (as of last session)
  All fixes from this session are in downloaded output files only.
  Files needing push:
    assets/js/builder.js      (v4.0 — many fixes)
    assets/icons/icons.js     (new icons + redesigned posture + stroke fix)
    assets/css/style.css      (section-divider, nav-link svg, dua-icon size)
    assets/theme/theme.js     (boot order, print injection, subtitle fix)
    salah/index.html          (meta tags, print-btn id)
    index.html                (new landing page)
    README.md                 (this file — was 5 bytes)

================================================================================
END AI_CONTEXT
================================================================================
-->
