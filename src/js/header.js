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
    folder: '01',
    slidePrefix: 'Minel-0',
    slideCount: 6,
    colors: ['#DFD3B3', '#F8FBF9', '#000000'],
    description: 'The client needed a minimal and modern look for their logo design and branding to reflect their unique position in the fashion industry. By using black, we maintained a luxurious and modern aesthetic, ensuring that the branding resonates with the target audience and reinforces MINEL\'s commitment to high-quality, stylish, and timeless pieces.'
  },
  {
    id: 'moji',
    project: 'Moji brow artist',
    industry: 'Beauty',
    folder: '02',
    slidePrefix: 'Moji-',
    slideCount: 6,
    colors: ['#CF4F37', '#5B8C76', '#E6E2DF'],
    description: 'Description -02'
  },
  {
    id: 'shahrzad',
    project: 'Shahrzad',
    industry: '-----',
    folder: '03',
    slidePrefix: 'Shahrzaad-0',
    slideCount: 5,
    colors: ['#5D8179', '#F3ECE1', '#E8BBAA'],
    description: 'Description -03'
  },
  {
    id: 'curly',
    project: 'Curly',
    industry: 'Fashion',
    folder: '04',
    slidePrefix: 'Curly-0',
    slideCount: 6,
    colors: ['#A8644B', '#E8E8E8', '#E5D6C4'],
    description: 'Description -04'
  },
  {
    id: 'miss-broccoli',
    project: 'Miss-Broccoli',
    industry: 'Food',
    folder: '05',
    slidePrefix: 'MissBroccoli-0',
    slideCount: 6,
    colors: ['#007B3A', '#FF6500', '#D0021B', '#83C83E'],
    description: 'Description -05'
  },
  {
    id: 'knight',
    project: 'Knight',
    industry: 'Food',
    folder: '06',
    slidePrefix: 'Knight-0',
    slideCount: 6,
    colors: ['#8BC5C1', '#E3BE38', '#3E5664'],
    description: 'Description -06'
  }
].map((project) => ({
  ...project,
  slides: Array.from({ length: project.slideCount }, (_, index) => {
    const slideNumber = String(index + 1).padStart(2, '0');
    const slidePrefix = project.slidePrefix || '';
    return `src/Branding/${project.folder}/${slidePrefix}${slideNumber}.jpg`;
  })
}));

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

  function updateProjectButtons() {
    root.querySelectorAll('.branding-index-button').forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === activeProject);
      button.setAttribute('aria-current', buttonIndex === activeProject ? 'true' : 'false');
    });
  }

  function setBrandingSlide(index) {
    const project = brandingProjects[activeProject];
    const slideCount = project.slides.length;
    activeSlide = Math.max(0, Math.min(index, slideCount - 1));

    imageEl.classList.remove('is-missing');
    imageEl.alt = `${project.project} branding project slide ${activeSlide + 1}`;
    imageEl.src = project.slides[activeSlide];
    fallbackEl.textContent = `${project.project} image ${String(activeSlide + 1).padStart(2, '0')} pending`;

    if (bar) {
      const steps = Math.max(slideCount, 2);
      bar.style.setProperty('--branding-active', activeSlide);
      bar.style.setProperty('--branding-steps', steps);
      bar.setAttribute('aria-label', `Slide ${activeSlide + 1} of ${slideCount}`);
    }

    setArrowState(prev, activeSlide === 0, 'Arrow-Lef-Active.png', 'Arrow-Lef-inactive.png');
    setArrowState(next, activeSlide === slideCount - 1, 'Arrow-Right-Active.png', 'Arrow-Right-inactive.png');
  }

  function setBrandingProject(index) {
    activeProject = Math.max(0, Math.min(index, brandingProjects.length - 1));
    activeSlide = 0;
    const project = brandingProjects[activeProject];

    projectEl.textContent = project.project;
    industryEl.textContent = project.industry;
    descriptionEl.textContent = project.description || '';
    renderSwatches(project.colors);
    updateProjectButtons();
    setBrandingSlide(0);
  }

  imageEl.addEventListener('error', () => {
    imageEl.classList.add('is-missing');
  });

  prev?.addEventListener('click', () => setBrandingSlide(activeSlide - 1));
  next?.addEventListener('click', () => setBrandingSlide(activeSlide + 1));
  setBrandingProject(0);
}

initBrandingCarousel();

const posterItems = [
  { title: 'Poster 01', image: 'src/Posters/Poster01.jpg' },
  { title: 'Poster 02', image: 'src/Posters/Poster02.jpg' },
  { title: 'Poster 03', image: 'src/Posters/Poster03.jpg' }
];

