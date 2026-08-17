"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

/** Pages that already are the call to action — a bar would just cover them. */
const SUPPRESSED = ["/contact", "/thank-you"];

/**
 * Sticky action bar for small screens.
 *
 * Appears once the reader has committed to the page (past the hero), and
 * retracts near the footer where the real CTA already lives. Two actions
 * only: book, or call. It also reserves bottom padding on the body so the
 * bar never covers the last line of a page.
 */
export function StickyMobileCta() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  const suppressed = SUPPRESSED.some((path) => pathname?.startsWith(path));

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (suppressed) {
      setVisible(false);
      return;
    }
    const doc = document.documentElement;
    const nearBottom = latest + window.innerHeight > doc.scrollHeight - 900;
    setVisible(latest > 520 && !nearBottom);
  });

  useEffect(() => {
    if (suppressed) return;
    document.body.classList.add("has-sticky-cta");
    return () => document.body.classList.remove("has-sticky-cta");
  }, [suppressed]);

  if (suppressed) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[65] border-t border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-ink)_94%,transparent)] backdrop-blur-xl md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-stretch gap-3 px-4 py-3">
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="type-label flex min-h-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] px-5 text-bone"
              aria-label={`Call ${siteConfig.name} on ${siteConfig.phone}`}
            >
              Call
            </a>
            <Link
              href="/contact"
              className="type-label flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ember px-5 text-[#fff6f1]"
            >
              Get a quote
              <span aria-hidden>→</span>
            </Link>
          </div>
          <p className="type-label-sm px-4 pb-3 text-center text-quieter">
            {siteConfig.responsePromiseShort}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
