import type { ReactNode } from "react";

export default function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 pt-24 lg:pt-28">
      <h2 className="eyebrow mb-8 flex items-center gap-4">
        <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-signal" />
        {title}
      </h2>
      {children}
    </section>
  );
}
