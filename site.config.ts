import type { Listing, SiteConfig } from "@/lib/types";
import images from "@/content/images.json";
import listingsData from "@/content/listings.json";
import locationsData from "@/content/locations.json";

/**
 * ─────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU EDIT FOR A NEW CLIENT
 *  Replace text, images, colors and toggle sections on or off.
 *  Properties, locations and images live in /content/*.json and can be
 *  edited with `npm run content` (or by hand).
 * ─────────────────────────────────────────────────────────────
 */

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
    ogImage: images.ogImage,
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
    image: images.hero,
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
    priceRanges: listingsData.priceRanges,
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
    listings: listingsData.items as Listing[],
  },

  lifestyle: {
    title: "Live differently.",
    intro: "Three ways to think about home. Start with the life you want and we will find the address.",
    items: [
      {
        name: ["Coastal", "living"],
        description: "Beachfront villas and oceanview residences where the day starts and ends with the horizon.",
        image: images.lifestyle[0],
        cta: { label: "Explore coastal properties", href: "#properties" },
      },
      {
        name: ["City", "living"],
        description: "Penthouses and design-led apartments in the neighbourhoods that define their skylines.",
        image: images.lifestyle[1],
        cta: { label: "Explore city properties", href: "#properties" },
      },
      {
        name: ["Private", "estates"],
        description: "Gated grounds, generous space and the kind of quiet that is increasingly hard to find.",
        image: images.lifestyle[2],
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
    portrait: images.agentPortrait,
    cta: { label: "Meet Sarah", href: "#contact" },
    gallery: images.agentGallery,
  },

  locations: {
    title: "Where we work",
    items: locationsData,
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
        image: images.journal[0],
        href: "#journal",
      },
      {
        category: "Architecture",
        title: "Why quiet design is replacing statement design in new builds",
        readTime: "5 min read",
        image: images.journal[1],
        href: "#journal",
      },
      {
        category: "Lifestyle",
        title: "Moving abroad: what to settle before you make an offer",
        readTime: "8 min read",
        image: images.journal[2],
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
