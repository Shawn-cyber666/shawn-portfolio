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
      opacity:.52;
      mix-blend-mode:screen;
    }
    #particleLayer{
      opacity:.62;
      mix-blend-mode:screen;
    }
    .ambient-vignette{
      position:fixed;
      inset:0;
      z-index:4;
      pointer-events:none;
      background:
        radial-gradient(circle at var(--mx,62%) var(--my,42%), rgba(118,180,255,.10), transparent 26vw),
        radial-gradient(circle at 72% 16%, rgba(255,255,255,.06), transparent 18vw),
        linear-gradient(90deg, rgba(0,0,0,.20), transparent 35%, rgba(0,0,0,.24));
      mix-blend-mode:screen;
      opacity:.58;
    }
    .ht-loader{
      position:fixed;
      inset:0;
      z-index:240;
      display:grid;
      grid-template-rows:1fr auto;
      padding:34px;
      background:#050607;
      color:#e8f0f6;
      overflow:hidden;
      transition:opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1), visibility .9s;
    }
    .ht-loader:before{
      content:"";
      position:absolute;
      inset:-20%;
      background:
        radial-gradient(circle at 66% 44%, rgba(94,162,255,.18), transparent 28%),
        radial-gradient(circle at 30% 70%, rgba(190,230,255,.07), transparent 22%);
      animation:htLoaderDrift 4.8s ease-in-out infinite alternate;
    }
    .ht-loader.is-done{
      opacity:0;
      visibility:hidden;
      transform:scale(1.015);
      pointer-events:none;
    }
    .ht-loader-inner{
      position:relative;
      z-index:2;
      align-self:end;
      display:grid;
      grid-template-columns:1fr auto;
      gap:28px;
      align-items:end;
    }
    .ht-loader-number{
      font-family:Kanit,Geist,sans-serif;
      font-size:clamp(86px,18vw,260px);
      line-height:.72;
      letter-spacing:-.09em;
      font-weight:900;
      background:linear-gradient(180deg,#ffffff,#5c6b7c);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
    }
    .ht-loader-copy{
      max-width:260px;
      padding-bottom:12px;
      text-transform:uppercase;
      letter-spacing:.16em;
      font-size:12px;
      color:rgba(232,240,246,.66);
      line-height:1.8;
    }
    .ht-loader-bar{
      position:relative;
      z-index:2;
      height:1px;
      width:100%;
      margin-top:28px;
      background:rgba(232,240,246,.18);
      overflow:hidden;
    }
    .ht-loader-bar i{
      display:block;
      width:var(--p,0%);
      height:100%;
      background:#e8f0f6;
      transition:width .08s linear;
    }
    .ht-cursor{
      position:fixed;
      left:0;
      top:0;
      width:74px;
      height:74px;
      margin:-37px 0 0 -37px;
      z-index:250;
      pointer-events:none;
      border:1px solid rgba(232,240,246,.46);
      border-radius:50%;
      mix-blend-mode:difference;
      transform:translate3d(var(--cx,50vw),var(--cy,50vh),0) scale(var(--cs,1));
      transition:width .2s,height .2s,border-color .2s,opacity .2s;
      opacity:.74;
    }
    .ht-cursor:after{
      content:"";
      position:absolute;
      left:50%;
      top:50%;
      width:5px;
      height:5px;
      border-radius:50%;
      background:#fff;
      transform:translate(-50%,-50%);
    }
    .ht-rail{
      position:fixed;
      z-index:63;
      left:34px;
      top:50%;
      transform:translateY(-50%);
      display:grid;
      gap:13px;
      pointer-events:none;
      mix-blend-mode:difference;
    }
    .ht-rail span{
      display:block;
      font-size:11px;
      text-transform:uppercase;
      letter-spacing:.16em;
      color:rgba(255,255,255,.28);
      transform:translateX(-7px);
      transition:.45s cubic-bezier(.16,1,.3,1);
    }
    .ht-rail span.is-active{
      color:#fff;
      transform:translateX(0);
    }
    @keyframes htLoaderDrift{
      from{transform:translate3d(-1.4%,0,0) scale(1)}
      to{transform:translate3d(1.4%,-1%,0) scale(1.04)}
    }
    @media(pointer:coarse){.ht-cursor{display:none}}
    @media(max-width:900px){
      #rippleLayer{opacity:.34}
      #particleLayer{opacity:.42}
      .ambient-vignette{opacity:.42}
      .ht-rail{display:none}
      .ht-loader{padding:22px}
      .ht-loader-inner{grid-template-columns:1fr;gap:18px}
    }
  `;
  document.head.appendChild(style);

  const loader = document.createElement('div');
  loader.className = 'ht-loader';
  loader.innerHTML = `
    <div></div>
    <div>
      <div class="ht-loader-inner">
        <div class="ht-loader-number"><span id="htLoaderNum">0</span>%</div>
        <div class="ht-loader-copy"><span id="htLoaderText">Loading content</span><br>Ready to Explore</div>
      </div>
      <div class="ht-loader-bar"><i id="htLoaderBar"></i></div>
    </div>`;
  document.body.prepend(loader);

  const ripple = document.createElement('canvas');
  ripple.id = 'rippleLayer';
  ripple.className = 'ambient-canvas';

  const particles = document.createElement('canvas');
  particles.id = 'particleLayer';
  particles.className = 'ambient-canvas';

  const vignette = document.createElement('div');
  vignette.className = 'ambient-vignette';

  const rail = document.createElement('div');
  rail.className = 'ht-rail';
  rail.innerHTML = ['Future','Signal','Workflow','Lens','Launch','Works'].map((w,i)=>`<span data-rail="${i}">${w}</span>`).join('');

  const cursor = document.createElement('div');
  cursor.className = 'ht-cursor';

  document.body.prepend(vignette);
  document.body.prepend(particles);
  document.body.prepend(ripple);
  document.body.appendChild(rail);
  document.body.appendChild(cursor);

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
  let lastRail = -1;

  const num = document.getElementById('htLoaderNum');
  const bar = document.getElementById('htLoaderBar');
  const text = document.getElementById('htLoaderText');
  let progress = 0;
  const loaderTimer = setInterval(() => {
    progress += Math.max(1, Math.round((100 - progress) * .075));
    if(progress >= 88 && document.readyState !== 'complete') progress = 88;
    if(progress >= 100){
      progress = 100;
      clearInterval(loaderTimer);
      text.textContent = '100% Loaded';
      setTimeout(() => loader.classList.add('is-done'), 360);
      setTimeout(() => loader.remove(), 1500);
    }
    num.textContent = progress;
    bar.style.setProperty('--p', progress + '%');
  }, 42);
  window.addEventListener('load', () => {
    progress = Math.max(progress, 96);
    setTimeout(() => { progress = 100; }, 180);
  }, { once:true });

  function sectionState(){
    const y = window.scrollY || 0;
    const vh = window.innerHeight || 1;
    const sections = ['hero','signal','workflow','lens','launch','proof'];
    let active = 0;
    sections.forEach((id,i)=>{
      const el = document.getElementById(id);
      if(!el) return;
      const r = el.getBoundingClientRect();
      if(r.top < vh * .52 && r.bottom > vh * .22) active = i;
    });
    const hero = y < vh * .82;
    const lens = document.getElementById('lens');
    const lensRect = lens ? lens.getBoundingClientRect() : null;
    const inLens = lensRect && lensRect.top < vh * .92 && lensRect.bottom > vh * .08;
    return { hero, inLens, active };
  }

  function updateRail(active){
    if(active === lastRail) return;
    lastRail = active;
    rail.querySelectorAll('span').forEach((s,i)=>s.classList.toggle('is-active', i === active));
  }

  function makeParticles(){
    const count = Math.max(46, Math.min(124, Math.floor((w * h) / 15500)));
    dots = Array.from({ length: count }, (_,i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1 + .2,
      r: Math.random() * 1.8 + .35,
      a: Math.random() * .28 + .045,
      vx: (Math.random() - .5) * .12,
      vy: (Math.random() - .5) * .11,
      drift: Math.random() * Math.PI * 2,
      hue: i % 6 === 0 ? 'rgba(150,208,255,' : 'rgba(225,240,255,'
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
    targetX = mouseX = w * .64;
    targetY = mouseY = h * .42;
    makeParticles();
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
    document.documentElement.style.setProperty('--mx', `${(e.clientX / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty('--my', `${(e.clientY / window.innerHeight) * 100}%`);
  }, { passive: true });
  document.addEventListener('pointerover', e => {
    const interactive = e.target.closest && e.target.closest('a,button,.film-card');
    cursor.style.setProperty('--cs', interactive ? 1.72 : 1);
  }, true);

  function drawLiquid(t){
    const time = t * .001;
    const state = sectionState();
    updateRail(state.active);
    const alpha = state.hero ? 1 : state.inLens ? .32 : .64;

    mouseX += (targetX - mouseX) * .035;
    mouseY += (targetY - mouseY) * .035;
    cursor.style.setProperty('--cx', mouseX + 'px');
    cursor.style.setProperty('--cy', mouseY + 'px');

    rctx.clearRect(0, 0, w, h);
    rctx.save();
    rctx.globalAlpha = alpha;

    const cx = w * .68 + Math.sin(time * .2) * 52 + (mouseX - w / 2) * .028;
    const cy = h * .44 + Math.cos(time * .18) * 40 + (mouseY - h / 2) * .028;

    for(let i = 0; i < 8; i++){
      const radius = 125 + i * 76 + Math.sin(time * .62 + i * .8) * 18;
      const g = rctx.createRadialGradient(cx, cy, radius * .42, cx, cy, radius);
      g.addColorStop(0, 'rgba(70,145,255,0)');
      g.addColorStop(.53, 'rgba(104,170,255,.026)');
      g.addColorStop(.68, 'rgba(210,238,255,.11)');
      g.addColorStop(.71, 'rgba(255,255,255,.03)');
      g.addColorStop(1, 'rgba(92,165,255,0)');
      rctx.beginPath();
      rctx.fillStyle = g;
      rctx.arc(cx + Math.sin(i + time) * 12, cy + Math.cos(i * 1.3 + time) * 10, radius, 0, Math.PI * 2);
      rctx.fill();
    }

    rctx.lineCap = 'round';
    for(let j = 0; j < 18; j++){
      const base = h * (-.06 + j * .071);
      const intensity = .018 + (j % 4) * .007;
      rctx.beginPath();
      rctx.strokeStyle = `rgba(180,224,255,${intensity})`;
      rctx.lineWidth = j % 5 === 0 ? 1.35 : .78;
      for(let x = -120; x <= w + 120; x += 18){
        const dist = Math.hypot(x - cx, base - cy);
        const pull = Math.sin(dist * .012 - time * 1.45) * 16 * Math.max(0, 1 - dist / (w * .78));
        const yy = base + Math.sin(x * .007 + time * .68 + j * .33) * (8 + j * .32) + pull;
        const xx = x + Math.sin(time * .38 + j) * 8;
        if(x === -120) rctx.moveTo(xx, yy); else rctx.lineTo(xx, yy);
      }
      rctx.stroke();
    }

    rctx.restore();
    requestAnimationFrame(drawLiquid);
  }

  function drawParticles(t){
    const time = t * .001;
    const state = sectionState();
    const alpha = state.hero ? .96 : state.inLens ? .34 : .72;
    const sx = (mouseX - w / 2) * .0007;
    const sy = (mouseY - h / 2) * .0007;

    pctx.clearRect(0, 0, w, h);
    pctx.save();
    pctx.globalAlpha = alpha;

    for(const p of dots){
      p.drift += .004;
      p.x += p.vx + Math.sin(time * .33 + p.drift) * .04 + sx * p.z;
      p.y += p.vy + Math.cos(time * .31 + p.drift) * .035 + sy * p.z;
      if(p.x < -40) p.x = w + 40;
      if(p.x > w + 40) p.x = -40;
      if(p.y < -40) p.y = h + 40;
      if(p.y > h + 40) p.y = -40;
      pctx.beginPath();
      pctx.shadowBlur = p.z > .7 ? 14 : 4;
      pctx.shadowColor = 'rgba(160,210,255,.44)';
      pctx.fillStyle = `${p.hue}${p.a})`;
      pctx.arc(p.x, p.y, p.r * p.z, 0, Math.PI * 2);
      pctx.fill();
    }

    pctx.restore();
    requestAnimationFrame(drawParticles);
  }

  resize();
  requestAnimationFrame(drawLiquid);
  requestAnimationFrame(drawParticles);
})();