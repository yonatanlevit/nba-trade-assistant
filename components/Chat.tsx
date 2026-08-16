"use client";

import { useEffect, useRef } from "react";
import type { TraceEntry } from "@/lib/state";

export type ChatEntry = {
  role: "user" | "assistant";
  content: string;
  trace?: TraceEntry[];
};

export function Chat({
  entries,
  pending,
  input,
  onInputChange,
  onSend,
}: {
  entries: ChatEntry[];
  pending: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries.length, pending]);

  return (
    <div className="panel flex h-full flex-col overflow-hidden" data-testid="chat">
      <header className="border-b border-[var(--line)] px-4 py-3">
        <h2 className="display text-sm text-[var(--amber)]">Trade desk</h2>
        <p className="text-xs text-[var(--ink-dim)]">
          Conversation drives the board — the mouse is optional.
        </p>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 grow space-y-3 overflow-y-auto px-4 py-4"
        aria-live="polite"
        aria-label="Conversation"
      >
        {entries.length === 0 && (
          <p className="text-sm text-[var(--ink-dim)]">
            Try: <span className="text-[var(--ink)]">&ldquo;I&rsquo;m Boston and I want Anthony Davis&rdquo;</span>
          </p>
        )}
        {entries.map((entry, i) => (
          <MessageBubble key={i} entry={entry} />
        ))}
        {pending && (
          <div className="flex items-center gap-2 text-xs text-[var(--ink-dim)]">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--amber)]" />
            Working&hellip;
          </div>
        )}
      </div>

      <form
        className="flex gap-2 border-t border-[var(--line)] p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!pending) onSend();
        }}
      >
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Tell me your team and target…"
          aria-label="Message"
          data-testid="chat-input"
          className="grow rounded-lg border border-[var(--line)] bg-[var(--court)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-dim)]"
        />
        <button
          type="submit"
          disabled={pending || input.trim().length === 0}
          data-testid="chat-send"
          className="display cursor-pointer rounded-lg bg-[var(--amber)] px-4 py-2 text-sm text-[var(--court)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

function MessageBubble({ entry }: { entry: ChatEntry }) {
  const isUser = entry.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex flex-col items-start gap-1.5"}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--elevated)] px-3.5 py-2 text-sm"
            : "max-w-[92%] rounded-2xl rounded-bl-sm border border-[var(--line)] bg-[var(--court)] px-3.5 py-2 text-sm"
        }
        data-testid={isUser ? "user-message" : "assistant-message"}
      >
        {entry.content}
      </div>
      {!isUser && entry.trace && entry.trace.length > 0 && (
        <div className="flex flex-wrap gap-1.5" data-testid="tool-trail">
          {entry.trace.map((t, i) => (
            <span key={i} className={t.ok ? "chip chip-ok" : "chip chip-warn"}>
              <code className="text-[0.68rem]">{t.tool}</code>
              {t.summary}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
