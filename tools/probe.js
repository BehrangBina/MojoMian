// Paste into the browser console (or javascript_tool) on the running site.
// Returns measured geometry + type metrics for every element we audit against Figma,
// so the live values can be diffed against spec/desktop.json and spec/mobile.json.
(() => {
  const SELECTORS = {
    'header':            ['.site-header', '.primary-nav', '.nav-menu', '.nav-menu a', '.logo-link img'],
    'hero':              ['.home-section', '.home-content', '.home-content h1', '.main-button'],
    'about':             ['.about-section', '.about-left', '.about-left h2', '.about-role', '.about-copy',
                          '.about-panel', '.about-panel h3', '.pill-list span', '.social-links'],
    'portfolio':         ['.portfolio-section', '.portfolio-inner', '.portfolio-inner h2',
                          '.portfolio-list', '.portfolio-list li', '.portfolio-list a'],
    'logos':             ['#logos', '#logos .logos-header', '#logos .logos-header h2', '#logos .logos-header p',
                          '.logo-carousel', '.logo-slide img', '.carousel-controls', '.carousel-button'],
    'branding':          ['#branding', '#branding h2', '#branding .logos-header p', '.branding-projects',
                          '.branding-meta', '.branding-index', '.branding-index-button', '.branding-frame',
                          '.branding-description', '.branding-swatch'],
    'posters':           ['#posters', '#posters h2', '.posters-carousel', '.posters-grid', '.poster-card',
                          '.posters-description'],
    'illustration':      ['#illustration', '#illustration h2', '.illustration-heading-icon',
                          '#illustration .logos-header p', '.illustration-collage'],
    'nixie':             ['#nixie-dolls', '#nixie-dolls h2', '.nixie-carousel', '.nixie-frame', '.nixie-button',
                          '.nixie-gallery-block', '.nixie-gallery-grid', '.nixie-gallery-card', '.nixie-gallery-copy'],
    'contact':           ['.contact-section', '.contact-content', '.contact-content h2', '.contact-copy',
                          '.contact-email', '.contact-social-links'],
  };

  const px = (v) => (v && v.endsWith('px') ? Math.round(parseFloat(v) * 100) / 100 : v);
  const out = { viewport: `${innerWidth}x${innerHeight}`, sections: {} };

  for (const [section, list] of Object.entries(SELECTORS)) {
    out.sections[section] = list.map((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const rec = {
        sel,
        // x is page-relative so it lines up with the Figma artboard origin
        x: Math.round((r.left + scrollX) * 100) / 100,
        w: Math.round(r.width * 100) / 100,
        h: Math.round(r.height * 100) / 100,
        font: `${px(cs.fontSize)}/${px(cs.lineHeight)} ${cs.fontWeight}`,
        ls: cs.letterSpacing,
        color: cs.color,
      };
      if (cs.display.includes('grid')) {
        rec.grid = cs.gridTemplateColumns;
        rec.gap = `${px(cs.rowGap)} ${px(cs.columnGap)}`;
      } else if (cs.display.includes('flex')) {
        rec.flex = `${cs.flexDirection} ${cs.justifyContent}/${cs.alignItems}`;
        rec.gap = `${px(cs.rowGap)} ${px(cs.columnGap)}`;
      }
      const pad = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(px);
      if (pad.some((p) => p !== 0)) rec.padding = pad.join(' ');
      return rec;
    });
  }
  return out;
})();
