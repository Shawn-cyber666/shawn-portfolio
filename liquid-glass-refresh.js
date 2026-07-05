(()=>{
  const ORB_URL='https://future.co/images/homepage/glassy-orb/orb-purple.webm';
  const ready=(fn)=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();

  function text(el,value){
    if(el)el.textContent=value;
  }

  function makeLogo(name,mark){
    return `<svg viewBox="0 0 180 52" role="img" aria-label="${name}" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="10" width="32" height="32" rx="10" fill="#07111f" opacity=".8"/>
      <path d="${mark}" fill="#fff" opacity=".92"/>
      <text x="46" y="33" fill="#07111f" font-family="Inter,Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="-.8">${name}</text>
    </svg>`;
  }

  function installNav(){
    const brand=document.querySelector('.brand');
    const nav=document.querySelector('.nav-links');
    const action=document.getElementById('langBtn');
    if(brand){
      brand.innerHTML='Shawn Lee<span>Eighth Orbit</span>';
      brand.href='#top';
    }
    if(nav){
      nav.innerHTML=[
        ['#top','Home'],
        ['#lens','Lens'],
        ['#proof','Works'],
        ['resume.html','Resume']
      ].map(([href,label])=>`<a href="${href}">${label}</a>`).join('');
    }
    if(action){
      const resume=action.cloneNode(false);
      resume.className=action.className;
      resume.id='resumeBtn';
      resume.type='button';
      resume.innerHTML='Resume <span aria-hidden="true">&nearr;</span>';
      resume.addEventListener('click',()=>{location.href='resume.html'});
      action.replaceWith(resume);
    }
  }

  function installHero(){
    const hero=document.querySelector('.hero');
    if(!hero)return;
    document.body.classList.add('liquid-glass');
    text(hero.querySelector('.kicker'),'Shawn Lee / Product Marketing / AI Workflow');
    const heading=hero.querySelector('h1');
    if(heading)heading.innerHTML='Work smarter,<br>achieve faster';
    const left=hero.querySelector('.hero-grid > div:first-child');
    const copyBox=hero.querySelector('.hero-copy');
    if(left&&copyBox&&copyBox.parentElement!==left)left.appendChild(copyBox);
    const copy=hero.querySelector('.hero-copy p');
    if(copy){
      copy.textContent='I build sharper product narratives, AI-assisted workflows, and visual stories that turn scattered signals into clear decisions.';
    }
    if(left&&!left.querySelector('.lg-social-proof')){
      left.insertAdjacentHTML('afterbegin','<div class="lg-social-proof"><span class="lg-stars" aria-label="five stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span>Rated 4.9/5 by collaborators, mentors, and real project feedback</span></div>');
    }
    if(copyBox&&!copyBox.querySelector('.lg-actions')){
      copyBox.insertAdjacentHTML('beforeend','<div class="lg-actions"><a class="lg-primary-cta" href="resume.html">Get Started Now <span class="lg-arrow" aria-hidden="true">&rarr;</span></a><a class="lg-secondary-cta" href="#proof">View Works</a></div>');
    }
    if(!hero.querySelector('.lg-orb-wrap')){
      hero.insertAdjacentHTML('beforeend',`<div class="lg-orb-wrap" aria-hidden="true"><video class="lg-orb-video" autoplay loop muted playsinline preload="metadata"><source src="${ORB_URL}" type="video/webm"></video></div>`);
    }
    if(!hero.querySelector('.lg-logo-strip')){
      const logos=[
        makeLogo('Signal','M10 31 L18 17 L26 31 Z'),
        makeLogo('Launch','M11 31 L18 16 L25 31 L18 27 Z'),
        makeLogo('Orbit','M18 16 A10 10 0 1 1 17.9 16 M18 22 A4 4 0 1 0 18.1 22'),
        makeLogo('Workflow','M9 18 H27 V24 H9 Z M9 28 H21 V34 H9 Z'),
        makeLogo('Lens','M10 18 H26 V34 H10 Z M14 22 H22 V30 H14 Z')
      ].join('');
      hero.insertAdjacentHTML('beforeend',`<div class="lg-logo-strip"><div class="lg-logo-title">Trusted by top-tier product thinking, field research, and launch systems</div>${logos}</div>`);
    }
  }

  function installSmoothDetails(){
    const video=document.getElementById('heroVideo');
    if(video){
      video.pause();
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach(source=>source.removeAttribute('src'));
      video.load();
    }
    document.querySelectorAll('.film-card img').forEach(img=>{
      img.loading='lazy';
      img.decoding='async';
    });
  }

  ready(()=>{
    installNav();
    installHero();
    installSmoothDetails();
  });
})();
