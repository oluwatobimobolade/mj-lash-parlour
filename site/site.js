const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const headerMenus = document.querySelectorAll('.header-menu');
document.addEventListener('click', event => {
  for (const menu of headerMenus) {
    if (!menu.contains(event.target) || event.target.closest('.menu-panel a')) menu.open = false;
  }
});
for (const menu of headerMenus) {
  menu.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    menu.querySelector('summary').focus();
  });
}

const hero = document.querySelector('.hero');
const heroControls = hero.querySelector('.hero-carousel');
const heroCampaign = hero.querySelector('.hero-campaign-picture');
const heroPhoto = hero.querySelector('.hero-client-photo');
const heroSlides = [
  { caption: 'Signature lash sets', name: 'MJ Signature Set' },
  { caption: 'Wispy & textured', name: 'Wispy Diva', photo: 'editorial-wispy.webp' },
  { caption: 'Sharp cat eye', name: 'Kat I', photo: 'editorial-kat.webp' },
  { caption: 'Statement spikes', name: 'Tokyo Dreams', photo: 'editorial-tokyo.webp' },
];
let heroIndex = 0;
heroControls.hidden = false;
heroControls.addEventListener('click', event => {
  const control = event.target.closest('[data-hero-step]');
  if (!control) return;

  heroIndex = (heroIndex + Number(control.dataset.heroStep) + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[heroIndex];
  if (slide.photo) heroPhoto.src = `assets/retouched/${slide.photo}`;
  heroPhoto.hidden = !slide.photo;
  heroCampaign.hidden = Boolean(slide.photo);
  heroControls.querySelector('.slide-caption').textContent = slide.caption;
  heroControls.querySelector('.slide-position').textContent = String(heroIndex + 1).padStart(2, '0');
  heroControls.querySelector('.slide-name').textContent = `, ${slide.name}`;
});

const track = document.querySelector('.portfolio-track');
const controls = document.querySelector('.portfolio-controls');
const count = controls.querySelector('.portfolio-count');

function resultPositions() {
  const cards = [...track.children];
  const first = cards[0].offsetLeft;
  const end = track.scrollWidth - track.clientWidth;
  return [...new Set(cards.map(card => Math.min(card.offsetLeft - first, end)))];
}

function currentResult(positions) {
  const distance = offset => Math.abs(offset - track.scrollLeft);
  return positions.reduce((best, offset, index) => (
    distance(offset) < distance(positions[best]) ? index : best
  ), 0);
}

function updatePortfolio() {
  const positions = resultPositions();
  const label = `${currentResult(positions) + 1} / ${positions.length}`;
  if (count.textContent !== label) count.textContent = label;
  controls.hidden = positions.length < 2;
}

let scrollFrame = 0;
track.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    updatePortfolio();
  });
}, { passive: true });

controls.addEventListener('click', event => {
  const button = event.target.closest('button[data-step]');
  if (!button) return;

  const positions = resultPositions();
  const next = (currentResult(positions) + Number(button.dataset.step) + positions.length) % positions.length;
  track.scrollTo({ left: positions[next], behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});

window.addEventListener('resize', updatePortfolio);
updatePortfolio();

let sculptureRequested = false;
for (const button of document.querySelectorAll('[data-dialog]')) {
  const dialog = document.getElementById(button.dataset.dialog);
  if (typeof dialog.showModal !== 'function') continue;
  button.hidden = false;

  button.addEventListener('click', event => {
    if (button.tagName === 'A' && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    event.preventDefault();
    dialog.showModal();
    if (dialog.id === 'arc-dialog' && !sculptureRequested) {
      sculptureRequested = true;
      const script = document.createElement('script');
      script.src = 'assets/sculpture.js';
      script.addEventListener('error', () => {
        sculptureRequested = false;
        script.remove();
      });
      document.head.append(script);
    }
    const video = dialog.querySelector('video[data-src]');
    if (video && !video.getAttribute('src')) video.src = video.dataset.src;
  });
}

for (const dialog of document.querySelectorAll('.feature-dialog')) {
  const video = dialog.querySelector('video');
  const pause = () => video?.pause();
  dialog.querySelector('.dialog-close').addEventListener('click', () => {
    pause();
    dialog.close();
  });
  dialog.addEventListener('cancel', pause);
  dialog.addEventListener('close', pause);
}

const searchDialog = document.getElementById('search-dialog');
const searchInput = searchDialog.querySelector('input');
const searchResults = searchDialog.querySelectorAll('.search-results li');
const emptySearch = searchDialog.querySelector('.search-empty');
searchInput.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  searchDialog.close();
});
searchInput.addEventListener('input', () => {
  const words = searchInput.value.toLowerCase().trim().split(/\s+/);
  let matches = 0;
  for (const item of searchResults) {
    item.hidden = !words.every(word => item.dataset.terms.includes(word));
    if (!item.hidden) matches++;
  }
  emptySearch.hidden = matches > 0;
});
for (const result of searchDialog.querySelectorAll('.search-results a')) {
  result.addEventListener('click', () => searchDialog.close());
}

const game = document.getElementById('games-dialog');
const lookCards = document.querySelectorAll('.look-card');
const choices = game.querySelectorAll('[data-look]');
const gameResult = game.querySelector('.game-result');
for (const choice of choices) {
  choice.addEventListener('click', () => {
    const match = lookCards[Number(choice.dataset.look)];
    const photo = match.querySelector('img');
    const resultPhoto = gameResult.querySelector('img');
    resultPhoto.src = photo.src;
    resultPhoto.alt = photo.alt;
    gameResult.querySelector('a').href = match.href;
    gameResult.hidden = false;
    gameResult.querySelector('h3').textContent = match.querySelector('small').textContent;
    for (const option of choices) option.setAttribute('aria-pressed', String(option === choice));
  });
}
