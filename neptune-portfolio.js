const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const experienceData = {
  vivo: {
    title: "vivo Product Marketing",
    period: "2026 · Product Marketing",
    copy: "参与产品发布传播、用户场景梳理、AI 工作流实践与消费科技叙事。",
    logo: "/shawn-portfolio/assets/vivo-logo.png",
    alt: "vivo"
  },
  cuhk: {
    title: "CUHK Sustainable Tourism",
    period: "2026 · Research Project",
    copy: "围绕可持续旅游、访客体验与数字服务展开研究，把复杂议题转化为可验证的问题。",
    logo: "/shawn-portfolio/assets/cuhk-logo.png",
    alt: "The Chinese University of Hong Kong"
  },
  nanhai: {
    title: "Nanhai Conference",
    period: "2024 · Conference Operations",
    copy: "在高密度协作现场中处理信息、流程与沟通，让不同角色围绕同一个交付目标对齐。",
    logo: "/shawn-portfolio/assets/nanhai-logo.png",
    alt: "Nanhai Conference"
  },
  jw: {
    title: "JW Marriott",
    period: "2023 · Guest Experience",
    copy: "从真实服务现场理解用户需求、情绪与细节，训练快速判断和稳定交付的能力。",
    logo: "/shawn-portfolio/assets/jw-marriott-logo.png",
    alt: "JW Marriott"
  },
  cityu: {
    title: "City University of Macau",
    period: "2022 · Business Administration",
    copy: "在商业、服务与数字化交叉处建立基础方法，持续把观察转化为结构化表达。",
    logo: "/shawn-portfolio/assets/cityu-macau-logo.png",
    alt: "City University of Macau"
  }
};

function finishLoader() {
  const progress = document.querySelector("[data-loader-progress]");
  if (progress) progress.value = 100;
  window.setTimeout(() => document.body.classList.remove("is-loading"), reduceMotion ? 0 : 420);
}

function setupMenu() {
  const button = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!button || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  button.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    button.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

function setupNavigation() {
  const header = document.querySelector("[data-header]");
  const sections = [...document.querySelectorAll("[data-section]")];
  const links = [...document.querySelectorAll("[data-nav]")];

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const id = visible.target.dataset.section;
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.nav === id));
  }, { rootMargin: "-28% 0px -56%", threshold: [0.08, 0.2, 0.45] });

  sections.forEach((section) => observer.observe(section));
}

function setupOrbitalParallax() {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
  const hero = document.querySelector(".hero");
  const core = document.querySelector("[data-orbital-core]");
  if (!hero || !core) return;

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 14;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 10;
    core.style.setProperty("--orbit-x", `${x}px`);
    core.style.setProperty("--orbit-y", `${y}px`);
  });

  hero.addEventListener("pointerleave", () => {
    core.style.setProperty("--orbit-x", "0px");
    core.style.setProperty("--orbit-y", "0px");
  });
}

function setupExperience() {
  const buttons = [...document.querySelectorAll("[data-experience]")];
  const title = document.querySelector("[data-experience-title]");
  const period = document.querySelector("[data-experience-period]");
  const copy = document.querySelector("[data-experience-copy]");
  const logo = document.querySelector("[data-experience-logo]");
  if (!buttons.length || !title || !period || !copy || !logo) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = experienceData[button.dataset.experience];
      if (!item) return;

      buttons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });

      title.textContent = item.title;
      period.textContent = item.period;
      copy.textContent = item.copy;
      logo.src = item.logo;
      logo.alt = item.alt;
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupNavigation();
  setupOrbitalParallax();
  setupExperience();
});

window.addEventListener("load", finishLoader, { once: true });
window.setTimeout(finishLoader, 2200);
