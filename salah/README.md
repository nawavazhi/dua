# Project Dua

> Word-by-word Islamic prayer guide — Arabic, English, Malayalam.  
> No ads. No accounts. No tracking. Open source.

**[Open Salah Guide](https://nawavazhi.github.io/dua/salah/)** · [View on GitHub](https://github.com/nawavazhi/dua)

---

## What this is

Most Muslims recite Salah in Arabic without fully understanding what each word means. This project fixes that. Every phrase you recite in prayer is laid out word by word — Arabic, transliteration, English meaning, and Malayalam translation — in prayer order, with audio, posture cues, and memorisation tracking.

The goal is *khushoo* — the focused, present awareness in prayer that comes when you know exactly what you are saying.

---

## Modules

| Module | Status | Link |
|---|---|---|
| **Salah Guide** | Live | [Open](https://nawavazhi.github.io/dua/salah/) |
| **Prayer Reminders** | In development | — |
| **Ablution Guide** | Planned | — |
| **Quran Reader** | Planned | — |

---

## Salah Guide

### What's covered

Every step of a standard rak'ah, in sequence:

| # | Step | Dua | Posture |
|---|---|---|---|
| 1 | Takbeer ul-Ihram | Allahu Akbar | Standing |
| 2 | Opening Dua — Sana | Subhanakal-Lahumma... | Standing |
| 2b | Opening Dua — Wajjahtu | Wajjahtu wajhiya... (alternative) | Standing |
| 3 | Surah Al-Fatihah | Obligatory every rak'ah | Standing |
| 4 | Additional Surah | Al-Ikhlas, Al-Falaq, An-Nas, etc. | Standing |
| 5 | Ruku | Subhana Rabbiyyal Azeem | Bowing |
| 6 | Rising from Ruku — I'tidal | Sami'Allahu liman hamidah... | Standing |
| 7 | Extended Praise | Mil as-Samawati... | Standing |
| 8 | **First Sujood** | Subhana Rabbiyyal A'la | Prostration |
| 9 | Sitting between Sujoods — Jalsah | Rabbighfirli... | Sitting |
| 10 | **Second Sujood** | Subhana Rabbiyyal A'la | Prostration |
| 11 | Tashahhud — middle | At-Tahiyyatu... | Sitting |
| 12 | Tashahhud — final | At-Tahiyyatu... | Sitting |
| 13 | Durood Ibrahim | Allahumma salli ala Muhammad... | Sitting |
| 14 | Dua Before Tasleem | Allahumma inni zalamtu... | Sitting |
| 15 | Tasleem | Assalamu alaykum... | Sitting |

Short Surahs included word by word: Al-Ikhlas (112), Al-Falaq (113), An-Nas (114), Al-Asr (103), Al-Kawtar (108).

### Features

- **Word-by-word table** — Arabic, transliteration, English, Malayalam side by side
- **Audio** — tap any Quran word to hear it (QuranCDN)
- **Posture icons** — visual cue for standing, bowing, prostration, sitting
- **Complete recitation block** — full Arabic + English + Malayalam per section
- **Memorised checkbox** — saved to `localStorage`, no account needed
- **Progress bar** — tracks how many sections are marked memorised
- **Four themes** — Light, Dark, Dua (heritage green), Noor (Islamic minimal)
- **Print / PDF** — clean print stylesheet, all chrome hidden
- **Responsive** — mobile sidebar, desktop always-open nav

### Sources

| Type | Source |
|---|---|
| Hadith | Sahih Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Ibn Majah, Nasa'i |
| Fiqh | Fiqh us-Sunnah (Sayyid Sabiq), Al-Mulakhas Al-Fiqhi (Salih Al-Fawzan) |
| Arabic text | Uthmani script — King Fahd Complex, Medina Mushaf standard |
| English | Saheeh International translation |
| Word audio | [QuranCDN](https://audio.qurancdn.com) — wbw format |

---

## File structure

```
/
├── index.html                     ← Project landing page
├── README.md
│
├── salah/
│   └── index.html                 ← Salah guide (live)
│
├── ablution/                      ← Planned
├── quran/                         ← Planned
└── reminder/                      ← In development
    └── notifications.js           ← Placeholder
│
└── assets/
    ├── theme/
    │   ├── theme.css              ← CSS variable system (4 themes)
    │   └── theme.js               ← Theme engine + topbar injection
    ├── css/
    │   └── style.css              ← Global layout (all modules)
    ├── icons/
    │   └── icons.js               ← SVG icon registry (no emojis)
    ├── js/
    │   └── builder.js             ← Salah page builder (v4.0)
    └── data/
        ├── salah.json             ← All duas, schedule, rak'ah structure
        ├── quran.json             ← Surah data + API config
        ├── ablution.json          ← Wudu, Tayammum, Ghusl
        ├── reminder.json          ← Prayer time API + reminder quotes
        └── dictionary.json        ← UI strings (i18n, reserved)
```

---

## Architecture

### Script load order

Every module page must load scripts in this exact order:

```html
<script src="../assets/icons/icons.js"></script>   <!-- 1st: icon registry -->
<script src="../assets/theme/theme.js"></script>    <!-- 2nd: theme engine -->
<script src="../assets/js/builder.js"></script>     <!-- 3rd: page builder -->
```

### Theme system

`theme.css` defines four themes as CSS custom property blocks on `[data-theme]`. `theme.js` reads `localStorage('dua-theme')`, rebuilds the topbar with a theme switcher, and applies the saved theme. Boot order: `_buildTopbar()` → `DuaTheme.init()` → `_buildThemePanel()` — topbar must exist before `init()` so the theme button can be updated.

### Builder (salah guide)

1. Fetches `salah.json` + `quran.json` in parallel
2. Injects Wajjahtu after Sana in the sequence
3. Iterates every sequence step — no deduplication, so sujood and tashahhud each render twice
4. Appends recommended short surahs
5. Builds sidebar nav, schedule card, and all section cards
6. Scroll spy uses `IntersectionObserver` on `.card, #intro`

### Audio

Quran word audio: `https://audio.qurancdn.com/wbw/{SSS}_{VVV}_{WWW}.mp3`  
Numbers are **zero-padded to 3 digits**, **underscore-separated** — e.g. `108_001_001.mp3`.  
A forward-slash format was tested and failed. Do not change this format.

---

## Development

No build step, no dependencies. Serve any folder over HTTP:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Files must be served over HTTP (`fetch()` won't work on `file://`).

### Adding an icon

Open `assets/icons/icons.js`, add a key to the `icons` object using the `SVG_ATTR` constant. All icons: 24×24 viewBox, 2.5px stroke, round caps, no fill. Call with `DuaIcons.get('key_name')`.

### Adding a dua

1. Add the dua object to `assets/data/salah.json` under `duas`
2. Reference it by `dua_id` in `rak'ah_structure.standard_sequence`
3. Builder renders it automatically — no code changes needed

### Adding a theme

Add a `[data-theme="name"]` block to `assets/theme/theme.css`. Add the theme definition to `DUA_THEMES` in `theme.js`. Add a swatch entry to the theme panel HTML.

---

## Browser support

Chrome, Firefox, Safari, Edge — any browser with:
- `fetch()` · `IntersectionObserver` · `localStorage` · CSS custom properties

---

## Contributing

The most valuable contributions are corrections to Arabic text, transliteration, or translations. To fix content:

1. Fork the repo
2. Edit the relevant `.json` file in `assets/data/`
3. Validate your JSON at [jsonlint.com](https://jsonlint.com)
4. Open a pull request with the hadith or scholarly source for your correction

For UI or feature work, open an issue first.

---

## Credits

Built by [Nawavazhi](https://github.com/nawavazhi).  
Arabic audio from [QuranCDN](https://audio.qurancdn.com).  
Quran text: King Fahd Complex (Medina Mushaf).  
Translations verified against Saheeh International.

Freely shared for all — no rights reserved.

*May Allah accept it and make it a source of benefit.*
