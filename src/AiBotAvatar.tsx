import { useEffect, useRef } from "react";

export type AiBotMood =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "happy"
  | "love"
  | "hang";

type AiBotAvatarProps = {
  mood?: AiBotMood;
  open?: boolean;
  keepTalking?: boolean;
  className?: string;
  bubbleClassName?: string;
};

const CHATTER_LINES = [
  "Hey! Need help with BharatCoderz?",
  "Ask me about our services ✨",
  "Custom software? AI? Apps? Tap me!",
  "I'm your BharatCoderz assistant 👋",
  "Let's talk about your project!",
  "Australian businesses — we've got you",
  "Click me to chat!",
  "How can technology help your business?",
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

/** Visual-only AI bot (not a button — parent owns the click target). */
function AiBotAvatar({
  mood = "idle",
  open = false,
  keepTalking = false,
  className = "",
  bubbleClassName = "",
}: AiBotAvatarProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const eyeLeftRef = useRef<HTMLDivElement>(null);
  const eyeRightRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const handLeftRef = useRef<HTMLDivElement>(null);
  const handRightRef = useRef<HTMLDivElement>(null);
  const thinkingRef = useRef<HTMLDivElement>(null);
  const hangRef = useRef<HTMLDivElement>(null);
  const heartsRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<AiBotMood>(mood);
  const bubbleTimer = useRef<number | null>(null);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  const clearVisual = () => {
    const body = bodyRef.current;
    const eyeL = eyeLeftRef.current;
    const eyeR = eyeRightRef.current;
    const mouth = mouthRef.current;
    const handL = handLeftRef.current;
    const handR = handRightRef.current;
    if (!body || !eyeL || !eyeR || !mouth || !handL || !handR) return;

    body.className = "ai-bot__body-group";
    eyeL.className = "ai-bot__eye ai-bot__eye--left";
    eyeR.className = "ai-bot__eye ai-bot__eye--right";
    mouth.className = "ai-bot__mouth";
    handL.className = "ai-bot__hand ai-bot__hand--left";
    handR.className = "ai-bot__hand ai-bot__hand--right";
    thinkingRef.current?.classList.remove("is-active");
    hangRef.current?.classList.remove("is-active");
  };

  const applyMood = (next: AiBotMood) => {
    clearVisual();
    const body = bodyRef.current;
    const eyeL = eyeLeftRef.current;
    const eyeR = eyeRightRef.current;
    const mouth = mouthRef.current;
    const handL = handLeftRef.current;
    const handR = handRightRef.current;
    if (!body || !eyeL || !eyeR || !mouth || !handL || !handR) return;

    switch (next) {
      case "listening":
        body.classList.add("is-listening");
        break;
      case "thinking":
        eyeL.classList.add("is-thinking");
        eyeR.classList.add("is-thinking");
        mouth.classList.add("is-thinking");
        thinkingRef.current?.classList.add("is-active");
        break;
      case "speaking":
        mouth.classList.add("is-speaking");
        handL.classList.add("is-waving");
        handR.classList.add("is-waving");
        break;
      case "happy":
        eyeL.classList.add("is-happy");
        eyeR.classList.add("is-happy");
        mouth.classList.add("is-happy");
        break;
      case "love":
        eyeL.classList.add("is-love");
        eyeR.classList.add("is-love");
        mouth.classList.add("is-happy");
        break;
      case "hang":
        body.classList.add("is-hang");
        mouth.classList.add("is-hang");
        hangRef.current?.classList.add("is-active");
        break;
      default:
        break;
    }
  };

  const spawnHearts = (count = 4) => {
    const container = heartsRef.current;
    if (!container) return;
    for (let i = 0; i < count; i++) {
      window.setTimeout(() => {
        const heart = document.createElement("div");
        heart.className = "ai-bot__heart";
        heart.textContent = pickRandom(["❤️", "💕", "💖", "✨", "💗"]);
        heart.style.left = `${20 + Math.random() * 60}%`;
        heart.style.top = `${10 + Math.random() * 40}%`;
        heart.style.animationDuration = `${1.4 + Math.random()}s`;
        container.appendChild(heart);
        window.setTimeout(() => heart.remove(), 2200);
      }, i * 160);
    }
  };

  const showBubble = (text: string, ms = 2800) => {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    bubble.textContent = text;
    bubble.classList.add("is-visible");
    bubbleTimer.current = window.setTimeout(() => {
      bubble.classList.remove("is-visible");
    }, ms);
  };

  useEffect(() => {
    applyMood(mood);
    if (mood === "love") spawnHearts(5);
    if (mood === "happy" && Math.random() < 0.45) spawnHearts(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !keepTalking || open) {
      bubbleRef.current?.classList.remove("is-visible");
      return;
    }

    let cancelled = false;
    let loopTimer = 0;

    const talkOnce = () => {
      if (cancelled || open) return;
      const line = pickRandom(CHATTER_LINES);
      const reaction = pickRandom([
        "speaking",
        "happy",
        "love",
        "listening",
      ] as AiBotMood[]);
      applyMood(reaction);
      showBubble(line, 2600 + Math.random() * 900);
      if (reaction === "love") spawnHearts(3);

      loopTimer = window.setTimeout(() => {
        if (cancelled) return;
        applyMood("idle");
        loopTimer = window.setTimeout(talkOnce, 900 + Math.random() * 1200);
      }, 2800 + Math.random() * 1000);
    };

    loopTimer = window.setTimeout(talkOnce, 500);

    const blinkTimer = window.setInterval(() => {
      if (Math.random() > 0.4) return;
      eyeLeftRef.current?.classList.add("is-blinking");
      eyeRightRef.current?.classList.add("is-blinking");
      window.setTimeout(() => {
        eyeLeftRef.current?.classList.remove("is-blinking");
        eyeRightRef.current?.classList.remove("is-blinking");
      }, 150);
    }, 2200);

    return () => {
      cancelled = true;
      window.clearTimeout(loopTimer);
      window.clearInterval(blinkTimer);
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keepTalking, open]);

  useEffect(() => {
    if (keepTalking || open) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const tiltTimer = window.setInterval(() => {
      if (moodRef.current !== "idle") return;
      if (Math.random() > 0.35) return;
      const dir = Math.random() < 0.5 ? "is-tilt-left" : "is-tilt-right";
      bodyRef.current?.classList.add(dir);
      window.setTimeout(() => bodyRef.current?.classList.remove(dir), 2000);
    }, 4500);

    return () => window.clearInterval(tiltTimer);
  }, [keepTalking, open]);

  return (
    <div className={`ai-bot ${className}${open ? " is-open" : ""}`.trim()} aria-hidden>
      <div
        className={`ai-bot__speech ${bubbleClassName}`.trim()}
        ref={bubbleRef}
      />

      <div className="ai-bot__stage">
        <div className="ai-bot__hang" ref={hangRef} />
        <div className="ai-bot__hearts" ref={heartsRef} />

        <div className="ai-bot__scale">
          <div className="ai-bot__body-group" ref={bodyRef}>
            <div className="ai-bot__shadow" />
            <div className="ai-bot__body">
              <div className="ai-bot__ear ai-bot__ear--left">
                <div className="ai-bot__ear-inner" />
              </div>
              <div className="ai-bot__ear ai-bot__ear--right">
                <div className="ai-bot__ear-inner" />
              </div>

              <div className="ai-bot__face">
                <div className="ai-bot__eye ai-bot__eye--left" ref={eyeLeftRef}>
                  <div className="ai-bot__eye-pixel" />
                </div>
                <div className="ai-bot__eye ai-bot__eye--right" ref={eyeRightRef}>
                  <div className="ai-bot__eye-pixel" />
                </div>
                <div className="ai-bot__mouth" ref={mouthRef}>
                  <div className="ai-bot__mouth-shape" />
                </div>
              </div>

              <div className="ai-bot__hand ai-bot__hand--left" ref={handLeftRef} />
              <div className="ai-bot__hand ai-bot__hand--right" ref={handRightRef} />
            </div>
          </div>
        </div>

        <div className="ai-bot__thinking" ref={thinkingRef}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default AiBotAvatar;
