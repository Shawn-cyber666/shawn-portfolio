(()=>{
  const hero=document.querySelector('.hero');
  if(!hero)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const style=document.createElement('style');
  style.textContent='#crystalLayer{position:absolute;inset:0;width:100%;height:100%;z-index:7;pointer-events:none;mix-blend-mode:screen;filter:saturate(1.2) contrast(1.08)}.hero .hero-grid,.hero .player{z-index:12}.hero:after{z-index:8}.hero:before{z-index:6}@media(max-width:900px){#crystalLayer{opacity:.68}}';
  document.head.appendChild(style);

  const cv=document.createElement('canvas');
  cv.id='crystalLayer';
  hero.appendChild(cv);
  const ctx=cv.getContext('2d');
  const DPR=Math.min(devicePixelRatio||1,2);
  let w=0,h=0,mx=innerWidth*.66,my=innerHeight*.42,tx=mx,ty=my,base=160;
  const TAU=Math.PI*2;

  const rand=(a,b)=>a+Math.random()*(b-a);
  const makeShape=n=>Array.from({length:n},(_,i)=>{
    const a=i/n*TAU+rand(-.08,.08);
    const r=rand(.58,1.12);
    return[Math.cos(a)*r,Math.sin(a)*r];
  });

  const shards=Array.from({length:24},(_,i)=>({
    a:i/24*TAU+rand(-.18,.18),
    rr:rand(.48,1.15),
    phase:rand(0,TAU),
    spin:rand(-1.6,1.6),
    size:rand(.035,.085),
    shape:makeShape(5+Math.floor(Math.random()*3))
  }));

  const particles=Array.from({length:140},()=>({
    x:Math.random(),y:Math.random(),
    vx:rand(-.08,.08),vy:rand(-.08,.08),
    r:rand(.55,1.9),
    phase:rand(0,TAU),
    orbit:rand(.35,1.65),
    hue:Math.random()<.72?'blue':(Math.random()<.5?'white':'amber')
  }));

  const bursts=[];

  function resize(){
    const b=hero.getBoundingClientRect();
    w=b.width;h=b.height;base=Math.min(w,h)*.18;
    cv.width=w*DPR;cv.height=h*DPR;
    cv.style.width=w+'px';cv.style.height=h+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function poly(points){
    ctx.beginPath();
    points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.closePath();
  }

  function color(kind,alpha){
    if(kind==='amber')return`rgba(237,196,118,${alpha})`;
    if(kind==='white')return`rgba(246,252,255,${alpha})`;
    return`rgba(126,190,255,${alpha})`;
  }

  addEventListener('resize',resize,{passive:true});
  addEventListener('mousemove',e=>{
    const r=hero.getBoundingClientRect();
    tx=e.clientX-r.left;ty=e.clientY-r.top;
  },{passive:true});
  hero.addEventListener('click',e=>{
    const r=hero.getBoundingClientRect();
    bursts.push({x:e.clientX-r.left,y:e.clientY-r.top,t:0});
    if(bursts.length>4)bursts.shift();
  });

  function drawParticles(t,cx,cy,force){
    const linkDistance=Math.min(w,h)*.115;
    for(const p of particles){
      const px=p.x*w,py=p.y*h;
      const dx=mx-px,dy=my-py;
      const d=Math.hypot(dx,dy)||1;
      const pull=Math.max(0,1-d/(base*2.9));
      p.vx+=(dx/d)*pull*.018;
      p.vy+=(dy/d)*pull*.018;
      p.vx+=Math.cos(t*.42+p.phase)*.0035;
      p.vy+=Math.sin(t*.36+p.phase)*.0035;
      p.vx*=.982;p.vy*=.982;
      p.x+=p.vx/Math.max(w,1);
      p.y+=p.vy/Math.max(h,1);
      if(p.x<-.04)p.x=1.04;if(p.x>1.04)p.x=-.04;
      if(p.y<-.04)p.y=1.04;if(p.y>1.04)p.y=-.04;
    }

    ctx.save();
    ctx.globalCompositeOperation='lighter';
    for(let i=0;i<particles.length;i++){
      const a=particles[i],ax=a.x*w,ay=a.y*h;
      for(let j=i+1;j<Math.min(particles.length,i+12);j++){
        const b=particles[j],bx=b.x*w,by=b.y*h;
        const d=Math.hypot(ax-bx,ay-by);
        if(d<linkDistance){
          const alpha=(1-d/linkDistance)*(.05+force*.08);
          ctx.strokeStyle=`rgba(175,220,255,${alpha})`;
          ctx.lineWidth=.6;
          ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();
        }
      }
    }
    for(const p of particles){
      const x=p.x*w,y=p.y*h;
      const d=Math.hypot(x-cx,y-cy);
      const glow=Math.max(0,1-d/(base*2.5));
      const r=p.r*(1+glow*1.9+force*.6);
      ctx.shadowBlur=16+glow*28;
      ctx.shadowColor=color(p.hue,.72);
      ctx.fillStyle=color(p.hue,.2+glow*.55);
      ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    }
    ctx.restore();
  }

  function drawShards(t,cx,cy,force){
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    shards.forEach(o=>{
      const wob=Math.sin(t*.9+o.phase)*.08;
      const spread=force*(.85+Math.sin(t*1.2+o.phase)*.1);
      const a=o.a+t*.09+o.spin*.04;
      const orbit=base*(o.rr+wob+spread*.95);
      const x=cx+Math.cos(a)*orbit+(mx-cx)*force*.07;
      const y=cy+Math.sin(a)*orbit+(my-cy)*force*.07;
      const sc=base*o.size*(1+force*.45);
      const rot=a+Math.sin(t+o.phase)*.34+force*o.spin*1.55;
      ctx.save();
      ctx.translate(x,y);ctx.rotate(rot);ctx.scale(sc,sc);
      ctx.shadowBlur=26+force*38;
      ctx.shadowColor='rgba(215,248,255,.92)';
      const lg=ctx.createLinearGradient(-1.2,-1.2,1.2,1.2);
      lg.addColorStop(0,'rgba(255,255,255,.98)');
      lg.addColorStop(.26,'rgba(170,231,255,.62)');
      lg.addColorStop(.58,'rgba(62,142,222,.32)');
      lg.addColorStop(1,'rgba(255,255,255,.88)');
      poly(o.shape);
      ctx.fillStyle=lg;ctx.fill();
      ctx.lineWidth=.035;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }

  function drawBursts(){
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    for(let i=bursts.length-1;i>=0;i--){
      const b=bursts[i];
      b.t+=.018;
      const alpha=Math.max(0,1-b.t);
      const radius=base*(.25+b.t*1.85);
      ctx.strokeStyle=`rgba(235,250,255,${alpha*.34})`;
      ctx.lineWidth=1.2;
      ctx.beginPath();ctx.arc(b.x,b.y,radius,0,TAU);ctx.stroke();
      for(let k=0;k<18;k++){
        const a=k/18*TAU+b.t*1.2;
        const r=radius*(.3+((k%5)/5)*.75);
        ctx.fillStyle=`rgba(255,255,255,${alpha*.62})`;
        ctx.beginPath();ctx.arc(b.x+Math.cos(a)*r,b.y+Math.sin(a)*r,1.2+alpha*1.8,0,TAU);ctx.fill();
      }
      if(b.t>=1)bursts.splice(i,1);
    }
    ctx.restore();
  }

  function draw(t){
    t*=.001;
    mx+=(tx-mx)*.055;my+=(ty-my)*.055;
    const cx=w*.66+Math.sin(t*.28)*18,cy=h*.43+Math.cos(t*.22)*12;
    const d=Math.hypot(mx-cx,my-cy);
    const force=Math.max(0,1-d/(base*2.35));
    ctx.clearRect(0,0,w,h);

    ctx.save();
    ctx.globalCompositeOperation='lighter';
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,base*2.15);
    g.addColorStop(0,`rgba(245,255,255,${.3+force*.42})`);
    g.addColorStop(.22,`rgba(178,234,255,${.2+force*.25})`);
    g.addColorStop(.52,`rgba(78,156,255,${.08+force*.12})`);
    g.addColorStop(1,'rgba(20,80,200,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,base*2.15,0,TAU);ctx.fill();
    ctx.restore();

    drawParticles(t,cx,cy,force);
    drawShards(t,cx,cy,force);
    drawBursts();

    ctx.save();
    ctx.globalCompositeOperation='lighter';
    ctx.globalAlpha=.52+force*.4;
    ctx.strokeStyle='rgba(230,250,255,.34)';
    ctx.lineWidth=1;
    for(let k=0;k<5;k++){
      ctx.beginPath();
      ctx.arc(cx,cy,base*(.52+k*.18+force*.24),t*.25+k,Math.PI*1.62+t*.25+k);
      ctx.stroke();
    }
    ctx.restore();
    if(!reduced)requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
})();
