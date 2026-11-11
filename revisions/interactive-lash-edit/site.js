const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const { looks, categories, bookingBase } = mjCatalogue;
const appointmentUrl = id => bookingBase + encodeURIComponent(id);

const stage = document.querySelector('.eye-stage');
const photo = document.querySelector('#hero-eye');
const heroBook = document.querySelector('#hero-book');
const stageTools = document.querySelector('.stage-tools');
const tuner = document.querySelector('.tuner');
const mapToggle = document.querySelector('#map-toggle');
const lightToggle = document.querySelector('#light-toggle');
const mapDetail = document.querySelector('#map-detail');
const mapOverlay = document.querySelector('#lash-overlay');
const mapProfiles = {
  moonlight: ['M29 31 Q43 18 59 10', 'M31 29l-3-5m9 1-3-7m9 3-3-7m9 3-2-8m9 4-1-8'],
  wispy: ['M12 47 Q34 31 62 36', 'M15 45l-4-8m11 4-3-9m11 5-2-13m10 11 0-10m8 10 2-12m6 12 3-8'],
  kat: ['M32 24 Q50 27 64 44', 'M33 24l1-5m6 7 2-7m6 11 3-8m5 13 5-9m2 15 7-9'],
  tokyo: ['M39 25 Q56 26 84 31', 'M42 25l-2-13m10 14-1-9m9 10 0-12m9 14 2-10m6 11 3-9'],
};
let photoMotion;

stageTools.hidden = false;
tuner.hidden = false;
tuner.addEventListener('click', event => {
  const button = event.target.closest('button[data-look]');
  if (!button || button.getAttribute('aria-pressed') === 'true') return;
  const key = button.dataset.look;
  const look = looks[key];
  const [curve, guides] = mapProfiles[key];
  photo.src = 'assets/' + look.image;
  photo.alt = 'Close-up of MJ’s ' + look.name + ' lash set';
  document.querySelector('#stage-name').textContent = look.name;
  document.querySelector('#stage-spec').textContent = look.style + ' · ' + look.duration;
  document.querySelector('#map-spec').textContent = look.map;
  document.querySelector('#map-description').textContent = look.description;
  document.querySelector('#map-curve').setAttribute('d', curve);
  document.querySelector('#map-guides').setAttribute('d', guides);
  heroBook.dataset.book = key;
  heroBook.href = appointmentUrl(look.id);
  heroBook.querySelector('span').textContent = 'Book ' + look.name + ' · ' + look.price;

  for (const item of tuner.querySelectorAll('button[data-look]')) {
    item.setAttribute('aria-pressed', String(item === button));
  }
  document.querySelector('#tuner-status').textContent = `${look.name}, ${look.price}, ${look.duration}.`;
  if (!reduceMotion.matches && photo.animate) {
    photoMotion?.cancel();
    photoMotion = photo.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 220 });
  }
});

mapToggle.addEventListener('click', () => {
  const active = mapToggle.getAttribute('aria-pressed') !== 'true';
  mapToggle.setAttribute('aria-pressed', String(active));
  mapDetail.hidden = !active;
  mapOverlay.toggleAttribute('hidden', !active);
});
lightToggle.addEventListener('click', () => {
  const active = lightToggle.getAttribute('aria-pressed') !== 'true';
  lightToggle.setAttribute('aria-pressed', String(active));
  stage.classList.toggle('after-hours', active);
  document.querySelector('#light-note').hidden = !active;
});

const filters = document.querySelector('.look-filters');
const lookCards = [...document.querySelectorAll('.look-card')];
filters.hidden = false;
filters.addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  const key = button.dataset.filter;
  for (const card of lookCards) card.hidden = key !== 'all' && card.dataset.style !== key;
  for (const item of filters.querySelectorAll('button')) item.setAttribute('aria-pressed', String(item === button));
  const count = lookCards.filter(card => !card.hidden).length;
  document.querySelector('#filter-status').textContent = count === 1 ? '1 look shown.' : count + ' looks shown.';
});

