import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, LogIn, Mail, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { useToast } from "../components/Toast";
import { validateEmail } from "../lib/validation";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LoginSheet({ open, onClose }: Props) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const emailErr = touched ? validateEmail(email) : null;
  const pwErr = touched && !password ? "Enter your password." : null;

  const submit = async () => {
    setTouched(true);
    if (validateEmail(email) || !password) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1400));
    setBusy(false);
    toast.success("Welcome back!", "You're signed in to NUB.");
    onClose();
    setEmail("");
    setPassword("");
    setTouched(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sheet__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Log in"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet__grip" />
            <button
              type="button"
              className="iconbtn sheet__close"
              aria-label="Close"
              onClick={onClose}
            >
              <X size={20} strokeWidth={2.4} />
            </button>
            <h2 className="sheet__title">Welcome back</h2>
            <p className="sheet__sub">Log in to rejoin your pack.</p>

            <div className="sheet__form">
              <Field
                label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@campus.edu"
                leftIcon={<Mail size={18} strokeWidth={2.2} />}
                value={email}
                error={emailErr}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
              />
              <Field
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                leftIcon={<Lock size={18} strokeWidth={2.2} />}
                value={password}
                error={pwErr}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              <Button
                block
                loading={busy}
                leftIcon={!busy && <LogIn size={18} strokeWidth={2.4} />}
                onClick={submit}
              >
                {busy ? "Signing in…" : "Log in"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
