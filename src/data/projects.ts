/**
 * One piece of project media for the case study. Motion work is a silent
 * MP4 with `type: "video"` (make one from a GIF or recording with
 * `scripts/encode-clip.sh`).
 */
export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  /** Video only: 720p rendition served below the md breakpoint (768px). */
  small?: string;
  /** Intrinsic aspect ratio as CSS `aspect-ratio`, e.g. "16/9" or "4/5". */
  aspect: string;
  /** Still frame shown until a clip plays, and instead of it under reduced motion or data saver. */
  poster?: string;
  caption?: string;
  /** Defaults to the project title and subtitle. */
  alt?: string;
  /** A phone capture: always shown in the iPhone frame, even on a project whose pieces sit on a screen (see `deviceOf`). */
  frame?: "phone";
};

/** One chapter of a case study: text on the left, its media on the stage. */
export type ProjectSection = {
  heading: string;
  body: string | RichText;
  /** Shown on the stage while this chapter is in view; without it the stage keeps the previous media. */
  media?: ProjectMedia[];
};

/** Paragraph text; a piece with `href` is a link. */
export type RichText = (string | { text: string; href: string })[];

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  /** Public link; omitted for unreleased work. */
  href?: string;
  /** Secondary links (source, App Store, write-up) listed beside the main one. */
  links?: { label: string; href: string }[];
  /** When it shipped or ran, e.g. "2025" or "2024–25". */
  year?: string;
  /** What you did on it, e.g. "Design and full-stack build". */
  role?: string;
  /** Still in development; marked in progress. */
  upcoming?: boolean;
  /** No case study yet: the catalog card shows, marked coming soon, but doesn't open. */
  comingSoon?: boolean;
  /** Release-stage chip beside the title, e.g. "Alpha". */
  badge?: string;
  /** Discipline; decides how the project's media is mocked up (see `deviceOf`). */
  kind: "Web Development" | "iOS Development" | "Software Development" | "Game Development" | "Design";
  /** Headline number or keyword shown in the case-study overview. */
  stat?: { value: string; label: string };
  /** Square app-icon image, shown as a squircle. */
  icon: string;
  /** Short feature list for the case-study overview. */
  highlights?: string[];
  /** Chapters after the overview, in reading order. */
  sections?: ProjectSection[];
  /** Overview media: the stage's first chapter and the catalog showreel. */
  media: ProjectMedia[];
};

