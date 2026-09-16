import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

export function StepShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="step">
      <header className="step__head">
        <h2 className="step__title">{title}</h2>
        {subtitle && <p className="step__subtitle">{subtitle}</p>}
      </header>
      <div className="step__fields">{children}</div>
      <footer className="step__footer">{footer}</footer>
    </div>
  );
}
