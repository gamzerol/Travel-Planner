"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  city: string;
}

const SUGGESTIONS = [
  "Best local food to try?",
  "Hidden gems to visit?",
  "How to get around?",
  "Best time to visit?",
];

export default function ChatBubble({ city }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, city }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat penceresi */}
      {open && (
        <div
          className="w-80 bg-white rounded-2xl border border-gray-100 shadow-xl flex flex-col overflow-hidden"
          style={{ height: "420px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50 bg-gradient-to-r from-violet-500 to-indigo-500">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                AI Travel Assistant
              </p>
              {city && (
                <p className="text-xs text-white/70">{city} specialist</p>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.length === 0 && (
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-xs text-gray-400 text-center mb-1">
                  {city
                    ? `Ask anything about ${city}`
                    : "Generate a trip first"}
                </p>
                {city &&
                  SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left text-xs bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-100 text-gray-600 hover:text-indigo-600 rounded-xl px-3 py-2 transition"
                    >
                      {s}
                    </button>
                  ))}
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-500 text-white rounded-tr-sm"
                      : "bg-gray-50 text-gray-700 rounded-tl-sm border border-gray-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3 py-2.5">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-gray-50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={
                city ? "Type your question..." : "Generate a trip first..."
              }
              disabled={!city || loading}
              className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-200 transition disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || !city}
              className="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 rounded-xl flex items-center justify-center transition flex-shrink-0"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Bubble butonu */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 rounded-full shadow-lg flex items-center justify-center transition"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
