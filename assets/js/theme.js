/**
 * Project Dua — assets/js/theme.js  v1.0
 * Noor UI Theme System
 *
 * Responsibilities:
 *   1. Theme switching (light / dark / dua / noor) — persisted to localStorage
 *   2. SVG icon registry — all UI icons defined here; builder.js uses DuaIcons.*
 *   3. Injects the theme switcher panel into the topbar
 *   4. Provides icon helper used by builder.js to replace all emoji
 *
 * Load this BEFORE builder.js in every module's <head>.
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   1. THEME DEFINITIONS
═══════════════════════════════════════════════════════════════ */
const DUA_THEMES = {
  light: { label: 'Light',  desc: 'Clean daylight',    swatch: 'swatch-light' },
  dark:  { label: 'Dark',   desc: 'Deep night',        swatch: 'swatch-dark'  },
  dua:   { label: 'Dua',    desc: 'Heritage green',    swatch: 'swatch-dua'   },
  noor:  { label: 'Noor',   desc: 'Islamic minimal',   swatch: 'swatch-noor'  },
};

const STORAGE_KEY = 'dua-theme';
const DEFAULT_THEME = 'light';

/* ═══════════════════════════════════════════════════════════════
   2. ICON REGISTRY
   All icons are 24×24, 2.5px stroke, rounded caps/joins.
   Usage: DuaIcons.mosque  returns an SVG string.
   Future: swap SVG strings with <img src="../assets/logo/{name}.svg">
           or <use href="../assets/logo/sprite.svg#{name}"> once files exist.
═══════════════════════════════════════════════════════════════ */
const DuaIcons = (() => {
  const SVG_ATTR = `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"`;

  const icons = {
    /* Navigation & UI */
    menu:     `<svg ${SVG_ATTR}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    close:    `<svg ${SVG_ATTR}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    sun:      `<svg ${SVG_ATTR}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon:     `<svg ${SVG_ATTR}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    palette:  `<svg ${SVG_ATTR}><circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="13.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="15.5" cy="13.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none"/><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/></svg>`,
    check:    `<svg ${SVG_ATTR}><polyline points="20 6 9 17 4 12"/></svg>`,
    print:    `<svg ${SVG_ATTR}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
    audio:    `<svg ${SVG_ATTR}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,

    /* Islamic / Project-specific */
    mosque:   `<svg ${SVG_ATTR}><path d="M12 2c-1.1 0-2 .45-2 1v1H8.5C7.67 4 7 4.67 7 5.5V7H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-2V5.5C17 4.67 16.33 4 15.5 4H14V3c0-.55-.9-1-2-1z"/><path d="M9 12a3 3 0 0 1 6 0v7H9v-7z"/><line x1="12" y1="2" x2="12" y2="4"/></svg>`,
    quran:    `<svg ${SVG_ATTR}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    crescent: `<svg ${SVG_ATTR}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`,
    star:     `<svg ${SVG_ATTR}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    lantern:  `<svg ${SVG_ATTR}><path d="M9 2h6l1 4H8L9 2z"/><rect x="7" y="6" width="10" height="12" rx="2"/><path d="M9 18l-1 4h8l-1-4"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>`,
    prayer:   `<svg ${SVG_ATTR}><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 4"/><path d="M12 12l3 4"/><path d="M9 11H7"/><path d="M17 11h-2"/></svg>`,
    beads:    `<svg ${SVG_ATTR}><circle cx="12" cy="4" r="2"/><circle cx="19" cy="9" r="2"/><circle cx="19" cy="15" r="2"/><circle cx="12" cy="20" r="2"/><circle cx="5" cy="15" r="2"/><circle cx="5" cy="9" r="2"/><path d="M12 6a8 8 0 0 1 5.66 2.34"/><path d="M19 11v4"/><path d="M17.66 17.66A8 8 0 0 1 12 20"/><path d="M10 20H8"/><path d="M6.34 17.66A8 8 0 0 1 5 15"/><path d="M5 11V9"/><path d="M6.34 6.34A8 8 0 0 1 10 4"/></svg>`,
    calendar: `<svg ${SVG_ATTR}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    schedule: `<svg ${SVG_ATTR}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    scroll:   `<svg ${SVG_ATTR}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    info:     `<svg ${SVG_ATTR}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    tip:      `<svg ${SVG_ATTR}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,

    /* Posture icons — standing, bowing, prostrating, sitting */
    standing: `<svg ${SVG_ATTR}><circle cx="12" cy="4" r="2"/><line x1="12" y1="6" x2="12" y2="14"/><polyline points="9 10 12 14 15 10"/><line x1="12" y1="14" x2="10" y2="20"/><line x1="12" y1="14" x2="14" y2="20"/></svg>`,
    bowing:   `<svg ${SVG_ATTR}><circle cx="6" cy="4" r="2"/><path d="M6 6v4"/><path d="M2 14h10"/><line x1="6" y1="10" x2="10" y2="14"/><line x1="10" y1="14" x2="12" y2="20"/><line x1="10" y1="14" x2="14" y2="20"/></svg>`,
    sujood:   `<svg ${SVG_ATTR}><circle cx="5" cy="6" r="2"/><path d="M3 20h18"/><path d="M5 8v4l7 4"/><path d="M12 12h7"/></svg>`,
    sitting:  `<svg ${SVG_ATTR}><circle cx="12" cy="4" r="2"/><path d="M12 6v5"/><path d="M9 18h6"/><path d="M12 11l-3 7"/><path d="M12 11l3 4h4"/></svg>`,

    /* Decorative separator icon */
    separator:`<svg ${SVG_ATTR}><path d="M12 2a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" fill="none"/></svg>`,
  };

  /**
   * Get icon SVG string.
   * @param {string} name — icon key from the registry above
   * @param {string} [cls] — optional CSS class
   */
  function get(name, cls = '') {
    const icon = icons[name];
    if (!icon) {
      console.warn(`[DuaIcons] Unknown icon: "${name}"`);
      return '';
    }
    if (!cls) return icon;
    // Inject class into the SVG tag
    return icon.replace('<svg ', `<svg class="${cls}" `);
  }

  /**
   * Future-ready: once SVG files exist in assets/logo/,
   * swap this function to return:
   *   `<img src="${basePath}${name}.svg" class="${cls}" aria-hidden="true" />`
   * or:
   *   `<svg class="${cls}" aria-hidden="true"><use href="${basePath}sprite.svg#${name}"/></svg>`
   */

  return { get, all: icons };
})();

/* ═══════════════════════════════════════════════════════════════
   3. THEME ENGINE
═══════════════════════════════════════════════════════════════ */
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

  function toggle() {
    // Cycle: light → dark → dua → noor → light
    const order = Object.keys(DUA_THEMES);
    const idx   = order.indexOf(_current);
    apply(order[(idx + 1) % order.length]);
  }

  function _updateThemeBtn() {
    const btn = document.getElementById('theme-btn');
    if (!btn) return;
    const def  = DUA_THEMES[_current];
    const icon = _current === 'dark' ? 'moon' : (_current === 'noor' ? 'crescent' : 'sun');
    btn.innerHTML = DuaIcons.get(icon) + `<span>${def.label}</span>`;
  }

  function _updatePanel() {
    document.querySelectorAll('.theme-option').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === _current);
    });
  }

  return { apply, init, current, toggle };
})();

/* ═══════════════════════════════════════════════════════════════
   4. TOPBAR INJECTION
   Replaces emoji-based topbar with clean SVG icon version.
   Requires a .topbar element already in the HTML.
═══════════════════════════════════════════════════════════════ */
function _buildTopbar() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  // Read existing title from the page
  const existingTitle = topbar.querySelector('.topbar-title');
  const titleText  = existingTitle ? existingTitle.textContent.trim().replace(/^[\p{Emoji}\s]+/u, '').trim() : 'Project Dua';
  const titleSpan  = existingTitle ? existingTitle.querySelector('span') : null;
  const subtitleText = titleSpan ? titleSpan.textContent.trim() : '';

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
}

/* ═══════════════════════════════════════════════════════════════
   5. THEME PANEL (dropdown)
═══════════════════════════════════════════════════════════════ */
function _buildThemePanel() {
  const existing = document.getElementById('dua-theme-panel');
  if (existing) return;

  const options = Object.entries(DUA_THEMES).map(([key, def]) => `
    <button class="theme-option ${key === DuaTheme.current() ? 'active' : ''}"
            data-theme="${key}"
            onclick="DuaTheme.apply('${key}'); _closeThemePanel();"
            aria-label="Switch to ${def.label} theme">
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

  // Close on outside click
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target.id !== 'theme-btn') {
      _closeThemePanel();
    }
  });
}

