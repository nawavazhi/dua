/**
 * dua — miqat/builder.js
 * Prayer times, reminders, tracking, and Qalah.
 * Fetches times from Aladhan API. Stores all data locally.
 * No backend. No account. No tracking.
 *
 * Load order: icons.js → theme.js → builder.js
 */

'use strict';

const PRAYER_KEYS = ['fajr','dhuhr','asr','maghrib','isha'];
const PRAYER_EN   = { fajr:'Fajr', dhuhr:'Dhuhr', asr:'Asr', maghrib:'Maghrib', isha:'Isha' };
const PRAYER_AR   = { fajr:'الفجر', dhuhr:'الظهر', asr:'العصر', maghrib:'المغرب', isha:'العشاء' };
const PRAYER_ML   = { fajr:'ഫജ്‌ർ', dhuhr:'ദുഹ്‌ർ', asr:'അസ്‌ർ', maghrib:'മഗ്‌രിബ്', isha:'ഇഷാ' };

// Aladhan API prayer key mapping
const API_KEYS = { fajr:'Fajr', dhuhr:'Dhuhr', asr:'Asr', maghrib:'Maghrib', isha:'Isha' };

let _data     = null; // reminder.json
let _settings = {};   // { lat, lon, city, method }
let _times    = {};   // { fajr:'05:12', ... } for today
let _log      = {};   // { 'YYYY-MM-DD': { fajr:'prayed', ... } }
let _countdown = null;
let _notifTimers = [];

/* ══════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  fetch('./reminder.json')
    .then(r => r.json())
    .then(data => {
      _data = data;
      _settings = loadSettings();
      _log      = loadLog();
      if (_settings.lat) {
        showApp();
        fetchTimes();
      } else {
        showSetup();
      }
    })
    .catch(err => {
      document.getElementById('loading').innerHTML =
        `${DuaIcons.get('info')} Could not load — <code>${err.message}</code>`;
    });
});

/* ══════════════════════════════════════════════════════
   SCREENS
══════════════════════════════════════════════════════ */
function showSetup() {
  document.getElementById('loading').hidden = true;
  document.getElementById('setup-screen').hidden = false;
  document.getElementById('app-screen').hidden  = true;
  renderMethodSelect();
}

function showApp() {
  document.getElementById('loading').hidden = true;
  document.getElementById('setup-screen').hidden = true;
  document.getElementById('app-screen').hidden  = false;
  const locEl = document.getElementById('location-name');
  if (locEl) locEl.textContent = _settings.city || 'Locating...';
  // Show skeleton hero while prayer times are being fetched
  const hero = document.getElementById('next-prayer-card');
  if (hero) {
    hero.className = 'next-card upcoming';
    hero.innerHTML = '<div class="hero-skeleton"><div class="loading-ring"></div><p>Fetching prayer times...</p></div>';
  }
  renderChart();
  renderQalah();
}

/* ══════════════════════════════════════════════════════
   LOCATION SETUP
══════════════════════════════════════════════════════ */
function renderMethodSelect() {
  const sel = document.getElementById('method-select');
  if (!sel || !_data) return;
  sel.innerHTML = Object.entries(_data.prayer_time_api.methods).map(([id, m]) =>
    `<option value="${id}"${id==='1'?' selected':''}>${m.name} — ${m.region}</option>`
  ).join('');
}

function useGPS() {
  const btn = document.getElementById('gps-btn');
  btn.textContent = 'Detecting location...';
  btn.disabled = true;

  if (!navigator.geolocation) {
    showSetupError('GPS not available on this device. Use city search instead.');
    btn.textContent = 'Use my location';
    btn.disabled = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const method = document.getElementById('method-select').value || '1';
      _settings = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        city: 'Your location',
        method: parseInt(method)
      };
      saveSettings();
      showApp();
      fetchTimes();
    },
    err => {
      showSetupError('Location access denied. Type your city below instead.');
      btn.textContent = 'Use my location';
      btn.disabled = false;
    }
  );
}