function initPostersCarousel() {
  const root = document.querySelector('[data-posters-carousel]');
  if (!root) return;

  const grid = root.querySelector('[data-posters-grid]');
  const prev = root.querySelector('[data-posters-prev]');
  const next = root.querySelector('[data-posters-next]');
  const bar = root.querySelector('[data-posters-bar]');
  const perPage = 3;
  const pageCount = Math.ceil(posterItems.length / perPage);
  let activePage = 0;

  function setArrowState(button, isDisabled, activeName, inactiveName) {
    if (!button) return;

    button.disabled = isDisabled;
    button.querySelector('img').src = `${barBasePath}/${isDisabled ? inactiveName : activeName}`;
  }

  function renderPage(index) {
    activePage = Math.max(0, Math.min(index, pageCount - 1));
    const pageItems = posterItems.slice(activePage * perPage, activePage * perPage + perPage);

    grid.innerHTML = '';
    pageItems.forEach((item) => {
      const card = document.createElement('figure');
      card.className = 'poster-card';

      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.title;
      image.addEventListener('error', () => image.classList.add('is-missing'));

      const sheet = document.createElement('figcaption');
      sheet.className = 'poster-placeholder-sheet';
      sheet.textContent = item.title;

      card.append(image, sheet);
      grid.append(card);
    });

    if (bar) {
      bar.style.setProperty('--branding-active', activePage);
      bar.style.setProperty('--branding-steps', Math.max(pageCount, 2));
      bar.setAttribute('aria-label', `Page ${activePage + 1} of ${pageCount}`);
    }

    setArrowState(prev, activePage === 0, 'Arrow-Lef-Active.png', 'Arrow-Lef-inactive.png');
    setArrowState(next, activePage === pageCount - 1, 'Arrow-Right-Active.png', 'Arrow-Right-inactive.png');
  }

  prev?.addEventListener('click', () => renderPage(activePage - 1));
  next?.addEventListener('click', () => renderPage(activePage + 1));
  renderPage(0);
}

initPostersCarousel();
document.querySelectorAll('.illustration-item img, .illustration-heading-icon').forEach((image) => {
  image.addEventListener('error', () => {
    image.classList.add('is-missing');
  });
});
const nixieSlides = Array.from({ length: 6 }, (_, index) => 'src/Nixie-Dolls/Nixie-' + String(index + 1).padStart(3, '0') + '.jpg');

function initNixieCarousel() {
  const root = document.querySelector('[data-nixie-carousel]');
  if (!root) return;

  const image = root.querySelector('[data-nixie-image]');
  const fallback = root.querySelector('[data-nixie-fallback]');
  const prev = root.querySelector('[data-nixie-prev]');
  const next = root.querySelector('[data-nixie-next]');
  let activeSlide = 0;

  function setSlide(index) {
    activeSlide = Math.max(0, Math.min(index, nixieSlides.length - 1));
    image.classList.remove('is-missing');
    image.src = nixieSlides[activeSlide];
    image.alt = `Nixie Dolls slide ${activeSlide + 1}`;
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
const nixieGalleryItems = Array.from({ length: 6 }, (_, index) => ({
  title: `Nixie Doll ${String(index + 1).padStart(2, '0')}`,
  image: 'src/Nixie-Dolls/Nixie-' + String(index + 1).padStart(3, '0') + '.jpg'
}));

function initNixieGalleryCarousel() {
  const root = document.querySelector('[data-nixie-gallery-carousel]');
  if (!root) return;

  const grid = root.querySelector('[data-nixie-gallery-grid]');
  const prev = root.querySelector('[data-nixie-gallery-prev]');
  const next = root.querySelector('[data-nixie-gallery-next]');
  const bar = root.querySelector('[data-nixie-gallery-bar]');
  const perPage = 3;
  const pageCount = Math.ceil(nixieGalleryItems.length / perPage);
  let activePage = 0;

  function setArrowState(button, isDisabled, activeName, inactiveName) {
    if (!button) return;

    button.disabled = isDisabled;
    button.querySelector('img').src = `${barBasePath}/${isDisabled ? inactiveName : activeName}`;
  }

  function renderPage(index) {
    activePage = Math.max(0, Math.min(index, pageCount - 1));
    const pageItems = nixieGalleryItems.slice(activePage * perPage, activePage * perPage + perPage);

    grid.innerHTML = '';
    pageItems.forEach((item) => {
      const card = document.createElement('figure');
      card.className = 'nixie-gallery-card';

      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.title;
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

    setArrowState(prev, activePage === 0, 'Arrow-Lef-Active.png', 'Arrow-Lef-inactive.png');
    setArrowState(next, activePage === pageCount - 1, 'Arrow-Right-Active.png', 'Arrow-Right-inactive.png');
  }

  prev?.addEventListener('click', () => renderPage(activePage - 1));
  next?.addEventListener('click', () => renderPage(activePage + 1));
  renderPage(0);
}

initNixieGalleryCarousel();