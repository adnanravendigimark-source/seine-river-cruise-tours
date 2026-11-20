"use client";

import { useState, type ReactNode } from "react";

// "What matters most to you?" picker. Options are wrapping pill radios so
// seven choices stay short on a phone. Desktop shows every card and rings
// the match; phones show only the matched card. Without JavaScript the
// default (recommended) tour is the match and every card renders on desktop.
export default function TicketChooserPicker({
  options,
  cards,
  defaultId,
  question,
  matchLabel,
}: {
  options: { id: string; label: string }[];
  cards: Record<string, ReactNode>;
  defaultId: string;
  question: string;
  matchLabel: string;
}) {
  const [selected, setSelected] = useState(defaultId);

  return (
    <div className="mt-8">
      <fieldset>
        <legend className="text-sm font-medium text-stone-900/75">{question}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((o) => {
            const active = o.id === selected;
            return (
              <label
                key={o.id}
                className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-150 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-seine-amber ${
                  active
                    ? "border-seine-amber bg-seine-amber text-white"
                    : "border-stone-900/15 bg-white text-stone-900/80 hover:border-seine-amber/50"
                }`}
              >
                <input
                  type="radio"
                  name="cruise-match"
                  value={o.id}
                  checked={active}
                  onChange={() => setSelected(o.id)}
                  className="sr-only"
                />
                <span>{o.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => {
          const active = o.id === selected;
          return (
            <div
              key={o.id}
              className={`relative rounded-[1.65rem] ${active ? "p-1 ring-2 ring-seine-amber" : "hidden p-1 sm:block"}`}
            >
              {active && (
                <span className="absolute -top-3 right-4 z-10 rounded-full bg-seine-amber px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  {matchLabel}
                </span>
              )}
              {cards[o.id]}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-stone-900/65 sm:hidden">
        Pick another option above to see that cruise, or compare them all in the table below.
      </p>
    </div>
  );
}
