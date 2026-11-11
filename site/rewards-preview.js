// Illustrative calculator only: no account, earned balance, storage or redemption.
const visits = document.getElementById('reward-visits');
const count = document.getElementById('visits-count');
const points = document.getElementById('points-count');
const progress = document.getElementById('points-progress');
const message = document.getElementById('reward-message');
document.querySelector('.rewards-demo').hidden = false;
visits.addEventListener('input', () => {
  const total = 50 + Number(visits.value) * 50;
  count.value = visits.value;
  points.value = String(total);
  progress.value = total;
  message.textContent = total < 500
    ? `${500 - total} points to the first example milestone.`
    : total < 1000
      ? `First example milestone reached. ${1000 - total} points to the VIP example.`
      : 'Both example milestones reached.';
});
