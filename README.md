# dua

A word-by-word Salah guide in Arabic, transliteration, English, and Malayalam. The site also includes a preview of miqat, a prayer-time and personal prayer-log tool.

**Open the site:** [Home](https://nawavazhi.github.io/dua/) · [Salah guide (sujood)](https://nawavazhi.github.io/dua/sujood/) · [Prayer times (miqat preview)](https://nawavazhi.github.io/dua/miqat/)

## What is available

| Module | Status | Source |
| --- | --- | --- |
| sujood · Salah guide | Available | [Page](sujood/index.html) · [Prayer data](sujood/salah.json) · [Surah data](sujood/quran.json) |
| miqat · Prayer times and log | Preview | [Page](miqat/index.html) · [Reminder data](miqat/reminder.json) |
| wudu · Ablution guide | Data only; no page yet | [Ablution data](wudu/ablution.json) |
| Quran reader | Planned; no page yet | [Quran directory](quran/) |

The sujood guide follows the prayer sequence from Takbeer to Tasleem. It includes short surahs, word audio where available, verse recitation, device text-to-speech, and memorisation checkboxes. The miqat preview uses your chosen city or GPS coordinates to request prayer times and keeps your prayer log in this browser's local storage.

**Miqat reminder limit:** Browser timers cannot guarantee alerts after the app is closed or suspended. The prayer log does not sync between devices. Prayer-time lookups send your city or coordinates to the Aladhan API.

## Run locally

From the repository root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`, then use its links to visit sujood or miqat. Serve the files over HTTP; opening `index.html` directly with `file://` prevents the JSON fetches from working. The service worker uses the `/dua/` GitHub Pages prefix, so offline behavior must be checked on the deployed site.

## Project files

```text
index.html                 Home page
manifest.json              Installable app settings
sw.js                      Offline cache
assets/css/base.css        Shared layout
assets/theme/              Themes and shared top bar
assets/icons/              SVG icons and app icons
assets/fonts/              Self-hosted fonts
assets/translations/        Quran translation source data
sujood/index.html          Salah guide page
sujood/builder.js           Salah guide rendering and audio
sujood/salah.json           Prayer sequence and duas
sujood/quran.json           Surahs used in the guide
miqat/index.html            Prayer-time preview page
miqat/builder.js            Prayer times, log, and reminders
miqat/reminder.json         Reminder and reward text
wudu/ablution.json         Ablution content (page not yet built)
```

Pages load `assets/icons/icons.js` before `assets/theme/theme.js`, followed by that module's own `builder.js` where needed. The guide uses QuranCDN word audio paths with three-digit, underscore-separated numbers, for example `108_001_001.mp3`; changing them to slash-separated paths breaks playback.

## Contribute

For prayer text or translations, edit [sujood/salah.json](sujood/salah.json) or [sujood/quran.json](sujood/quran.json), and include a source when opening a pull request. For prayer-time copy, edit [miqat/reminder.json](miqat/reminder.json). Check JSON syntax and test the affected page locally before submitting changes.

Built by [Nawavazhi](https://github.com/nawavazhi).
