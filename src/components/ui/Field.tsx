import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check } from "lucide-react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string | null;
  hint?: string;
  leftIcon?: ReactNode;
  adornment?: ReactNode; // right-side control, e.g. password toggle
  valid?: boolean; // show success tick
  counter?: number; // show N/max counter when maxLength set
}

export const Field = forwardRef<HTMLInputElement, Props>(function Field(
  {
    label,
    error,
    hint,
    leftIcon,
    adornment,
    valid,
    counter,
    maxLength,
    className = "",
    id,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errId = `${fieldId}-err`;
  const hintId = `${fieldId}-hint`;
  const invalid = Boolean(error);

  return (
    <div className={`field ${invalid ? "field--error" : ""} ${className}`}>
      <label className="field__label" htmlFor={fieldId}>
        {label}
      </label>
      <div
        className={`field__box ${leftIcon ? "has-left" : ""} ${
          adornment || valid ? "has-right" : ""
        }`}
      >
        {leftIcon && <span className="field__left">{leftIcon}</span>}
        <input
          ref={ref}
          id={fieldId}
          className="field__input"
          maxLength={maxLength}
          aria-invalid={invalid || undefined}
          aria-describedby={
            [error ? errId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          {...rest}
        />
        {(adornment || (valid && !invalid)) && (
          <span className="field__right">
            {valid && !invalid ? (
              <span className="field__tick" aria-hidden="true">
                <Check size={16} strokeWidth={3} />
              </span>
            ) : (
              adornment
            )}
          </span>
        )}
      </div>

      <div className="field__foot">
        <div className="field__msg">
          <AnimatePresence mode="wait" initial={false}>
            {error ? (
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
            ) : hint ? (
              <motion.p
                key="hint"
                id={hintId}
                className="field__hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {hint}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
        {typeof counter === "number" && maxLength ? (
          <span className="field__counter">
            {counter}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
});
