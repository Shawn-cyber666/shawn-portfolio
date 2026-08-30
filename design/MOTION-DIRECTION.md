# Motion & Interaction Direction

## Intent

Motion clarifies hierarchy and makes the portfolio feel authored. It must never delay access to work, reduce legibility, or turn the site into a showreel.

## Interaction grammar

- **Entrance:** sequenced opacity and vertical movement. The hero reads in the same order a recruiter scans it: role, point of view, explanation, actions, proof, visual.
- **Scroll:** one-time editorial reveals. No forced scrolling, scroll-jacking, or long pinned scenes.
- **Pointer:** small, bounded parallax on the orbital hero and work imagery; subtle magnetic response on primary controls.
- **Cases:** image masks and restrained media parallax support the content structure without changing reading order.
- **Navigation:** same-origin page transitions use the native View Transition API when available and fall back to normal navigation.

## Performance and accessibility

- Animate transforms and opacity only in high-frequency interactions.
- Disable pointer-specific behavior below tablet width and on coarse pointers.
- Respect `prefers-reduced-motion` and reveal all content immediately.
- Keep native scrolling and native link behavior.
- Pin GSAP and ScrollTrigger to version 3.15.0; retain an IntersectionObserver fallback if the CDN is unavailable.

## Visual boundary

No custom cursor, loading gate, animated background, gradient spectacle, autoplay audio, or decorative motion without informational value.
