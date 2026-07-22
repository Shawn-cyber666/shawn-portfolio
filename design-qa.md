# Design QA — Orbital Signal Portfolio

## Comparison Target

- Source visual truth: `C:\Users\Administrator\.codex\generated_images\019f897b-cf76-7b72-8d3a-4bc7b7eee45b\exec-ac2f5081-44fb-435f-8428-392eb518b1cd.png`
- Implementation screenshot: `.codex-audit/86-orbital-final-webp.png`
- Final full-view comparison: `.codex-audit/87-source-vs-final-webp.png`
- Source pixels: `1487 × 1058`
- Implementation pixels: `1425 × 1013`
- CSS viewport: `1440 × 1024`
- Device pixel ratio: `1`
- Density normalization: the source was downsampled to `1425 × 1013`; the implementation was captured at its native `1425 × 1013` browser content area. The normalized panels were placed side by side in the full-view comparison.
- State: desktop hero, loader complete, page at `#about`, no hover or focus state.

## Evidence

### Full-view comparison

`.codex-audit/87-source-vs-final-webp.png` places the source on the left and the final implementation on the right. The final frame preserves the selected direction's asymmetric layout, headline scale, centered Neptune signal core, sparse orbital calibration, right-side product beacon, top navigation, and bottom coordinate rail.

### Focused comparison

A separate crop was not needed. The single-screen source and both normalized panels remain large enough in the `2850 × 1013` comparison to read the headline, navigation, CTA, product beacon, orbital ticks, signal node, and bottom coordinate labels without losing context.

### Additional rendered evidence

- Product section: `.codex-audit/78-orbital-product-section.png`
- Experience selected state: `.codex-audit/80-orbital-experience-cuhk-settled.png`
- Mobile hero: `.codex-audit/81-orbital-mobile-hero.png`
- Mobile menu open: `.codex-audit/82-orbital-mobile-menu.png`
- Mobile product section: `.codex-audit/84-orbital-mobile-product.png`

## Comparison History

### Pass 1 — blocked

- [P1] Asset edge created a visible vertical seam across the hero.
  - Evidence: `.codex-audit/76-source-vs-implementation-pass1.png` showed the square edge of the orbital raster at the left side of the planet composition.
  - Fix: matched the page background token to the raster's sampled edge color (`#000105`) and increased the low-opacity star field across the whole hero.
- [P1] Neptune was oversized and the product beacon overlapped the sphere.
  - Evidence: pass 1 showed a roughly 20% larger planet than the source and reduced beacon readability.
  - Fix: reduced the hero asset from `1120px` to `970px`, shifted it to `left: 32%`, and moved the product beacon farther right with a narrower measure.

### Pass 2 — passed

- Post-fix evidence: `.codex-audit/83-source-vs-implementation-pass2.png` shows the seam removed, the planet diameter and center aligned to the source, and the product beacon restored to a clear position outside the sphere.
- No actionable P0, P1, or P2 differences remain.

### Pass 3 — passed after asset optimization

- The 1.47 MB source PNG was converted to a 100 KB WebP for faster delivery with no visible composition change.
- Post-optimization evidence: `.codex-audit/87-source-vs-final-webp.png`; the browser reported a complete `1254 × 1254` asset, no overflow, and no console errors.

## Required Fidelity Surfaces

### Fonts and typography

- `Geist` and `Noto Sans SC` provide the same contemporary grotesk character as the source, with system fallbacks for resilience.
- Display scale, optical weight, line height, letter spacing, and two-line Chinese hierarchy closely match the source.
- Small uppercase labels remain legible without competing with the hero.

### Spacing and layout rhythm

- Hero copy, planet center, product beacon, navigation, and coordinate rail match the source hierarchy at `1440 × 1024`.
- Product, experience, and contact sections use the same hairline rhythm and generous negative space.
- Desktop and `390 × 844` mobile captures show no horizontal overflow or clipped controls.

### Colors and visual tokens

- Near-black, cobalt, ice blue, silver, and white are mapped through shared CSS tokens.
- Cyan is reserved for active signals, status, and primary hierarchy; contrast remains strong on the dark field.
- No purple/magenta gradient or generic glass-dashboard treatment was introduced.

### Image quality and asset fidelity

- The hero uses a dedicated generated raster asset derived from the selected reference: `assets/neptune-orbital-core.webp`.
- The asset is sharp at desktop size, blends into the page background without a visible edge, and includes the planet, orbital rings, calibration ticks, signal node, and beam as real imagery.
- No inline SVG, handcrafted SVG, CSS illustration, placeholder box, or div-art substitute is used for the Neptune visual.
- Experience logos and the secondary Neptune image reuse supplied source assets.

### Copy and content

- The hero retains “第八轨道” and “把判断变成系统。”
- “造浪局” is the only product presented. The former product entries are absent from the main page.
- Product metrics and the live URL match the requested product: `7 AI 员工 · 13 工作流` and `shrimp-company.vercel.app`.
- Experience entries remain clearly framed as career history, not additional products.

### Icons and controls

- Phosphor Icons supplies the arrow, menu, workflow, and contact glyphs with consistent stroke style.
- CTAs, nav links, experience buttons, and the mobile menu have visible hover/focus/selected states.

### Accessibility and behavior

- Semantic regions, headings, alt text, skip link, `aria-pressed`, menu expanded/hidden state, and reduced-motion handling are present.
- Tested interactions: desktop section navigation, mobile menu open/close and product navigation, experience detail switching, and product CTA destination.
- Primary product URL is `https://shrimp-company.vercel.app/` with safe external-link attributes.
- Browser console warnings/errors checked: none.

## Follow-up Polish

- [P3] The coded version retains one short personal-introduction paragraph that the visual source omits. This is intentional so the personal homepage communicates context without requiring a second screen.
- [P3] The source includes a very faint horizontal connector from the headline to the orbit node; the implementation relies on the signal beam inside the raster asset to keep the responsive layout simpler.

## Implementation Checklist

- [x] Only one product remains: 造浪局.
- [x] Desktop hero matches the selected orbital-signal direction.
- [x] Desktop navigation and experience interaction work.
- [x] Mobile layout and menu work without horizontal overflow.
- [x] Product CTA points to the live product.
- [x] Console is clean.
- [x] No P0/P1/P2 visual findings remain.

final result: passed
