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
    const target = 'NEPTUNE';
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let progress = 0;

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
        setTimeout(() => loader.classList.add('is-hidden'), prefersReduced ? 30 : 420);
        setTimeout(() => {
          loader.remove();
          body.classList.remove('is-locked');
        }, prefersReduced ? 80 : 1150);
      }
    };

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

  initLoader();
  initNavigation();
  initReveal();
  initPointerField();
  initTilt();
  initTimeline();
  initKeyboardFocus();
})();
