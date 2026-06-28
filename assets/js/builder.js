/**
 * Project Dua — builder.js  v3.0
 * Fetches dictionary.json, salah.json, and quran.json to build the Salah Guide.
 */

'use strict';

const DICT_PATH  = '../assets/data/dictionary.json';
const SALAH_PATH = '../assets/data/salah.json';
const QURAN_PATH = '../assets/data/quran.json';
let TOTAL_SECTIONS = 0;

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  applyStoredPreferences();

  Promise.all([
    fetch(DICT_PATH).then(r => { if (!r.ok) throw new Error(`dictionary: ${r.status}`); return r.json(); }),
    fetch(SALAH_PATH).then(r => { if (!r.ok) throw new Error(`salah: ${r.status}`); return r.json(); }),
    fetch(QURAN_PATH).then(r => { if (!r.ok) throw new Error(`quran: ${r.status}`); return r.json(); })
  ])
  .then(([dictData, salahData, quranData]) => {
    const ui = dictData.ui;
    buildPage(salahData, quranData, ui);
    restoreProgress();
    updateProgress();
    activateScrollSpy();
  })
  .catch(err => {
    const main = document.getElementById('main-content');
    if(main) main.innerHTML =
      `<div class="error-box">
        ⚠️ Could not load data files.<br>
        <code>${err.message}</code><br>
      </div>`;
    console.error('[Dua builder]', err);
  });
});

function getPostureIcon(posture) {
  if (!posture) return '🧍';
  const p = posture.toLowerCase();
  if (p.includes('stand') || p.includes('qiyam')) return '🧍';
  if (p.includes('bow') || p.includes('ruku')) return '🙇';
  if (p.includes('prostrat') || p.includes('sajdah')) return '🛐';
  if (p.includes('sit') || p.includes('qadah') || p.includes('jalsah')) return '🧎';
  return '🧍';
}

/* ══════════════════════════════════════════════════════════════
   PAGE BUILD
══════════════════════════════════════════════════════════════ */
function buildPage(salah, quran, ui) {
  const sections = [];
  let secId = 1;
  const seenDuas = new Set();
  const seenSurahs = new Set();

  let sequenceList = [...salah["rak'ah_structure"].standard_sequence];
  
  // Insert Wajjahtu (Alternative Opening Dua) right after Sana
  let sanaIdx = sequenceList.findIndex(s => s.dua_id === 'sana');
  if (sanaIdx !== -1) {
    sequenceList.splice(sanaIdx + 1, 0, { step: '2b', name: 'Opening Dua (Wajjahtu)', dua_id: 'sana_wajjahtu', posture: 'standing', notes: 'Alternative to Sana' });
  }

  // Parse Standard Sequence
  sequenceList.forEach(step => {
    if (step.dua_id && !seenDuas.has(step.dua_id)) {
      seenDuas.add(step.dua_id);
      let dua = salah.duas[step.dua_id];
      if (dua) {
        sections.push({
          id: secId++,
          dua_id: step.dua_id,
          title: step.name || dua.name_en,
          posture: step.posture || dua.posture,
          posture_icon: getPostureIcon(step.posture || dua.posture),
          words: dua.words,
          complete_dua: dua.complete,
          notes: (dua.notes || []).concat(step.notes ? [step.notes] : []),
          isSurah: false,
          isShortSurah: false
        });
      }
    } else if (step.surah_id && step.surah_id !== 'any' && !seenSurahs.has(step.surah_id)) {
      seenSurahs.add(step.surah_id);
      let surah = quran.surahs.find(s => s.number === step.surah_id);
      if (surah) {
        sections.push({
          id: secId++,
          surah_number: surah.number,
          title: `Surah ${surah.name_en}`,
          posture: step.posture || 'standing',
          posture_icon: getPostureIcon('standing'),
          verses: surah.verses_data,
          complete_dua: surah.complete_text,
          notes: (surah.tajweed_notes || []).concat(step.notes ? [step.notes] : []),
          isSurah: true,
          isShortSurah: false
        });
      }
    }
  });

  // Append Recommended Short Surahs
  salah.surah_usage.recommended_short.forEach(rec => {
    if (!seenSurahs.has(rec.surah_id)) {
      seenSurahs.add(rec.surah_id);
      let surah = quran.surahs.find(s => s.number === rec.surah_id);
      if (surah) {
        sections.push({
          id: secId++,
          surah_number: surah.number,
          title: `Surah ${surah.name_en}`,
          posture: 'standing',
          posture_icon: getPostureIcon('standing'),
          verses: surah.verses_data,
          complete_dua: surah.complete_text,
          notes: (surah.tajweed_notes || []).concat(rec.note ? [rec.note] : []),
          isSurah: true,
          isShortSurah: true
        });
      }
    }
  });

  TOTAL_SECTIONS = sections.length;

  buildNav(sections);
  buildScheduleCard(salah.schedule);
  buildSectionCards(sections);
}

