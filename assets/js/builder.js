/**
 * Project Dua — builder.js  v2.0
 * Fetches dictionary.json + salah.json and builds the Salah Guide.
 *
 * Data files:
 *   ../assets/data/dictionary.json  — shared word bank (all modules)
 *   ../assets/data/salah.json       — salah sections, sequences, duas
 *
 * Features: sidebar nav, dark mode, progress tracking,
 *           complete dua blocks, notes, audio placeholders, scroll spy.
 */

'use strict';

const DICT_PATH  = '../assets/data/dictionary.json';
const SALAH_PATH = '../assets/data/salah.json';
const TOTAL_SECTIONS = 16;

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  applyStoredPreferences();

  Promise.all([
    fetch(DICT_PATH).then(r => {
      if (!r.ok) throw new Error(`dictionary.json: HTTP ${r.status}`);
      return r.json();
    }),
    fetch(SALAH_PATH).then(r => {
      if (!r.ok) throw new Error(`salah.json: HTTP ${r.status}`);
      return r.json();
    })
  ])
  .then(([dictData, salahData]) => {
    const dict = dictData.words;   // { key: { ar, tr, en, ml } }
    buildPage(salahData, dict);
    restoreProgress();
    updateProgress();
    activateScrollSpy();
  })
  .catch(err => {
    document.getElementById('main-content').innerHTML =
      `<div class="error-box">
        ⚠️ Could not load data files.<br>
        <code>${err.message}</code><br><br>
        Check that <strong>dictionary.json</strong> and <strong>salah.json</strong>
        exist in <code>assets/data/</code> and are valid JSON.
        Paste either file at <a href="https://jsonlint.com" target="_blank">jsonlint.com</a> to check.
      </div>`;
    console.error('[Dua builder]', err);
  });
});

/* ══════════════════════════════════════════════════════════════
   PAGE BUILD
══════════════════════════════════════════════════════════════ */
function buildPage(salah, dict) {
  buildNav(salah.sections);
  buildScheduleCard(salah.schedule);
  buildSectionCards(salah.sections, dict);
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
    if (s.id >= 12) surahLinks += link;
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

  const rows = schedule.map(s => `
    <tr>
      <td class="prayer-name">${s.prayer}</td>
      <td>${s.time}</td>
      <td>${s.sunnah_before}</td>
      <td class="fardh">${s.fardh}</td>
      <td>${s.sunnah_after}</td>
    </tr>`).join('');

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
      <strong>Witr:</strong> After Isha Fardh + Sunnah, conclude with 3 Witr rak'ahs (odd number).
    </p>`;
}

/* ── SECTION CARDS ── */
function buildSectionCards(sections, dict) {
  const container = document.getElementById('sections-container');
  if (!container) return;

  let html = '';
  sections.forEach(s => {
    if (s.id === 12) {
      html += `<div class="section-divider">📖 Short Surahs — recite after Al-Fatihah</div>`;
    }
    html += buildCard(s, dict);
  });

  container.innerHTML = html;
}

function buildCard(section, dict) {
  const rows      = buildWordRows(section.sequence, dict);
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

function buildWordRows(sequence, dict) {
  return sequence.map(key => {
    const w = dict[key];
    if (!w) {
      console.warn(`[Dua] Missing dictionary key: "${key}"`);
      return `<tr class="missing-key"><td colspan="4">⚠️ Missing word: <code>${key}</code></td></tr>`;
    }
    return `
    <tr>
      <td class="ar">
        ${w.ar}
        <button class="aud-btn" onclick="playWord('${key}')" title="Play pronunciation">🔊</button>
      </td>
      <td class="tr">${w.tr}</td>
      <td class="en">${w.en}</td>
      <td class="ml">${w.ml}</td>
    </tr>`;
  }).join('');
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
  const pct   = Math.round((done / TOTAL_SECTIONS) * 100);
  const fill  = document.getElementById('prog-fill');
  const label = document.getElementById('prog-label');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = `${done}/${TOTAL_SECTIONS} memorised`;
}

/* ══════════════════════════════════════════════════════════════
   AUDIO
   Add MP3 files to assets/audio/words/{key}.mp3 to activate.
   Word audio for Quran words: https://audio.qurancdn.com/wbw/{surah}/{verse}/{word}.mp3
══════════════════════════════════════════════════════════════ */
let toastTimer = null;

function playWord(key) {
  const audio = new Audio(`../assets/audio/words/${key}.mp3`);
  audio.play().catch(() => {
    showToast('🔊 Audio coming soon — add MP3 files to assets/audio/words/');
  });
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
