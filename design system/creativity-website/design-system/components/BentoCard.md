# BentoCard

Rounded tile for asymmetric bento grids (`ct-bento`: tall left, two tiles top right, one wide tile below).

| Variant | Class | Content |
| --- | --- | --- |
| Soft | `ct-bento-card` | `surface-card`, inset image (`radius-image`), headline, optional button |
| Tall | `+ --tall` | Spans two rows; image on top, headline + primary button at the bottom |
| Photo | `+ --photo` | Full-bleed image fading to `surface-card` behind the headline |
| Stat / navy | `+ --stat --navy` | `midnight` emphasis tile: label, big numeral, caption; logo-mark watermark at 18% |
| Wide | `+ --wide` | Spans two columns; copy left, image right with a soft fade |

- Headlines are two-tone: the claim in `ink`, the rest in `ink-ghost` (`<span class="ct-ghost">`). The full sentence must still make sense read in one colour.
- Use at most one navy tile per grid. Gap 20px desktop / 16px mobile; padding 16px around inset media, 32px for text-only tiles.
- On hover the tile lifts to `shadow-lift` and its image zooms to 1.04.
- Mobile: one column in reading order — tall, photo, stat, wide.
