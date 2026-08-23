"use client";

import { useEffect, useRef, useState } from "react";
import { milestones, presentMonth, presentYear, roles } from "@/lib/content";

/**
 * The career as a lane of quarters. Every bar is three months; the tall ones are
 * quarters with something in them. On load the lane is flat, then the marks resolve
 * left to right, so the reveal reads as time passing.
 *
 * Quarters, not months, on purpose: thirteen years across a few hundred pixels is
 * about three pixels a month, which turns a busy year into an untappable smear.
 * A quarter bar is wide enough to hit exactly where you see it, and anything sharing
 * a quarter is listed together in the panel below.
 *
 * Marks come from role starts plus `milestones`. Heights are seeded so server and
 * client agree.
 */

type Entry = { label: string; detail: string; org?: string };
type Group = { q: number; quarter: string; entries: Entry[] };

const START_YEAR = Math.min(...roles.map((r) => Number(r.from)));
const SPAN_YEARS = presentYear - START_YEAR;

const monthIndex = (year: number, month = 6) =>
  (year - START_YEAR) * 12 + Math.min(Math.max(month, 1), 12) - 1;

const LAST_MONTH = monthIndex(presentYear, presentMonth);
const COUNT = Math.floor(LAST_MONTH / 3) + 1;

/** Prefer the "YYYY-MM" start where a role has one, so marks land on the real quarter. */
const roleMonth = (r: (typeof roles)[number]) => {
  const [y, m] = (r.start ?? `${r.from}-01`).split("-");
  return monthIndex(Number(y), Number(m));
};

const quarterLabel = (q: number) =>
  `Q${(q % 4) + 1} ${START_YEAR + Math.floor(q / 4)}`;

const raw: Array<Entry & { month: number }> = [
  ...roles.map((r) => ({
    month: roleMonth(r),
    label: `${r.title}, ${r.from} to ${r.to}`,
    detail: r.note,
    org: r.org,
  })),
  ...milestones.map((m) => ({
    month: monthIndex(Number(m.year), m.month),
    label: m.label,
    detail: m.detail,
    org: m.org,
  })),
].filter((m) => m.month >= 0 && m.month <= LAST_MONTH);

const GROUPS: Group[] = Object.values(
  raw.reduce<Record<number, Group>>((acc, m) => {
    const q = Math.floor(m.month / 3);
    const at = acc[q] ?? { q, quarter: quarterLabel(q), entries: [] };
    at.entries.push({ label: m.label, detail: m.detail, org: m.org });
    return { ...acc, [q]: at };
  }, {}),
).sort((a, b) => a.q - b.q);

const BY_Q = new Map(GROUPS.map((g) => [g.q, g]));

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
  restHeight: 20 + rand() * 26,
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

  const active = selected === null ? null : BY_Q.get(selected) ?? null;

  /** Left and right arrows walk the marks; escape clears. */
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setSelected(null);
      return;
    }
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const at = selected === null ? -1 : GROUPS.findIndex((g) => g.q === selected);
    const next = GROUPS[Math.min(Math.max(at + dir, 0), GROUPS.length - 1)];
    if (!next) return;
    setSelected(next.q);
    laneRef.current?.querySelector<HTMLButtonElement>(`[data-q="${next.q}"]`)?.focus();
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
          const group = BY_Q.get(bar.i);
          const isMark = Boolean(group);
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
            background: resolved && isMark ? "var(--color-signal)" : "var(--color-noise)",
            transition:
              "height 900ms cubic-bezier(.2,.7,.3,1), opacity 900ms ease, background-color 900ms ease",
            transitionDelay: `${Math.round((bar.i / COUNT) * 700)}ms`,
          };

          if (!group) {
            return (
              <span
                key={bar.i}
                aria-hidden="true"
                className="min-w-0 flex-1 rounded-full"
                style={style}
              />
            );
          }

          // The button is exactly the bar, so the target is where you see it.
          return (
            <button
              key={bar.i}
              type="button"
              data-q={bar.i}
              onClick={() => setSelected(isActive ? null : bar.i)}
              aria-pressed={isActive}
              aria-label={`${group.quarter}: ${group.entries.map((e) => e.label).join("; ")}`}
              className="group flex h-full min-w-0 flex-1 cursor-pointer items-end bg-transparent focus:outline-none"
            >
              <span
                className="w-full rounded-full ring-offset-2 group-focus-visible:ring-2 group-focus-visible:ring-signal"
                style={{
                  ...style,
                  transform: isActive ? "scaleY(1.1)" : undefined,
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
      <figcaption className="mt-5 min-h-[6.5rem] max-w-md text-sm leading-relaxed" aria-live="polite">
        {active ? (
          <>
            <span className="eyebrow">
              {active.entries[0]?.org ? `${active.entries[0].org} · ` : ""}
              {active.quarter}
            </span>
            {active.entries.map((e) => (
              <span key={e.label} className="mt-3 block first:mt-2">
                <span className="block font-medium">{e.label}</span>
                <span className="mt-1 block text-ink-soft">{e.detail}</span>
              </span>
            ))}
          </>
        ) : (
          <span className="text-noise">
            {GROUPS.length} marks across {SPAN_YEARS} years. Select one to read it.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
