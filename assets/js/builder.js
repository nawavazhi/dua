/**
 * Project Dua — assets/js/builder.js  v4.0
 * Fetches salah.json and quran.json to build the Salah Guide.
 *
 * Requires: assets/icons/icons.js  (must load first)
 * Requires: assets/theme/theme.js  (must load before this)
 *
 * v4.0 changes:
 *   - Removed seenDuas dedup — sequence is now authoritative (fixes missing
 *     Second Sujood and Final Tashahhud cards)
 *   - Fixed Quran word audio URL: slashes + no zero-padding
 *   - Dropped unused dictionary.json fetch
 *   - Fixed scrollspy selector to only observe .card and #intro
 *   - Widened scrollspy rootMargin for small screens
 */

'use strict';

const SALAH_PATH = '../assets/data/salah.json';
const QURAN_PATH = '../assets/data/quran.json';
let TOTAL_SECTIONS = 0;

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    fetch(SALAH_PATH).then(r => { if (!r.ok) throw new Error(`salah.json: ${r.status}`); return r.json(); }),
    fetch(QURAN_PATH).then(r => { if (!r.ok) throw new Error(`quran.json: ${r.status}`); return r.json(); })
  ])
  .then(([salahData, quranData]) => {
    buildPage(salahData, quranData);
    restoreProgress();
    updateProgress();
    activateScrollSpy();
  })
  .catch(err => {
    const main = document.getElementById('main-content');
    if (main) main.innerHTML = `
      <div class="error-box">
        ${DuaIcons.get('info')}
        Could not load data files — <code>${err.message}</code>
        <br>Check your connection and try again.
      </div>`;
    console.error('[Dua builder]', err);
  });
});

