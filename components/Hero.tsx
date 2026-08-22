import { facts, person } from "@/lib/content";
import SignalLane from "./SignalLane";

export default function Hero() {
  return (
    <section id="top" className="pt-16 lg:pt-24">
      <h1 className="max-w-3xl text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[3rem] lg:text-[3.5rem]">
        {person.thesis}
      </h1>

      <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
        {person.summary}
      </p>

      <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-5">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="eyebrow">{f.label}</dt>
            <dd className="mt-1 font-mono text-2xl tabular-nums text-signal">{f.value}</dd>
          </div>
        ))}
      </dl>

      <SignalLane />
    </section>
  );
}
