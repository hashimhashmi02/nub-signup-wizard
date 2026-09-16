import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MailCheck, RefreshCw } from "lucide-react";
import { StepShell } from "../StepShell";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { OtpInput } from "../../components/ui/OtpInput";
import { useWizard } from "../WizardContext";
import { useToast } from "../../components/Toast";
import { validateEmail } from "../../lib/validation";
import { maskEmail } from "../../lib/format";

const DEMO_OTP = "123456";
const RESEND_SECONDS = 30;
// Emails that trigger a simulated "already registered" server response.
const TAKEN = ["taken@nub.app", "existing@nub.app"];

export function StepEmail({ onFinish: _onFinish }: { onFinish: () => void }) {
  void _onFinish;
  const wiz = useWizard();
  const toast = useToast();

  const [mode, setMode] = useState<"enter" | "verify">("enter");
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const emailError = touched ? validateEmail(wiz.data.email) : null;
  const emailValid = !validateEmail(wiz.data.email);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearInterval(t);
  }, [cooldown]);

  const startVerify = async () => {
    setTouched(true);
    const err = validateEmail(wiz.data.email);
    if (err) return;
    if (TAKEN.includes(wiz.data.email.trim().toLowerCase())) {
      toast.error(
        "That email is already registered",
        "Try signing in, or use a different address.",
      );
      return;
    }
    setSending(true);
    await wait(1200); // simulate sending the code
    setSending(false);
    setMode("verify");
    setOtp("");
    setOtpError(null);
    setCooldown(RESEND_SECONDS);
    toast.success("Code sent", `We emailed a 6-digit code to ${wiz.data.email}.`);
  };

  const verify = async (code: string) => {
    setVerifying(true);
    await wait(900);
    setVerifying(false);
    if (code === DEMO_OTP) {
      wiz.set({ emailVerified: true });
      toast.success("Email verified", "Nice — let's set up your profile.");
      wiz.next();
    } else {
      setOtpError("That code isn't right. Check your email and try again.");
      setOtp("");
      toast.error("Incorrect code", "Double-check the 6 digits and retry.");
    }
  };

  const resend = () => {
    if (cooldown > 0) return;
    setCooldown(RESEND_SECONDS);
    setOtp("");
    setOtpError(null);
    toast.info("New code sent", "We've sent a fresh code to your inbox.");
  };

  if (mode === "enter") {
    return (
      <StepShell
        title="What's your email?"
        subtitle="We'll send a code to verify it's really you. No spam, ever."
        footer={
          <Button
            block
            loading={sending}
            rightIcon={!sending && <ArrowRight size={18} strokeWidth={2.6} />}
            onClick={startVerify}
          >
            {sending ? "Sending code…" : "Send verification code"}
          </Button>
        }
      >
        <Field
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@campus.edu"
          maxLength={254}
          leftIcon={<Mail size={18} strokeWidth={2.2} />}
          value={wiz.data.email}
          error={emailError}
          valid={touched && emailValid}
          onChange={(e) => wiz.set({ email: e.target.value })}
          onBlur={() => setTouched(true)}
          onKeyDown={(e) => e.key === "Enter" && startVerify()}
        />
        <p className="demo-chip">
          <span>Demo</span> code on the next screen is{" "}
          <strong>{DEMO_OTP}</strong>. Use <strong>taken@nub.app</strong> to see
          the “already registered” error.
        </p>
      </StepShell>
    );
  }

  return (
    <StepShell
      title="Check your inbox"
      subtitle={
        <>
          We sent a 6-digit code to <strong>{maskEmail(wiz.data.email)}</strong>.
          Enter it below.
        </>
      }
      footer={
        <div className="stack-8">
          <Button
            block
            loading={verifying}
            disabled={otp.length !== 6}
            leftIcon={
              !verifying && <MailCheck size={18} strokeWidth={2.4} />
            }
            onClick={() => verify(otp)}
          >
            {verifying ? "Verifying…" : "Verify & continue"}
          </Button>
          <button
            type="button"
            className="linkbtn"
            onClick={() => {
              setMode("enter");
              setOtp("");
              setOtpError(null);
            }}
          >
            Wrong email? Change it
          </button>
        </div>
      }
    >
      <motion.div
        animate={otpError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <OtpInput
          value={otp}
          onChange={(v) => {
            setOtp(v);
            if (otpError) setOtpError(null);
          }}
          onComplete={verify}
          invalid={Boolean(otpError)}
          disabled={verifying}
        />
      </motion.div>
      {otpError && (
        <p className="otp__error" role="alert">
          {otpError}
        </p>
      )}
      <div className="resend">
        {cooldown > 0 ? (
          <span className="resend__wait">
            Resend code in <strong>{cooldown}s</strong>
          </span>
        ) : (
          <button type="button" className="resend__btn" onClick={resend}>
            <RefreshCw size={14} strokeWidth={2.6} />
            Resend code
          </button>
        )}
      </div>
    </StepShell>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
