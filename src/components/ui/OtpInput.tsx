import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

interface Props {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  invalid,
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = value.split("").concat(Array(length).fill("")).slice(0, length);

  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleInput = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "");
    if (!d) return;
    const arr = chars.slice();
    // Support fast typing / multi-char: spill across the following boxes.
    let idx = i;
    for (const ch of d) {
      if (idx >= length) break;
      arr[idx] = ch;
      idx++;
    }
    commit(arr.join("").slice(0, length));
    focus(idx);
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = chars.slice();
      if (arr[i]) {
        arr[i] = "";
        commit(arr.join(""));
      } else if (i > 0) {
        arr[i - 1] = "";
        commit(arr.join(""));
        focus(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      focus(i - 1);
    } else if (e.key === "ArrowRight") {
      focus(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const d = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!d) return;
    commit(d);
    focus(d.length);
  };

  return (
    <div
      className={`otp ${invalid ? "otp--invalid" : ""}`}
      role="group"
      aria-label="One-time passcode"
    >
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="otp__cell"
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          value={c}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid || undefined}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
