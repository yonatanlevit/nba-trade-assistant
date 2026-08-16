"use client";

// Split-view shell. ONE TradeState object drives both the chat panel and the
// Front Office Board, so the GUI mirror can never drift from conversation state.

import { useState } from "react";
import { Board } from "@/components/Board";
import { Chat, type ChatEntry } from "@/components/Chat";
import { emptyState, INITIAL_RESULT_COUNT, type ChatMsg, type TradeState } from "@/lib/state";

export default function Home() {
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [state, setState] = useState<TradeState>(emptyState);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "board">("chat");

  async function send() {
    const message = input.trim();
    if (!message || pending) return;

    const history: ChatMsg[] = entries.map((e) => ({ role: e.role, content: e.content }));
    setEntries((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ history, userMessage: message, state }),
      });
      const data = await res.json();
      if (data.state) setState(data.state);
      setEntries((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Something went wrong.",
          trace: data.trace,
        },
      ]);
      if (data.state?.searched) setMobileTab("board");
    } catch {
      setEntries((prev) => [
        ...prev,
        { role: "assistant", content: "I couldn't reach the server. Please try again." },
      ]);
    } finally {
      setPending(false);
    }
  }

  async function loadMore(targetCount: number) {
    setLoadingMore(true);
    try {
      const res = await fetch("/api/validate-batch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ state, targetCount }),
      });
      const data = await res.json();
      if (data.state) setState(data.state);
    } catch {
      setState((prev) => ({ ...prev, validationUnavailable: true }));
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <main className="mx-auto flex h-screen max-w-[1600px] flex-col gap-4 p-4">
      <header className="flex items-baseline justify-between">
        <h1 className="display text-2xl text-[var(--ink)]">
          Front Office <span className="text-[var(--amber)]">·</span> Trade Assistant
        </h1>
        <p className="hidden text-xs text-[var(--ink-dim)] sm:block">
          Every displayed trade is validated by the bball-GM league engine.
        </p>
      </header>

      {/* Mobile tab switch */}
      <div className="flex gap-2 lg:hidden">
        {(["chat", "board"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`display flex-1 cursor-pointer rounded-lg border px-3 py-2 text-sm ${
              mobileTab === tab
                ? "border-[var(--amber)] text-[var(--amber)]"
                : "border-[var(--line)] text-[var(--ink-dim)]"
            }`}
          >
            {tab === "chat" ? "Chat" : "Board"}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 grow gap-4 lg:grid-cols-[minmax(360px,420px)_1fr]">
        <div className={`min-h-0 ${mobileTab === "chat" ? "block" : "hidden"} lg:block`}>
          <Chat
            entries={entries}
            pending={pending}
            input={input}
            onInputChange={setInput}
            onSend={send}
          />
        </div>
        <div className={`min-h-0 ${mobileTab === "board" ? "block" : "hidden"} lg:block`}>
          <Board
            state={state}
            loadingMore={loadingMore}
            onShowMore={() => loadMore(state.shownCount + INITIAL_RESULT_COUNT)}
            onRetryValidation={() =>
              loadMore(Math.max(state.shownCount, INITIAL_RESULT_COUNT))
            }
          />
        </div>
      </div>
    </main>
  );
}