function searchCity() {
  const city    = document.getElementById('city-input').value.trim();
  const country = document.getElementById('country-input').value.trim() || '';
  const method  = document.getElementById('method-select').value || '1';

  if (!city) { showSetupError('Please enter a city name.'); return; }

  const searchBtn = document.getElementById('city-search-btn');
  searchBtn.textContent = 'Searching...';
  searchBtn.disabled = true;

  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;

  fetch(url)
    .then(r => r.json())
    .then(json => {
      if (json.code !== 200) throw new Error(json.status || 'City not found');
      const meta = json.data.meta;
      _settings = {
        lat: parseFloat(meta.latitude),
        lon: parseFloat(meta.longitude),
        city: city + (country ? `, ${country}` : ''),
        method: parseInt(method)
      };
      saveSettings();
      _times = parseTimes(json.data.timings);
      showApp();
      renderTimes();
      startCountdown();
      scheduleNotifications();
      checkMissedPrayers();
    })
    .catch(err => {
      showSetupError(`Could not find "${city}". Check spelling and try again.`);
    })
    .finally(() => {
      searchBtn.textContent = 'Set location';
      searchBtn.disabled = false;
    });
}

function showSetupError(msg) {
  const el = document.getElementById('setup-error');
  if (el) { el.textContent = msg; el.hidden = false; }
}

function changeLocation() {
  _settings = {};
  saveSettings();
  clearTimers();
  showSetup();
}

function fillMissingDays() {
  const now = new Date();
  const today = todayStr();
  
  // Find the most recent date in the log that isn't today
  const loggedDates = Object.keys(_log).filter(d => d !== today).sort();
  if (loggedDates.length === 0) return; 
  
  const lastDateStr = loggedDates[loggedDates.length - 1];
  let checkDate = new Date(lastDateStr);
  checkDate.setDate(checkDate.getDate() + 1); // Start the day after last log
  
  // Loop through every day between the last logged date and today
  while (dateStr(checkDate) < today) {
    const missingDateKey = dateStr(checkDate);
    if (!_log[missingDateKey]) _log[missingDateKey] = {};
    
    // Mark all 5 prayers as missed for this fully absent day
    PRAYER_KEYS.forEach(k => {
      if (!_log[missingDateKey][k]) _log[missingDateKey][k] = 'missed';
    });
    
    checkDate.setDate(checkDate.getDate() + 1);
  }
  saveLog();
}

/* ══════════════════════════════════════════════════════
   PRAYER TIMES — FETCH + PARSE
══════════════════════════════════════════════════════ */
function fetchTimes() {
  const ts  = Math.floor(Date.now() / 1000);
  const url = `https://api.aladhan.com/v1/timings/${ts}?latitude=${_settings.lat}&longitude=${_settings.lon}&method=${_settings.method}`;
  const statusEl = document.getElementById('times-status');
  
  if (statusEl) { statusEl.innerHTML = '<span class="times-loading"></span>'; }

  fetch(url)
    .then(r => r.json())
    .then(json => {
      if (json.code !== 200) throw new Error(json.status);
      _times = parseTimes(json.data.timings);
      renderTimes();
      startCountdown();
      scheduleNotifications();
      checkMissedPrayers();
    })
    .catch((err) => {
      console.error(err);
      if (statusEl) statusEl.textContent = 'No internet — showing last known times.';
       
      if (Object.keys(_times).length) {
        renderTimes();
      } else {
        const hero = document.getElementById('next-prayer-card');
        if (hero) {
          hero.className = 'next-card';
          hero.innerHTML = `
            <div class="hero-label">Connection Error</div>
            <div class="hero-time">Offline</div>
            <p style="font-size: 0.8rem; margin-top: 8px; opacity: 0.8">Could not fetch prayer times.</p>`;
        }
      }
    })
    .finally(() => {
      if (statusEl && statusEl.innerHTML.includes('times-loading')) {
        statusEl.innerHTML = '';
      }
    });
}

