(() => {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const body = document.body;

  function initLoader() {
    const loader = document.querySelector('.site-loader');
    if (!loader) return;
    body.classList.add('is-locked');
    const word = loader.querySelector('[data-loader-word]');
    const count = loader.querySelector('[data-loader-count]');
    const line = loader.querySelector('.loader-line b');
    const actions = loader.querySelector('[data-loader-actions]');
    const enterButtons = [...loader.querySelectorAll('[data-enter-site]')];
    const target = 'EIGHTH ORBIT';
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let progress = 0;
    let ready = false;

    const closeLoader = () => {
      if (!ready) return;
      loader.classList.add('is-hidden');
      body.classList.remove('is-locked');
      setTimeout(() => loader.remove(), prefersReduced ? 80 : 900);
    };

    const tick = () => {
      progress = Math.min(100, progress + (100 - progress) * 0.18 + 2.1);
      const locked = Math.floor(target.length * (progress / 100));
      const scrambled = Array.from({ length: target.length - locked }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      word.textContent = target.slice(0, locked) + scrambled;
      count.textContent = String(Math.floor(progress)).padStart(3, '0');
      line.style.width = `${progress}%`;
      if (progress < 99) {
        setTimeout(tick, prefersReduced ? 1 : 42);
      } else {
        word.textContent = target;
        count.textContent = '100';
        ready = true;
        loader.classList.add('is-ready');
        actions?.removeAttribute('aria-hidden');
        enterButtons[0]?.focus({ preventScroll: true });
        if (prefersReduced) closeLoader();
      }
    };

    enterButtons.forEach((button) => button.addEventListener('click', closeLoader));
    loader.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      closeLoader();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') closeLoader();
    }, { once: true });
    tick();
  }

  function initNavigation() {
    const nav = document.querySelector('[data-nav]');
    const menuButton = document.querySelector('[data-menu-button]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    const sync = () => {
      nav?.classList.toggle('is-scrolled', scrollY > 24);
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? scrollY / max : 0;
      document.querySelector('.progress-line span').style.width = `${progress * 100}%`;
      root.style.setProperty('--scroll', progress.toFixed(4));
    };

    menuButton?.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('is-open');
      mobileMenu.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
      body.classList.toggle('is-locked', open);
    });

    mobileMenu?.addEventListener('click', (event) => {
      if (!event.target.closest('a')) return;
      mobileMenu.classList.remove('is-open');
      menuButton?.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      body.classList.remove('is-locked');
    });

    addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync, { passive: true });
    sync();
  }

  function initReveal() {
    const items = [...document.querySelectorAll('.reveal')];
    if (!items.length) return;
    if (prefersReduced) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
      observer.observe(item);
    });
  }

  function initPointerField() {
    if (prefersReduced || innerWidth < 760) return;
    const cursor = document.querySelector('.orbit-cursor');
    let x = innerWidth * 0.5;
    let y = innerHeight * 0.5;
    let tx = x;
    let ty = y;
    const hoverSelector = 'a,button,[data-tilt],.timeline-node,.writing-item';

    addEventListener('pointermove', (event) => {
      tx = event.clientX;
      ty = event.clientY;
      root.style.setProperty('--mx', ((tx / innerWidth) - 0.5).toFixed(4));
      root.style.setProperty('--my', ((ty / innerHeight) - 0.5).toFixed(4));
    }, { passive: true });

    document.addEventListener('pointerover', (event) => {
      if (event.target.closest(hoverSelector)) cursor?.classList.add('is-hover');
    });
    document.addEventListener('pointerout', (event) => {
      if (event.target.closest(hoverSelector)) cursor?.classList.remove('is-hover');
    });

    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      if (cursor) cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  function initTilt() {
    if (prefersReduced || innerWidth < 900) return;
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width) * 100;
        const py = ((event.clientY - rect.top) / rect.height) * 100;
        const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
        const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
        card.style.setProperty('--px', `${px}%`);
        card.style.setProperty('--py', `${py}%`);
        card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        card.style.removeProperty('--px');
        card.style.removeProperty('--py');
      });
    });
  }

  function initTimeline() {
    const data = {
      vivo: {
        title: 'vivo Product Marketing',
        body: 'Launch communication, scenario packaging, keynote rhythm, KOL perspective, and AI workflow practice inside a real consumer-tech team.'
      },
      cuhk: {
        title: 'CUHK Sustainable Tourism',
        body: 'A master path into sustainable tourism and geography-related digital experience research, with attention to people, places, and systems.'
      },
      nanhai: {
        title: 'Nanhai Conference',
        body: 'Deep-sea technology forum execution: exhibition planning, visitor flow, bilingual materials, and on-site coordination.'
      },
      jw: {
        title: 'JW Marriott Hospitality',
        body: 'Guest relations work that trained direct listening: real needs, service gaps, and how experience breaks down in small moments.'
      },
      cityu: {
        title: 'City University of Macau',
        body: 'International tourism and hotel management foundation, shaped by English coursework, research practice, and cross-cultural contexts.'
      }
    };
    const detail = document.querySelector('[data-timeline-detail]');
    const nodes = [...document.querySelectorAll('.timeline-node')];
    if (!detail || !nodes.length) return;

    const setActive = (node) => {
      const item = data[node.dataset.timeline];
      if (!item) return;
      nodes.forEach((n) => n.classList.toggle('is-active', n === node));
      detail.querySelector('h3').textContent = item.title;
      detail.querySelector('p').textContent = item.body;
    };

    nodes.forEach((node) => {
      node.addEventListener('mouseenter', () => setActive(node));
      node.addEventListener('focus', () => setActive(node));
      node.addEventListener('click', () => setActive(node));
    });
  }

  function initGravityField() {
    const canvas = document.querySelector('[data-gravity-field]');
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let pointerX = 0.72;
    let pointerY = 0.42;
    let particles = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = innerWidth < 760 ? 76 : 150;
      particles = Array.from({ length: count }, (_, index) => {
        const ring = index % 4;
        return {
          angle: (index / count) * Math.PI * 2 + ring * 0.38,
          radius: 0.16 + ring * 0.105 + Math.random() * 0.06,
          speed: 0.00045 + Math.random() * 0.00075,
          size: 0.7 + Math.random() * 1.4,
          drift: Math.random() * Math.PI * 2
        };
      });
    };

    const drawOrbit = (cx, cy, rx, ry, rotate, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotate);
      ctx.scale(rx, ry);
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.restore();
      ctx.strokeStyle = `rgba(117,215,255,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);
      const scroll = Number(getComputedStyle(root).getPropertyValue('--scroll')) || 0;
      const cx = width * (innerWidth < 760 ? 0.64 : 0.72);
      const cy = height * (innerWidth < 760 ? 0.36 : 0.48);
      const pullX = (pointerX - 0.5) * 34;
      const pullY = (pointerY - 0.5) * 26;

      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(cx + pullX, cy + pullY, 0, cx + pullX, cy + pullY, Math.max(width, height) * 0.48);
      glow.addColorStop(0, 'rgba(117,215,255,0.12)');
      glow.addColorStop(0.42, 'rgba(30,91,255,0.04)');
      glow.addColorStop(1, 'rgba(30,91,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      drawOrbit(cx + pullX * 0.35, cy + pullY * 0.2, width * 0.38, height * 0.18, -0.28 + scroll * 0.9, 0.13);
      drawOrbit(cx - 20, cy + 12, width * 0.48, height * 0.21, 0.18 - scroll * 0.7, 0.08);

      particles.forEach((p, index) => {
        const angle = p.angle + time * p.speed + scroll * (index % 2 ? 1.6 : -1.15);
        const rx = width * (p.radius + 0.04 * Math.sin(p.drift + time * 0.0003));
        const ry = height * (p.radius * 0.42);
        const x = cx + Math.cos(angle) * rx + pullX * (0.2 + p.radius);
        const y = cy + Math.sin(angle) * ry + pullY * (0.2 + p.radius);
        const distance = Math.hypot(x - pointerX * width, y - pointerY * height);
        const alpha = Math.max(0.08, 0.42 - distance / Math.max(width, height));
        ctx.beginPath();
        ctx.fillStyle = `rgba(170,226,255,${alpha})`;
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(render);
    };

    addEventListener('pointermove', (event) => {
      pointerX = event.clientX / innerWidth;
      pointerY = event.clientY / innerHeight;
    }, { passive: true });
    addEventListener('resize', resize, { passive: true });
    resize();
    raf = requestAnimationFrame(render);
    addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
  }

  function initOceanField() {
    const canvas = document.querySelector('[data-ocean-field]');
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = 1;
    let ripple = { x: 0.5, y: 0.42, power: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      const scroll = Number(getComputedStyle(root).getPropertyValue('--scroll')) || 0;
      const horizon = height * 0.18;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(0,180,255,0.02)');
      gradient.addColorStop(0.24, 'rgba(0,180,255,0.18)');
      gradient.addColorStop(0.58, 'rgba(30,91,255,0.18)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.18)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 44; i += 1) {
        const depth = i / 44;
        const y = horizon + depth * depth * height * 0.92;
        const amp = 6 + depth * 28 + ripple.power * 18;
        const speed = time * (0.00045 + depth * 0.00028);
        ctx.beginPath();
        for (let x = -40; x <= width + 40; x += 18) {
          const pull = Math.exp(-Math.abs(x - ripple.x * width) / 260) * ripple.power * 18;
          const wave = Math.sin(x * 0.012 + speed + i * 0.6) * amp * depth;
          const wave2 = Math.cos(x * 0.026 - speed * 1.6) * amp * 0.24;
          const yy = y + wave + wave2 + pull * Math.sin(time * 0.004 + i);
          if (x === -40) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.strokeStyle = `rgba(117,215,255,${0.03 + depth * 0.16})`;
        ctx.lineWidth = 0.7 + depth * 1.1;
        ctx.stroke();
      }

      for (let i = 0; i < 70; i += 1) {
        const seed = Math.sin(i * 145.43) * 10000;
        const x = (seed - Math.floor(seed)) * width;
        const y = horizon + ((Math.sin(i * 78.91) * 10000) % 1 + 1) % 1 * height * 0.8;
        const drift = Math.sin(time * 0.001 + i) * 18;
        const alpha = 0.08 + ((i % 5) / 5) * 0.18;
        ctx.fillStyle = `rgba(190,230,255,${alpha})`;
        ctx.fillRect(x + drift, y, 1.6, 1.6);
      }

      ctx.globalCompositeOperation = 'source-over';
      ripple.power *= 0.94;
      requestAnimationFrame(draw);
    };

    addEventListener('pointermove', (event) => {
      ripple.x = event.clientX / innerWidth;
      ripple.y = event.clientY / innerHeight;
      ripple.power = Math.min(1, ripple.power + 0.035);
    }, { passive: true });
    addEventListener('click', (event) => {
      ripple.x = event.clientX / innerWidth;
      ripple.y = event.clientY / innerHeight;
      ripple.power = 1;
    });
    addEventListener('resize', resize, { passive: true });
    resize();
    requestAnimationFrame(draw);
  }

  function initKeyboardFocus() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const menu = document.querySelector('[data-mobile-menu]');
        const button = document.querySelector('[data-menu-button]');
        menu?.classList.remove('is-open');
        menu?.setAttribute('aria-hidden', 'true');
        button?.setAttribute('aria-expanded', 'false');
        body.classList.remove('is-locked');
      }
    });
  }

  function initSectionTransitions() {
    if (prefersReduced) return;
    const wipe = document.querySelector('.page-wipe');
    if (!wipe) return;
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      wipe.classList.remove('is-leaving');
      wipe.classList.add('is-active');
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        wipe.classList.add('is-leaving');
        wipe.classList.remove('is-active');
      }, 240);
      setTimeout(() => wipe.classList.remove('is-leaving'), 620);
    });
  }

  initLoader();
  initNavigation();
  initReveal();
  initGravityField();
  initOceanField();
  initPointerField();
  initTilt();
  initTimeline();
  initSectionTransitions();
  initKeyboardFocus();
})();
