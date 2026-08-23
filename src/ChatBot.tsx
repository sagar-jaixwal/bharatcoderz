import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  CHAT_FALLBACK,
  CHAT_GREETING,
  CHAT_QUICK_PROMPTS,
} from "./data/chatKnowledge";
import { getChatReply } from "./chat/replyEngine";
import AiBotAvatar, { type AiBotMood } from "./AiBotAvatar";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function randomReplyMood(): AiBotMood {
  const moods: AiBotMood[] = ["speaking", "happy", "love", "happy", "speaking"];
  return moods[Math.floor(Math.random() * moods.length)]!;
}

async function askAi(history: ChatMessage[]) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: history.map((message) => ({
        role: message.role === "bot" ? "assistant" : "user",
        content: message.text,
      })),
    }),
  });

  const data = (await response.json()) as {
    reply?: string;
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    const error = new Error(data.message ?? "AI request failed") as Error & {
      code?: string;
    };
    error.code = data.error;
    throw error;
  }

  if (!data.reply) throw new Error("Empty AI reply");
  return data.reply;
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [botMood, setBotMood] = useState<AiBotMood>("idle");
  const [modeLabel, setModeLabel] = useState("AI · proposal-aware");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "bot", text: CHAT_GREETING },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const moodResetRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (typing) {
      setBotMood("thinking");
      return;
    }
    if (!open && engaged) {
      setBotMood("idle");
    }
  }, [typing, open, engaged]);

  const pulseMood = (mood: AiBotMood, holdMs = 2200) => {
    if (moodResetRef.current) window.clearTimeout(moodResetRef.current);
    setBotMood(mood);
    moodResetRef.current = window.setTimeout(() => {
      setBotMood(open ? "listening" : "idle");
    }, holdMs);
  };

  const toggleOpen = () => {
    setEngaged(true);
    setOpen((value) => {
      const next = !value;
      if (next) pulseMood(Math.random() < 0.5 ? "happy" : "love", 2500);
      else setBotMood("idle");
      return next;
    });
  };

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;

    const userMessage: ChatMessage = { id: uid(), role: "user", text };
    const conversation = [
      ...messages.filter((message) => message.id !== "welcome"),
      userMessage,
    ];

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);
    setBotMood("thinking");

    try {
      const reply = await askAi(conversation);
      setModeLabel("Groq AI · live");
      setMessages((prev) => [...prev, { id: uid(), role: "bot", text: reply }]);
      pulseMood(randomReplyMood(), 2600);
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: string }).code)
          : "";

      if (code === "missing_api_key") {
        const local = getChatReply(text);
        setModeLabel("Local fallback · add GROQ_API_KEY");
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "bot",
            text: `${local}\n\n(Tip: add a free Groq API key in .env as GROQ_API_KEY for real AI answers — https://console.groq.com/keys)`,
          },
        ]);
      } else {
        const local = getChatReply(text) || CHAT_FALLBACK;
        setModeLabel("Local fallback");
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "bot",
            text: `${local}\n\n(AI API temporarily unavailable — showing proposal-based answer.)`,
          },
        ]);
      }
      pulseMood(Math.random() < 0.5 ? "hang" : "speaking", 2200);
    } finally {
      setTyping(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  return createPortal(
    <div className={`chatbot${open ? " is-open" : ""}`}>
      {open ? (
        <section
          className="chatbot__panel"
          role="dialog"
          aria-label="BharatCoderz AI assistant"
        >
          <header className="chatbot__header">
            <div className="chatbot__identity">
              <span className="chatbot__pulse" aria-hidden />
              <div>
                <p className="chatbot__title">BharatCoderz Assistant</p>
                <p className="chatbot__status">{modeLabel}</p>
              </div>
            </div>
            <button
              type="button"
              className="chatbot__icon-btn"
              aria-label="Close chat"
              onClick={() => {
                setOpen(false);
                setBotMood("idle");
              }}
            >
              ×
            </button>
          </header>

          <div className="chatbot__messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot__bubble chatbot__bubble--${message.role}`}
              >
                {message.text.split("\n").map((line, index) => (
                  <p key={`${message.id}-${index}`}>{line || "\u00A0"}</p>
                ))}
              </div>
            ))}

            {typing ? (
              <div className="chatbot__bubble chatbot__bubble--bot chatbot__typing">
                <span />
                <span />
                <span />
              </div>
            ) : null}

            {!typing && messages.length < 3 ? (
              <div className="chatbot__suggestions">
                {CHAT_QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="chatbot__chip"
                    onClick={() => void send(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          <form className="chatbot__composer" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about services, AI, process…"
              aria-label="Message"
              disabled={typing}
            />
            <button
              type="submit"
              className="chatbot__send"
              disabled={typing || !input.trim()}
            >
              Send
            </button>
          </form>

          <p className="chatbot__footer">
            Prefer a human?{" "}
            <Link to="/contact" onClick={() => setOpen(false)}>
              Contact the team
            </Link>
          </p>
        </section>
      ) : null}

      <div className="chatbot__fab">
        <AiBotAvatar
          open={open}
          mood={botMood}
          keepTalking={!engaged}
          className="chatbot__fab-visual"
        />
        <button
          type="button"
          className="chatbot__fab-hit"
          aria-label={
            open ? "Close BharatCoderz assistant" : "Open BharatCoderz assistant"
          }
          aria-expanded={open}
          onClick={toggleOpen}
        />
      </div>
    </div>,
    document.body
  );
}

export default ChatBot;
