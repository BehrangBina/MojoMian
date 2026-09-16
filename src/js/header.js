// --- Splash preloader -------------------------------------------------------
// The overlay dismisses itself via CSS, so this only *shortens* the wait once
// the page has actually loaded. It can never be the reason the splash sticks.
(() => {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  if (document.documentElement.classList.contains('no-preload')) {
    preloader.remove();
    return;
  }

  document.body.classList.add('is-preloading');

  const MIN_VISIBLE = 900;   // let the draw read as intentional, not a flicker
  const started = performance.now();

  const finish = () => {
    document.body.classList.remove('is-preloading');
    preloader.classList.add('is-done');
    setTimeout(() => preloader.remove(), 400);
  };

  const settle = () => setTimeout(finish, Math.max(0, MIN_VISIBLE - (performance.now() - started)));

  if (document.readyState === 'complete') settle();
  else window.addEventListener('load', settle, { once: true });

  // Belt and braces: never hold the page longer than this, whatever happens.
  setTimeout(finish, 2500);
})();

const header = document.querySelector('.site-header');
const nav = document.querySelector('.primary-nav');
const internalLinks = document.querySelectorAll('.nav-menu a, .portfolio-list a, .back-to-index, .main-button');
const mobileMediaQuery = window.matchMedia('(max-width: 520px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function syncCollapsedMenu() {
  if (!header || !nav) return;

  const collapseAt = header.offsetHeight - nav.offsetHeight;
  nav.classList.toggle('is-collapsed', window.scrollY >= collapseAt);
}

// --- Scroll motion ----------------------------------------------------------
// The Desktop-Final prototype gives each anchor its own SCROLL_ANIMATE duration
// and curve; `scrollIntoView({behavior:'smooth'})` honours neither, so the
// scroll is driven here instead. `scroll-behavior` is left at auto in the CSS
// so it cannot fight these frames.
const EASING = {
  linear: (t) => t,
  // Figma EASE_IN / EASE_OUT are the CSS defaults: cubic-bezier(.42,0,1,1)
  // and (0,0,.58,1). Sampled here rather than solved — the error over a
  // sub-second scroll is well under a pixel.
  easeIn: (t) => t * t * t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
};

// selector -> [duration ms, easing]  (from the prototype, per link group)
const SCROLL_MOTION = [
  ['.portfolio-list a[href="#nixie-dolls"]', 300, EASING.easeIn],
  ['.portfolio-list a', 200, EASING.easeIn],
  ['.nav-menu a[href="#contact"]', 300, EASING.easeIn],
  ['.nav-menu a', 200, EASING.linear],
  ['.back-to-top', 200, EASING.linear],
  ['.back-to-index', 300, EASING.linear],
  ['.main-button', 300, EASING.linear],
];

function scrollMotionFor(link) {
  for (const [selector, duration, easing] of SCROLL_MOTION) {
    if (link.matches(selector)) return [duration, easing];
  }
  return [300, EASING.linear];
}

let scrollFrame = null;

function animateScrollTo(top, duration, easing) {
  if (scrollFrame) cancelAnimationFrame(scrollFrame);

  const start = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const end = Math.max(0, Math.min(top, max));
  const distance = end - start;

  if (reducedMotion.matches || duration <= 0 || Math.abs(distance) < 1) {
    window.scrollTo(0, end);
    return;
  }

  const began = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - began) / duration);
    window.scrollTo(0, start + distance * easing(t));
    scrollFrame = t < 1 ? requestAnimationFrame(step) : null;
  };
  scrollFrame = requestAnimationFrame(step);
}

internalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#') || href === '#') return;

    const target = href === '#top' ? document.body : document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    const [duration, easing] = scrollMotionFor(link);
    animateScrollTo(target.getBoundingClientRect().top + window.scrollY, duration, easing);
    history.pushState(null, '', href);
  });
});

// The back-to-top caret is not in `internalLinks`; it takes the same treatment.
document.querySelectorAll('.back-to-top').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    animateScrollTo(0, 200, EASING.linear);
    history.pushState(null, '', '#top');
  });
});

