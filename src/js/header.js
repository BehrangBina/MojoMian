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
const logoProgress = document.querySelector('.carousel-track span');
let activeLogoSlide = 0;

function setLogoSlide(index) {
  if (!logoCarousel || logoSlides.length === 0) return;

  activeLogoSlide = (index + logoSlides.length) % logoSlides.length;
  logoSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === activeLogoSlide);
  });

  if (logoProgress) {
    logoProgress.style.transform = `translateX(${activeLogoSlide * 100}%)`;
  }
}

logoPrev?.addEventListener('click', () => setLogoSlide(activeLogoSlide - 1));
logoNext?.addEventListener('click', () => setLogoSlide(activeLogoSlide + 1));
setLogoSlide(0);
