/* ============================================================
   Free Player — interacciones de la página de promoción
   Sin dependencias. Respeta prefers-reduced-motion.
   ============================================================ */

(function () {
  'use strict';

  var doc = document;
  var nav = doc.getElementById('nav');
  var navLinks = doc.getElementById('nav-links');
  var navToggle = doc.getElementById('nav-toggle');
  var navBackdrop = doc.getElementById('nav-backdrop');
  var toast = doc.getElementById('toast');
  var progressBar = doc.getElementById('scroll-progress');
  var toTop = doc.getElementById('to-top');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año del pie ---------- */
  var year = doc.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Menú móvil ---------- */
  function setNav(open) {
    if (!navLinks || !navToggle) return;
    navLinks.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    doc.body.classList.toggle('nav-open', open);

    if (navBackdrop) {
      if (open) {
        navBackdrop.hidden = false;
        window.requestAnimationFrame(function () {
          navBackdrop.classList.add('is-open');
        });
      } else {
        navBackdrop.classList.remove('is-open');
        window.setTimeout(function () {
          if (!navLinks.classList.contains('is-open')) navBackdrop.hidden = true;
        }, 320);
      }
    }
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      setNav(!navLinks.classList.contains('is-open'));
    });

    navLinks.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (link) setNav(false);
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', function () { setNav(false); });
    }

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setNav(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setNav(false);
    });
  }

  /* ---------- Barra de progreso, navegación y volver arriba ---------- */
  function updateScrollUI() {
    var y = window.scrollY || doc.documentElement.scrollTop || 0;
    var max = doc.documentElement.scrollHeight - window.innerHeight;

    if (progressBar) {
      var ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }

    if (nav) nav.classList.toggle('is-scrolled', y > 10);

    if (toTop) {
      if (y > 700) {
        toTop.hidden = false;
        window.requestAnimationFrame(function () {
          toTop.classList.add('is-visible');
        });
      } else {
        toTop.classList.remove('is-visible');
        if (y < 620) toTop.hidden = true;
      }
    }
  }

  var scrollQueued = false;
  window.addEventListener('scroll', function () {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(function () {
      updateScrollUI();
      scrollQueued = false;
    });
  }, { passive: true });

  updateScrollUI();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ---------- Aparición progresiva ---------- */
  var revealItems = doc.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  /* ---------- Cifras animadas ---------- */
  function formatNumber(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function animateCount(el) {
    var target = Number(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) {
      el.textContent = formatNumber(target) + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatNumber(Math.round(target * eased)) + suffix;
      if (t < 1) window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  var counters = doc.querySelectorAll('.stat strong[data-count]');

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.55 });

      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ---------- Sección activa en la navegación ---------- */
  var sectionLinks = Array.prototype.slice.call(
    doc.querySelectorAll('.nav__links > a[href^="#"]')
  );

  if (sectionLinks.length && 'IntersectionObserver' in window) {
    var linkFor = {};
    sectionLinks.forEach(function (link) {
      linkFor[link.getAttribute('href')] = link;
    });

    var sections = [];
    sectionLinks.forEach(function (link) {
      var section = doc.querySelector(link.getAttribute('href'));
      if (section && sections.indexOf(section) === -1) sections.push(section);
    });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var active = linkFor['#' + entry.target.id];
        if (!active) return;
        sectionLinks.forEach(function (link) { link.classList.remove('is-current'); });
        active.classList.add('is-current');
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------- Aviso al descargar ---------- */
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 4500);
  }

  doc.querySelectorAll('[data-apk], .nav__cta').forEach(function (link) {
    link.addEventListener('click', function () {
      showToast('Descargando Free Player… revisa tus descargas.');
    });
  });

  /* ---------- Enlaces internos con desplazamiento suave ---------- */
  doc.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = doc.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });

      if (history.replaceState) {
        try { history.replaceState(null, '', id); } catch (_) { /* file:// */ }
      }
    });
  });
})();