window.addEventListener('scroll', syncCollapsedMenu, { passive: true });
window.addEventListener('resize', syncCollapsedMenu);
syncCollapsedMenu();
const menuToggle = document.querySelector('.mobile-menu-button');

function setMobileMenu(open) {
  if (!nav || !menuToggle) return;
  nav.classList.toggle('is-mobile-open', open);
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('mobile-menu-open', open);
}

menuToggle?.addEventListener('click', () => {
  setMobileMenu(!nav?.classList.contains('is-mobile-open'));
});

nav?.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => setMobileMenu(false));
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMobileMenu(false);
});

mobileMediaQuery.addEventListener('change', (event) => {
  if (!event.matches) setMobileMenu(false);
});

const aboutDrawer = document.querySelector('[data-about-drawer]');
const aboutOpen = document.querySelector('[data-about-open]');
const aboutClose = document.querySelector('[data-about-close]');

function setAboutDrawer(open) {
  if (!aboutDrawer) return;
  aboutDrawer.classList.toggle('is-open', open);
  aboutDrawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  document.body.classList.toggle('about-drawer-open', open);
}

aboutOpen?.addEventListener('click', () => setAboutDrawer(true));
aboutClose?.addEventListener('click', () => setAboutDrawer(false));
aboutDrawer?.addEventListener('click', (event) => {
  if (event.target === aboutDrawer) setAboutDrawer(false);
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setAboutDrawer(false);
});

// Figma "Folio-Logos" is a horizontal auto-layout strip of 1057.06 cards on a
// 47.6 gap, clipped by the 1152.26 "Folio-Logo" viewport — so a step translates
// the strip rather than cross-fading. The pitch itself lives in the stylesheet,
// which lets each breakpoint set its own; here we only publish the index.

document.querySelectorAll('[data-logo-carousel]').forEach((carousel) => {
  const section = carousel.closest('section') || document;
  const track = carousel.querySelector('[data-logo-track]');
  const slides = Array.from(carousel.querySelectorAll('.logo-slide'));
  const prev = section.querySelector('[data-carousel-prev]');
  const next = section.querySelector('[data-carousel-next]');
  let activeSlide = 0;

  function setSlide(index) {
    if (slides.length === 0) return;

    activeSlide = Math.max(0, Math.min(index, slides.length - 1));
    if (track) track.style.setProperty('--index', activeSlide);
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
      // only the card on screen is reachable by keyboard
      slide.inert = slideIndex !== activeSlide;
    });

    // v2 draws both arrows in CSS: the disabled state is the only thing that
    // changes, from ink to Grey-300.
    if (prev) prev.disabled = activeSlide === 0;
    if (next) next.disabled = activeSlide === slides.length - 1;
  }

  prev?.addEventListener('click', () => setSlide(activeSlide - 1));
  next?.addEventListener('click', () => setSlide(activeSlide + 1));
  setSlide(0);
});