export const projects: Project[] = [
  {
    id: "chiron",
    title: "Chiron",
    subtitle: "Aim trainer for controllers",
    description: "A video game aim trainer built for controllers: timed drills that score how well you track and switch between targets.",
    tags: [],
    comingSoon: true,
    badge: "Alpha",
    kind: "Game Development",
    icon: "/images/chiron-logo.png",
    media: [
      { type: "video", src: "/media/chiron/switch-track.mp4", small: "/media/chiron/switch-track-720.mp4", aspect: "1920/1080", poster: "/media/chiron/switch-track.jpg", caption: "Switch Track drill" },
    ],
  },
  {
    id: "elovatesr",
    title: "Elovate SR",
    subtitle: "Warzone rank tracker",
    description:
      "Full-stack Call of Duty: Warzone rank tracker with a live leaderboard, cloud-synced progression calculator, and OCR-powered stat extraction from match screenshots.",
    tags: ["Next.js", "TypeScript", "Supabase", "Google Cloud Vision"],
    href: "https://elovatesr.com",
    kind: "Web Development",
    stat: {
      value: "OCR",
      label: "Stat extraction from match screenshots, alongside a live leaderboard",
    },
    icon: "/images/elovate-logo.png",
    year: "2026",
    role: "Solo: design, front end, back end and data",
    highlights: [
      "Live Top 250 board, refreshed every 15 minutes",
      "Climb calculator that syncs across devices",
      "Screenshot scanning that reads your SR breakdown",
    ],
    sections: [
      {
        heading: "The spark",
        body: "I treated it like a real product and gave myself a launch date, September 7, 2026, with a checklist to hit first: a live board, Discord and email sign-in, onboarding, synced climb sessions, player profiles, and at least a full day of cutoff history. Warzone shipped first on purpose. Multiplayer stays “coming soon” until it's just as solid.",
      },
      {
        heading: "The look",
        body: "elovate is dark-only, with a lowercase wordmark and a gold mark. I wrote a short voice guide before most of the UI: plain sentences, no hype words, and every claim backed by a number. Profiles come in rank-inspired themes, climb sessions export as share cards, and on mobile your session tucks into a floating button so the board gets the whole screen.",
        media: [
          { type: "image", src: "/media/elovatesr/player-profile.jpg", aspect: "1920/1200", caption: "Rank-themed player profile" },
          { type: "image", src: "/media/elovatesr/mobile-session.jpg", aspect: "600/1298", frame: "phone", caption: "Climb session on mobile" },
        ],
      },
      {
        heading: "The engine",
        body: "Every 15 minutes a Supabase Edge Function pulls the Top 250 and saves a snapshot, so the 24-hour drift comes from real history, never seed data. If the cutoff jumps 50+ SR, it posts to Discord. Climb sessions save on your device first and sync to your account in the background. Screenshot scanning runs your SR breakdown through Google Cloud Vision and a parser I wrote.",
        media: [
          { type: "image", src: "/media/elovatesr/top-250-board.jpg", aspect: "1920/1200", caption: "Top 250 board and cutoff history" },
        ],
      },
      {
        heading: "The snags",
        body: "The OCR was the messy part. Vision reads the two columns of the breakdown separately, so my first parser matched numbers to the wrong rows, and a red −110 on a red background kept coming back as “HO”. I rewrote it to read in document order and added a decoder for the usual misreads. Big screenshots also hit Netlify's upload limit, so now they get compressed in the browser first.",
        media: [
          { type: "image", src: "/media/elovatesr/screenshot-upload.jpg", aspect: "1920/1200", caption: "Climb calculator with screenshot upload" },
        ],
      },
      {
        heading: "The safety net",
        body: "Live data comes with edge cases. A cut-off feed would show a wildly wrong cutoff, so a snapshot needs 240+ players before the board trusts it. Old fallbacks expire so a real season reset can't hide behind stale numbers, and seasons run as a little state machine that pauses polling between seasons while the final board stays up.",
        media: [
          { type: "image", src: "/media/elovatesr/mobile-board.jpg", aspect: "600/1298", frame: "phone", caption: "Frozen cutoff on mobile" },
        ],
      },
      {
        heading: "The road ahead",
        body: "It's live at elovatesr.com and between seasons right now, showing the Season 6 final board. Next up: a desktop app with a screenshot keybind and an overlay calculator (the waitlist is open), a Discord bot with /cutoff and /status, and Multiplayer.",
        media: [
          { type: "image", src: "/media/elovatesr/desktop-waitlist.jpg", aspect: "1920/1200", caption: "Elovate Desktop waitlist" },
        ],
      },
    ],
    media: [
      { type: "video", src: "/media/elovatesr/site-tour.mp4", small: "/media/elovatesr/site-tour-720.mp4", aspect: "1728/1080", poster: "/media/elovatesr/site-tour.jpg", caption: "Board to climb calculator" },
    ],
  },
  {
    id: "wkcc-perks",
    title: "WKCC Perks",
    subtitle: "iOS application",
    description:
      "Built from the ground up in Swift and SwiftUI: a member-to-member perks and business directory.",
    tags: ["Swift", "SwiftUI", "REST APIs", "iOS"],
    href: "https://apps.apple.com/us/app/wkcc-perks/id6795765162",
    kind: "iOS Development",
    stat: {
      value: "200+",
      label: "Local partner businesses",
    },
    icon: "/images/wkcc-favicon.png",
    year: "2026",
    role: "Solo design and iOS development for the chamber",
    highlights: [
      "Member-only deals",
      "Community businesses",
      "Physical coupons and member-business cards are out",
      "WKCC Perks is in, from the tap of a button",
    ],
    media: [
      { type: "image", src: "/media/wkcc-perks/home.jpg", aspect: "886/1926", alt: "WKCC Perks home: a hot deal, perks for you and member businesses" },
      { type: "video", src: "/media/wkcc-perks/browse-deals.mp4", aspect: "720/1562", poster: "/media/wkcc-perks/browse-deals.jpg", alt: "Browsing home, member businesses, the deals feed and a hot deal" },
      { type: "image", src: "/media/wkcc-perks/deals.jpg", aspect: "886/1926", alt: "The deals feed" },
    ],
    sections: [
      {
        heading: "Origins",
        body: [
          "The ",
          { text: "Wilmette/Kenilworth Chamber of Commerce", href: "https://www.wilmettekenilworth.com" },
          " wanted to move away from their archaic way of getting members local deals from local chamber businesses. Instead of keeping their current physical, mail-based system, we decided to upgrade into a digital application. The ask was intentionally small: sign in, find a deal or business, use the deal.",
        ],
        media: [
          { type: "image", src: "/media/wkcc-perks/not-a-member.jpg", aspect: "886/1926", alt: "Onboarding: not a WKCC member yet, with sign-in and join" },
          { type: "image", src: "/media/wkcc-perks/connect-account.jpg", aspect: "886/1921", alt: "Connecting a chamber membership by email" },
          { type: "video", src: "/media/wkcc-perks/email-code-sign-in.mp4", aspect: "720/1562", poster: "/media/wkcc-perks/email-code-sign-in.jpg", alt: "Signing in with a six-digit email code" },
        ],
      },
      {
        heading: "Deals that find you",
        body: "Member businesses can now hunt for deals in their community, or post one. Once a deal goes live, all members with the WKCC Perks app receive a notification, so nobody has to keep checking the app to catch a new deal.",
        media: [
          { type: "image", src: "/media/wkcc-perks/notifications-prompt.jpg", aspect: "886/1921", alt: "Asking to send deal notifications" },
          { type: "image", src: "/media/wkcc-perks/hot-deals-home.jpg", aspect: "886/1921", alt: "A new hot deal at the top of home" },
          { type: "image", src: "/media/wkcc-perks/profile-business.jpg", aspect: "886/1921", alt: "Business profile with Submit a Promotion" },
        ],
      },
      {
        heading: "To be continued",
        body: [
          "WKCC Perks is live on the ",
          { text: "App Store", href: "https://apps.apple.com/us/app/wkcc-perks/id6795765162" },
          ". All WKCC members are encouraged to download today! If you are not a Wilmette/Kenilworth Chamber of Commerce member, ",
          { text: "sign up", href: "https://www.wilmettekenilworth.com/members/join-now" },
          " today!",
        ],
        media: [
          { type: "image", src: "/media/wkcc-perks/launch-screen.jpg", aspect: "886/1926", alt: "WKCC Perks launch screen" },
          { type: "image", src: "/media/wkcc-perks/member-card.jpg", aspect: "886/1926", alt: "Onboarding: community perks, just for members" },
          { type: "video", src: "/media/wkcc-perks/onboarding.mp4", aspect: "720/1566", poster: "/media/wkcc-perks/onboarding.jpg", alt: "Onboarding: redeem in a few taps" },
        ],
      },
    ],
  },
  {
    id: "vaultair",
    title: "Vaultair",
    subtitle: "Password manager",
    description:
      "Encrypted, local-first desktop vault for gaming and online accounts, with passwords, MFA codes and an identity relationship map. Live on Windows, with Mac support coming soon.",
    tags: ["Rust", "TypeScript", "Tauri", "SQLCipher", "Argon2id", "GitHub Actions"],
    href: "https://github.com/bubb4rd/vaultair",
    kind: "Software Development",
    icon: "/images/vaultair-logo.png",
    highlights: [
      "Encrypted storage with SQLCipher, Argon2id and integrity-checked backups",
      "Passwords, TOTP and recovery codes in one searchable vault",
      "Relationship map connecting identities, emails and accounts",
      "Windows Hello unlock, auto-lock and clipboard protection",
      "Rust and frontend test suites with CI on GitHub Actions",
    ],
    year: "2026",
    role: "Solo: product, design, Rust and front end",
    media: [
      { type: "video", src: "/media/vaultair/app-walkthrough.mp4", small: "/media/vaultair/app-walkthrough-720.mp4", aspect: "1440/900", poster: "/media/vaultair/app-walkthrough-poster.jpg", caption: "Dashboard to relationship map" },
    ],
    sections: [
      {
        heading: "Non-negotiables",
        body: "No account, no server, no cloud. The vault lives on your disk and the app never touches the network. That promise shaped everything, down to bundling Microsoft's WebView2 installer so setup works offline, even though it pushes the download to about 220 MB. I also wrote down what it will never do: no auto-login, no game client injection, no account trading.",
        media: [
          { type: "image", src: "/media/vaultair/lock-screen.jpg", aspect: "2400/1500", caption: "Unlocking with the master password" },
        ],
      },
      {
        heading: "First impressions",
        body: "It's dark-only and quiet on purpose: charcoal surfaces, hairline borders, one blue accent. Green only ever means secure, and status is always an icon plus text, never just a color. The relationship map lays your identities out as a graph you can walk with a keyboard, and it switches to a list when the map gets huge or you've turned on reduced motion.",
        media: [
          { type: "image", src: "/media/vaultair/relationship-map.jpg", aspect: "2400/1500", caption: "Relationship map, focused view" },
        ],
      },
      {
        heading: "Behind the glass",
        body: "It's Tauri and Rust with a React front end, and I treat the UI as semi-trusted. All the crypto stays in Rust: Argon2id turns your master password into a key that unlocks a random vault key, SQLCipher encrypts the database, and passwords and codes get sealed again on their own. Copying a secret never hands it to the UI, and the clipboard only clears itself if you haven't copied something else since.",
        media: [
          { type: "image", src: "/media/vaultair/account-detail.jpg", aspect: "2400/1500", caption: "Account detail with sealed secrets" },
        ],
      },
      {
        heading: "Growing pains",
        body: "Windows fought back a few times. SQLCipher wouldn't build until I switched to Strawberry Perl, locally and in CI. Encrypted databases refuse SQLite's backup API, so backups copy the raw bytes, then get read back and verified before they count. Windows Hello unlock got a short spike first, to prove its signature stays the same across reboots before I trusted it with a key.",
      },
      {
        heading: "To be continued",
        body: "v0.1.0 is out as a private beta on GitHub, and the repo went public in October. Next up: health history on the dashboard, passkeys and an updater, then browser fill, which is still working through a 22-point security review. It runs on Windows today, and Mac support is on the way.",
        media: [
          { type: "image", src: "/media/vaultair/accounts-list.jpg", aspect: "2400/1500", caption: "Every account, with its security status" },
        ],
      },
    ],
  },
  {
    id: "gliide",
    title: "Gliide",
    subtitle: "Job search app",
    description:
      "In-house job tracking, resume tailoring and application powerhouse for Mac. Built for students, early-career developers and anyone finding their career.",
    tags: ["Rust", "Tauri", "Svelte", "TypeScript", "SQLite", "Typst"],
    href: "https://github.com/bubb4rd/gliide",
    upcoming: true,
    kind: "Software Development",
    icon: "/media/gliide/icon.jpg",
    highlights: [
      "Fit scoring against any job posting",
      "Honest resume edits you accept with a click",
      "One-page, ATS-readable PDF export",
      "Application tracker with a daily job feed",
      "Mac first, with Windows and iOS planned",
    ],
    year: "2026",
    role: "Solo: product, design and engineering",
    media: [
      { type: "video", src: "/media/gliide/onboarding-walkthrough.mp4", small: "/media/gliide/onboarding-walkthrough-720.mp4", aspect: "1280/800", poster: "/media/gliide/onboarding-walkthrough.jpg", caption: "Resume in, first fit score out" },
    ],
    sections: [
      {
        heading: "The fine print",
        body: "A few rules came first and never moved. The AI never scores you; code does, from the text that actually renders. Nothing gets invented, since every rewrite is checked against your own experience. Your master resume never changes. And the PDF is read back and rescored after export, so “ATS-readable” is something it checks, not something it claims.",
        media: [
          { type: "image", src: "/media/gliide/welcome-rules.jpg", aspect: "1600/1000", caption: "The rules on first launch" },
        ],
      },
      {
        heading: "The look",
        body: "I called the design system Paper & Ink: warm paper, graphite text and one cobalt accent. The resume is the only thing with real depth, like a sheet on a desk, and everything around it stays flat and fast like a native Mac tool. Color only shows up when it means something. Green is points gained, amber is what got left out and why.",
        media: [
          { type: "image", src: "/media/gliide/cover-letter-light.jpg", aspect: "2400/1500", caption: "Light theme" },
          { type: "image", src: "/media/gliide/cover-letter-dark.jpg", aspect: "2400/1500", caption: "Dark theme" },
        ],
      },
      {
        heading: "The engine",
        body: "It's a Rust core with a Svelte front end in Tauri. Typst is built in as a library, so the page rebuilds in about 40 ms with the same line breaks on every machine. It runs on your own AI subscription instead of API keys, and the model work is split in two, reading the posting once and then suggesting edits, which got the first score on screen in seconds instead of minutes.",
        media: [
          { type: "image", src: "/media/gliide/setup-agent.jpg", aspect: "1600/1000", caption: "Connecting your own Claude Code plan" },
        ],
      },
      {
        heading: "The snags",
        body: "Early tests showed edits that read keyword-stuffed and played it too safe, and summaries getting cut to fit the page. I'm still tuning that. The format check also wasn't reading the real PDF at first, until I wrote an extractor that catches things like a skill broken across a hyphen. Before going public I rebuilt the repo from a clean history, because old commits still had real job postings in them.",
        media: [
          { type: "image", src: "/media/gliide/prototype-mission-control.jpg", aspect: "1960/1250", caption: "Prototype: mission control" },
        ],
      },
      {
        heading: "The road ahead",
        body: "It's open source and signed for Mac, on version 0.2.1 with in-app updates, and still early. The job feed, cover letters and application tracking are in. Windows, iOS and more AI agents are next.",
        media: [
          { type: "image", src: "/media/gliide/setup-feed-dark.jpg", aspect: "1600/1000", caption: "Setting up the daily job feed" },
        ],
      },
    ],
  },
  {
    id: "pantrypulse",
    title: "PantryPulse",
    subtitle: "Recipe tracking app",
    description:
      "Full-stack recipe app for discovering meals from available ingredients.",
    tags: ["React", "Tailwind CSS", "Firebase", "REST APIs"],
    href: "https://pantry-pulse.netlify.app",
    kind: "Web Development",
    icon: "/images/pantrypulse-square-cover.png",
    year: "2024, rebuilt 2026",
    role: "Solo design and development",
    highlights: [
      "Start from the ingredients you already have",
      "Diet, allergy and calorie filters with nutrition on every card",
      "Saved recipes and allergens with Google sign-in",
    ],
    media: [
      { type: "video", src: "/media/pantrypulse/search-demo.mp4", small: "/media/pantrypulse/search-demo-720.mp4", aspect: "1440/900", poster: "/media/pantrypulse/search-demo.jpg", caption: "Searching chicken rice" },
      { type: "image", src: "/media/pantrypulse/landing-light.jpg", aspect: "2160/1350", caption: "Landing page" },
    ],
    sections: [
      {
        heading: "The spark",
        body: "I first built it in June 2024, and honestly, it looked more finished than it was. Search worked, but the nutrition panel was a placeholder, the fat number on every card was quietly reading protein, and the recipe popup still had sample text in it. It taught me that a nice UI isn't a product until every number on it is right.",
        media: [
          { type: "image", src: "/media/pantrypulse/v1-results.jpg", aspect: "2160/1350", caption: "2024 results: fat reading protein" },
        ],
      },
      {
        heading: "The rewrite",
        body: "In 2026 I rebuilt it on Vite, React and Tailwind 4, kept the original fonts, and finished what version one skipped: real nutrition on every card and a proper recipe view. I added Google sign-in with Firebase so you can save recipes and your allergens, and those allergens fill in your filters automatically next time.",
        media: [
          { type: "image", src: "/media/pantrypulse/recipe-details.jpg", aspect: "2160/1350", caption: "Recipe details dialog" },
        ],
      },
      {
        heading: "The look",
        body: "It got a warmer ember and cream palette with a dark mode. Search is the whole product, so it gets the room: popular ingredient chips, a sticky filter sidebar on desktop, a filter drawer on mobile, and real loading, empty and error states instead of blank screens.",
        media: [
          { type: "image", src: "/media/pantrypulse/dark-mode.jpg", aspect: "2160/1350", caption: "Dark mode" },
          { type: "image", src: "/media/pantrypulse/mobile-filters.jpg", aspect: "600/1300", frame: "phone", caption: "Filter drawer on mobile" },
        ],
      },
      {
        heading: "The snags",
        body: "Typing fast brought results back out of order, so every search now carries an ID and stale responses get dropped. Dragging the calorie slider spammed the API until I debounced filter changes. Edamam's image links expire, so saved recipes fall back gracefully, and I scrubbed real API keys out of the example config.",
        media: [
          { type: "video", src: "/media/pantrypulse/calorie-slider.mp4", small: "/media/pantrypulse/calorie-slider-720.mp4", aspect: "1440/900", poster: "/media/pantrypulse/calorie-slider.jpg", caption: "Debounced calorie slider" },
        ],
      },
      {
        heading: "The road ahead",
        body: "The rebuild is live on Netlify. The API key still ships to the browser, which is fine for a demo but not for real traffic, so putting requests behind a small proxy is the next thing I'd fix.",
      },
    ],
  },
  {
    id: "borgwithus",
    title: "Borgwithus",
    subtitle: "Cocktail generator",
    description: "A dynamic drink name generator with its own BORG AI, now averaging around 100 users.",
    tags: ["React", "CSS", "HTML", "Netlify"],
    href: "https://borgwithus.xyz",
    kind: "Web Development",
    icon: "/images/BORGWITHUS.png",
    year: "2023–26",
    role: "Solo: design, front end, database and AI",
    highlights: [
      "Hand-picked names plus BORG AI for new ones",
      "Accounts, likes and a community name wall",
      "Open-source AI model on Runpod that scales to zero",
      "Admin studio for rating names and training data",
    ],
    media: [
      { type: "video", src: "/media/borgwithus/jug-builder.mp4", small: "/media/borgwithus/jug-builder-720.mp4", aspect: "1360/850", poster: "/media/borgwithus/jug-builder-poster.jpg", caption: "Rolling names and flavors" },
      { type: "image", src: "/media/borgwithus/home-screen.jpg", aspect: "2400/1500", caption: "Home page hero" },
    ],
    sections: [
      {
        heading: "The spark",
        body: "What started as a list of puns turned into a real app. You can make an account, like or dislike names, and submit up to three of your own a day to the public wall, with an admin approving each one before it goes up. Then I added BORG AI for names nobody has thought of yet.",
        media: [
          { type: "image", src: "/media/borgwithus/name-wall-screen.jpg", aspect: "2400/1500", caption: "Submitting names and the community wall" },
        ],
      },
      {
        heading: "The look",
        body: "It's loud on purpose: big condensed type, ink and paper colors and an acid accent. The jug builder breaks it into three steps, name it, dye it, keep it, with a real photo for every flavor. I ran an accessibility pass on phones, which is how I found the jug and its controls never fit on screen at the same time.",
        media: [
          { type: "image", src: "/media/borgwithus/recipe-screen.jpg", aspect: "2400/1500", caption: "How to borg, in three steps" },
          { type: "video", src: "/media/borgwithus/jug-builder-phone.mp4", aspect: "488/1054", poster: "/media/borgwithus/jug-builder-phone-poster.jpg", frame: "phone", caption: "Jug builder on a phone" },
        ],
      },
      {
        heading: "The engine",
        body: "The front end is React on Netlify, with Supabase handling accounts, the database and edge functions. BORG AI runs an open-source model on Runpod that scales to zero when nobody's using it, and code double-checks every name so it actually swaps a sound for “borg” and isn't a repeat. There's an admin studio for rating names and exporting training data to fine-tune the model.",
        media: [
          { type: "image", src: "/media/borgwithus/borg-ai-beta-notice.jpg", aspect: "1200/750", caption: "BORG AI beta notice" },
        ],
      },
      {
        heading: "The snags",
        body: "In October 2026 I audited the whole thing and found real holes. Likes could carry any text straight into the public top ten, failed AI calls always got refunded, which meant unlimited free generations, and “Sponge Borg” could show as approved but never reach the board because it collided with “SpongeBorg”. Each got a fix at the database level, plus password reset, which somehow never existed.",
      },
      {
        heading: "The road ahead",
        body: "It's still live and still getting updates. Next I'm testing the classic generator against the jug builder to see which one gets more people to actually name a borg.",
        media: [
          { type: "image", src: "/media/borgwithus/generator-screen.jpg", aspect: "2400/1500", caption: "Classic generator, the variant under test" },
        ],
      },
    ],
  },
  {
    id: "bubbard",
    title: "BUBBARD Design",
    subtitle: "Freelance graphic design",
    description:
      "Digital graphics and visual content that pull hundreds of likes per post and impressions in the tens to hundreds of thousands. Direct client collaboration to deliver designs aligned with brand vision across social platforms.",
    tags: ["Adobe Creative Suite", "Figma", "Social Media"],
    href: "https://be.net/bubbard/",
    kind: "Design",
    stat: { value: "100K+", label: "Impressions on top posts, with hundreds of likes per post" },
    icon: "/images/bubbard-logo.png",
    role: "Graphic designer",
    highlights: ["Player graphics and posters for social", "Editorial print layouts", "Logos and mascots"],
    sections: [
      {
        heading: "What I make",
        body: "BUBBARD is the name I design under. Most of the work lives on social: player graphics and posters made to stop a scroll, plus logos and the occasional print job. Posts pull hundreds of likes, and impressions run from the tens of thousands into the hundreds of thousands. I work directly with the people I'm designing for, so the style bends to their brand.",
      },
      {
        heading: "Sports graphics",
        body: "The sports pieces are built in layers: a cut-out athlete, a textured or halftone background, big condensed type, and a stat block when the numbers are worth bragging about. They have to land at phone size in about a second, so the name and the hero image always win, and the small details reward a second look.",
      },
      {
        heading: "Print",
        body: "Print is a different muscle. As a graphic designer for ASU's Center for the Study of Race and Democracy, I laid out pages in the university's maroon and gold, including a Vietnam Veterans Memorial spread that turns a lot of history into a grid of stats and a simple timeline you can take in at a glance.",
        media: [
          { type: "image", src: "/images/A41.jpg", aspect: "595/842" },
        ],
      },
      {
        heading: "Logos and mascots",
        body: "I also design marks and mascots, like the Banana logo: a gaming-style character with a shield, lightning and chrome type. The goal with a mark like that is to read as a tiny avatar and still hold up big on a banner.",
        media: [
          { type: "image", src: "/images/banana-project.jpg", aspect: "1/1" },
        ],
      },
    ],
    media: [
      { type: "image", src: "/images/bubbard-design-project.png", aspect: "16/9" },
    ],
  }
];
