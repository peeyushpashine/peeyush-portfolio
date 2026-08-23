"use client";

import { useEffect, useRef, useState } from "react";
import { milestones, presentYear, roles } from "@/lib/content";

/**
 * The twelve-plus years as a lane of months. Every bar is one month; the tall
 * ones are marks worth stopping on. On load the lane is flat, then the marks
 * resolve left to right, so the reveal reads as time passing.
 *
 * Marks come from two places: one per role start, automatically, plus anything
 * in `milestones`. Clicking a mark shows its detail in the panel below, which is
 * height-reserved so selecting never shifts the page.
 *
 * Heights come from a seeded generator so server and client agree.
 */

type Mark = { index: number; date: string; label: string; detail: string; org?: string };

const START_YEAR = Math.min(...roles.map((r) => Number(r.from)));
const SPAN_YEARS = presentYear - START_YEAR;
const COUNT = SPAN_YEARS * 12;

const toIndex = (year: number, month = 6) =>
  (year - START_YEAR) * 12 + Math.min(Math.max(month, 1), 12) - 1;

/** Prefer the "YYYY-MM" start where a role has one, so marks land on the real month. */
const roleIndex = (r: (typeof roles)[number]) => {
  const [y, m] = (r.start ?? `${r.from}-01`).split("-");
  return toIndex(Number(y), Number(m));
};

const fromRoles: Mark[] = roles.map((r) => ({
  index: roleIndex(r),
  date: `${r.from} to ${r.to}`,
  label: r.title,
  detail: r.note,
  org: r.org,
}));

const fromMilestones: Mark[] = milestones.map((m) => ({
  index: toIndex(Number(m.year), m.month),
  date: m.year,
  label: m.label,
  detail: m.detail,
  org: m.org,
}));

/**
 * One mark per month. Where two land in the same month the later definition wins,
 * so a milestone can deliberately override a role start.
 */
const MARKS: Mark[] = Object.values(
  [...fromRoles, ...fromMilestones]
    .filter((m) => m.index >= 0 && m.index < COUNT)
    .reduce<Record<number, Mark>>((acc, m) => ({ ...acc, [m.index]: m }), {}),
).sort((a, b) => a.index - b.index);

const MARK_BY_INDEX = new Map(MARKS.map((m) => [m.index, m]));

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
  restHeight: 18 + rand() * 30,
  markHeight: 58 + rand() * 38,
}));

export default function Journey() {
  const [resolved, setResolved] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const laneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setResolved(true);
      return;
    }
    const t = setTimeout(() => setResolved(true), 700);
    return () => clearTimeout(t);
  }, []);

  const active = selected === null ? null : MARK_BY_INDEX.get(selected) ?? null;

  /** Left and right arrows walk the marks; escape clears. */
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setSelected(null);
      return;
    }
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const at = selected === null ? -1 : MARKS.findIndex((m) => m.index === selected);
    const next = MARKS[Math.min(Math.max(at + dir, 0), MARKS.length - 1)];
    if (!next) return;
    setSelected(next.index);
    laneRef.current
      ?.querySelector<HTMLButtonElement>(`[data-mark="${next.index}"]`)
      ?.focus();
  }

  return (
    <figure className="mt-14">
      <div
        ref={laneRef}
        className="flex h-28 w-full items-end gap-px"
        onKeyDown={onKeyDown}
        role="group"
        aria-label="Career timeline. Use left and right arrows to move between marks."
      >
        {BARS.map((bar) => {
          const mark = MARK_BY_INDEX.get(bar.i);
          const isMark = Boolean(mark);
          const isActive = selected === bar.i;
          const height = resolved
            ? isMark
              ? bar.markHeight
              : bar.restHeight * 0.62
            : bar.restHeight + 10;
          // With a mark selected, the other marks step back so the lane shows
          // which one the panel is describing.
          const opacity = !resolved
            ? 0.6
            : isMark
              ? selected === null || isActive
                ? 1
                : 0.4
              : 0.3;
          const style = {
            height: `${height}%`,
            opacity,
            background:
              resolved && isMark ? "var(--color-signal)" : "var(--color-noise)",
            transition:
              "height 900ms cubic-bezier(.2,.7,.3,1), opacity 900ms ease, background-color 900ms ease",
            transitionDelay: `${Math.round((bar.i / COUNT) * 700)}ms`,
          };

          if (!mark) {
            return (
              <span
                key={bar.i}
                aria-hidden="true"
                className="min-w-0 flex-1 rounded-full"
                style={style}
              />
            );
          }

          // The bar stays 3px. The button around it is a real touch target.
          return (
            <button
              key={bar.i}
              type="button"
              data-mark={bar.i}
              onClick={() => setSelected(isActive ? null : bar.i)}
              aria-pressed={isActive}
              aria-label={`${mark.org ? `${mark.org}, ` : ""}${mark.label}, ${mark.date}`}
              className="group relative flex h-full min-w-0 flex-1 cursor-pointer items-end justify-center bg-transparent focus:outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-5 sm:after:w-7 after:-translate-x-1/2 after:content-['']"
            >
              <span
                className="w-full rounded-full ring-offset-2 group-focus-visible:ring-2 group-focus-visible:ring-signal"
                style={{
                  ...style,
                  transform: isActive ? "scaleY(1.12)" : undefined,
                  transformOrigin: "bottom",
                }}
              />
            </button>
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

      {/* Height reserved so selecting a mark never moves the page. */}
      <figcaption
        className="mt-5 min-h-[5.5rem] max-w-md text-sm leading-relaxed"
        aria-live="polite"
      >
        {active ? (
          <>
            <span className="eyebrow">
              {active.org ? `${active.org} · ` : ""}
              {active.date}
            </span>
            <span className="mt-1 block font-medium">{active.label}</span>
            <span className="mt-1 block text-ink-soft">{active.detail}</span>
          </>
        ) : (
          <span className="text-noise">
            {MARKS.length} marks across {SPAN_YEARS} years. Select one to read it.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
