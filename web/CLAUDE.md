# Creativity Touches for Contracting — website

Marketing site for Creativity Touches for Contracting (لمسات الإبداع العالمية للمقاولات), a general contractor in Riyadh. Contact: info@ictc.site · www.ictc.site.

The homepage is designed and built as static HTML/CSS/JS. Treat it as the reference implementation: keep its look, spacing and motion exactly when you extend it or port it to a framework.

## Structure

```
index.html                 Homepage (all sections, in order)
content.md                 Source of truth for page copy (Arabic). English in index.html is translated from it; ar.js uses it verbatim
css/tokens.css             Design tokens as CSS variables + type classes (.t-hero, .t-section …) + @font-face
css/styles.css             All component styles, prefixed ct- (buttons, nav, hero, services, bento, projects, contact …)
js/main.js                 Interactions: reveals, parallax, word reveal, nav state, mobile menu, services carousel, process arrows, count-up, smooth wheel scroll, scroll progress, EN/AR switch
js/ar.js                   Arabic copy, keyed by the exact English text in index.html
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
- Shapes: controls `--little-border-radius` (8px), images `--radius-image` (12px), cards `--radius-card` (16px). No pills.
- Bilingual: the floating button (bottom left) switches EN/AR and sets `<html lang dir>`; choice is kept in localStorage. Any new or edited English string needs its Arabic entry in `js/ar.js` under the same English key. Use logical CSS properties (`padding-inline`, `inset-inline-start`) so RTL works; Arabic gets `--font-sans-ar` and zero letter-spacing.
- One font family, Helvetica Neue, weights 400 and 500 only.
- `--midnight` is the action colour (primary buttons, one featured card per grid, stats band, footer). Keep the UI neutral; colour comes from photography.
- Wrap pages in `<div class="ct">`. Reuse existing `ct-` classes before writing new CSS; new components follow the same `ct-block__element--modifier` naming and go in `css/styles.css`.
- Hero is exactly one viewport tall (`100vh`/`100svh`) with the facts strip + "Scroll" cue along its bottom edge — keep it.
- Services section layout is fixed by the client (icon top-left, general copy, card carousel right with arrows; background tint, icon and counter follow the active card). Do not change it.
- Motion: reveals 700ms fade + 20px rise, `cubic-bezier(.2,.7,.2,1)`; respect `prefers-reduced-motion` (already handled in styles.css).
- Accessibility: visible labels, focus ring (`--primary`, `--sky` on navy), 44px+ touch targets, alt text on every photo, text ≥4.5:1.
- Copy comes from `content.md` — take headings, paragraphs and service/project names from there before writing new text. Copy: confident, plain, no hype, no emoji. Never invent stats, clients or project names — use the facts in brand-guidelines.md.

## Open items

- Project titles in "Our projects" are working titles — replace with real project names, clients and locations.
- The contact form posts to `mailto:info@ictc.site`; connect it to a real endpoint (e.g. a server route or form service) with validation and a success state.
- Still under 1000px wide: concrete, industrial, landscape, marble, paving, roads, team. Swap in high-resolution originals with the same file names (steel, tower, towers, facade and glass-up are done).
- Helvetica Neue needs a web licence for production; convert the .otf files to .woff2 for performance.
- Partners grid shows supplier names as text; replace with client logos when supplied.
- WhatsApp button links to the placeholder `https://wa.me/9665XXXXXXXX` in index.html — put in the real number.
- Arabic copy in `js/ar.js` is a first draft; have a native speaker review it. Arabic falls back to system fonts — license Helvetica Neue Arabic for a matching look.
- Next pages to build from the same system: About, Services (one page per service), Projects (list + detail), Contact.
