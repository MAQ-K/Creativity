# Hero → About scroll animation — handoff

A pinned, scroll-scrubbed transition: the hero stays on screen (one viewport tall) while the user scrolls; the hero copy lifts/blurs/fades, the steel photo zooms away "into the sky", a pale fog peaks, then the About scene (scaffolding photo + navy shade) resolves and its copy rises in with a white word-by-word reveal. Reversible (scrolling up plays it backwards). Reduced motion = crossfade only.

Reference implementation: `index.html` (`.ct-intro` block), `css/styles.css` (section "Hero → About: pinned intro"), `js/main.js` (`runIntro`).

## Timeline (p = 0 → 1 across the wrapper's scroll distance)

| p range | What happens |
| --- | --- |
| 0 – 0.12 | Facts strip + "Scroll" cue fade out, move down 30px |
| 0 – 0.30 | Hero copy: opacity 1→0, translateY 0→−70px, scale 1→0.94, blur 0→8px |
| 0 – 0.60 | Hero photo: scale 1→2.1, translateY 0→28%, (ease-in-out) |
| 0.25 – 0.55 | Hero photo opacity 1→0 |
| 0.18 – 0.72 | Fog layer opacity follows sin(π·t), peak 0.95 at ~0.45 |
| 0.38 – 0.62 | About photo + navy shade opacity 0→1 |
| 0.35 – 1.00 | About photo scale 1.35→1.05 |
| 0.60 – 0.80 | About copy: opacity 0→1, translateY 48→0px, blur 6→0px |
| 0.66 – 0.95 | Statement words switch from white 28% to white, one by one |
| at 0.45 | Nav switches from light-sky style (`ct-nav--light`) to white |
| end of wrapper | Nav becomes solid (`is-solid`) |

Wrapper height `280vh` desktop / `240vh` mobile (longer = slower). Stage is `position: sticky; top: 0; height: 100vh/100svh`.

## Assets

- `assets/images/steel.jpg` — hero photo (sky on top, structure in the lower 58%, top edge masked into the sky gradient)
- `assets/images/scaffold.jpg` — About scene photo
- `assets/logo/creativity-logo.png`, `creativity-logo-white.png` — nav swaps between them

## 1. HTML (replaces the old hero + about sections)

```html
    <!-- HERO → ABOUT: one pinned, viewport-tall stage. Scrolling flies up through the sky into the About scene. -->
    <div class="ct-intro" data-intro>
      <span class="ct-intro__anchor" id="about" aria-hidden="true"></span>
      <div class="ct-intro__stage">
        <div class="ct-intro__frame">
          <div class="ct-intro__hero-img" data-l="heroImg"><img src="assets/images/steel.jpg" alt=""></div>
          <div class="ct-intro__about-img" data-l="aboutImg"><img src="assets/images/scaffold.jpg" alt=""></div>
          <div class="ct-intro__fog" data-l="fog" aria-hidden="true"></div>
          <div class="ct-intro__shade" data-l="shade" aria-hidden="true"></div>

          <section class="ct-intro__scene ct-intro__scene--hero" data-l="hero" aria-labelledby="hero-title">
            <div class="ct-hero__content">
              <span class="ct-hero__badge ct-reveal"><b>Licensed</b>General contracting · Riyadh, KSA</span>
              <h1 id="hero-title" class="t-hero ct-hero__title ct-reveal" style="--d:80ms">Built with precision.<br>Finished with care.</h1>
              <p class="t-body-lg ct-hero__lead ct-reveal" style="--d:160ms">Steel structures, facades, civil works and fine interior finishing — delivered safely and on schedule across the Kingdom.</p>
              <div class="ct-hero__actions ct-reveal" style="--d:240ms">
                <a class="ct-btn" href="#contact">Get a consultation<span class="ct-btn__arrow" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></a>
              </div>
            </div>
          </section>
          <div class="ct-hero__foot t-caption" data-l="heroFoot">
            <div class="ct-hero__facts"><span>Steel &amp; civil works</span><span>Facades &amp; finishes</span><span>Safety first, on every site</span></div>
            <span class="ct-hero__scroll">Scroll<i aria-hidden="true"></i></span>
          </div>

          <section class="ct-intro__scene ct-intro__scene--about" data-l="about" aria-labelledby="about-title">
            <div class="ct-intro__about">
              <span class="ct-tag ct-tag--on-photo">About Creativity</span>
              <h2 id="about-title" class="t-section ct-words ct-words--dark" data-words data-intro-words>Our goal is a distinguished, competitive and lasting reputation in the construction market.</h2>
              <p class="t-body-lg">We get there the practical way — best common practices, strict quality standards and timely completion — so every client hands over a project they are proud of.</p>
              <a class="ct-btn ct-btn--light" href="#why">About the company<span class="ct-btn__arrow" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></a>
            </div>
            <div class="ct-hero__foot t-caption ct-intro__about-foot">
              <div class="ct-hero__facts"><span>Headquartered in Riyadh</span><span>Licensed contractor</span><span>MISA · MC registered</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
```