for (const feature of document.querySelectorAll('.comparison, .loupe')) {
  feature.dataset.interactive = 'true';
  feature.querySelector('.range-control').hidden = false;
}
const comparison = document.querySelector('.comparison-window');
const comparisonRange = document.querySelector('#comparison-range');
comparisonRange.addEventListener('input', () => comparison.style.setProperty('--reveal', comparisonRange.value + '%'));

const zoom = document.querySelector('#zoom-range');
const loupe = document.querySelector('.loupe-window');
const loupeImage = loupe.querySelector('img');
let loupeBounds;
zoom.addEventListener('input', () => {
  loupeImage.style.transform = 'scale(' + zoom.value + ')';
  document.querySelector('#zoom-output').value = zoom.value + '×';
});
loupe.addEventListener('pointerenter', () => { loupeBounds = loupe.getBoundingClientRect(); });
loupe.addEventListener('pointerdown', () => { loupeBounds = loupe.getBoundingClientRect(); });
loupe.addEventListener('pointermove', event => {
  if (Number(zoom.value) === 1 || !loupeBounds) return;
  const x = Math.max(0, Math.min(100, (event.clientX - loupeBounds.left) / loupeBounds.width * 100));
  const y = Math.max(0, Math.min(100, (event.clientY - loupeBounds.top) / loupeBounds.height * 100));
  loupeImage.style.transformOrigin = x + '% ' + y + '%';
});

const kitNotes = {
  trays: 'Trays in several lengths and curls for practising different sets.',
  tweezers: 'Precision tweezers for isolating and placing lashes.',
  adhesive: 'Lash adhesive is listed alongside primer and remover.',
};
const kit = document.querySelector('.academy-kit');
kit.querySelector('.kit-control').hidden = false;
kit.querySelector('.kit-pins').hidden = false;
kit.addEventListener('click', event => {
  const button = event.target.closest('button[data-kit]');
  if (!button) return;
  document.querySelector('#kit-detail').textContent = kitNotes[button.dataset.kit];
  for (const item of kit.querySelectorAll('button[data-kit]')) {
    item.setAttribute('aria-pressed', String(item.dataset.kit === button.dataset.kit));
  }
});

const categorySwitch = document.querySelector('.category-switch');
const treatments = document.querySelector('#treatment-list');
const servicesById = new Map(Object.values(categories).flatMap(category => category.items.map(item => [String(item.id), item])));

function treatmentRow(item) {
  const link = document.createElement('a');
  link.href = appointmentUrl(item.id);
  link.className = 'treatment-row';
  if (!item.direct) link.dataset.book = item.look ?? String(item.id);
  const label = document.createElement('strong');
  label.textContent = item.name;
  const price = document.createElement('span');
  price.textContent = item.price ? `${item.price} · ${item.duration}` : 'Acuity';
  link.append(label, price);
  return link;
}

function showCategory(key) {
  const category = categories[key];
  treatments.replaceChildren(...category.items.map(treatmentRow));
  if (category.note) {
    const note = document.createElement('p');
    note.className = 'fine-print category-note';
    note.textContent = category.note;
    treatments.prepend(note);
  }
}

categorySwitch.hidden = false;
showCategory('sets');
categorySwitch.addEventListener('click', event => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  showCategory(button.dataset.category);
  for (const item of categorySwitch.querySelectorAll('button')) item.setAttribute('aria-pressed', String(item === button));
});

const sheet = document.querySelector('#booking-sheet');
sheet.querySelector('.sheet-close').addEventListener('click', () => sheet.close());
document.addEventListener('click', event => {
  const link = event.target.closest('a[data-book]');
  if (!link || typeof sheet.showModal !== 'function' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const service = looks[link.dataset.book] ?? servicesById.get(link.dataset.book);
  if (!service) return;
  event.preventDefault();
  sheet.querySelector('#sheet-title').textContent = service.name;
  sheet.querySelector('#sheet-meta').textContent = `${service.price} · ${service.duration}`;
  sheet.querySelector('#sheet-note').textContent = service.note ?? 'Check the appointment listing for preparation and any payment terms.';
  sheet.querySelector('#sheet-link').href = appointmentUrl(service.id);
  sheet.showModal();
});
