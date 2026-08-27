"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navLinks, siteConfig, socialLinks, hasSocialLinks } from "@/lib/site-config";
import { Logo } from "@/components/layout/Logo";
import { Button, ArrowRight } from "@/components/ui/Button";
import { ContextualHelp } from "@/components/help/ContextualHelp";
import { CommandPaletteHint } from "@/components/ui/CommandPalette";
import { cn } from "@/lib/utils";

/**
 * Navigation is deliberately thin. It sits transparent over the hero,
 * condenses into an ink bar once you leave it, and gets out of the way
 * entirely while you are reading downward.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  const pathname = usePathname();

  /** True only at the top of the landing page, where the ground is sea. */
  const overSea = pathname === "/" && !scrolled;
  const lastY = useRef(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [trackedPathname, setTrackedPathname] = useState(pathname);
  if (pathname !== trackedPathname) {
    setTrackedPathname(pathname);
    setOpen(false);
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
    const goingDown = latest > lastY.current;
    setHidden(goingDown && latest > 420 && !open);
    lastY.current = latest;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-105%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-[background-color,border-color,backdrop-filter,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled && !open
            ? "border-b border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-ink)_86%,transparent)] py-3 backdrop-blur-xl"
            : "border-b border-transparent py-5",
        )}
      >
        <nav
          className="shell flex items-center justify-between gap-6"
          aria-label="Primary"
        >
          <Logo className="relative z-10 text-bone" />

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link, i) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="type-label group/nav relative inline-flex items-center gap-2 py-2 text-bone/70 transition-colors duration-300 hover:text-bone"
                >
                  <span className={cn(
                    "text-[9px] opacity-0 transition-opacity duration-300 group-hover/nav:opacity-100",
                    overSea ? "text-white" : "text-ember",
                  )}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="link-underline">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <CommandPaletteHint />
            <ContextualHelp />
            {/* Over the underwater hero the accent is retired, matching the
                ground-sea override inside the chapter -- an ember pill against
                sunlit blue reads as a clash, not an accent. Once the page has
                scrolled onto ink the primary button returns. */}
            <Button
              href="/contact"
              size="sm"
              variant={overSea ? "secondary" : "primary"}
              trailingIcon={<ArrowRight />}
            >
              Get a Quote
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            ref={closeRef}
            className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center text-bone lg:hidden"
          >
            <span className="relative block h-3 w-6" aria-hidden>
              <motion.span
                className="absolute left-0 top-0 h-px w-full bg-current"
                animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="absolute bottom-0 left-0 h-px w-full bg-current"
                animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="ground-ink grain fixed inset-0 z-[75] flex flex-col overflow-y-auto lg:hidden"
          >
            <div className="shell flex flex-1 flex-col justify-center pb-12 pt-28">
              <p className="type-label-sm rule-b pb-4 text-quieter">Menu</p>
              <ul className="mt-8 flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rule-b flex items-baseline justify-between gap-4 py-4"
                    >
                      <span className="type-h3">{link.label}</span>
                      <span className="type-label-sm text-quieter">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-10 flex flex-col gap-6"
              >
                <Button href="/contact" size="lg" className="w-full" trailingIcon={<ArrowRight />}>
                  Get a Quote
                </Button>

                <div className="rule-t rule-b">
                  <ContextualHelp variant="row" />
                </div>

                {hasSocialLinks ? (
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="type-label-sm link-underline inline-block py-2 text-quiet"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                ) : null}

                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="type-label-sm link-underline inline-block py-2 text-quiet"
                >
                  {siteConfig.phone}
                </a>

                <a href={`mailto:${siteConfig.email}`} className="type-small link-underline text-quiet">
                  {siteConfig.email}
                </a>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
