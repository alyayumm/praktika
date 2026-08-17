# Project Context

## Source Brief

The source brief is `C:\Users\HR\Downloads\TZ_sait_Praktika.docx`, version 1.0 dated August 17, 2026.

The requested project is a React + Vite + TypeScript website for the educational center brand "Практика".

## Current State

- Repository: `https://github.com/alyayumm/praktika.git`.
- Local checkout: `C:\Users\HR\Documents\джугл табл\praktika`.
- The repository was empty at the start of implementation.
- No approved visual mockup image or real photo assets were present in the DOCX or repository.

## Scope For This Iteration

The brief explicitly says to show the site map and the structure of the general homepage plus one direction page before mass-producing all internal pages. This implementation therefore creates the shared routing, homepage, catalog, branches/about/contact pages, and a reusable direction-page template populated for each core direction with clearly neutral content.

Unknown business data is not invented. Prices, addresses, teacher names, reviews, phone numbers, legal data, and messenger links remain marked as requiring confirmation.

## Technical Decisions

- Stack: React, TypeScript, Vite.
- Routing: lightweight client-side router using clean paths so URLs stay human-readable.
- GitHub Pages: `vite.config.mjs` uses `base: './'`; `public/.nojekyll` exists; the workflow copies `dist/index.html` to `dist/404.html` for SPA fallback.
- Styling: structured CSS with local design tokens, no external CSS framework.
- Fonts: local npm font packages, not Google Fonts CDN.

## Content Guardrails

- Do not invent real teachers, prices, reviews, branch addresses, legal data, phone numbers, Telegram/WhatsApp links, CRM integrations, or result guarantees.
- Do not add warm beige, red, pink, purple, lime, or unrelated accent palettes without approval.
- Replace temporary graphic assets with approved photos and brand graphics when they become available.
