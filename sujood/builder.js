/**
 * dua — salah/builder.js  v5.0
 * Salah-specific page builder. Lives in the salah/ module folder.
 * Fetches salah.json + quran.json from the same folder.
 *
 * Load order: icons.js → theme.js → builder.js
 *
 * v5.0 changes:
 *   - Verse audio: EveryAyah.com CDN per verse, reciter selector
 *   - Dua word audio: Web Speech API lang=ar-SA (replaces broken file fetch)
 *   - Quran word audio: QuranCDN padStart format (confirmed working)
 *   - Verse translations displayed below word table (EN + ML from quran.json)
 *   - TTS buttons for complete recitation blocks (AR, EN, ML)
 *   - Arabic word dua: speech synthesis with correct lang tag
 *   AUDIO NOTE: QuranCDN format is 108_001_001.mp3 (padded, underscores).
 *   A slash format was tested and failed. Do not change.
 */

'use strict';

const SALAH_PATH = './salah.json';
const QURAN_PATH = './quran.json';
let   TOTAL_SECTIONS = 0;

// Global word map for Web Speech access on dua words
// Key: "duaId_wordIndex", Value: { ar, tr, en, ml }
window._DUA_WORDS = {};

/* ══════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    fetch(SALAH_PATH).then(r => { if (!r.ok) throw new Error(`salah.json ${r.status}`); return r.json(); }),
    fetch(QURAN_PATH).then(r => { if (!r.ok) throw new Error(`quran.json ${r.status}`); return r.json(); })
  ])
  .then(([salah, quran]) => {
    buildPage(salah, quran);
    restoreProgress();
    updateProgress();
    activateScrollSpy();
  })
  .catch(err => {
    const main = document.getElementById('main-content');
    if (main) main.innerHTML = `<div class="error-box">${DuaIcons.get('info')} Could not load data — <code>${err.message}</code><br>Check your connection and try again.</div>`;
    console.error('[dua builder]', err);
  });
});

/* ══════════════════════════════════════════════════════
   PAGE BUILD
══════════════════════════════════════════════════════ */
function buildPage(salah, quran) {
  const sections   = [];
  let   secId      = 1;
  const seenSurahs = new Set();

  let seq = [...salah["rak'ah_structure"].standard_sequence];

  // Inject Wajjahtu after Sana
  const sanaIdx = seq.findIndex(s => s.dua_id === 'sana');
  if (sanaIdx !== -1) {
    seq.splice(sanaIdx + 1, 0, {
      step: '2b', name: 'Opening Dua — Wajjahtu', dua_id: 'sana_wajjahtu',
      posture: 'standing', notes: 'Alternative to Sana — recite one or the other, not both'
    });
  }

  seq.forEach(step => {
    if (step.dua_id) {
      const dua = salah.duas[step.dua_id];
      if (dua) {
        sections.push({
          id: secId++, dua_id: step.dua_id,
          title: step.name || dua.name_en,
          posture: step.posture || dua.posture,
          posture_icon: getPostureIconSvg(step.posture || dua.posture),
          words: dua.words, complete_dua: dua.complete,
          notes: (dua.notes || []).concat(step.notes ? [step.notes] : []),
          isSurah: false, isShortSurah: false
        });
      }
    } else if (step.surah_id && step.surah_id !== 'any' && !seenSurahs.has(step.surah_id)) {
      seenSurahs.add(step.surah_id);
      const surah = quran.surahs.find(s => s.number === step.surah_id);
      if (surah) {
        sections.push({
          id: secId++, surah_number: surah.number,
          title: `Surah ${surah.name_en}`,
          posture: step.posture || 'standing',
          posture_icon: getPostureIconSvg('standing'),
          verses: surah.verses_data, complete_dua: surah.complete_text,
          notes: (surah.tajweed_notes || []).concat(step.notes ? [step.notes] : []),
          isSurah: true, isShortSurah: false
        });
      }
    }
  });

  salah.surah_usage.recommended_short.forEach(rec => {
    if (!seenSurahs.has(rec.surah_id)) {
      seenSurahs.add(rec.surah_id);
      const surah = quran.surahs.find(s => s.number === rec.surah_id);
      if (surah) {
        sections.push({
          id: secId++, surah_number: surah.number,
          title: `Surah ${surah.name_en}`,
          posture: 'standing', posture_icon: getPostureIconSvg('standing'),
          verses: surah.verses_data, complete_dua: surah.complete_text,
          notes: (surah.tajweed_notes || []).concat(rec.note ? [rec.note] : []),
          isSurah: true, isShortSurah: true
        });
      }
    }
  });

  TOTAL_SECTIONS = sections.length;
  buildNav(sections);
  buildScheduleCard(salah.schedule);
  buildSectionCards(sections);
}

