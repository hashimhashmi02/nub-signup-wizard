export type Stage = "landing" | "terms" | "wizard" | "success";

export type Pronoun =
  | "she/her"
  | "he/him"
  | "they/them"
  | "prefer to self-describe"
  | "prefer not to say";

export interface SignupData {
  email: string;
  emailVerified: boolean;
  fullName: string;
  age: string; // kept as string of digits, validated to number
  pronoun: Pronoun | "";
  customPronoun: string;
  state: string;
  city: string;
  college: string;
  phone: string; // digits only
  password: string;
  confirmPassword: string;
}

export const emptySignup: SignupData = {
  email: "",
  emailVerified: false,
  fullName: "",
  age: "",
  pronoun: "",
  customPronoun: "",
  state: "",
  city: "",
  college: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

/** The four disclosed steps after entry. Step 1 hosts the email + OTP gate. */
export const STEPS = [
  { id: "email", label: "Account" },
  { id: "about", label: "About you" },
  { id: "study", label: "Campus" },
  { id: "secure", label: "Secure it" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];
