const root = document.documentElement;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const progress = document.querySelector("[data-progress]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const closeMenu = () => {
  if (!menuButton || !mobileNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.querySelector("i")?.classList.replace("ph-x", "ph-list");
  mobileNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.querySelector("i")?.classList.toggle("ph-list", isOpen);
  menuButton.querySelector("i")?.classList.toggle("ph-x", !isOpen);
  mobileNav?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

let chromeFrame = 0;
const updateChrome = () => {
  chromeFrame = 0;
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
};

const requestChromeUpdate = () => {
  if (chromeFrame) return;
  chromeFrame = window.requestAnimationFrame(updateChrome);
};

window.addEventListener("scroll", requestChromeUpdate, { passive: true });
window.addEventListener("resize", requestChromeUpdate, { passive: true });
updateChrome();

const initFallbackReveals = () => {
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -7%", threshold: 0.08 });

  reveals.forEach((element) => observer.observe(element));
};

const initSectionNavigation = () => {
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll("[data-nav-link]")];
  if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      const section = link.dataset.navLink;
      link.classList.toggle("is-active", section === visible.target.id);
    });
  }, { rootMargin: "-28% 0px -62%", threshold: [0.01, 0.2, 0.5] });

  sections.forEach((section) => navObserver.observe(section));
};

const initCaseToc = () => {
  const tocLinks = [...document.querySelectorAll(".case-toc a")];
  if (!tocLinks.length || !("IntersectionObserver" in window)) return;

  const tocObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    tocLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  }, { rootMargin: "-20% 0px -65%", threshold: [0.01, 0.3] });

  document.querySelectorAll(".case-section").forEach((section) => tocObserver.observe(section));
};

