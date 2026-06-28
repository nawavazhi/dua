/**
 * Project Dua — assets/icons/icons.js
 * SVG Icon Registry — no emojis.
 *
 * All icons: 24×24 viewBox, 2.5px stroke, round caps & joins.
 * MUST be loaded before theme.js and builder.js.
 *
 * To add an icon: add a key under the appropriate section.
 * Use the same SVG_ATTR string for consistency.
 */

'use strict';

const DuaIcons = (() => {
  const SVG_ATTR = `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"
    stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`;

  const icons = {

    /* ── Navigation & UI ── */
    menu:       `<svg ${SVG_ATTR}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    close:      `<svg ${SVG_ATTR}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    check:      `<svg ${SVG_ATTR}><polyline points="20 6 9 17 4 12"/></svg>`,
    print:      `<svg ${SVG_ATTR}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
    info:       `<svg ${SVG_ATTR}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    tip:        `<svg ${SVG_ATTR}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    home:       `<svg ${SVG_ATTR}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    arrow_right:`<svg ${SVG_ATTR}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    external:   `<svg ${SVG_ATTR}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    lock:       `<svg ${SVG_ATTR}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    github:     `<svg ${SVG_ATTR}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
    audio:      `<svg ${SVG_ATTR}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,

    /* ── Theme switcher ── */
    sun:        `<svg ${SVG_ATTR}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon:       `<svg ${SVG_ATTR}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    crescent:   `<svg ${SVG_ATTR}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`,
    palette:    `<svg ${SVG_ATTR}><circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="13.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="15.5" cy="13.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none"/><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/></svg>`,

    /* ── Islamic / Project-specific ── */
    mosque:     `<svg ${SVG_ATTR}><path d="M12 2c-1.1 0-2 .45-2 1v1H8.5C7.67 4 7 4.67 7 5.5V7H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-2V5.5C17 4.67 16.33 4 15.5 4H14V3c0-.55-.9-1-2-1z"/><path d="M9 12a3 3 0 0 1 6 0v7H9v-7z"/><line x1="12" y1="2" x2="12" y2="4"/></svg>`,
    quran:      `<svg ${SVG_ATTR}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    star:       `<svg ${SVG_ATTR}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    lantern:    `<svg ${SVG_ATTR}><path d="M9 2h6l1 4H8L9 2z"/><rect x="7" y="6" width="10" height="12" rx="2"/><path d="M9 18l-1 4h8l-1-4"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>`,
    prayer:     `<svg ${SVG_ATTR}><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 4"/><path d="M12 12l3 4"/><path d="M9 11H7"/><path d="M17 11h-2"/></svg>`,
    beads:      `<svg ${SVG_ATTR}><circle cx="12" cy="4" r="2"/><circle cx="19" cy="9" r="2"/><circle cx="19" cy="15" r="2"/><circle cx="12" cy="20" r="2"/><circle cx="5" cy="15" r="2"/><circle cx="5" cy="9" r="2"/><path d="M12 6a8 8 0 0 1 5.66 2.34"/><path d="M19 11v4"/><path d="M17.66 17.66A8 8 0 0 1 12 20"/><path d="M10 20H8"/><path d="M6.34 17.66A8 8 0 0 1 5 15"/><path d="M5 11V9"/><path d="M6.34 6.34A8 8 0 0 1 10 4"/></svg>`,
    calendar:   `<svg ${SVG_ATTR}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    schedule:   `<svg ${SVG_ATTR}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    scroll:     `<svg ${SVG_ATTR}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    bell:       `<svg ${SVG_ATTR}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    drop:       `<svg ${SVG_ATTR}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    book_open:  `<svg ${SVG_ATTR}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><line x1="12" y1="7" x2="12" y2="21"/></svg>`,
    layers:     `<svg ${SVG_ATTR}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,

    /* ── Posture icons ── */
    standing:   `<svg ${SVG_ATTR}><circle cx="12" cy="5" r="2.5" fill="currentColor" stroke="none"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="12" y1="16" x2="10" y2="22"/><line x1="12" y1="16" x2="14" y2="22"/></svg>`,
    bowing:     `<svg ${SVG_ATTR}><circle cx="5" cy="5" r="2.5" fill="currentColor" stroke="none"/><line x1="5" y1="8" x2="5" y2="14"/><line x1="5" y1="14" x2="21" y2="14"/><line x1="5" y1="14" x2="3.5" y2="22"/><line x1="5" y1="14" x2="6.5" y2="22"/></svg>`,
    sujood:     `<svg ${SVG_ATTR}><circle cx="3" cy="18" r="2" fill="currentColor" stroke="none"/><line x1="5" y1="17" x2="13" y2="12"/><line x1="13" y1="12" x2="21" y2="12"/><line x1="21" y1="12" x2="22" y2="20"/><line x1="19" y1="12" x2="20" y2="20"/></svg>`,
    sitting:    `<svg ${SVG_ATTR}><circle cx="12" cy="5" r="2.5" fill="currentColor" stroke="none"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="12" y1="14" x2="6" y2="20"/><line x1="12" y1="14" x2="18" y2="20"/><line x1="6" y1="20" x2="9" y2="22"/><line x1="18" y1="20" x2="15" y2="22"/></svg>`,
    separator:  `<svg ${SVG_ATTR}><path d="M12 2a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" fill="none"/></svg>`,
  };

  function get(name, cls = '') {
    const icon = icons[name];
    if (!icon) return '';
    if (!cls) return icon;
    return icon.replace('<svg ', `<svg class="${cls}" `);
  }

  return { get, all: icons };
})();
