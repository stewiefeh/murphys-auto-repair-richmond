/* Open/closed chip, computed in shop time (America/New_York) */
function shopClock(){
  // Build a "now" in the shop's zone without external APIs
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',hour12:false,
    year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',weekday:'short'})
    .formatToParts(new Date());
  const get = t => parts.find(p=>p.type===t)?.value;
  const hour = parseInt(get('hour'),10) % 24;
  const minute = parseInt(get('minute'),10);
  const day = get('weekday'); // Mon Tue Wed Thu Fri Sat Sun
  const names = {Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
  const open = (hour>7 || (hour===7 && minute>=0)) && hour<21;
  const chipText = open
    ? 'Open now \u00b7 closes at 9:00 PM'
    : (hour>=21 ? `Closed \u00b7 opens tomorrow at 7:00 AM` : `Closed \u00b7 opens at 7:00 AM`);
  return {open,chipText,names,day,hour,minute};
}
function paintChips(){
  const st = shopClock();
  document.querySelectorAll('.open-chip').forEach(chip=>{
    chip.hidden = false;
    chip.textContent = st.chipText;
    chip.classList.toggle('is-open', st.open);
    chip.classList.toggle('is-closed', !st.open);
  });
}
paintChips();

/* Reveal on scroll */
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealables = document.querySelectorAll('.order-card,.quote,.about,.visit,.fact,.section-head,.closer h2,.closer p,.closer .btn');
if(!reduced && 'IntersectionObserver' in window){
  revealables.forEach(el=>el.classList.add('reveal'));
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
    });
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  revealables.forEach(el=>io.observe(el));
}

/* Subtle hero parallax */
const heroImg = document.querySelector('.hero-photo img');
if(heroImg && !reduced){
  let ticking = false;
  window.addEventListener('scroll',()=>{
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      const y = Math.min(window.scrollY, window.innerHeight);
      heroImg.style.transform = `translateY(${y*0.18}px) scale(1.06)`;
      ticking = false;
    });
  },{passive:true});
}
