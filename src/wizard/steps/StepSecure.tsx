import { useState } from "react";
import { Eye, EyeOff, Lock, PartyPopper, Phone } from "lucide-react";
import { StepShell } from "../StepShell";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { useWizard } from "../WizardContext";
import { useToast } from "../../components/Toast";
import { digitsOnly, passwordStrength } from "../../lib/format";
import {
  validateConfirm,
  validatePassword,
  validatePhone,
  validateStep,
  hasErrors,
} from "../../lib/validation";

export function StepSecure({ onFinish }: { onFinish: () => void }) {
  const wiz = useWizard();
  const toast = useToast();
  const d = wiz.data;

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const t = (k: string) => touched[k];

  const phoneErr = t("phone") ? validatePhone(d.phone) : null;
  const pwErr = t("password") ? validatePassword(d.password) : null;
  const confirmErr = t("confirmPassword") ? validateConfirm(d) : null;
  const strength = passwordStrength(d.password);

  const submit = async () => {
    setTouched({ phone: true, password: true, confirmPassword: true });
    const errs = validateStep("secure", d);
    if (hasErrors(errs)) {
      toast.error("Fix the highlighted fields to finish up.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1700)); // simulate account creation

    // Simulated server failure path for the demo.
    if (d.email.trim().toLowerCase().startsWith("fail")) {
      setSubmitting(false);
      toast.error(
        "Couldn't create your account",
        "Something went wrong on our end. Please try again.",
      );
      return;
    }
    setSubmitting(false);
    onFinish();
  };

  return (
    <StepShell
      title="Secure your account"
      subtitle="Last step — lock it down and you're in."
      footer={
        <Button
          block
          loading={submitting}
          leftIcon={!submitting && <PartyPopper size={18} strokeWidth={2.4} />}
          onClick={submit}
        >
          {submitting ? "Creating your account…" : "Create account"}
        </Button>
      }
    >
      <Field
        label="Mobile number"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="98765 43210"
        maxLength={10}
        leftIcon={
          <span className="phone-prefix">
            <Phone size={16} strokeWidth={2.2} /> +91
          </span>
        }
        className="field--phone"
        value={d.phone}
        error={phoneErr}
        valid={t("phone") && !validatePhone(d.phone)}
        onChange={(e) => wiz.set({ phone: digitsOnly(e.target.value, 10) })}
        onBlur={() => setTouched((s) => ({ ...s, phone: true }))}
      />

      <div>
        <Field
          label="Password"
          type={showPw ? "text" : "password"}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          maxLength={64}
          leftIcon={<Lock size={18} strokeWidth={2.2} />}
          value={d.password}
          error={pwErr}
          adornment={
            <button
              type="button"
              className="field__toggle"
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw((v) => !v)}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          onChange={(e) => wiz.set({ password: e.target.value })}
          onBlur={() => setTouched((s) => ({ ...s, password: true }))}
        />
        {d.password && (
          <div
            className={`strength strength--${strength.score}`}
            aria-hidden="true"
          >
            <div className="strength__bars">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={i < strength.score ? "on" : ""} />
              ))}
            </div>
            <span className="strength__label">{strength.label}</span>
          </div>
        )}
      </div>

      <Field
        label="Confirm password"
        type={showConfirm ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Re-enter your password"
        maxLength={64}
        leftIcon={<Lock size={18} strokeWidth={2.2} />}
        value={d.confirmPassword}
        error={confirmErr}
        valid={
          t("confirmPassword") &&
          !validateConfirm(d) &&
          d.confirmPassword.length > 0
        }
        adornment={
          <button
            type="button"
            className="field__toggle"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            onClick={() => setShowConfirm((v) => !v)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        onChange={(e) => wiz.set({ confirmPassword: e.target.value })}
        onBlur={() => setTouched((s) => ({ ...s, confirmPassword: true }))}
      />

      <p className="demo-chip">
        <span>Demo</span> start your email with <strong>fail</strong> (e.g.
        fail@nub.app) to see the submission-failure alert.
      </p>
    </StepShell>
  );
}
