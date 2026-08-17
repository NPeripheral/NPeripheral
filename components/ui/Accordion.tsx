"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  question: string;
  answer: string;
  icon?: React.ReactNode;
};

/**
 * Ruled accordion. No boxes — each item is a line, and opening one lets the
 * answer push the rule down. Height is animated with a grid-rows trick so the
 * transition runs on the compositor and needs no measured pixel values.
 */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question} className="rule-b">
            <h3>
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group/q flex w-full items-baseline gap-5 py-6 text-left md:gap-8"
              >
                <span
                  className={cn(
                    "type-label-sm shrink-0 transition-colors duration-300",
                    isOpen ? "text-ember" : "text-quieter",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "type-h3 flex-1 transition-colors duration-300",
                    !isOpen && "group-hover/q:text-ember",
                  )}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "shrink-0 text-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen ? "rotate-45 text-ember" : "text-quieter",
                  )}
                >
                  +
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="type-body max-w-2xl pb-7 text-quiet md:pl-[3.75rem]">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
