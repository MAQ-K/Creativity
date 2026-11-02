# Button

Boxy action, 50px tall (`control-height`), corners `little-border-radius` (8px), with an optional square arrow (5px corners) on the right.

Markup: `<a class="ct-btn">Label<span class="ct-btn__arrow">…arrow svg…</span></a>` (use `<button>` for in-page actions). Leave out `.ct-btn__arrow` for a plain button.

| Variant | Class | Use |
| --- | --- | --- |
| Primary | `ct-btn` | One per view: the main action. `midnight` fill, `on-dark` text. |
| Secondary | `ct-btn ct-btn--secondary` | Next to a primary, or alone in quiet sections. Transparent, `border` outline, `sky-100` on hover. |
| Light | `ct-btn ct-btn--light` | Primary action over photography and on `midnight`. |
| Glass | `ct-btn ct-btn--glass` | Secondary action over photography. |
| Small | `+ ct-btn--sm` | 42px, dense rows only (never below 44px touch area on mobile — keep the 50px default there). |
| Arrow | `ct-icon-btn` + `data-dir="prev|next"` | Carousel navigation, 52px square. Always give `aria-label`. |

States: hover darkens to `midnight-hover` and slides the arrow 3px right (200ms); pressed scales to .98; `disabled` / `aria-disabled="true"` goes `surface-card` with `ink-muted` text; keyboard focus shows a 2px `primary` ring (`sky` on dark grounds).

Do: write labels as verbs ("Start a project", "View services"). Don't: put two primary buttons side by side, or use the arrow on more than one button in a pair.
