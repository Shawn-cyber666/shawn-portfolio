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
  }

  function installControls(){
    const list=sections();
    if(!list.length)return;
    const mark=document.createElement('div');
    mark.className='neptune-ip-mark';
    mark.innerHTML='<strong>VIII</strong><span>Neptune IP<br>Scroll-responsive orbit</span>';
    const controller=document.createElement('div');
    controller.className='neptune-controller';
    controller.innerHTML='<button type="button" data-dir="-1">Prev</button><button type="button" data-dir="1">Next</button>';
    document.body.append(mark,controller);

    const sync=()=>{
      const i=activeIndex(list);
      const section=list[i];
      const id=section?.id||'hero';
      mark.innerHTML=`<strong>${String(i+1).padStart(2,'0')}</strong><span>${names[id]||id}<br>Neptune IP</span>`;
      document.body.dataset.neptuneSection=id;
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
    const buttons=[...sound.querySelectorAll('button')];
    const sync=()=>buttons.forEach(btn=>btn.classList.toggle('is-on',String(video.muted)===btn.dataset.muted));
    sound.addEventListener('click',event=>{
      const btn=event.target.closest('button');
      if(!btn)return;
      video.muted=btn.dataset.muted==='true';
      video.play().catch(()=>{});
      sync();
    });
    sync();
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
    installIdentity();
    installControls();
    installSound();
    tuneMedia();
  });
})();
