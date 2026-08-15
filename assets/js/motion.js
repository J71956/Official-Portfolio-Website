/* ---------------------------------------------------------------------------
   motion.js — scroll storytelling.

   Structure:
     tier 1  reveals, scrollspy, progress rail, nav state
     tier 2  Lenis, per-depth parallax, hero atmosphere
     tier 3  line-mask headline, word lighting, pinned horizontal tracks

   Two rules hold throughout:
     - Every pinned trigger is registered inside gsap.matchMedia() with a
       working fallback branch, so resizing across a breakpoint reverts cleanly.
     - Under prefers-reduced-motion nothing is registered except the scrollspy.
       A section is never left invisible.
--------------------------------------------------------------------------- */

(function () {
  'use strict';

  var root = document.documentElement;

  /* If the GSAP CDN is blocked, the armed from-hidden reveal states would
     leave every section invisible. Disarm them and bail. */
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove('motion-on');
    root.classList.add('motion-off');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COARSE = window.matchMedia('(pointer: coarse)').matches;

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait);
    };
  }

  gsap.defaults({ ease: 'expo.out', duration: 1.1 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ===================================================== scrollspy (always) */

  /* Replaces the old unthrottled scroll listener that recomputed offsetTop for
     every section on every event. ScrollTrigger batches all reads into one rAF
     and caches positions until a refresh. */
  function initScrollSpy() {
    var links = {};
    document.querySelectorAll('.nav-link[href^="#"]').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });

    document.querySelectorAll('main section[id]').forEach(function (section) {
      var link = links[section.id];
      if (!link) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: function (self) {
          link.classList.toggle('is-active', self.isActive);
        }
      });
    });
  }

  /* ============================================================ reduced path */

  if (REDUCED) {
    root.classList.remove('motion-on');
    root.classList.add('motion-off');
    initScrollSpy();
    initGalleryButtons();
    return;
  }

  /* ================================================================= tier 2 */
  /* Lenis: ScrollTrigger's scrub needs a continuously interpolated scroll
     position, or scrubbed timelines stutter on Windows wheel input. Touch is
     excluded — native momentum is better and hijacking it breaks
     pull-to-refresh. */

  var lenis = null;

  if (window.Lenis && !COARSE) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    /* Anchor links must go through Lenis or the two scroll models fight. */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var navH = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 68;
      lenis.scrollTo(target, { offset: -navH - 12, duration: 1.1 });
    });
  } else {
    root.style.scrollBehavior = 'smooth';
  }

  /* ================================================================= tier 1 */

  /* Triggers bound to content nodes that i18n.js re-creates on every locale
     switch. They must be killed and rebuilt, or the new nodes stay at their
     armed opacity:0 state forever. */
  var contentTriggers = [];

  function keep(result) {
    if (Array.isArray(result)) contentTriggers.push.apply(contentTriggers, result);
    else if (result) contentTriggers.push(result);
    return result;
  }

  /* Reveals are deliberately brisk: they should acknowledge that a section has
     arrived, not make the reader wait for it. Triggers also fire earlier
     (top 95%) so content is already settling as it enters the viewport. */
  function initReveals() {
    /* Batched so a section of ten cards costs one trigger, not ten. */
    keep(ScrollTrigger.batch('[data-reveal]:not([data-reveal="wipe"]):not([data-reveal="chip"])', {
      start: 'top 95%',
      once: true,
      onEnter: function (els) {
        gsap.to(els, {
          opacity: 1, y: 0, duration: 0.45, stagger: 0.035,
          onComplete: function () { gsap.set(els, { willChange: 'auto' }); }
        });
      }
    }));

    keep(ScrollTrigger.batch('[data-reveal="wipe"]', {
      start: 'top 95%',
      once: true,
      onEnter: function (els) {
        gsap.to(els, {
          clipPath: 'inset(0 0% 0 0)', duration: 0.5, stagger: 0.05,
          onComplete: function () { gsap.set(els, { willChange: 'auto', clipPath: 'none' }); }
        });
      }
    }));

    keep(ScrollTrigger.batch('[data-reveal="chip"]', {
      start: 'top 95%',
      once: true,
      onEnter: function (els) {
        gsap.to(els, {
          opacity: 1, scale: 1, duration: 0.35,
          stagger: { each: 0.012, from: 'random' },
          onComplete: function () { gsap.set(els, { willChange: 'auto' }); }
        });
      }
    }));
  }

  /* Put every revealable element into its resting state immediately.
     Used after a locale switch: the entrance choreography belongs to the first
     read-through, and re-arming it on freshly cloned nodes risks leaving
     content invisible if a trigger fails to fire. Being plainly visible is
     always the correct fallback. */
  function settleAll() {
    gsap.set('[data-reveal]', {
      opacity: 1, y: 0, scale: 1, clipPath: 'none', willChange: 'auto'
    });
  }

  function initProgressRail() {
    var bar = document.querySelector('.progress-bar');
    if (!bar) return;
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });
  }

  function initNavState() {
    var nav = document.getElementById('nav');
    var hero = document.getElementById('home');
    if (!nav || !hero) return;
    ScrollTrigger.create({
      trigger: hero,
      start: 'top+=80 top',
      onToggle: function (self) { nav.classList.toggle('is-solid', self.isActive); },
      onLeave: function () { nav.classList.add('is-solid'); },
      onEnterBack: function () { nav.classList.add('is-solid'); },
      onLeaveBack: function () { nav.classList.remove('is-solid'); }
    });
  }

  /* ====================================================== tier 2: parallax */

  function initParallax() {
    /* L2 — ghost numerals and wordmarks drift against the content. */
    gsap.utils.toArray('.ghost').forEach(function (el) {
      gsap.fromTo(el, { yPercent: 8 }, {
        yPercent: -14, ease: 'none',
        scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* L1 — ambient blooms, slower still. */
    gsap.utils.toArray('.hero-bloom, .contact-bloom').forEach(function (el, i) {
      gsap.fromTo(el, { yPercent: 0 }, {
        yPercent: i % 2 ? 10 : -8, ease: 'none',
        scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* L1 — slow independent drift so the light is never quite still. */
    gsap.to('.hero-bloom--a', { xPercent: 4, yPercent: -3, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero-bloom--b', { xPercent: -5, yPercent: 4, duration: 26, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    /* L4 — the portrait leads the scroll slightly. */
    var portrait = document.querySelector('.hero-portrait');
    if (portrait) {
      gsap.fromTo(portrait, { yPercent: 0 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ================================================ tier 2: hero atmosphere */

  /* Replaces particles.js: no line-linking (which was O(n^2)), no mouse
     hit-testing, ~45 motes instead of 80, and paused when off-screen. */
  function initMotes() {
    var canvas = document.getElementById('hero-motes');
    if (!canvas || COARSE) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var motes = [];
    var raf = null;
    var w = 0, h = 0;

    function size() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      motes = [];
      for (var i = 0; i < 45; i++) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.5 + Math.random() * 1.4,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -0.05 - Math.random() * 0.14,
          a: 0.05 + Math.random() * 0.13
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -4) { m.y = h + 4; m.x = Math.random() * w; }
        if (m.x < -4) m.x = w + 4;
        if (m.x > w + 4) m.x = -4;
        ctx.globalAlpha = m.a;
        ctx.fillStyle = '#D8A657';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!raf) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    size(); seed(); start();

    window.addEventListener('resize', function () { size(); seed(); });

    /* No reason to burn a rAF loop on a canvas nobody can see. */
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0 }).observe(canvas);
    }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
  }

  /* ================================================ tier 3: text techniques */

  /* Split an element into visual lines using Range rectangles, so the mask
     follows real wrapping rather than a guess. Must be re-run on resize and on
     locale change, since CJK wraps completely differently. */
  function splitLines(el) {
    if (el.__original === undefined) el.__original = el.textContent;
    var text = el.__original;

    el.textContent = '';
    var words = text.split(/\s+/).filter(Boolean);
    /* CJK has no spaces; fall back to per-character measurement. */
    if (words.length < 2) words = text.split('');

    var spans = words.map(function (word, i) {
      var s = document.createElement('span');
      s.textContent = word + (i < words.length - 1 && text.indexOf(' ') > -1 ? ' ' : '');
      el.appendChild(s);
      return s;
    });

    var lines = [];
    var lastTop = null;
    spans.forEach(function (s) {
      var top = Math.round(s.offsetTop);
      if (lastTop === null || top !== lastTop) { lines.push([]); lastTop = top; }
      lines[lines.length - 1].push(s);
    });

    el.textContent = '';
    var inners = [];
    lines.forEach(function (group) {
      var line = document.createElement('span');
      line.className = 'line';
      var inner = document.createElement('span');
      inner.className = 'line-inner';
      inner.textContent = group.map(function (s) { return s.textContent; }).join('');
      line.appendChild(inner);
      el.appendChild(line);
      inners.push(inner);
    });
    return inners;
  }

  function initSplitHeadings() {
    gsap.utils.toArray('[data-split]').forEach(function (el) {
      var inners = splitLines(el);
      var isHero = el.closest('#home');

      var tween = {
        /* Both y and yPercent must be zeroed. The start state comes from CSS
           (translateY(110%)), which GSAP parses into y as pixels; animating
           yPercent alone leaves that pixel offset in place and the line stays
           parked below its mask forever. */
        y: 0,
        yPercent: 0,
        duration: isHero ? 0.9 : 0.55,
        stagger: isHero ? 0.07 : 0.05,
        onComplete: function () { gsap.set(inners, { willChange: 'auto' }); }
      };

      if (!isHero) {
        tween.scrollTrigger = { trigger: el, start: 'top 92%', once: true };
      }
      gsap.to(inners, tween);

      /* The hero headline is the single most important line on the page and it
         animates from behind a mask, so a failure here is invisible text.
         Force the resting state if it has not arrived on its own. */
      if (isHero) {
        setTimeout(function () {
          inners.forEach(function (n) {
            if (Math.abs(n.getBoundingClientRect().top - n.parentNode.getBoundingClientRect().top) > 2) {
              gsap.set(n, { y: 0, yPercent: 0 });
            }
          });
        }, 2500);
      }
    });
  }

  function initWordLighting() {
    var el = document.querySelector('[data-words]');
    if (!el) return;

    if (el.__original === undefined) el.__original = el.textContent;
    var text = el.__original;
    if (!text) return;
    var parts = text.split(/(\s+)/);

    el.textContent = '';
    var words = [];
    parts.forEach(function (part) {
      if (/^\s+$/.test(part)) {
        el.appendChild(document.createTextNode(part));
        return;
      }
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = part;
      el.appendChild(s);
      words.push(s);
    });
    if (!words.length) return;

    gsap.to(words, {
      opacity: 1,
      filter: 'blur(0px)',
      ease: 'none',
      stagger: 0.5,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'top 30%', scrub: 0.6 }
    });
  }

  /* ================================================ tier 3: hero entrance */

  function initHeroEntrance() {
    var tl = gsap.timeline({ delay: 0.15 });
    var portrait = document.querySelector('.hero-portrait');

    /* The hero copy animates from opacity 0, so if the animation engine never
       advances — a background tab at load, a suspended rAF — the most
       important text on the page would stay invisible. Timers still run when
       rAF does not, so this forces the end state if nothing has happened. */
    setTimeout(function () {
      if (tl.progress() === 0) tl.progress(1);
    }, 2500);

    if (portrait) {
      tl.to(portrait, { clipPath: 'inset(0% 0 0 0)', duration: 1.3 }, 0);
    }
    /* .hero-name is the split headline and is animated by initSplitHeadings. */
    tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.9 }, 0.15);
    tl.from('.hero-alt', { opacity: 0, y: 16, duration: 0.9 }, 0.5);
    tl.from('.hero-lede', { opacity: 0, y: 20, duration: 1.0 }, 0.6);
    tl.from('.hero-cta', { opacity: 0, y: 20, duration: 1.0 }, 0.7);
    tl.from('.hero-scroll', { opacity: 0, duration: 0.8 }, 0.9);

    /* Scroll-out: the hero recedes so the next section rises over it. */
    gsap.to('.hero-inner', {
      opacity: 0, yPercent: -12, scale: 0.97, ease: 'none',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ============================================ tier 3: experience rail */

  function initExperienceRail() {
    var fill = document.querySelector('.experience-rail-fill');
    var section = document.getElementById('experience');
    if (!fill || !section) return;

    gsap.to(fill, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top 70%', end: 'bottom 80%', scrub: true }
    });

    initExperienceMarkers();
  }

  /* Split out because the cards are re-created on every locale switch. */
  function initExperienceMarkers() {
    gsap.utils.toArray('.exp-card').forEach(function (card) {
      keep(ScrollTrigger.create({
        trigger: card,
        start: 'top 70%',
        onToggle: function (self) { card.classList.toggle('is-lit', self.isActive); },
        onEnter: function () { card.classList.add('is-lit'); }
      }));
    });
  }

  /* ============================================= tier 3: in-frame parallax */

  /* Nothing on this page pins the viewport. An earlier version scrubbed the
     Work section horizontally while pinned, which trapped roughly 3,000px of
     vertical scroll on the site's main content. Depth here comes from moving
     the image *inside* its own frame instead — the page keeps scrolling
     normally the whole time. */
  function initMediaParallax() {
    if (COARSE) return;
    gsap.utils.toArray('.gallery-media img, .project-media img').forEach(function (img) {
      var t = gsap.fromTo(img,
        { yPercent: -4, scale: 1.08 },
        {
          yPercent: 4, ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.media'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
      keep(t.scrollTrigger);
    });
  }

  /* ================================================== gallery a11y controls */

  /* Used on touch, on reduced motion, and by keyboard users at any width.
     The scroll-snap track is the source of truth; these just drive it. */
  function initGalleryButtons() {
    var track = document.getElementById('gallery-track');
    var prev = document.getElementById('gallery-prev');
    var next = document.getElementById('gallery-next');
    var status = document.getElementById('gallery-status');
    if (!track || !prev || !next) return;

    function figures() {
      return Array.prototype.slice.call(track.querySelectorAll('.gallery-figure'));
    }

    /* The index is tracked explicitly rather than re-derived from scroll offset
       on every click. Deriving it meant a click could resolve to the figure
       already centred and scroll nowhere — stepping backwards silently did
       nothing. Manual scrolling re-syncs it in sync(). */
    var index = 0;

    function nearest() {
      var items = figures();
      var mid = track.scrollLeft + track.clientWidth / 2;
      var best = 0, bestD = Infinity;
      items.forEach(function (el, i) {
        var d = Math.abs((el.offsetLeft + el.offsetWidth / 2) - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    }

    function scrollToIndex(i, smooth) {
      var items = figures();
      var el = items[i];
      if (!el) return;
      var left = el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2;
      var max = track.scrollWidth - track.clientWidth;
      track.scrollTo({
        left: Math.max(0, Math.min(max, left)),
        behavior: smooth === false ? 'auto' : 'smooth'
      });
    }

    function go(delta) {
      var items = figures();
      if (!items.length) return;
      index = Math.min(items.length - 1, Math.max(0, index + delta));
      scrollToIndex(index);
      sync();
    }

    function sync() {
      var items = figures();
      if (!items.length) return;
      /* Disabled state comes from the actual scroll bounds, not from which
         figure happens to be nearest the centre: at scrollLeft 0 a wide
         viewport centres figure 2, which would wrongly enable "previous". */
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      if (status) status.textContent = (nearest() + 1) + ' / ' + items.length;
    }

    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });

    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    track.tabIndex = 0;

    track.addEventListener('scroll', function () {
      window.clearTimeout(track.__t);
      track.__t = window.setTimeout(function () {
        /* Trackpad swipes and snap points move the strip without the buttons,
           so adopt whatever the user landed on before the next click. */
        index = nearest();
        sync();
      }, 90);
    });

    sync();
    document.addEventListener('i18nready', sync);
    document.addEventListener('localechange', sync);
  }

  /* ==================================================================== boot */

  function build() {
    initScrollSpy();
    initProgressRail();
    initNavState();
    initReveals();
    initParallax();
    initMotes();
    initHeroEntrance();
    initSplitHeadings();
    initWordLighting();
    initExperienceRail();
    initMediaParallax();
    initGalleryButtons();

    ScrollTrigger.refresh();

    /* Late-arriving webfonts and lazy images change section heights, which
       moves every pin start. Remeasure once everything has settled. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
    window.addEventListener('load', function () { ScrollTrigger.refresh(); }, { once: true });
  }

  function boot() {
    root.classList.add('motion-on');
    build();
  }

  /* Collections are injected by i18n.js, so wait for them before measuring. */
  if (window.SITE && window.SITE.i18n) {
    document.addEventListener('i18nready', boot, { once: true });
    /* i18nready may already have fired if this script parsed late. */
    if (document.getElementById('projects-track') &&
        document.getElementById('projects-track').children.length) {
      document.removeEventListener('i18nready', boot);
      boot();
    }
  } else {
    window.addEventListener('load', boot, { once: true });
  }

  /** Re-split every treated element and leave it at rest. */
  function resplit(freshText) {
    gsap.utils.toArray('[data-split]').forEach(function (el) {
      /* applyStatic has already written the new copy into textContent, so the
         cached original is stale and must be dropped or the old language
         would be restored. */
      if (freshText) delete el.__original;
      gsap.set(splitLines(el), { y: 0, yPercent: 0, clearProps: 'willChange' });
    });

    var lede = document.querySelector('[data-words]');
    if (lede) {
      if (freshText) delete lede.__original;
      initWordLighting();
    }
  }

  /* A locale switch replaces every collection node in the DOM. The triggers
     bound to the old nodes are now dead, and the fresh nodes are sitting at
     their armed opacity:0 state with nothing left to reveal them — so rebuild
     rather than merely refresh. CJK line heights also differ, which moves
     every pin start. */
  document.addEventListener('localechange', function () {
    contentTriggers.forEach(function (t) { if (t && t.kill) t.kill(); });
    contentTriggers = [];

    resplit(true);
    settleAll();
    initExperienceMarkers();
    initMediaParallax();

    ScrollTrigger.refresh();
  });

  window.addEventListener('resize', debounce(function () {
    resplit(false);
    ScrollTrigger.refresh();
  }, 200));
})();
