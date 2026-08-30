# Design QA — Product Marketing Portfolio

## Target and implementation

- Visual target: `design/home-final-direction.png`
- Desktop implementation evidence: `design/implementation-home-desktop.jpg`
- Combined comparison: `design/qa-home-comparison.jpg`
- Core implementation: Apple-like hierarchy, restrained near-black palette, icy cyan accent, real project imagery, editorial case rows.

## Desktop checks

- Homepage checked at 1440px and 1280px-class desktop widths in the in-app browser.
- vivo X Fold6 Case checked at desktop width, including public-source caption and first Case section.
- Header navigation, homepage Case link, Case route, anchor structure, reveal behavior and reading progress work.
- Browser console returned no warnings or errors.
- Homepage exposes positioning, primary work, Resume and Contact in the first reading path; Selected Work begins immediately after the first viewport.

## Responsive implementation review

- Breakpoints cover desktop, tablet, 820px and 560px mobile widths.
- Mobile navigation uses a semantic button with `aria-expanded`, Escape close and 42px touch target.
- Case tables convert to labeled vertical rows below 560px.
- Case side navigation is removed below 820px; content becomes a single readable column.
- Buttons wrap, images retain aspect ratio, titles use fluid type and long Case names allow wrapping.
- Reduced-motion mode disables reveal movement.

## Accessibility

- Skip link, semantic landmarks, logical heading hierarchy, alt text and visible focus-capable controls are present.
- Links use real destinations; external links use safe target attributes.
- Color contrast uses white / muted gray on near-black, with cyan reserved for emphasis.

## Content and confidentiality

- vivo Case only uses official public imagery, public-safe role description and redrawn frameworks.
- No sales, GMV, exposure, conversion or invented research metrics appear.
- Insta360 work is labeled as a recruitment assessment, not employment or a client project.
- 造浪局 descriptions match the audited live interface and do not claim unverified efficiency results.

## Findings and resolution

- [Resolved P1] Initial hero height delayed the Selected Work section. Reduced the hero minimum height and first-section padding so recruiters reach evidence sooner.
- [Resolved P1] The first OG image reflected the design target instead of the implementation. Replaced it with the final homepage capture.
- [Resolved P1] PDF fallback fonts rendered Chinese and arrow glyphs as squares. Switched those elements to an embedded Unicode font and re-rendered.
- [P3] The current automated browser surface did not expose a true 390px viewport. Mobile behavior was reviewed through CSS breakpoints and DOM structure; a final physical iPhone Safari smoke test is recommended after deployment.
- [P3] A connected Chrome automation surface was unavailable in this environment. The implementation uses standards-safe HTML/CSS/JS and was checked in the in-app browser; a deployed Chrome smoke test remains recommended.

## Final status

No open P0, P1 or P2 findings remain in the verified desktop implementation or rendered PDFs.

final result: passed
