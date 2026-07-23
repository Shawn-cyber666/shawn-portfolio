const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const experienceData = {
  vivo: {
    title: "vivo Product Marketing",
    period: "2026 · Product Marketing",
    copy: "参与产品发布传播、用户场景梳理、AI 工作流实践与消费科技叙事。",
    logo: "./assets/vivo-logo.png",
    alt: "vivo",
    label: "vivo · 产品营销",
    index: "01 / 05",
    tags: ["产品叙事", "用户场景", "AI 工作流"],
    orbit: 0,
    plateClass: "is-vivo"
  },
  cuhk: {
    title: "CUHK Sustainable Tourism",
    period: "2026 · Research Project",
    copy: "围绕可持续旅游、访客体验与数字服务展开研究，把复杂议题转化为可验证的问题。",
    logo: "./assets/cuhk-logo.png",
    alt: "The Chinese University of Hong Kong",
    label: "香港中文大学 · 可持续旅游研究",
    index: "02 / 05",
    tags: ["研究设计", "可持续旅游", "访客体验"],
    orbit: 72,
    plateClass: "is-cuhk"
  },
  nanhai: {
    title: "南海会务",
    period: "2024 · Conference Operations",
    copy: "在高密度协作现场中处理信息、流程与沟通，让不同角色围绕同一个交付目标对齐。",
    logo: "./assets/nanhai-logo.png",
    alt: "南海会务",
    label: "南海会务 · 会务运营",
    index: "03 / 05",
    tags: ["现场运营", "流程协作", "交付管理"],
    orbit: 144,
    plateClass: "is-nanhai"
  },
  jw: {
    title: "JW Marriott",
    period: "2023 · Guest Experience",
    copy: "从真实服务现场理解用户需求、情绪与细节，训练快速判断和稳定交付的能力。",
    logo: "./assets/jw-marriott-logo.png",
    alt: "JW Marriott",
    label: "JW Marriott · 宾客体验",
    index: "04 / 05",
    tags: ["宾客体验", "服务设计", "现场判断"],
    orbit: 216,
    plateClass: "is-jw"
  },
  cityu: {
    title: "City University of Macau",
    period: "2022 · Business Administration",
    copy: "在商业、服务与数字化交叉处建立基础方法，持续把观察转化为结构化表达。",
    logo: "./assets/cityu-macau-logo.png",
    alt: "City University of Macau",
    label: "澳门城市大学 · 工商管理",
    index: "05 / 05",
    tags: ["工商管理", "商业基础", "结构化表达"],
    orbit: 288,
    plateClass: "is-cityu"
  }
};

const sceneKeyframes = [
  {
    x: .035, y: -.01, scale: .92, rx: 1, ry: -7, rz: -1,
    surfaceX: 0, surfaceY: 0,
    backX: 0, midX: 0, frontX: 0, frameY: 0,
    lensX: 0, lensY: 0, lensScale: 1, lensOpacity: 1
  },
  {
    x: -.06, y: .09, scale: 1.22, rx: -2, ry: 7, rz: 1.7,
    surfaceX: -22, surfaceY: 6,
    backX: -.035, midX: .055, frontX: .1, frameY: .02,
    lensX: -.035, lensY: .065, lensScale: 1.14, lensOpacity: 1
  },
  {
    x: .17, y: -.08, scale: .72, rx: 4, ry: -11, rz: -3,
    surfaceX: -52, surfaceY: -8,
    backX: -.13, midX: .09, frontX: .2, frameY: -.035,
    lensX: -.08, lensY: .12, lensScale: .78, lensOpacity: .64
  },
  {
    x: -.08, y: .29, scale: 1.78, rx: -6, ry: 4, rz: .5,
    surfaceX: -86, surfaceY: 10,
    backX: -.22, midX: .18, frontX: .34, frameY: -.08,
    lensX: .06, lensY: .28, lensScale: 1.35, lensOpacity: 0
  }
];

const state = {
  pointerX: 0,
  pointerY: 0,
  pointerTargetX: 0,
  pointerTargetY: 0,
  storyProgress: 0,
  storyTarget: 0,
  scrollEnergy: 0,
  activeIndex: 0,
  width: window.innerWidth,
  height: window.innerHeight
};

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function smoothStep(value) {
  const t = clamp(value);
  return t * t * (3 - (2 * t));
}

