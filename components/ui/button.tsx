import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Buttons fill from the bottom on hover using a background-size transition,
 * so they also work with `asChild` (links).
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-[var(--radius)] text-sm font-medium tracking-wide outline-none transition-[background-size,color,border-color] duration-500 ease-out bg-no-repeat bg-bottom bg-[length:100%_0%] hover:bg-[length:100%_100%] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background bg-[linear-gradient(var(--accent),var(--accent))] hover:text-foreground",
        light:
          "bg-dark-foreground text-dark bg-[linear-gradient(var(--accent),var(--accent))] hover:text-dark",
        outline:
          "border border-foreground/30 text-foreground bg-[linear-gradient(var(--foreground),var(--foreground))] hover:border-foreground hover:text-background",
        outlineLight:
          "border border-white/40 text-dark-foreground bg-[linear-gradient(var(--background),var(--background))] hover:border-dark-foreground hover:text-dark",
      },
      size: {
        sm: "h-10 px-5",
        default: "h-12 px-7",
        lg: "h-14 px-9 text-[0.95rem]",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
