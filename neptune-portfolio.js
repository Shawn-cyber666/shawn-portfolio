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
    await delay(prefersReducedMotion ? 40 : 180);
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

  dismissLoader();
  setupReveal();
  setupNavigation();
  setupMobileMenu();
  setupNeptuneCompanion();
  setupExperience();
  setupHeroParallax();
})();

