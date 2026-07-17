# Design QA

## Visual truth

- Selected concept: `.codex-audit/18-selected-neptune-index.png`
- Desktop implementation: `.codex-audit/19-index-desktop.png`
- Side-by-side comparison: `.codex-audit/20-source-vs-index-desktop.png`
- Mobile hero: `.codex-audit/31-mobile-hero-framed.png`
- Work section: `.codex-audit/22-work-desktop-settled.png`
- Experience section: `.codex-audit/23-experience-desktop.png`
- Thinking section: `.codex-audit/25-thinking-desktop-settled.png`
- Companion work state: `.codex-audit/33-companion-work.png`
- Companion experience state: `.codex-audit/34-companion-experience.png`
- Companion thinking state: `.codex-audit/35-companion-thinking.png`
- Companion contact state: `.codex-audit/36-companion-contact.png`
- Companion before/after comparison: `.codex-audit/37-before-after-companion.png`
- Current mobile hero: `.codex-audit/41-mobile-companion-hero.png`
- Current mobile menu: `.codex-audit/42-mobile-menu.png`
- Current mobile work state: `.codex-audit/43-mobile-work-companion.png`
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
6. Neptune now persists after the hero as a transparent photographic companion layer. Work, Experience, Thinking, and Contact each use a distinct crop, scale, opacity, and tonal state while preserving the selected editorial layout.
7. The companion is loaded after the hero becomes usable, animates only transform/opacity/filter, and disables pointer-driven motion under `prefers-reduced-motion`.

## Findings

- P0: none.
- P1: none.
- P2: none after fixes. No text overlap, horizontal overflow, missing logo, broken image, unreadable contrast, or blocked primary action remains.
- Typography: heading scale, line height, weight, and Chinese wrapping were checked at desktop and 390px mobile.
- Spacing: left rail width, hero content offset, bottom work strip, project rows, and mobile media dimensions use stable constraints.
- Assets: hero, project images, photography, and all five organization logos load with non-zero natural dimensions.
- Interaction: hero pointer parallax, full-page Neptune scroll states, document-level pointer response, project proximity response, mobile menu open/close, mobile Work jump, experience switching with Neptune signal feedback, and chapter highlighting were exercised in the browser.
- Performance: the companion asset is a 760 x 784 transparent PNG loaded during idle time; no canvas loop, particle engine, WebGL runtime, or new dependency was introduced.
- Accessibility: semantic headings, labelled regions, keyboard-focus styles, `aria-current`, `aria-pressed`, menu state attributes, and reduced-motion behavior are present.
- Console: no page warnings or errors in the final local build.

final result: passed

