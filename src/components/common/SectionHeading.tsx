import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}

export function SectionHeading({ eyebrow, title, description, align = "left", as = "h2" }: Props) {
  const Tag = as;
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="mt-3 text-3xl font-bold uppercase leading-tight md:text-4xl">{title}</Tag>
      {description && <p className="mt-4 text-base text-muted-foreground">{description}</p>}
    </div>
  );
}
