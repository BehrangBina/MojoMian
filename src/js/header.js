const header = document.querySelector('.site-header');
const nav = document.querySelector('.primary-nav');
const internalLinks = document.querySelectorAll('.nav-menu a, .portfolio-list a, .back-to-index, .main-button');

function syncCollapsedMenu() {
  if (!header || !nav) return;

  const collapseAt = header.offsetHeight - nav.offsetHeight;
  nav.classList.toggle('is-collapsed', window.scrollY >= collapseAt);
}

internalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#') || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', href);
  });
});

window.addEventListener('scroll', syncCollapsedMenu, { passive: true });
window.addEventListener('resize', syncCollapsedMenu);
syncCollapsedMenu();

const barBasePath = 'src/Logos/Bar-Logo';

document.querySelectorAll('[data-logo-carousel]').forEach((carousel) => {
  const section = carousel.closest('section') || document;
  const slides = Array.from(carousel.querySelectorAll('.logo-slide'));
  const prev = section.querySelector('[data-carousel-prev]');
  const next = section.querySelector('[data-carousel-next]');
  const bar = section.querySelector('[data-carousel-bar]');
  let activeSlide = 0;

  function setSlide(index) {
    if (slides.length === 0) return;

    activeSlide = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });

    if (bar) {
      const slideNumber = String(activeSlide + 1).padStart(2, '0');
      bar.src = `${barBasePath}/${slideNumber}.png`;
      bar.alt = `Slide ${activeSlide + 1} of ${slides.length}`;
    }

    if (prev) {
      const isFirst = activeSlide === 0;
      prev.disabled = isFirst;
      prev.querySelector('img').src = `${barBasePath}/${isFirst ? 'Arrow-Lef-inactive.png' : 'Arrow-Lef-Active.png'}`;
    }

    if (next) {
      const isLast = activeSlide === slides.length - 1;
      next.disabled = isLast;
      next.querySelector('img').src = `${barBasePath}/${isLast ? 'Arrow-Right-inactive.png' : 'Arrow-Right-Active.png'}`;
    }
  }

  prev?.addEventListener('click', () => setSlide(activeSlide - 1));
  next?.addEventListener('click', () => setSlide(activeSlide + 1));
  setSlide(0);
});