function finishLoader() {
  const progress = document.querySelector("[data-loader-progress]");
  if (progress) progress.value = 100;
  window.setTimeout(() => document.body.classList.remove("is-loading"), reduceMotion ? 0 : 420);
}

function setupLoader() {
  const progress = document.querySelector("[data-loader-progress]");
  const copy = document.querySelector("[data-loader-copy]");
  if (!progress) return;

  let value = 8;
  const steps = [
    [24, "Aligning the aperture"],
    [52, "Locating Neptune"],
    [76, "Calibrating depth"],
    [92, "Signal acquired"]
  ];

  const timer = window.setInterval(() => {
    value = Math.min(value + 3 + Math.random() * 7, 92);
    progress.value = value;
    const activeStep = [...steps].reverse().find(([threshold]) => value >= threshold);
    if (copy && activeStep) copy.textContent = activeStep[1];
  }, 120);

  window.addEventListener("load", () => {
    window.clearInterval(timer);
    finishLoader();
  }, { once: true });

  window.setTimeout(() => {
    window.clearInterval(timer);
    finishLoader();
  }, 1800);
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

function setupExperience() {
  const buttons = [...document.querySelectorAll("[data-experience]")];
  const title = document.querySelector("[data-experience-title]");
  const period = document.querySelector("[data-experience-period]");
  const copy = document.querySelector("[data-experience-copy]");
  const logo = document.querySelector("[data-experience-logo]");
  const logoPlate = document.querySelector("[data-experience-logo-plate]");
  const detailIndex = document.querySelector("[data-experience-index]");
  const tags = document.querySelector("[data-experience-tags]");
  const orbitIndex = document.querySelector("[data-orbit-index]");
  const orbitLabel = document.querySelector("[data-orbit-label]");
  const detail = document.querySelector("[data-experience-detail]");
  const section = document.querySelector("#experience");
  if (!buttons.length || !title || !period || !copy || !logo || !detail) return;

  let activeKey = "vivo";
  let manualLockUntil = 0;

  const activate = (button, userInitiated = false) => {
    const item = experienceData[button.dataset.experience];
    if (!item || button.dataset.experience === activeKey && !userInitiated) return;
    activeKey = button.dataset.experience;
    if (userInitiated) manualLockUntil = performance.now() + 4200;

    buttons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });

    detail.animate(
      [
        { opacity: .28, transform: "translate3d(0, 16px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" }
      ],
      { duration: reduceMotion ? 1 : 560, easing: "cubic-bezier(.16,.84,.18,1)" }
    );

    title.textContent = item.title;
    period.textContent = item.period;
    copy.textContent = item.copy;
    logo.src = item.logo;
    logo.alt = item.alt;
    if (detailIndex) detailIndex.textContent = item.index;
    if (orbitIndex) orbitIndex.textContent = item.index;
    if (orbitLabel) orbitLabel.textContent = item.label;
    if (tags) {
      tags.replaceChildren(...item.tags.map((tag) => {
        const node = document.createElement("span");
        node.textContent = tag;
        return node;
      }));
    }
    if (logoPlate) {
      logoPlate.className = `experience-logo-plate ${item.plateClass}`;
    }

    document.documentElement.style.setProperty("--orbit-turn", `${item.orbit}deg`);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => activate(button, true));
  });

  if (!section) return;

  let ticking = false;
  const syncToScroll = () => {
    ticking = false;
    if (performance.now() < manualLockUntil) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < window.innerHeight * .2 || rect.top > window.innerHeight * .8) return;

    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    const localProgress = clamp((-rect.top + (window.innerHeight * .24)) / travel);
    const index = Math.min(buttons.length - 1, Math.floor(localProgress * buttons.length));
    activate(buttons[index]);
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(syncToScroll);
  }, { passive: true });
}

