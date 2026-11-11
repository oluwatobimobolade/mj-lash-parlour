/* Public checkout settings only. Never put Stripe secret keys here.
 * Add owner-confirmed price labels and HTTPS hosted Stripe links when supplied.
 * Setting confirmed=true is a deliberate activation, after testing the offer.
 * Payment redirects never grant course access, points or discount codes.
 */
const mjOffers = {
  'one-day': { url: null, priceLabel: null, confirmed: false },
  'two-day': { url: null, priceLabel: null, confirmed: false },
  'three-day': { url: null, priceLabel: null, confirmed: false },
  mentorship: { url: null, priceLabel: null, durationLabel: null, confirmed: false },
};
for (const [key, offer] of Object.entries(mjOffers)) {
  if (offer.priceLabel) {
    for (const label of document.querySelectorAll(`[data-price="${key}"]`)) label.textContent = offer.priceLabel;
  }
  if (key === 'mentorship' && offer.durationLabel) {
    const duration = document.querySelector('[data-detail="mentorship-duration"]');
    if (duration) duration.textContent = offer.durationLabel;
  }
  if (!offer.confirmed || !offer.url) continue;
  let url;
  try { url = new URL(offer.url); } catch { continue; }
  if (url.protocol !== 'https:' || !['buy.stripe.com', 'checkout.stripe.com'].includes(url.hostname) || url.username || url.password || url.pathname === '/') continue;
  for (const link of document.querySelectorAll(`[data-payment="${key}"]`)) {
    link.href = url.href;
    link.removeAttribute('aria-disabled');
    link.removeAttribute('role');
    link.textContent = key === 'mentorship' ? 'Pay for your confirmed session' : 'Pay after confirming with MJ';
  }
}
