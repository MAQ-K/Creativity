/* Service pages: floor-type tabs (S4) and the court build-stage slider (S6). Loaded after main.js on service pages only. */
(function () {
  /* Tabs: click or arrow keys (direction-aware) switch the panel */
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = [].slice.call(box.querySelectorAll('[role="tab"]'));
    function show(i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i, panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        panel.hidden = !on; panel.classList.toggle('is-active', on);
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var rtl = document.documentElement.dir === 'rtl', n = tabs.length;
        var next = rtl ? 'ArrowLeft' : 'ArrowRight', prev = rtl ? 'ArrowRight' : 'ArrowLeft';
        if (e.key === next) show((i + 1) % n, true);
        else if (e.key === prev) show((i - 1 + n) % n, true);
      });
    });
  });

  /* Build-stage slider: the range picks the frame; caption mirrors the matching tick label (so it follows EN/AR) */
  document.querySelectorAll('[data-scrub]').forEach(function (box) {
    var range = box.querySelector('input[type="range"]'), frames = box.querySelectorAll('.ct-scrub__frames img');
    var ticks = box.querySelectorAll('.ct-scrub__ticks li'), cap = box.querySelector('[data-caption]');
    function set() {
      var i = +range.value - 1;
      frames.forEach(function (f, k) { f.classList.toggle('is-active', k === i); });
      ticks.forEach(function (t, k) { t.classList.toggle('is-on', k <= i); });
      cap.innerHTML = '<span>0' + (i + 1) + '</span>' + ticks[i].textContent;
      range.style.setProperty('--fill', (i / (ticks.length - 1) * 100) + '%');
    }
    range.addEventListener('input', set);
    ticks.forEach(function (t, k) { t.addEventListener('click', function () { range.value = k + 1; set(); }); });
    new MutationObserver(set).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    set();

    /* Walks the stages once on first view, then hands over; touching the slider stops it. Skipped for reduced motion. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var timer = null;
    function stop() { clearInterval(timer); timer = null; }
    ['pointerdown', 'keydown'].forEach(function (t) { box.addEventListener(t, function () { stop(); seen.disconnect(); }); });
    var seen = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      seen.disconnect();
      timer = setInterval(function () { if (+range.value >= +range.max) return stop(); range.value = +range.value + 1; set(); }, 2200);
    }, { threshold: 0.5 });
    seen.observe(box.querySelector('.ct-scrub__stage'));
  });
})();
