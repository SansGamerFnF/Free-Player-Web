/* ============================================================
   Free Player — interacciones de la página de promoción
   ============================================================ */

(function () {
  'use strict';

  const doc = document;
  const nav = doc.getElementById('nav');
  const navLinks = doc.getElementById('nav-links');
  const navToggle = doc.getElementById('nav-toggle');
  const toast = doc.getElementById('toast');

  /* ---------- Año del pie ---------- */
  const year = doc.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Navegación móvil ---------- */
  function closeNav() {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    doc.body.classList.remove('nav-open');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      doc.body.classList.toggle('nav-open', open);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------- Fondo de la barra al desplazar ---------- */
  let scrollScheduled = false;

  function updateNav() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 12);
    scrollScheduled = false;
  }

  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    window.requestAnimationFrame(updateNav);
  }, { passive: true });

  updateNav();

  /* ---------- Aparición progresiva ---------- */
  const revealItems = doc.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach((item) => observer.observe(item));
  }

  /* ---------- Aviso al descargar ---------- */
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4200);
  }

  doc.querySelectorAll('[data-apk]').forEach((link) => {
    link.addEventListener('click', () => {
      showToast('Descargando Free Player… revisa tus descargas.');
    });
  });

  /* ---------- Enlaces internos sin salto brusco ---------- */
  doc.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = doc.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      if (history.replaceState) {
        try { history.replaceState(null, '', id); } catch (_) { /* file:// */ }
      }
    });
  });
})();
