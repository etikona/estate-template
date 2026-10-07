import { ArrowUpRight } from "lucide-react";
import { cn, isExternal } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/** Text link with an animated underline and a small arrow */
export function TextLink({ href, children, className }: Props) {
  const external = isExternal(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn("group/link inline-flex items-center gap-2 text-sm font-medium tracking-wide", className)}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-right bg-current transition-transform duration-500 ease-out group-hover/link:origin-left group-hover/link:scale-x-0" />
      </span>
      <ArrowUpRight className="size-4 transition-transform duration-500 ease-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
    </a>
  );
}
