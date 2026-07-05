(()=>{
  const ready=(fn)=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  const sections=()=>[...document.querySelectorAll('.chapter,.proof,.ending')];
  const names={manifesto:'Manifesto',signal:'Signal',workflow:'Workflow',lens:'Lens',launch:'Launch',orbit:'Orbit',proof:'Works',contact:'Contact'};
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function activeIndex(list){
    const mid=innerHeight*.52;
    let best=0,dist=Infinity;
    list.forEach((section,i)=>{
      const r=section.getBoundingClientRect();
      const d=Math.abs((r.top+r.bottom)/2-mid);
      if(d<dist){dist=d;best=i}
    });
    return best;
  }

  function installIdentity(){
    document.body.classList.remove('liquid-glass');
    document.body.classList.add('neptune-ip');
    const hero=document.querySelector('.hero');
    if(!hero)return;
    if(!hero.querySelector('.neptune-orbit-radar')){
      hero.insertAdjacentHTML('beforeend','<div class="neptune-orbit-radar" aria-hidden="true"></div>');
    }
    if(!hero.querySelector('.neptune-id-card')){
      hero.insertAdjacentHTML('beforeend','<aside class="neptune-id-card"><b>Neptune<br>IP</b><span>VIII ORBIT / Personal gravity field / Product narrative, AI workflow, lens and launch</span></aside>');
    }
    if(!document.querySelector('.neptune-frame')){
      document.body.insertAdjacentHTML('beforeend','<div class="neptune-frame" aria-hidden="true"></div>');
    }
  }

  function installLoader(){
    if(sessionStorage.getItem('neptune-loader-seen')==='1')return;
    document.body.classList.add('neptune-lock');
    const loader=document.createElement('div');
    loader.className='neptune-loader';
    loader.innerHTML='<div class="neptune-loader-title"><b data-scramble>NEPTUNE</b><span>000% / entering eighth orbit</span></div><div class="neptune-loader-bar"><i class="neptune-loader-fill"></i></div>';
    document.body.appendChild(loader);
    const title=loader.querySelector('[data-scramble]');
    const meta=loader.querySelector('span');
    const fill=loader.querySelector('.neptune-loader-fill');
    const target='NEPTUNE';
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let progress=0;
    const tick=()=>{
      progress=Math.min(100,progress+(100-progress)*.18+2.2);
      const locked=Math.floor(target.length*(progress/100));
      title.textContent=target.slice(0,locked)+Array.from({length:target.length-locked},()=>chars[Math.floor(Math.random()*chars.length)]).join('');
      meta.textContent=`${String(Math.floor(progress)).padStart(3,'0')}% / entering eighth orbit`;
      fill.style.width=progress+'%';
      if(progress<99){
        setTimeout(tick,42);
      }else{
        title.textContent=target;
        meta.textContent='100% / ready to explore';
        fill.style.width='100%';
        sessionStorage.setItem('neptune-loader-seen','1');
        setTimeout(()=>loader.classList.add('is-hidden'),prefersReduced?80:420);
        setTimeout(()=>{loader.remove();document.body.classList.remove('neptune-lock')},1200);
      }
    };
    tick();
  }

  function installControls(){
    const list=sections();
    if(!list.length)return;
    const mark=document.createElement('div');
    mark.className='neptune-ip-mark';
    mark.innerHTML='<strong>VIII</strong><span>Neptune IP<br>Scroll-responsive orbit</span>';
    const keywords=document.createElement('div');
    keywords.className='neptune-keywords';
    keywords.innerHTML='<span data-id="manifesto">Purpose</span><span data-id="signal">Signal</span><span data-id="workflow">Workflow</span><span data-id="lens">Lens</span><span data-id="launch">Launch</span><span data-id="orbit">Legacy</span>';
    const controller=document.createElement('div');
    controller.className='neptune-controller';
    controller.innerHTML='<button type="button" data-dir="-1">Prev</button><button type="button" data-dir="1">Next</button>';
    const bottom=document.createElement('div');
    bottom.className='neptune-bottom-hud';
    bottom.innerHTML='<button type="button" data-sound-toggle>Sound off</button><span data-scroll-label>Scroll to explore</span><span>Neptune IP</span>';
    document.body.append(mark,keywords,controller,bottom);
    const keywordItems=[...keywords.querySelectorAll('span')];

    const sync=()=>{
      const i=activeIndex(list);
      const section=list[i];
      const id=section?.id||'hero';
      mark.innerHTML=`<strong>${String(i+1).padStart(2,'0')}</strong><span>${names[id]||id}<br>Neptune IP</span>`;
      document.body.dataset.neptuneSection=id;
      keywordItems.forEach(item=>item.classList.toggle('is-active',item.dataset.id===id));
      const scrollLabel=bottom.querySelector('[data-scroll-label]');
      if(scrollLabel)scrollLabel.textContent=id==='proof'?'Open selected work':'Scroll to explore';
    };

    controller.addEventListener('click',event=>{
      const btn=event.target.closest('button');
      if(!btn)return;
      const next=Math.max(0,Math.min(list.length-1,activeIndex(list)+Number(btn.dataset.dir)));
      list[next].scrollIntoView({behavior:prefersReduced?'auto':'smooth',block:'start'});
    });

    let ticking=false;
    const onScroll=()=>{
      if(ticking)return;
      ticking=true;
      requestAnimationFrame(()=>{sync();ticking=false});
    };
    addEventListener('scroll',onScroll,{passive:true});
    addEventListener('resize',sync,{passive:true});
    sync();
  }

  function installSound(){
    const video=document.getElementById('heroVideo');
    if(!video)return;
    const sound=document.createElement('div');
    sound.className='neptune-sound';
    sound.innerHTML='<span>Sound</span><button type="button" data-muted="true">Off</button><button type="button" data-muted="false">On</button>';
    document.body.appendChild(sound);
    const bottomToggle=document.querySelector('[data-sound-toggle]');
    const buttons=[...sound.querySelectorAll('button')];
    const sync=()=>{
      buttons.forEach(btn=>btn.classList.toggle('is-on',String(video.muted)===btn.dataset.muted));
      if(bottomToggle)bottomToggle.textContent=video.muted?'Sound off':'Sound on';
    };
    const setMuted=(muted)=>{
      video.muted=muted;
      video.play().catch(()=>{});
      sync();
    };
    sound.addEventListener('click',event=>{
      const btn=event.target.closest('button');
      if(!btn)return;
      setMuted(btn.dataset.muted==='true');
    });
    bottomToggle?.addEventListener('click',()=>setMuted(!video.muted));
    sync();
  }

  function installCursor(){
    if(innerWidth<900||prefersReduced)return;
    const cursor=document.createElement('div');
    cursor.className='neptune-cursor';
    const prompt=document.createElement('div');
    prompt.className='neptune-audio-prompt';
    prompt.textContent='Click to enable audio';
    document.body.append(cursor,prompt);
    let x=-120,y=-120,tx=x,ty=y;
    const hoverSelector='a,button,.proof-card,.film-card,.signal-card,.neptune-id-card';
    addEventListener('mousemove',event=>{
      tx=event.clientX;
      ty=event.clientY;
      prompt.style.left=tx+'px';
      prompt.style.top=ty+'px';
    },{passive:true});
    document.addEventListener('mouseover',event=>{
      if(event.target.closest(hoverSelector))cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout',event=>{
      if(event.target.closest(hoverSelector))cursor.classList.remove('is-hover');
    });
    document.addEventListener('click',()=>{
      const video=document.getElementById('heroVideo');
      if(video&&video.muted){
        prompt.classList.add('is-visible');
        setTimeout(()=>prompt.classList.remove('is-visible'),900);
      }
    });
    const loop=()=>{
      x+=(tx-x)*.18;
      y+=(ty-y)*.18;
      cursor.style.transform=`translate3d(${x}px,${y}px,0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function installWorkModal(){
    const cards=[...document.querySelectorAll('.proof-card')];
    if(!cards.length)return;
    const modal=document.createElement('div');
    modal.className='neptune-work-modal';
    modal.innerHTML='<div class="neptune-work-panel" role="dialog" aria-modal="true" aria-label="Selected work"><small>Selected orbit</small><h3></h3><p></p><div class="neptune-work-actions"><a href="#" target="_blank" rel="noopener">Open</a><button type="button">Close</button></div></div>';
    document.body.appendChild(modal);
    const title=modal.querySelector('h3');
    const body=modal.querySelector('p');
    const open=modal.querySelector('a');
    const close=()=>{modal.classList.remove('is-open');document.body.classList.remove('neptune-lock')};
    modal.querySelector('button').addEventListener('click',close);
    modal.addEventListener('click',event=>{if(event.target===modal)close()});
    addEventListener('keydown',event=>{if(event.key==='Escape')close()});
    cards.forEach(card=>{
      card.classList.add('is-tilting');
      card.addEventListener('mousemove',event=>{
        if(innerWidth<900||prefersReduced)return;
        const r=card.getBoundingClientRect();
        const rx=((event.clientY-r.top)/r.height-.5)*-5;
        const ry=((event.clientX-r.left)/r.width-.5)*5;
        card.style.transform=`translateY(-10px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave',()=>{card.style.transform=''});
      card.addEventListener('click',event=>{
        if(event.target.closest('a'))return;
        const link=card.querySelector('a');
        title.textContent=card.querySelector('h3')?.textContent||'Selected Work';
        body.textContent=card.querySelector('p')?.innerText||'A selected piece inside the Neptune IP system.';
        open.href=link?.href||'#';
        open.style.display=link?'inline-flex':'none';
        modal.classList.add('is-open');
        document.body.classList.add('neptune-lock');
      });
    });
  }

  function tuneMedia(){
    const video=document.getElementById('heroVideo');
    if(video){
      video.preload='metadata';
      video.play().catch(()=>{});
    }
    document.querySelectorAll('.film-card img').forEach((img,index)=>{
      if(index>1)img.loading='lazy';
      img.decoding='async';
    });
  }

  ready(()=>{
    installLoader();
    installIdentity();
    installControls();
    installSound();
    installCursor();
    installWorkModal();
    tuneMedia();
  });
})();
