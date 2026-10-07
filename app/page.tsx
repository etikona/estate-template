import { site } from "@/site.config";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Preloader } from "@/components/layout/preloader";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { PropertyExplorer } from "@/components/sections/property-explorer";
import { Lifestyle } from "@/components/sections/lifestyle";
import { Positioning } from "@/components/sections/positioning";
import { Agent } from "@/components/sections/agent";
import { Locations } from "@/components/sections/locations";
import { Testimonials } from "@/components/sections/testimonials";
import { Journal } from "@/components/sections/journal";
import { Contact } from "@/components/sections/contact";

export default function Page() {
  const s = site.sections;

  return (
    <SmoothScroll>
      <Preloader />
      <Navbar />
      <main>
        {s.hero && <Hero />}
        {(s.search || s.featured) && <PropertyExplorer />}
        {s.lifestyle && <Lifestyle />}
        {s.positioning && <Positioning />}
        {s.agent && <Agent />}
        {s.locations && <Locations />}
        {s.testimonials && <Testimonials />}
        {s.journal && <Journal />}
        {s.contact && <Contact />}
      </main>
      <Footer />
    </SmoothScroll>
  );
}
