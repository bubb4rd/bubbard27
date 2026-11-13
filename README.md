# BUBBARD 27

The 2027 reskin of [bohubbard.xyz](https://bohubbard.xyz). Next.js 16 (App Router, Cache Components), Tailwind v4, no animation library.

```bash
npm run dev   # http://localhost:3000
npm run build
```

## Pages

- `/`: one screen in the spirit of pixelwrld. A short greeting, three featured app icons and a portrait over a WebGL dot field. Hovering (or keyboard-focusing) one blurs the page, shrinks its icon, springs that project's own pieces out from behind it (screens, phones, cards, chips), swaps its label for a title, tagline and button, and quietly turns the dot field behind it into the project's own: WKCC Perks sends out rings that ping members, Elovate draws a climbing rank line, Vaultair scrambles and locks, the portrait gets a marching selection. The cursor is the page's one light: shadows lean away from it and the icons catch a glare on the side facing it. Below: one line of bio, an `All work` pill and a `•••` dock (profiles and CV).
- `/work`: the catalog, modelled on gianlucreates. A pinned introduction on the left; on the right one card per project, the same colour as the page and drawn only by a hairline. Name and one-liner on the left of the card, every screen and phone in a row on the right. Pan the row with a trackpad swipe, a tilting wheel or shift+wheel; it stops at its first and last piece, and a soft fade shows on whichever side has more. A row that fits sits centred. Opening a card grows it to fill the screen as the case study arrives.
- `/work/[id]`: a case study in chapters. Text scrolls on the left with a chapter index pinned at the bottom; a sticky stage on the right blurs from one chapter's row of media to the next, and each row pans like the catalog's. On mobile, each chapter shows its row inline.

Every image and clip sits on a blurred placeholder until it loads, then fades in. `npm run blur` (run automatically before `dev` and `build`) writes the placeholders to `src/data/blur.json`.

The app icon morphs between pages (React `<ViewTransition>`), forward links slide left, back links slide right. Opening a featured project from `/` also flies its open mockups into the first pieces of the case study's stage (the `from-landing` transition type; mockups without a matching piece fade where they stand).

## Where things live

| File | What |
|---|---|
| `src/app/globals.css` | The design system: every colour, type size, radius, easing and duration |
| `src/content/copy.ts` | All interface copy |
| `src/content/featured.ts` | Which three projects are featured, and each one's hover choreography |
| `src/data/projects.ts` | Projects: icon, overview media, chapters (`sections`) |

## Design system

| Layer | Tokens |
|---|---|
| Colour | `wall`, `wall-raised`, `mat`, `ink`, `muted`, `line`, `vermilion` (the one accent) |
| Type | `text-micro`, `caption`, `body`, `lead`, `heading`, `title`, `display`; utilities `caps` and `wordmark` |
| Timing | `--dur-fast` 180ms (colour, focus), `--dur-base` 420ms (blurs, fades), `--dur-spring` 720ms with `ease-spring` (pieces popping into place), `--dur-slow` 700ms (stage changes, morphs), `--stagger` 45ms |
| Shape | `rounded-icon` squircles, `rounded-card` media, `sheet` (page-coloured, hairline, squircle) for cards, `pill` (`pill-solid`, `pill-soft`) for anything clickable |
| Space | `--gutter` page edge, `--rhythm` gap between panels, `--pad` panel padding, `--pan-inset` and `--pan-gap` for media rows (`pan-x`, `fade-x`, `fade-y` utilities) |

Reduced motion zeroes the durations and view transitions.

### Tuning a featured hover

Each piece in `featured.ts` has `x`, `y` (offset from the icon centre) and `w` (width) in `--u`, about 10px on a laptop, and a resting rotation `r`. Mockups (`screen`, `phone`, `card`) can lean in 3D with `tilt: [rotateX, rotateY]` and dissolve at the bottom with `fade`, so they rise from behind the icon. `widget` pieces are small live-interface mocks drawn in each product's own colours (`src/components/landing/widgets.tsx`); `chip` and `bubble` are labels. Keep piece tops above about `-34` so nothing leaves the screen. Pieces pop out in array order: mockups first, then widgets.

Each featured title is set in its project's own face (`font-elovate` Sora, `font-wkcc` Nunito, `font-vaultair` Space Grotesk) and colours; those faces and colours appear only in that project's hover.

Each feature also names its dot field (`field` in `featured.ts`: `ripple`, `climb`, `scramble` or `marquee`). The fields are drawn in the shader in `src/components/landing/Backdrop.tsx`, one function each, in the project's brand colour; `presence` near the top of the shader sets how strongly all of them show (0 off, 1 full).

Encode motion work with `scripts/encode-clip.sh`.
