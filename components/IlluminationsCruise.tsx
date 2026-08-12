import Image from "next/image";

// Real Paris/Seine photography (Unsplash License, free for commercial use).
const nightImages = [
  {
    src: "https://images.unsplash.com/photo-1739604977885-545151bef26b?q=80&w=700&auto=format&fit=crop",
    alt: "A river cruise boat gliding past illuminated buildings on the Seine at night",
    label: "Evening Cruise",
  },
  {
    src: "https://images.unsplash.com/photo-1760281853031-7d82263729b6?q=80&w=700&auto=format&fit=crop",
    alt: "The Eiffel Tower glowing above the Seine River at golden hour",
    label: "Eiffel Tower at Dusk",
  },
  {
    src: "https://images.unsplash.com/photo-1754407190578-21b05b79a920?q=80&w=700&auto=format&fit=crop",
    alt: "The Seine River flowing past Parisian buildings and bridges",
    label: "Along the River",
  },
  {
    src: "https://images.unsplash.com/photo-1552585734-b7ae2174b8f9?q=80&w=700&auto=format&fit=crop",
    alt: "The Louvre Museum along the Seine River banks in Paris",
    label: "City Lights",
  },
];

export default function IlluminationsCruise() {
  return (
    <section id="night-cruise" className="bg-seine-teal/5 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-seine-teal">
            Evening Cruise with Live Music
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-stone-900">
            See Paris Sparkle After Dark
          </h2>
          <p className="mt-4 text-stone-900/70">
            The same one-hour route looks completely different once the sun goes down. Every bridge
            and monument along the Seine is floodlit at night, the <strong>Eiffel Tower sparkles for
            five minutes on the hour</strong>, and the evening departure adds live onboard music with
            open-air deck seating — a slower, more atmospheric ride than the daytime sightseeing
            cruise, for a similar price.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-stone-900/80">
            <li className="flex gap-2"><span className="text-seine-teal">🎵</span>Live onboard music and open-air deck access, included in the evening ticket</li>
            <li className="flex gap-2"><span className="text-seine-teal">✨</span>Every bridge and monument is floodlit — a completely different atmosphere from the daytime route</li>
            <li className="flex gap-2"><span className="text-seine-teal">👥</span>Weekend evening slots book out first, especially in summer</li>
            <li className="flex gap-2"><span className="text-seine-teal">📸</span>Best light for photos: the 20 minutes right after sunset, before it's fully dark</li>
          </ul>
          <a
            href="#tours"
            className="mt-6 inline-flex rounded-full bg-seine-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-seine-teal/90"
          >
            See Evening Cruise with Music
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {nightImages.map((img) => (
            <div
              key={img.label}
              className="group relative h-32 overflow-hidden rounded-xl border border-seine-teal/20 shadow-sm sm:h-40"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0" />
              <span className="absolute bottom-2 left-2.5 text-xs font-semibold text-white drop-shadow">
                {img.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
