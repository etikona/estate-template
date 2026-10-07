import { site } from "@/site.config";

export function Footer() {
  const { footer, contact, social, name } = site;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-dark-foreground">
      <div className="container-x pb-10 pt-24 md:pt-32">
        <div className="grid gap-16 md:grid-cols-12">
          <p className="font-serif text-4xl leading-[1.05] tracking-tight md:col-span-5 md:text-5xl">
            {footer.statement}
          </p>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-7">
            <p className="mb-5 text-sm text-white/45">Explore</p>
            <ul className="space-y-3 text-[0.95rem]">
              {footer.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors duration-300 hover:text-accent">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="mb-5 text-sm text-white/45">Follow</p>
            <ul className="space-y-3 text-[0.95rem]">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="mb-5 text-sm text-white/45">Visit</p>
            <address className="space-y-3 text-[0.95rem] not-italic text-white/80">
              <p>{contact.address}</p>
              <p>
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="hover:text-accent">
                  {contact.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${contact.email}`} className="hover:text-accent">
                  {contact.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-24 select-none overflow-hidden whitespace-nowrap font-serif text-[clamp(3rem,12vw,13rem)] leading-[0.85] tracking-tight text-white/[0.07]"
        >
          {name}
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-start md:justify-between">
          <p>
            © {year} {name}. {footer.legal}
          </p>
          {footer.disclaimer ? <p className="max-w-xl md:text-right">{footer.disclaimer}</p> : null}
        </div>
      </div>
    </footer>
  );
}
