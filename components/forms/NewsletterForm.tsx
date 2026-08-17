"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

/**
 * A single ruled line rather than a boxed field — the input is the rule,
 * and the submit arrow lives at its end.
 */
export function NewsletterForm({ className }: { className?: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
      setMessage(data.message ?? "You're subscribed — welcome aboard.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <label htmlFor={id} className="type-label-sm block text-quieter">
        Growth tactics, monthly
      </label>

      <div className="group/field rule-b mt-4 flex items-center gap-3 pb-3 transition-colors duration-300 focus-within:border-ember">
        <input
          id={id}
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="type-body w-full bg-transparent text-current outline-none placeholder:text-quieter"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe to the newsletter"
          className="group/btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] text-current transition-colors duration-300 hover:border-ember hover:bg-ember hover:text-[#fff6f1] disabled:opacity-50"
        >
          {status === "loading" ? (
            <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
          ) : (
            <ArrowRight />
          )}
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className={cn("type-small mt-3", status === "error" ? "text-ember-2" : "text-quiet")}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
