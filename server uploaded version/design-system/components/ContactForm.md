# ContactForm

White card (`ct-form`, `radius-card`, `shadow-soft`) with a two-column field grid that collapses to one column under 640px.

- Field: `<div class="ct-field">` with a visible `<label for>` and a `.ct-input` (`input`, `select` or `textarea`). Add `ct-field--full` to span both columns. Mark optional fields with `<i>(optional)</i>` in the label rather than starring required ones.
- Inputs: 50px tall (`control-height`), `bg-100` fill, `border` hairline, `little-border-radius`. Hover: `secondary` border. Focus: `primary` border, white fill and a soft `primary` ring.
- Footer row: a short helper line in `t-caption` left, the primary `ct-btn` right.
- Provide: the form `action` (the homepage posts to `mailto:info@ictc.site` until a real endpoint exists), field names, the service list.
