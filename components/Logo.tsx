import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/Logo.png";

export default function Logo({
  className = "",
  variant = "compact",
  theme = "light",
  src = "",
  alt = "Seine River Cruise Tours",
}: {
  className?: string;
  variant?: "compact" | "stacked";
  theme?: "light" | "dark";
  src?: string;
  alt?: string;
}) {
  const isDark = theme === "dark";
  const customSrc = src?.trim();

  if (variant === "stacked") {
    return (
      <Link href="/" className={`inline-flex flex-col items-center gap-3.5 ${className}`}>
        <span className="relative block h-24 w-32 sm:h-28 sm:w-36 transition-transform duration-300 hover:scale-105">
          <Image
            src={customSrc || logoImg}
            alt={alt}
            fill
            sizes="160px"
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
            Seine River
          </span>
          <span className="block font-sans text-xs font-extrabold uppercase tracking-[0.32em] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Cruise Tours
          </span>
        </div>
      </Link>
    );
  }

  const image = (
    <span className="relative block h-11 w-14 overflow-hidden sm:h-12 sm:w-16 transition-transform duration-300 group-hover:scale-105">
      <Image
        src={customSrc || logoImg}
        alt={alt}
        fill
        priority
        sizes="100px"
        className="object-contain"
      />
    </span>
  );

  const wordmark = (
    <span className="hidden items-center gap-3 sm:flex">
      <span
        className={`h-8 w-[1.5px] shrink-0 rounded-full ${
          isDark
            ? "bg-gradient-to-b from-amber-400/80 to-purple-500/30"
            : "bg-gradient-to-b from-purple-600/60 to-amber-400/30"
        }`}
        aria-hidden="true"
      />
      <div className="flex flex-col leading-[1.08]">
        <span
          className={`block whitespace-nowrap font-display text-[1.4rem] sm:text-[1.5rem] font-bold italic tracking-tight ${
            isDark ? "text-white" : "text-stone-900"
          }`}
        >
          Seine River
        </span>
        <span className="block whitespace-nowrap font-sans text-[10px] font-extrabold uppercase tracking-[0.32em] bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent">
          Cruise Tours
        </span>
      </div>
    </span>
  );

  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`}>
      {image}
      {wordmark}
    </Link>
  );
}
