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
