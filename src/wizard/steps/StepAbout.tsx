import { useState } from "react";
import { ArrowRight, User } from "lucide-react";
import { StepShell } from "../StepShell";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Select } from "../../components/ui/Select";
import { useWizard } from "../WizardContext";
import { useToast } from "../../components/Toast";
import { PRONOUN_OPTIONS } from "../../lib/data";
import { digitsOnly, tidyWhitespace } from "../../lib/format";
import {
  validateAge,
  validateName,
  validatePronoun,
  validateStep,
  hasErrors,
} from "../../lib/validation";
import type { Pronoun } from "../../lib/types";

export function StepAbout({ onFinish: _onFinish }: { onFinish: () => void }) {
  void _onFinish;
  const wiz = useWizard();
  const toast = useToast();
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const t = (k: string) => touched[k];

  const d = wiz.data;
  const nameErr = t("fullName") ? validateName(d.fullName) : null;
  const ageErr = t("age") ? validateAge(d.age) : null;
  const pronErr = t("pronoun") ? validatePronoun(d) : null;
  const customErr =
    t("pronoun") && d.pronoun === "prefer to self-describe" && !d.customPronoun.trim()
      ? "Tell us your pronouns."
      : null;

  const submit = () => {
    setTouched({ fullName: true, age: true, pronoun: true });
    const errs = validateStep("about", d);
    if (hasErrors(errs)) {
      toast.error("Almost — a couple of fields need attention.");
      return;
    }
    wiz.set({ fullName: d.fullName.trim() });
    wiz.next();
  };

  return (
    <StepShell
      title="Tell us about you"
      subtitle="This is how you'll show up to your pack."
      footer={
        <Button
          block
          rightIcon={<ArrowRight size={18} strokeWidth={2.6} />}
          onClick={submit}
        >
          Continue
        </Button>
      }
    >
      <Field
        label="Full name"
        placeholder="e.g. Aarav Sharma"
        autoComplete="name"
        maxLength={40}
        counter={d.fullName.length}
        leftIcon={<User size={18} strokeWidth={2.2} />}
        value={d.fullName}
        error={nameErr}
        valid={t("fullName") && !validateName(d.fullName)}
        onChange={(e) => wiz.set({ fullName: e.target.value })}
        onBlur={(e) => {
          wiz.set({ fullName: tidyWhitespace(e.target.value).trim() });
          setTouched((s) => ({ ...s, fullName: true }));
        }}
      />

      <Field
        label="Age"
        inputMode="numeric"
        placeholder="18"
        maxLength={3}
        value={d.age}
        error={ageErr}
        hint={ageErr ? undefined : "You must be 18 or older to join."}
        valid={t("age") && !validateAge(d.age)}
        onChange={(e) => wiz.set({ age: digitsOnly(e.target.value, 3) })}
        onBlur={() => setTouched((s) => ({ ...s, age: true }))}
      />

      <Select
        label="Pronouns"
        placeholder="Select your pronouns"
        options={[...PRONOUN_OPTIONS]}
        value={d.pronoun}
        error={pronErr}
        onChange={(v) => {
          wiz.set({ pronoun: v as Pronoun });
          setTouched((s) => ({ ...s, pronoun: true }));
        }}
      />

      {d.pronoun === "prefer to self-describe" && (
        <Field
          label="Your pronouns"
          placeholder="e.g. ze/zir"
          maxLength={24}
          value={d.customPronoun}
          error={customErr}
          onChange={(e) => wiz.set({ customPronoun: e.target.value })}
          onBlur={() => setTouched((s) => ({ ...s, pronoun: true }))}
        />
      )}
    </StepShell>
  );
}