## 2. CSS

Uses the design tokens from `css/tokens.css` and the button/tag/nav classes from `css/styles.css`.

```css
/* ---------- Hero → About: pinned intro. The stage is exactly one viewport tall; the wrapper adds the scroll distance the transition is scrubbed over. ---------- */
.ct-intro { position: relative; height: 280vh; }
.ct-intro__anchor { position: absolute; left: 0; bottom: 100vh; }
.ct-intro__stage { position: sticky; top: 0; height: 100vh; height: 100svh; padding: 12px; background: var(--bg-100); }
.ct-intro__frame {
  position: relative; overflow: hidden; isolation: isolate; height: 100%;
  border-radius: var(--radius-card); color: var(--ink);
  background: linear-gradient(180deg, #b3d3e3 0%, #cfe3ec 38%, #e8f1f5 70%);
}
.ct-intro__hero-img { position: absolute; left: 0; right: 0; bottom: -3%; height: 58%; z-index: 1; transform-origin: 50% 0%; will-change: transform, opacity;
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 34%); mask-image: linear-gradient(180deg, transparent 0%, #000 34%); }
.ct-intro__hero-img img, .ct-intro__about-img img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 100%; }
.ct-intro__about-img { position: absolute; inset: 0; z-index: 2; opacity: 0; will-change: transform, opacity; }
.ct-intro__about-img img { object-position: 50% 45%; }
.ct-intro__fog { position: absolute; inset: -10%; z-index: 3; opacity: 0; pointer-events: none;
  background: radial-gradient(60% 50% at 50% 45%, #f4f9fb 0%, #dfeef4 45%, rgba(169,205,221,.85) 100%); }
.ct-intro__shade { position: absolute; inset: 0; z-index: 3; opacity: 0; pointer-events: none;
  background: linear-gradient(90deg, rgba(8,26,53,.82) 0%, rgba(8,26,53,.45) 50%, rgba(8,26,53,.15) 100%), linear-gradient(0deg, rgba(8,26,53,.7) 0%, rgba(8,26,53,0) 35%); }
.ct-intro__scene { position: absolute; inset: 0; z-index: 4; will-change: transform, opacity, filter; }
.ct-intro__frame > .ct-hero__foot { z-index: 4; }
.ct-intro__frame::after { content: ""; position: absolute; inset: 0; z-index: 3; pointer-events: none; background: linear-gradient(0deg, rgba(8,26,53,.75) 0%, rgba(8,26,53,.2) 16%, rgba(8,26,53,0) 30%); }
.ct-intro__scene--about { opacity: 0; visibility: hidden; color: var(--on-dark); display: flex; flex-direction: column; justify-content: center; }
.ct-intro__about { width: 100%; max-width: calc(var(--content-max) + 2 * var(--gutter-desktop)); margin: 0 auto; padding: var(--nav-height) var(--gutter-desktop) 0; display: flex; flex-direction: column; align-items: flex-start; gap: 24px; }
.ct-intro__about h2 { max-width: 24ch; }
.ct-intro__about p { max-width: 520px; color: rgba(255,255,255,.82); }
.ct-intro__about-foot { border-top-color: rgba(255,255,255,.22); }
.ct-words.ct-words--dark .w { color: rgba(255,255,255,.28); }
.ct-words.ct-words--dark .w.is-on { color: var(--on-dark); }

/* Reduced motion: the script keeps the pin but drops zoom, blur and movement — the scenes simply crossfade. */

@media (max-width: 639px) {
  .ct-intro { height: 240vh; }
  .ct-intro__stage { padding: 8px; }
  .ct-intro__hero-img { height: 46%; }
  .ct-intro__about { padding: 96px 20px 0; gap: 18px; }
  .ct-intro__about h2 { font-size: 28px; line-height: 1.15; }
  .ct-intro__about-foot { display: none; }
}

.ct-hero__content { padding: calc(var(--nav-height) + 56px) var(--gutter-desktop) 0; width: 100%; max-width: 980px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; }
.ct-hero__badge { display: inline-flex; align-items: center; gap: 10px; height: 32px; padding: 0 12px 0 4px; border-radius: var(--little-border-radius); background: var(--midnight); color: var(--on-dark); font: 500 13px/1 var(--font-sans); }
.ct-hero__badge b { display: inline-flex; align-items: center; height: 24px; padding: 0 8px; border-radius: 3px; background: var(--sky); color: var(--midnight); font-weight: 500; }
.ct-hero__title { margin: 24px 0 20px; }
.ct-hero__lead { max-width: 560px; color: var(--ink-muted); }
.ct-hero__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 32px; }
.ct-hero__foot { position: absolute; left: 0; right: 0; bottom: 0; margin: 0 var(--gutter-desktop); padding: 22px 0 26px; border-top: 1px solid rgba(255,255,255,.28); display: flex; justify-content: space-between; align-items: center; gap: 24px; color: rgba(255,255,255,.9); }
.ct-hero__facts { display: flex; gap: 40px; flex-wrap: wrap; }
.ct-hero__facts span { display: flex; align-items: center; gap: 10px; }
.ct-hero__facts span::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--sky); }
.ct-hero__scroll { display: inline-flex; align-items: center; gap: 12px; }
.ct-hero__scroll i { width: 1px; height: 36px; background: rgba(255,255,255,.3); position: relative; overflow: hidden; }
.ct-hero__scroll i::after { content: ""; position: absolute; left: 0; top: -40%; width: 1px; height: 40%; background: var(--on-dark); animation: ct-scroll 2.2s var(--ease-out) infinite; }
@keyframes ct-scroll { to { top: 100%; } }
@media (max-width: 639px) {
  .ct-hero__content { padding: 112px 20px 0; }
  .ct-hero__badge { font-size: 12px; }
  .ct-hero__actions { margin-top: 24px; }
  .ct-hero__foot { display: none; }
}
```

