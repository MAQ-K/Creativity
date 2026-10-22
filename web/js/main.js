/* Creativity homepage interactions: reveals, parallax, word reveal, nav state, mobile menu, services carousel, process arrows, count-up, scroll progress, EN/AR switch. */
(function () {
  var page = document.querySelector('[data-scroller]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement, ar = root.dir === 'rtl';
  // The page scrolls inside .ct-page when it is height-capped (preview frame); otherwise the window scrolls.
  var useInner = page.scrollHeight > page.clientHeight + 4;
  if (!useInner) page.style.height = 'auto';
  var scroller = useInner ? page : window;
  var scrollTop = function () { return useInner ? page.scrollTop : window.scrollY; };
  var viewH = function () { return useInner ? page.clientHeight : window.innerHeight; };

  /* Reveals */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { root: useInner ? page : null, threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.ct-reveal, .ct-mask').forEach(function (el) { io.observe(el); });

  /* Gray-to-dark word reveal, driven by scroll position */
  var words = [];
  function splitWords(el, text) {
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
  }
  document.querySelectorAll('[data-words]').forEach(function (el) {
    el._src = el.textContent.trim();
    splitWords(el, el._src);
    words.push(el);
  });

  /* Parallax */
  var px = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var nav = document.querySelector('[data-nav]'), progress = document.querySelector('[data-progress]');
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = viewH(), st = scrollTop();
    nav.classList.toggle('is-solid', st > vh * 0.6);
    var max = (useInner ? page.scrollHeight : root.scrollHeight) - vh;
    progress.style.transform = 'scaleX(' + (max > 0 ? st / max : 0).toFixed(4) + ')';
    if (reduce) { words.forEach(function (el) { el.querySelectorAll('.w').forEach(function (w) { w.classList.add('is-on'); }); }); return; }
    var top0 = useInner ? page.getBoundingClientRect().top : 0;
    px.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      var c = (r.top - top0 + r.height / 2) - vh / 2;
      el.style.transform = 'translate3d(0,' + (-c * parseFloat(el.dataset.parallax)).toFixed(1) + 'px,0)';
    });
    words.forEach(function (el) {
      var r = el.getBoundingClientRect(), y = r.top - top0;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - y) / (vh * 0.45)));
      var ws = el.querySelectorAll('.w'), n = Math.round(p * ws.length);
      ws.forEach(function (w, i) { w.classList.toggle('is-on', i < n); });
    });
  }
  scroller.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener('resize', function () { frame(); drawPath(); go(index, true); });

  /* Smooth free scroll: wheel input glides to its target with easing, like momentum scrolling.
     Touch, keyboard, anchors and the scrollbar stay native; any of them cancels a glide. */
  var target = 0, pos = 0, gliding = false;
  function glide() {
    if (!gliding) return;
    pos += (target - pos) * 0.1; // ponytail: per-frame lerp, so it glides a bit faster on 120Hz+ screens
    if (Math.abs(target - pos) < 0.5) { pos = target; gliding = false; }
    window.scrollTo({ top: pos, behavior: 'instant' });
    if (gliding) requestAnimationFrame(glide);
  }
  window.addEventListener('wheel', function (e) {
    if (useInner || reduce || e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX) || e.target.closest('textarea, select')) return;
    e.preventDefault();
    if (!gliding) target = pos = scrollTop();
    var max = root.scrollHeight - viewH();
    target = Math.max(0, Math.min(max, target + e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? viewH() : 1)));
    if (!gliding) { gliding = true; requestAnimationFrame(glide); }
  }, { passive: false });
  ['mousedown', 'keydown', 'touchstart'].forEach(function (t) { window.addEventListener(t, function () { gliding = false; }, { passive: true }); });

  /* Mobile menu */
  var sheet = document.querySelector('[data-sheet]'), menuBtn = document.querySelector('[data-menu]');
  function setSheet(open) { sheet.classList.toggle('is-open', open); sheet.setAttribute('aria-hidden', String(!open)); menuBtn.setAttribute('aria-expanded', String(open)); }
  menuBtn.addEventListener('click', function () { setSheet(true); sheet.querySelector('a').focus(); });
  sheet.querySelector('[data-close]').addEventListener('click', function () { setSheet(false); menuBtn.focus(); });
  sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setSheet(false); }); });

  /* Services carousel — icon, tint and counter follow the active card */
  var sec = document.querySelector('[data-services]');
  var track = sec.querySelector('[data-track]'), cards = Array.prototype.slice.call(track.children);
  var icons = sec.querySelectorAll('[data-icons] svg'), dotsWrap = sec.querySelector('[data-dots]');
  var live = sec.querySelector('[data-live]'), countEl = sec.querySelector('[data-count]'), nameEl = sec.querySelector('[data-name]');
  var prev = sec.querySelector('[data-dir="prev"]'), next = sec.querySelector('[data-dir="next"]');
  var index = 0;
  cards.forEach(function (c, i) {
    var b = document.createElement('button'); b.type = 'button';
    b.addEventListener('click', function () { go(i); });
    dotsWrap.appendChild(b);
    c.addEventListener('click', function (e) { if (i !== index) { e.preventDefault(); go(i); } });
  });
  var dots = dotsWrap.children;
  function go(i, silent) {
    index = Math.max(0, Math.min(cards.length - 1, i));
    var vp = track.parentElement.clientWidth, card = cards[index];
    var offset = Math.min(56, (vp - card.offsetWidth) / 2);
    // RTL: cards overflow to the left, so measure from the track's right edge
    var x = ar ? track.clientWidth - card.offsetLeft - card.offsetWidth - offset : offset - card.offsetLeft;
    track.style.transform = 'translate3d(' + x + 'px,0,0)';
    cards.forEach(function (c, k) { c.classList.toggle('is-active', k === index); c.setAttribute('aria-hidden', String(k !== index)); c.querySelectorAll('a').forEach(function (a) { a.tabIndex = k === index ? 0 : -1; }); });
    Array.prototype.forEach.call(dots, function (d, k) { d.setAttribute('aria-current', String(k === index)); d.setAttribute('aria-label', (ar ? 'عرض ' : 'Show ') + cards[k].querySelector('h3').textContent); });
    icons.forEach(function (s, k) { s.classList.toggle('is-active', k === index); });
    sec.style.setProperty('--tint', card.dataset.tint);
    var name = card.querySelector('h3').textContent;
    countEl.textContent = String(index + 1).padStart(2, '0'); nameEl.textContent = name;
    prev.disabled = index === 0; next.disabled = index === cards.length - 1;
    if (!silent) live.textContent = (ar ? 'الخدمة ' + (index + 1) + ' من ' : 'Service ' + (index + 1) + ' of ') + cards.length + ': ' + name;
  }
  prev.addEventListener('click', function () { go(index - 1); });
  next.addEventListener('click', function () { go(index + 1); });
  sec.querySelector('[data-carousel]').addEventListener('keydown', function (e) { var fwd = ar ? 'ArrowLeft' : 'ArrowRight', back = ar ? 'ArrowRight' : 'ArrowLeft'; if (e.key === fwd) go(index + 1); if (e.key === back) go(index - 1); });
  // swipe
  var sx = null, base = 0;
  track.addEventListener('pointerdown', function (e) { sx = e.clientX; base = new DOMMatrix(getComputedStyle(track).transform).m41; track.classList.add('is-dragging'); });
  window.addEventListener('pointermove', function (e) { if (sx === null) return; track.style.transform = 'translate3d(' + (base + (e.clientX - sx)) + 'px,0,0)'; });
  window.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; track.classList.remove('is-dragging'); if (Math.abs(dx) > 50) go(index + ((dx < 0) !== ar ? 1 : -1)); else go(index, true); });
  go(0, true);

  /* Process connectors: curved dashed arrows between alternating steps.
     Each arrow is its own <g>: a solid line draws in on entry, then hands over to the flowing dashed line. */
  var stepsEl = document.querySelector('[data-steps]'), svg = stepsEl.querySelector('[data-path]');
  var stepEls = stepsEl.querySelectorAll('.ct-step'), cur = -1;
  function drawPath() {
    // layout boxes (offset*), not getBoundingClientRect, so the 20px reveal rise doesn't shift the arrows
    var steps = stepEls, o = { left: 0, top: 0 }, out = '';
    var box = function (s) { return { left: s.offsetLeft, top: s.offsetTop, width: s.offsetWidth, height: s.offsetHeight, right: s.offsetLeft + s.offsetWidth, bottom: s.offsetTop + s.offsetHeight }; };
    for (var i = 0; i < steps.length - 1; i++) {
      var a = box(steps[i]), b = box(steps[i + 1]);
      var down = i % 2 === 0;
      var x1 = (ar ? a.left - 4 : a.right + 4) - o.left, y1 = (down ? a.top + a.height * 0.62 : a.top + a.height * 0.38) - o.top;
      var x2 = (ar ? b.right - b.width * 0.42 : b.left + b.width * 0.42) - o.left, y2 = (down ? b.top - 8 : b.bottom + 8) - o.top;
      var d = 'M' + x1 + ' ' + y1 + ' C ' + x2 + ' ' + y1 + ', ' + x2 + ' ' + y1 + ', ' + x2 + ' ' + y2;
      var head = down ? 'M' + (x2 - 4) + ' ' + (y2 - 6) + 'L' + x2 + ' ' + y2 + 'L' + (x2 + 4) + ' ' + (y2 - 6)
                      : 'M' + (x2 - 4) + ' ' + (y2 + 6) + 'L' + x2 + ' ' + y2 + 'L' + (x2 + 4) + ' ' + (y2 + 6);
      out += '<g style="--i:' + i + '"' + (i === cur ? ' class="is-active"' : '') + '><path class="draw" pathLength="1" d="' + d + '"/>' +
             '<path class="flow" d="' + d + '"/><path class="arrow" d="' + head + '"/></g>';
    }
    svg.innerHTML = out;
  }
  drawPath();

  /* Process sequence: steps rise in, arrows draw one by one, then a highlight walks the steps while in view */
  function highlight(i) {
    cur = i;
    stepEls.forEach(function (s, k) { s.classList.toggle('is-current', k === i); });
    svg.querySelectorAll('g').forEach(function (g, k) { g.classList.toggle('is-active', k === i); });
  }
  var walk = null, drawMs = 560 + (stepEls.length - 1) * 280 + 480;
  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        if (!stepsEl.classList.contains('is-play')) {
          stepsEl.classList.add('is-play');
          setTimeout(function () { stepsEl.classList.add('is-done'); }, drawMs);
        }
        if (!reduce && !walk) walk = setInterval(function () { if (!stepsEl.matches(':hover')) highlight((cur + 1) % stepEls.length); }, 1440);
      } else { clearInterval(walk); walk = null; highlight(-1); }
    });
  }, { root: useInner ? page : null, threshold: 0.35 }).observe(stepsEl);

  /* Count-up on the stats band */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      var el = e.target, to = +el.dataset.countTo; if (reduce || !to) return;
      var t0 = performance.now();
      (function tick(t) { var p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
    });
  }, { root: useInner ? page : null, threshold: 0.6 });
  document.querySelectorAll('[data-count-to]').forEach(function (el) { cio.observe(el); });

  /* Language switch (EN / AR). English text is the key into window.CT_AR (js/ar.js); originals are kept to switch back. */
  var AR = window.CT_AR || {}, strings = [];
  var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
  while ((n = tw.nextNode())) { var k = n.nodeValue.trim(); if (AR[k]) strings.push({ node: n, raw: n.nodeValue, key: k }); }
  root.querySelectorAll('[alt], [aria-label], [placeholder], meta[name="description"]').forEach(function (el) {
    ['alt', 'aria-label', 'placeholder', 'content'].forEach(function (a) { var k = el.getAttribute(a); if (k && AR[k] && !el.hasAttribute('data-words')) strings.push({ node: el, attr: a, key: k }); });
  });
  var langBtn = document.querySelector('[data-lang-toggle]');
  function setLang(lang) {
    ar = lang === 'ar';
    root.lang = lang; root.dir = ar ? 'rtl' : 'ltr';
    strings.forEach(function (s) { var v = ar ? AR[s.key] : s.key; if (s.attr) s.node.setAttribute(s.attr, v); else s.node.nodeValue = s.raw.replace(s.key, v); });
    words.forEach(function (el) { splitWords(el, ar ? AR[el._src] || el._src : el._src); });
    langBtn.textContent = ar ? 'EN' : 'ع';
    langBtn.lang = ar ? 'en' : 'ar';
    langBtn.setAttribute('aria-label', ar ? 'English' : 'العربية');
    try { localStorage.setItem('ct-lang', lang); } catch (e) {}
    go(index, true); drawPath(); frame();
  }
  langBtn.addEventListener('click', function () { setLang(ar ? 'en' : 'ar'); });
  setLang(ar ? 'ar' : 'en');
})();
