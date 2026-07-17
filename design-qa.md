# Design QA

## Visual truth

- Selected concept: `C:\Users\Administrator\.codex\generated_images\019f2c62-b673-7e11-aa4b-2c5db52e542b\exec-61a40860-a246-4b4f-9cf9-a099214eee21.png`
- Final desktop implementation: `.codex-audit/71-field-final-intensity.png`
- Final source/implementation comparison: `.codex-audit/72-source-vs-final.png`
- Final mobile implementation: `.codex-audit/73-field-final-mobile.png`
- Loader state: `.codex-audit/54-field-loader-v2.png`
- Work state: `.codex-audit/57-field-work.png`
- Experience default state: `.codex-audit/58-field-experience.png`
- Experience switched state: `.codex-audit/62-field-experience-cuhk.png`
- Thinking state: `.codex-audit/59-field-thinking.png`
- Contact state: `.codex-audit/61-field-contact-v2.png`
- Mobile menu state: `.codex-audit/56-field-mobile-menu.png`
- Browser viewport override: 1440 x 900 desktop and 390 x 844 mobile
- Captured desktop page area: 1425 x 891
- State: loader dismissed, hero active, pointer positioned between title and Neptune

The full first viewport is also the focused comparison for the core visual relationship: title, Neptune crop, particle currents, local vortex, left rail, and selected-work strip. Those details are readable at original resolution, so an additional crop was not required.

## Comparison history

1. The first pass placed the two magnetic currents too close to the viewport edges and made the local vortex nearly invisible (`45-field-desktop.png`).
2. The flow attachment angles and guide currents were moved into the visible composition, and text-safe particle suppression was narrowed to the actual copy bounds (`46-field-desktop-v2.png`, `48-field-vortex.png`).
3. A separate microscopic dust pass and directed rim-shedding pass were added so the field reads as matter leaving Neptune rather than decorative dotted lines (`52-field-rim.png`).
4. The entry state was rebuilt as a restrained galaxy field. Its stacking was separated from the mobile menu state so the canvas cannot cover navigation (`54-field-loader-v2.png`, `56-field-mobile-menu.png`).
5. Full-page orbit states were checked. The particle color and intensity now adapt to Work, Experience, Thinking, and Contact while the photographic Neptune companion stays behind content (`57-field-work.png` through `61-field-contact-v2.png`).
6. The Contact section was increased to a full viewport so direct navigation no longer exposes a white strip from the previous section (`61-field-contact-v2.png`).
7. The hero planet center and radius were calibrated from the rendered image edge. Particle density, field width, and the cursor vortex were then refined against the combined source/implementation comparison (`72-source-vs-final.png`).

## Findings

- P0: none.
- P1: none.
- P2: none after fixes.
- P3: the selected concept image uses denser, more cinematic particle ribbons. The implementation intentionally keeps more negative space and preserves the existing title position and current Neptune crop. This is an accepted production trade-off for readability and rendering cost, not a missing behavior.

## Required fidelity surfaces

- Fonts and typography: Geist and the existing Chinese system fallbacks are preserved. Heading weight, line height, letter spacing, wrapping, and antialiasing were checked at desktop and 390px mobile. No text overlap or clipping remains.
- Spacing and layout rhythm: the fixed rail, hero copy, Neptune crop, bottom project strip, section headers, project rows, and full-height Contact section retain stable dimensions. Desktop and mobile show no horizontal overflow.
- Colors and visual tokens: the implementation retains the deep navy, ice cyan, silver, and white system. The canvas switches to restrained deep blue over the light Thinking chapter and returns to additive ice light over dark chapters.
- Image quality and asset fidelity: the supplied photographic Neptune assets remain the visual source. The particle field is layered around the real rim rather than replacing it with CSS art, SVG approximation, or a boxed video. Project imagery, photography, and all organization logos load with valid dimensions.
- Copy and content: all existing Chinese and English copy, project names, experience entries, links, email, and organization names remain unchanged.

## Interaction and accessibility

- Pointer movement bends nearby particles and relocates the local vortex; pointer press adds a short field pulse.
- Scroll position updates the Neptune companion and particle field for every major chapter.
- Experience selection updates title, copy, logo, pressed state, and emits a Neptune signal pulse.
- Mobile menu open/close, navigation links, and keyboard focus states remain usable.
- `prefers-reduced-motion` disables the particle canvas and preserves the static content experience.
- Canvas resolution is capped, desktop rendering is frame-throttled, mobile/low-power particle counts are reduced, animation pauses in hidden tabs, and resize work is debounced.
- Browser console: no warnings or errors in the final local build.
- Images: no broken loaded images were found.
- Overflow: none at 1440 x 900 or 390 x 844.

## Follow-up polish

- If a future version prioritizes spectacle over efficiency, the desktop-only field can gain a fourth broad current or WebGL point sprites. The current Canvas version is the recommended production balance.

final result: passed

