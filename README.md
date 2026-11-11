# MJ Lash Parlour · Phase 1

Open `site/index.html` from Finder in a browser. The page, images, typography and portfolio carousel work locally. Booking buttons open the lash-set page, which links to the live Acuity scheduler. The shop link opens the existing Shopify storefront.

To serve the same files over HTTP, run this command and open `http://127.0.0.1:8764/`.

```sh
ruby -run -e httpd /Users/tobimobolade/output/mj-lash-parlour/site -b 127.0.0.1 -p 8764
```

## What the first release should do

Give clients a place to see MJ’s work, choose a lash set, book through Acuity, and explore training. Academy, Online Academy, Mentorship, Rewards and a classroom preview now have separate pages.

The 144-page PRD V3 remains reference material. The user’s latest instructions govern this phase: retain the approved homepage design, distinguish in-person and online education, add mentorship, and use payment placeholders. Live student accounts, protected teaching, exams, reward balances and automated fulfilment are not configured yet.

## Homepage

Use the approved “Lashes by MJ” homepage as the design baseline for Booking and Academy. Reuse the existing Cormorant and Instrument Serif headings, Jakarta body type, blush and wine palette, photography, buttons and icons. Keep the opening copy short and put details where clients choose a treatment or course. The desktop and mobile references are in `previews/quiet-homepage.png` and `previews/quiet-homepage-mobile.png`.

The active homepage follows the blush reference. It opens with a four-image campaign carousel and a seven-link shortcut bar. The three feature cards lead to Signature Looks, MJ Academy and Beauty Essentials. The original Treatments & availability, One-to-one lash training, and Kits & lash essentials cards sit below Real Results. The portfolio opens details for the featured sets and includes the lookbook film and Lash Arc.

MJ Games opens Look Match, a local lash style chooser. Special Offers links to MJ’s Shopify store. Rewards & VIP opens a clearly labelled programme preview. The Academy laptop leads to the Academy pages and classroom concept.

The previous burgundy homepage is in `revisions/burgundy-restored/`. Its shareable PDF is at `/Users/tobimobolade/output/pdf/MJ-Lash-Parlour-Homepage.pdf`. The snapshots use the shared `site/assets` directory.

## Booking

The booking page is `site/booking.html`. Eight featured sets show a client photo, price and duration. Each set opens a short description and a direct link to its Acuity calendar. The catalogue still links to Acuity if JavaScript is unavailable. Infills, brows, facials and the remaining lash sets are available through the scheduler links.

Prices and durations were checked against MJ’s Acuity listings on 10 November 2026. The page shows Acuity’s listed £70 for Wispy Diva and notes the £65 option mentioned in its description. Recheck the listings before publishing or updating prices.

## Wi-Fi preview

The preview is available at `http://192.168.0.108:8764/` while this Mac is awake and connected to the same Wi-Fi. The server binds only to the Mac’s Wi-Fi IPv4 address and serves the `site` directory. If the address changes or the server stops, run:

```sh
ruby -run -e httpd /Users/tobimobolade/output/mj-lash-parlour/site -b "$(ipconfig getifaddr en0)" -p 8764
```

## What I verified

- MJ’s public Linktree leads to the hosted Acuity scheduler, Shopify, mentorship and other destinations. The new homepage can give clients a clear first step.
- Acuity lists 15 lash sets and 15 named lash infills. On 10 November 2026, browser checks reached the Date & Time step for Moonlight, Wispy Diva, Kat I and the MJ Signature Set, and reached the Lash sets, Lash infills, Brows and Facials groups. These checks ended at the public scheduler.
- The generic Infills listing shows £25 while its description gives a different pricing formula. Some individual infills also disagree with their descriptions. The American Angel infill lists £0 in the public catalogue and describes £50 and £55 tiers. Fix the actual appointment types and policies in Acuity before relying on them in customer-facing copy.
- Images are sourced from the public Acuity appointment listings for Moonlight, Wispy Diva, Kat I and the MJ Signature Set. Set notes paraphrase those listings. The header now uses MJ’s actual published shop logo, with its original black background. Obtain MJ’s approval of image use, client permissions, notes and logo before publishing.
- The public Instagram feed, private account settings, provider bills and conversion data were outside the verified evidence.

