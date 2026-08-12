import Image, { type ImageProps } from "next/image";

// next/image throws if `src` is empty/missing — which happens for real
// here since every image is admin-editable content coming from the
// database (a brand-new tour/post, or a database that hasn't been seeded
// yet via `node scripts/setup-db.mjs`, can easily have a blank image
// field). Rather than crashing the whole page, fall back to a plain
// placeholder block wherever that happens.
export default function SafeImage({ src, alt, className, fill, ...rest }: ImageProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-stone-200 text-stone-400 ${
          fill ? "absolute inset-0 h-full w-full" : ""
        } ${className || ""}`}
        aria-label={typeof alt === "string" ? alt : "Image not set"}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" />
          <path d="M21 16.5 16 12l-4.5 4.5M12.5 15 10 12.5 3 19" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return <Image src={src} alt={alt} className={className} fill={fill} {...rest} />;
}
