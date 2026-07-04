(() => {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const style = document.createElement('style');
  style.textContent = `
    .ambient-canvas{
      position:fixed;
      inset:0;
      width:100vw;
      height:100vh;
      pointer-events:none;
      z-index:3;
    }
    #rippleLayer{
      opacity:.28;
      mix-blend-mode:screen;
    }
    #particleLayer{
      opacity:.52;
      mix-blend-mode:screen;
    }
    body.lang-zh #rippleLayer{opacity:.24}
    @media(max-width:900px){
      #rippleLayer{opacity:.18}
      #particleLayer{opacity:.38}
    }
  `;
  document.head.appendChild(style);

  const ripple = document.createElement('canvas');
  ripple.id = 'rippleLayer';
  ripple.className = 'ambient-canvas';

  const particles = document.createElement('canvas');
  particles.id = 'particleLayer';
  particles.className = 'ambient-canvas';

  document.body.prepend(particles);
  document.body.prepend(ripple);

  const rctx = ripple.getContext('2d');
  const pctx = particles.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let w = 0;
  let h = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let dots = [];

  function sectionFactor(){
    const y = window.scrollY || 0;
    const vh = window.innerHeight || 1;
    const hero = y < vh * .9;
    const lens = document.getElementById('lens');
    const lensRect = lens ? lens.getBoundingClientRect() : null;
    const inLens = lensRect && lensRect.top < vh * .9 && lensRect.bottom > vh * .1;
    return { hero, inLens };
  }

  function makeParticles(){
    const count = Math.max(34, Math.min(92, Math.floor((w * h) / 22000)));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.9 + .45,
      a: Math.random() * .26 + .06,
      vx: (Math.random() - .5) * .16,
      vy: (Math.random() - .5) * .14,
      drift: Math.random() * Math.PI * 2,
      blur: Math.random() > .72
    }));
  }

  function resize(){
    w = window.innerWidth;
    h = window.innerHeight;
    [ripple, particles].forEach(c => {
      c.width = Math.floor(w * DPR);
      c.height = Math.floor(h * DPR);
      c.style.width = w + 'px';
      c.style.height = h + 'px';
    });
    rctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    pctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    targetX = mouseX = w * .62;
    targetY = mouseY = h * .42;
    makeParticles();
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  function drawRipple(t){
    const time = t * .001;
    const { hero, inLens } = sectionFactor();
    const alpha = hero ? 1 : inLens ? .34 : .58;

    mouseX += (targetX - mouseX) * .035;
    mouseY += (targetY - mouseY) * .035;

    rctx.clearRect(0, 0, w, h);
    rctx.save();
    rctx.globalAlpha = alpha;

    const centerX = w * .66 + Math.sin(time * .22) * 46 + (mouseX - w / 2) * .025;
    const centerY = h * .44 + Math.cos(time * .2) * 32 + (mouseY - h / 2) * .025;

    for(let i = 0; i < 7; i++){
      const radius = 130 + i * 86 + Math.sin(time * .72 + i * .9) * 22;
      const x = centerX + Math.sin(time * .3 + i) * 18;
      const y = centerY + Math.cos(time * .26 + i) * 14;
      const g = rctx.createRadialGradient(x, y, radius * .28, x, y, radius);
      g.addColorStop(0, 'rgba(70,145,255,0)');
      g.addColorStop(.48, 'rgba(92,165,255,.035)');
      g.addColorStop(.67, 'rgba(190,230,255,.082)');
      g.addColorStop(.72, 'rgba(255,255,255,.035)');
      g.addColorStop(1, 'rgba(92,165,255,0)');
      rctx.beginPath();
      rctx.fillStyle = g;
      rctx.arc(x, y, radius, 0, Math.PI * 2);
      rctx.fill();
    }

    for(let j = 0; j < 5; j++){
      rctx.beginPath();
      const y = h * (.22 + j * .13) + Math.sin(time * .45 + j) * 34;
      rctx.strokeStyle = `rgba(170,220,255,${.035 + j * .004})`;
      rctx.lineWidth = 1;
      for(let x = -80; x <= w + 80; x += 24){
        const yy = y + Math.sin(x * .008 + time * .9 + j) * (12 + j * 2);
        if(x === -80) rctx.moveTo(x, yy); else rctx.lineTo(x, yy);
      }
      rctx.stroke();
    }

    rctx.restore();
    requestAnimationFrame(drawRipple);
  }

  function drawParticles(t){
    const time = t * .001;
    const { hero, inLens } = sectionFactor();
    const alpha = hero ? .92 : inLens ? .3 : .68;

    pctx.clearRect(0, 0, w, h);
    pctx.save();
    pctx.globalAlpha = alpha;

    for(const p of dots){
      p.drift += .004;
      p.x += p.vx + Math.sin(time * .35 + p.drift) * .035;
      p.y += p.vy + Math.cos(time * .32 + p.drift) * .032;
      if(p.x < -30) p.x = w + 30;
      if(p.x > w + 30) p.x = -30;
      if(p.y < -30) p.y = h + 30;
      if(p.y > h + 30) p.y = -30;
      pctx.beginPath();
      pctx.shadowBlur = p.blur ? 14 : 0;
      pctx.shadowColor = 'rgba(160,210,255,.45)';
      pctx.fillStyle = `rgba(220,238,255,${p.a})`;
      pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pctx.fill();
    }

    pctx.restore();
    requestAnimationFrame(drawParticles);
  }

  resize();
  requestAnimationFrame(drawRipple);
  requestAnimationFrame(drawParticles);
})();