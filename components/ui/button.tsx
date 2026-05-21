import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Variants map to the datastaq-hvac button system (globals.css):
   primary -> .btn-accent (gold), secondary -> .btn-light, dark -> .btn-dark.
   Size utilities override the fixed height/padding baked into those classes. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button font-jakarta font-semibold tracking-body-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "btn-accent",
        secondary: "btn-light",
        dark: "btn-dark",
        ghost: "text-ds-muted hover:bg-black/[0.04] hover:text-ds-heading",
        outline:
          "border border-ds-primary/40 text-ds-primary-dark hover:border-ds-primary hover:bg-ds-primary/10",
        danger:
          "bg-[#D8473B] text-white shadow-[0_8px_16px_-4px_rgba(216,71,59,0.5)] hover:-translate-y-0.5 hover:brightness-105",
      },
      size: {
        sm: "h-9 px-4 text-[0.82rem]",
        md: "h-11 px-6 text-[0.9rem]",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
