(()=>{
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections=[...document.querySelectorAll('.chapter,.proof,.ending')];
  const video=document.getElementById('heroVideo');

  function makeLoader(){
    if(sessionStorage.getItem('eo-loader-seen')==='1')return;
    const loader=document.createElement('div');
    loader.className='eo-loader';
    loader.innerHTML='<div class="eo-loader-inner"><div class="eo-loader-title">Eighth<span>Orbit</span></div><div class="eo-loader-meta"><div>Ready to enter orbit</div><div><span id="eoLoadNum">0</span>%</div><div class="eo-loader-bar"><span class="eo-loader-fill"></span></div></div></div>';
    document.body.appendChild(loader);
    const num=loader.querySelector('#eoLoadNum');
    const fill=loader.querySelector('.eo-loader-fill');
    let v=0;
    const tick=()=>{
      v=Math.min(100,v+(100-v)*.18+1.2);
      const shown=Math.floor(v);
      num.textContent=shown;
      fill.style.width=shown+'%';
      if(v<99)requestAnimationFrame(tick);
      else{
        num.textContent='100';
        fill.style.width='100%';
        sessionStorage.setItem('eo-loader-seen','1');
        setTimeout(()=>loader.classList.add('is-hidden'),prefersReduced?80:420);
        setTimeout(()=>loader.remove(),1300);
      }
    };
    requestAnimationFrame(tick);
  }

  function makeCursor(){
    if(innerWidth<900||prefersReduced)return;
    const cursor=document.createElement('div');
    cursor.className='eo-cursor';
    document.body.appendChild(cursor);
    let x=-120,y=-120,tx=x,ty=y;
    addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY},{passive:true});
    const hoverSelector='a,button,.proof-card,.signal-card,.film-card';
    document.addEventListener('mouseover',e=>{if(e.target.closest(hoverSelector))cursor.classList.add('is-hover')});
    document.addEventListener('mouseout',e=>{if(e.target.closest(hoverSelector))cursor.classList.remove('is-hover')});
    const loop=()=>{x+=(tx-x)*.18;y+=(ty-y)*.18;cursor.style.transform=`translate3d(${x}px,${y}px,0) scale(1)`;requestAnimationFrame(loop)};
    requestAnimationFrame(loop);
  }

  function activeIndex(){
    const mid=innerHeight*.5;
    let best=0,dist=Infinity;
    sections.forEach((section,i)=>{
      const r=section.getBoundingClientRect();
      const d=Math.abs((r.top+r.bottom)/2-mid);
      if(d<dist){dist=d;best=i}
    });
    return best;
  }

  function makeController(){
    if(!sections.length)return;
    const readout=document.createElement('div');
    readout.className='eo-chapter-readout';
    readout.innerHTML='<strong>01</strong><span>Manifesto</span>';
    const controller=document.createElement('div');
    controller.className='eo-controller';
    controller.innerHTML='<button type="button" data-dir="-1">Prev</button><button type="button" data-dir="1">Next</button>';
    document.body.append(readout,controller);
    const names={manifesto:'Manifesto',signal:'Signal',workflow:'Workflow',lens:'Lens',launch:'Launch',orbit:'Orbit',proof:'Works',contact:'Contact'};
    const update=()=>{
      const i=activeIndex();
      const id=sections[i]?.id||'';
      readout.querySelector('strong').textContent=String(i+1).padStart(2,'0');
      readout.querySelector('span').textContent=names[id]||id||'Orbit';
    };
    controller.addEventListener('click',e=>{
      const btn=e.target.closest('button');
      if(!btn)return;
      const next=Math.max(0,Math.min(sections.length-1,activeIndex()+Number(btn.dataset.dir)));
      sections[next].scrollIntoView({behavior:prefersReduced?'auto':'smooth',block:'start'});
    });
    addEventListener('scroll',update,{passive:true});
    addEventListener('resize',update);
    update();
  }

  function makeSoundSwitch(){
    if(!video)return;
    const sound=document.createElement('div');
    sound.className='ht-sound';
    sound.innerHTML='<span>Sound</span><button type="button" data-muted="true">Off</button><button type="button" data-muted="false">On</button>';
    document.body.appendChild(sound);
    const buttons=[...sound.querySelectorAll('button')];
    const sync=()=>buttons.forEach(btn=>btn.classList.toggle('is-on',String(video.muted)===btn.dataset.muted));
    sound.addEventListener('click',e=>{
      const btn=e.target.closest('button');
      if(!btn)return;
      video.muted=btn.dataset.muted==='true';
      if(!video.paused)video.play().catch(()=>{});
      sync();
    });
    sync();
  }

  function makeWorkModal(){
    const cards=[...document.querySelectorAll('.proof-card')];
    if(!cards.length)return;
    const modal=document.createElement('div');
    modal.className='eo-modal';
    modal.innerHTML='<div class="eo-modal-panel" role="dialog" aria-modal="true" aria-label="Work detail"><div class="eo-modal-kicker">Selected Work</div><h3></h3><p></p><div class="eo-modal-actions"><a href="#" target="_blank" rel="noopener">Open</a><button type="button">Close</button></div></div>';
    document.body.appendChild(modal);
    const title=modal.querySelector('h3');
    const body=modal.querySelector('p');
    const open=modal.querySelector('a');
    const close=()=>{modal.classList.remove('is-open');document.body.classList.remove('eo-lock')};
    modal.querySelector('button').addEventListener('click',close);
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    cards.forEach(card=>{
      card.classList.add('is-tilting');
      card.addEventListener('mousemove',e=>{
        if(prefersReduced||innerWidth<900)return;
        const r=card.getBoundingClientRect();
        const rx=((e.clientY-r.top)/r.height-.5)*-5;
        const ry=((e.clientX-r.left)/r.width-.5)*5;
        card.style.transform=`translateY(-10px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave',()=>{card.style.transform=''});
      card.addEventListener('click',e=>{
        if(e.target.closest('a'))return;
        const link=card.querySelector('a');
        title.textContent=card.querySelector('h3')?.textContent||'Selected Work';
        body.textContent=card.querySelector('p')?.innerText||'A selected piece from the Eighth Orbit portfolio.';
        open.href=link?.href||'#';
        open.style.display=link?'inline-flex':'none';
        modal.classList.add('is-open');
        document.body.classList.add('eo-lock');
      });
    });
  }

  function init(){
    makeLoader();
    makeCursor();
    makeController();
    makeSoundSwitch();
    makeWorkModal();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
