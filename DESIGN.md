# Design

## Theme

Energetic offline education brand with a dark graphite first viewport and cold, bright downstream surfaces. The style is practical, lively, and slightly bold: large type, asymmetry, rounded controls, scribble-like blue motion marks, and organic media frames.

## Color Tokens

```css
:root {
  --color-graphite: oklch(0.145 0.018 242);
  --color-graphite-2: oklch(0.205 0.028 244);
  --color-blue: oklch(0.56 0.205 260);
  --color-blue-dark: oklch(0.46 0.19 259);
  --color-blue-soft: oklch(0.9 0.055 245);
  --color-ice: oklch(0.972 0.006 145);
  --color-milk: oklch(0.955 0.004 145);
  --color-surface: oklch(1 0 0);
  --color-ink: oklch(0.18 0.02 242);
  --color-muted: oklch(0.47 0.024 242);
  --color-line: oklch(0.86 0.02 245);
}
```

The random Impeccable palette seed suggested a pink-red hue, but the project brief explicitly forbids red/pink/purple/lime accents without approval. Blue Regatta remains the primary brand accent.

## Typography

- Display: `Unbounded Variable`, loaded locally via npm package.
- Body and UI: `Manrope Variable`, loaded locally via npm package.
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

- First viewport: dark graphite, brand mark, nav, large headline, short explanation, CTA, audience switcher, and an expressive graphic asset.
- Main page rhythm: cold light bands, asymmetric sections, compact cards, no repeated generic bento system.
- Direction pages: breadcrumbs, own hero, program catalog, learning outcomes, format/cost caveat, teachers/branches/reviews sections with "requires confirmation" states.

## Motion

Use subtle entrance and hover motion only. Respect `prefers-reduced-motion: reduce`.
