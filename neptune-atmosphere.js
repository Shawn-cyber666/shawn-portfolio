(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections=[...document.querySelectorAll('.hero,.chapter,.proof,.ending')];
  const lens=document.querySelector('.lens');
  const filmCards=[...document.querySelectorAll('.film-card')];
  const palette={
    hero:['rgba(122,193,255,','rgba(236,249,255,','rgba(84,123,255,'],
    manifesto:['rgba(220,238,255,','rgba(111,174,255,','rgba(255,255,255,'],
    signal:['rgba(112,212,255,','rgba(125,166,255,','rgba(244,250,255,'],
    workflow:['rgba(126,255,218,','rgba(100,166,255,','rgba(242,255,252,'],
    lens:['rgba(80,188,255,','rgba(185,238,255,','rgba(116,128,255,'],
    launch:['rgba(255,210,130,','rgba(118,178,255,','rgba(255,255,255,'],
    orbit:['rgba(116,154,255,','rgba(210,238,255,','rgba(141,255,223,'],
    proof:['rgba(42,94,148,','rgba(80,132,205,','rgba(245,248,255,'],
    contact:['rgba(180,212,255,','rgba(92,126,210,','rgba(255,255,255,']
  };

  const field=document.createElement('canvas');
  field.id='neptuneField';
  document.body.prepend(field);
  const label=document.createElement('div');
  label.className='neptune-orbit-label';
  label.textContent='VIII ORBIT / NEPTUNE';
  document.body.appendChild(label);
  const ctx=field.getContext('2d');
  const DPR=Math.min(devicePixelRatio||1,2);
  let w=0,h=0,lastScroll=scrollY,scrollSpeed=0,mx=innerWidth*.65,my=innerHeight*.45,tx=mx,ty=my,active='hero';
  const rand=(a,b)=>a+Math.random()*(b-a);
  const TAU=Math.PI*2;
  const stars=Array.from({length:150},()=>({
    x:Math.random(),y:Math.random(),z:rand(.18,1),r:rand(.35,1.6),vx:rand(-.035,.035),vy:rand(-.035,.035),phase:rand(0,TAU),kind:Math.floor(rand(0,3))
  }));
  const rings=Array.from({length:5},(_,i)=>({r:.22+i*.095,phase:rand(0,TAU),tilt:rand(.22,.48)}));

  function resize(){
    w=innerWidth;h=innerHeight;
    field.width=w*DPR;field.height=h*DPR;
    field.style.width=w+'px';field.style.height=h+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  function sectionId(){
    let best='hero',dist=Infinity;
    const mid=innerHeight*.46;
    for(const s of sections){
      const r=s.getBoundingClientRect();
      const d=Math.abs((r.top+r.bottom)/2-mid);
      if(d<dist){dist=d;best=s.id||'hero'}
    }
    return best||'hero';
  }

  function color(i,a){
    const p=palette[active]||palette.hero;
    return p[i%p.length]+a+')';
  }

  addEventListener('resize',resize,{passive:true});
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY},{passive:true});
  addEventListener('scroll',()=>{
    const next=scrollY;
    scrollSpeed+=(next-lastScroll)*.012;
    lastScroll=next;
  },{passive:true});
  addEventListener('click',e=>{
    for(let i=0;i<18;i++){
      stars.push({x:e.clientX/w,y:e.clientY/h,z:rand(.5,1.4),r:rand(.8,2.4),vx:Math.cos(i/18*TAU)*rand(.7,1.9),vy:Math.sin(i/18*TAU)*rand(.7,1.9),phase:rand(0,TAU),kind:i%3,life:1});
    }
    if(stars.length>210)stars.splice(0,stars.length-210);
  });

  function draw(t){
    t*=.001;
    active=sectionId();
    document.body.classList.toggle('neptune-lens',active==='lens');
    document.body.classList.toggle('neptune-proof',active==='proof');
    document.body.classList.toggle('neptune-hero',active==='hero');
    mx+=(tx-mx)*.08;my+=(ty-my)*.08;
    scrollSpeed*=.88;
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    const cx=w*.64+Math.sin(t*.22)*w*.025+scrollSpeed*.8;
    const cy=h*.45+Math.cos(t*.18)*h*.025;
    const radius=Math.min(w,h)*(.28+(active==='lens'? .08:0));
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,radius*1.9);
    g.addColorStop(0,color(1,.22));
    g.addColorStop(.38,color(0,.12));
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,radius*1.9,0,TAU);ctx.fill();

    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(-.18+Math.sin(t*.1)*.04);
    rings.forEach((ring,i)=>{
      ctx.beginPath();
      ctx.ellipse(0,0,radius*(ring.r*2.45),radius*(ring.r*.72+ring.tilt*.12),ring.phase+t*(.03+i*.008),0,TAU);
      ctx.strokeStyle=color(i,.055+i*.018+(active==='orbit' ? .05 : 0));
      ctx.lineWidth=1+i*.22;
      ctx.stroke();
    });
    ctx.restore();

    for(const s of stars){
      const px=s.x*w,py=s.y*h;
      const dx=mx-px,dy=my-py,d=Math.hypot(dx,dy)||1;
      const pull=Math.max(0,1-d/(Math.min(w,h)*.34));
      s.vx+=(dx/d)*pull*.045;
      s.vy+=(dy/d)*pull*.045;
      s.vx+=Math.cos(t*.55+s.phase)*.002;
      s.vy+=Math.sin(t*.48+s.phase)*.002+scrollSpeed*.00045*s.z;
      s.vx*=.965;s.vy*=.965;
      s.x+=s.vx/(w*(1.5-s.z*.35));
      s.y+=s.vy/(h*(1.5-s.z*.35));
      if(s.x<-.06)s.x=1.06;if(s.x>1.06)s.x=-.06;
      if(s.y<-.08)s.y=1.08;if(s.y>1.08)s.y=-.08;
      if(s.life!=null){s.life-=.018;if(s.life<=0){s.x=Math.random();s.y=Math.random();delete s.life}}
    }

    const link=active==='lens'?150:115;
    for(let i=0;i<stars.length;i++){
      const a=stars[i],ax=a.x*w,ay=a.y*h;
      for(let j=i+1;j<Math.min(stars.length,i+9);j++){
        const b=stars[j],bx=b.x*w,by=b.y*h;
        const d=Math.hypot(ax-bx,ay-by);
        if(d<link){
          ctx.strokeStyle=color(a.kind,(1-d/link)*(active==='lens' ? .075 : .045));
          ctx.lineWidth=.55;
          ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();
        }
      }
    }
    for(const s of stars){
      const pulse=(Math.sin(t*1.6+s.phase)+1)*.5;
      const life=s.life==null?1:s.life;
      ctx.shadowBlur=14*s.z+12*pulse;
      ctx.shadowColor=color(s.kind,.55*life);
      ctx.fillStyle=color(s.kind,(.22+pulse*.2)*life);
      ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.r*(.75+s.z*.9+pulse*.5),0,TAU);ctx.fill();
    }
    ctx.restore();
    if(!reduced)requestAnimationFrame(draw);
  }

  let rippleCanvas,rippleCtx,rw=0,rh=0,lensProgress=0;
  function setupRipple(){
    if(!lens)return;
    rippleCanvas=document.createElement('canvas');
    rippleCanvas.id='lensRipple';
    lens.appendChild(rippleCanvas);
    rippleCtx=rippleCanvas.getContext('2d');
    resizeRipple();
    addEventListener('resize',resizeRipple,{passive:true});
    requestAnimationFrame(drawRipple);
  }
  function resizeRipple(){
    if(!rippleCanvas||!lens)return;
    const r=lens.getBoundingClientRect();
    rw=Math.max(1,r.width);rh=Math.max(1,r.height);
    rippleCanvas.width=rw*DPR;rippleCanvas.height=rh*DPR;
    rippleCanvas.style.width=rw+'px';rippleCanvas.style.height=rh+'px';
    rippleCtx.setTransform(DPR,0,0,DPR,0,0);
  }
  function drawRipple(t){
    t*=.001;
    const r=lens.getBoundingClientRect();
    const visible=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
    lensProgress+= (visible-lensProgress)*.08;
    const wave=Math.sin(t*1.4+lensProgress*TAU)*18*lensProgress;
    document.documentElement.style.setProperty('--lens-wave',wave.toFixed(2)+'px');
    document.documentElement.style.setProperty('--lens-line',Math.min(1,lensProgress*1.45).toFixed(3));
    if(filmCards.length){
      filmCards.forEach((card,i)=>{
        const drift=Math.sin(t*.9+i*.62+lensProgress*2.4)*10*lensProgress;
        card.style.setProperty('--lens-wave',drift.toFixed(2)+'px');
      });
    }
    rippleCtx.clearRect(0,0,rw,rh);
    rippleCtx.save();
    rippleCtx.globalCompositeOperation='lighter';
    for(let y=0;y<rh;y+=34){
      const amp=(8+Math.sin(t+y*.015)*5)*lensProgress;
      rippleCtx.beginPath();
      for(let x=-40;x<rw+40;x+=18){
        const yy=y+Math.sin(x*.018+t*1.55+y*.011)*amp+Math.sin(x*.006-t*.7)*amp*.5;
        if(x===-40)rippleCtx.moveTo(x,yy);else rippleCtx.lineTo(x,yy);
      }
      rippleCtx.strokeStyle=`rgba(160,224,255,${.035+lensProgress*.09})`;
      rippleCtx.lineWidth=1;
      rippleCtx.stroke();
    }
    const g=rippleCtx.createLinearGradient(0,0,rw,rh);
    g.addColorStop(0,`rgba(80,172,255,${.05*lensProgress})`);
    g.addColorStop(.5,`rgba(210,246,255,${.13*lensProgress})`);
    g.addColorStop(1,'rgba(0,0,0,0)');
    rippleCtx.fillStyle=g;
    rippleCtx.fillRect(0,0,rw,rh);
    rippleCtx.restore();
    if(!reduced)requestAnimationFrame(drawRipple);
  }

  resize();
  setupRipple();
  requestAnimationFrame(draw);
})();
