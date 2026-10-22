Creativity Touches for Contracting (لمسات الإبداع العالمية للمقاولات) is a general contractor based in Riyadh. The website should feel **calm, spacious and architectural**: large photography, quiet typography, boxy modular surfaces and midnight-blue accents — Haven's airy atmosphere, Blueprint's cinematic hero, LUXURA's rounded bento cards.

## Content fundamentals

- Voice: confident, precise, plain. Short declarative sentences. "We" for the company, "you" for the client. No hype words, no exclamation marks, no emoji.
- Headlines state an outcome: "Built with precision. Finished with care." / "One contractor, every stage of the build." Sentence case, ending with a full stop when it is a statement.
- Eyebrow tags are 1–4 words in uppercase (`t-label`): "OUR SERVICES", "HOW WE WORK".
- Proof comes from the company profile, never invented: safety-first record with no fatal site injuries, mandatory harnesses and full insurance; best local and imported materials (Sika, Henkel, Fosroc, Jotun, Hempel, Butler, SABIC, Al Rajhi Steel…); best common practices, quality standards and timely completion; Commercial Registration and Ministry of Investment services licence.
- Contact: info@ictc.site · www.ictc.site · Riyadh, Saudi Arabia.

## Colour

- Keep the interface neutral; let photography bring colour. Page ground `bg-100`; alternate sections on `bg-200`; cards on `surface-card` (or `surface-white` inside tinted sections).
- Text: `ink` for headings and body, `ink-muted` for supporting copy. `ink-ghost` only for the trailing half of two-tone bento headlines and words not yet revealed — never alone.
- `midnight` is the action colour: primary buttons, one featured card per grid, the stats band and the footer. `on-dark` / `on-dark-muted` sit on it.
- `primary` and `secondary` are the logo's navy and gray: links, focus ring, icons, the dashed process arrows, large numerals' units. `secondary` never carries small text.
- `sky` is atmospheric: dots, active markers and highlights on navy. `sky-100` washes for hover.
- `tint-*` tokens belong to the Services section only, one per service; the section background crossfades between them (800ms).
- Hairlines in `border`. Over photography always add the navy scrim so white text holds ≥4.5:1.

## Typography

- One family: **Helvetica Neue** (files in `fonts/`), Roman 400 for text, Medium 500 for headings and labels. Light and Bold stay unused on the site.
- Scale: `t-hero` 84 (44 mobile), `t-section` 52 (34), `t-statement` 40 (28), `t-card-title` 26 (22), `t-body-lg` 18, `t-body` 16, `t-button` 15, `t-caption` 13, `t-label` 12 uppercase, `t-stat` 64.
- Headlines: tight tracking (−0.02 to −0.035em), leading 1.0–1.1, `text-wrap: balance`. Body: leading 1.6, max ~68 characters.
- Hierarchy comes from size, space and the ink/ink-muted contrast — not from bold.

## Layout and spacing

- Container `content-max` (1280) with `gutter-desktop` 64 / `gutter-mobile` 20 side padding.
- Spacing scale `space-1` … `space-16` (8, 16, 24, 32, 48, 64, 96, 128). Sections: `space-16` desktop, `space-8` mobile. Card gaps 20 desktop / 16 mobile.
- Centered layouts for brand statements and section intros (Why Creativity, Partners, Contact); left-aligned for detail (About, Services, How we work).
- Alternate an immersive image moment with a spacious text section down the page.

## Shapes and surfaces

- Boxy, architectural corners: `radius-card` 8 for cards, the hero frame, bento tiles, project media and the contact form; `radius-image` 6 for media inside cards; `little-border-radius` 5 for every control — buttons, tags, nav, arrow buttons, inputs. Nothing is pill-shaped; only tiny status dots are round.
- Separate surfaces by colour and spacing first. `shadow-soft` for the active service card and solid nav; `shadow-lift` on hover of clickable cards. No other shadows.

## Imagery

- Large, carefully composed photographs of structure and material: glass, steel, concrete, sky. Cool daylight, occasional warm light. Leave room for text.
- Fade images into the ground (`bg-100` / `surface-card` gradients) rather than hard edges where they meet copy.
- Use the crops in `assets/Photography`; replace low-resolution ones with originals before launch.

## Iconography

- Thin line icons, 24px grid, 1.3–1.6 stroke, `currentColor`, drawn inline as SVG (see the service icons and arrows in Homepage). No icon font, no emoji, no filled glyph sets.
- Arrows are a straight shaft with an open chevron head and always point the way the action goes.

## Motion

- Section reveals: fade and rise 20px, 700ms, `cubic-bezier(.2,.7,.2,1)`, staggered 90ms (`ct-reveal`).
- Image mask reveal: clip from 18% inset to full while the image settles from 1.12 to 1 (`ct-mask`, 1.1s).
- Gentle parallax on the hero and large images (≤18% of scroll distance).
- Gray-to-dark word reveal on brand statements (`data-words`), tied to scroll.
- Hover: images zoom to 1.04 (900ms); button arrows slide 3px (200ms).
- Respect `prefers-reduced-motion`: everything appears in place with no movement. Never hide essential content behind hover or animation.

## Accessibility

- Text contrast ≥4.5:1 (`ink` ≥14.6:1 and `ink-muted` ≥4.6:1 on every light ground; `on-dark` 17.4:1 on `midnight`).
- Focus: 2px solid `primary` ring with 3px offset; `sky` on navy grounds.
- Touch targets ≥44px; buttons and inputs are 50px tall.
- Carousels: arrow buttons with labels, dot buttons, ← → keys, swipe, and an `aria-live` announcement.

## Building pages

Load `tokens.css` then `components/bundle.css`, wrap the page in `class="ct"`, and copy section markup from `components/Homepage/preview.html`. Component guidelines live in each `components/<Name>/README.md`.
