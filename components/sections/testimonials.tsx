import { site } from "@/site.config";
import { RevealText } from "@/components/motion/reveal-text";

export function Testimonials() {
  const { testimonials } = site;

  return (
    <section className="border-t py-28 md:py-40">
      <div className="container-x">
        <RevealText as="h2" text={testimonials.title} className="display-md" />
        <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-12">
          {testimonials.items.map((t) => (
            <figure key={t.name}>
              <blockquote className="font-serif text-2xl leading-snug md:text-[1.75rem]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="block font-medium">{t.name}</span>
                <span className="text-muted">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
