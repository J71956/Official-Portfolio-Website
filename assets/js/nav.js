/* ---------------------------------------------------------------------------
   nav.js — mobile drawer, focus management, and the nav-height custom property.

   The old nav put eight links, a long bilingual title and a <select> on one
   unwrapped flex row, which overflowed below ~900px. Below that width the
   links now live in a drawer with a proper focus trap.
--------------------------------------------------------------------------- */

(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');
  var panel = document.getElementById('nav-links');
  var main = document.getElementById('main');
  if (!nav || !toggle || !panel) return;

  var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  var lastFocused = null;

  /* --------------------------------------------- publish the nav height */

  /* scroll-margin-top on every section reads this, so anchor jumps land below
     the fixed bar even as the bar's height changes with the viewport. */
  function publishHeight() {
    document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }

  publishHeight();
  if (window.ResizeObserver) {
    new ResizeObserver(publishHeight).observe(nav);
  } else {
    window.addEventListener('resize', publishHeight);
  }

  /* ------------------------------------------------------------- drawer */

  function isMobile() {
    return window.matchMedia('(max-width: 899px)').matches;
  }

  function labels() {
    var d = window.SITE && window.SITE.i18n
      ? window.SITE.i18n.dict(window.__LOCALE__ || 'en')
      : null;
    return d ? d.a11y : { menuOpen: 'Open menu', menuClose: 'Close menu' };
  }

  function open() {
    lastFocused = document.activeElement;
    panel.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', labels().menuClose);
    document.body.style.overflow = 'hidden';
    if (main) main.setAttribute('inert', '');
    /* Lenis would keep scrolling the page behind the drawer. */
    if (window.__lenis) window.__lenis.stop();

    var first = panel.querySelector(FOCUSABLE);
    if (first) first.focus();
  }

  function close(restoreFocus) {
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', labels().menuOpen);
    document.body.style.overflow = '';
    if (main) main.removeAttribute('inert');
    if (window.__lenis) window.__lenis.start();

    if (restoreFocus) {
      /* lastFocused is <body> when the drawer was opened by anything other than
         a real keyboard/pointer focus. Focusing that silently drops the user at
         the top of the tab order, so fall back to the toggle. */
      var target = (lastFocused &&
                    lastFocused !== document.body &&
                    lastFocused.focus &&
                    document.contains(lastFocused)) ? lastFocused : toggle;
      target.focus();
    }
  }

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  toggle.addEventListener('click', function () {
    isOpen() ? close(true) : open();
  });

  /* Follow a link, then close without stealing focus back to the toggle. */
  panel.addEventListener('click', function (e) {
    if (e.target.closest('a[href^="#"]') && isMobile()) close(false);
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
      return;
    }

    if (e.key !== 'Tab') return;

    /* Focus trap: cycle within the drawer while it is open. */
    var items = Array.prototype.filter.call(
      panel.querySelectorAll(FOCUSABLE),
      function (el) { return el.offsetParent !== null; }
    );
    if (!items.length) return;

    var first = items[0];
    var last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* Resizing past the breakpoint must not leave <main> inert and the body
     scroll-locked while the drawer styles no longer apply. */
  window.matchMedia('(max-width: 899px)').addEventListener('change', function (e) {
    if (!e.matches && isOpen()) close(false);
  });

  /* Locale buttons live inside the drawer on mobile; re-label the toggle when
     the language changes so the accessible name stays correct. */
  document.addEventListener('localechange', function () {
    toggle.setAttribute('aria-label', isOpen() ? labels().menuClose : labels().menuOpen);
  });
})();
