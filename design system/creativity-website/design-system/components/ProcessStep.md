# ProcessStep

Numbered step card for the "How we work" section: number + status dot, title, one-sentence description.

- Lay five steps in a zigzag (`ct-process__steps`): odd steps on the top row, even steps dropped 56px on the second row, joined by dashed curved arrows in `secondary` that the script draws between the boxes (`[data-path]`).
- Resting: `bg-100` with a `border` hairline (white without border on `bg-200`). Hover or `is-current`: `midnight` fill, `on-dark` title, `on-dark-muted` text, `sky` dot, 4px lift.
- Below 1024px the steps stack in one column along a vertical hairline with a dot per step; arrows hide.
- Provide: two-digit number, a 1–3 word title, a description under ~12 words.
