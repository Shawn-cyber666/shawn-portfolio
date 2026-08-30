# Design QA — Premium Motion Upgrade

## Comparison target

- Source visual truth: `design/implementation-home-desktop.jpg`
- Browser-rendered implementation: `design/implementation-home-motion-desktop.png`
- Full-view comparison: `design/qa-home-motion-comparison.jpg`
- Source pixels: 1280 × 720
- Implementation pixels: 1280 × 720
- CSS viewport: 1280 × 720
- Device scale normalization: both compared at equal pixel dimensions; no density conversion required.
- State: homepage initial state after the entrance timeline settled.

The source is the previously verified implementation because this round intentionally preserves the selected visual direction and upgrades motion and interaction rather than replacing the design.

## Full-view comparison

- **Typography:** system display stack, optical weight, scale, line-height and two-line hero wrapping remain consistent with the verified source. The masked line entrance does not change the settled layout.
- **Spacing and layout rhythm:** header, two-column hero, CTA grouping, proof line and orbital image retain the same grid. The new one-pixel media boundary is restrained and does not change the composition.
- **Colors and tokens:** near-black, white, muted gray and icy cyan tokens are unchanged. New hover surfaces use low-opacity existing surface colors; no gradient system was added.
- **Image quality:** the existing orbital artwork and real Case assets are reused at their intended crops. No placeholder, CSS drawing or generated substitute was introduced.
- **Copy:** all homepage, Case, disclosure and contact copy remains unchanged.

No actionable P0, P1 or P2 visual drift is visible in the combined comparison.

## Focused interaction evidence

- Desktop Case list settled state: `design/implementation-work-motion-desktop.png`
- Desktop Case hover state: `design/implementation-work-hover-desktop.png`
- vivo Case desktop state: `design/implementation-vivo-motion-desktop.png`
- Homepage mobile state: `design/implementation-home-motion-mobile.png`
- Work mobile state: `design/implementation-work-motion-mobile.png`
- vivo Case mobile state: `design/implementation-vivo-motion-mobile.png`
- Corrected mobile navigation state: `design/implementation-mobile-menu-fixed.png`

Focused evidence was required because hover feedback, mobile navigation and Case media treatment are not judgeable from the homepage comparison alone.

## Primary interactions tested

- Hero `View Selected Work` scrolls to the evidence section.
- Work navigation receives an active state at the section.
- The first Case row responds to pointer hover with a bounded media shift, copy movement and circular arrow state.
- The vivo X Fold6 Case opens successfully through the real Case link.
- Same-origin navigation receives a progressive View Transition where supported.
- The 390 × 844 mobile menu opens, fully covers the reading surface, links to Work, closes after selection and restores document scrolling.
- Mobile homepage, Work and vivo Case remain free of horizontal overflow at 390px.
- Reading progress, sticky Case table of contents and reveal fallbacks remain present.
- Browser console check returned no warnings or errors.

## Findings and iteration history

- [Resolved P2] Mobile navigation content overlapped the page instead of fully masking it.
  - Evidence: `design/implementation-mobile-menu.png`.
  - Cause: the header backdrop-filter created a containing context for the fixed child layer.
  - Fix: moved the menu to an absolute layer below the fixed header, gave it `100dvh`-based height and a solid background.
  - Post-fix evidence: `design/implementation-mobile-menu-fixed.png`.

No open P0, P1 or P2 findings remain.

## Follow-up polish

- [P3] A final physical iPhone Safari smoke test remains useful for hardware-specific animation smoothness, although the 390px in-app browser layout and interaction paths passed.

final result: passed
