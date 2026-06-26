const header = document.querySelector('.site-header');
const nav = document.querySelector('.primary-nav');

function syncStickyNav() {
  if (!header || !nav) return;

  const shouldStick = window.scrollY > 0;
  nav.classList.toggle('is-stuck', shouldStick);
  header.classList.toggle('nav-is-stuck', shouldStick);
}

window.addEventListener('scroll', syncStickyNav, { passive: true });
window.addEventListener('resize', syncStickyNav);
syncStickyNav();
