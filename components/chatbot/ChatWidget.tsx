"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Stage = "welcome" | "business" | "goal" | "platforms" | "qualified";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  content: string;
};

type Recommendation = { services: string[]; cta: string } | null;

function uid() {
  return Math.random().toString(36).slice(2);
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [stage, setStage] = useState<Stage>("welcome");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation>(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendTurn(userMessage?: string) {
    if (userMessage) {
      setMessages((prev) => [...prev, { id: uid(), role: "user", content: userMessage }]);
    }
    setQuickReplies([]);
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { id: uid(), role: "bot", content: data.reply }]);
      setStage(data.nextStage);
      setQuickReplies(data.quickReplies ?? []);
      setRecommendation(data.recommendation ?? null);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "bot", content: "Something glitched on my end — try booking a call directly instead." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    if (!hasOpenedOnce) {
      setHasOpenedOnce(true);
      void sendTurn();
    }
  }

  function handleQuickReply(reply: string) {
    void sendTurn(reply);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || loading) return;
    setInputValue("");
    void sendTurn(trimmed);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="NPeripheral quick questions"
            className="glass-strong flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-line)] bg-ember px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-bone">NPeripheral Concierge</p>
                <p className="text-xs text-quiet">AI-assisted · replies instantly</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-bone hover:bg-black/30"
              >
                ✕
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  <p
                    className={cn(
 "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-ember text-[#fff6f1]"
                        : "border border-[var(--color-line)] bg-bone/[0.045] text-quiet",
                    )}
                  >
                    {msg.content}
                  </p>
                </motion.div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <span className="flex items-center gap-1 rounded-2xl border border-[var(--color-line)] bg-bone/[0.045] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-white/60"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </span>
                </div>
              ) : null}

              {recommendation ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-ember-2">
                    Recommended for you
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {recommendation.services.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-[var(--color-line)] bg-bone/[0.045] px-2.5 py-1 text-xs text-quiet"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ring mt-3 flex items-center justify-center rounded-full bg-ember px-4 py-2.5 text-sm font-semibold text-bone"
                  >
                    {recommendation.cta}
                  </a>
                </motion.div>
              ) : null}

              {quickReplies.length ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => handleQuickReply(reply)}
                      className="rounded-full border border-[var(--color-line)] bg-bone/[0.045] px-3.5 py-2 text-xs font-medium text-quiet transition-colors hover:border-ember hover:text-ember"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[var(--color-line)] p-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 rounded-full bg-bone/[0.045] px-4 py-2.5 text-sm text-bone placeholder:text-quieter outline-none focus-visible:ring-1 focus-visible:ring-brand-lime"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember text-[#fff6f1] disabled:opacity-40"
              >
                ➜
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleOpen}
        aria-label={open ? "Chat open" : "Open chat with NPeripheral"}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0.8 : 1, pointerEvents: open ? "none" : "auto" }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-ember text-2xl text-bone shadow-2xl"
      >
        <motion.span
          className="absolute h-16 w-16 rounded-full bg-ember/40"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          aria-hidden
        />
        <span aria-hidden className="relative">💬</span>
      </motion.button>
    </div>
  );
}