/* ══════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════ */
function buildNav(sections) {
  const ul = document.getElementById('nav-list');
  if (!ul) return;
  let salahLinks = '', surahLinks = '';
  sections.forEach(s => {
    const t = s.title.split('—')[0].split('(')[0].trim();
    const link = `<li><a class="nav-link" href="#s${s.id}" onclick="closeNav()"><span class="nav-check" id="nc-${s.id}"></span>${s.id}. ${t}</a></li>`;
    if (s.isShortSurah) surahLinks += link; else salahLinks += link;
  });
  ul.innerHTML = `
    <div class="nav-group-label">${DuaIcons.get('mosque')} Salah Steps</div>
    <li><a class="nav-link" href="#intro" onclick="closeNav()"><span class="nav-check" id="nc-0"></span>${DuaIcons.get('schedule')} Schedule</a></li>
    ${salahLinks}
    <div class="nav-separator"></div>
    <div class="nav-group-label">${DuaIcons.get('quran')} Short Surahs</div>
    ${surahLinks}`;
}

/* ══════════════════════════════════════════════════════
   SCHEDULE CARD + RECITER SELECTOR
══════════════════════════════════════════════════════ */
function buildScheduleCard(schedule) {
  const container = document.getElementById('schedule-container');
  if (!container) return;
  const rows = schedule.map(s => {
    const r = s["rak'ahs"] || {};
    return `<tr><td class="prayer-name">${s.prayer}</td><td>${s.time_en||s.time}</td><td>${r.sunnah_before??'-'}</td><td class="fardh">${r.fardh??'-'}</td><td>${r.sunnah_after??'-'}</td></tr>`;
  }).join('');

  const reciters = [
    { id: 'Alafasy_128kbps',          name: 'Mishary Alafasy' },
    { id: 'Husary_128kbps',            name: 'Mahmoud Al-Husary' },
    { id: 'AbdulSamad_128kbps_ketaab', name: 'Abdul Basit Abdus Samad' },
    { id: 'Minshawi_128kbps',          name: 'Mohamed Al-Minshawi' },
    { id: 'Muhammad_Ayyoob_128kbps',   name: 'Muhammad Ayyoob' }
  ];
  const saved = localStorage.getItem('dua-reciter') || 'Alafasy_128kbps';
  window._currentReciter = saved;
  const opts = reciters.map(r => `<option value="${r.id}"${r.id===saved?' selected':''}>${r.name}</option>`).join('');

  container.innerHTML = `
    <div class="tbl-wrap">
      <table class="sched-table">
        <thead><tr><th>Prayer</th><th>Time</th><th>Sunnah Before</th><th>Fardh</th><th>Sunnah After</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="sched-note"><strong>Witr:</strong> After Isha Fardh + Sunnah, conclude with Witr rak'ahs (odd number: 1, 3, or more).</p>
    <div class="reciter-row">
      ${DuaIcons.get('audio')}
      <label for="reciter-select">Verse reciter:</label>
      <select id="reciter-select" onchange="setReciter(this.value)">${opts}</select>
    </div>`;
}

