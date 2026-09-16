import { ArrowRight, Building2, GraduationCap, MapPin } from "lucide-react";
import { useState } from "react";
import { StepShell } from "../StepShell";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { useWizard } from "../WizardContext";
import { useToast } from "../../components/Toast";
import {
  STATE_NAMES,
  citiesForState,
  collegesForCity,
} from "../../lib/data";
import { validateStep, hasErrors } from "../../lib/validation";

export function StepStudy({ onFinish: _onFinish }: { onFinish: () => void }) {
  void _onFinish;
  const wiz = useWizard();
  const toast = useToast();
  const d = wiz.data;
  const [showErr, setShowErr] = useState(false);

  const cities = d.state ? citiesForState(d.state) : [];
  const colleges = d.state && d.city ? collegesForCity(d.state, d.city) : [];

  const errs = validateStep("study", d);

  const submit = () => {
    setShowErr(true);
    if (hasErrors(errs)) {
      toast.error("Pick your state, city and campus to continue.");
      return;
    }
    wiz.next();
  };

  return (
    <StepShell
      title="Where do you study?"
      subtitle="We'll connect you with people on your campus first."
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
      <Select
        label="State / region"
        placeholder="Select your state"
        leftIcon={<MapPin size={18} strokeWidth={2.2} />}
        options={STATE_NAMES}
        value={d.state}
        error={showErr ? errs.state : null}
        onChange={(v) =>
          // Cascade: changing state clears the dependent city + college.
          wiz.set({ state: v, city: "", college: "" })
        }
      />

      <Select
        label="City"
        placeholder="Select your city"
        leftIcon={<Building2 size={18} strokeWidth={2.2} />}
        options={cities}
        value={d.city}
        disabled={!d.state}
        disabledHint="Choose a state first"
        error={showErr ? errs.city : null}
        onChange={(v) => wiz.set({ city: v, college: "" })}
      />

      <Select
        label="Campus / college"
        placeholder="Select your campus"
        leftIcon={<GraduationCap size={18} strokeWidth={2.2} />}
        options={colleges}
        value={d.college}
        disabled={!d.city}
        disabledHint={!d.state ? "Choose a state first" : "Choose a city first"}
        error={showErr ? errs.college : null}
        onChange={(v) => wiz.set({ college: v })}
      />

      {d.state && d.city && colleges.length === 0 && (
        <p className="field__hint">
          No campuses listed here yet — we're adding more every week.
        </p>
      )}
    </StepShell>
  );
}
