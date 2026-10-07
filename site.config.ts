import type { SiteConfig } from "@/lib/types";

/**
 * ─────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU EDIT FOR A NEW CLIENT
 *  Replace text, images, colors and toggle sections on or off.
 *  Images can be local ("/client/hero.jpg"), Cloudinary or Unsplash.
 *  Remote hosts must be listed in next.config.ts → images.remotePatterns.
 * ─────────────────────────────────────────────────────────────
 */

const unsplash = (id: string, w = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const site: SiteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  name: "Marlowe & Vale",
  tagline: "Find a place worth calling home.",
  // logo: { src: "/client/logo.svg", alt: "Marlowe & Vale", width: 160, height: 40 },

  seo: {
    title: "Marlowe & Vale | Luxury Real Estate in Miami, New York and Dubai",
    description:
      "Curated luxury homes, local expertise and global reach. Buy, sell or rent with Marlowe & Vale.",
    keywords: ["luxury real estate", "Miami homes", "New York penthouses", "Dubai apartments"],
    ogImage: unsplash("photo-1613490493576-7fde63acd811", 1600),
  },

  theme: {
    background: "#F7F6F2",
    foreground: "#151515",
    muted: "#77736D",
    accent: "#A89478",
    border: "#DEDCD5",
    surface: "#EFECE5",
    dark: "#11110F",
    radius: "0px",
  },

  contact: {
    phone: "+1 (305) 555-0142",
    email: "hello@marlowevale.com",
    whatsapp: "13055550142",
    address: "1200 Brickell Avenue, Suite 400, Miami, FL 33131",
    hours: "Monday to Friday, 9:00 to 18:00. Saturday by appointment.",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],

  nav: {
    links: [
      { label: "Buy", href: "#properties" },
      { label: "Sell", href: "#contact" },
      { label: "About", href: "#about" },
      { label: "Agents", href: "#agent" },
      { label: "Journal", href: "#journal" },
    ],
    cta: { label: "Book a viewing", href: "#contact" },
  },

  sections: {
    hero: true,
    search: true,
    featured: true,
    lifestyle: true,
    positioning: true,
    agent: true,
    locations: true,
    testimonials: false,
    journal: true,
    contact: true,
  },

  preloader: { enabled: true },

  hero: {
    headline: ["Find a place", "worth calling home."],
    subheadline: "Curated properties. Local expertise. Global reach.",
    image: {
      src: unsplash("photo-1613490493576-7fde63acd811", 2600),
      alt: "Modern villa with a pool at dusk",
    },
    // Optional cinematic background video (desktop only, ~1080p, under 8 MB):
    // video: { src: "/client/hero.mp4", poster: "/client/hero.jpg" },
    primaryCta: { label: "Explore properties", href: "#properties" },
    secondaryCta: { label: "Speak with an advisor", href: "#contact" },
    caption: { title: "Ocean House", location: "Miami Beach, Florida" },
  },

  search: {
    tabs: { buy: "Buy", rent: "Rent", sell: "Sell" },
    locationLabel: "Location",
    locationPlaceholder: "City, area or property name",
    addressLabel: "Property address",
    addressPlaceholder: "Where is your property?",
    typeLabel: "Property type",
    anyTypeLabel: "Any type",
    priceLabel: "Price",
    anyPriceLabel: "Any price",
    priceRanges: {
      sale: [
        { label: "Up to $3M", max: 3_000_000 },
        { label: "Up to $5M", max: 5_000_000 },
        { label: "Up to $10M", max: 10_000_000 },
      ],
      rent: [
        { label: "Up to $10,000 / month", max: 10_000 },
        { label: "Up to $20,000 / month", max: 20_000 },
      ],
    },
    submit: "Explore properties",
    sellSubmit: "Request a valuation",
  },

  featured: {
    title: "Featured properties",
    intro:
      "A short list of homes our advisors would choose for themselves. Each one is viewed in person before it joins the collection.",
    cta: { label: "Talk to us about off-market homes", href: "#contact" },
    viewLabel: "View property",
    statusLabels: { sale: "For sale", rent: "For rent" },
    emptyTitle: "No homes match those filters yet.",
    emptyAction: "Clear filters",
    listings: [
      {
        id: "ocean-house",
        title: "Ocean House",
        location: "Miami Beach, Florida",
        price: "$4,850,000",
        priceValue: 4_850_000,
        status: "sale",
        type: "Villa",
        beds: 5,
        baths: 6,
        area: "6,200 sq ft",
        image: { src: unsplash("photo-1600596542815-ffad4c1539a9"), alt: "Ocean House exterior with a long pool" },
      },
      {
        id: "hudson-penthouse",
        title: "The Hudson Penthouse",
        location: "Tribeca, New York",
        price: "$7,250,000",
        priceValue: 7_250_000,
        status: "sale",
        type: "Penthouse",
        beds: 4,
        baths: 4.5,
        area: "4,100 sq ft",
        image: { src: unsplash("photo-1512917774080-9991f1c4c750"), alt: "Penthouse with skyline views" },
      },
      {
        id: "laurel-canyon",
        title: "Laurel Canyon Residence",
        location: "Los Angeles, California",
        price: "$3,980,000",
        priceValue: 3_980_000,
        status: "sale",
        type: "House",
        beds: 4,
        baths: 4,
        area: "3,400 sq ft",
        image: { src: unsplash("photo-1600585154340-be6161a56a0c"), alt: "Modern canyon house at sunset" },
      },
      {
        id: "marina-sky",
        title: "Marina Sky Apartment",
        location: "Dubai Marina, Dubai",
        price: "$2,150,000",
        priceValue: 2_150_000,
        status: "sale",
        type: "Apartment",
        beds: 3,
        baths: 3.5,
        area: "2,250 sq ft",
        image: { src: unsplash("photo-1545324418-cc1a3fa10c00"), alt: "High-rise apartments over the marina" },
      },
      {
        id: "chelsea-mews",
        title: "Chelsea Mews House",
        location: "Chelsea, London",
        price: "$18,500 / month",
        priceValue: 18_500,
        status: "rent",
        type: "House",
        beds: 3,
        baths: 2,
        area: "1,900 sq ft",
        image: { src: unsplash("photo-1613977257363-707ba9348227"), alt: "Elegant townhouse living room" },
      },
      {
        id: "bondi-cliff",
        title: "Bondi Cliff Residence",
        location: "Bondi, Sydney",
        price: "$9,800 / month",
        priceValue: 9_800,
        status: "rent",
        type: "Apartment",
        beds: 2,
        baths: 2,
        area: "1,300 sq ft",
        image: { src: unsplash("photo-1600607687939-ce8a6c25118c"), alt: "Bright apartment interior by the coast" },
      },
    ],
  },

  lifestyle: {
    title: "Live differently.",
    intro: "Three ways to think about home. Start with the life you want and we will find the address.",
    items: [
      {
        name: ["Coastal", "living"],
        description: "Beachfront villas and oceanview residences where the day starts and ends with the horizon.",
        image: { src: unsplash("photo-1507525428034-b723cf961d3e", 2600), alt: "Calm turquoise coastline" },
        cta: { label: "Explore coastal properties", href: "#properties" },
      },
      {
        name: ["City", "living"],
        description: "Penthouses and design-led apartments in the neighbourhoods that define their skylines.",
        image: { src: unsplash("photo-1486406146926-c627a92ad1ab", 2600), alt: "Glass towers in a city centre" },
        cta: { label: "Explore city properties", href: "#properties" },
      },
      {
        name: ["Private", "estates"],
        description: "Gated grounds, generous space and the kind of quiet that is increasingly hard to find.",
        image: { src: unsplash("photo-1605276374104-dee2a0ed3ce6", 2600), alt: "Private estate with landscaped grounds" },
        cta: { label: "Explore private estates", href: "#contact" },
      },
    ],
  },

  positioning: {
    statement: "Real estate is local. Our perspective isn't.",
    paragraph:
      "We pair neighbourhood-level knowledge with an international network of buyers, so every home is seen by the right people, in the right place, at the right moment.",
    cta: { label: "Work with us", href: "#contact" },
    stats: [
      { value: 120, suffix: "+", label: "Properties sold" },
      { value: 18, label: "Years of experience" },
      { value: 7, pad: 2, label: "Markets" },
      { value: 480, prefix: "$", suffix: "M+", label: "Transaction volume" },
    ],
  },

  agent: {
    title: "Meet the people behind the address.",
    name: "Sarah Mitchell",
    role: "Principal and luxury property advisor",
    markets: ["New York", "Los Angeles", "Miami"],
    bio: "Sarah has guided buyers and sellers through more than a decade of changing markets. Clients stay with her for the honest advice, the quiet negotiation and the follow-through.",
    portrait: { src: unsplash("photo-1573496359142-b8d87734a5a2", 1600), alt: "Portrait of Sarah Mitchell" },
    cta: { label: "Meet Sarah", href: "#contact" },
    gallery: [
      { src: unsplash("photo-1600596542815-ffad4c1539a9", 1400), alt: "Villa exterior" },
      { src: unsplash("photo-1600607687939-ce8a6c25118c", 1400), alt: "Living room interior" },
      { src: unsplash("photo-1512917774080-9991f1c4c750", 1400), alt: "Hillside home" },
      { src: unsplash("photo-1613977257363-707ba9348227", 1400), alt: "Reception room" },
      { src: unsplash("photo-1600585154340-be6161a56a0c", 1400), alt: "Modern house at dusk" },
    ],
  },

  locations: {
    title: "Where we work",
    items: [
      { name: "Miami", detail: "Florida, USA", image: { src: unsplash("photo-1506966953602-c20cc11f75e3", 2400), alt: "Miami skyline" } },
      { name: "New York", detail: "New York, USA", image: { src: unsplash("photo-1496442226666-8d4d0e62e6e9", 2400), alt: "New York skyline" } },
      { name: "Los Angeles", detail: "California, USA", image: { src: unsplash("photo-1534190760961-74e8c1c5c3da", 2400), alt: "Los Angeles hills" } },
      { name: "London", detail: "England, UK", image: { src: unsplash("photo-1513635269975-59663e0ac1ad", 2400), alt: "London street" } },
      { name: "Dubai", detail: "United Arab Emirates", image: { src: unsplash("photo-1512453979798-5ea266f8880c", 2400), alt: "Dubai skyline" } },
      { name: "Sydney", detail: "Australia", image: { src: unsplash("photo-1506973035872-a4ec16b8e8d9", 2400), alt: "Sydney harbour" } },
    ],
  },

  testimonials: {
    title: "In their words",
    items: [
      { quote: "They sold our home in nine days, above asking, and never once made it feel like a transaction.", name: "Elena R.", role: "Seller, Miami" },
      { quote: "Honest about what was worth it and what wasn't. We bought the right apartment because of that.", name: "James & Priya T.", role: "Buyers, New York" },
      { quote: "The calmest property search I have ever had, across two countries.", name: "Oliver H.", role: "Tenant, London" },
    ],
  },

  journal: {
    title: "From the journal",
    cta: { label: "All articles", href: "#journal" },
    items: [
      {
        category: "Market",
        title: "The seven neighbourhoods shaping Miami's luxury market",
        readTime: "6 min read",
        image: { src: unsplash("photo-1600596542815-ffad4c1539a9", 1200), alt: "Miami waterfront home" },
        href: "#journal",
      },
      {
        category: "Architecture",
        title: "Why quiet design is replacing statement design in new builds",
        readTime: "5 min read",
        image: { src: unsplash("photo-1600585154340-be6161a56a0c", 1200), alt: "Minimal modern house" },
        href: "#journal",
      },
      {
        category: "Lifestyle",
        title: "Moving abroad: what to settle before you make an offer",
        readTime: "8 min read",
        image: { src: unsplash("photo-1600607687939-ce8a6c25118c", 1200), alt: "Sunlit living space" },
        href: "#journal",
      },
    ],
  },

  contactSection: {
    headline: "Your next address starts with a conversation.",
    text: "Tell us what you are looking for. An advisor will reply within one business day.",
    primaryCta: { label: "Find your property", href: "#properties" },
    secondaryCta: { label: "Speak with an advisor", href: "tel:+13055550142" },
    form: {
      nameLabel: "Full name",
      emailLabel: "Email",
      phoneLabel: "Phone (optional)",
      interestLabel: "I'm interested in",
      interests: [
        { id: "buy", label: "Buying" },
        { id: "rent", label: "Renting" },
        { id: "sell", label: "Selling" },
        { id: "other", label: "Something else" },
      ],
      messageLabel: "How can we help?",
      messagePlaceholder: "Areas, budget, timing, or anything else that matters.",
      submit: "Send enquiry",
      sending: "Sending",
      success: "Thank you. An advisor will reply within one business day.",
      error: "Something went wrong. Please try again or call us directly.",
    },
  },

  footer: {
    statement: "Homes chosen with care, for people who notice the details.",
    links: [
      { label: "Buy", href: "#properties" },
      { label: "Sell", href: "#contact" },
      { label: "Rent", href: "#properties" },
      { label: "About", href: "#about" },
      { label: "Agents", href: "#agent" },
      { label: "Journal", href: "#journal" },
      { label: "Contact", href: "#contact" },
    ],
    legal: "Licensed real estate broker. License No. 0000000.",
    disclaimer: "All information is believed accurate but not guaranteed. Prices and availability may change without notice.",
  },
};

export default site;
