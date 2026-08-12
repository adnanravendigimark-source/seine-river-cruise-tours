const itinerary = [
  { time: "0:00", step: "Depart Port de la Bourdonnais, with the Eiffel Tower directly overhead" },
  { time: "0:08", step: "Pass under Pont Alexandre III — the most ornate, gold-leafed bridge on the river" },
  { time: "0:18", step: "Musée d'Orsay and the Tuileries Garden slide by on the Right Bank" },
  { time: "0:28", step: "The Louvre and Pont Neuf — the oldest bridge in Paris, despite the name" },
  { time: "0:38", step: "Île de la Cité and Notre-Dame Cathedral — the turnaround point" },
  { time: "0:50", step: "Return past the Conciergerie and Paris City Hall (Hôtel de Ville)" },
];

const boardingPoints = [
  { name: "Port de la Bourdonnais", note: "At the foot of the Eiffel Tower — the main dock for most sightseeing and evening cruises" },
  { name: "Pont de l'Alma", note: "A short walk from the Champs-Élysées, used by several evening and combo departures" },
  { name: "Pont Neuf", note: "On Île de la Cité, closest if you're starting near Notre-Dame or the Louvre" },
];

const learn = [
  "Why the Eiffel Tower sparkles for five minutes every hour after dark",
  "Why \"Pont Neuf\" (New Bridge) is actually the oldest bridge still standing in Paris",
  "How the banks of the Seine became a UNESCO World Heritage Site",
  "Which of the 30+ bridges you'll pass under has the best photo angle from the water",
];

export default function WhatYouSee() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-stone-900">
          What You Actually See on a Seine River Cruise
        </h2>
        <p className="mt-3 max-w-2xl text-stone-900/70">
          One hour, one loop, and more of Paris's skyline than you could comfortably reach on foot
          in an afternoon. Here's the route, landmark by landmark.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-stone-900">Sample cruise route</h3>
            <ol className="mt-4 space-y-4 border-l border-stone-900/10 pl-5">
              {itinerary.map((row) => (
                <li key={row.time} className="relative">
                  <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-seine-teal" />
                  <span className="text-xs font-semibold text-seine-teal">{row.time}</span>
                  <p className="text-sm text-stone-900/80">{row.step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-stone-900">What you'll notice</h3>
            <ul className="mt-4 space-y-3">
              {learn.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl bg-stone-50 p-4 text-sm text-stone-900/80">
                  <span className="text-gold-500">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-stone-900/50">
              Cruises run with multilingual audio commentary (up to 10+ languages), so you always
              know what you're looking at as it passes. Boats have covered indoor seating, so
              weather rarely cancels a departure.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="font-display text-lg font-semibold text-stone-900">Where you can board</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {boardingPoints.map((point) => (
              <div key={point.name} className="rounded-xl border border-stone-900/10 bg-stone-50 p-4">
                <p className="text-sm font-semibold text-seine-teal">{point.name}</p>
                <p className="mt-1 text-xs text-stone-900/70">{point.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-seine-teal/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-stone-900">
            Convinced? The 1-hour sightseeing cruise starts at €17/person and departs every 30–45 minutes.
          </p>
          <a
            href="#tours"
            className="shrink-0 rounded-full bg-seine-amber px-6 py-3 text-sm font-semibold text-white transition hover:bg-seine-amber/90"
          >
            Book the Sightseeing Cruise →
          </a>
        </div>
      </div>
    </section>
  );
}