function setupProductPreview() {
  const preview = document.querySelector("[data-product-preview]");
  if (!preview) return;
  const tabs = [...preview.querySelectorAll("[data-preview-tab]")];
  const panels = [...preview.querySelectorAll("[data-preview-panel]")];
  const run = preview.querySelector("[data-preview-run]");
  const status = preview.querySelector("[data-preview-status]");
  const output = preview.querySelector("[data-preview-output]");
  const crew = [...preview.querySelectorAll(".preview-crew-grid span")];
  let running = false;

  const selectTab = (key, focus = false) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.previewTab === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach((panel) => {
      const active = panel.dataset.previewPanel === key;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab.dataset.previewTab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;

      event.preventDefault();
      selectTab(tabs[nextIndex].dataset.previewTab, true);
    });
  });

  selectTab(tabs.find((tab) => tab.getAttribute("aria-selected") === "true")?.dataset.previewTab || tabs[0]?.dataset.previewTab);

  if (!run || !status || !output) return;
  const messages = [
    ["洞察员正在识别人群与核心矛盾", "完成受众分层：先锋体验者、效率务实派、内容影响者。"],
    ["策略员正在编排 14 天传播节奏", "建立预热、发布、扩散、复盘四段任务依赖。"],
    ["创意与内容员工正在接力", "输出 3 套传播主题与跨渠道内容骨架。"],
    ["数据员正在建立验收指标", "为每个渠道绑定目标、负责人和复盘节点。"],
    ["复盘员正在整理下一轮输入", "预览完成：工作流已沉淀为可重复执行的任务系统。"]
  ];

  run.addEventListener("click", () => {
    if (running) return;
    running = true;
    selectTab("crew");
    preview.classList.add("is-running");
    run.setAttribute("aria-busy", "true");
    run.querySelector("span").textContent = "系统运行中";

    let step = 0;
    const advance = () => {
      crew.forEach((member, index) => {
        member.classList.toggle("is-working", index <= step);
        member.classList.toggle("is-active", index === Math.min(step, crew.length - 1));
      });
      const message = messages[Math.min(step, messages.length - 1)];
      status.textContent = message[0];
      output.textContent = message[1];
      step += 1;

      if (step < messages.length) {
        window.setTimeout(advance, reduceMotion ? 20 : 720);
        return;
      }

      window.setTimeout(() => {
        running = false;
        preview.classList.remove("is-running");
        run.removeAttribute("aria-busy");
        run.querySelector("span").textContent = "再次运行预览";
      }, reduceMotion ? 20 : 640);
    };

    advance();
  });
}

function setupTiltSurfaces() {
  if (!finePointer || reduceMotion) return;
  const surfaces = [...document.querySelectorAll("[data-tilt]")];

  surfaces.forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const rect = surface.getBoundingClientRect();
      const x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      const y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
      surface.style.setProperty("--tilt-x", x.toFixed(3));
      surface.style.setProperty("--tilt-y", y.toFixed(3));
    });

    surface.addEventListener("pointerleave", () => {
      surface.style.setProperty("--tilt-x", "0");
      surface.style.setProperty("--tilt-y", "0");
    });
  });
}

function setupNavigation(sections) {
  const header = document.querySelector("[data-header]");
  const navLinks = [...document.querySelectorAll("[data-nav]")];
  const railLinks = [...document.querySelectorAll("[data-rail]")];

  const setActive = (id) => {
    [...navLinks, ...railLinks].forEach((link) => {
      const target = link.dataset.nav || link.dataset.rail;
      link.classList.toggle("is-active", target === id);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const id = visible.target.dataset.section;
    state.activeIndex = Math.max(0, sections.indexOf(visible.target));
    document.body.dataset.chapter = id;
    setActive(id);
  }, {
    rootMargin: "-34% 0px -52%",
    threshold: [0.06, .16, .3, .5]
  });

  sections.forEach((section) => observer.observe(section));

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const id = link.getAttribute("href")?.slice(1);
    const index = sections.findIndex((section) => section.id === id);
    if (index < 0) return;
    link.addEventListener("click", () => {
      state.activeIndex = index;
      document.body.dataset.chapter = id;
      setActive(id);
    });
  });

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  setActive("about");
}

function getStoryPosition(sections) {
  const focus = window.scrollY + (window.innerHeight * .5);
  const anchors = sections.map((section) => section.offsetTop + (section.offsetHeight * .42));

  if (focus <= anchors[0]) return { segment: 0, amount: 0, progress: 0 };
  if (focus >= anchors[anchors.length - 1]) {
    return { segment: anchors.length - 2, amount: 1, progress: 1 };
  }

  let segment = 0;
  for (let index = 0; index < anchors.length - 1; index += 1) {
    if (focus >= anchors[index] && focus <= anchors[index + 1]) {
      segment = index;
      break;
    }
  }

  const amount = clamp((focus - anchors[segment]) / (anchors[segment + 1] - anchors[segment]));
  return {
    segment,
    amount,
    progress: (segment + amount) / (anchors.length - 1)
  };
}

