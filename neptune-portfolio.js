(() => {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  async function dismissLoader() {
    const loader = document.querySelector('[data-loader]');
    const heroImage = document.querySelector('.hero-media');

    if (!loader) {
      body.classList.remove('is-loading');
      return;
    }

    const imageReady = heroImage && !heroImage.complete
      ? new Promise((resolve) => {
          heroImage.addEventListener('load', resolve, { once: true });
          heroImage.addEventListener('error', resolve, { once: true });
        })
      : Promise.resolve();

    await Promise.race([imageReady, delay(900)]);
    await delay(prefersReducedMotion ? 40 : 460);
    loader.classList.add('is-hidden');
    body.classList.remove('is-loading');
    window.setTimeout(() => loader.remove(), 650);
  }

  function setupReveal() {
    const items = [...document.querySelectorAll('.reveal')];

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    items.forEach((item) => observer.observe(item));
  }

  function setupNavigation() {
    const links = [...document.querySelectorAll('[data-nav-link]')];
    const sections = [...document.querySelectorAll('[data-section]')];

    if (!links.length || !sections.length) return;

    const setActive = (id) => {
      links.forEach((link) => {
        const active = link.dataset.navLink === id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    };

    let frame = 0;

    const update = () => {
      const anchor = window.innerHeight * 0.38;
      let current = sections[0];

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= anchor) current = section;
      });

      setActive(current.dataset.section);
      frame = 0;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  function setupMobileMenu() {
    const button = document.querySelector('[data-menu-button]');
    const menu = document.querySelector('[data-mobile-menu]');

    if (!button || !menu) return;

    const setOpen = (open) => {
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? '关闭' : '菜单';
      body.classList.toggle('is-loading', open);
    };

    button.addEventListener('click', () => {
      setOpen(!menu.classList.contains('is-open'));
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  function setupExperience() {
    const data = {
      vivo: {
        title: 'vivo Product Marketing',
        copy: '参与发布传播、产品场景、AI 工作流实践和消费科技叙事。',
        logo: '/shawn-portfolio/assets/vivo-logo.png',
        alt: 'vivo'
      },
      cuhk: {
        title: 'CUHK Sustainable Tourism',
        copy: '把可持续旅游、数字体验与真实用户场景放进同一套研究框架。',
        logo: '/shawn-portfolio/assets/cuhk-logo.png',
        alt: 'The Chinese University of Hong Kong'
      },
      nanhai: {
        title: 'Nanhai Conference',
        copy: '在会展与大型活动执行中理解现场秩序、跨团队协同和即时判断。',
        logo: '/shawn-portfolio/assets/nanhai-logo.png',
        alt: 'Nanhai Conference'
      },
      jw: {
        title: 'JW Marriott',
        copy: '宾客关系与服务现场让我直接听见需求，也训练了我对体验细节的敏感度。',
        logo: '/shawn-portfolio/assets/jw-marriott-logo.png',
        alt: 'JW Marriott'
      },
      cityu: {
        title: 'City University of Macau',
        copy: '旅游与服务管理背景，建立了我理解场景、组织信息和面对真实人的基础。',
        logo: '/shawn-portfolio/assets/cityu-macau-logo.png',
        alt: 'City University of Macau'
      }
    };

    const detail = document.querySelector('[data-experience-detail]');
    const items = [...document.querySelectorAll('[data-experience]')];
    if (!detail || !items.length) return;

    const title = detail.querySelector('[data-experience-title]');
    const copy = detail.querySelector('[data-experience-copy]');
    const logo = detail.querySelector('[data-experience-logo]');

    const select = (item) => {
      const content = data[item.dataset.experience];
      if (!content || item.classList.contains('is-active')) return;

      items.forEach((node) => {
        const active = node === item;
        node.classList.toggle('is-active', active);
        node.setAttribute('aria-pressed', String(active));
      });

      detail.classList.add('is-changing');
      document.dispatchEvent(new CustomEvent('neptune:signal'));
      window.setTimeout(() => {
        title.textContent = content.title;
        copy.textContent = content.copy;
        logo.src = content.logo;
        logo.alt = content.alt;
        detail.classList.remove('is-changing');
      }, prefersReducedMotion ? 0 : 170);
    };

    items.forEach((item) => {
      item.setAttribute('aria-pressed', String(item.classList.contains('is-active')));
      item.addEventListener('click', () => select(item));
    });
  }

  function setupNeptuneCompanion() {
    const companion = document.querySelector('[data-neptune-companion]');
    const image = companion?.querySelector('[data-neptune-image]');
    const sections = [...document.querySelectorAll('[data-neptune-section]')];

    if (!companion || !image || !sections.length) return;

    const loadImage = () => {
      if (image.src || !image.dataset.src) return;
      image.addEventListener('load', () => companion.classList.add('is-ready'), { once: true });
      image.addEventListener('error', () => companion.remove(), { once: true });
      image.src = image.dataset.src;
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadImage, { timeout: 1200 });
    } else {
      window.setTimeout(loadImage, 360);
    }

    let scrollFrame = 0;

    const updateOrbit = () => {
      const anchor = window.innerHeight * 0.46;
      let current = sections[0];

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= anchor) current = section;
      });

      const rect = current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (anchor - rect.top) / Math.max(rect.height, 1)));
      const orbit = current.id || 'intro';

      companion.dataset.orbit = orbit;
      companion.style.setProperty('--scroll-y', `${((progress - 0.5) * 46).toFixed(1)}px`);
      companion.style.setProperty('--scroll-rotation', `${((progress - 0.5) * 0.8).toFixed(2)}deg`);
      scrollFrame = 0;
    };

    const requestOrbitUpdate = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateOrbit);
    };

    updateOrbit();
    window.addEventListener('scroll', requestOrbitUpdate, { passive: true });
    window.addEventListener('resize', requestOrbitUpdate);

    document.querySelectorAll('.project-row').forEach((row) => {
      row.addEventListener('mouseenter', () => companion.classList.add('is-engaged'));
      row.addEventListener('mouseleave', () => companion.classList.remove('is-engaged'));
    });

    let signalTimer = 0;
    document.addEventListener('neptune:signal', () => {
      companion.classList.remove('is-pulsing');
      window.clearTimeout(signalTimer);
      window.requestAnimationFrame(() => companion.classList.add('is-pulsing'));
      signalTimer = window.setTimeout(() => companion.classList.remove('is-pulsing'), 760);
    });

    if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

    let pointerFrame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const renderPointer = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      companion.style.setProperty('--pointer-x', `${(currentX * 14).toFixed(2)}px`);
      companion.style.setProperty('--pointer-y', `${(currentY * 10).toFixed(2)}px`);
      companion.style.setProperty('--pointer-rotation', `${(currentX * 0.34).toFixed(3)}deg`);

      if (Math.abs(targetX - currentX) > 0.003 || Math.abs(targetY - currentY) > 0.003) {
        pointerFrame = window.requestAnimationFrame(renderPointer);
      } else {
        pointerFrame = 0;
      }
    };

    const requestPointerRender = () => {
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(renderPointer);
    };

    window.addEventListener('pointermove', (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
      requestPointerRender();
    }, { passive: true });

    window.addEventListener('blur', () => {
      targetX = 0;
      targetY = 0;
      requestPointerRender();
    });
  }

  function setupGravityField() {
    const canvas = document.querySelector('[data-gravity-field]');
    const companion = document.querySelector('[data-neptune-companion]');
    const heroCopy = document.querySelector('.hero-copy');
    const heroSafetyNodes = heroCopy
      ? [...heroCopy.querySelectorAll('.eyebrow, h1 span, h1 strong, .hero-statement, .text-action')]
      : [];

    if (!canvas || prefersReducedMotion) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const lowPower = (navigator.deviceMemory && navigator.deviceMemory <= 4)
      || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    const tau = Math.PI * 2;
    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      rail: 0,
      compact: false,
      frame: 0,
      lastFrame: 0,
      visible: !document.hidden,
      pointerX: 0,
      pointerY: 0,
      pointerTargetX: 0,
      pointerTargetY: 0,
      pointerEnergy: 0,
      pulse: 0,
      planetX: 0,
      planetY: 0,
      planetRadius: 0,
      initialized: false,
      particles: [],
      dust: [],
      rimDust: []
    };
    let safetyRects = [];

    const random = (() => {
      let seed = 0x08c0ffee;
      return () => {
        seed += 0x6d2b79f5;
        let value = seed;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
      };
    })();

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lerp = (from, to, amount) => from + (to - from) * amount;
    const cubic = (a, b, c, d, t) => {
      const inverse = 1 - t;
      return inverse * inverse * inverse * a
        + 3 * inverse * inverse * t * b
        + 3 * inverse * t * t * c
        + t * t * t * d;
    };

    function makeParticles() {
      const desktopCount = lowPower ? 260 : 430;
      const count = state.compact ? (lowPower ? 76 : 110) : desktopCount;
      state.particles = Array.from({ length: count }, (_, index) => {
        const lanePick = random();
        return {
          lane: lanePick < 0.36 ? 0 : lanePick < 0.72 ? 1 : 2,
          phase: random(),
          drift: random() * 2 - 1,
          offset: random() * 2 - 1,
          size: 0.54 + random() * (index % 11 === 0 ? 1.42 : 0.82),
          opacity: 0.34 + random() * 0.66,
          speed: 0.000018 + random() * 0.000028,
          shimmer: random() * tau,
          silver: random() > 0.72
        };
      });

      const desktopDustCount = lowPower ? 390 : 1650;
      const dustCount = state.compact ? (lowPower ? 58 : 88) : desktopDustCount;
      state.dust = Array.from({ length: dustCount }, () => {
        const lanePick = random();
        return {
          lane: lanePick < 0.38 ? 0 : lanePick < 0.76 ? 1 : 2,
          phase: random(),
          drift: random() * 2 - 1,
          offset: random() * 2 - 1,
          size: 0.46 + random() * 0.82,
          opacity: 0.3 + random() * 0.52,
          speed: 0.000012 + random() * 0.000022,
          shimmer: random() * tau,
          silver: random() > 0.82
        };
      });

      const desktopRimCount = lowPower ? 170 : 330;
      const rimCount = state.compact ? (lowPower ? 38 : 58) : desktopRimCount;
      state.rimDust = Array.from({ length: rimCount }, (_, index) => {
        const outlet = index % 2;
        return {
          angle: (outlet === 0 ? -2.48 : 3.03) + (random() * 2 - 1) * 0.2,
          phase: random(),
          size: 0.42 + random() * 0.9,
          opacity: 0.2 + random() * 0.62,
          speed: 0.000026 + random() * 0.000036,
          wobble: random() * tau,
          silver: random() > 0.68
        };
      });
    }

    function resize() {
      const compact = window.innerWidth <= 820;
      const dprLimit = compact || lowPower ? 1.15 : 1.5;
      const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const railValue = getComputedStyle(document.documentElement).getPropertyValue('--rail');
      const rail = compact ? 0 : Number.parseFloat(railValue) || 176;

      state.width = width;
      state.height = height;
      state.dpr = dpr;
      state.rail = rail;
      state.compact = compact;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
      state.initialized = false;
    }

    function getOrbit() {
      return companion?.dataset.orbit || 'intro';
    }

    function getPlanetTarget(orbit) {
      const { width, height, compact } = state;

      if (orbit === 'intro' || !companion) {
        return {
          x: width + height * (compact ? 0.42 : 0.13),
          y: height * (compact ? 0.62 : 0.69),
          radius: height * (compact ? 0.69 : 0.83)
        };
      }

      const rect = companion.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return { x: width * 1.12, y: height * 0.52, radius: height * 0.58 };
      }

      return {
        x: rect.left + rect.width * 0.94,
        y: rect.top + rect.height * 0.52,
        radius: rect.width * 0.77
      };
    }

    function orbitStyle(orbit) {
      const styles = {
        intro: { intensity: 1.3, red: 139, green: 220, blue: 255 },
        work: { intensity: 0.32, red: 123, green: 207, blue: 244 },
        experience: { intensity: 0.4, red: 139, green: 220, blue: 255 },
        thinking: { intensity: 0.19, red: 16, green: 88, blue: 126 },
        contact: { intensity: 0.48, red: 139, green: 220, blue: 255 }
      };
      return styles[orbit] || styles.work;
    }

    function updatePlanet(orbit) {
      const target = getPlanetTarget(orbit);
      if (!state.initialized) {
        state.planetX = target.x;
        state.planetY = target.y;
        state.planetRadius = target.radius;
        state.initialized = true;
        return;
      }

      state.planetX = lerp(state.planetX, target.x, 0.055);
      state.planetY = lerp(state.planetY, target.y, 0.055);
      state.planetRadius = lerp(state.planetRadius, target.radius, 0.055);
    }

    function sampleStream(particle, time, phaseOffset, output) {
      const t = (particle.phase + time * particle.speed + phaseOffset + 1) % 1;
      const { width, height, rail, planetX, planetY, planetRadius } = state;
      const contentWidth = width - rail;
      if (particle.lane === 2) {
        const baseX = Math.min(width * 0.68, planetX - planetRadius * 1.02);
        const baseY = planetY - planetRadius * 0.34;
        const targetX = clamp(state.pointerTargetX, rail + contentWidth * 0.42, width * 0.78);
        const targetY = clamp(state.pointerTargetY, height * 0.2, height * 0.78);
        const influence = finePointer ? state.pointerEnergy * 0.72 : 0;
        const centerX = lerp(baseX, targetX, influence);
        const centerY = lerp(baseY, targetY, influence);
        const radius = (10 + t * Math.min(planetRadius * 0.24, state.compact ? 82 : 150));
        const angle = t * tau * 2.65 + particle.drift * 0.22 - time * 0.00013;
        output.x = centerX + Math.cos(angle) * radius * 1.18;
        output.y = centerY + Math.sin(angle) * radius * 0.62;
        output.fade = Math.sin(Math.PI * t) * (0.5 + 0.5 * (1 - t));
        return;
      }

      const topLane = particle.lane === 0;
      const laneWidth = state.compact ? 14 : (topLane ? 98 : 72);
      const angle = topLane ? -2.48 : 3.03;
      const endX = planetX + Math.cos(angle) * planetRadius;
      const endY = planetY + Math.sin(angle) * planetRadius;
      const startX = rail + contentWidth * (topLane ? -0.02 : -0.035);
      const startY = topLane ? -height * 0.015 : height * 0.76;
      const control1X = rail + contentWidth * (topLane ? 0.42 : 0.38);
      const control1Y = topLane ? height * 0.015 : height * 0.83;
      const control2X = endX - planetRadius * (topLane ? 0.2 : 0.29);
      const control2Y = endY + planetRadius * (topLane ? 0.055 : 0.035);
      const normal = particle.offset * laneWidth * Math.sin(Math.PI * t);

      output.x = cubic(startX, control1X, control2X, endX, t);
      output.y = cubic(startY, control1Y, control2Y, endY, t) + normal;
      output.fade = Math.pow(Math.sin(Math.PI * t), 0.72) * (0.56 + t * 0.44);
    }

    function pointerDisturbance(point) {
      if (!finePointer || state.pointerEnergy < 0.01) return;
      const dx = point.x - state.pointerX;
      const dy = point.y - state.pointerY;
      const distance = Math.hypot(dx, dy);
      const reach = state.compact ? 70 : 148;
      if (distance >= reach || distance < 0.001) return;

      const force = Math.pow(1 - distance / reach, 2) * state.pointerEnergy;
      const tangentX = -dy / distance;
      const tangentY = dx / distance;
      point.x += tangentX * force * (24 + state.pulse * 20) + (dx / distance) * force * 8;
      point.y += tangentY * force * (24 + state.pulse * 20) + (dy / distance) * force * 8;
    }

    function refreshSafetyRects(orbit) {
      if (orbit !== 'intro') {
        safetyRects = [];
        return;
      }
      safetyRects = heroSafetyNodes.map((node) => node.getBoundingClientRect());
    }

    function textSafetyAlpha(x, y) {
      for (const rect of safetyRects) {
        const inside = x > rect.left - 8
          && x < rect.right + 8
          && y > rect.top - 5
          && y < rect.bottom + 5;
        if (inside) return 0.045;

        const near = x > rect.left - 22
          && x < rect.right + 22
          && y > rect.top - 15
          && y < rect.bottom + 15;
        if (near) return 0.3;
      }
      return 1;
    }

    function drawLoadingField(time) {
      const centerX = state.width * 0.5;
      const centerY = state.height * 0.5;
      const maxRadius = Math.min(state.width, state.height) * (state.compact ? 0.32 : 0.27);

      context.globalCompositeOperation = 'lighter';
      state.particles.forEach((particle, index) => {
        const progress = (particle.phase + time * particle.speed * 0.72) % 1;
        const arm = (index % 3) * (tau / 3);
        const angle = arm + progress * tau * 1.9 - time * 0.00012 + particle.drift * 0.18;
        const radius = 12 + Math.pow(progress, 0.78) * maxRadius;
        const x = centerX + Math.cos(angle) * radius * 1.46;
        const y = centerY + Math.sin(angle) * radius * 0.42;
        const alpha = (1 - progress) * particle.opacity * 0.78;
        context.fillStyle = `rgba(${particle.silver ? '220,235,244' : '108,205,246'},${alpha})`;
        context.beginPath();
        context.arc(x, y, particle.size * 0.72, 0, tau);
        context.fill();
      });
    }

    const point = { x: 0, y: 0, fade: 0 };
    const previous = { x: 0, y: 0, fade: 0 };
    const dustPoint = { x: 0, y: 0, fade: 0 };

    function drawCurrentGuides(style) {
      const { width, height, rail, planetX, planetY, planetRadius } = state;
      const contentWidth = width - rail;
      [true, false].forEach((topLane) => {
        const offsets = state.compact
          ? [-7, 7]
          : (topLane ? [-72, -48, -24, 0, 24, 48, 72] : [-48, -32, -16, 0, 16, 32, 48]);
        const angle = topLane ? -2.48 : 3.03;
        const endX = planetX + Math.cos(angle) * planetRadius;
        const endY = planetY + Math.sin(angle) * planetRadius;
        const startX = rail + contentWidth * (topLane ? -0.02 : -0.035);
        const startY = topLane ? -height * 0.015 : height * 0.76;
        const control1X = rail + contentWidth * (topLane ? 0.42 : 0.38);
        const control1Y = topLane ? height * 0.015 : height * 0.83;
        const control2X = endX - planetRadius * (topLane ? 0.2 : 0.29);
        const control2Y = endY + planetRadius * (topLane ? 0.055 : 0.035);

        offsets.forEach((offset, index) => {
          const alpha = style.intensity * (index === Math.floor(offsets.length / 2) ? 0.045 : 0.022);
          context.strokeStyle = `rgba(${style.red},${style.green},${style.blue},${alpha})`;
          context.lineWidth = index === Math.floor(offsets.length / 2) ? 0.72 : 0.48;
          context.beginPath();
          context.moveTo(startX, startY + offset);
          context.bezierCurveTo(
            control1X,
            control1Y + offset * 0.84,
            control2X,
            control2Y + offset * 0.32,
            endX,
            endY
          );
          context.stroke();
        });
      });
    }

    function drawDust(time, orbit, style) {
      [false, true].forEach((silverPass) => {
        context.fillStyle = silverPass
          ? 'rgb(220,235,244)'
          : `rgb(${style.red},${style.green},${style.blue})`;

        state.dust.forEach((particle) => {
          if (particle.silver !== silverPass) return;
          sampleStream(particle, time, 0, dustPoint);
          pointerDisturbance(dustPoint);

          const safety = textSafetyAlpha(dustPoint.x, dustPoint.y);
          const shimmer = 0.9 + Math.sin(time * 0.00082 + particle.shimmer) * 0.1;
          const laneBoost = particle.lane === 2 ? 1.44 : 1;
          const alpha = Math.min(
            0.76,
            style.intensity * particle.opacity * dustPoint.fade * shimmer * safety * laneBoost
          );
          if (alpha < 0.008) return;

          context.globalAlpha = alpha;
          const size = particle.size * (particle.lane === 2 ? 1.12 : 1);
          context.fillRect(dustPoint.x, dustPoint.y, size, size);
        });
      });
      context.globalAlpha = 1;
    }

    function drawRimDust(time, style) {
      [false, true].forEach((silverPass) => {
        context.fillStyle = silverPass
          ? 'rgb(220,235,244)'
          : `rgb(${style.red},${style.green},${style.blue})`;

        state.rimDust.forEach((particle) => {
          if (particle.silver !== silverPass) return;
          const phase = (particle.phase + time * particle.speed) % 1;
          const fade = Math.pow(1 - phase, 1.45);
          const angle = particle.angle + Math.sin(time * 0.0005 + particle.wobble) * 0.018;
          const distance = phase * (state.compact ? 34 : 72);
          const radius = state.planetRadius + distance;
          const tangent = Math.sin(phase * Math.PI) * (state.compact ? 4 : 10);
          const x = state.planetX
            + Math.cos(angle) * radius
            - Math.sin(angle) * tangent;
          const y = state.planetY
            + Math.sin(angle) * radius
            + Math.cos(angle) * tangent;
          const alpha = Math.min(0.82, style.intensity * particle.opacity * fade);
          if (alpha < 0.01) return;

          context.globalAlpha = alpha;
          context.fillRect(x, y, particle.size, particle.size);
        });
      });
      context.globalAlpha = 1;
    }

    function drawField(time, orbit) {
      const style = orbitStyle(orbit);
      const loading = body.classList.contains('is-loading');
      if (loading) {
        drawLoadingField(time);
        return;
      }

      context.globalCompositeOperation = orbit === 'thinking' ? 'source-over' : 'lighter';
      refreshSafetyRects(orbit);
      drawCurrentGuides(style);
      drawRimDust(time, style);
      drawDust(time, orbit, style);
      state.particles.forEach((particle) => {
        sampleStream(particle, time, 0, point);
        sampleStream(particle, time, -0.012, previous);
        pointerDisturbance(point);
        pointerDisturbance(previous);

        const safety = textSafetyAlpha(point.x, point.y);
        const shimmer = 0.84 + Math.sin(time * 0.0011 + particle.shimmer) * 0.16;
        const laneBoost = particle.lane === 2 ? 0.94 : 1;
        const alpha = style.intensity * particle.opacity * point.fade * shimmer * safety * laneBoost;
        if (alpha < 0.012) return;

        const color = particle.silver
          ? { red: 220, green: 235, blue: 244 }
          : style;
        const tailAlpha = alpha * (particle.lane === 2 ? 0.2 : 0.42);

        context.strokeStyle = `rgba(${color.red},${color.green},${color.blue},${tailAlpha})`;
        context.lineWidth = Math.max(0.34, particle.size * 0.46);
        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(point.x, point.y);
        context.stroke();

        context.fillStyle = `rgba(${color.red},${color.green},${color.blue},${alpha})`;
        context.beginPath();
        const pointScale = particle.lane === 2 ? 0.82 : 1;
        context.arc(point.x, point.y, particle.size * pointScale * (1 + state.pulse * 0.12), 0, tau);
        context.fill();
      });
    }

    function render(time) {
      state.frame = 0;
      if (!state.visible) return;

      const minFrame = state.compact || lowPower ? 31 : 21;
      if (time - state.lastFrame < minFrame) {
        state.frame = window.requestAnimationFrame(render);
        return;
      }
      state.lastFrame = time;

      const orbit = getOrbit();
      updatePlanet(orbit);
      state.pointerX = lerp(state.pointerX, state.pointerTargetX, 0.11);
      state.pointerY = lerp(state.pointerY, state.pointerTargetY, 0.11);
      state.pointerEnergy = Math.max(0, state.pointerEnergy * 0.986);
      state.pulse = Math.max(0, state.pulse * 0.94);

      context.clearRect(0, 0, state.width, state.height);
      drawField(time, orbit);
      state.frame = window.requestAnimationFrame(render);
    }

    function start() {
      if (!state.frame && state.visible) state.frame = window.requestAnimationFrame(render);
    }

    resize();
    state.pointerTargetX = state.width * 0.64;
    state.pointerTargetY = state.height * 0.44;
    state.pointerX = state.pointerTargetX;
    state.pointerY = state.pointerTargetY;
    start();

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        start();
      }, 140);
    });

    if (finePointer) {
      window.addEventListener('pointermove', (event) => {
        state.pointerTargetX = event.clientX;
        state.pointerTargetY = event.clientY;
        state.pointerEnergy = Math.min(1, state.pointerEnergy + 0.12);
      }, { passive: true });

      window.addEventListener('pointerdown', (event) => {
        state.pointerTargetX = event.clientX;
        state.pointerTargetY = event.clientY;
        state.pointerEnergy = 1;
        state.pulse = 1;
      }, { passive: true });
    }

    document.addEventListener('visibilitychange', () => {
      state.visible = !document.hidden;
      if (!state.visible && state.frame) {
        window.cancelAnimationFrame(state.frame);
        state.frame = 0;
      } else {
        state.lastFrame = 0;
        start();
      }
    });
  }

  function setupHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero || prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      hero.style.setProperty('--pointer-x', targetX.toFixed(3));
      hero.style.setProperty('--pointer-y', targetY.toFixed(3));
      frame = 0;
    };

    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!frame) frame = window.requestAnimationFrame(render);
    });

    hero.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = window.requestAnimationFrame(render);
    });
  }

  setupGravityField();
  dismissLoader();
  setupReveal();
  setupNavigation();
  setupMobileMenu();
  setupNeptuneCompanion();
  setupExperience();
  setupHeroParallax();
})();

