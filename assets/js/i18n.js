/* ---------------------------------------------------------------------------
   i18n.js — renders SITE.content into the DOM and controls locale switching.

   Two mechanisms, chosen per content type:

     1. [data-i18n] attribute binding for singleton strings.
     2. <template> cloning for collections, so the markup stays in the HTML
        (inspectable, styleable) while the data stays in content.js. Nothing is
        assembled by string concatenation, so there is no XSS surface.

   English is pre-rendered into index.html as the static default. When the
   resolved locale is 'en' the first render is skipped entirely: no work, no
   flash, and the page still reads correctly with JavaScript disabled.
--------------------------------------------------------------------------- */

(function () {
  'use strict';

  var STORE = 'site.locale';
  var SITE = window.SITE;

  /* ------------------------------------------------------------- resolving */

  /** Walk a dotted path ("about.body.0") through an object. */
  function get(obj, path) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function dict(locale) {
    return SITE.content[locale] || SITE.content.en;
  }

  /* -------------------------------------------------------------- pictures */

  /**
   * Build a <picture> with AVIF -> WebP -> JPEG fallback.
   * `base` is a path without size or extension; derivatives are `-<w>.<ext>`.
   */
  function picture(base, small, large, w, h, alt, sizes) {
    var pic = document.createElement('picture');
    ['avif', 'webp'].forEach(function (fmt) {
      var s = document.createElement('source');
      s.type = 'image/' + fmt;
      s.srcset = base + '-' + small + '.' + fmt + ' ' + small + 'w, ' +
                 base + '-' + large + '.' + fmt + ' ' + large + 'w';
      s.sizes = sizes;
      pic.appendChild(s);
    });
    var img = document.createElement('img');
    img.src = base + '-' + small + '.jpg';
    img.srcset = base + '-' + small + '.jpg ' + small + 'w, ' +
                 base + '-' + large + '.jpg ' + large + 'w';
    img.sizes = sizes;
    img.width = w;
    img.height = h;
    img.alt = alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    pic.appendChild(img);
    return pic;
  }

  /* ------------------------------------------------------ template plumbing */

  function tpl(id) {
    var t = document.getElementById(id);
    return t ? t.content.firstElementChild.cloneNode(true) : null;
  }

  /** Fill every [data-field] slot in a cloned node from a flat value map. */
  function fill(node, values) {
    node.querySelectorAll('[data-field]').forEach(function (el) {
      var key = el.getAttribute('data-field');
      var val = values[key];
      if (val == null || val === '') {
        el.remove();
        return;
      }
      if (el.tagName === 'A') {
        el.href = val;
      } else {
        el.textContent = val;
      }
    });
    return node;
  }

  /** Append a list of strings as <li> into the given slot. */
  function fillList(node, selector, items, cls) {
    var host = node.querySelector(selector);
    if (!host) return;
    if (!items || !items.length) { host.remove(); return; }
    items.forEach(function (text) {
      var li = document.createElement('li');
      if (cls) li.className = cls;
      li.textContent = text;
      host.appendChild(li);
    });
  }

  function clear(host) {
    while (host && host.firstChild) host.removeChild(host.firstChild);
  }

  /* ------------------------------------------------------------ collections */

  function renderExperience(d) {
    var host = document.getElementById('experience-list');
    if (!host) return;
    clear(host);
    d.experience.items.forEach(function (item) {
      var node = tpl('tpl-experience');
      if (!node) return;
      node.dataset.slug = item.slug;
      fill(node, {
        role: item.role,
        org: item.org,
        period: item.period,
        place: item.place,
        year: item.year
      });
      fillList(node, '[data-slot="points"]', item.points);
      node.setAttribute('data-reveal', '');
      host.appendChild(node);
    });

    var earlyHost = document.getElementById('experience-earlier');
    if (!earlyHost) return;
    clear(earlyHost);
    d.experience.earlier.forEach(function (item) {
      var node = tpl('tpl-earlier');
      if (!node) return;
      node.dataset.slug = item.slug;
      fill(node, { role: item.role, org: item.org, period: item.period });
      node.setAttribute('data-reveal', '');
      earlyHost.appendChild(node);
    });

    var label = document.getElementById('experience-earlier-label');
    if (label) label.textContent = d.experience.earlierLabel;
  }

  function renderProjects(d) {
    var host = document.getElementById('projects-track');
    if (!host) return;
    clear(host);
    var SIZES = '(max-width: 700px) 86vw, 420px';

    SITE.data.order.projects.forEach(function (slug) {
      var meta = SITE.data.projects[slug];
      var copy = d.projects.items[slug];
      if (!meta || !copy) return;

      var node = tpl('tpl-project');
      if (!node) return;
      node.dataset.slug = slug;

      var mediaHost = node.querySelector('[data-slot="media"]');
      if (mediaHost) {
        if (meta.img) {
          mediaHost.appendChild(picture(
            meta.img, 640, 1280, meta.w, meta.h, copy.alt, SIZES
          ));
        } else {
          /* No image: drop the frame entirely rather than leaving an empty box
             or repeating the title inside it. */
          mediaHost.remove();
        }
      }

      fill(node, {
        title: copy.title,
        meta: copy.meta,
        blurb: copy.blurb,
        link: meta.href,
        linkLabel: meta.href ? d.projects.linkLabel : null
      });
      node.setAttribute('data-reveal', '');
      host.appendChild(node);
    });

    /* Closing tile. */
    var more = tpl('tpl-project-more');
    if (more) {
      fill(more, { linkLabel: d.projects.moreLabel, link: SITE.data.contact.github.href });
      more.setAttribute('data-reveal', '');
      host.appendChild(more);
    }
  }

  /* Education and Exchange share a row shape, so they share a template. */
  function renderRows(hostId, items) {
    var host = document.getElementById(hostId);
    if (!host) return;
    clear(host);
    items.forEach(function (item) {
      var node = tpl('tpl-education');
      if (!node) return;
      node.dataset.slug = item.slug;
      fill(node, {
        award: item.award, org: item.org,
        period: item.period, note: item.note
      });
      node.setAttribute('data-reveal', 'wipe');
      host.appendChild(node);
    });
  }

  function renderAwards(d) {
    var host = document.getElementById('awards-list');
    if (!host) return;
    clear(host);
    d.awards.items.forEach(function (item) {
      var node = tpl('tpl-award');
      if (!node) return;
      node.dataset.slug = item.slug;
      fill(node, { title: item.title, org: item.org, year: item.year });
      node.setAttribute('data-reveal', '');
      host.appendChild(node);
    });
  }

  function renderGallery(d) {
    var host = document.getElementById('gallery-track');
    if (!host) return;
    clear(host);
    var SIZES = '(max-width: 900px) 86vw, 60vh';

    SITE.data.order.gallery.forEach(function (slug, i) {
      var meta = SITE.data.gallery[slug];
      var copy = d.gallery.items[slug];
      if (!meta || !copy) return;

      var node = tpl('tpl-gallery');
      if (!node) return;
      node.dataset.slug = slug;
      node.dataset.index = String(i);
      /* Portrait frames get a narrower flex-basis in sections.css. */
      if (meta.w < meta.h) node.classList.add('is-portrait');

      var mediaHost = node.querySelector('[data-slot="media"]');
      if (mediaHost) {
        mediaHost.style.setProperty('--ar', meta.w + ' / ' + meta.h);
        var pic = picture(meta.img, 500, 1000, meta.w, meta.h, copy.alt, SIZES);
        /* First gallery image is likely to be reached quickly; let the browser
           decide rather than forcing it, but never lazy-load a portrait crop
           that could be on screen at load on very tall viewports. */
        if (i === 0) pic.querySelector('img').loading = 'eager';
        mediaHost.appendChild(pic);
      }

      fill(node, { caption: copy.caption });
      node.setAttribute('data-reveal', '');
      host.appendChild(node);
    });
  }

  function renderSkills(d) {
    var host = document.getElementById('skills-groups');
    if (!host) return;
    clear(host);
    d.skills.groups.forEach(function (group) {
      var node = tpl('tpl-skill-group');
      if (!node) return;
      node.dataset.slug = group.slug;
      fill(node, { label: group.label });
      fillList(node, '[data-slot="chips"]', group.items, 'chip');
      node.querySelectorAll('.chip').forEach(function (c) {
        c.setAttribute('data-reveal', 'chip');
      });
      host.appendChild(node);
    });
  }

  function renderContact(d) {
    var host = document.getElementById('contact-links');
    if (!host) return;
    clear(host);
    SITE.data.order.contact.forEach(function (key) {
      var meta = SITE.data.contact[key];
      var node = tpl('tpl-contact');
      if (!node || !meta) return;
      node.dataset.slug = key;
      fill(node, {
        label: d.contact.labels[key],
        value: meta.value,
        link: meta.href
      });
      node.setAttribute('data-reveal', '');
      host.appendChild(node);
    });
  }

  /* ------------------------------------------------------------- singletons */

  function applyStatic(locale) {
    var d = dict(locale);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = get(d, el.getAttribute('data-i18n'));
      if (typeof val === 'string') el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      /* "alt:hero.portraitAlt, title:meta.title" */
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length < 2) return;
        var attr = bits[0].trim();
        var val = get(d, bits.slice(1).join(':').trim());
        if (typeof val === 'string') el.setAttribute(attr, val);
      });
    });

    /* Lists that are singletons rather than collections. */
    var exploring = document.getElementById('about-exploring');
    if (exploring) {
      clear(exploring);
      d.about.exploring.forEach(function (text) {
        var li = document.createElement('li');
        li.className = 'exploring-item';
        li.setAttribute('data-reveal', '');
        var rule = document.createElement('span');
        rule.className = 'rule exploring-rule';
        rule.setAttribute('aria-hidden', 'true');
        var span = document.createElement('span');
        span.textContent = text;
        li.appendChild(rule);
        li.appendChild(span);
        exploring.appendChild(li);
      });
    }

    var body = document.getElementById('about-body');
    if (body) {
      clear(body);
      d.about.body.forEach(function (text) {
        var p = document.createElement('p');
        p.className = 'u-measure';
        p.setAttribute('data-reveal', '');
        p.textContent = text;
        body.appendChild(p);
      });
    }

    document.title = d.meta.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', d.meta.desc);
  }

  function renderCollections(locale) {
    var d = dict(locale);
    renderExperience(d);
    renderProjects(d);
    renderRows('education-list', d.education.items);
    renderRows('exchange-list', d.exchange.items);
    renderAwards(d);
    renderGallery(d);
    renderSkills(d);
    renderContact(d);
  }

  /* ---------------------------------------------------------- locale switch */

  function setLocale(next, opts) {
    if (SITE.LOCALES.indexOf(next) === -1) return;
    opts = opts || {};

    document.documentElement.lang = next;
    document.documentElement.dataset.locale = next;
    window.__LOCALE__ = next;

    try { localStorage.setItem(STORE, next); } catch (e) { /* private mode */ }

    applyStatic(next);
    renderCollections(next);

    document.querySelectorAll('[data-locale-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.localeBtn === next));
    });

    if (!opts.silent) {
      /* CJK text has different line heights, so every pinned ScrollTrigger
         must be remeasured or the pins desync from their sections. */
      document.dispatchEvent(new CustomEvent('localechange', { detail: { locale: next } }));
    }
  }

  /* ------------------------------------------------------------------- boot */

  SITE.i18n = {
    get: get,
    dict: dict,
    setLocale: setLocale,
    applyStatic: applyStatic,
    renderCollections: renderCollections,
    picture: picture
  };

  function boot() {
    var locale = window.__LOCALE__ || 'en';

    /* Collections always need rendering — the HTML ships only templates.
       Singletons are already correct in English, so skip that pass. */
    renderCollections(locale);
    if (locale !== 'en') applyStatic(locale);

    document.querySelectorAll('[data-locale-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.localeBtn === locale));
      btn.addEventListener('click', function () {
        setLocale(btn.dataset.localeBtn);
      });
    });

    document.dispatchEvent(new CustomEvent('i18nready', { detail: { locale: locale } }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
