"use client";

import { useState } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function AIPage() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Namaste. I’m डाक्टर साहेब. Describe your healthcare concern and I’ll help guide you toward the right SAHARA service.",
    },
  ]);

  function sendMessage() {
    if (!input.trim()) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: input,
      },
    ]);

    setInput("");

    setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: "This is currently a frontend demo. The backend AI service can later analyze the message and redirect the user toward hospitals, doctors, blood resources or emergency care.",
        },
      ]);
    }, 400);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SAHARA
          </Link>

          <Link href="/emergency" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">
            Emergency SOS
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            AI Healthcare Navigator
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            डाक्टर साहेब
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Describe your concern in English or Nepali.
          </p>

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-800">
              Emergency Warning
            </p>

            <p className="mt-2 text-sm leading-6 text-red-700">
              डाक्टर साहेब does not replace professional medical care.
            </p>
          </div>
        </div>

        <div className="flex min-h-[650px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <p className="font-bold">डाक्टर साहेब</p>
            <p className="text-xs text-green-600">
              Healthcare Navigator
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[80%] rounded-2xl bg-blue-600 p-4 text-white"
                    : "max-w-[85%] rounded-2xl border border-slate-200 bg-white p-4"
                }
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-5">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Describe your health concern..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3"
              />

              <button
                onClick={sendMessage}
                className="rounded-xl bg-blue-600 px-5 font-semibold text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}