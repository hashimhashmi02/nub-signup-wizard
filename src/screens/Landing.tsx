import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";
import { BrandMark } from "../components/BrandMark";
import { Button } from "../components/ui/Button";
import { AvatarPack, ConfettiSprinkle } from "./AvatarPack";
import { LoginSheet } from "./LoginSheet";

// Demo content — swap for a real events feed.
const TONIGHT = [
  { name: "Freshers' Night · Hostel B", going: 128, color: "var(--pink-500)" },
  { name: "Open Mic · Amphitheatre", going: 41, color: "var(--lime-400)" },
  { name: "Retro Disco · Union Hall", going: 236, color: "var(--cyan-400)" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Landing({ onCreate }: { onCreate: () => void }) {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <motion.div
      className="landing"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <ConfettiSprinkle />

      <motion.div className="landing__brandrow" variants={rise}>
        <BrandMark size={26} />
        <span className="landing__tag">campus community</span>
      </motion.div>

      <motion.div className="landing__hero" variants={rise}>
        <AvatarPack />
      </motion.div>

      <motion.h1 className="landing__title" variants={rise}>
        Find your <span className="u-mark">pack</span>.
      </motion.h1>
      <motion.p className="landing__lede" variants={rise}>
        Meet the people on your campus who get it. Study buddies, hostel mates,
        gig partners, and everyone in between.
      </motion.p>

      <motion.ul className="landing__feats" variants={rise}>
        <li>
          <Users size={16} strokeWidth={2.4} /> Real students, verified
        </li>
        <li>
          <ShieldCheck size={16} strokeWidth={2.4} /> Private by default
        </li>
        <li>
          <Sparkles size={16} strokeWidth={2.4} /> Match by campus
        </li>
      </motion.ul>

      <motion.div className="tonight" variants={rise}>
        <div className="tonight__head">
          <span className="tonight__live" aria-hidden="true" />
          Tonight on campus
        </div>
        <ul className="tonight__list">
          {TONIGHT.map((e) => (
            <li key={e.name}>
              <span className="tonight__dot" style={{ background: e.color }} />
              <span className="tonight__name">{e.name}</span>
              <span className="tonight__meta">{e.going} going</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div className="landing__cta" variants={rise}>
        <Button
          block
          size="lg"
          rightIcon={<ArrowRight size={18} strokeWidth={2.6} />}
          onClick={onCreate}
        >
          Create your account
        </Button>
        <button
          type="button"
          className="landing__login"
          onClick={() => setLoginOpen(true)}
        >
          I already have an account · <strong>Log in</strong>
        </button>
      </motion.div>

      <motion.p className="landing__legal" variants={rise}>
        By continuing you agree to our Terms and Privacy Policy.
      </motion.p>

      <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </motion.div>
  );
}
