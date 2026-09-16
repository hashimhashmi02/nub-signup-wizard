import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { emptySignup, STEPS, type SignupData } from "../lib/types";

interface State {
  data: SignupData;
  step: number; // 0..STEPS.length-1
  direction: 1 | -1; // for slide transitions
}

type Action =
  | { type: "SET"; patch: Partial<SignupData> }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "GOTO"; step: number }
  | { type: "RESET" };

const initial: State = { data: emptySignup, step: 0, direction: 1 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET":
      return { ...state, data: { ...state.data, ...action.patch } };
    case "NEXT":
      return {
        ...state,
        step: Math.min(STEPS.length - 1, state.step + 1),
        direction: 1,
      };
    case "BACK":
      return { ...state, step: Math.max(0, state.step - 1), direction: -1 };
    case "GOTO":
      return {
        ...state,
        direction: action.step > state.step ? 1 : -1,
        step: action.step,
      };
    case "RESET":
      return initial;
  }
}

interface WizardApi extends State {
  set: (patch: Partial<SignupData>) => void;
  setField: <K extends keyof SignupData>(key: K, value: SignupData[K]) => void;
  next: () => void;
  back: () => void;
  goto: (step: number) => void;
  reset: () => void;
}

const Ctx = createContext<WizardApi | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const set = useCallback(
    (patch: Partial<SignupData>) => dispatch({ type: "SET", patch }),
    [],
  );
  const setField = useCallback(
    <K extends keyof SignupData>(key: K, value: SignupData[K]) =>
      dispatch({ type: "SET", patch: { [key]: value } as Partial<SignupData> }),
    [],
  );

  const api = useMemo<WizardApi>(
    () => ({
      ...state,
      set,
      setField,
      next: () => dispatch({ type: "NEXT" }),
      back: () => dispatch({ type: "BACK" }),
      goto: (step) => dispatch({ type: "GOTO", step }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [state, set, setField],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useWizard(): WizardApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWizard must be used within <WizardProvider>");
  return ctx;
}
