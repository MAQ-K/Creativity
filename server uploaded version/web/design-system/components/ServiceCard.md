# ServiceCard

White card in the Services carousel: image, index number, title, two-line description, "Learn more" link.

- Provide: a 4:3 photograph (see Photography), a two-digit index, a title in `t-card-title`, a description of at most ~20 words, and a link.
- `is-active` = full opacity, `shadow-soft`; resting cards sit at 55% opacity and 94% scale so neighbours "peek" at the edges. Transition 600ms.
- Image zooms to 1.04 on hover (900ms). Radius: card `radius-card`, image `radius-image`.
- The Services section owns the layout — **do not change it**: service icon top-left, general heading and paragraph under it, carousel of cards on the right with ‹ › arrow buttons and dots below. Each card carries `data-tint` (one of the `tint-*` tokens); the section background, the icon and the "01 / Steel structures" counter all follow the active card.
- Accessibility: inactive cards get `aria-hidden="true"` and their links `tabindex="-1"`; an `aria-live` line announces the new service; ← → keys move the carousel; swipe on touch.
