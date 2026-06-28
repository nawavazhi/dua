# Project Dua — Salah Guide

Word-by-word Arabic, English, and Malayalam guide to Islamic daily prayer. Every dua from Takbeer to Tasleem, broken down word by word with transliteration, full audio, posture cues, and memorisation tracking.

No ads. No accounts. No tracking. Open source.

---

## What this is

Most Muslims recite Salah in Arabic without fully understanding what each word means. This guide fixes that. Every phrase you recite in prayer is laid out in a table: the Arabic word, its transliteration, its English meaning, and its Malayalam translation — side by side, in prayer order.

The goal is *khushoo* — the focused, aware presence in prayer that comes when you know what you are saying.

---

## Modules

| Module | Status | Description |
|---|---|---|
| **Salah Guide** | Live | Word-by-word prayer guide — all duas, all surahs |
| **Prayer Reminders** | In development | Prayer-time alerts with motivational messages |
| **Ablution Guide** | Planned | Wudu, Tayammum, and Ghusl step by step |
| **Quran Reader** | Planned | All 114 surahs with word-by-word translation |

---

## Salah Guide — what's inside

### Prayer schedule

A table of all five daily prayers with rak'ah counts for Sunnah Before, Fardh, and Sunnah After. Sourced from hadith.

### Step-by-step dua cards

Every dua of a standard rak'ah, in sequence:

