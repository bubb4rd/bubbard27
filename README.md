# BUBBARD 27

The 2027 reskin of [bohubbard.xyz](https://bohubbard.xyz). Next.js 16 (App Router, Cache Components), Tailwind v4, no animation library.

```bash
npm run dev   # http://localhost:3000
npm run build
```

## Pages

- `/`: two columns on wide screens. On the left, the BUBBARD lockup, a headline with a strip of the Chicago skyline set inline before the city, the recent work as cover cards, an About paragraph and an `All work` pill; on the right, pinned, the portrait over a short bio, `Say hello`, the CV and a brand-coloured circle per profile. Below `lg` they stack: header, headline, portrait, work. Behind the top of the page a dithered pixel ribbon (`src/components/landing/DitherField.tsx`) cuts in from the top, runs beside the headline, dips to the work and climbs out behind the portrait, swelling as it climbs (`SWELL`). It parts around the cursor, drags with a stroke and ripples on a click; boxes marked `data-dither-clear` stay bare. Hovering (or keyboard-focusing) a card with a choreography blurs its cover back, springs that project's own pieces up out of it (screens, phones, cards, live widgets) and crossfades its name into the project's own face.
- `/work`: the catalog, modelled on gianlucreates. A pinned introduction on the left; on the right one card per project, the same colour as the page and drawn only by a hairline. Name and one-liner on the left of the card, every screen and phone in a row on the right. Round buttons top right, level with the name, open the project's `href` and `links` in a new tab: an arrow for each, except a GitHub repo listed beside another link, which gets the GitHub mark (`outboundOf` in `src/lib/work.ts`). Pan the row with a trackpad swipe, a tilting wheel or shift+wheel; it stops at its first and last piece, and a soft fade shows on whichever side has more. A row that fits sits centred. Opening a card grows it to fill the screen as the case study arrives.
- `/work/[id]`: a case study in chapters. Text scrolls on the left with a chapter index pinned at the bottom; past five chapters the index scrolls on its own and follows the chapter being read, keeping it in the middle, as on gianlucreates. A sticky stage on the right blurs from one chapter's row of media to the next, and each row pans like the catalog's. On mobile, each chapter shows its row inline.
- `/spending`: served at the root of `spending.bohubbard.xyz` (a host rewrite in `next.config.ts`). Every developer service I pay for: the total, a strip of each service's share, category filters (All, then each group in `src/data/spending.ts`, each with an icon), a Monthly/Yearly switch, and one flat list of services, most expensive first. A filter recomputes the totals, service count and shares for that category, and collapses the strip's other segments so the rest fill it. The switch shows every price and the total in that period; a row billed the other way also shows its billed price. Pointing at a row or a segment lights its partner in vermilion. The subdomain needs adding as a domain alias on the Netlify site.

Every image and clip sits on a blurred placeholder until it loads, then fades in. `npm run blur` (run automatically before `dev` and `build`) writes the placeholders to `src/data/blur.json`.

The app icon morphs between pages (React `<ViewTransition>`), forward links slide left, back links slide right. Opening a landing card with a choreography also flies its open mockups into the first pieces of the case study's stage (the `from-landing` transition type; mockups without a matching piece fade where they stand).

## Where things live

| File | What |
|---|---|
| `src/app/globals.css` | The design system: every colour, type size, radius, easing and duration |
| `src/content/copy.ts` | All interface copy |
| `src/content/featured.ts` | Each landing card's hover choreography and title face |
| `src/data/projects.ts` | Projects: icon, overview media, chapters (`sections`) |
| `src/data/spending.ts` | Paid services: price, cycle, what each pays for, logo; totals derive from it |

## Design system

| Layer | Tokens |
|---|---|
| Colour | `wall`, `wall-raised`, `mat`, `ink`, `muted`, `line`, `vermilion` (the one accent) |
| Type | `text-micro`, `caption`, `body`, `lead`, `heading`, `title`, `display`; utilities `caps` and `wordmark` |
| Timing | `--dur-fast` 180ms (colour, focus), `--dur-base` 420ms (blurs, fades), `--dur-spring` 720ms with `ease-spring` (pieces popping into place), `--dur-slow` 700ms (stage changes, morphs), `--stagger` 45ms |
| Shape | `rounded-icon` squircles, `rounded-card` media, `sheet` (page-coloured, hairline, squircle) for cards, `pill` (`pill-solid`, `pill-soft`) for anything clickable |
| Space | `--gutter` page edge, `--rhythm` gap between panels, `--pad` panel padding, `--pan-inset` and `--pan-gap` for media rows (`pan-x`, `fade-x`, `fade-y` utilities) |

Reduced motion zeroes the durations and view transitions.

### Tuning a card hover

Each piece in `featured.ts` has `x`, `y` (offset from the centre of a stage near the foot of the card's cover) and `w` (width) in `--u`, 2% of the cover's width, and a resting rotation `r`. Mockups (`screen`, `phone`, `card`) can lean in 3D with `tilt: [rotateX, rotateY]` and dissolve at the bottom with `fade`, so they rise out of the cover. `widget` pieces are small live-interface mocks drawn in each product's own colours (`src/components/landing/widgets.tsx`). Pieces pop out in array order: mockups first, then widgets.

Each hover title is set in its project's own face (`font-elovate` Sora, `font-wkcc` Nunito, `font-vaultair` Space Grotesk, `font-gliide` Source Serif) and colours; those faces and colours appear only in that project's hover.

Encode motion work with `scripts/encode-clip.sh`: it writes an H.264 clip capped at 30 fps (`--max 720` for heavy footage), an AV1 version when that comes out smaller, a phone rendition and a poster; list them as `src`, `av1`, `small` and `poster`. `/media` is cached for a year (`netlify.toml`), so never overwrite a published file: give a changed clip or image a new name.
