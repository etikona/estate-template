import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-12 w-full border-0 border-b border-border bg-transparent px-0 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus-visible:border-foreground focus-visible:shadow-[0_1px_0_0_var(--foreground)] focus-visible:outline-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
