import type { SignupData, StepId } from "./types";

export type Errors = Partial<Record<keyof SignupData, string>>;

// Pragmatic RFC-lite email check.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MIN_AGE = 18;
export const MAX_AGE = 100;

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "Enter your email to continue.";
  if (v.length > 254) return "That email is too long.";
  if (!EMAIL_RE.test(v)) return "That doesn't look like a valid email.";
  return null;
}

export function validateName(value: string): string | null {
  const v = value.trim();
  if (!v) return "We'd love to know your name.";
  if (v.length < 2) return "Name must be at least 2 characters.";
  if (v.length > 40) return "Keep it under 40 characters.";
  if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(v))
    return "Use letters, spaces, hyphens or apostrophes only.";
  return null;
}

export function validateAge(value: string): string | null {
  if (!value.trim()) return "Enter your age.";
  const n = Number(value);
  if (!Number.isInteger(n)) return "Enter a valid age.";
  if (n < MIN_AGE) return `You must be ${MIN_AGE} or older to join NUB.`;
  if (n > MAX_AGE) return "Please enter a realistic age.";
  return null;
}

export function validatePronoun(data: SignupData): string | null {
  if (!data.pronoun) return "Pick how you'd like to be addressed.";
  if (data.pronoun === "prefer to self-describe" && !data.customPronoun.trim())
    return "Tell us your pronouns.";
  return null;
}

export function validateState(value: string): string | null {
  return value ? null : "Choose your state.";
}
export function validateCity(value: string): string | null {
  return value ? null : "Choose your city.";
}
export function validateCollege(value: string): string | null {
  return value ? null : "Choose your campus.";
}

export function validatePhone(value: string): string | null {
  if (!value.trim()) return "Enter your phone number.";
  if (value.length !== 10) return "Enter a 10-digit mobile number.";
  if (!/^[6-9]/.test(value)) return "Enter a valid Indian mobile number.";
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Create a password.";
  if (value.length < 8) return "At least 8 characters.";
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value))
    return "Mix letters and numbers.";
  if (/^\s|\s$/.test(value)) return "No leading or trailing spaces.";
  return null;
}

export function validateConfirm(data: SignupData): string | null {
  if (!data.confirmPassword) return "Re-enter your password.";
  if (data.confirmPassword !== data.password) return "Passwords don't match.";
  return null;
}

/** Validate every field owned by a given step. Returns a field→message map. */
export function validateStep(step: StepId, data: SignupData): Errors {
  const e: Errors = {};
  const set = (k: keyof SignupData, msg: string | null) => {
    if (msg) e[k] = msg;
  };
  switch (step) {
    case "email":
      set("email", validateEmail(data.email));
      break;
    case "about":
      set("fullName", validateName(data.fullName));
      set("age", validateAge(data.age));
      set("pronoun", validatePronoun(data));
      break;
    case "study":
      set("state", validateState(data.state));
      set("city", validateCity(data.city));
      set("college", validateCollege(data.college));
      break;
    case "secure":
      set("phone", validatePhone(data.phone));
      set("password", validatePassword(data.password));
      set("confirmPassword", validateConfirm(data));
      break;
  }
  return e;
}

export function hasErrors(e: Errors): boolean {
  return Object.keys(e).length > 0;
}
