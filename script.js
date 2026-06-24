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

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- reveals escalonados (cards y pasos) ---- */
  ['.cards', '.steps'].forEach(function (sel) {
    var group = document.querySelector(sel);
    if (!group) return;
    group.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.07) + 's';
    });
  });

  /* ---- barra de progreso de scroll ---- */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  function updateProgress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  /* ---- línea de progreso del proceso ---- */
  var steps = document.querySelector('.steps');
  if (steps && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { steps.classList.add('is-drawn'); so.unobserve(steps); }
      });
    }, { threshold: 0.25 });
    so.observe(steps);
  } else if (steps) {
    steps.classList.add('is-drawn');
  }

  /* ---- tilt 3D + brillo que sigue al cursor en las cards ---- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      var sheen = document.createElement('span');
      sheen.className = 'card__sheen';
      card.appendChild(sheen);
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.transition = 'transform .1s ease-out';
        card.style.transform = 'rotateX(' + ((0.5 - py) * 5).toFixed(2) + 'deg) rotateY(' +
          ((px - 0.5) * 5).toFixed(2) + 'deg) translateY(-4px)';
        sheen.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        sheen.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform .45s cubic-bezier(.22,.61,.36,1)';
        card.style.transform = '';
      });
    });
  }
})();
