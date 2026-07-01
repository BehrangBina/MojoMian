const header = document.querySelector('.site-header');
const nav = document.querySelector('.primary-nav');
const internalLinks = document.querySelectorAll('.nav-menu a, .portfolio-list a, .back-to-index, .main-button');
const barBasePath = 'src/Logos/Bar-Logo';

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

const brandingProjects = [
  {
    id: 'minel',
    project: 'Minel',
    industry: 'Fashion',
    image: 'src/Branding/01.jpg',
    colors: ['#DFD3B3', '#F8FBF9', '#000000'],
    description: 'The client needed a minimal and modern look for their logo design and branding to reflect their unique position in the fashion industry. By using black, we maintained a luxurious and modern aesthetic.'
  },
  {
    id: 'moji',
    project: 'Moji brow artist',
    industry: 'Beauty',
    image: 'src/Branding/02.jpg',
    colors: ['#CF4F37', '#5B8C76', '#E6E2DF'],
    description: 'A warm beauty identity with natural contrast, designed to feel personal, fresh, and approachable.'
  },
  {
    id: 'shahrzad',
    project: 'Shahrzad',
    industry: '-----',
    image: 'src/Branding/03.jpg',
    colors: ['#5D8179', '#F3ECE1', '#E8BBAA'],
    description: 'A refined visual direction built around soft neutrals and green tones for an elegant brand presence.'
  },
  {
    id: 'curly',
    project: 'Curly',
    industry: 'Fashion',
    image: 'src/Branding/04.jpg',
    colors: ['#A8644B', '#E8E8E8', '#E5D6C4'],
    description: 'A textured and warm fashion brand direction with earthy tones and an editorial mood.'
  },
  {
    id: 'miss-broccoli',
    project: 'Miss-Broccoli',
    industry: 'Food',
    image: 'src/Branding/05.jpg',
    colors: ['#007B3A', '#FF6500', '#D0021B', '#83C83E'],
    description: 'A vivid food identity using energetic green and orange to create a playful, memorable brand world.'
  },
  {
    id: 'knight',
    project: 'Knight',
    industry: 'Food',
    image: 'src/Branding/06.jpg',
    colors: ['#8BC5C1', '#E3BE38', '#3E5664'],
    description: 'A bold coffee identity with a strong contrast between cool teal, rich yellow, and deep blue-grey.'
  }
];

function initBrandingCarousel() {
  const root = document.querySelector('[data-branding-carousel]');
  if (!root) return;

  const projectEl = root.querySelector('[data-branding-project]');
  const industryEl = root.querySelector('[data-branding-industry]');
  const swatchesEl = root.querySelector('[data-branding-swatches]');
  const imageEl = root.querySelector('[data-branding-image]');
  const fallbackEl = root.querySelector('[data-branding-fallback]');
  const descriptionEl = root.querySelector('[data-branding-description]');
  const indexEl = root.querySelector('[data-branding-index]');
  const prev = root.querySelector('[data-branding-prev]');
  const next = root.querySelector('[data-branding-next]');
  const bar = root.querySelector('[data-branding-bar]');
  let activeProject = 0;

  brandingProjects.forEach((project, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'branding-index-button';
    button.textContent = String(index + 1).padStart(2, '0');
    button.setAttribute('aria-label', `Show ${project.project}`);
    button.addEventListener('click', () => setBrandingProject(index));
    indexEl.append(button);
  });

  function setArrowState(button, isDisabled, activeName, inactiveName) {
    if (!button) return;

    button.disabled = isDisabled;
    button.querySelector('img').src = `${barBasePath}/${isDisabled ? inactiveName : activeName}`;
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

  function setBrandingProject(index) {
    activeProject = Math.max(0, Math.min(index, brandingProjects.length - 1));
    const project = brandingProjects[activeProject];
    const slideNumber = String(activeProject + 1).padStart(2, '0');

    projectEl.textContent = project.project;
    industryEl.textContent = project.industry;
    descriptionEl.textContent = project.description || '';
    renderSwatches(project.colors);

    imageEl.classList.remove('is-missing');
    imageEl.alt = `${project.project} branding project`;
    imageEl.src = project.image;
    fallbackEl.textContent = `${project.project} image pending`;

    if (bar) {
      bar.src = `${barBasePath}/${slideNumber}.png`;
      bar.alt = `Slide ${activeProject + 1} of ${brandingProjects.length}`;
    }

    root.querySelectorAll('.branding-index-button').forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === activeProject);
      button.setAttribute('aria-current', buttonIndex === activeProject ? 'true' : 'false');
    });

    setArrowState(prev, activeProject === 0, 'Arrow-Lef-Active.png', 'Arrow-Lef-inactive.png');
    setArrowState(next, activeProject === brandingProjects.length - 1, 'Arrow-Right-Active.png', 'Arrow-Right-inactive.png');
  }

  imageEl.addEventListener('error', () => {
    imageEl.classList.add('is-missing');
  });

  prev?.addEventListener('click', () => setBrandingProject(activeProject - 1));
  next?.addEventListener('click', () => setBrandingProject(activeProject + 1));
  setBrandingProject(0);
}

initBrandingCarousel();
