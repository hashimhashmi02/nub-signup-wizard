# NUB — Signup Wizard

A responsive, party-themed replication of a mobile app's **landing → terms → 4-step signup** flow, built as a web application.

Frontend only. Every "server" interaction (sending a code, verifying it, creating the account) is simulated with realistic latency, loading states, and failure paths.

![Stack](https://img.shields.io/badge/React-19-black) ![Stack](https://img.shields.io/badge/TypeScript-strict-black) ![Stack](https://img.shields.io/badge/Vite-8-black)

---

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173.

Other scripts:

```bash
npm run build
```

```bash
npm run preview
```

---

## Demo shortcuts

The UI surfaces these inline, so nothing is hidden during a walkthrough.

| To see this | Do this |
| --- | --- |
| Successful email verification | Use OTP **`123456`** |
| Wrong-code error (shake, red cells, toast) | Enter any other 6 digits |
| "Email already registered" error | Sign up with **`taken@nub.app`** |
| Final submission failure | Use an email starting with **`fail`** (e.g. `fail@nub.app`) |
| Under-18 block | Enter an age below 18 on step 2 |

---

## The flow

1. **Landing** — brand, value proposition, live "Tonight on campus" strip, primary CTA plus a login path.
2. **Login sheet** — an alternate entry point (bottom sheet) with its own validation and loading state.
3. **Terms** — scrollable community agreement, read-progress marker, explicit consent checkbox gating the CTA.
4. **Step 1 · Account** — email entry, then a dedicated OTP verification screen.
5. **Step 2 · About you** — name, age, pronouns (with self-describe support).
6. **Step 3 · Campus** — cascading State → City → College selection.
7. **Step 4 · Secure it** — phone, password with live strength meter, confirmation.
8. **Success** — confetti, membership summary, re-entry into the app.

Progressive disclosure is enforced: profile steps only unlock **after** the email is verified.

---

## What's implemented

**Validation & logic**
- Real-time validation on change, with errors surfaced on blur and on submit.
- Contextual messages beneath each field **and** global toasts for failed submissions.
- Numeric-only inputs for age and phone; character limits with a live counter on name.
- Whitespace-only submissions blocked; names are tidied on blur.
- Cross-field dependency: changing state clears city and college; changing city clears college. Dependent selects stay disabled with an explanatory placeholder.
- Password rules plus a 4-level strength meter and match confirmation.

**States & feedback**
- Button spinners during every simulated request; the button disables itself to prevent duplicate submissions.
- Success, error, and info toasts, anchored to the top so they never cover the primary CTA.
- Explicit failure paths for "already registered", "wrong OTP", and "couldn't create your account".
- Backward navigation preserves everything already entered; completed steps in the progress rail are clickable.

**Accessibility**
- Labelled inputs, `aria-invalid`, `aria-describedby`, `role="alert"` on errors, `aria-busy` on pending buttons.
- Full keyboard support, including OTP arrow-key navigation, backspace behaviour, and paste.
- Visible focus rings on every interactive element; `prefers-reduced-motion` respected.

**Responsive**
- Below 540px the app is edge-to-edge and full-height, with safe-area insets.
- Above that it presents as a device on an ambient stage, so desktop and tablet get a composed view rather than a stretched form.

---

## Improvements over a direct replication

- **Under-18 is handled explicitly** rather than silently accepted — the field states the rule up front and blocks with a clear message.
- **The OTP screen was redesigned** into a dedicated step with six auto-advancing cells, paste support, a masked email confirmation, a resend cooldown, and a shake-plus-clear on failure.
- **Toasts moved to the top** so they never obscure the primary action.
- **Consent is explicit** — the terms CTA stays disabled until the box is ticked, with a read-progress marker.
- **Pronouns include a self-describe option** instead of a fixed list.
- **Dependent selects explain why they're disabled** ("Choose a state first") instead of appearing broken.

---

## Architecture

```
src/
  lib/           types, sample campus data, validation rules, formatters
  components/    Toast system, brand marks, progress rail
  components/ui/ Button, Field, Select, OtpInput, Spinner
  screens/       Landing, Terms, LoginSheet, Success, AvatarPack
  wizard/        WizardContext (reducer), Wizard host, StepShell, steps/
```

- **State** lives in a typed `useReducer` context (`WizardContext`) holding form data, the current step, and the navigation direction used to drive slide transitions.
- **Validation** is a standalone, dependency-free module — pure functions per field plus a `validateStep` aggregator — so rules are testable and independent of the UI.
- **Styling** is hand-written CSS driven by design tokens, with no UI framework.

---

## Design

Committed "neon night" party identity: a deep aubergine screen with a confetti palette (hot pink, violet, acid lime, sun, cyan), glow-based depth, drifting light beams behind the device, and confetti motifs carried from the landing screen through to the success state. Typography is **Poppins** throughout.

---

## Notes & assumptions

- The reference app could not be inspected directly, so the visual identity is an original interpretation of the described flow rather than a pixel copy.
- Campus data (states, cities, colleges) and the "Tonight on campus" events are sample content for demonstration; swap them for a real directory or API.
- No backend, no network calls, no data persistence — refreshing resets the flow.
