const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
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

  button.addEventListener('click', () => {
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