/* ── SIDEBAR NAV ── */
function buildNav(sections) {
  const ul = document.getElementById('nav-list');
  if (!ul) return;

  const scheduleLink = `
    <li>
      <a class="nav-link" href="#intro" onclick="closeNav()">
        <span class="nav-check" id="nc-0"></span>📋 Schedule
      </a>
    </li>`;

  let salahLinks = '';
  let surahLinks = '';

  sections.forEach(s => {
    const shortTitle = s.title.split('—')[0].split('(')[0].trim();
    const link = `
      <li>
        <a class="nav-link" href="#s${s.id}" onclick="closeNav()">
          <span class="nav-check" id="nc-${s.id}"></span>${s.id}. ${shortTitle}
        </a>
      </li>`;
    if (s.isShortSurah) surahLinks += link;
    else salahLinks += link;
  });

  ul.innerHTML = `
    <div class="nav-group-label">🕌 Salah Steps</div>
    ${scheduleLink}${salahLinks}
    <div class="nav-group-label">📖 Short Surahs</div>
    ${surahLinks}
  `;
}

/* ── SCHEDULE CARD ── */
function buildScheduleCard(schedule) {
  const container = document.getElementById('schedule-container');
  if (!container) return;

  const rows = schedule.map(s => {
    const rak = s["rak'ahs"] || {};
    return `
    <tr>
      <td class="prayer-name">${s.prayer}</td>
      <td>${s.time_en || s.time}</td>
      <td>${rak.sunnah_before ?? '-'}</td>
      <td class="fardh">${rak.fardh ?? '-'}</td>
      <td>${rak.sunnah_after ?? '-'}</td>
    </tr>`;
  }).join('');

  container.innerHTML = `
    <div class="tbl-wrap">
      <table class="sched-table">
        <thead>
          <tr>
            <th>Prayer</th><th>Time</th>
            <th>Sunnah Before</th><th>Fardh</th><th>Sunnah After</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="sched-note">
      <strong>Witr:</strong> After Isha Fardh + Sunnah, conclude with Witr rak'ahs (odd number).
    </p>`;
}

/* ── SECTION CARDS ── */
function buildSectionCards(sections) {
  const container = document.getElementById('sections-container');
  if (!container) return;

  let html = '';
  let shortSurahHeaderAdded = false;

  sections.forEach(s => {
    if (s.isShortSurah && !shortSurahHeaderAdded) {
      html += `<div class="section-divider">📖 Short Surahs — recite after Al-Fatihah</div>`;
      shortSurahHeaderAdded = true;
    }
    html += buildCard(s);
  });

  container.innerHTML = html;
}

function buildCard(section) {
  const rows      = buildWordRows(section);
  const duaBlock  = buildDuaBlock(section.complete_dua);
  const noteBlock = buildNotesBlock(section.notes);

  return `
  <article class="card" id="s${section.id}">
    <div class="card-head">
      <div class="card-num">${section.id}</div>
      <h2>${section.title}</h2>
      <span class="posture-pill">${section.posture_icon} ${section.posture}</span>
      <label class="memo-label">
        <input type="checkbox" class="memo" data-id="${section.id}" onchange="markDone(this)">
        Memorised
      </label>
    </div>
    <div class="tbl-wrap">
      <table class="word-table">
        <thead>
          <tr>
            <th>Arabic (അറബി)</th>
            <th>Transliteration</th>
            <th>English</th>
            <th>Malayalam (മലയാളം)</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${duaBlock}
    ${noteBlock}
  </article>`;
}

function buildWordRows(item) {
  if (item.isSurah) {
    let html = '';
    item.verses.forEach(v => {
      html += `<tr class="verse-divider"><td colspan="4" style="background:var(--alt-row);font-size:0.75rem;color:var(--green);font-weight:bold;text-align:center;letter-spacing:1px;border-bottom:1px solid var(--border)">Verse ${v.verse}</td></tr>`;
      v.words.forEach((w, index) => {
        html += `
        <tr>
          <td class="ar">
            ${w.ar}
            <button class="aud-btn" onclick="playSurahWord(${item.surah_number}, ${v.verse}, ${w.w})" title="Play pronunciation">🔊</button>
          </td>
          <td class="tr">${w.tr}</td>
          <td class="en">${w.en}</td>
          <td class="ml">${w.ml}</td>
        </tr>`;
      });
    });
    return html;
  } else {
    return item.words.map((w, index) => `
    <tr>
      <td class="ar">
        ${w.ar}
        <button class="aud-btn" onclick="playDuaWord('${item.dua_id}', ${index})" title="Play pronunciation">🔊</button>
      </td>
      <td class="tr">${w.tr || ''}</td>
      <td class="en">${w.en || ''}</td>
      <td class="ml">${w.ml || ''}</td>
    </tr>`).join('');
  }
}

