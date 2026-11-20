---
name: Seine River Cruise Tours
description: Independent guide to Seine river cruises in Paris (GetYourGuide affiliate)
colors:
  midnight-plum: "#1e0524"
  velvet-plum: "#86198f"
  river-amber: "#f59e0b"
  lamplight-gold: "#fbbf24"
  ink: "#1a0f24"
  paper-white: "#ffffff"
  lavender-mist: "#faf5ff"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 700
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 600
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.6
  label:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
rounded:
  sm: "8px"
  md: "16px"
  lg: "24px"
  pill: "9999px"
spacing:
  section: "64px"
  section-lg: "96px"
  gutter: "16px"
  gutter-lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.velvet-plum}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-accent:
    backgroundColor: "{colors.river-amber}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.paper-white}"
    rounded: "{rounded.lg}"
    padding: "20px"
  band-dark:
    backgroundColor: "{colors.midnight-plum}"
    textColor: "{colors.paper-white}"
---

# Design System: Seine River Cruise Tours

## Overview

**Creative North Star: "Paris After Dark"**

The site borrows the river at night: deep plum water, warm amber lamplight, and calm white space where people read and decide. Dark bands (hero, final booking band, footer) set the mood; everything a visitor reads or compares sits on white so it stays easy to scan. Serif headings carry the Parisian voice; body text and prices stay in the plain system sans for clarity.

It is an honest guide, not a booking pressure machine: one clearly marked default choice, facts credited to their source, and no countdowns or fake scarcity.

**Key Characteristics:**
- White reading surfaces; plum reserved for hero, final band, footer and primary buttons
- Amber is light, not paint: small accents, rating stars, dark text on amber when used as a fill
- Cormorant Garamond for headings, system sans for everything functional
- Pill buttons, 24px card corners, soft shadows
- One accent action per view

## Colors

- **Midnight Plum** `#1e0524` (`seine-ink`, `plum-950`): hero scrim, final band, footer.
- **Velvet Plum** `#86198f`: primary buttons and small accent text on white (contrast with white about 8:1). In code this is `seine-amber` because the admin theme maps `theme.primary` to `--color-seine-amber`.
- **River Amber** `#f59e0b`: accent fill only with dark text (`text-stone-900`); never white text on amber (about 2.1:1). In code this is `seine-teal` (`theme.secondary`).
- **Lamplight Gold** `#fbbf24` (`gold-400`): stars and highlights on dark backgrounds.
- **Ink** `#1a0f24` (`stone-900`): text. Use `/65` or stronger for secondary text on white; nothing fainter for readable text.
- **Paper White** `#ffffff`: page background (body `bg-white`). **Lavender Mist** `#faf5ff` (`stone-50`): quiet panels inside white sections.

## Typography

- Display and headings: Cormorant Garamond 700 (`font-display`), H1 `text-4xl`→`sm:text-6xl`, section H2 `text-3xl`→`sm:text-4xl`, card titles 600.
- Body: system sans 16px, line-height 1.6. Labels 12px semibold, sentence case where new.
- Prices: sans, bold; "from" in small secondary text. A missing price shows "See prices", never €0.

## Layout

- Container `max-w-6xl`, gutters 16px (24px from `sm`).
- Sections `py-16` (`sm:py-20`/`py-24` for feature bands), separated on white by a 1px `stone-900/10` top border instead of tints.
- Mobile first; tour cards 1 column, 2 from `sm`, 3 from `lg`. The mobile sticky booking bar appears only after the hero.

## Elevation & Depth

Mostly flat. Cards use `shadow-sm`, lifting to `shadow-xl` on hover (transform and shadow only, disabled with reduced motion). The header gains `shadow-sm` once it turns solid on scroll.

## Shapes

Cards 24px (`rounded-3xl`), images inside cards follow the card corner, buttons and badges are pills, panels 16px.

## Components

- **Header:** transparent over the homepage hero with a plum fade for legibility, white with a shadow after 20px of scroll; solid white on other pages. Current page underlined.
- **Tour card:** 16:9 photo, provider rating credited "on GetYourGuide", 3 included items, duration, cancellation terms when listed, "from" price or "See prices", per-tour button label.
- **Booking box (guides):** sits right after the Quick Answer; shows the disclosure line.
- **Picker:** "What matters most to you?" radio options above the cards; the match gets a plum ring and a "Your match" pill.

## Do's and Don'ts

- Do credit every rating to its source with a checked date; don't put third-party ratings in structured data.
- Do use SVG icons; don't use emoji as icons.
- Don't use countdowns, "limited spots", glitter, hearts or neon "romantic Paris" styling.
- Don't use gradient blobs or icon-grid filler sections.
- Don't put white text on amber or faint (below `/65`) text on white.
