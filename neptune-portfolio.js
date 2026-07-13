(() => {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const body = document.body;

  function initLoaderGalaxy() {
    const canvas = document.querySelector('[data-loader-galaxy]');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars = [];
    let raf = 0;

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      width = innerWidth;
      height = innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = innerWidth < 760 ? 170 : 340;
      stars = Array.from({ length: count }, (_, index) => {
        const arm = index % 5;
        const radius = Math.pow(Math.random(), 0.58) * 0.48;
        const angle = radius * 10 + arm * Math.PI * 0.4 + (Math.random() - 0.5) * 0.45;
        return {
          radius,
          angle,
          speed: 0.00009 + Math.random() * 0.00028,
          size: 0.55 + Math.random() * 1.7,
          alpha: 0.2 + Math.random() * 0.68,
          drift: Math.random() * Math.PI * 2
        };
      });
    };

    const draw = (time = 0) => {
      if (!canvas.isConnected) return;
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.5;
      const scale = Math.min(width, height);

      ctx.globalCompositeOperation = 'lighter';
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.52);
      core.addColorStop(0, 'rgba(220,250,255,0.36)');
      core.addColorStop(0.14, 'rgba(117,215,255,0.18)');
      core.addColorStop(0.42, 'rgba(30,91,255,0.08)');
      core.addColorStop(1, 'rgba(30,91,255,0)');
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.34 + Math.sin(time * 0.00018) * 0.04);
      ctx.scale(1.55, 0.48);
      for (let ring = 0; ring < 4; ring += 1) {
        ctx.beginPath();
        ctx.arc(0, 0, scale * (0.15 + ring * 0.09), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(117,215,255,${0.13 - ring * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      stars.forEach((star) => {
        const radius = star.radius * scale;
        const angle = star.angle + time * star.speed;
        const wobble = Math.sin(time * 0.00045 + star.drift) * 8;
        const x = cx + Math.cos(angle) * radius * 1.5 + wobble;
        const y = cy + Math.sin(angle) * radius * 0.48 + Math.cos(star.drift + time * 0.0003) * 5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(190,242,255,${star.alpha})`;
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';
      if (!prefersReduced) raf = requestAnimationFrame(draw);
    };

    addEventListener('resize', resize, { passive: true });
    resize();
    draw();
    addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
  }

  function initLoader() {
    const loader = document.querySelector('.site-loader');
    if (!loader) return;
    body.classList.add('is-locked');
    const word = loader.querySelector('[data-loader-word]');
    const count = loader.querySelector('[data-loader-count]');
    const line = loader.querySelector('.loader-line b');
    const actions = loader.querySelector('[data-loader-actions]');
    const enterButtons = [...loader.querySelectorAll('[data-enter-site]')];
    const target = '校准第八轨道';
    const chars = '海王星轨道NEPTUNE0123456789';
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
        body: '在真实消费科技团队里参与发布传播、场景包装、发布会节奏、KOL 视角和 AI 工作流实践。'
      },
      cuhk: {
        title: 'CUHK Sustainable Tourism',
        body: '进入可持续旅游和地理相关数字体验研究，关注人、地点和系统之间的关系。'
      },
      nanhai: {
        title: 'Nanhai Conference',
        body: '参与深海科技论坛执行：展览规划、参观动线、双语材料和现场协调。'
      },
      jw: {
        title: 'JW Marriott Hospitality',
        body: '宾客关系工作训练了直接倾听：真实需求、服务断点，以及体验如何在细节里失效。'
      },
      cityu: {
        title: 'City University of Macau',
        body: '国际旅游与酒店管理基础，来自英文课程、研究训练和跨文化环境。'
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

  function initNeptuneParticles() {
    const canvas = document.querySelector('[data-neptune-particles]');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = 1;
    let atmosphere = [];
    let ringDots = [];
    let glints = [];
    let raf = 0;
    const pointer = {
      x: 0.54,
      y: 0.42,
      tx: 0.54,
      ty: 0.42,
      power: 0
    };

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

      const atmosphereCount = innerWidth < 760 ? 130 : 220;
      atmosphere = Array.from({ length: atmosphereCount }, (_, index) => ({
        angle: (index / atmosphereCount) * Math.PI * 2 + Math.random() * 0.08,
        radius: 0.86 + Math.random() * 0.23,
        speed: 0.00004 + Math.random() * 0.00014,
        size: 0.7 + Math.random() * 1.9,
        alpha: 0.08 + Math.random() * 0.28,
        tint: Math.random() > 0.72 ? '221,247,255' : Math.random() > 0.42 ? '117,215,255' : '47,107,255'
      }));

      const ringCount = innerWidth < 760 ? 120 : 220;
      ringDots = Array.from({ length: ringCount }, (_, index) => ({
        angle: (index / ringCount) * Math.PI * 2,
        offset: (Math.random() - 0.5) * 0.16,
        speed: 0.00018 + Math.random() * 0.00026,
        size: 0.55 + Math.random() * 1.2,
        alpha: 0.12 + Math.random() * 0.32
      }));

      const glintCount = innerWidth < 760 ? 22 : 34;
      glints = Array.from({ length: glintCount }, () => ({
        x: -0.74 + Math.random() * 1.48,
        y: -0.66 + Math.random() * 1.32,
        speed: 0.00008 + Math.random() * 0.00018,
        phase: Math.random() * Math.PI * 2,
        size: 0.45 + Math.random() * 1.15,
        alpha: 0.07 + Math.random() * 0.16
      }));
    };

    const sphereFrame = () => {
      const mobile = innerWidth < 760;
      const cx = width * (mobile ? 0.5 : 0.52);
      const cy = height * (mobile ? 0.39 : 0.35);
      const radius = Math.min(width, height) * (mobile ? 0.285 : 0.29);
      return { cx, cy, radius };
    };

    const drawOrbit = (frame, time, front) => {
      const scroll = Number(getComputedStyle(root).getPropertyValue('--scroll')) || 0;
      const rotation = -0.18 + scroll * 0.34 + (pointer.x - 0.5) * 0.08;
      const rx = frame.radius * 1.82;
      const ry = frame.radius * 0.3;
      const start = front ? 0 : Math.PI;
      const end = front ? Math.PI : Math.PI * 2;

      ctx.save();
      ctx.translate(frame.cx, frame.cy + frame.radius * 0.06);
      ctx.rotate(rotation);
      ctx.scale(1, 0.98);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, start, end);
      ctx.strokeStyle = front ? 'rgba(190,246,255,0.28)' : 'rgba(117,215,255,0.09)';
      ctx.lineWidth = front ? 1.15 : 0.75;
      ctx.stroke();
      ctx.restore();

      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      ringDots.forEach((dot) => {
        const angle = dot.angle + time * dot.speed;
        const isFront = Math.sin(angle) > 0;
        if (isFront !== front) return;
        const localX = Math.cos(angle) * rx * (1 + dot.offset);
        const localY = Math.sin(angle) * ry * (1 + dot.offset);
        let x = frame.cx + localX * cos - localY * sin;
        let y = frame.cy + frame.radius * 0.06 + localX * sin + localY * cos;
        const dx = x - pointer.x * width;
        const dy = y - pointer.y * height;
        const distance = Math.hypot(dx, dy) || 1;
        const influence = Math.exp(-(distance * distance) / (frame.radius * frame.radius * 0.72)) * pointer.power;
        x += (dx / distance) * influence * 24;
        y += (dy / distance) * influence * 16;
        ctx.beginPath();
        ctx.fillStyle = `rgba(190,246,255,${dot.alpha + influence * 0.5})`;
        ctx.arc(x, y, dot.size * (front ? 1.1 : 0.8) * (1 + influence), 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawCloudBand = (frame, lat, widthScale, alpha, color, time, phase) => {
      const y = frame.cy + lat * frame.radius;
      const bandWidth = frame.radius * widthScale;
      const lineWidth = Math.max(3, frame.radius * (0.018 + alpha * 0.04));
      ctx.beginPath();
      for (let i = 0; i <= 150; i += 1) {
        const t = i / 150;
        const x = frame.cx - bandWidth + t * bandWidth * 2;
        const local = (x - frame.cx) / frame.radius;
        if (Math.abs(local) > 1) continue;
        const curve = Math.sqrt(Math.max(0, 1 - local * local));
        const wave =
          Math.sin(t * Math.PI * 5.2 + time * 0.00042 + phase) * frame.radius * 0.015 +
          Math.sin(t * Math.PI * 13.5 - time * 0.00028 + phase * 1.7) * frame.radius * 0.007;
        const yy = y + wave + (1 - curve) * frame.radius * 0.025 * Math.sign(lat || 1);
        if (i === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(${color},${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const drawStorm = (frame, x, y, rx, ry, rotation, alpha, color) => {
      ctx.save();
      ctx.translate(frame.cx + x * frame.radius, frame.cy + y * frame.radius);
      ctx.rotate(rotation);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, frame.radius * rx);
      gradient.addColorStop(0, `rgba(${color},${alpha})`);
      gradient.addColorStop(0.58, `rgba(${color},${alpha * 0.28})`);
      gradient.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = gradient;
      ctx.scale(1, ry / rx);
      ctx.beginPath();
      ctx.arc(0, 0, frame.radius * rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawPlanet = (frame, time) => {
      const influenceX = (pointer.x * width - frame.cx) / frame.radius;
      const influenceY = (pointer.y * height - frame.cy) / frame.radius;
      const pointerDistance = Math.hypot(influenceX, influenceY);
      const surfaceInfluence = Math.max(0, 1 - pointerDistance) * pointer.power;

      ctx.globalCompositeOperation = 'source-over';
      ctx.save();
      ctx.beginPath();
      ctx.arc(frame.cx, frame.cy, frame.radius, 0, Math.PI * 2);
      ctx.clip();

      const body = ctx.createRadialGradient(
        frame.cx - frame.radius * 0.36,
        frame.cy - frame.radius * 0.42,
        frame.radius * 0.08,
        frame.cx + frame.radius * 0.24,
        frame.cy + frame.radius * 0.22,
        frame.radius * 1.12
      );
      body.addColorStop(0, 'rgba(226,252,255,0.88)');
      body.addColorStop(0.1, 'rgba(139,232,255,0.94)');
      body.addColorStop(0.34, 'rgba(49,154,255,1)');
      body.addColorStop(0.62, 'rgba(29,82,212,1)');
      body.addColorStop(0.84, 'rgba(14,42,132,1)');
      body.addColorStop(1, 'rgba(4,12,42,1)');
      ctx.fillStyle = body;
      ctx.fillRect(frame.cx - frame.radius, frame.cy - frame.radius, frame.radius * 2, frame.radius * 2);

      ctx.globalCompositeOperation = 'screen';
      [
        [-0.58, 1.5, 0.12, '217,250,255', 0.2],
        [-0.44, 1.56, 0.1, '117,215,255', 1.1],
        [-0.29, 1.72, 0.15, '232,253,255', 2.0],
        [-0.12, 1.68, 0.08, '78,186,255', 3.3],
        [0.04, 1.76, 0.14, '209,246,255', 4.4],
        [0.18, 1.62, 0.1, '80,181,255', 5.2],
        [0.34, 1.5, 0.12, '224,250,255', 6.3],
        [0.5, 1.36, 0.08, '117,215,255', 7.1]
      ].forEach(([lat, scale, alpha, color, phase]) => drawCloudBand(frame, lat, scale, alpha, color, time, phase));

      ctx.globalCompositeOperation = 'multiply';
      [
        [-0.1, -0.18, 0.28, 0.1, -0.18, 0.18, '3,10,42'],
        [0.36, 0.24, 0.22, 0.08, 0.32, 0.18, '5,12,52'],
        [-0.42, 0.36, 0.18, 0.07, -0.1, 0.16, '6,16,70']
      ].forEach(([x, y, rx, ry, rotation, alpha, color]) => drawStorm(frame, x, y, rx, ry, rotation, alpha, color));

      ctx.globalCompositeOperation = 'screen';
      drawStorm(frame, -0.42, -0.34, 0.23, 0.14, -0.45, 0.12, '255,255,255');
      drawStorm(frame, 0.18, 0.05, 0.2, 0.1, 0.1, 0.1, '117,215,255');

      if (surfaceInfluence > 0.02) {
        const lens = ctx.createRadialGradient(
          pointer.x * width,
          pointer.y * height,
          0,
          pointer.x * width,
          pointer.y * height,
          frame.radius * 0.55
        );
        lens.addColorStop(0, `rgba(221,247,255,${0.22 * surfaceInfluence})`);
        lens.addColorStop(0.38, `rgba(117,215,255,${0.13 * surfaceInfluence})`);
        lens.addColorStop(1, 'rgba(117,215,255,0)');
        ctx.fillStyle = lens;
        ctx.fillRect(frame.cx - frame.radius, frame.cy - frame.radius, frame.radius * 2, frame.radius * 2);
      }

      ctx.globalCompositeOperation = 'source-over';
      const shadow = ctx.createRadialGradient(
        frame.cx - frame.radius * 0.16,
        frame.cy - frame.radius * 0.28,
        frame.radius * 0.24,
        frame.cx + frame.radius * 0.36,
        frame.cy + frame.radius * 0.32,
        frame.radius * 1.24
      );
      shadow.addColorStop(0, 'rgba(0,0,0,0)');
      shadow.addColorStop(0.62, 'rgba(3,6,20,0.04)');
      shadow.addColorStop(0.88, 'rgba(1,3,12,0.34)');
      shadow.addColorStop(1, 'rgba(0,0,0,0.62)');
      ctx.fillStyle = shadow;
      ctx.fillRect(frame.cx - frame.radius, frame.cy - frame.radius, frame.radius * 2, frame.radius * 2);

      glints.forEach((glint) => {
        const wobble = Math.sin(time * glint.speed + glint.phase) * 0.018;
        const x = frame.cx + (glint.x + wobble) * frame.radius;
        const y = frame.cy + glint.y * frame.radius * 0.9;
        if (Math.hypot(x - frame.cx, (y - frame.cy) / 0.94) > frame.radius * 0.95) return;
        ctx.beginPath();
        ctx.fillStyle = `rgba(221,247,255,${glint.alpha})`;
        ctx.arc(x, y, glint.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      ctx.globalCompositeOperation = 'lighter';
      const rim = ctx.createRadialGradient(frame.cx, frame.cy, frame.radius * 0.78, frame.cx, frame.cy, frame.radius * 1.16);
      rim.addColorStop(0, 'rgba(117,215,255,0)');
      rim.addColorStop(0.78, 'rgba(117,215,255,0.045)');
      rim.addColorStop(0.92, 'rgba(180,244,255,0.2)');
      rim.addColorStop(1, 'rgba(180,244,255,0)');
      ctx.beginPath();
      ctx.arc(frame.cx, frame.cy, frame.radius * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = rim;
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawAtmosphere = (frame, time) => {
      ctx.globalCompositeOperation = 'lighter';
      atmosphere.forEach((dot) => {
        const angle = dot.angle + time * dot.speed;
        const x = frame.cx + Math.cos(angle) * frame.radius * dot.radius;
        const y = frame.cy + Math.sin(angle) * frame.radius * dot.radius * 0.86;
        const dx = x - pointer.x * width;
        const dy = y - pointer.y * height;
        const distance = Math.hypot(dx, dy) || 1;
        const influence = Math.exp(-(distance * distance) / (frame.radius * frame.radius * 0.8)) * pointer.power;
        const push = influence * 24;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${dot.tint},${dot.alpha + influence * 0.34})`;
        ctx.arc(x + (dx / distance) * push, y + (dy / distance) * push, dot.size * (1 + influence * 1.1), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
    };

    const render = (time = 0) => {
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      pointer.power *= 0.94;

      const frame = sphereFrame();

      ctx.globalCompositeOperation = 'lighter';
      const aura = ctx.createRadialGradient(frame.cx, frame.cy, frame.radius * 0.15, frame.cx, frame.cy, frame.radius * 2.15);
      aura.addColorStop(0, 'rgba(117,215,255,0.16)');
      aura.addColorStop(0.36, 'rgba(30,91,255,0.08)');
      aura.addColorStop(0.72, 'rgba(122,92,255,0.04)');
      aura.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = aura;
      ctx.fillRect(frame.cx - frame.radius * 2.2, frame.cy - frame.radius * 2.2, frame.radius * 4.4, frame.radius * 4.4);

      drawOrbit(frame, time, false);
      drawPlanet(frame, time);
      drawAtmosphere(frame, time);
      drawOrbit(frame, time, true);

      ctx.globalCompositeOperation = 'source-over';
      if (!prefersReduced) raf = requestAnimationFrame(render);
    };

    addEventListener('pointermove', (event) => {
      pointer.tx = event.clientX / innerWidth;
      pointer.ty = event.clientY / innerHeight;
      pointer.power = Math.min(1.4, pointer.power + 0.08);
    }, { passive: true });
    addEventListener('click', (event) => {
      pointer.tx = event.clientX / innerWidth;
      pointer.ty = event.clientY / innerHeight;
      pointer.power = 1.5;
    });
    addEventListener('resize', resize, { passive: true });
    resize();
    render();
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

  initLoaderGalaxy();
  initLoader();
  initNavigation();
  initReveal();
  initGravityField();
  initNeptuneParticles();
  initOceanField();
  initPointerField();
  initTilt();
  initTimeline();
  initSectionTransitions();
  initKeyboardFocus();
})();