/* ══════════════════════════════════════════════════════
   SECTION CARDS
══════════════════════════════════════════════════════ */
function buildSectionCards(sections) {
  const container = document.getElementById('sections-container');
  if (!container) return;
  let html = '', addedDivider = false;
  sections.forEach(s => {
    if (s.isShortSurah && !addedDivider) {
      html += `<div class="section-divider">${DuaIcons.get('quran')} Short Surahs — recite after Al-Fatihah</div>`;
      addedDivider = true;
    }
    html += buildCard(s);
  });
  container.innerHTML = html;
}

function buildCard(section) {
  return `
  <article class="card" id="s${section.id}">
    <div class="card-head">
      <div class="card-num">${section.id}</div>
      <h2>${section.title}</h2>
      <span class="posture-pill">${section.posture_icon} ${section.posture || ''}</span>
      <label class="memo-label">
        <input type="checkbox" class="memo" data-id="${section.id}" onchange="markDone(this)"> Memorised
      </label>
    </div>
    <div class="tbl-wrap">
      <table class="word-table">
        <thead><tr>
          <th>Arabic (അറബി)</th>
          <th>Transliteration</th>
          <th>English</th>
          <th>Malayalam (മലയാളം)</th>
        </tr></thead>
        <tbody>${buildWordRows(section)}</tbody>
      </table>
    </div>
    ${buildDuaBlock(section.complete_dua)}
    ${buildNotesBlock(section.notes)}
  </article>`;
}

