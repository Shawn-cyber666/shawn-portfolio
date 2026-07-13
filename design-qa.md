# Design QA

## Source and build

- Motion reference: `codex-clipboard-c3296e3a-0ad6-484d-bf3b-4017dcdc270c.png`
- Neptune material reference: `codex-clipboard-d497be99-6081-4d61-9995-7a33d97c6a24.png`
- Final desktop capture: `.codex-audit/11-final-hero-desktop.png`
- Final mobile capture: `.codex-audit/08-new-hero-mobile.png`
- Combined comparison: `.codex-audit/12-reference-vs-final.png`
- Desktop viewport: 2560 x 1257
- Mobile viewport: 390 x 844
- State: loader complete, hero idle, navigation visible

## Comparison history

1. The previous canvas sphere and dense dot field read as a synthetic demo rather than a premium brand world.
2. The sphere was replaced with an image-led Neptune horizon, using the reference's large-scale central object, deep blue light, and lower-third editorial composition.
3. The cursor ring was removed after the first comparison. Dot particles were reduced to sparse directional light trails that bend near the pointer.
4. Project cards were changed into editorial rows, and the mobile hero, menu, project entry, and timeline states were checked in the browser.

## Findings

- P0: none.
- P1: none.
- P2: none. No text overlap, horizontal overflow, blocked CTA, broken mobile menu, or failed timeline state was found.
- P3: a future WebGL material pass could add live cloud rotation, but it is not required for the current visual or interaction quality.

## Final result

Passed. The implementation matches the reference's cinematic scale and chapter-led hierarchy while remaining an original Neptune identity.
