import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
}

interface ToastApi {
  push: (t: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastCtx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
} as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++seq.current;
      setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
      window.setTimeout(() => remove(id), t.kind === "error" ? 6000 : 4200);
    },
    [remove],
  );

  const api = useMemo<ToastApi>(
    () => ({
      push,
      success: (title, message) => push({ kind: "success", title, message }),
      error: (title, message) => push({ kind: "error", title, message }),
      info: (title, message) => push({ kind: "info", title, message }),
    }),
    [push],
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="toaster" role="region" aria-label="Notifications">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.kind];
            return (
              <motion.div
                key={t.id}
                className={`toast toast--${t.kind}`}
                role={t.kind === "error" ? "alert" : "status"}
                initial={{ opacity: 0, y: -18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="toast__icon">
                  <Icon size={18} strokeWidth={2.4} />
                </span>
                <div className="toast__body">
                  <p className="toast__title">{t.title}</p>
                  {t.message && <p className="toast__msg">{t.message}</p>}
                </div>
                <button
                  className="toast__close"
                  aria-label="Dismiss"
                  onClick={() => remove(t.id)}
                >
                  <X size={16} strokeWidth={2.4} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
