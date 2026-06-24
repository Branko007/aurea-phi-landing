/* ============================================================
   Aurea Phi — interacciones de la landing
   ============================================================ */
(function () {
  'use strict';

  /* ---- año dinámico en el footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- nav: fondo al hacer scroll ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- menú móvil ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    // cerrar al elegir un enlace
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
      });
    });
  }

  /* ---- scroll-reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- resaltado de sección activa en el nav ---- */
  var sections = ['servicios', 'proceso', 'herramientas', 'contacto']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinkMap = {};
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var id = a.getAttribute('href').replace('#', '');
    navLinkMap[id] = a;
  });

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinkMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(navLinkMap).forEach(function (k) {
            navLinkMap[k].classList.remove('is-active');
          });
          link.classList.add('is-active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
