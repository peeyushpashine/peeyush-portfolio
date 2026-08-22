"use client";

import { useEffect, useState } from "react";

/**
 * A lane of alerts. On load everything looks alike, then the noise recedes
 * and a handful of real signals resolve. This is the problem he works on,
 * used as the page's one moment of motion.
 *
 * Heights come from a seeded generator so server and client agree.
 */

const COUNT = 168;
const SIGNAL_AT = new Set([7, 23, 41, 68, 89, 104, 127, 151, 160]);

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = seeded(20260822);
const BARS = Array.from({ length: COUNT }, (_, i) => ({
  i,
  isSignal: SIGNAL_AT.has(i),
  noiseHeight: 18 + rand() * 34,
  signalHeight: 52 + rand() * 44,
}));

export default function SignalLane() {
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setResolved(true);
      return;
    }
    const t = setTimeout(() => setResolved(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <figure className="mt-14">
      <div
        className="flex h-28 items-end gap-[3px] overflow-hidden"
        aria-hidden="true"
      >
        {BARS.map((bar) => {
          const on = resolved;
          const height = on
            ? bar.isSignal
              ? bar.signalHeight
              : bar.noiseHeight * 0.55
            : bar.noiseHeight + 12;
          const opacity = on ? (bar.isSignal ? 1 : 0.28) : 0.6;
          return (
            <span
              key={bar.i}
              className="w-[3px] shrink-0 rounded-full"
              style={{
                height: `${height}%`,
                opacity,
                background: on && bar.isSignal ? "var(--color-signal)" : "var(--color-noise)",
                transition:
                  "height 900ms cubic-bezier(.2,.7,.3,1), opacity 900ms ease, background-color 900ms ease",
                transitionDelay: `${(bar.i % 24) * 14}ms`,
              }}
            />
          );
        })}
      </div>

      <figcaption className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
        Most alerts are noise. The work is finding the few that are not, and
        being right often enough that someone trusts the pager again.
      </figcaption>
    </figure>
  );
}
