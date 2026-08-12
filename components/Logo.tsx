import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/Logo.png";

// Real brand mark (assets/Logo.png) — a circular illustrated badge, so it's
// wrapped in a rounded-full/overflow-hidden frame that clips the image's
// square canvas down to just the circle. That way it drops cleanly onto
// both light and dark backgrounds (header vs. footer/dark hero) with no
// visible edges, at two sizes: compact header/footer use vs. larger
// stacked use.
export default function Logo({
  className = "",
  variant = "compact",
  theme = "light",
}: {
  className?: string;
  variant?: "compact" | "stacked";
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";

  const iconWrap = (size: string) => (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ${
        isDark ? "ring-white/15" : "ring-stone-900/10"
      }`}
    >
      <Image src={logoImg} alt="Seine River Cruise Tours logo" className="h-full w-full object-cover" priority />
    </span>
  );

  if (variant === "stacked") {
    return (
      <Link href="/" className={`inline-flex flex-col items-center gap-3 ${className}`}>
        {iconWrap("h-14 w-14")}
        <span className="text-center leading-tight">
          <span
            className={`block font-display text-2xl font-semibold italic tracking-tight ${
              isDark ? "text-white" : "text-stone-900"
            }`}
          >
            Seine River Cruise
          </span>
          <span
            className={`block text-xs font-semibold uppercase tracking-[0.24em] ${
              isDark ? "text-gold-400" : "text-seine-amber"
            }`}
          >
            Tours
          </span>
        </span>
      </Link>
    );
  }

  const wordmark = (
    <span className="hidden items-center gap-3 sm:flex">
      <span
        className={`h-8 w-px shrink-0 ${isDark ? "bg-gold-400/40" : "bg-gold-500/40"}`}
        aria-hidden="true"
      />
      <span className="leading-tight">
        <span
          className={`block whitespace-nowrap font-display text-lg font-semibold italic tracking-tight ${
            isDark ? "text-white" : "text-stone-900"
          }`}
        >
          Seine River Cruise
        </span>
        <span
          className={`block whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.24em] ${
            isDark ? "text-gold-400" : "text-seine-amber"
          }`}
        >
          Tours
        </span>
      </span>
    </span>
  );

  return (
    <Link href="/" className={`inline-flex items-center gap-3 ${className}`}>
      {iconWrap("h-11 w-11")}
      {wordmark}
    </Link>
  );
}
