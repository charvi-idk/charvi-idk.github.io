/* ════════════════════════════════════════
   STARS — real twinkling
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const c = document.getElementById('stars');
  if (!c) return;
  for (let i = 0; i < 70; i++) {
    const d = document.createElement('div');
    d.className = 'star';
    const s = Math.random() * 2.6 + 0.5;
    const dur = (1.8 + Math.random() * 4).toFixed(2);
    const del = (Math.random() * 10).toFixed(2);
    d.style.cssText = `width:${s}px;height:${s}px;top:${Math.random()*94}%;left:${Math.random()*100}%;animation-duration:${dur}s;animation-delay:${del}s;`;
    c.appendChild(d);
  }
});

/* ════════════════════════════════════════
   THEME — sun / moon toggle
   Click the sun in hero or city section to swap themes.
   No button. Default: dark mode.
════════════════════════════════════════ */
const html    = document.documentElement;
const heroSun = document.getElementById('hero-sun');
const skySun  = document.getElementById('sky-sun');
const sunIcon = document.getElementById('sun-icon');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (sunIcon) sunIcon.textContent = theme === 'dark' ? '' : '';
  if (skySun)  skySun.classList.toggle('is-moon', theme === 'dark');
}

function toggleTheme() {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

applyTheme(localStorage.getItem('theme') || 'dark');

if (heroSun) heroSun.addEventListener('click', toggleTheme);
if (skySun)  skySun.addEventListener('click', toggleTheme);

/* ════════════════════════════════════════
   SCROLL REVEAL — about postcard
════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ════════════════════════════════════════
   BUILDING POPUPS
   Desktop: CSS hover opens popup
   Click/tap: toggles popup-open class
   Click outside: closes all
════════════════════════════════════════ */
document.querySelectorAll('.building, .cv-section').forEach(el => {
  el.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // let links pass through
    const wasOpen = el.classList.contains('popup-open');
    document.querySelectorAll('.popup-open').forEach(b => b.classList.remove('popup-open'));
    if (!wasOpen) el.classList.add('popup-open');
    e.stopPropagation();
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.popup-open').forEach(b => b.classList.remove('popup-open'));
});

/* ════════════════════════════════════════
   SKYLINE — horizontal scroll
════════════════════════════════════════ */
const outer    = document.getElementById('skyline-outer');
const track    = document.getElementById('skyline-track');
const progress = document.getElementById('sky-progress');

function getSkylineHeight() {
  if (!track) return 0;
  return Math.max(track.scrollWidth - window.innerWidth, 0);
}

function initSkyline() {
  if (!outer || !track) return;
  outer.style.height = (getSkylineHeight() + window.innerHeight) + 'px';
}

function updateSkyline() {
  if (!outer || !track) return;
  const rect     = outer.getBoundingClientRect();
  const scrolled = -rect.top;
  const maxS     = getSkylineHeight();
  if (scrolled < 0 || maxS <= 0) {
    track.style.transform = 'translateX(0)';
    if (progress) progress.style.width = '0%';
    return;
  }
  const pct = Math.min(scrolled / maxS, 1);
  track.style.transform = `translateX(${-pct * maxS}px)`;
  if (progress) progress.style.width = (pct * 100) + '%';
}

window.addEventListener('scroll', updateSkyline, { passive: true });
window.addEventListener('resize', () => { initSkyline(); updateSkyline(); });
window.addEventListener('load',   () => { initSkyline(); updateSkyline(); });

/* ════════════════════════════════════════
   TOUCH / SWIPE — mobile skyline
════════════════════════════════════════ */
let touchStartX = 0, touchStartScrollY = 0;
const skySticky = document.getElementById('skyline-sticky');
if (skySticky) {
  skySticky.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartScrollY = window.scrollY;
  }, { passive: true });
  skySticky.addEventListener('touchmove', e => {
    const dx = touchStartX - e.touches[0].clientX;
    window.scrollTo(0, touchStartScrollY + dx * 1.6);
  }, { passive: true });
}

initSkyline();