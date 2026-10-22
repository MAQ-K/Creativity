# Homepage

The full Creativity homepage, assembled only from this system's tokens and components, in the section order of the approved wireframes.

1. **Hero → About (pinned intro)** — one sticky stage exactly one viewport tall inside a 280vh wrapper (`ct-intro`). Scene 1 is the hero: centered badge, two-line `t-hero` headline, lead and primary button on a sky gradient, structure photograph in the lower 58%, facts strip + scroll cue along the bottom. Scrolling scrubs a camera move "up through the sky": hero copy lifts, blurs and fades (0–30%), the photo zooms and sinks away (0–60%), a pale fog peaks mid-way (18–72%), and the About photograph resolves under a navy shade (38–62%). Scene 2 then rises in (60–80%): tag, `t-section` statement with a white word-by-word reveal (66–95%), paragraph, light button, facts strip. The nav switches from its light-sky style to white at 45%. Reduced motion keeps the pin but only crossfades.
2. (About is scene 2 of the intro — `#about` anchors to the end of the pin.)
3. **Services** — layout fixed by the brief (see ServiceCard). Background, icon and counter follow the active service.
4. **How we work** — heading + paragraph left, secondary button right, five ProcessSteps in a zigzag with dashed arrows.
5. **Why Creativity** — centered heading, BentoCard grid.
6. **Our projects** — tag + heading left, secondary button right; ProjectCard grid: one large card (2 columns) + one tall card, then three cards.
7. **Partners** — 4 × 2 grid of wordmarks over hairline rules. Replace with client logos (grayscale, colour on hover) when they are supplied.
8. **Numbers** — midnight band with four StatItems.
9. **Contact** — heading, lead and email / website / office list left (sticky); ContactForm right.
10. **Footer** — midnight, white logo, three link columns.

The preview scrolls inside its frame (`.ct-page`); on a real site the same script falls back to window scrolling.
