(() => {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/shawn-portfolio/hashgraph-upgrade.css?v=fe09390d';
  document.head.appendChild(link);

  const baseStyle = document.createElement('style');
  baseStyle.textContent = `
    .ambient-canvas{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:3}
    #rippleLayer{opacity:.64;mix-blend-mode:screen}.ambient-vignette{position:fixed;inset:0;z-index:4;pointer-events:none;background:radial-gradient(circle at var(--mx,62%) var(--my,42%),rgba(130,190,255,.16),transparent 24vw),linear-gradient(90deg,rgba(0,0,0,.3),transparent 38%,rgba(0,0,0,.36));mix-blend-mode:screen}
    #particleLayer{opacity:.66;mix-blend-mode:screen}.ht-loader{position:fixed;inset:0;z-index:240;display:grid;grid-template-rows:1fr auto;padding:34px;background:#020304;color:#f4f7fb;overflow:hidden;transition:opacity .9s cubic-bezier(.16,1,.3,1),visibility .9s,transform .9s}.ht-loader:before{content:"";position:absolute;inset:-20%;background:radial-gradient(circle at 66% 44%,rgba(94,162,255,.2),transparent 28%);animation:drift 4.8s ease-in-out infinite alternate}.ht-loader.is-done{opacity:0;visibility:hidden;transform:scale(1.015);pointer-events:none}.ht-loader-inner{position:relative;z-index:2;align-self:end;display:grid;grid-template-columns:1fr auto;gap:28px;align-items:end}.ht-loader-number{font-family:Kanit,Geist,sans-serif;font-size:clamp(86px,18vw,260px);line-height:.72;letter-spacing:-.09em;font-weight:900;background:linear-gradient(180deg,#fff,#8b97a7 44%,#2b3038);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.ht-loader-copy{max-width:260px;padding-bottom:12px;text-transform:uppercase;letter-spacing:.16em;font-size:12px;color:rgba(255,255,255,.64);line-height:1.8}.ht-loader-bar{position:relative;z-index:2;height:1px;width:100%;margin-top:28px;background:rgba(255,255,255,.18);overflow:hidden}.ht-loader-bar i{display:block;width:var(--p,0%);height:100%;background:#fff;transition:width .08s linear}.ht-cursor{position:fixed;left:0;top:0;width:92px;height:92px;margin:-46px 0 0 -46px;z-index:250;pointer-events:none;border:1px solid rgba(255,255,255,.62);border-radius:50%;mix-blend-mode:difference;transform:translate3d(var(--cx,50vw),var(--cy,50vh),0) scale(var(--cs,1));opacity:.88}.ht-cursor:after{content:"";position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:50%;background:#fff;transform:translate(-50%,-50%)}.ht-rail{position:fixed;z-index:63;left:34px;top:50%;transform:translateY(-50%);display:grid;gap:16px;pointer-events:none;mix-blend-mode:difference}.ht-rail span{font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:rgba(255,255,255,.24);transform:translateX(-7px);transition:.35s}.ht-rail span.is-active{color:#fff;transform:translateX(0)}@keyframes drift{from{transform:translate3d(-1.4%,0,0) scale(1)}to{transform:translate3d(1.4%,-1%,0) scale(1.04)}}@media(pointer:coarse){.ht-cursor{display:none}}@media(max-width:900px){#rippleLayer{opacity:.42}#particleLayer{opacity:.44}.ht-rail{display:none}.ht-loader{padding:22px}.ht-loader-inner{grid-template-columns:1fr}}
  `;
  document.head.appendChild(baseStyle);

  const loader = document.createElement('div');
  loader.className = 'ht-loader';
  loader.innerHTML = `<div></div><div><div class="ht-loader-inner"><div class="ht-loader-number"><span id="htNum">0</span>%</div><div class="ht-loader-copy">Loading content<br>Ready to Explore</div></div><div class="ht-loader-bar"><i id="htBar"></i></div></div>`;
  document.body.prepend(loader);
  const num = document.getElementById('htNum');
  const bar = document.getElementById('htBar');
  let prog = 0;
  const timer = setInterval(()=>{prog += Math.max(1, Math.round((100-prog)*.08)); if(prog>88&&document.readyState!=='complete') prog=88; if(prog>=100){prog=100;clearInterval(timer);setTimeout(()=>loader.classList.add('is-done'),260);setTimeout(()=>loader.remove(),1300)} num.textContent=prog;bar.style.setProperty('--p',prog+'%')},38);
  window.addEventListener('load',()=>{prog=Math.max(prog,96);setTimeout(()=>prog=100,140)},{once:true});

  const sound = document.createElement('div');
  sound.className='ht-sound';
  sound.innerHTML='SOUND <button type="button">OFF</button><button type="button" class="is-on">ON</button>';
  document.body.appendChild(sound);
  const idx = document.createElement('div');
  idx.className='hg-index';
  idx.innerHTML='<strong>//01</strong><span>Manifesto System</span>';
  document.body.appendChild(idx);
  const rail=document.createElement('div');rail.className='ht-rail';rail.innerHTML=['Future','Signal','Workflow','Lens','Launch','Works'].map((x,i)=>`<span>${x}</span>`).join('');document.body.appendChild(rail);
  const cursor=document.createElement('div');cursor.className='ht-cursor';document.body.appendChild(cursor);

  if(reduced) return;
  const ripple=document.createElement('canvas');ripple.id='rippleLayer';ripple.className='ambient-canvas';
  const particle=document.createElement('canvas');particle.id='particleLayer';particle.className='ambient-canvas';
  const vignette=document.createElement('div');vignette.className='ambient-vignette';
  document.body.prepend(vignette);document.body.prepend(particle);document.body.prepend(ripple);
  const r=ripple.getContext('2d'), p=particle.getContext('2d'), DPR=Math.min(devicePixelRatio||1,2);
  let w=0,h=0,mx=innerWidth*.62,my=innerHeight*.42,tx=mx,ty=my,dots=[];
  function resize(){w=innerWidth;h=innerHeight;[ripple,particle].forEach(c=>{c.width=w*DPR;c.height=h*DPR;c.style.width=w+'px';c.style.height=h+'px'});r.setTransform(DPR,0,0,DPR,0,0);p.setTransform(DPR,0,0,DPR,0,0);dots=Array.from({length:Math.max(54,Math.min(132,Math.floor(w*h/14500)))},()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random()+.25,rr:Math.random()*1.8+.35,a:Math.random()*.28+.05,vx:(Math.random()-.5)*.13,vy:(Math.random()-.5)*.12,d:Math.random()*6.28}))}
  function active(){const ids=['manifesto','signal','workflow','lens','launch','proof'];let a=0;ids.forEach((id,i)=>{const el=document.getElementById(id);if(!el)return;const b=el.getBoundingClientRect();if(b.top<h*.55&&b.bottom>h*.2)a=i});rail.querySelectorAll('span').forEach((s,i)=>s.classList.toggle('is-active',i===a));idx.querySelector('strong').textContent='//'+String(a+1).padStart(2,'0');idx.querySelector('span').textContent=['Manifesto System','Signal Compression','AI Workflow','Lens Reel','Launch Narrative','Selected Works'][a];return a}
  addEventListener('resize',resize,{passive:true});addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;document.documentElement.style.setProperty('--mx',(tx/w*100)+'%');document.documentElement.style.setProperty('--my',(ty/h*100)+'%')},{passive:true});document.addEventListener('pointerover',e=>{cursor.style.setProperty('--cs',e.target.closest('a,button,.film-card')?1.72:1)},true);
  function liquid(t){t*=.001;active();mx+=(tx-mx)*.04;my+=(ty-my)*.04;cursor.style.setProperty('--cx',mx+'px');cursor.style.setProperty('--cy',my+'px');r.clearRect(0,0,w,h);r.save();const cx=w*.68+Math.sin(t*.2)*52+(mx-w/2)*.03,cy=h*.44+Math.cos(t*.18)*40+(my-h/2)*.03;r.globalAlpha=.9;for(let i=0;i<9;i++){const rad=118+i*74+Math.sin(t*.62+i*.8)*18,g=r.createRadialGradient(cx,cy,rad*.42,cx,cy,rad);g.addColorStop(0,'rgba(70,145,255,0)');g.addColorStop(.54,'rgba(104,170,255,.026)');g.addColorStop(.68,'rgba(225,244,255,.12)');g.addColorStop(.72,'rgba(255,255,255,.04)');g.addColorStop(1,'rgba(92,165,255,0)');r.beginPath();r.fillStyle=g;r.arc(cx+Math.sin(i+t)*12,cy+Math.cos(i*1.3+t)*10,rad,0,Math.PI*2);r.fill()}r.lineCap='round';for(let j=0;j<20;j++){const base=h*(-.08+j*.068);r.beginPath();r.strokeStyle=`rgba(190,228,255,${.018+(j%4)*.008})`;r.lineWidth=j%5===0?1.45:.8;for(let x=-140;x<=w+140;x+=18){const dist=Math.hypot(x-cx,base-cy),pull=Math.sin(dist*.012-t*1.5)*18*Math.max(0,1-dist/(w*.78)),yy=base+Math.sin(x*.007+t*.7+j*.33)*(8+j*.34)+pull,xx=x+Math.sin(t*.38+j)*8;if(x===-140)r.moveTo(xx,yy);else r.lineTo(xx,yy)}r.stroke()}r.restore();requestAnimationFrame(liquid)}
  function parts(t){t*=.001;p.clearRect(0,0,w,h);p.save();p.globalAlpha=.8;const sx=(mx-w/2)*.0008,sy=(my-h/2)*.0008;dots.forEach(o=>{o.d+=.004;o.x+=o.vx+Math.sin(t*.33+o.d)*.04+sx*o.z;o.y+=o.vy+Math.cos(t*.31+o.d)*.035+sy*o.z;if(o.x<-40)o.x=w+40;if(o.x>w+40)o.x=-40;if(o.y<-40)o.y=h+40;if(o.y>h+40)o.y=-40;p.beginPath();p.shadowBlur=o.z>.7?14:4;p.shadowColor='rgba(160,210,255,.44)';p.fillStyle=`rgba(225,240,255,${o.a})`;p.arc(o.x,o.y,o.rr*o.z,0,Math.PI*2);p.fill()});p.restore();requestAnimationFrame(parts)}
  resize();requestAnimationFrame(liquid);requestAnimationFrame(parts);
})();