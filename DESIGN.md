# Design

## Theme

Energetic offline education brand following the 2026 brandbook: graphite contrast, bright Praktika blue, cold white surfaces, simple rounded geometry, hand-drawn "karakulya" marks, and a blue mascot as the main emotional asset. The site should feel practical, lively, and a little bold without becoming childish or chaotic.

## Color Tokens

```css
:root {
  --color-graphite: #141416;
  --color-blue: #4d72f3;
  --color-karakul: #7292f6;
  --color-cold-white: #ebeceb;
  --color-surface: #ffffff;
  --color-ink: #141416;
}
```

Do not add warm beige, red, pink, purple, lime, or unrelated accent palettes without approval. Blue remains the primary action and system color.

## Typography

- Brandbook display: `Nimbus Sans Narrow Bold`.
- Brandbook body/UI: `Nimbus Sans Regular`.
- Until official Nimbus webfont files are provided, CSS uses Nimbus family names first, then a local/system fallback stack. Do not restore `Unbounded` as the display font.
- H1/H2 use large contrast and balanced wrapping.
- Body copy stays below 75 characters where possible.

## Components

- Sticky graphite/glass header on the hero, solid cold-white header after scroll context.
- Rounded pill buttons for core actions.
- Direction cards with local graphic assets and clear route behavior.
- Audience segmented control: "Для себя" and "Для ребёнка".
- Branch selector and age filter as native controls.
- Forms with visible labels, 44 px minimum targets, focus rings, and local success state.
- FAQ uses real buttons with expanded/collapsed state.

## Layout

- First viewport: dark graphite, brand mark, nav, large headline, short explanation, CTA, audience switcher, and the blue mascot from the brandbook.
- Main page rhythm: cold light bands, asymmetric sections, compact cards, no repeated generic bento system.
- Direction pages: breadcrumbs, own hero, program catalog, learning outcomes, format/cost caveat, teachers/branches/reviews sections with "requires confirmation" states.

## Motion

Use subtle entrance and hover motion only. Respect `prefers-reduced-motion: reduce`.
