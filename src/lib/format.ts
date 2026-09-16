/** Keep only digits, cap to `max` characters. Used for age & phone inputs. */
export function digitsOnly(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max);
}

/** Collapse internal runs of whitespace and trim ends (used on blur for names). */
export function tidyWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trimStart();
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const shown = name.slice(0, Math.min(2, name.length));
  return `${shown}${"•".repeat(Math.max(1, name.length - shown.length))}@${domain}`;
}

/** 0–4 crude password strength score with a label. */
export function passwordStrength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12 && score >= 3) score = 4;
  const labels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
  return { score, label: labels[Math.min(score, 4)] };
}