function buildDuaBlock(dua) {
  if (!dua) return '';
  return `
  <div class="dua-block">
    <h3>📜 Complete Recitation</h3>
    <div class="dua-ar">${dua.ar}</div>
    <div class="dua-row"><strong>English:</strong> ${dua.en}</div>
    <div class="dua-row"><strong>Malayalam:</strong> ${dua.ml}</div>
  </div>`;
}

function buildNotesBlock(notes) {
  if (!notes || notes.length === 0) return '';
  const items = notes.map(n => `<li>${n}</li>`).join('');
  return `
  <div class="note-block">
    <h4>Pronunciation &amp; Notes</h4>
    <ul class="note-list">${items}</ul>
  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   DARK MODE
══════════════════════════════════════════════════════════════ */
function applyStoredPreferences() {
  if (localStorage.getItem('dua-dark') === '1') {
    document.body.classList.add('dark');
    const btn = document.getElementById('dark-toggle');
    if (btn) btn.textContent = '☀️';
  }
}

function toggleDark() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('dua-dark', isDark ? '1' : '0');
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR NAV
══════════════════════════════════════════════════════════════ */
function toggleNav() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}
function closeNav() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

/* ══════════════════════════════════════════════════════════════
   PROGRESS TRACKING
══════════════════════════════════════════════════════════════ */
function restoreProgress() {
  document.querySelectorAll('.memo').forEach(cb => {
    const id = cb.getAttribute('data-id');
    if (localStorage.getItem('dua-memo-' + id) === '1') {
      cb.checked = true;
      cb.closest('.card').classList.add('done');
    }
  });
}

function markDone(cb) {
  const id = cb.getAttribute('data-id');
  localStorage.setItem('dua-memo-' + id, cb.checked ? '1' : '0');
  cb.closest('.card').classList.toggle('done', cb.checked);
  updateProgress();
}

function updateProgress() {
  let done = 0;
  for (let i = 1; i <= TOTAL_SECTIONS; i++) {
    const saved = localStorage.getItem('dua-memo-' + i);
    const nc    = document.getElementById('nc-' + i);
    if (saved === '1') {
      done++;
      if (nc) nc.textContent = '✅ ';
    } else {
      if (nc) nc.textContent = '';
    }
  }
  const pct   = TOTAL_SECTIONS > 0 ? Math.round((done / TOTAL_SECTIONS) * 100) : 0;
  const fill  = document.getElementById('prog-fill');
  const label = document.getElementById('prog-label');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = `${done} / ${TOTAL_SECTIONS} memorised`;
}

/* ══════════════════════════════════════════════════════════════
   AUDIO ENGINE
══════════════════════════════════════════════════════════════ */
let toastTimer = null;

function playSurahWord(surah, verse, word) {
  const s = String(surah).padStart(3, '0');
  const v = String(verse).padStart(3, '0');
  const w = String(wordNum).padStart(3, '0');
  const audio = new Audio(`https://audio.qurancdn.com/wbw/${surah}/${verse}/${word}.mp3`);
  audio.play().catch(() => showToast('🔊 Audio not available. Check internet connection.'));
}

function playDuaWord(duaId, wordIndex) {
  const audio = new Audio(`../assets/audio/words/${duaId}_${wordIndex}.mp3`);
  audio.play().catch(() => showToast('🔊 Audio coming soon for prayer duas.'));
}

function showToast(msg) {
  let t = document.getElementById('dua-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'dua-toast';
    t.style.cssText = [
      'position:fixed', 'bottom:90px', 'right:18px',
      'background:#1f4e3d', 'color:#fff',
      'padding:10px 18px', 'border-radius:20px',
      'font-size:.82rem', 'z-index:9999',
      'box-shadow:0 4px 12px rgba(0,0,0,.35)',
      'transition:opacity .3s', 'pointer-events:none'
    ].join(';');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.opacity = '0'; }, 2500);
}

/* ══════════════════════════════════════════════════════════════
   SCROLL SPY
══════════════════════════════════════════════════════════════ */
function activateScrollSpy() {
  const cards = document.querySelectorAll('[id^="s"], #intro');
  const links = document.querySelectorAll('.nav-link');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-15% 0px -75% 0px' });

  cards.forEach(c => obs.observe(c));
}
