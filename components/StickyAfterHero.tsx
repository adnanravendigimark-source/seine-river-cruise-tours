"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Wraps the mobile booking bar so it slides in only once the hero (#top)
// has scrolled away — while the hero is on screen its own buttons are the
// action, and a second bar would compete with them. Without JavaScript, or
// on pages with no hero, the bar simply stays visible. While hidden it is
// `inert`, so its link can't be tabbed to or read out.
export default function StickyAfterHero({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [heroOnScreen, setHeroOnScreen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setHeroOnScreen(entry.isIntersecting), { threshold: 0.15 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (heroOnScreen) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  }, [heroOnScreen]);

  return (
    <div
      ref={ref}
      aria-hidden={heroOnScreen || undefined}
      className={`${className} transition-transform duration-200 ease-out motion-reduce:transition-none ${
        heroOnScreen ? "translate-y-full" : "translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
