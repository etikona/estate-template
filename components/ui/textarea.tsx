import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-none border-0 border-b border-border bg-transparent px-0 py-3 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus-visible:border-foreground focus-visible:shadow-[0_1px_0_0_var(--foreground)] focus-visible:outline-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
