import { Check } from "lucide-react";
import { STEPS } from "../lib/types";

interface Props {
  step: number; // active index
  maxReached: number; // furthest step unlocked (for back-nav affordance)
  onJump?: (step: number) => void;
}

export function ProgressRail({ step, maxReached, onJump }: Props) {
  const pct = (step / (STEPS.length - 1)) * 100;
  return (
    <div className="rail">
      <div className="rail__track">
        <div
          className="rail__fill"
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        />
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          const reachable = i <= maxReached && i !== step;
          return (
            <button
              key={s.id}
              type="button"
              className={`rail__node ${done ? "is-done" : ""} ${
                active ? "is-active" : ""
              }`}
              disabled={!reachable}
              aria-current={active ? "step" : undefined}
              aria-label={`Step ${i + 1}: ${s.label}${done ? " (completed)" : ""}`}
              onClick={() => reachable && onJump?.(i)}
            >
              <span className="rail__dot">
                {done ? <Check size={13} strokeWidth={3.2} /> : i + 1}
              </span>
              <span className="rail__label">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