function getStoryFromProgress(progress) {
  const normalized = clamp(progress);
  const scaled = normalized * (sceneKeyframes.length - 1);
  const segment = Math.min(sceneKeyframes.length - 2, Math.floor(scaled));
  return {
    segment,
    amount: normalized >= 1 ? 1 : scaled - segment,
    progress: normalized
  };
}

function interpolateScene(story) {
  const from = sceneKeyframes[story.segment];
  const to = sceneKeyframes[story.segment + 1];
  const amount = smoothStep(story.amount);
  const compact = window.innerWidth <= 860;
  const width = state.width;
  const height = state.height;
  const horizontalScale = compact ? .62 : 1;
  const verticalScale = compact ? .72 : 1;

  return {
    x: lerp(from.x, to.x, amount) * width * horizontalScale,
    y: lerp(from.y, to.y, amount) * height * verticalScale,
    scale: lerp(from.scale, to.scale, amount) * (compact ? .96 : 1),
    rx: lerp(from.rx, to.rx, amount),
    ry: lerp(from.ry, to.ry, amount),
    rz: lerp(from.rz, to.rz, amount),
    surfaceX: lerp(from.surfaceX, to.surfaceX, amount),
    surfaceY: lerp(from.surfaceY, to.surfaceY, amount),
    backX: lerp(from.backX, to.backX, amount) * width,
    midX: lerp(from.midX, to.midX, amount) * width,
    frontX: lerp(from.frontX, to.frontX, amount) * width,
    frameY: lerp(from.frameY, to.frameY, amount) * height,
    lensX: lerp(from.lensX, to.lensX, amount) * width,
    lensY: lerp(from.lensY, to.lensY, amount) * height,
    lensScale: lerp(from.lensScale, to.lensScale, amount),
    lensOpacity: lerp(from.lensOpacity, to.lensOpacity, amount)
  };
}

function applyScene(scene, story) {
  const root = document.documentElement;
  root.style.setProperty("--scene-x", `${scene.x.toFixed(2)}px`);
  root.style.setProperty("--scene-y", `${scene.y.toFixed(2)}px`);
  root.style.setProperty("--scene-scale", scene.scale.toFixed(4));
  root.style.setProperty("--scene-rotate-x", `${scene.rx.toFixed(3)}deg`);
  root.style.setProperty("--scene-rotate-y", `${scene.ry.toFixed(3)}deg`);
  root.style.setProperty("--scene-rotate-z", `${scene.rz.toFixed(3)}deg`);
  root.style.setProperty("--surface-x", `${scene.surfaceX.toFixed(2)}px`);
  root.style.setProperty("--surface-y", `${scene.surfaceY.toFixed(2)}px`);
  root.style.setProperty("--frame-back-x", `${scene.backX.toFixed(2)}px`);
  root.style.setProperty("--frame-mid-x", `${scene.midX.toFixed(2)}px`);
  root.style.setProperty("--frame-front-x", `${scene.frontX.toFixed(2)}px`);
  root.style.setProperty("--frame-y", `${scene.frameY.toFixed(2)}px`);
  root.style.setProperty("--lens-x", `${scene.lensX.toFixed(2)}px`);
  root.style.setProperty("--lens-y", `${scene.lensY.toFixed(2)}px`);
  root.style.setProperty("--lens-scale", scene.lensScale.toFixed(4));
  root.style.setProperty("--lens-opacity", scene.lensOpacity.toFixed(4));
  root.style.setProperty("--story-progress", story.progress.toFixed(4));
  root.style.setProperty("--scroll-energy", state.scrollEnergy.toFixed(4));
}

function setupPointerDepth() {
  if (!finePointer || reduceMotion) return;

  window.addEventListener("pointermove", (event) => {
    state.pointerTargetX = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
    state.pointerTargetY = clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
    document.body.classList.add("has-interacted");
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    state.pointerTargetX = 0;
    state.pointerTargetY = 0;
  });
}

function setupVideo() {
  const video = document.querySelector("[data-neptune-video]");
  if (!video) return;

  const tryPlay = () => {
    video.playbackRate = .78;
    video.play().catch(() => {
      video.style.opacity = "0";
    });
  };

  tryPlay();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
    else tryPlay();
  });
}