/* ── PAGE BUILD ── */
function buildPage(salah, quran) {
  const sections   = [];
  let   secId      = 1;
  /*
   * seenSurahs still prevents the same Surah appearing more than once
   * (the same Surah should never be in the sequence twice).
   * seenDuas has been REMOVED — the standard_sequence is authoritative.
   * sujood legitimately appears twice (First & Second Sujood) and
   * tashahhud appears twice (Middle & Final Tashahhud).
   */
  const seenSurahs = new Set();

  let sequenceList = [...salah["rak'ah_structure"].standard_sequence];

  // Inject Wajjahtu right after Sana (alternative opening dua)
  const sanaIdx = sequenceList.findIndex(s => s.dua_id === 'sana');
  if (sanaIdx !== -1) {
    sequenceList.splice(sanaIdx + 1, 0, {
      step:    '2b',
      name:    'Opening Dua — Wajjahtu',
      dua_id:  'sana_wajjahtu',
      posture: 'standing',
      notes:   'Alternative to Sana — recite one or the other, not both'
    });
  }

  // ── Standard sequence ──
  sequenceList.forEach(step => {
    if (step.dua_id) {
      // All dua steps are added — no deduplication. Repeats (sujood ×2,
      // tashahhud ×2) are intentional and must appear as separate cards.
      const dua = salah.duas[step.dua_id];
      if (dua) {
        sections.push({
          id:           secId++,
          dua_id:       step.dua_id,
          title:        step.name || dua.name_en,
          posture:      step.posture || dua.posture,
          posture_icon: getPostureIconSvg(step.posture || dua.posture),
          words:        dua.words,
          complete_dua: dua.complete,
          notes:        (dua.notes || []).concat(step.notes ? [step.notes] : []),
          isSurah:      false,
          isShortSurah: false
        });
      }
    } else if (step.surah_id && step.surah_id !== 'any' && !seenSurahs.has(step.surah_id)) {
      seenSurahs.add(step.surah_id);
      const surah = quran.surahs.find(s => s.number === step.surah_id);
      if (surah) {
        sections.push({
          id:           secId++,
          surah_number: surah.number,
          title:        `Surah ${surah.name_en}`,
          posture:      step.posture || 'standing',
          posture_icon: getPostureIconSvg('standing'),
          verses:       surah.verses_data,
          complete_dua: surah.complete_text,
          notes:        (surah.tajweed_notes || []).concat(step.notes ? [step.notes] : []),
          isSurah:      true,
          isShortSurah: false
        });
      }
    }
  });

  // ── Recommended short Surahs (appended after main sequence) ──
  salah.surah_usage.recommended_short.forEach(rec => {
    if (!seenSurahs.has(rec.surah_id)) {
      seenSurahs.add(rec.surah_id);
      const surah = quran.surahs.find(s => s.number === rec.surah_id);
      if (surah) {
        sections.push({
          id:           secId++,
          surah_number: surah.number,
          title:        `Surah ${surah.name_en}`,
          posture:      'standing',
          posture_icon: getPostureIconSvg('standing'),
          verses:       surah.verses_data,
          complete_dua: surah.complete_text,
          notes:        (surah.tajweed_notes || []).concat(rec.note ? [rec.note] : []),
          isSurah:      true,
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
        <span class="nav-check" id="nc-0"></span>
        ${DuaIcons.get('schedule')} Schedule
      </a>
    </li>`;

  let salahLinks = '';
  let surahLinks = '';

  sections.forEach(s => {
    const shortTitle = s.title.split('—')[0].split('(')[0].trim();
    const link = `
      <li>
        <a class="nav-link" href="#s${s.id}" onclick="closeNav()">
          <span class="nav-check" id="nc-${s.id}"></span>
          ${s.id}. ${shortTitle}
        </a>
      </li>`;
    if (s.isShortSurah) surahLinks += link;
    else                salahLinks += link;
  });

  ul.innerHTML = `
    <div class="nav-group-label">${DuaIcons.get('mosque')} Salah Steps</div>
    ${scheduleLink}${salahLinks}
    <div class="nav-separator"></div>
    <div class="nav-group-label">${DuaIcons.get('quran')} Short Surahs</div>
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
      <strong>Witr:</strong> After Isha Fardh + Sunnah, conclude with Witr rak\'ahs (odd number: 1, 3, or more).
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
      html += `
        <div class="section-divider">
          ${DuaIcons.get('quran')} Short Surahs — recite after Al-Fatihah
        </div>`;
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
      <span class="posture-pill">
        ${section.posture_icon} ${section.posture || ''}
      </span>
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
      html += `<tr class="verse-divider"><td colspan="4" style="background:var(--alt-row);font-size:0.75rem;color:var(--primary);font-weight:bold;text-align:center;letter-spacing:1px;border-bottom:1px solid var(--border)">Verse ${v.verse}</td></tr>`;
      v.words.forEach((w, index) => {
        html += `
        <tr>
          <td class="ar">
            <button class="aud-btn" onclick="playSurahWord(${item.surah_number}, ${v.verse}, ${index + 1})"
                    title="Play pronunciation" aria-label="Play word audio">
              ${DuaIcons.get('audio')}
            </button>
            ${w.ar}
          </td>
          <td class="tr">${w.tr || ''}</td>
          <td class="en">${w.en || ''}</td>
          <td class="ml">${w.ml || ''}</td>
        </tr>`;
      });
    });
    return html;
  } else {
    return (item.words || []).map((w, index) => `
    <tr>
      <td class="ar">
        <button class="aud-btn" onclick="playDuaWord('${item.dua_id}', ${index})"
                title="Play pronunciation" aria-label="Play word audio">
          ${DuaIcons.get('audio')}
        </button>
        ${w.ar || ''}
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
    <div class="dua-block-header">
      ${DuaIcons.get('scroll')} Complete Recitation
    </div>
    <div class="dua-ar">${dua.ar}</div>
    <div class="dua-row"><strong>English:</strong> ${dua.en}</div>
    <div class="dua-row"><strong>Malayalam:</strong> ${dua.ml}</div>
  </div>`;
}

function buildNotesBlock(notes) {
  if (!notes || notes.length === 0) return '';
  const items = notes.map(n => `
    <li>${DuaIcons.get('tip')} ${n}</li>`).join('');
  return `
  <div class="note-block">
    <div class="note-block-header">
      ${DuaIcons.get('info')} Pronunciation &amp; Notes
    </div>
    <ul class="note-list">${items}</ul>
  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR NAV CONTROLS
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
      if (nc) nc.innerHTML = DuaIcons.get('check');
    } else {
      if (nc) nc.innerHTML = '';
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
   QuranCDN word audio: /wbw/SSS_VVV_WWW.mp3
   — zero-padded to 3 digits, underscore-separated.
   This format was confirmed working in the repository.
══════════════════════════════════════════════════════════════ */
let toastTimer = null;

function playSurahWord(surah, verse, wordNum) {
  const s = String(surah).padStart(3, '0');
  const v = String(verse).padStart(3, '0');
  const w = String(wordNum).padStart(3, '0');
  const audioUrl = `https://audio.qurancdn.com/wbw/${s}_${v}_${w}.mp3`;
  console.log('[Dua audio] Playing:', audioUrl);

  const audio = new Audio(audioUrl);
  audio.play().catch(err => {
    console.error('[Dua audio] Playback failed:', err);
    showToast('Audio not available — check console for details.');
  });
}

function playDuaWord(duaId, wordIndex) {
  // Local dua audio files — served from assets/audio/words/
  const audioUrl = `../assets/audio/words/${duaId}_${wordIndex}.mp3`;
  const audio = new Audio(audioUrl);
  audio.play().catch(() => showToast('Audio coming soon for prayer duas.'));
}

function showToast(msg) {
  let t = document.getElementById('dua-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'dua-toast';
    Object.assign(t.style, {
      position:     'fixed',
      bottom:       '90px',
      right:        '18px',
      background:   'var(--primary)',
      color:        'var(--primary-fg)',
      padding:      '10px 18px',
      borderRadius: 'var(--radius-pill, 100px)',
      fontSize:     '0.8rem',
      zIndex:       '9999',
      boxShadow:    'var(--shadow-card)',
      transition:   'opacity 0.3s',
      pointerEvents:'none',
      fontFamily:   'var(--font-ui)',
    });
    document.body.appendChild(t);
  }
  t.textContent  = msg;
  t.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.opacity = '0'; }, 2500);
}

/* ══════════════════════════════════════════════════════════════
   SCROLL SPY
   Observes only .card articles and #intro — not generic
   container divs that start with "s" (sidebar, sections-container).
   Wider rootMargin (-55% bottom) prevents dead zones on mobile.
══════════════════════════════════════════════════════════════ */
function activateScrollSpy() {
  const cards = document.querySelectorAll('.card, #intro');
  const links = document.querySelectorAll('.nav-link');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-12% 0px -55% 0px' });

  cards.forEach(c => obs.observe(c));
}
