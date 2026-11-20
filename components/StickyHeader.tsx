"use client";

import { useEffect, useState, type ReactNode } from "react";

// Header shell. On the homepage (overlay) it sits transparent over the hero
// photo, then turns solid white with a soft shadow once you scroll. Other
// pages get the solid style straight away. Children style themselves with
// `group-data-[solid=true]:` variants, so the rest of the header can stay a
// server component.
export default function StickyHeader({ overlay = false, children }: { overlay?: boolean; children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const solid = !overlay || scrolled;
  return (
    <header
      data-solid={solid}
      className={`group sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300 motion-reduce:transition-none ${
        solid
          ? "border-b border-stone-900/10 bg-white/95 shadow-sm backdrop-blur-md"
          : "-mb-20 bg-gradient-to-b from-seine-ink/90 via-seine-ink/55 to-transparent"
      }`}
    >
      {children}
    </header>
  );
}
