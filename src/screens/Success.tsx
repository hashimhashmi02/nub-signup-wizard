import { motion } from "framer-motion";
import { ArrowRight, Check, GraduationCap, MapPin, UserRound } from "lucide-react";
import { Button } from "../components/ui/Button";
import { BrandGlyph } from "../components/BrandMark";
import { useWizard } from "../wizard/WizardContext";

const CONFETTI = Array.from({ length: 18 }, (_, i) => i);
const COLORS = [
  "var(--violet-500)",
  "var(--pink-500)",
  "var(--sun-400)",
  "var(--cyan-400)",
  "var(--lime-400)",
];

export function Success({ onDone }: { onDone: () => void }) {
  const { data } = useWizard();
  const pronoun =
    data.pronoun === "prefer to self-describe" ? data.customPronoun : data.pronoun;

  return (
    <motion.div
      className="success"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="success__confetti" aria-hidden="true">
        {CONFETTI.map((i) => (
          <motion.span
            key={i}
            className="confetti"
            style={{
              left: `${(i * 53) % 100}%`,
              background: COLORS[i % COLORS.length],
              borderRadius: i % 3 === 0 ? "2px" : "999px",
            }}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{
              y: [-40, 420],
              opacity: [0, 1, 1, 0],
              rotate: (i % 2 ? 1 : -1) * 320,
            }}
            transition={{
              duration: 2.2 + (i % 5) * 0.25,
              delay: 0.1 + (i % 6) * 0.09,
              ease: "easeIn",
              repeat: Infinity,
              repeatDelay: 1.4,
            }}
          />
        ))}
      </div>

      <motion.div
        className="success__badge"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
      >
        <span className="success__tick">
          <Check size={40} strokeWidth={3.4} />
        </span>
      </motion.div>

      <motion.h1
        className="success__title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.45 }}
      >
        You're in{data.fullName ? `, ${data.fullName.split(" ")[0]}` : ""}!
      </motion.h1>
      <motion.p
        className="success__sub"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45 }}
      >
        Your profile is live. Your pack is waiting.
      </motion.p>

      <motion.div
        className="success__card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.45 }}
      >
        <div className="success__cardhead">
          <BrandGlyph size={30} />
          <span>Membership confirmed</span>
        </div>
        <dl className="summary">
          <div>
            <dt><UserRound size={15} strokeWidth={2.3} /> Name</dt>
            <dd>
              {data.fullName || "—"}
              {pronoun && <span className="summary__pron">{pronoun}</span>}
            </dd>
          </div>
          <div>
            <dt><GraduationCap size={15} strokeWidth={2.3} /> Campus</dt>
            <dd>{data.college || "—"}</dd>
          </div>
          <div>
            <dt><MapPin size={15} strokeWidth={2.3} /> Location</dt>
            <dd>{[data.city, data.state].filter(Boolean).join(", ") || "—"}</dd>
          </div>
        </dl>
      </motion.div>

      <motion.div
        className="success__cta"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44, duration: 0.45 }}
      >
        <Button
          block
          rightIcon={<ArrowRight size={18} strokeWidth={2.6} />}
          onClick={onDone}
        >
          Enter NUB
        </Button>
      </motion.div>
    </motion.div>
  );
}