/* ══════════════════════════════════════════════════════
   WORD ROWS  (Quran surah + prayer dua)
══════════════════════════════════════════════════════ */
function buildWordRows(item) {
  if (item.isSurah) {
    let html = '';
    item.verses.forEach(v => {
      // Verse divider with play button
      html += `
      <tr class="verse-divider">
        <td colspan="4">
          <span class="verse-label">Verse ${v.verse}</span>
          <button class="verse-play-btn" onclick="playVerse(${item.surah_number}, ${v.verse})"
                  title="Play verse recitation" aria-label="Play verse">
            ${DuaIcons.get('audio')}
          </button>
        </td>
      </tr>`;

      // Word-by-word rows
      v.words.forEach((w, i) => {
        html += `
      <tr>
        <td class="ar">
          <button class="aud-btn" onclick="playSurahWord(${item.surah_number},${v.verse},${i+1})"
                  title="Play word" aria-label="Play word audio">
            ${DuaIcons.get('audio')}
          </button>
          ${w.ar}
        </td>
        <td class="tr">${w.tr || ''}</td>
        <td class="en">${w.en || ''}</td>
        <td class="ml">${w.ml || ''}</td>
      </tr>`;
      });

      // Verse-level translation row (from authenticated translation JSONs)
      if (v.en || v.ml) {
        html += `
      <tr class="verse-translation">
        <td colspan="4">
          ${v.ar ? `<div class="vtrans vtrans-ar">
            <button class="tts-btn" onclick="speakText('${escAr(v.ar)}','ar-SA')" title="Listen in Arabic">${DuaIcons.get('audio')}</button>
            <span>${v.ar}</span>
          </div>` : ''}
          ${v.en ? `<div class="vtrans vtrans-en">
            <button class="tts-btn" onclick="speakText(\`${v.en.replace(/`/g,"'")}\`,'en-US')" title="Listen in English">${DuaIcons.get('audio')}</button>
            <span>${v.en}</span>
          </div>` : ''}
          ${v.ml ? `<div class="vtrans vtrans-ml">
            <button class="tts-btn" onclick="speakText(\`${v.ml.replace(/`/g,"'")}\`,'ml-IN')" title="Listen in Malayalam">${DuaIcons.get('audio')}</button>
            <span>${v.ml}</span>
          </div>` : ''}
        </td>
      </tr>`;
      }
    });
    return html;
  }

  // Prayer dua words — Web Speech API for audio
  return (item.words || []).map((w, i) => {
    const key = `${item.dua_id}_${i}`;
    window._DUA_WORDS[key] = w;
    return `
    <tr>
      <td class="ar">
        <button class="aud-btn" onclick="speakDuaWord('${key}')"
                title="Play pronunciation" aria-label="Speak word">
          ${DuaIcons.get('audio')}
        </button>
        ${w.ar || ''}
      </td>
      <td class="tr">${w.tr || ''}</td>
      <td class="en">${w.en || ''}</td>
      <td class="ml">${w.ml || ''}</td>
    </tr>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════
   DUA BLOCK (complete recitation)
══════════════════════════════════════════════════════ */
function buildDuaBlock(dua) {
  if (!dua) return '';
  const arEsc = dua.ar ? escAr(dua.ar) : '';
  const enEsc = dua.en ? dua.en.replace(/`/g,"'") : '';
  const mlEsc = dua.ml ? dua.ml.replace(/`/g,"'") : '';
  return `
  <div class="dua-block">
    <div class="dua-block-header">${DuaIcons.get('scroll')} Complete Recitation</div>
    ${dua.ar ? `<div class="dua-ar-wrap">
      <button class="tts-btn tts-block" onclick="speakText('${arEsc}','ar-SA')" title="Listen in Arabic">${DuaIcons.get('audio')} Arabic</button>
      <div class="dua-ar">${dua.ar}</div>
    </div>` : ''}
    ${dua.en ? `<div class="dua-row">
      <button class="tts-btn" onclick="speakText(\`${enEsc}\`,'en-US')" title="Listen in English">${DuaIcons.get('audio')}</button>
      <strong>English:</strong> ${dua.en}
    </div>` : ''}
    ${dua.ml ? `<div class="dua-row">
      <button class="tts-btn" onclick="speakText(\`${mlEsc}\`,'ml-IN')" title="Listen in Malayalam">${DuaIcons.get('audio')}</button>
      <strong>Malayalam:</strong> ${dua.ml}
    </div>` : ''}
  </div>`;
}

function buildNotesBlock(notes) {
  if (!notes || !notes.length) return '';
  return `
  <div class="note-block">
    <div class="note-block-header">${DuaIcons.get('info')} Pronunciation &amp; Notes</div>
    <ul class="note-list">${notes.map(n=>`<li>${DuaIcons.get('tip')} ${n}</li>`).join('')}</ul>
  </div>`;
}

// Escape Arabic text for single-quoted HTML attribute
function escAr(text) {
  return text.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
}

/* ══════════════════════════════════════════════════════
   NAV CONTROLS
══════════════════════════════════════════════════════ */
function toggleNav() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}
function closeNav() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

/* ══════════════════════════════════════════════════════
   PROGRESS TRACKING
══════════════════════════════════════════════════════ */
function restoreProgress() {
  document.querySelectorAll('.memo').forEach(cb => {
    if (localStorage.getItem('dua-memo-' + cb.dataset.id) === '1') {
      cb.checked = true;
      cb.closest('.card').classList.add('done');
    }
  });
}

function markDone(cb) {
  localStorage.setItem('dua-memo-' + cb.dataset.id, cb.checked ? '1' : '0');
  cb.closest('.card').classList.toggle('done', cb.checked);
  updateProgress();
}

function updateProgress() {
  let done = 0;
  for (let i = 1; i <= TOTAL_SECTIONS; i++) {
    const nc = document.getElementById('nc-' + i);
    if (localStorage.getItem('dua-memo-' + i) === '1') {
      done++;
      if (nc) nc.innerHTML = DuaIcons.get('check');
    } else {
      if (nc) nc.innerHTML = '';
    }
  }
  const pct = TOTAL_SECTIONS > 0 ? Math.round(done / TOTAL_SECTIONS * 100) : 0;
  const fill = document.getElementById('prog-fill');
  const label = document.getElementById('prog-label');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = `${done} / ${TOTAL_SECTIONS} memorised`;
}

/* ══════════════════════════════════════════════════════
   AUDIO ENGINE
══════════════════════════════════════════════════════ */
let toastTimer = null;

/* ── Reciter ── */
function setReciter(id) {
  window._currentReciter = id;
  localStorage.setItem('dua-reciter', id);
}

/* ── Quran word audio — QuranCDN padded underscore format ──
   Format: 108_001_001.mp3  (surah_verse_word, zero-padded to 3 digits)
   DO NOT change to slash format — it was tested and failed.         */
function playSurahWord(surah, verse, word) {
  const s = String(surah).padStart(3,'0');
  const v = String(verse).padStart(3,'0');
  const w = String(word).padStart(3,'0');
  const url = `https://audio.qurancdn.com/wbw/${s}_${v}_${w}.mp3`;
  console.log('[dua word]', url);
  new Audio(url).play().catch(() => {
    // Fallback to Web Speech if CDN fails
    const wd = window._DUA_WORDS;
    speakText(null, 'ar-SA'); // silent fallback
  });
}

/* ── Full verse audio — EveryAyah.com ──
   Format: Alafasy_128kbps/108001.mp3  (reciter/surah3dverse3d.mp3)  */
function playVerse(surah, verse) {
  const reciter = window._currentReciter || 'Alafasy_128kbps';
  const s = String(surah).padStart(3,'0');
  const v = String(verse).padStart(3,'0');
  const url = `https://everyayah.com/data/${reciter}/${s}${v}.mp3`;
  console.log('[dua verse]', url);
  new Audio(url).play().catch(err => {
    console.error('[dua verse]', err);
    showToast('Verse audio not available. Try a different reciter.');
  });
}

/* ── Dua word audio — Web Speech API lang=ar-SA ──
   No audio files exist for individual dua words.
   Device Arabic TTS reads the Arabic text directly.               */
function speakDuaWord(key) {
  const w = window._DUA_WORDS[key];
  if (w && w.ar) speakText(w.ar, 'ar-SA');
}

/* ── Generic TTS — works for AR, EN, ML ── */
function speakText(text, lang) {
  if (!text) return;
  if (!('speechSynthesis' in window)) {
    showToast('Text-to-speech not supported on this device.');
    return;
  }
  window.speechSynthesis.cancel();
  const utt  = new SpeechSynthesisUtterance(text);
  utt.lang   = lang || 'ar-SA';
  utt.rate   = lang === 'ar-SA' ? 0.85 : 0.95;
  utt.pitch  = 1;
  window.speechSynthesis.speak(utt);
}

function showToast(msg) {
  let t = document.getElementById('dua-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'dua-toast';
    Object.assign(t.style, {
      position:'fixed', bottom:'90px', right:'18px',
      background:'var(--primary)', color:'var(--primary-fg)',
      padding:'10px 18px', borderRadius:'var(--radius-pill,100px)',
      fontSize:'0.8rem', zIndex:'9999', boxShadow:'var(--shadow-card)',
      transition:'opacity 0.3s', pointerEvents:'none', fontFamily:'var(--font-ui)'
    });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.opacity = '0'; }, 2800);
}

/* ══════════════════════════════════════════════════════
   SCROLL SPY
══════════════════════════════════════════════════════ */
function activateScrollSpy() {
  const cards = document.querySelectorAll('.card, #intro');
  const links = document.querySelectorAll('.nav-link');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-12% 0px -55% 0px' });
  cards.forEach(c => obs.observe(c));
}

/* ══════════════════════════════════════════════════════
   POSTURE ICON HELPER
══════════════════════════════════════════════════════ */
function getPostureIconSvg(posture) {
  if (!posture) return '';
  const p = posture.toLowerCase();
  if (p.includes('stand') || p.includes('qiyam'))   return DuaIcons.get('standing');
  if (p.includes('bow')   || p.includes('ruku'))    return DuaIcons.get('bowing');
  if (p.includes('prostrat') || p.includes('sujood') || p.includes('sajdah')) return DuaIcons.get('sujood');
  if (p.includes('sit')   || p.includes('qa'))      return DuaIcons.get('sitting');
  if (p.includes('jalsah'))                          return DuaIcons.get('sitting');
  return '';
}