| Step | Dua | Posture |
|---|---|---|
| 1 | Takbeer ul-Ihram | Standing |
| 2 | Opening Dua — Sana | Standing |
| 2b | Opening Dua — Wajjahtu (alternative) | Standing |
| 3 | Surah Al-Fatihah | Standing |
| 4 | Additional Surah | Standing |
| 5 | Ruku | Bowing |
| 6 | Rising from Ruku — I'tidal | Standing |
| 7 | Extended Praise — Mil as-Samawati | Standing |
| 8 | **First Sujood** | Prostration |
| 9 | Sitting between Sujoods — Jalsah | Sitting |
| 10 | **Second Sujood** | Prostration |
| 11 | Tashahhud (middle — after 2nd rak'ah) | Sitting |
| 12 | Tashahhud (final) | Sitting |
| 13 | Durood Ibrahim | Sitting |
| 14 | Dua Before Tasleem | Sitting |
| 15 | Tasleem | Sitting |

Each card shows:
- **Posture icon** — visual cue for standing, bowing, prostration, or sitting
- **Word table** — Arabic, transliteration, English, Malayalam for every word
- **Audio buttons** — tap any Quran word to hear it
- **Complete recitation** — full Arabic, English, and Malayalam as a block
- **Notes** — pronunciation tips and fiqh notes where relevant
- **Memorised checkbox** — saved locally to your device

### Short Surahs

Al-Ikhlas, Al-Falaq, An-Nas, Al-Asr, and Al-Kawtar — the most commonly recited short surahs — are included with full word-by-word breakdowns and tajweed notes.

---

## Sources

All content is verified against authenticated Islamic sources:

- **Hadith**: Sahih Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Ibn Majah, Nasa'i
- **Fiqh**: Fiqh us-Sunnah (Sayyid Sabiq), Al-Mulakhas Al-Fiqhi (Salih Al-Fawzan)
- **Arabic text**: Uthmani script — King Fahd Complex standard (Medina Mushaf)
- **Transliteration**: Standard academic Latin transliteration
- **English**: Saheeh International translation
- **Audio**: QuranCDN (word-by-word) — stable since 2015

---

## Features

### Four themes
Light, Dark, Dua (heritage green), and Noor (Islamic minimal). Theme preference is saved to `localStorage` — no server, no cookie.

### Audio
Quran word audio is served by QuranCDN at `https://audio.qurancdn.com/wbw/{surah}/{verse}/{word}.mp3`. Tap any Arabic word in a Surah card to play it.

Dua word audio (for prayer duas, not surahs) will be hosted locally in `assets/audio/words/` — in progress.

### Print / Save PDF
The print FAB in the bottom right corner triggers `window.print()`. All UI chrome (topbar, sidebar, buttons) is hidden in print styles. Cards print cleanly with proper page breaks and adjusted font sizes.

### Progress tracking
Every card has a "Memorised" checkbox. State is stored in `localStorage` under `dua-memo-{id}`. A progress bar and counter at the top of the page shows how many sections are complete. No data leaves the device.

### Responsive layout
- On mobile: sidebar is off-canvas, opened by the hamburger button.
- On desktop (780px+): sidebar is always visible; the main content shifts right.

---

## File structure

```
/
├── index.html                   ← Project landing page (module hub)
├── README.md
│
├── salah/
│   └── index.html               ← Salah guide — the main module
│
├── ablution/                    ← Planned
├── quran/                       ← Planned
├── reminder/                    ← In development
│
└── assets/
    ├── theme/
    │   ├── theme.css            ← CSS variable system (4 themes)
    │   └── theme.js             ← Theme engine + topbar injection
    ├── css/
    │   └── style.css            ← Global layout shared by all modules
    ├── icons/
    │   └── icons.js             ← SVG icon registry (no emojis)
    ├── js/
    │   └── builder.js           ← Salah guide page builder
    ├── data/
    │   ├── salah.json           ← All prayer duas + schedule + rak'ah structure
    │   ├── quran.json           ← Short surah data + API config
    │   ├── ablution.json        ← Wudu, Tayammum, Ghusl data
    │   ├── reminder.json        ← Prayer time API config + reminder quotes
    │   └── dictionary.json      ← UI string translations (i18n, reserved)
    └── audio/
        └── words/               ← Dua word audio files (in progress)
```

---

## Architecture

### Theme system (`theme.css` + `theme.js`)
`theme.css` defines four named themes using CSS custom properties on `[data-theme]`. `theme.js` reads `localStorage`, applies the correct theme, rebuilds the topbar with a theme switcher, and injects the theme panel.

Load order for every module page:
```html
<script src="../assets/icons/icons.js"></script>   <!-- first -->
<script src="../assets/theme/theme.js"></script>    <!-- second -->
<script src="../assets/js/builder.js"></script>     <!-- last -->
```

### Builder (`builder.js`)
Fetches `salah.json` and `quran.json`, then builds the entire page in JavaScript:

1. Expands the rak'ah sequence (injects Wajjahtu after Sana)
2. Iterates every step — each step becomes one card, no deduplication
3. Recommended short surahs are appended after the main sequence
4. Sidebar navigation is built from the same sections list
5. Scroll spy activates using IntersectionObserver on `.card` elements

### Data files (`assets/data/*.json`)
Each JSON file has a `meta` block with version, sources, and developer info. Surahs stored locally have `"storage": "local"` and include `verses_data`. All 114 surahs are listed in `quran.json` for metadata; only surahs with 20 or fewer verses are stored locally — longer surahs will be fetched live from the Quran.com API.

---

## Development

No build step. No dependencies. Open any HTML file directly in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Files must be served over HTTP (not `file://`) for the `fetch()` calls in `builder.js` to work.

### Adding a new icon
Open `assets/icons/icons.js` and add a new key to the `icons` object. Use the same `SVG_ATTR` string for consistency. All icons are 24×24 viewBox, 2.5px stroke, round caps and joins — no fill.

### Adding a new dua
Add it to `assets/data/salah.json` under `duas`, then reference it by `dua_id` in `rak'ah_structure.standard_sequence`. The builder will render it automatically in sequence order.

### Changing the theme
Edit `assets/theme/theme.css`. Each `[data-theme]` block is fully self-contained. The `light` theme is the default (applied on `<html data-theme="light">`).

---

## Browser support

Modern browsers — Chrome, Firefox, Safari, Edge. Requires:
- `fetch()` (all modern browsers)
- `IntersectionObserver` (all modern browsers)
- `localStorage` (all browsers — used for theme and progress)
- CSS custom properties (all modern browsers)

---

## Contributing

Corrections to Arabic text, transliteration, or translations are the most valuable contributions. If you find an error:

1. Fork the repo
2. Edit the relevant JSON file in `assets/data/`
3. Validate your JSON at [jsonlint.com](https://jsonlint.com)
4. Open a pull request with the source for your correction

For UI or feature contributions, open an issue first to discuss.

---

## Credits

Built by [Nawavazhi](https://github.com/nawavazhi). Freely shared for all. No rights reserved.

Arabic audio from [QuranCDN](https://audio.qurancdn.com). Quran text from the King Fahd Complex (Medina Mushaf standard). Translations verified against Saheeh International.

May Allah accept it from us and make it beneficial.
