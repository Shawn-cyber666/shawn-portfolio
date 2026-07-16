# Design QA

## Visual truth

- Selected concept: `.codex-audit/18-selected-neptune-index.png`
- Desktop implementation: `.codex-audit/19-index-desktop.png`
- Side-by-side comparison: `.codex-audit/20-source-vs-index-desktop.png`
- Mobile hero: `.codex-audit/31-mobile-hero-framed.png`
- Work section: `.codex-audit/22-work-desktop-settled.png`
- Experience section: `.codex-audit/23-experience-desktop.png`
- Thinking section: `.codex-audit/25-thinking-desktop-settled.png`
- Desktop viewport: 1440 x 1024; captured page area 1425 x 1013
- Mobile viewport: 390 x 844
- State: loader dismissed, hero idle, default experience selected

The first viewport is the full hero composition, so the full side-by-side image is also the focused comparison for the rail, headline, Neptune crop, CTA, and selected-work strip.

## Comparison history

1. First pass matched the selected concept's fixed left index, dark editorial field, lower-left statement, cropped right-side planet, and bottom work strip.
2. The planet asset was replaced with a purpose-built 1672 x 941 Neptune image so the surface reads as a physical world rather than CSS art, particles, or a video in a box.
3. Decorative particles, HUD labels, glass cards, cursor chrome, and repeated rounded controls were removed to restore negative space and hierarchy.
4. Mobile project media initially inherited tall image proportions. It was fixed to stable 260px media height at 390px, reducing the first project from about 1161px to 683px without removing content.
5. Chapter highlighting initially depended on IntersectionObserver callback order. It now calculates the active section from a stable viewport anchor and passed direct jumps to Work, Experience, and Thinking.

## Findings

- P0: none.
- P1: none.
- P2: none after fixes. No text overlap, horizontal overflow, missing logo, broken image, unreadable contrast, or blocked primary action remains.
- Typography: heading scale, line height, weight, and Chinese wrapping were checked at desktop and 390px mobile.
- Spacing: left rail width, hero content offset, bottom work strip, project rows, and mobile media dimensions use stable constraints.
- Assets: hero, project images, photography, and all five organization logos load with non-zero natural dimensions.
- Interaction: hero pointer parallax, mobile menu open/close, mobile Work jump, experience switching, and chapter highlighting were exercised in the browser.
- Accessibility: semantic headings, labelled regions, keyboard-focus styles, `aria-current`, `aria-pressed`, menu state attributes, and reduced-motion behavior are present.
- Console: no page warnings or errors in the final local build.

final result: passed
