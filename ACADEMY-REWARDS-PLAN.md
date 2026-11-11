# MJ Academy, mentorship and rewards

Updated 11 November 2026. This is an implementation handoff, not published programme terms.

## What is built

The existing static site now has separate Academy, Online Academy, Mentorship, Rewards and Classroom Preview pages. The homepage design remains the baseline; the accent is slightly pinker. The header uses the actual logo currently published on MJ’s shop. The source is recorded in IMAGE-SOURCES.md.

In-person training has one-, two- and three-day options and a clear **DM MJ before booking** instruction. The user explicitly requested placeholders for Stripe links. Prices, mentorship duration and all four checkout links are therefore unset, with a working Instagram enquiry route. No date is reserved or payment taken by these pages.

The online classroom demonstrates five ordered chapters, locked future chapters, review of earlier chapters and an assessment placeholder. It does not contain the actual e-book, videos, graded exam, account system or course access controls. Preview progress stays in memory and resets on reload. No shared password or fake login is collected.

Rewards has an explicitly labelled example calculator: 50 welcome points + 50 per completed, paid appointment, with sample 500/1,000 thresholds. It cannot create an account, award points, redeem anything or issue a coupon. These are **proposed mechanics**, not approved benefits.

## Research and decisions

| Pattern observed | Application to MJ |
| --- | --- |
| Teachable supports lesson order and separate video/graded quiz requirements. Completed lessons can be revisited. | Use a clear ordered course, revisit completed work, distinguish lesson completion from passing an exam. Do not invent teaching or pass marks. [Official course compliance documentation](https://support.teachable.com/en/articles/11682463-course-compliance). |
| Stripe Payment Links emit payment events and support post-payment redirects. Delayed methods need additional success handling. | Reuse MJ’s hosted Stripe checkout. Grant access or discounts only after verified paid status, never just because a visitor reaches a success page. [Stripe post-payment guide](https://docs.stripe.com/payment-links/post-payment), [fulfilment guide](https://docs.stripe.com/checkout/fulfillment). |
| Smile generates rewards in the actual commerce platform and records whether a reward is generated, used or cancelled. | A future kit code must exist in Shopify if it is redeemed in Shopify. A Stripe code cannot automatically discount a Shopify kit or an Acuity appointment. Record issuance and redemption. [Smile reward issuing](https://help.smile.io/en/articles/4036256-understand-reward-issuing). |
| Acuity has signed appointment-change webhooks, including cancellations, and some events overlap. | Retrieve and verify the appointment. Deduplicate by source ID. Booking creation does not prove attendance or final payment. [Acuity webhooks](https://developers.acuityscheduling.com/docs/webhooks). |

My recommendation is to start rewards with a modest, fixed-value credit or a defined add-on, rather than an unrestricted 50% discount. Work out its margin cost before confirming the 500/1,000 benefits. Limit welcome points to one verified account, award visit points only after completed eligible appointments, and reverse credits for refunded or voided events. Keep games separate from financial points.

## Cheapest sensible delivery sequence

1. Keep the current Cloudflare static site, Acuity bookings, Shopify shop and hosted Stripe payments. This update adds no new subscription. No platform purchase or trial was started.
2. Add owner-confirmed Payment Links in `site/commerce-links.js`; enter the exact price/duration labels, then deliberately set `confirmed: true`. Verify each offer in Stripe before enabling it. Confirm the date by DM first. A link can sell a deposit or full price: label it accurately after the owner chooses.
3. Once MJ supplies the e-book and video plan, choose the student backend using actual student numbers, video minutes, tutor workload and budget. Reusing this frontend avoids a visual rebuild. Managed LMS pricing and plan-specific sequential-learning controls must be compared at that point. A custom build can avoid an LMS subscription but adds ongoing authentication, storage, admin and maintenance responsibilities.
4. Begin with owner-invited individual student accounts, each student setting their own password or using a personal magic link. Use a managed identity provider. MJ can approve enrolment; students should not share an academy password.
5. Implement paid entitlements, protected lesson delivery and progress before offering online enrolment. Add rewards after appointment reconciliation is reliable.

Cloudflare documents free static asset requests for Workers Static Assets; dynamic requests and other services have separate limits and billing. The current release remains on the existing Pages project. Do not infer a free secure LMS or free video delivery from free public-page hosting. [Cloudflare billing and limitations](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).

## Required live-course integration

- Map each Stripe Payment Link / Price ID to the correct offer. Verify webhook signatures and server-retrieve the Checkout Session. Grant an entitlement only for the expected offer, currency, amount and paid status. Handle asynchronous success, refunds, disputes and duplicate/replayed events. Store event and purchase IDs with unique constraints.
- Bind access to a verified student identity. A paid browser redirect alone cannot prove identity or payment. If the buyer uses a different email, provide an owner-reviewed recovery route.
- Version the course and MJ-approved content. Check the student’s entitlement and chapter prerequisites on **every server lesson/media request**, including direct URLs. Keep protected workbook/video files outside this public static bundle. Use short-lived media access as appropriate.
- Store lesson progress, quiz attempts, server-graded results and tutor-reviewed practical work separately. MJ must provide question content, pass mark, retake rules and practical/certification conditions. Completion of this UI preview is not qualification.
- After a verified eligible course payment, issue a unique, limited-use kit discount in the platform selling the kit. Confirm the rate, products, minimum spend, expiry and stacking rules first. Save issuance status; retry safely without issuing duplicates. Do not add a reusable public coupon to the success page.
- Use an append-only rewards ledger for earned, redeemed, expired and reversed entries. Require a verified account, unique source appointment, completed/paid evidence and explicit redemption rules. Establish owner tools for no-shows, refunds and corrections. Acuity webhook creation alone is insufficient attendance evidence.

## Owner inputs to add later

- The four Stripe links, exact prices, whether each collects a deposit or the whole fee, mentorship length, course dates/inclusions and payment/cancellation terms.
- MJ’s e-book, chapter order, workbook, videos, exam questions, pass mark, practical brief and any verified certification wording.
- Rewards economics: approved earn rates, 500/1,000 benefits, exclusions, expiry, minimum spend and liability cap.
- An alternative logo file if MJ wants a different mark from the one on the current shop.

## Existing catalogue check

Acuity’s public scheduler was checked on 11 November 2026. It listed Fast track course £360 (360 minutes), 2 day training course £500 (360-minute appointment record), and Upgrade lash course £350 (360 minutes). It requests DM contact and refers to a £100 deposit. A three-day price and new mentorship terms were not verified. These records have not been automatically mapped into the new offers; the user asked to leave payment placeholders. [MJ scheduler](https://mjlashparlour.as.me/schedule/6bdb09c7).
