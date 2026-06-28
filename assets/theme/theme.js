/**
 * Project Dua — assets/js/theme.js  v1.1
 * Noor UI Theme System
 *
 * Requires: assets/js/icons.js (must be loaded first)
 */

'use strict';

/* ── 1. THEME DEFINITIONS ── */
const DUA_THEMES = {
  light: { label: 'Light',  desc: 'Clean daylight',    swatch: 'swatch-light' },
  dark:  { label: 'Dark',   desc: 'Deep night',        swatch: 'swatch-dark'  },
  dua:   { label: 'Dua',    desc: 'Heritage green',    swatch: 'swatch-dua'   },
  noor:  { label: 'Noor',   desc: 'Islamic minimal',   swatch: 'swatch-noor'  },
};

const STORAGE_KEY = 'dua-theme';
const DEFAULT_THEME = 'light';

/* ── 2. THEME ENGINE ── */
const DuaTheme = (() => {
  let _current = DEFAULT_THEME;

  function apply(name) {
    if (!DUA_THEMES[name]) name = DEFAULT_THEME;
    _current = name;
    document.documentElement.setAttribute('data-theme', name);
    localStorage.setItem(STORAGE_KEY, name);
    _updateThemeBtn();
    _updatePanel();
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    apply(saved && DUA_THEMES[saved] ? saved : DEFAULT_THEME);
  }

  function current() { return _current; }

  function _updateThemeBtn() {
    const btn = document.getElementById('theme-btn');
    if (!btn) return;
    const def  = DUA_THEMES[_current];
    const icon = _current === 'dark' ? 'moon' : (_current === 'noor' ? 'crescent' : 'sun');
    // Relies on DuaIcons from icons.js
    btn.innerHTML = DuaIcons.get(icon) + `<span>${def.label}</span>`;
  }

  function _updatePanel() {
    document.querySelectorAll('.theme-option').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === _current);
    });
  }

  return { apply, init, current };
})();

/* ── 3. TOPBAR INJECTION ── */
function _buildTopbar() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  const existingTitle = topbar.querySelector('.topbar-title');
  let titleText    = 'Project Dua';
  let subtitleText = '';

  if (existingTitle) {
    // Read the subtitle from the <span> first
    const titleSpan = existingTitle.querySelector('span');
    subtitleText = titleSpan ? titleSpan.textContent.trim() : '';

    // Clone and strip the span so .textContent only contains the main title,
    // not the subtitle too (bug: textContent includes ALL descendant text).
    const clone = existingTitle.cloneNode(true);
    const cloneSpan = clone.querySelector('span');
    if (cloneSpan) cloneSpan.remove();
    titleText = clone.textContent.trim() || 'Project Dua';
  }

  topbar.innerHTML = `
    <button class="icon-btn" id="nav-toggle" onclick="toggleNav()" aria-label="Open menu">
      ${DuaIcons.get('menu')}
    </button>
    <div class="topbar-logo">
      ${DuaIcons.get('mosque', 'dua-icon')}
      <div class="topbar-title">
        ${titleText}
        ${subtitleText ? `<span>${subtitleText}</span>` : ''}
      </div>
    </div>
    <div class="topbar-actions">
      <button class="theme-btn" id="theme-btn" onclick="_openThemePanel()" aria-label="Switch theme">
        ${DuaIcons.get('sun')}<span>Light</span>
      </button>
    </div>
  `;

  // Inject print icon into #print-btn if present on this page.
  // The print button intentionally has no hardcoded SVG in the HTML —
  // this is the single place that wires it.
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    const existingIcon = printBtn.querySelector('svg');
    if (!existingIcon) {
      printBtn.insertAdjacentHTML('afterbegin', DuaIcons.get('print'));
    }
  }
}

/* ── 4. THEME PANEL ── */
function _buildThemePanel() {
  const existing = document.getElementById('dua-theme-panel');
  if (existing) return;

  const options = Object.entries(DUA_THEMES).map(([key, def]) => `
    <button class="theme-option ${key === DuaTheme.current() ? 'active' : ''}"
            data-theme="${key}"
            onclick="DuaTheme.apply('${key}'); _closeThemePanel();">
      <div class="theme-option-swatch ${def.swatch}"></div>
      <div class="theme-option-name">${def.label}</div>
      <div class="theme-option-desc">${def.desc}</div>
    </button>
  `).join('');

  const panel = document.createElement('div');
  panel.id        = 'dua-theme-panel';
  panel.className = 'theme-panel';
  panel.innerHTML = `
    <div class="theme-panel-title">Choose theme</div>
    <div class="theme-options">${options}</div>
  `;
  document.body.appendChild(panel);

  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target.id !== 'theme-btn') {
      _closeThemePanel();
    }
  });
}

function _openThemePanel() {
  const panel = document.getElementById('dua-theme-panel');
  if (!panel) { _buildThemePanel(); }
  document.getElementById('dua-theme-panel')?.classList.toggle('open');
}

function _closeThemePanel() {
  document.getElementById('dua-theme-panel')?.classList.remove('open');
}

/* ── 5. POSTURE ICON HELPER ── */
function getPostureIconSvg(posture) {
  if (!posture) return DuaIcons.get('standing');
  const p = posture.toLowerCase();
  if (p.includes('stand') || p.includes('qiyam')) return DuaIcons.get('standing');
  if (p.includes('bow')   || p.includes('ruku'))  return DuaIcons.get('bowing');
  if (p.includes('prostrat') || p.includes('sajdah')) return DuaIcons.get('sujood');
  if (p.includes('sit')   || p.includes('qa') || p.includes('jalsah')) return DuaIcons.get('sitting');
  return DuaIcons.get('standing');
}

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  // _buildTopbar() MUST run before DuaTheme.init() so that #theme-btn
  // exists when _updateThemeBtn() is called inside init().
  // Previous order (init → buildTopbar) caused the theme button to always
  // render as "Light" regardless of the user's saved preference.
  _buildTopbar();
  DuaTheme.init();
  _buildThemePanel();
});
