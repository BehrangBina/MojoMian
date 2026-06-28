const header = document.querySelector('.site-header');
const nav = document.querySelector('.primary-nav');
const navLinks = document.querySelectorAll('.nav-menu a');

function syncCollapsedMenu() {
  if (!header || !nav) return;

  const collapseAt = header.offsetHeight - nav.offsetHeight;
  nav.classList.toggle('is-collapsed', window.scrollY >= collapseAt);
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

window.addEventListener('scroll', syncCollapsedMenu, { passive: true });
window.addEventListener('resize', syncCollapsedMenu);
syncCollapsedMenu();

const logoCarousel = document.querySelector('[data-logo-carousel]');
const logoSlides = Array.from(document.querySelectorAll('.logo-slide'));
const logoPrev = document.querySelector('[data-carousel-prev]');
const logoNext = document.querySelector('[data-carousel-next]');
const logoBar = document.querySelector('[data-carousel-bar]');
const barBasePath = 'src/Logos/Bar-Logo';
let activeLogoSlide = 0;

function setLogoSlide(index) {
  if (!logoCarousel || logoSlides.length === 0) return;

  activeLogoSlide = Math.max(0, Math.min(index, logoSlides.length - 1));
  logoSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === activeLogoSlide);
  });

  if (logoBar) {
    const slideNumber = String(activeLogoSlide + 1).padStart(2, '0');
    logoBar.src = `${barBasePath}/${slideNumber}.png`;
    logoBar.alt = `Slide ${activeLogoSlide + 1} of ${logoSlides.length}`;
  }

  if (logoPrev) {
    const isFirst = activeLogoSlide === 0;
    logoPrev.disabled = isFirst;
    logoPrev.querySelector('img').src = `${barBasePath}/${isFirst ? 'Arrow-Lef-inactive.png' : 'Arrow-Lef-Active.png'}`;
  }

  if (logoNext) {
    const isLast = activeLogoSlide === logoSlides.length - 1;
    logoNext.disabled = isLast;
    logoNext.querySelector('img').src = `${barBasePath}/${isLast ? 'Arrow-Right-inactive.png' : 'Arrow-Right-Active.png'}`;
  }
}

logoPrev?.addEventListener('click', () => setLogoSlide(activeLogoSlide - 1));
logoNext?.addEventListener('click', () => setLogoSlide(activeLogoSlide + 1));
setLogoSlide(0);

