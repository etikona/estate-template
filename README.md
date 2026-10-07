# Estate Landing Template

Luxury real estate landing page. Next.js 15 (App Router), TypeScript, Tailwind CSS v4,
shadcn/ui-style components, GSAP + ScrollTrigger, Lenis smooth scroll.

## Run it

```bash
npm install        # or pnpm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

## New client in ~10 minutes

Everything client-specific lives in **`site.config.ts`**.

Start with the setup script. It asks for the business name, tagline, phone, email and colors,
then updates `site.config.ts` (press Enter to keep any current value):

```bash
npm run setup
```

It also updates the WhatsApp number and the call button from the phone number, replaces the
business name in the SEO text, and warns if your colors have poor contrast. Surface and border
colors follow the background automatically. To skip the questions:

```bash
npm run setup -- --name "Aurora Estates" --phone "+971 50 123 4567" --accent "#B08D57" --yes
```

Flags: `--name --tagline --phone --email --accent --background --text --dark --yes`.
The script does not touch images, listings or copy. Edit those by hand as below.

1. Brand: `name`, `tagline`, `logo` (optional), `theme` colors, `contact`, `social`.
2. Copy: hero headline, listings, lifestyle panels, stats, agent, locations, journal, footer.
3. Images: use `/client/your-file.jpg` (put files in `public/client/`) or any remote URL.
   New remote hosts must be added to `images.remotePatterns` in `next.config.ts`.
4. Sections: switch any section on or off in `sections: { ... }`.
5. Contact form: set the SMTP values in `.env.local`. Without them, enquiries print to the terminal in development.
6. Set `NEXT_PUBLIC_SITE_URL` to the client's real domain (SEO, sitemap, Open Graph).
7. Optional hero video: uncomment `hero.video` in the config (desktop only, ~1080p, under 8 MB).

## Structure

```
site.config.ts              all content, theme and toggles
scripts/setup-client.mjs    interactive client setup (npm run setup)
app/
  layout.tsx                metadata, theme variables, JSON-LD
  page.tsx                  section order
  globals.css               Tailwind v4 theme tokens, type scale utilities
  api/contact/route.ts      validated contact endpoint (Nodemailer)
components/
  layout/                   preloader, navbar (with mobile menu), footer
  sections/                 hero, search-panel, featured-properties, lifestyle,
                            positioning, agent, locations, journal, testimonials, contact
  motion/                   smooth-scroll (Lenis + anchors), reveal-text
  ui/                       button, input, textarea, tabs, text-link (shadcn style)
  media/site-image.tsx      next/image with a graceful fallback
lib/                        types, gsap setup, scroll + intro helpers, utils
```

## Animation notes

- One orchestrated moment on load: the preloader curtain lifts, then the nav and hero play together.
- Scroll motion is limited to: hero parallax, card scale (0.92 to 1), lifestyle image masks, stat count-up, portrait unveil and the horizontal gallery.
- Everything respects `prefers-reduced-motion`, and the page stays readable with JavaScript disabled.
- The intro curtain plays once per browser session. Disable it with `preloader: { enabled: false }`.

## Adding more shadcn/ui components

`components.json` is already configured:

```bash
npx shadcn@latest add dialog accordion
```
