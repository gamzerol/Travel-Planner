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

export default function ChatPanel({ city }: Props) {
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
        body: JSON.stringify({
          messages: updatedMessages,
          city,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (err: any) {
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
    <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-3 h-[520px]">
      {/* Header */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            AI Travel Assistant
          </p>
          {city && <p className="text-xs text-gray-400">{city} specialist</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-xs text-gray-400 text-center mb-1">
              {city
                ? `Ask anything about ${city}`
                : "Generate a trip first, then ask questions"}
            </p>
            {city &&
              SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left text-xs bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-100 text-gray-600 hover:text-indigo-600 rounded-xl px-3 py-2.5 transition"
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
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
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
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3 py-2.5">
              <div className="flex gap-1 items-center h-4">
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
      <div className="flex gap-2 flex-shrink-0 pt-2 border-t border-gray-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={
            city ? "Type your question..." : "Generate a trip first..."
          }
          disabled={!city || loading}
          className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-200 focus:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading || !city}
          className="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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
  );
}
