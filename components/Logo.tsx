import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/Logo.png";

export default function Logo({
  className = "",
  variant = "compact",
  theme = "light",
  src = "",
  alt = "Seine River Cruise Tours",
  line1 = "Seine River",
  line2 = "Cruise Tours",
}: {
  className?: string;
  variant?: "compact" | "stacked";
  theme?: "light" | "dark";
  src?: string;
  alt?: string;
  line1?: string;
  line2?: string;
}) {
  const isDark = theme === "dark";
  const customSrc = src?.trim();

  if (variant === "stacked") {
    return (
      <Link href="/" className={`inline-flex flex-col items-center gap-3.5 ${className}`}>
        {/* Sized to the skyline artwork's actual ~2.17:1 aspect ratio
            (wide/flat) rather than the old squarer box, so it fills its
            space instead of shrinking inside empty letterbox padding. */}
        <span className="relative block h-16 w-[139px] sm:h-20 sm:w-[174px] transition-transform duration-300 hover:scale-105">
          <Image
            src={customSrc || logoImg}
            alt={alt}
            fill
            sizes="174px"
            className="object-contain"
            priority
          />
        </span>
        <div className="text-center leading-tight">
          <span
            className={`block font-display text-2xl sm:text-3xl font-bold italic tracking-tight ${
              isDark ? "text-white" : "text-stone-900"
            }`}
          >
            {line1}
          </span>
          <span className="block font-sans text-xs font-extrabold uppercase tracking-[0.32em] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            {line2}
          </span>
        </div>
      </Link>
    );
  }

  const image = (
    <span className="relative block h-9 w-[78px] shrink-0 overflow-hidden sm:h-10 sm:w-[87px] transition-transform duration-300 group-hover:scale-105">
      <Image
        src={customSrc || logoImg}
        alt={alt}
        fill
        priority
        sizes="87px"
        className="object-contain"
      />
    </span>
  );

  const wordmark = (
    <span className="flex min-w-0 items-center gap-3">
      <span
        className={`h-8 w-[1.5px] shrink-0 rounded-full ${
          isDark
            ? "bg-gradient-to-b from-amber-400/80 to-purple-500/30"
            : "bg-gradient-to-b from-purple-600/60 to-amber-400/30"
        }`}
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-col leading-[1.08]">
        <span
          className={`block truncate font-display text-[1.4rem] sm:text-[1.5rem] font-bold italic tracking-tight ${
            isDark ? "text-white" : "text-stone-900"
          }`}
        >
          {line1}
        </span>
        <span className="block truncate font-sans text-[10px] font-extrabold uppercase tracking-[0.32em] bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent">
          {line2}
        </span>
      </div>
    </span>
  );

  // min-w-0 lets the wordmark shrink/truncate on narrow screens instead of
  // forcing the header to overflow (or collide with the mobile hamburger)
  // if an admin-entered site name is long — see MobileNav.tsx.
  return (
    <Link href="/" className={`group inline-flex min-w-0 items-center gap-2 ${className}`}>
      {image}
      {wordmark}
    </Link>
  );
}