## Cost and ownership

| Route | Additional platform cost | Practical trade-off |
| --- | --- | --- |
| Static site on Cloudflare Workers Static Assets | $0 for static asset hosting under the documented billing model. Add domain renewal if needed. | Keep the source portable and link out to Acuity for appointments and Shopify for purchases. Editing the lookbook initially means editing the site files. |
| Carrd Pro Standard | $19 per year plus domain renewal, if Carrd is the tool meant by “Curve”. | A visual editor for a simple brochure. Keeping this exact lookbook interaction and future route structure would take extra customisation. |
| An existing Shopify theme | Potentially $0 in additional subscription fees if MJ’s current plan already covers the required theme features. | An owner can manage the content with the shop, but the design and booking-led navigation depend on the current theme and plan. |

Cloudflare’s free-service terms restrict processing or collecting card information. The draft uses ordinary hosted links, and payments occur on the provider’s own website. Recurring Acuity and Shopify charges and any transaction fees are separate from the site budget.

## Before launch

1. Confirm the logo, studio/service-area details, contact route and consented images. Add two or three owner-written process notes and one matched before-and-after pair if available.
2. Confirm active services, the correct infill and deposit rules, prep and rescheduling language. Make the corrections in Acuity and verify a full test journey with the owner before directing clients to the site.
3. Confirm domain ownership and decide who will update the lookbook. Publish the approved page and test from the Instagram bio and an ordinary phone. The local prototype includes a noindex directive.

## Sources

- Supplied PRD V3, pp. 10–13 and 25–38 for the public experience, catalogue and portfolio. The academy requirements remain a separate workstream.
- [MJ’s Linktree](https://linktr.ee/Mjlashparlour) · [Acuity scheduler](https://mjlashparlour.as.me/schedule/6bdb09c7) · [Shopify storefront](https://mjlashparlour.myshopify.com/)
- [Acuity scheduling links](https://help.acuityscheduling.com/hc/en-us/articles/16676933640461-Find-direct-links-to-specific-scheduling-pages)
- [Cloudflare static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) · [Cloudflare terms](https://www.cloudflare.com/terms/) · [Cloudflare Registrar](https://www.cloudflare.com/domains/)
- [Carrd plans](https://carrd.com/pro)

## Academy update — 11 November 2026

- `site/academy.html`: one-, two- and three-day in-person options, with DM-before-booking and payment placeholders.
- `site/online-academy.html`: planned course outline and student-access information.
- `site/classroom.html`: interactive, explicitly labelled five-chapter preview; no saved student progress, teaching content, grades or login.
- `site/mentorship.html`: a dedicated online-call page, with price, duration and payment awaiting owner details.
- `site/rewards.html`: proposed reward experience and example calculator; no financial points or discount issuance.
- `site/commerce-links.js`: four unset checkout configurations. Only confirmed, HTTPS hosted Stripe URLs can activate the buttons. No secrets belong in this file.

Research, cost choices and the production integration requirements are in [ACADEMY-REWARDS-PLAN.md](ACADEMY-REWARDS-PLAN.md). The booking scheduler and Shopify remain external provider systems; linking to them does not create a customer/account integration.

`python3 scripts/package-preview.py` creates `mj-academy-cloudflare.zip` with public files only. It excludes the private handoff, old revisions and unused original photographs. The previous homepage-only ZIP is preserved. Public preview pages remain noindex.

Validation: all seven main routes passed at 1440, 390 and 320 pixels, with no horizontal page overflow, broken image requests or browser exceptions. Chapter locking/review/reset, preview-only state, rewards thresholds, inactive payment placeholders, homepage hero/search and booking deep links passed. The automated axe WCAG A/AA pass found no violations on these routes; this is not a full accessibility certification.
