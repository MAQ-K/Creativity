# Creativity Touches for Contracting — website

Marketing site for Creativity Touches for Contracting (لمسات الإبداع العالمية للمقاولات), a general contractor in Riyadh. Contact: info@ictc.site · www.ictc.site.

The homepage is designed and built as static HTML/CSS/JS. Treat it as the reference implementation: keep its look, spacing and motion exactly when you extend it or port it to a framework.

## Structure

```
index.html                 Homepage (all sections, in order)
css/tokens.css             Design tokens as CSS variables + type classes (.t-hero, .t-section …) + @font-face
css/styles.css             All component styles, prefixed ct- (buttons, nav, hero, services, bento, projects, contact …)
js/main.js                 Interactions: reveals, parallax, word reveal, nav state, mobile menu, services carousel, process arrows, count-up
fonts/                     Helvetica Neue Light 300 / Roman 400 / Medium 500 (.otf)
assets/images/             Photography (crops from the company profile)
assets/logo/               creativity-logo.png (colour) and creativity-logo-white.png
design-system/
  brand-guidelines.md      Voice, colour, type, spacing, shapes, imagery, icons, motion, accessibility — READ FIRST
  tokens.json              Source of truth for every token (css/tokens.css is generated from it)
  components/*.md          Usage rules per component (Button, Tag, Navigation, ServiceCard, ProcessStep, BentoCard, ProjectCard, StatItem, ContactForm, Homepage)
```

Run it: open `index.html` through any static server (`npx serve .` or `python -m http.server`). Fonts need http(s), not file://.

## Rules

- Use tokens only: colours, spacing, radii, shadows via `var(--…)`, type via the `.t-*` classes. Never hard-code a new hex, px radius or font size. If a value is missing, add it to `design-system/tokens.json` and `css/tokens.css` together.
- Boxy shapes: controls `--little-border-radius` (5px), images `--radius-image` (6px), cards `--radius-card` (8px). No pills.
- One font family, Helvetica Neue, weights 400 and 500 only.
- `--midnight` is the action colour (primary buttons, one featured card per grid, stats band, footer). Keep the UI neutral; colour comes from photography.
- Wrap pages in `<div class="ct">`. Reuse existing `ct-` classes before writing new CSS; new components follow the same `ct-block__element--modifier` naming and go in `css/styles.css`.
- Hero and About share one pinned stage (`.ct-intro`, 280vh wrapper, sticky 100vh stage). Scrolling scrubs a fly-through: hero zooms away into fog, About scene resolves (timeline in `js/main.js` → `runIntro`, documented in design-system/components/Homepage.md). Keep the stage exactly one viewport tall and the hero facts strip + "Scroll" cue. If you port to a framework, GSAP ScrollTrigger (pin + scrub) is a good equivalent.
- Services section layout is fixed by the client (icon top-left, general copy, card carousel right with arrows; background tint, icon and counter follow the active card). Do not change it.
- Motion: reveals 700ms fade + 20px rise, `cubic-bezier(.2,.7,.2,1)`; respect `prefers-reduced-motion` (already handled in styles.css).
- Accessibility: visible labels, focus ring (`--primary`, `--sky` on navy), 44px+ touch targets, alt text on every photo, text ≥4.5:1.
- Copy: confident, plain, no hype, no emoji. Never invent stats, clients or project names — use the facts in brand-guidelines.md.

## Open items

- Project titles in "Our projects" are working titles — replace with real project names, clients and locations.
- The contact form posts to `mailto:info@ictc.site`; connect it to a real endpoint (e.g. a server route or form service) with validation and a success state.
- Several photos are under 1000px wide; swap in high-resolution originals (keep the same file names).
- Helvetica Neue needs a web licence for production; convert the .otf files to .woff2 for performance.
- Partners grid shows supplier names as text; replace with client logos when supplied.
- Next pages to build from the same system: About, Services (one page per service), Projects (list + detail), Contact. Add an Arabic (RTL) version later — use logical CSS properties (`margin-inline`, `padding-inline`) when you touch layout.
