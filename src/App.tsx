import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastProvider } from "./components/Toast";
import { WizardProvider, useWizard } from "./wizard/WizardContext";
import { Landing } from "./screens/Landing";
import { Terms } from "./screens/Terms";
import { Success } from "./screens/Success";
import { Wizard } from "./wizard/Wizard";
import { BrandGlyph } from "./components/BrandMark";
import type { Stage } from "./lib/types";
import "./App.css";

function StatusBar() {
  return (
    <div className="statusbar" aria-hidden="true">
      <span className="statusbar__time">9:41</span>
      <span className="statusbar__brand">
        <BrandGlyph size={18} />
      </span>
      <span className="statusbar__icons">
        <span className="sig" />
        <span className="wifi" />
        <span className="batt" />
      </span>
    </div>
  );
}

function Flow() {
  const [stage, setStage] = useState<Stage>("landing");
  const wiz = useWizard();

  const restart = () => {
    wiz.reset();
    setStage("landing");
  };

  return (
    <div className="stage">
      <div className="ambient" aria-hidden="true">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <span className="blob blob--3" />
        <span className="grain" />
      </div>

      <div className="device">
        <StatusBar />
        <div className="device__screen">
          <AnimatePresence mode="wait">
            {stage === "landing" && (
              <motion.div key="landing" className="fill" {...fade}>
                <Landing onCreate={() => setStage("terms")} />
              </motion.div>
            )}
            {stage === "terms" && (
              <motion.div key="terms" className="fill" {...fade}>
                <Terms
                  onBack={() => setStage("landing")}
                  onAccept={() => setStage("wizard")}
                />
              </motion.div>
            )}
            {stage === "wizard" && (
              <motion.div key="wizard" className="fill" {...fade}>
                <Wizard
                  onExit={() => setStage("terms")}
                  onFinish={() => setStage("success")}
                />
              </motion.div>
            )}
            {stage === "success" && (
              <motion.div key="success" className="fill" {...fade}>
                <Success onDone={restart} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="device__home" aria-hidden="true" />
      </div>
    </div>
  );
}

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.28 },
};

export default function App() {
  return (
    <ToastProvider>
      <WizardProvider>
        <Flow />
      </WizardProvider>
    </ToastProvider>
  );
}
