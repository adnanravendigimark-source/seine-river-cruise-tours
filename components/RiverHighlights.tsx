const highlights = [
  {
    title: "Iconic Waterfront",
    body: "The Eiffel Tower, Musée d'Orsay, and the Louvre all sit directly on the water — no other viewpoint in Paris strings them together in one hour.",
    icon: "🗼",
  },
  {
    title: "Notre-Dame & Île de la Cité",
    body: "Every route loops around the island where Paris began, passing Notre-Dame Cathedral and the Conciergerie from the river.",
    icon: "⛪",
  },
  {
    title: "Open-Air Decks",
    body: "Evening and combo cruises open their upper decks so you can feel the river air and get an unobstructed line of sight for photos.",
    icon: "🌬️",
  },
  {
    title: "Evening Glow",
    body: "After sunset, every bridge and monument is floodlit, and the Eiffel Tower sparkles for five minutes on the hour, every hour.",
    icon: "✨",
  },
];

export default function RiverHighlights() {
  return (
    <section className="bg-seine-ink py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
          Why the Seine
        </span>
        <h2 className="mt-2 font-display text-3xl font-bold">Seine River Highlights</h2>
        <p className="mt-3 max-w-2xl text-white/70">
          The Seine isn't just a way to get between landmarks — it's a viewpoint on its own. Here's
          what makes the ride itself worth booking.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-seine-amber/40 hover:bg-white/10"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/70">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
