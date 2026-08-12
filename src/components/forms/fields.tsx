import type { ReactNode } from "react";
import type { FieldError } from "react-hook-form";

import { Label } from "@/components/ui/label";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string | undefined;
  error?: FieldError | undefined;
  hint?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string | undefined;
  children: ReactNode;
}) {
  return (
    <fieldset className="surface-card rounded-lg p-5 md:p-6">
      <legend className="sr-only">{title}</legend>
      <h3 className="font-display text-lg font-bold uppercase">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function ConsentError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return <span className="mt-1 block text-xs font-medium text-destructive">{message}</span>;
}
