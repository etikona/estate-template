import { site } from "@/site.config";
import { SiteImage } from "@/components/media/site-image";
import { RevealText } from "@/components/motion/reveal-text";
import { TextLink } from "@/components/ui/text-link";

export function Journal() {
  const { journal } = site;

  return (
    <section id="journal" className="pb-28 pt-8 md:pb-44">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <RevealText as="h2" text={journal.title} className="display-lg" />
          {journal.cta ? <TextLink href={journal.cta.href}>{journal.cta.label}</TextLink> : null}
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-3 lg:gap-x-12">
          {journal.items.map((post) => (
            <article key={post.title}>
              <a href={post.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <SiteImage
                    src={post.image.src}
                    alt={post.image.alt}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-muted">
                  <span>{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="mt-4 font-serif text-3xl leading-[1.08] tracking-tight md:text-[2.1rem]">
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-out group-hover:bg-[length:100%_1px]">
                    {post.title}
                  </span>
                </h3>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