const brandingProjects = [
  {
    id: 'minel',
    project: 'Minel',
    industry: 'Fashion',
    slug: 'minel',
    slideCount: 6,
    mobileSlideCount: 10,
    mobileExtensions: { 10: 'png' },
    colors: ['#DFD3B3', '#F8FBF9', '#000000'],
    description: 'MINEL required a modern and minimal brand identity that matched the elegance of the fashion industry. I created a clean logo and visual style using a colour palette to achieve a sophisticated, timeless, and premium look.'
  },
  {
    id: 'moji',
    project: 'Moji brow artist',
    industry: 'Beauty',
    slug: 'moji',
    slideCount: 6,
    mobileSlideCount: 6,
    colors: ['#CF4F37', '#5B8C76', '#E6E2DF'],
    description: 'MOJI BEAUTY needed a fresh and memorable identity that reflected the creativity and personal touch of a brow artist. I designed a handmade-style logo with a vibrant green and orange colour palette to create a warm, energetic, and approachable brand presence.'
  },
  {
    id: 'shahrzad',
    project: 'Shahrzad',
    industry: 'Social Enterprise',
    slug: 'shahrzad',
    slideCount: 6,
    mobileSlideCount: 6,
    colors: ['#5D8179', '#F3ECE1', '#E8BBAA'],
    description: 'SHAHRZAD identity was created to present women\'s creativity, craftsmanship, and empowerment through art. The handmade floral portrait logo combines elements of drawing and sewing, symbolising artistic expression and the skills developed through the organisation\'s programs. A soft palette of deep green, warm beige, and muted pink creates a warm and meaningful visual presence.'
  },
  {
    id: 'curly',
    project: 'Curly',
    industry: 'Fashion',
    slug: 'curly',
    slideCount: 6,
    mobileSlideCount: 6,
    colors: ['#A8644B', '#E8E8E8', '#E5D6C4'],
    description: 'CURLY, an online jewellery brand, needed a Farsi logotype that blends heritage with modern elegance. I created a minimalist design and refined palette of chestnut brown, soft grey, and warm beige to build a feminine, sophisticated, and timeless brand identity.'
  },
  {
    id: 'miss-broccoli',
    project: 'Miss-Broccoli',
    industry: 'Food',
    slug: 'miss-broccoli',
    slideCount: 6,
    mobileSlideCount: 9,
    colors: ['#007B3A', '#FF6500', '#D0021B', '#83C83E'],
    description: 'MISS BROCCOLI needed a playful brand identity built around a unique character logo: a woman with broccoli-inspired hair. The vibrant colour palette reflects freshness, energy, and the natural qualities of the brand, creating a memorable and approachable visual identity.'
  },
  {
    id: 'knight',
    project: 'Knight',
    industry: 'Food',
    slug: 'knight-coffee',
    slideCount: 6,
    mobileSlideCount: 6,
    colors: ['#8BC5C1', '#E3BE38', '#3E5664'],
    description: 'KNIGHT COFFEE, a coffee brand and cafe, needed a visual identity inspired by medieval and classic patterns. The logo features a knight character combined with decorative elements, creating a distinctive and memorable brand identity. The selected colour palette brings together deep blue-grey, soft teal, and warm yellow tones to create a unique and welcoming cafe atmosphere.'
  }
];

function getBrandingSlides(project, useMobile = mobileMediaQuery.matches) {
  const count = useMobile ? (project.mobileSlideCount || project.slideCount) : project.slideCount;
  const basePath = useMobile ? 'src/assets/mobile/branding' : 'src/assets/branding';

  return Array.from({ length: count }, (_, index) => {
    const slideNumber = String(index + 1).padStart(2, '0');
    const extension = useMobile && project.mobileExtensions?.[index + 1] ? project.mobileExtensions[index + 1] : 'jpg';
    return `${basePath}/${project.slug}/slide-${slideNumber}.${extension}`;
  });
}