function parseTimes(apiTimings) {
  const result = {};
  PRAYER_KEYS.forEach(key => {
    let raw = apiTimings[API_KEYS[key]];
    result[key] = raw ? raw.split(' ')[0] : null; 
  });
  return result;
}

/* Convert "HH:MM" to today's Date object */
function timeToDate(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

/* Format "HH:MM" to 12h display */
function fmt12(timeStr) {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${suffix}`;
}

/* ══════════════════════════════════════════════════════
   RENDER PRAYER TIMES
══════════════════════════════════════════════════════ */
function renderTimes() {
  const todayKey = todayStr();
  const todayLog = _log[todayKey] || {};
  const now = new Date();

  // Determine current/next prayer
  let currentPrayer = null;
  let nextPrayer    = null;

  for (let i = 0; i < PRAYER_KEYS.length; i++) {
    const key  = PRAYER_KEYS[i];
    const t    = timeToDate(_times[key]);
    const next = i < PRAYER_KEYS.length - 1 ? timeToDate(_times[PRAYER_KEYS[i+1]]) : null;
    if (t && now >= t && (!next || now < next)) {
      currentPrayer = key;
    }
    if (t && now < t && !nextPrayer) {
      nextPrayer = key;
    }
  }

  // If after Isha, next is tomorrow's Fajr (show countdown differently)
  if (!nextPrayer && !currentPrayer) nextPrayer = 'fajr';

  // Hero card
  const heroEl = document.getElementById('next-prayer-card');
  if (heroEl) {
    const highlight = currentPrayer || nextPrayer;
    const hlTime    = highlight ? _times[highlight] : null;
    const hlStatus  = highlight ? (todayLog[highlight] || null) : null;
    const isPrayed  = hlStatus === 'prayed' || hlStatus === 'qalah';

    heroEl.dataset.prayer = highlight || '';
    heroEl.className = `next-card ${isPrayed ? 'prayed' : (currentPrayer ? 'active' : 'upcoming')}`;

    heroEl.innerHTML = `
      <div class="hero-label">${currentPrayer ? 'Prayer time now' : 'Next prayer'}</div>
      <div class="hero-ar">${PRAYER_AR[highlight] || ''}</div>
      <div class="hero-en">${PRAYER_EN[highlight] || ''}</div>
      <div class="hero-ml">${PRAYER_ML[highlight] || ''}</div>
      <div class="hero-time">${fmt12(hlTime)}</div>
      <div id="countdown-display" class="hero-countdown"></div>
      ${!isPrayed && highlight ? `
        <button class="prayed-btn" onclick="confirmPrayed('${highlight}', false)">
          ${DuaIcons.get('check')} I prayed ${PRAYER_EN[highlight]}
        </button>
        ${currentPrayer ? `<button class="qalah-btn" onclick="confirmPrayed('${highlight}', true)">Qalah (making up)</button>` : ''}
      ` : (isPrayed ? `<div class="prayed-tag">${DuaIcons.get('check')} Prayed</div>` : '')}
    `;
  }

  // Prayer list
  const listEl = document.getElementById('prayer-list');
  if (listEl) {
    listEl.innerHTML = PRAYER_KEYS.map(key => {
      const t      = _times[key];
      const status = todayLog[key] || null;
      const isCurr = key === currentPrayer;
      const isNext = key === nextPrayer && !currentPrayer;

      let statusIcon = '';
      let rowClass   = 'prayer-row';
      if (status === 'prayed')  { statusIcon = `<span class="badge badge-prayed">${DuaIcons.get('check')} Prayed</span>`; rowClass += ' row-prayed'; }
      else if (status === 'qalah')  { statusIcon = `<span class="badge badge-qalah">Qalah</span>`; rowClass += ' row-qalah'; }
      else if (status === 'missed') { statusIcon = `<span class="badge badge-missed">Missed</span>`; rowClass += ' row-missed'; }
      else if (isCurr) { statusIcon = `<span class="badge badge-now">Now</span>`; rowClass += ' row-current'; }
      else if (isNext) { statusIcon = `<span class="badge badge-next">Next</span>`; rowClass += ' row-next'; }

      return `
      <div class="${rowClass}" id="row-${key}">
        <div class="row-prayer">
          <span class="row-ar">${PRAYER_AR[key]}</span>
          <span class="row-en">${PRAYER_EN[key]}</span>
          <span class="row-ml">${PRAYER_ML[key]}</span>
        </div>
        <div class="row-time">${fmt12(t)}</div>
        <div class="row-status">${statusIcon}</div>
        ${!status && (isCurr || isNext) ? `
          <button class="row-btn" onclick="confirmPrayed('${key}', false)">
            ${DuaIcons.get('check')}
          </button>` : ''}
      </div>`;
    }).join('');
  }

  renderChart();
  updateStreakDisplay();
}

/* ══════════════════════════════════════════════════════
   COUNTDOWN TIMER
══════════════════════════════════════════════════════ */
function startCountdown() {
  clearInterval(_countdown);
  _countdown = setInterval(tickCountdown, 1000);
  tickCountdown();
}

function tickCountdown() {
  const el = document.getElementById('countdown-display');
  if (!el) return;

  const now = new Date();
  const heroCard = document.getElementById('next-prayer-card');
  const prayer = heroCard ? heroCard.dataset.prayer : null;
  if (!prayer || !_times[prayer]) { el.textContent = ''; return; }

  let target = timeToDate(_times[prayer]);

  // FIX: If we are looking for Fajr, but the generated time is in the past, 
  // and it's currently evening/night, it must be tomorrow's Fajr.
  if (prayer === 'fajr' && target < now && now.getHours() > 12) {
    target.setDate(target.getDate() + 1);
  }

  // If prayer time has passed (and it's not tomorrow's Fajr), it's the current window
  if (target < now) {
    // Show time since it started
    const diff = Math.floor((now - target) / 1000);
    const m = Math.floor(diff / 60);
    el.textContent = `Started ${m} min ago`;
    el.className = 'hero-countdown countdown-active';
    return;
  }

  const diff = Math.floor((target - now) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;

  if (h > 0) {
    el.textContent = `${h}h ${m}m`;
  } else if (m > 0) {
    el.textContent = `${m}m ${String(s).padStart(2,'0')}s`;
  } else {
    el.textContent = `${s}s`;
  }
  el.className = m < 15 ? 'hero-countdown countdown-urgent' : 'hero-countdown';
}

/* ══════════════════════════════════════════════════════
   PRAYER CONFIRMATION
══════════════════════════════════════════════════════ */
function confirmPrayed(prayer, isQalah) {
  const todayKey = todayStr();
  if (!_log[todayKey]) _log[todayKey] = {};
  _log[todayKey][prayer] = isQalah ? 'qalah' : 'prayed';
  saveLog();
  renderTimes();
  showReward(prayer, isQalah);
}

function showReward(prayer, isQalah) {
  const panel = document.getElementById('reward-panel');
  if (!panel || !_data) return;

  const msgs  = _data.prayers[prayer]?.reward_messages || [];
  const msg   = msgs[Math.floor(Math.random() * msgs.length)];
  if (!msg) return;

  // Check if all 5 done today
  const todayLog = _log[todayStr()] || {};
  const allDone  = PRAYER_KEYS.every(k => todayLog[k] === 'prayed' || todayLog[k] === 'qalah');

  panel.hidden = false;
  panel.innerHTML = `
    <div class="reward-content">
      <div class="reward-icon">${DuaIcons.get('star')}</div>
      <div class="reward-prayer">${PRAYER_AR[prayer]} — ${PRAYER_EN[prayer]}</div>
      ${isQalah ? '<div class="reward-qalah-note">Qalah recorded — JazakAllah for making it up</div>' : ''}
      <div class="reward-text-en">${msg.en}</div>
      <div class="reward-text-ml">${msg.ml}</div>
      ${msg.source !== 'reflection' ? `<div class="reward-source">${msg.source}</div>` : ''}
      ${allDone ? `
        <div class="all-done-msg">
          ${DuaIcons.get('beads')}
          All five prayers complete today. May Allah accept them.
        </div>` : ''}
      <button class="reward-close" onclick="document.getElementById('reward-panel').hidden=true">
        Close
      </button>
    </div>`;

  // Auto-hide after 12 seconds
  setTimeout(() => { if (panel) panel.hidden = true; }, 12000);
}

/* ══════════════════════════════════════════════════════
   MISSED PRAYER DETECTION
══════════════════════════════════════════════════════ */

/* Check if yesterday's Isha was never confirmed — mark missed.
   Without this, Isha from previous days stays null permanently. */
function checkYesterdayIsha() {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yKey = dateStr(y);
  if (!_log[yKey]) _log[yKey] = {};
  if (_log[yKey]['isha'] === undefined || _log[yKey]['isha'] === null) {
    _log[yKey]['isha'] = 'missed';
    saveLog();
  }
}

function checkMissedPrayers() {
  checkYesterdayIsha();
  const todayKey = todayStr();
  if (!_log[todayKey]) _log[todayKey] = {};
  const todayLog = _log[todayKey];
  const now = new Date();

  PRAYER_KEYS.forEach((key, i) => {
    if (todayLog[key]) return; // already confirmed or missed
    const t = timeToDate(_times[key]);
    if (!t) return;

    // Prayer window ends when next prayer starts
    const nextKey  = PRAYER_KEYS[i + 1];
    const nextTime = nextKey ? timeToDate(_times[nextKey]) : null;

    if (nextTime && now > nextTime) {
      // Window has passed without confirmation
      todayLog[key] = 'missed';
    }
  });

  saveLog();
  renderChart();
  renderQalah();
}

/* ══════════════════════════════════════════════════════
   PRAYER CHART — 7 or 30 day heatmap
══════════════════════════════════════════════════════ */
function renderChart(days = 7) {
  const el = document.getElementById('prayer-chart');
  if (!el) return;

  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d);
  }

  const dayLabels = dates.map(d =>
    d.toLocaleDateString('en-US', { weekday: 'short' })
  ).join('');

  // Header row
  let html = `
    <div class="chart-wrap">
      <div class="chart-grid" style="--chart-cols:${days}">
        <div class="chart-col-header"></div>
        ${dates.map(d => {
          const isToday = d.toDateString() === new Date().toDateString();
          return `<div class="chart-day-label ${isToday?'today':''}">${
            d.toLocaleDateString('en-US',{weekday:'short'}).charAt(0)
          }<span>${d.getDate()}</span></div>`;
        }).join('')}`;

  // Prayer rows
  PRAYER_KEYS.forEach(key => {
    html += `<div class="chart-prayer-label">
      <span class="chart-label-ar">${PRAYER_AR[key]}</span>
      <span class="chart-label-en">${PRAYER_EN[key]}</span>
    </div>`;

    dates.forEach(d => {
      const dateKey = dateStr(d);
      const status  = (_log[dateKey] || {})[key] || null;
      const isToday = d.toDateString() === new Date().toDateString();
      const isFuture = d > new Date();

      let cls = 'chart-cell';
      let tip = '';
      if (isFuture)            { cls += ' cell-future'; }
      else if (!status && isToday) { cls += ' cell-pending'; tip = 'Not yet'; }
      else if (status === 'prayed') { cls += ' cell-prayed'; tip = 'Prayed'; }
      else if (status === 'qalah')  { cls += ' cell-qalah';  tip = 'Qalah'; }
      else if (status === 'missed') { cls += ' cell-missed';  tip = 'Missed'; }
      else                          { cls += ' cell-empty';   tip = ''; }

      html += `<div class="${cls}" title="${PRAYER_EN[key]} ${tip}"></div>`;
    });
  });

  html += '</div>'; // chart-grid

  // Legend
  html += `
    <div class="chart-legend">
      <span class="legend-item"><span class="cell-prayed legend-dot"></span> Prayed</span>
      <span class="legend-item"><span class="cell-qalah legend-dot"></span> Qalah</span>
      <span class="legend-item"><span class="cell-missed legend-dot"></span> Missed</span>
      <span class="legend-item"><span class="cell-pending legend-dot"></span> Pending</span>
    </div>
  </div>`;

  el.innerHTML = html;
}

/* ══════════════════════════════════════════════════════
   QALAH TRACKER
══════════════════════════════════════════════════════ */
function renderQalah() {
  const el = document.getElementById('qalah-tracker');
  if (!el) return;

  // Count missed + not-yet-made-up prayers
  const owed = {};
  PRAYER_KEYS.forEach(k => owed[k] = 0);

  Object.entries(_log).forEach(([date, dayLog]) => {
    PRAYER_KEYS.forEach(key => {
      if (dayLog[key] === 'missed') owed[key]++;
    });
  });

  const totalOwed = Object.values(owed).reduce((a,b) => a+b, 0);

  if (totalOwed === 0) {
    el.innerHTML = `
      <div class="qalah-clear">
        ${DuaIcons.get('check')} No Qalah prayers owed. Alhamdulillah.
      </div>`;
    return;
  }

  const msg = _data?.qalah_messages?.[
    Math.floor(Math.random() * (_data.qalah_messages?.length || 1))
  ] || {};

  const rows = PRAYER_KEYS.filter(k => owed[k] > 0).map(k => `
    <div class="qalah-row">
      <span class="qalah-name">${PRAYER_AR[k]} ${PRAYER_EN[k]}</span>
      <span class="qalah-count">${owed[k]}</span>
      <button class="qalah-mark-btn" onclick="markQalah('${k}')">
        ${DuaIcons.get('check')} Made up
      </button>
    </div>`).join('');

  el.innerHTML = `
    <div class="qalah-total">
      ${totalOwed} prayer${totalOwed > 1 ? 's' : ''} to make up
    </div>
    <div class="qalah-msg">${msg.en || ''}</div>
    <div class="qalah-list">${rows}</div>`;
}

function markQalah(prayer) {
  // Find the oldest missed entry for this prayer and mark as qalah
  const sortedDates = Object.keys(_log).sort();
  for (const date of sortedDates) {
    if (_log[date][prayer] === 'missed') {
      _log[date][prayer] = 'qalah';
      saveLog();
      renderChart();
      renderQalah();

      // Show reward
      showReward(prayer, true);
      return;
    }
  }
}

/* ══════════════════════════════════════════════════════
   STREAK
══════════════════════════════════════════════════════ */
function updateStreakDisplay() {
  const el = document.getElementById('streak-display');
  if (!el) return;

  let streak = 0;
  for (let i = 0; i <= 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dateStr(d);
    const log = _log[key] || {};
    const allPrayed = PRAYER_KEYS.every(k => log[k] === 'prayed' || log[k] === 'qalah');
    if (allPrayed) streak++;
    else if (i > 0) break; // gap found (don't break on today — may still be incomplete)
  }

  el.textContent = streak > 0 ? `${streak} day streak` : '';

  // Show streak message if milestone
  const msgs = _data?.streak_messages || {};
  const milestone = [30, 7, 3, 1].find(m => streak >= m);
  const milestoneEl = document.getElementById('streak-milestone');
  if (milestoneEl && milestone && msgs[String(milestone)]) {
    milestoneEl.textContent = msgs[String(milestone)].en;
    milestoneEl.hidden = false;
  }
}

/* ══════════════════════════════════════════════════════
   NOTIFICATIONS
══════════════════════════════════════════════════════ */
function requestNotifications() {
  if (!('Notification' in window)) {
    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
    showToast(isIOS
      ? 'On iPhone: use Share → Add to Home Screen to enable reminders.'
      : 'Notifications not supported on this browser.');
    return;
  }
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') {
      document.getElementById('notif-btn').hidden = true;
      document.getElementById('notif-granted').hidden = false;
      scheduleNotifications();
    }
  });
}

function scheduleNotifications() {
  clearTimers();
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

  const now = new Date();
  PRAYER_KEYS.forEach(key => {
    const t = timeToDate(_times[key]);
    if (!t || t < now) return;

    const advance = (_data?.notifications?.advance_minutes || 5) * 60 * 1000;
    const notifTime = t.getTime() - advance;
    const delay = notifTime - now.getTime();
    if (delay < 0) return;

    const prayer = _data?.prayers[key];
    const calls  = prayer?.call_messages || [];
    const call   = calls[Math.floor(Math.random() * calls.length)] || {};

    const tid = setTimeout(() => {
      new Notification(`${PRAYER_EN[key]} — ${fmt12(_times[key])}`, {
        body: call.en || `${PRAYER_EN[key]} prayer time`,
        icon: '/dua/assets/icons/icon-192.png',
        tag:  `miqat-${key}`,
        requireInteraction: true
      });
    }, delay);

    _notifTimers.push(tid);
  });
}

function clearTimers() {
  _notifTimers.forEach(clearTimeout);
  _notifTimers = [];
}

/* ══════════════════════════════════════════════════════
   SETTINGS PANEL
══════════════════════════════════════════════════════ */
function openSettings() {
  const sel = document.getElementById('settings-method');
  if (sel && _data) {
    sel.innerHTML = Object.entries(_data.prayer_time_api.methods)
      .map(([id,m]) => `<option value="${id}"${_settings.method==id?' selected':''}>${m.name}</option>`)
      .join('');
  }
  document.getElementById('settings-overlay').hidden = false;
}
function closeSettings() {
  document.getElementById('settings-overlay').hidden = true;
}

/* ══════════════════════════════════════════════════════
   PERSISTENCE
══════════════════════════════════════════════════════ */
function saveSettings() {
  localStorage.setItem('miqat-settings', JSON.stringify(_settings));
}
function loadSettings() {
  try { return JSON.parse(localStorage.getItem('miqat-settings')) || {}; }
  catch { return {}; }
}
function saveLog() {
  localStorage.setItem('miqat-log', JSON.stringify(_log));
}
function loadLog() {
  try { return JSON.parse(localStorage.getItem('miqat-log')) || {}; }
  catch { return {}; }
}

/* ══════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════ */
function todayStr() { return dateStr(new Date()); }
function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

let _toastTimer;
function showToast(msg) {
  let t = document.getElementById('miqat-toast');
  if (!t) {
    t = Object.assign(document.createElement('div'), { id:'miqat-toast' });
    Object.assign(t.style, {
      position:'fixed', bottom:'20px', left:'50%', transform:'translateX(-50%)',
      background:'var(--primary)', color:'var(--primary-fg)', padding:'10px 20px',
      borderRadius:'100px', fontSize:'0.8rem', zIndex:'9999',
      fontFamily:'var(--font-ui)', transition:'opacity 0.3s', whiteSpace:'nowrap'
    });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.style.opacity = '0', 3000);
}

// Refresh times at midnight and every hour
setInterval(() => {
  if (_settings.lat) { _times = {}; fetchTimes(); }
}, 3600000);

/* ── NAV STUBS ─────────────────────────────────────────────
   theme.js injects a hamburger button calling toggleNav().
   miqat has no sidebar — stubs prevent ReferenceError.
─────────────────────────────────────────────────────────── */
function toggleNav() { /* miqat has no sidebar */ }
function closeNav()  { /* miqat has no sidebar */ }