## 3. JavaScript

Runs inside the page's scroll handler (rAF-throttled). `nav` is the header element; `reduce` = `matchMedia('(prefers-reduced-motion: reduce)').matches`. Call `runIntro(window.scrollY, window.innerHeight)` on scroll and on load, and set the nav's solid state with `introEnd = intro.offsetTop + intro.offsetHeight - innerHeight`.

```js
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

  // in the scroll frame:
  // var introEnd = intro.offsetTop + intro.offsetHeight - vh;
  // nav.classList.toggle('is-solid', st > introEnd - 40);
  // runIntro(st, vh);
```

## Porting notes

- **Next.js / React:** put the markup in a `<HeroAboutIntro />` client component; run the same math in a `useEffect` scroll listener (rAF-throttled) writing styles via refs, or use GSAP ScrollTrigger: one timeline, `scrollTrigger: { trigger: wrapper, start: "top top", end: "bottom bottom", scrub: true }`, with the stage `position: sticky` (or `pin: stage`). Map each row of the timeline table to a `.to()` at the matching position.
- **WordPress / Elementor:** add the HTML in an HTML widget (full width, no padding), the CSS to the theme's custom CSS, the JS in a footer script; or rebuild with GSAP ScrollTrigger.
- Keep it transform/opacity/filter only (no layout properties) so it stays at 60fps. Blur is the heaviest part — drop the blur on low-end mobile if needed.
- `#about` anchor sits 100vh above the wrapper's bottom so menu links land on the finished About scene.
