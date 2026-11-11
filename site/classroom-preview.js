// UX preview only. No credentials, course entitlement, grades or saved progress.
// Production prerequisites must be enforced on the server for each lesson request.
const previewChapters = [
  { title: 'Introduction & your kit', intro: 'Meet MJ and get ready to learn.' },
  { title: 'Lash theory', intro: 'Build your understanding of lash work.' },
  { title: 'Practical techniques', intro: 'Follow MJ’s application demonstrations.' },
  { title: 'Business & client care', intro: 'Prepare for the client side of your practice.' },
  { title: 'Assessment', intro: 'Bring your learning together.' },
];
const chapterButtons = [...document.querySelectorAll('[data-chapter]')];
const next = document.getElementById('next-chapter');
const reset = document.getElementById('reset-preview');
const title = document.getElementById('lesson-title');
const completed = new Set();
let current = 0;
let unlocked = 0;
function renderPreview(focus = false) {
  for (const [index, button] of chapterButtons.entries()) {
    button.disabled = index > unlocked;
    if (index === current) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
    button.querySelector('small').textContent = completed.has(index) ? 'Explored' : index === current ? 'Current' : index <= unlocked ? 'Available' : 'Locked';
  }
  title.textContent = previewChapters[current].title;
  document.getElementById('chapter-eyebrow').textContent = `CHAPTER ${String(current + 1).padStart(2, '0')} · PREVIEW`;
  document.getElementById('lesson-intro').textContent = previewChapters[current].intro;
  document.getElementById('classroom-progress').value = completed.size;
  document.getElementById('classroom-progress-label').textContent = `${completed.size} of 5 preview chapters explored`;
  const assessment = current === 4;
  document.getElementById('material-title').textContent = assessment ? 'Your assessment' : 'Your chapter materials';
  document.getElementById('material-copy').textContent = assessment
    ? 'MJ’s final questions and practical brief will be based on her workbook. This preview does not include a real exam, score or certificate.'
    : 'MJ’s workbook pages, lesson video and chapter activities will appear here.';
  document.getElementById('material-tag-one').textContent = assessment ? 'Theory exam · coming soon' : 'Workbook · coming soon';
  document.getElementById('material-tag-two').textContent = assessment ? 'Practical assessment · coming soon' : 'Video · coming soon';
  next.textContent = assessment ? 'Finish classroom preview' : 'Preview next chapter →';
  next.hidden = completed.size === 5 && assessment;
  reset.hidden = completed.size === 0;
  document.getElementById('preview-finished').hidden = completed.size !== 5;
  document.getElementById('lesson-hint').textContent = completed.size === 5
    ? 'You can revisit any preview chapter or restart.'
    : assessment ? 'Finish the sample flow to see the preview completion state.' : 'Explore this sample chapter to unlock the next one in the preview.';
  if (focus) title.focus({ preventScroll: true });
}
next.addEventListener('click', () => {
  completed.add(current);
  if (current < 4) { current++; unlocked = Math.max(unlocked, current); }
  renderPreview(true);
  if (matchMedia('(max-width:640px)').matches) title.scrollIntoView({ behavior: 'instant', block: 'start' });
});
for (const button of chapterButtons) button.addEventListener('click', () => {
  const requested = Number(button.dataset.chapter);
  if (requested > unlocked) return;
  current = requested;
  renderPreview(true);
});
reset.addEventListener('click', () => {
  completed.clear(); current = 0; unlocked = 0; renderPreview(true);
});
renderPreview();