function initBrandingCarousel() {
  const root = document.querySelector('[data-branding-carousel]');
  if (!root) return;

  const projectEl = root.querySelector('[data-branding-project]');
  const industryEl = root.querySelector('[data-branding-industry]');
  const swatchesEl = root.querySelector('[data-branding-swatches]');
  const fallbackEl = root.querySelector('[data-branding-fallback]');
  const descriptionEl = root.querySelector('[data-branding-description]');
  const indexEl = root.querySelector('[data-branding-index]');
  const prev = root.querySelector('[data-branding-prev]');
  const next = root.querySelector('[data-branding-next]');
  const bar = root.querySelector('[data-branding-bar]');
  let activeProject = 0;
  let activeSlide = 0;

  brandingProjects.forEach((project, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'branding-index-button';
    button.textContent = String(index + 1).padStart(2, '0');
    button.setAttribute('aria-label', `Show ${project.project}`);
    button.addEventListener('click', () => setBrandingProject(index));
    indexEl.append(button);
  });

  // v2 draws the arrows in CSS, so only the disabled state has to be set.
  function setArrowState(button, isDisabled) {
    if (button) button.disabled = isDisabled;
  }

  function renderSwatches(colors) {
    swatchesEl.innerHTML = '';
    colors.forEach((color) => {
      const swatch = document.createElement('span');
      swatch.className = 'branding-swatch';
      swatch.style.backgroundColor = color;
      swatch.title = color;
      swatch.setAttribute('aria-label', color);

      if (color.toLowerCase() === '#f8fbf9' || color.toLowerCase() === '#ffffff') {
        swatch.classList.add('is-light');
      }

      swatchesEl.append(swatch);
    });
  }

  function updateProjectButtons() {
    root.querySelectorAll('.branding-index-button').forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === activeProject);
      button.setAttribute('aria-current', buttonIndex === activeProject ? 'true' : 'false');
    });
  }

  const frameEl = root.querySelector('.branding-frame');
  const trackEl = root.querySelector('[data-branding-track]');

  // Figma clips the 749 x 485 "Slide-Minel" viewport over a 749-pitch strip, so
  // stepping a slide translates. Switching project swaps the whole strip, which
  // is the one case that cross-fades.

  function buildBrandingTrack(project) {
    if (!trackEl) return;
    trackEl.innerHTML = '';
    getBrandingSlides(project).forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${project.project} branding project slide ${i + 1}`;
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', () => img.classList.add('is-missing'));
      trackEl.append(img);
    });
  }

  function setBrandingSlide(index, kind = 'slide') {
    const project = brandingProjects[activeProject];
    const slideCount = getBrandingSlides(project).length;
    activeSlide = Math.max(0, Math.min(index, slideCount - 1));

    if (trackEl) {
      // a rebuilt strip must not animate its jump back to the first slide
      if (kind === 'project') frameEl?.classList.add('is-rebuilding');
      trackEl.style.setProperty('--index', activeSlide);
      if (kind === 'project') {
        requestAnimationFrame(() => frameEl?.classList.remove('is-rebuilding'));
      }
    }
    fallbackEl.textContent = `${project.project} image ${String(activeSlide + 1).padStart(2, '0')} pending`;

    if (bar) {
      const steps = Math.max(slideCount, 2);
      bar.style.setProperty('--branding-active', activeSlide);
      bar.style.setProperty('--branding-steps', steps);
      bar.setAttribute('aria-label', `Slide ${activeSlide + 1} of ${slideCount}`);
    }

    setArrowState(prev, activeSlide === 0);
    setArrowState(next, activeSlide === slideCount - 1);
  }

  let projectSwapTimer = 0;

  function setBrandingProject(index) {
    activeProject = Math.max(0, Math.min(index, brandingProjects.length - 1));
    activeSlide = 0;
    const project = brandingProjects[activeProject];

    // Meta and copy cross-fade on the same GENTLE curve as the slide.
    const paint = () => {
      projectEl.textContent = project.project;
      industryEl.textContent = project.industry;
      descriptionEl.textContent = project.description || '';
      renderSwatches(project.colors);
      buildBrandingTrack(project);
    };

    updateProjectButtons();
    setBrandingSlide(0, 'project');

    if (reducedMotion.matches) {
      paint();
      return;
    }

    root.classList.add('is-swapping-project');
    paint();
    cancelAnimationFrame(projectSwapTimer);
    projectSwapTimer = requestAnimationFrame(() => requestAnimationFrame(() => {
      root.classList.remove('is-swapping-project');
    }));
  }

  prev?.addEventListener('click', () => setBrandingSlide(activeSlide - 1));
  next?.addEventListener('click', () => setBrandingSlide(activeSlide + 1));
  mobileMediaQuery.addEventListener?.('change', () => setBrandingProject(activeProject));
  setBrandingProject(0);
}

initBrandingCarousel();

// `title` is the visible fallback caption; `alt` is the descriptive text for
// search engines and screen readers, drawn from this section's own copy.
// v2 "Folio Posters": four full-bleed 1060 x 706 slides, one per page.
const posterItems = [
  { title: 'Poster 01', alt: 'Poster design exploring image and typography, Reza Shah series 1', image: 'src/assets/posters/reza-shah-01.jpg' },
  { title: 'Poster 02', alt: 'Poster design exploring image and typography, Reza Shah series 2', image: 'src/assets/posters/reza-shah-02.jpg' },
  { title: 'Poster 03', alt: 'Minimal illustrative poster 1 from the Mahsa Amini series', image: 'src/assets/posters/mahsa-amini-01.jpg' },
  { title: 'Poster 04', alt: 'Minimal illustrative poster 2 from the Mahsa Amini series', image: 'src/assets/posters/mahsa-amini-02.jpg' }
];

function initPostersCarousel() {
  const root = document.querySelector('[data-posters-carousel]');
  if (!root) return;

  const grid = root.querySelector('[data-posters-grid]');
  const prev = root.querySelector('[data-posters-prev]');
  const next = root.querySelector('[data-posters-next]');
  const bar = root.querySelector('[data-posters-bar]');
  const perPage = 1;
  let pageCount = Math.ceil(posterItems.length / perPage);
  let activePage = 0;

  // v2 draws the arrows in CSS, so only the disabled state has to be set.
  function setArrowState(button, isDisabled) {
    if (button) button.disabled = isDisabled;
  }

  // Figma clips the 1060 "Folio-Posters-Slide" over a 1059.67-pitch strip, so
  // every slide is built once and the strip translates.
  const track = document.createElement('div');
  track.className = 'posters-track';
  posterItems.forEach((item, i) => {
    const card = document.createElement('figure');
    card.className = 'poster-card';

    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.alt || item.title;
    image.loading = i === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => image.classList.add('is-missing'));

    const sheet = document.createElement('figcaption');
    sheet.className = 'poster-placeholder-sheet';
    sheet.textContent = item.title;

    card.append(image, sheet);
    track.append(card);
  });
  grid.innerHTML = '';
  grid.append(track);

  function renderPage(index) {
    activePage = Math.max(0, Math.min(index, pageCount - 1));
    track.style.setProperty('--index', activePage);

    if (bar) {
      bar.style.setProperty('--branding-active', activePage);
      bar.style.setProperty('--branding-steps', Math.max(pageCount, 2));
      bar.setAttribute('aria-label', `Page ${activePage + 1} of ${pageCount}`);
    }

    setArrowState(prev, activePage === 0);
    setArrowState(next, activePage === pageCount - 1);
  }

  prev?.addEventListener('click', () => renderPage(activePage - 1));
  next?.addEventListener('click', () => renderPage(activePage + 1));
  mobileMediaQuery.addEventListener?.('change', () => renderPage(0));
  renderPage(0);
}

initPostersCarousel();
document.querySelectorAll('.illustration-item img, .illustration-heading-icon').forEach((image) => {
  image.addEventListener('error', () => {
    image.classList.add('is-missing');
  });
});
const nixieSlides = [
  {
    image: 'src/assets/nixie-doll/story/slide-01.jpg',
    caption: 'Every Nixie begins with concept exploration and visual storytelling.'
  },
  {
    image: 'src/assets/nixie-doll/story/slide-02.jpg',
    caption: "Careful material selection reinforces the character's visual identity."
  },
  {
    image: 'src/assets/nixie-doll/story/slide-03.jpg',
    caption: 'Colour is intentionally balanced to create harmony and mood.'
  },
  {
    image: 'src/assets/nixie-doll/story/slide-04.jpg',
    caption: 'Custom-dyed wools ensure every colour supports the original concept.'
  },
  {
    image: 'src/assets/nixie-doll/story/slide-05.jpg',
    caption: 'Attention to detail transforms ideas into a cohesive final design.'
  },
  {
    image: 'src/assets/nixie-doll/story/slide-06.jpg',
    caption: 'The finished piece reflects the same design principles applied to branding and visual communication.'
  }
];

function initNixieCarousel() {
  const root = document.querySelector('[data-nixie-carousel]');
  if (!root) return;

  const image = root.querySelector('[data-nixie-image]');
  const fallback = root.querySelector('[data-nixie-fallback]');
  const caption = root.querySelector('.nixie-mobile-caption');
  const prev = root.querySelector('[data-nixie-prev]');
  const next = root.querySelector('[data-nixie-next]');
  let activeSlide = 0;

  function setSlide(index) {
    activeSlide = Math.max(0, Math.min(index, nixieSlides.length - 1));
    image.classList.remove('is-missing');
    image.src = nixieSlides[activeSlide].image;
    image.alt = `Nixie Dolls slide ${activeSlide + 1}`;
    if (caption) caption.textContent = nixieSlides[activeSlide].caption;
    fallback.textContent = `Nixie Dolls image ${String(activeSlide + 1).padStart(2, '0')} pending`;

    if (prev) prev.disabled = activeSlide === 0;
    if (next) next.disabled = activeSlide === nixieSlides.length - 1;
  }

  image.addEventListener('error', () => {
    image.classList.add('is-missing');
  });

  prev?.addEventListener('click', () => setSlide(activeSlide - 1));
  next?.addEventListener('click', () => setSlide(activeSlide + 1));
  setSlide(0);
}

initNixieCarousel();
const nixieGalleryItems = Array.from({ length: 9 }, (_, index) => ({
  title: `Nixie Doll ${String(index + 1).padStart(2, '0')}`,
  image: 'src/assets/nixie-doll/carousel/slide-' + String(index + 1).padStart(2, '0') + '.jpg'
}));

function initNixieGalleryCarousel() {
  const root = document.querySelector('[data-nixie-gallery-carousel]');
  if (!root) return;

  const grid = root.querySelector('[data-nixie-gallery-grid]');
  const prev = root.querySelector('[data-nixie-gallery-prev]');
  const next = root.querySelector('[data-nixie-gallery-next]');
  const bar = root.querySelector('[data-nixie-gallery-bar]');
  let perPage = mobileMediaQuery.matches ? 2 : 3;
  let pageCount = Math.ceil(nixieGalleryItems.length / perPage);
  let activePage = 0;

  // v2 draws the arrows in CSS, so only the disabled state has to be set.
  function setArrowState(button, isDisabled) {
    if (button) button.disabled = isDisabled;
  }

  function syncGalleryPaging() {
    perPage = mobileMediaQuery.matches ? 2 : 3;
    pageCount = Math.ceil(nixieGalleryItems.length / perPage);
    activePage = Math.min(activePage, pageCount - 1);
  }

  function renderPage(index) {
    syncGalleryPaging();
    activePage = Math.max(0, Math.min(index, pageCount - 1));
    const pageItems = nixieGalleryItems.slice(activePage * perPage, activePage * perPage + perPage);

    grid.innerHTML = '';
    pageItems.forEach((item) => {
      const card = document.createElement('figure');
      card.className = 'nixie-gallery-card';

      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.title;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => image.classList.add('is-missing'));

      const caption = document.createElement('figcaption');
      caption.textContent = item.title;

      card.append(image, caption);
      grid.append(card);
    });

    if (bar) {
      bar.style.setProperty('--branding-active', activePage);
      bar.style.setProperty('--branding-steps', Math.max(pageCount, 2));
      bar.setAttribute('aria-label', `Page ${activePage + 1} of ${pageCount}`);
    }

    setArrowState(prev, activePage === 0);
    setArrowState(next, activePage === pageCount - 1);
  }

  prev?.addEventListener('click', () => renderPage(activePage - 1));
  next?.addEventListener('click', () => renderPage(activePage + 1));
  mobileMediaQuery.addEventListener?.('change', () => renderPage(0));
  renderPage(0);
}

initNixieGalleryCarousel();
