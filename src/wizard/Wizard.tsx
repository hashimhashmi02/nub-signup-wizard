import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useWizard } from "./WizardContext";
import { ProgressRail } from "../components/ProgressRail";
import { StepEmail } from "./steps/StepEmail";
import { StepAbout } from "./steps/StepAbout";
import { StepStudy } from "./steps/StepStudy";
import { StepSecure } from "./steps/StepSecure";

interface Props {
  onExit: () => void; // leave the wizard (back out of step 1)
  onFinish: () => void; // final submit succeeded
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export function Wizard({ onExit, onFinish }: Props) {
  const wiz = useWizard();
  const [maxReached, setMaxReached] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMaxReached((m) => Math.max(m, wiz.step));
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [wiz.step]);

  const handleBack = () => {
    if (wiz.step > 0) wiz.back();
    else onExit();
  };

  const steps = [StepEmail, StepAbout, StepStudy, StepSecure];
  const Current = steps[wiz.step];

  return (
    <div className="wizard">
      <div className="wizard__top">
        <div className="wizard__bar">
          <button
            type="button"
            className="iconbtn"
            aria-label={wiz.step > 0 ? "Previous step" : "Back to terms"}
            onClick={handleBack}
          >
            <ArrowLeft size={20} strokeWidth={2.4} />
          </button>
          <span className="wizard__count">
            Step {wiz.step + 1} <span>of 4</span>
          </span>
          <span className="iconbtn iconbtn--ghost" aria-hidden="true" />
        </div>
        <ProgressRail
          step={wiz.step}
          maxReached={maxReached}
          onJump={(i) => wiz.goto(i)}
        />
      </div>

      <div className="wizard__body" ref={scrollRef}>
        <AnimatePresence mode="wait" custom={wiz.direction} initial={false}>
          <motion.div
            key={wiz.step}
            custom={wiz.direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="wizard__pane"
          >
            <Current onFinish={onFinish} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
