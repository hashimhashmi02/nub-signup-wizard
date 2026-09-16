import { useId, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronDown } from "lucide-react";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string | null;
  disabled?: boolean;
  disabledHint?: string; // shown as placeholder-ish helper when disabled
  leftIcon?: ReactNode;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
  disabledHint,
  leftIcon,
}: Props) {
  const id = useId();
  const errId = `${id}-err`;
  const invalid = Boolean(error);

  return (
    <div className={`field ${invalid ? "field--error" : ""}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div
        className={`field__box select__box ${leftIcon ? "has-left" : ""} ${
          disabled ? "is-disabled" : ""
        }`}
      >
        {leftIcon && <span className="field__left">{leftIcon}</span>}
        <select
          id={id}
          className={`field__input select__input ${value ? "" : "is-placeholder"}`}
          value={value}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? errId : undefined}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            {disabled && disabledHint ? disabledHint : placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span className="select__chevron" aria-hidden="true">
          <ChevronDown size={18} strokeWidth={2.4} />
        </span>
      </div>
      <div className="field__foot">
        <div className="field__msg">
          <AnimatePresence mode="wait" initial={false}>
            {error && (
              <motion.p
                key="err"
                id={errId}
                className="field__error"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <AlertCircle size={13} strokeWidth={2.6} />
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
