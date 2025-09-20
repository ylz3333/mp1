// Import assets into the bundle

// Helpers
const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => [...el.querySelectorAll(sel)];

// Navbar toggle (mobile)
const navbar = qs('.navbar');
const toggleBtn = qs('.navbar__toggle');
toggleBtn?.addEventListener('click', () => {
  const open = navbar.classList.toggle('is-open');
  toggleBtn.setAttribute('aria-expanded', String(open));
});

// Navbar shrink on scroll
function resizeNavbar() {
  if (window.scrollY > 1) navbar.classList.add('is-shrink');
  else navbar.classList.remove('is-shrink');
}
resizeNavbar();
window.addEventListener('scroll', resizeNavbar, { passive: true });

// Smooth scroll + close mobile menu
qsa('a[data-nav]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    const target = qs(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    navbar.classList.remove('is-open');
    toggleBtn?.setAttribute('aria-expanded', 'false');
  });
});
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));
}

// Scroll spy + progress bar (highlight current menu item)
const navLinks = qsa('.navbar__menu a[data-nav]');
const progressBar = qs('.navbar__progress span');

function updateScrollState() {
  const sections = navLinks.map(l => qs(l.getAttribute('href'))).filter(Boolean);
  let current = sections[0];
  const navBottom = navbar.getBoundingClientRect().bottom + window.scrollY;

  for (const sec of sections) {
    if (sec.offsetTop <= navBottom + 1) current = sec;
  }

  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
  const activeSection = nearBottom ? sections[sections.length - 1] : current;

  navLinks.forEach(l => l.classList.remove('is-active'));
  qs(`.navbar__menu a[href="#${activeSection.id}"]`)?.classList.add('is-active');

  const scrollable = document.body.scrollHeight - window.innerHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = `${pct}%`;
}
updateScrollState();
window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState);

// Carousel
const track = qs('[data-carousel-track]');
const slides = qsa('.carousel__slide', track || undefined);
let index = 0;

function goTo(i) {
  if (!track || slides.length === 0) return;
  index = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${index * 100}%)`;
}
qs('[data-carousel="prev"]')?.addEventListener('click', () => goTo(index - 1));
qs('[data-carousel="next"]')?.addEventListener('click', () => goTo(index + 1));

// Modal
qsa('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = qs(btn.getAttribute('data-open-modal'));
    modal?.classList.add('is-open');
  });
});
qsa('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.modal')?.classList.remove('is-open'));
});
qsa('.modal__overlay').forEach(ov => {
  ov.addEventListener('click', () => ov.closest('.modal')?.classList.remove('is-open'));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') qsa('.modal.is-open').forEach(m => m.classList.remove('is-open'));
});

// Footer year
const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
