/* Creativity homepage interactions: pinned hero→about transition, reveals, parallax, word reveal, nav state, mobile menu, services carousel, process arrows, count-up. */
(function () {
  var page = document.querySelector('[data-scroller]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  document.querySelectorAll('[data-words]').forEach(function (el) {
    var intro = el.hasAttribute('data-intro-words');
    var parts = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = parts.map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
    if (!intro) words.push(el);
  });

  /* Hero → About pinned transition (scroll-scrubbed) */
  var intro = document.querySelector('[data-intro]'), L = {};
  intro.querySelectorAll('[data-l]').forEach(function (el) { L[el.dataset.l] = el; });
  var introWords = intro.querySelectorAll('[data-intro-words] .w');
  var seg = function (p, a, b) { return Math.min(1, Math.max(0, (p - a) / (b - a))); };
  var ease = function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var lastP = -1;
  function runIntro(st, vh) {
    var m = reduce ? 0 : 1; // reduced motion: crossfade only
    var p = seg(st - intro.offsetTop, 0, intro.offsetHeight - vh);
    if (p === lastP) return; lastP = p;
    var out = ease(seg(p, 0, .3)), zoom = ease(seg(p, 0, .6)), fade = seg(p, .25, .55);
    var fog = Math.sin(Math.PI * seg(p, .18, .72)), inImg = ease(seg(p, .38, .62)), grow = ease(seg(p, .35, 1));
    var txt = ease(seg(p, .6, .8));
    L.hero.style.cssText = 'opacity:' + (1 - out) + ';transform:translate3d(0,' + (-70 * out) + 'px,0) scale(' + (1 - .06 * out * m) + ');filter:blur(' + (8 * out * m).toFixed(2) + 'px);visibility:' + (out >= 1 ? 'hidden' : 'visible');
    L.heroFoot.style.cssText = 'opacity:' + (1 - seg(p, 0, .12)) + ';transform:translate3d(0,' + (30 * seg(p, 0, .12) * m) + 'px,0)';
    L.heroImg.style.cssText = 'opacity:' + (1 - fade) + ';transform:translate3d(0,' + (28 * zoom * m) + '%,0) scale(' + (1 + 1.1 * zoom * m) + ')';
    L.fog.style.opacity = (0.95 * fog).toFixed(3);
    L.aboutImg.style.cssText = 'opacity:' + inImg + ';transform:scale(' + (1.35 - .3 * grow) + ')';
    L.shade.style.opacity = inImg;
    L.about.style.cssText = 'opacity:' + txt + ';transform:translate3d(0,' + (48 * (1 - txt) * m) + 'px,0);filter:blur(' + (6 * (1 - txt) * m).toFixed(2) + 'px);visibility:' + (txt <= 0 ? 'hidden' : 'visible');
    var n = Math.round(seg(p, .66, .95) * introWords.length);
    introWords.forEach(function (w, i) { w.classList.toggle('is-on', i < n); });
    nav.classList.toggle('ct-nav--light', p < .45);
  }

  /* Parallax */
  var px = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var nav = document.querySelector('[data-nav]');
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = viewH(), st = scrollTop();
    var introEnd = intro.offsetTop + intro.offsetHeight - vh;
    nav.classList.toggle('is-solid', st > introEnd - 40);
    runIntro(st, vh);
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
    b.setAttribute('aria-label', 'Show ' + c.querySelector('h3').textContent);
    b.addEventListener('click', function () { go(i); });
    dotsWrap.appendChild(b);
    c.addEventListener('click', function (e) { if (i !== index) { e.preventDefault(); go(i); } });
  });
  var dots = dotsWrap.children;
  function go(i, silent) {
    index = Math.max(0, Math.min(cards.length - 1, i));
    var vp = track.parentElement.clientWidth, card = cards[index];
    var offset = Math.min(56, (vp - card.offsetWidth) / 2);
    track.style.transform = 'translate3d(' + (-(card.offsetLeft) + offset) + 'px,0,0)';
    cards.forEach(function (c, k) { c.classList.toggle('is-active', k === index); c.setAttribute('aria-hidden', String(k !== index)); c.querySelectorAll('a').forEach(function (a) { a.tabIndex = k === index ? 0 : -1; }); });
    Array.prototype.forEach.call(dots, function (d, k) { d.setAttribute('aria-current', String(k === index)); });
    icons.forEach(function (s, k) { s.classList.toggle('is-active', k === index); });
    sec.style.setProperty('--tint', card.dataset.tint);
    var name = card.querySelector('h3').textContent;
    countEl.textContent = String(index + 1).padStart(2, '0'); nameEl.textContent = name;
    prev.disabled = index === 0; next.disabled = index === cards.length - 1;
    if (!silent) live.textContent = 'Service ' + (index + 1) + ' of ' + cards.length + ': ' + name;
  }
  prev.addEventListener('click', function () { go(index - 1); });
  next.addEventListener('click', function () { go(index + 1); });
  sec.querySelector('[data-carousel]').addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(index + 1); if (e.key === 'ArrowLeft') go(index - 1); });
  // swipe
  var sx = null, base = 0;
  track.addEventListener('pointerdown', function (e) { sx = e.clientX; base = new DOMMatrix(getComputedStyle(track).transform).m41; track.classList.add('is-dragging'); });
  window.addEventListener('pointermove', function (e) { if (sx === null) return; track.style.transform = 'translate3d(' + (base + (e.clientX - sx)) + 'px,0,0)'; });
  window.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; track.classList.remove('is-dragging'); if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1)); else go(index, true); });
  go(0, true);

  /* Process connectors: curved dashed arrows between alternating steps */
  var stepsEl = document.querySelector('[data-steps]'), svg = stepsEl.querySelector('[data-path]');
  function drawPath() {
    var steps = stepsEl.querySelectorAll('.ct-step'), o = stepsEl.getBoundingClientRect(), d = '', heads = '';
    for (var i = 0; i < steps.length - 1; i++) {
      var a = steps[i].getBoundingClientRect(), b = steps[i + 1].getBoundingClientRect();
      var down = i % 2 === 0;
      var x1 = a.right - o.left + 4, y1 = (down ? a.top + a.height * 0.62 : a.top + a.height * 0.38) - o.top;
      var x2 = b.left - o.left + b.width * 0.42, y2 = (down ? b.top - 8 : b.bottom + 8) - o.top;
      d += 'M' + x1 + ' ' + y1 + ' C ' + (x2) + ' ' + y1 + ', ' + x2 + ' ' + y1 + ', ' + x2 + ' ' + y2 + ' ';
      heads += down ? 'M' + (x2 - 4) + ' ' + (y2 - 6) + 'L' + x2 + ' ' + y2 + 'L' + (x2 + 4) + ' ' + (y2 - 6) + ' '
                    : 'M' + (x2 - 4) + ' ' + (y2 + 6) + 'L' + x2 + ' ' + y2 + 'L' + (x2 + 4) + ' ' + (y2 + 6) + ' ';
    }
    svg.innerHTML = '<path d="' + d + '"/><path class="arrow" d="' + heads + '"/>';
  }
  drawPath();

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

  frame();
})();
