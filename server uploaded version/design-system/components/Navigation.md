# Navigation

Floating header: logo left, a compact boxed group of links in the middle, one Contact button right.

- Over the light sky hero use `ct-nav--light`: colour logo, `ink` links in a white-55% box, `midnight` contact button.
- Over dark photography it is transparent: white logo (`assets/logo/creativity-logo-white.png`), `on-dark` links in a translucent box, `ct-btn--light` contact button.
- After scrolling past ~60% of the first screen, add `is-solid`: frosted `bg-100` bar with `border`, `shadow-soft`, full-colour logo, `ink` links, and the contact button turns `midnight`. Transition 400ms.
- Below 900px the links and button hide; `ct-nav__menu` opens a full-screen sheet (`ct-sheet`) with large links and the contact button at the bottom. Set `aria-expanded` on the menu button and move focus into the sheet.
- Mark the current page with `aria-current="page"`.
- Provide: both logo images (white first, colour second), 4–6 links, one contact link.
