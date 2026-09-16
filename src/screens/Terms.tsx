import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/Toast";

const SECTIONS = [
  {
    h: "1. Who can join",
    p: "NUB is for students aged 18 and over. You agree to provide accurate information about yourself and your campus, and to keep your account details secure.",
  },
  {
    h: "2. Be good to your pack",
    p: "Harassment, hate speech, impersonation, and spam have no place here. Treat every member with respect. We remove content and accounts that break our Community Guidelines.",
  },
  {
    h: "3. Your privacy",
    p: "You control who sees your profile. We never sell your personal data. Verification details are used only to confirm you're a real student, then minimised.",
  },
  {
    h: "4. Your content",
    p: "You own what you post. By posting, you grant NUB a limited licence to display it within the app so your pack can see it. You can delete your content at any time.",
  },
  {
    h: "5. Ending things",
    p: "You can deactivate your account whenever you like. We may suspend accounts that repeatedly violate these terms. These terms are governed by applicable local law.",
  },
];

interface Props {
  onBack: () => void;
  onAccept: () => void;
}

export function Terms({ onBack, onAccept }: Props) {
  const toast = useToast();
  const [agreed, setAgreed] = useState(false);
  const [readEnd, setReadEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setReadEnd(true);
  };

  const proceed = () => {
    if (!agreed) {
      toast.info("Please accept the terms to continue.");
      return;
    }
    onAccept();
  };

  return (
    <motion.div
      className="terms"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="terms__bar">
        <button
          type="button"
          className="iconbtn"
          aria-label="Back"
          onClick={onBack}
        >
          <ArrowLeft size={20} strokeWidth={2.4} />
        </button>
        <span className="terms__eyebrow">Community agreement</span>
        <span className="iconbtn iconbtn--ghost" aria-hidden="true" />
      </div>

      <h2 className="terms__title">Before you join</h2>
      <p className="terms__sub">
        A quick read so everyone's pack stays safe and welcoming.
      </p>

      <div className="terms__scroll" ref={scrollRef} onScroll={onScroll}>
        {SECTIONS.map((s) => (
          <section key={s.h} className="terms__section">
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </section>
        ))}
        <div className={`terms__readmark ${readEnd ? "is-read" : ""}`}>
          {readEnd ? "You've reached the end — thanks for reading." : "Scroll to read the full agreement"}
        </div>
      </div>

      <label className={`checkbox ${agreed ? "is-checked" : ""}`}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span className="checkbox__box" aria-hidden="true">
          <Check size={14} strokeWidth={3.4} />
        </span>
        <span className="checkbox__text">
          I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>,{" "}
          <a href="#guidelines" onClick={(e) => e.preventDefault()}>Community Guidelines</a>{" "}
          and <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
        </span>
      </label>

      <Button
        block
        disabled={!agreed}
        rightIcon={<ArrowRight size={18} strokeWidth={2.6} />}
        onClick={proceed}
      >
        Agree & continue
      </Button>
    </motion.div>
  );
}
