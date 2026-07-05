/* ================================================
   MD HAUSMEISTERSERVICE — main.js v2
   Cool features: progress bar, counter, parallax,
   back-to-top, accordion, mobile nav
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── SCROLL PROGRESS BAR ────────────────────────
  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  // ── STICKY NAVBAR ───────────────────────────────
  const navbar = document.querySelector('.navbar');
  function updateNav() {
    navbar?.classList.toggle('scrolled', window.scrollY > 12);
  }

  // ── BACK TO TOP ─────────────────────────────────
  const btt = document.getElementById('back-to-top');
  function updateBTT() {
    btt?.classList.toggle('show', window.scrollY > 400);
  }
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Bundle scroll listeners
  window.addEventListener('scroll', () => {
    updateProgress();
    updateNav();
    updateBTT();
    updateParallax();
  }, { passive: true });
  updateNav(); updateBTT(); updateProgress();

  // ── MOBILE NAV ─────────────────────────────────
  const navToggle  = document.getElementById('navToggle');
  const navMenu    = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  const openNav = () => {
    navToggle?.classList.add('open');
    navMenu?.classList.add('open');
    navOverlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
    navToggle?.setAttribute('aria-expanded', 'true');
  };
  const closeNav = () => {
    navToggle?.classList.remove('open');
    navMenu?.classList.remove('open');
    navOverlay?.classList.remove('show');
    document.body.style.overflow = '';
    navToggle?.setAttribute('aria-expanded', 'false');
  };
  navToggle?.addEventListener('click', () => navToggle.classList.contains('open') ? closeNav() : openNav());
  navOverlay?.addEventListener('click', closeNav);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  // ── MOBILE DROPDOWN ─────────────────────────────
  document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = link.closest('.has-dropdown');
        const was = parent.classList.contains('open');
        document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
        if (!was) parent.classList.add('open');
      }
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.has-dropdown') && window.innerWidth > 768) {
      document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
    }
  });

  // ── ACTIVE NAV LINK ─────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
      link.closest('.has-dropdown')?.querySelector(':scope > a')?.classList.add('active');
    }
  });

  // ── SCROLL REVEAL ───────────────────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── ANIMATED COUNTERS ───────────────────────────
  function animateCounter(el) {
    const target  = parseFloat(el.dataset.counter);
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const dur     = 1800;
    const start   = performance.now();
    const isFloat = String(target).includes('.');

    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const val  = target * ease;
      el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
    }
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => counterObs.observe(el));

  // ── PARALLAX HERO ───────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  function updateParallax() {
    if (!heroBg) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const scroll = window.scrollY;
    heroBg.style.transform = `translateY(${scroll * 0.3}px)`;
  }

  // ── ACCORDION ───────────────────────────────────
  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const body = item.querySelector('.acc-body');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.acc-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.acc-body').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // ── CONTACT FORM ────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Nachricht wurde gesendet!';
      btn.disabled = true;
      btn.style.cssText = 'background:#22c55e;border-color:#22c55e;color:#fff';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled  = false;
        btn.style.cssText = '';
        contactForm.reset();
      }, 4500);
    });
  }

  // ── SMOOTH SCROLL ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ── SERVICE CHIP SCROLL (strip) ─────────────────
  const strip = document.querySelector('.services-strip .container');
  if (strip) {
    strip.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        strip.scrollLeft += e.deltaY * 0.6;
      }
    }, { passive: false });
  }

  // ── COOKIE BANNER ────────────────────────────────
  if (!localStorage.getItem('cookieConsent')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <p>Wir verwenden Cookies, um Ihnen die bestmögliche Nutzung unserer Website zu ermöglichen. Weitere Infos in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
      <div class="cookie-actions">
        <button type="button" class="btn btn-outline btn-sm cookie-decline">Ablehnen</button>
        <button type="button" class="btn btn-primary btn-sm cookie-accept">Akzeptieren</button>
      </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('show'));

    function closeBanner(value) {
      localStorage.setItem('cookieConsent', value);
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 300);
    }
    banner.querySelector('.cookie-accept').addEventListener('click', () => closeBanner('accepted'));
    banner.querySelector('.cookie-decline').addEventListener('click', () => closeBanner('declined'));
  }

});