function createParticleField() {
  const canvas = document.querySelector("[data-particle-canvas]");
  if (!canvas || reduceMotion) return null;
  const context = canvas.getContext("2d", { alpha: true });
  const particles = [];

  const rebuild = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles.length = 0;
    const count = window.innerWidth < 700 ? 42 : 96;
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random(),
        size: .35 + Math.random() * 1.45,
        speed: .08 + Math.random() * .28,
        phase: Math.random() * Math.PI * 2
      });
    }
  };

  rebuild();
  return { canvas, context, particles, rebuild };
}

function drawParticles(field, time) {
  if (!field) return;
  const { context, particles } = field;
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const centerX = (window.innerWidth * .56) + (state.pointerX * 34);
  const centerY = (window.innerHeight * .47) + (state.pointerY * 24);
  const travel = .28 + (state.storyProgress * 1.45) + (state.scrollEnergy * 2.2);

  particles.forEach((particle, index) => {
    const angle = particle.phase + (time * .00003 * (1 + particle.z)) + (state.storyProgress * .78);
    const orbit = 70 + (particle.z * Math.min(window.innerWidth, window.innerHeight) * .86);
    const driftX = Math.cos(angle) * orbit * (.62 + particle.z * .38);
    const driftY = Math.sin(angle) * orbit * .34;
    particle.y -= particle.speed * travel;

    if (particle.y < -24) particle.y = window.innerHeight + 24;

    const x = (particle.x * .42) + (centerX * .58) + (driftX * .24);
    const y = particle.y + (driftY * .16);
    const alpha = .12 + (particle.z * .52);
    const size = particle.size * (.7 + particle.z * 1.8);

    context.beginPath();
    context.fillStyle = `rgba(151, 211, 255, ${alpha})`;
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fill();

    if (index % 17 === 0) {
      context.beginPath();
      context.strokeStyle = `rgba(86, 165, 231, ${alpha * .42})`;
      context.lineWidth = .5;
      context.moveTo(x, y);
      context.lineTo(x - (state.pointerX * 12), y + (7 + state.storyProgress * 18));
      context.stroke();
    }
  });
}

function setupStoryEngine(sections) {
  const field = createParticleField();
  const video = document.querySelector("[data-neptune-video]");
  let needsResize = false;
  let lastScrollY = window.scrollY;

  const initialStory = getStoryPosition(sections);
  state.storyProgress = initialStory.progress;
  state.storyTarget = initialStory.progress;

  const resize = () => {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    needsResize = true;
  };

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    state.scrollEnergy = clamp(state.scrollEnergy + (delta / 190));
    lastScrollY = window.scrollY;
  }, { passive: true });

  const frame = (time) => {
    if (needsResize) {
      field?.rebuild();
      needsResize = false;
    }

    const rawStory = getStoryPosition(sections);
    state.storyTarget = rawStory.progress;
    const progressEase = .055 + (state.scrollEnergy * .045);
    state.storyProgress = lerp(state.storyProgress, state.storyTarget, progressEase);
    if (Math.abs(state.storyTarget - state.storyProgress) < .0001) {
      state.storyProgress = state.storyTarget;
    }
    state.scrollEnergy = lerp(state.scrollEnergy, 0, .055);
    const story = getStoryFromProgress(state.storyProgress);

    state.pointerX = lerp(state.pointerX, state.pointerTargetX, .055);
    state.pointerY = lerp(state.pointerY, state.pointerTargetY, .055);

    document.documentElement.style.setProperty("--pointer-x", state.pointerX.toFixed(4));
    document.documentElement.style.setProperty("--pointer-y", state.pointerY.toFixed(4));

    const scene = interpolateScene(story);
    scene.rz += Math.sin(time * .00018) * .7 + (state.scrollEnergy * 1.4);
    scene.ry += Math.sin(time * .00011) * 1.2;
    applyScene(scene, story);
    drawParticles(field, time);

    if (video && !video.paused) {
      video.playbackRate = .72 + (story.progress * .38);
    }

    window.requestAnimationFrame(frame);
  };

  if (reduceMotion) {
    const story = getStoryPosition(sections);
    applyScene(interpolateScene(story), story);
    window.addEventListener("scroll", () => {
      const nextStory = getStoryPosition(sections);
      applyScene(interpolateScene(nextStory), nextStory);
    }, { passive: true });
  } else {
    window.requestAnimationFrame(frame);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const sections = [...document.querySelectorAll("[data-section]")];
  setupLoader();
  setupMenu();
  setupNavigation(sections);
  setupExperience();
  setupProductPreview();
  setupTiltSurfaces();
  setupPointerDepth();
  setupVideo();
  setupStoryEngine(sections);
});
