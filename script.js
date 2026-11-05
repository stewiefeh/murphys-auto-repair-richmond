/* Open/closed status, computed in shop time (America/New_York) */
function shopClock(){
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',hour12:false,
    year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',weekday:'short'})
    .formatToParts(new Date());
  const get = t => parts.find(p=>p.type===t)?.value;
  const hour = parseInt(get('hour'),10) % 24;
  const minute = parseInt(get('minute'),10);
  const open = hour >= 7 && hour < 21;
  const chipText = open
    ? 'STATUS: OPEN \u00b7 CLOSES 9:00 PM'
    : (hour >= 21 ? 'STATUS: CLOSED \u00b7 OPENS 7:00 AM' : 'STATUS: CLOSED \u00b7 OPENS 7:00 AM');
  const chipShort = open ? 'Open now \u00b7 closes at 9:00 PM' : 'Closed \u00b7 opens at 7:00 AM';
  return {open,chipText,chipShort};
}
function paint(){
  const st = shopClock();
  const tag = document.getElementById('statusTag');
  if(tag){
    tag.hidden = false;
    tag.querySelector('.st-text').textContent = st.chipText;
    tag.classList.toggle('is-closed', !st.open);
  }
  document.querySelectorAll('.open-chip').forEach(chip=>{
    chip.hidden = false;
    chip.textContent = st.chipShort;
    chip.classList.toggle('is-open', st.open);
  });
}
paint();

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Subtle hero parallax */
const heroImg = document.querySelector('.hero-photo img');
if(heroImg && !reduced){
  let ticking = false;
  window.addEventListener('scroll',()=>{
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      const y = Math.min(window.scrollY, window.innerHeight);
      heroImg.style.transform = `translateY(${y*0.16}px) scale(1.06)`;
      ticking = false;
    });
  },{passive:true});
}

/* Directions hand-off: iPhone/iPad open Apple Maps, Android opens its maps app
   (geo:), desktop keeps the Google Maps web route. */
(function(){
  var DEST = "37.5513518,-77.3429185";
  var NAME = encodeURIComponent("Murphy's Auto Repair LLC, 5928 Nine Mile Rd Suite A, Richmond, VA 23223");
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
              (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/.test(navigator.userAgent);
  document.querySelectorAll('a[href*="google.com/maps/dir"]').forEach(function(a){
    a.addEventListener('click', function(){
      if(isIOS){ a.href = "https://maps.apple.com/?daddr=" + DEST + "&q=" + NAME + "&dirflg=d"; }
      else if(isAndroid){ a.href = "geo:" + DEST + "?q=" + DEST + "(" + NAME + ")"; }
      /* desktop: leave the Google Maps web link alone */
    });
  });
})();
