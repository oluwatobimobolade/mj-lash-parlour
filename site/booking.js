const setDialog = document.querySelector('.set-dialog');
const setCards = [...document.querySelectorAll('.set-card')];

if (typeof setDialog.showModal === 'function') {
  const dialogPhoto = setDialog.querySelector('.set-dialog-photo');
  const dialogTitle = setDialog.querySelector('#set-title');
  const dialogFacts = setDialog.querySelector('.set-facts');
  const dialogDetails = setDialog.querySelector('#set-details');
  const availabilityLink = setDialog.querySelector('.set-availability');
  let selectedCard;

  function showSet(card) {
    const photo = card.querySelector('img');
    selectedCard = card;
    dialogPhoto.src = photo.src;
    dialogPhoto.alt = photo.alt;
    dialogPhoto.style.objectPosition = getComputedStyle(photo).objectPosition;
    dialogTitle.textContent = card.querySelector('h2').textContent;
    dialogFacts.textContent = card.querySelector('.set-facts').textContent;
    dialogDetails.textContent = card.dataset.description;
    availabilityLink.href = card.href;
    setDialog.showModal();
  }

  for (const card of setCards) {
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showSet(card);
    });
  }

  setDialog.addEventListener('close', () => selectedCard.focus());

  const linkedSet = setCards.find(card => `#${card.id}` === location.hash);
  if (linkedSet) showSet(linkedSet);
}