function _openThemePanel() {
  const panel = document.getElementById('dua-theme-panel');
  if (!panel) { _buildThemePanel(); }
  const p = document.getElementById('dua-theme-panel');
  if (p) p.classList.toggle('open');
}

function _closeThemePanel() {
  const panel = document.getElementById('dua-theme-panel');
  if (panel) panel.classList.remove('open');
}

/* ═══════════════════════════════════════════════════════════════
   6. POSTURE ICON HELPER
   Used by builder.js instead of emoji mapping.
═══════════════════════════════════════════════════════════════ */
function getPostureIconSvg(posture) {
  if (!posture) return DuaIcons.get('standing');
  const p = posture.toLowerCase();
  if (p.includes('stand') || p.includes('qiyam'))            return DuaIcons.get('standing');
  if (p.includes('bow')   || p.includes('ruku'))             return DuaIcons.get('bowing');
  if (p.includes('prostrat') || p.includes('sajdah'))        return DuaIcons.get('sujood');
  if (p.includes('sit')   || p.includes('qa') || p.includes('jalsah')) return DuaIcons.get('sitting');
  return DuaIcons.get('standing');
}

/* ═══════════════════════════════════════════════════════════════
   7. BOOT
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  DuaTheme.init();
  _buildTopbar();
  _buildThemePanel();
});
