import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  loading?: boolean;
  block?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "lg",
  loading = false,
  block = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${block ? "btn--block" : ""} ${
        loading ? "is-loading" : ""
      } ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span className="btn__spin">
          <Spinner size={size === "lg" ? 20 : 16} />
        </span>
      )}
      <span className="btn__content">
        {leftIcon && <span className="btn__icon">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="btn__icon">{rightIcon}</span>}
      </span>
    </button>
  );
}
