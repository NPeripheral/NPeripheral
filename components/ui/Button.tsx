"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

type CommonProps = {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  href?: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  external?: boolean;
  /** Pointer attraction. On by default for primary calls to action. */
  magnetic?: boolean;
};

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

/**
 * The one rounded element on the site. Everything else has corners, so the
 * pill silhouette reads unmistakably as "this is the action".
 *
 * Hover does two things at once: the ground wipes up from the baseline and
 * the label rolls to its duplicate. Both are transform/opacity only.
 */
const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-tight transition-[color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45";

const sizes: Record<NonNullable<CommonProps["size"]>, string> = {
  sm: "px-5 py-2.5 text-[0.8125rem]",
  md: "px-7 py-3.5 text-sm",
  lg: "px-9 py-4.5 text-[0.95rem]",
};

const variants: Record<NonNullable<CommonProps["variant"]>, string> = {
  primary: "bg-ember text-[var(--on-ember)] hover:text-ink",
  secondary: "border border-[var(--rule,var(--color-line))] text-current hover:text-ink",
  outline: "border border-ember text-ember hover:text-[#fff6f1]",
  ghost: "text-current hover:text-ember",
};

const wipes: Record<NonNullable<CommonProps["variant"]>, string> = {
  primary: "bg-bone",
  secondary: "bg-bone",
  outline: "bg-ember",
  ghost: "bg-transparent",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      children,
      className,
      href,
      icon,
      trailingIcon,
      external,
      magnetic,
      ...rest
    },
    ref,
  ) {
    const classes = cn(base, sizes[size], variants[variant], className);
    const useMagnet = magnetic ?? variant === "primary";

    const content = (
      <>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 z-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100",
            wipes[variant],
          )}
        />
        {icon ? <span className="relative z-10 shrink-0">{icon}</span> : null}
        <span className="relative z-10 grid overflow-hidden">
          <span className="col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:-translate-y-full">
            {children}
          </span>
          <span
            aria-hidden
            className="col-start-1 row-start-1 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-y-0"
          >
            {children}
          </span>
        </span>
        {trailingIcon ? <span className="relative z-10 shrink-0">{trailingIcon}</span> : null}
      </>
    );

    const element = href ? (
      (() => {
        const isExternal = external ?? href.startsWith("http");
        return (
          <Link
            ref={ref as never}
            href={href}
            className={classes}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {content}
          </Link>
        );
      })()
    ) : (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...rest}>
        {content}
      </button>
    );

    return useMagnet ? <Magnetic strength={10}>{element}</Magnetic> : element;
  },
);

/** Arrow that steps forward on hover — used as a trailing icon. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn(
        "h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1",
        className,
      )}
    >
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
