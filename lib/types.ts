export type Img = { src: string; alt: string };
export type Link = { label: string; href: string };

export type ListingStatus = "sale" | "rent";
export type Listing = {
  id: string;
  title: string;
  location: string;
  /** Text shown on the card, e.g. "$4,850,000" or "$18,500 / month" */
  price: string;
  /** Number used by the price filter */
  priceValue: number;
  status: ListingStatus;
  type: string;
  beds?: number;
  baths?: number;
  area?: string;
  image: Img;
  /** Optional detail page or external listing URL. Falls back to the contact section. */
  href?: string;
};

export type PriceRange = { label: string; max: number };
export type Stat = { value: number; prefix?: string; suffix?: string; pad?: number; label: string };
export type InterestId = "buy" | "rent" | "sell" | "other";

export type SiteConfig = {
  url: string;
  name: string;
  tagline: string;
  logo?: { src: string; alt: string; width: number; height: number };
  seo: { title: string; description: string; keywords?: string[]; ogImage?: string };
  theme: {
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    border: string;
    surface: string;
    dark: string;
    radius: string;
  };
  contact: { phone: string; email: string; whatsapp?: string; address: string; hours?: string };
  social: Link[];
  nav: { links: Link[]; cta: Link };
  sections: {
    hero: boolean;
    search: boolean;
    featured: boolean;
    lifestyle: boolean;
    positioning: boolean;
    agent: boolean;
    locations: boolean;
    testimonials: boolean;
    journal: boolean;
    contact: boolean;
  };
  preloader: { enabled: boolean };
  hero: {
    headline: string[];
    subheadline: string;
    image: Img;
    video?: { src: string; poster?: string };
    primaryCta: Link;
    secondaryCta?: Link;
    caption?: { title: string; location: string };
  };
  search: {
    tabs: { buy: string; rent: string; sell: string };
    locationLabel: string;
    locationPlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    typeLabel: string;
    anyTypeLabel: string;
    priceLabel: string;
    anyPriceLabel: string;
    priceRanges: { sale: PriceRange[]; rent: PriceRange[] };
    submit: string;
    sellSubmit: string;
  };
  featured: {
    title: string;
    intro: string;
    cta?: Link;
    viewLabel: string;
    statusLabels: { sale: string; rent: string };
    emptyTitle: string;
    emptyAction: string;
    listings: Listing[];
  };
  lifestyle: {
    title: string;
    intro: string;
    items: { name: string[]; description: string; image: Img; cta: Link }[];
  };
  positioning: { statement: string; paragraph: string; cta?: Link; stats: Stat[] };
  agent: {
    title: string;
    name: string;
    role: string;
    markets: string[];
    bio: string;
    portrait: Img;
    cta: Link;
    gallery: Img[];
  };
  locations: { title: string; items: { name: string; detail: string; image: Img; href?: string }[] };
  testimonials: { title: string; items: { quote: string; name: string; role: string }[] };
  journal: {
    title: string;
    cta?: Link;
    items: { category: string; title: string; readTime: string; image: Img; href: string }[];
  };
  contactSection: {
    headline: string;
    text: string;
    primaryCta: Link;
    secondaryCta: Link;
    form: {
      nameLabel: string;
      emailLabel: string;
      phoneLabel: string;
      interestLabel: string;
      interests: { id: InterestId; label: string }[];
      messageLabel: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
    };
  };
  footer: { statement: string; links: Link[]; legal: string; disclaimer?: string };
};