const initGsapExperience = () => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger || reduceMotion) return false;

  gsap.registerPlugin(ScrollTrigger);
  root.classList.add("gsap-ready");

  const context = gsap.context(() => {
    const heroCopy = document.querySelector("[data-hero-copy]");
    const heroVisual = document.querySelector("[data-hero-visual]");
    const heroLines = document.querySelectorAll("[data-hero-title] .hero-title__line > span");
    const heroItems = document.querySelectorAll("[data-hero-item]");

    if (heroCopy && heroVisual) {
      gsap.set([heroCopy, heroVisual], { autoAlpha: 1, y: 0 });
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(heroCopy.querySelector(".eyebrow"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .7 }, 0)
        .fromTo(heroLines, { yPercent: 112, rotation: 1.2 }, { yPercent: 0, rotation: 0, duration: 1.08, stagger: .09 }, .08)
        .fromTo(heroItems, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .8, stagger: .09 }, .36)
        .fromTo(heroVisual, { autoAlpha: 0, scale: .965, clipPath: "inset(5% 5% 5% 5% round 18px)" }, { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 2px)", duration: 1.25 }, .16);
    }

    const caseCopy = document.querySelector("[data-case-hero-copy]");
    const caseMedia = document.querySelector("[data-case-hero-media]");
    if (caseCopy && caseMedia) {
      const copyItems = caseCopy.querySelectorAll(":scope > *");
      gsap.set([caseCopy, caseMedia], { autoAlpha: 1, y: 0 });
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(copyItems, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .84, stagger: .075 }, 0)
        .fromTo(caseMedia, { autoAlpha: 0, scale: .975, clipPath: "inset(5% 5% 5% 5% round 22px)" }, { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1.12 }, .18);

      const caseImage = caseMedia.querySelector("img");
      if (caseImage) {
        gsap.fromTo(caseImage, { yPercent: -2.5, scale: 1.035 }, {
          yPercent: 2.5,
          scale: 1.035,
          ease: "none",
          scrollTrigger: { trigger: caseMedia, start: "top bottom", end: "bottom top", scrub: .75 }
        });
      }
    }

    document.querySelectorAll("[data-work-row]").forEach((row) => {
      const parts = row.querySelectorAll(".work-row__index, .work-row__copy, .work-row__media, .work-row__arrow");
      gsap.set(row, { autoAlpha: 1, y: 0 });
      gsap.fromTo(parts, { autoAlpha: 0, y: 28 }, {
        autoAlpha: 1,
        y: 0,
        duration: .82,
        stagger: .07,
        ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 86%", once: true }
      });
    });

    document.querySelectorAll("[data-case-section]").forEach((section) => {
      const heading = section.querySelector(".case-section__heading");
      const content = section.querySelector(".case-section__content");
      gsap.set(section, { autoAlpha: 1, y: 0 });
      gsap.fromTo([heading, content], { autoAlpha: 0, y: 30 }, {
        autoAlpha: 1,
        y: 0,
        duration: .88,
        stagger: .1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 82%", once: true }
      });
    });

    const specialReveals = new Set([
      heroCopy,
      heroVisual,
      caseCopy,
      caseMedia,
      ...document.querySelectorAll("[data-work-row], [data-case-section]")
    ].filter(Boolean));

    document.querySelectorAll(".reveal").forEach((element) => {
      if (specialReveals.has(element)) return;
      gsap.fromTo(element, { autoAlpha: 0, y: 28 }, {
        autoAlpha: 1,
        y: 0,
        duration: .82,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true }
      });
    });

    document.querySelectorAll("[data-image-reveal]").forEach((figure) => {
      gsap.fromTo(figure, { clipPath: "inset(8% 0% 8% 0% round 18px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 18px)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: figure, start: "top 88%", once: true }
      });
    });

    const mediaQuery = gsap.matchMedia();
    mediaQuery.add("(hover: hover) and (pointer: fine) and (min-width: 821px)", () => {
      const cleanup = [];

      document.querySelectorAll("[data-magnetic]").forEach((element) => {
        const xTo = gsap.quickTo(element, "x", { duration: .55, ease: "power3.out" });
        const yTo = gsap.quickTo(element, "y", { duration: .55, ease: "power3.out" });
        const strength = element.classList.contains("brand") ? 3.5 : 5.5;

        const move = (event) => {
          const rect = element.getBoundingClientRect();
          xTo(((event.clientX - rect.left) / rect.width - .5) * strength * 2);
          yTo(((event.clientY - rect.top) / rect.height - .5) * strength * 2);
        };
        const reset = () => { xTo(0); yTo(0); };

        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", reset);
        cleanup.push(() => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", reset);
        });
      });

      if (heroVisual) {
        const orbit = heroVisual.querySelector("[data-orbit-media]");
        const xTo = gsap.quickTo(orbit, "x", { duration: .9, ease: "power3.out" });
        const yTo = gsap.quickTo(orbit, "y", { duration: .9, ease: "power3.out" });
        const rotateXTo = gsap.quickTo(heroVisual, "rotationX", { duration: .9, ease: "power3.out" });
        const rotateYTo = gsap.quickTo(heroVisual, "rotationY", { duration: .9, ease: "power3.out" });

        const moveOrbit = (event) => {
          const rect = heroVisual.getBoundingClientRect();
          const nx = (event.clientX - rect.left) / rect.width - .5;
          const ny = (event.clientY - rect.top) / rect.height - .5;
          xTo(nx * 18);
          yTo(ny * 14);
          rotateXTo(ny * -1.2);
          rotateYTo(nx * 1.5);
        };
        const resetOrbit = () => { xTo(0); yTo(0); rotateXTo(0); rotateYTo(0); };

        heroVisual.addEventListener("pointermove", moveOrbit);
        heroVisual.addEventListener("pointerleave", resetOrbit);
        cleanup.push(() => {
          heroVisual.removeEventListener("pointermove", moveOrbit);
          heroVisual.removeEventListener("pointerleave", resetOrbit);
        });
      }

      document.querySelectorAll("[data-work-row]").forEach((row) => {
        const media = row.querySelector("[data-hover-media]");
        if (!media) return;
        const xTo = gsap.quickTo(media, "x", { duration: .65, ease: "power3.out" });
        const yTo = gsap.quickTo(media, "y", { duration: .65, ease: "power3.out" });
        const moveMedia = (event) => {
          const rect = row.getBoundingClientRect();
          xTo(((event.clientX - rect.left) / rect.width - .5) * 8);
          yTo(((event.clientY - rect.top) / rect.height - .5) * 5);
        };
        const resetMedia = () => { xTo(0); yTo(0); };
        row.addEventListener("pointermove", moveMedia);
        row.addEventListener("pointerleave", resetMedia);
        cleanup.push(() => {
          row.removeEventListener("pointermove", moveMedia);
          row.removeEventListener("pointerleave", resetMedia);
        });
      });

      return () => cleanup.forEach((dispose) => dispose());
    });

    window.addEventListener("pagehide", () => mediaQuery.revert(), { once: true });
  });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("pagehide", () => context.revert(), { once: true });
  return true;
};

initSectionNavigation();
initCaseToc();

if (!initGsapExperience()) {
  initFallbackReveals();
}
