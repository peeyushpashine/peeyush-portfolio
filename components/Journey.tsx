"use client";

import { useEffect, useState } from "react";
import { presentYear, roles } from "@/lib/content";

/**
 * The twelve-plus years as a lane of months. Every bar is one month; the tall
 * ones are the months a role started. On load the lane is flat and undifferentiated,
 * then the moves resolve left to right, so the reveal reads as time passing.
 *
 * Derived entirely from `roles`, so adding a role moves the marks automatically.
 * Heights come from a seeded generator so server and client agree.
 */

const START_YEAR = Math.min(...roles.map((r) => Number(r.from)));
const SPAN_YEARS = presentYear - START_YEAR;
const COUNT = SPAN_YEARS * 12;

/** Month index of each role's first month, oldest first. */
const MOVES = [...roles]
  .map((r) => (Number(r.from) - START_YEAR) * 12)
  .filter((i) => i >= 0 && i < COUNT)
  .sort((a, b) => a - b);

const MOVE_SET = new Set(MOVES);

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = seeded(20260823);
const BARS = Array.from({ length: COUNT }, (_, i) => ({
  i,
  isMove: MOVE_SET.has(i),
  restHeight: 18 + rand() * 30,
  moveHeight: 58 + rand() * 38,
}));

/** Oldest first, for the screen reader and the year rail. */
const ORDERED = [...roles].sort((a, b) => Number(a.from) - Number(b.from));

export default function Journey() {
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
      <div className="flex h-28 items-end gap-[3px] overflow-hidden" aria-hidden="true">
        {BARS.map((bar) => {
          const on = resolved;
          const height = on
            ? bar.isMove
              ? bar.moveHeight
              : bar.restHeight * 0.62
            : bar.restHeight + 10;
          const opacity = on ? (bar.isMove ? 1 : 0.3) : 0.6;
          return (
            <span
              key={bar.i}
              className="w-[3px] shrink-0 rounded-full"
              style={{
                height: `${height}%`,
                opacity,
                background: on && bar.isMove ? "var(--color-signal)" : "var(--color-noise)",
                transition:
                  "height 900ms cubic-bezier(.2,.7,.3,1), opacity 900ms ease, background-color 900ms ease",
                transitionDelay: `${Math.round((bar.i / COUNT) * 700)}ms`,
              }}
            />
          );
        })}
      </div>

      <div
        className="mt-4 flex justify-between font-mono text-[0.6875rem] tabular-nums text-noise"
        aria-hidden="true"
      >
        <span>{START_YEAR}</span>
        <span>{presentYear}</span>
      </div>

      <figcaption className="sr-only">
        A timeline of roles from {START_YEAR} to the present:{" "}
        {ORDERED.map((r) => `${r.org}, ${r.title}, ${r.from} to ${r.to}`).join("; ")}.
      </figcaption>
    </figure>
  );
}
