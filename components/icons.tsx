// Hand-drawn, dependency-free line icons (24x24, stroke-based) so the trust
// section doesn't rely on emoji rendering differently across OSes/browsers.
// All accept a className so they can be sized/colored with Tailwind.

type IconProps = { className?: string };

export function ShieldCheckIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.6}>
      <path
        d="M12 3.5 18.5 6v5.2c0 4.2-2.8 7.5-6.5 9.3-3.7-1.8-6.5-5.1-6.5-9.3V6L12 3.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 12.3 11.2 14.5 15.3 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ClockPayIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.6}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RefundIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.6}>
      <path
        d="M4 10h9.5a5.5 5.5 0 0 1 5.5 5.5v.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 6 4 10l4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LockIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.6}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" strokeLinecap="round" />
      <circle cx="12" cy="15.3" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TicketIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.6}>
      <path
        d="M4 8.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.1a2 2 0 1 0 0 4.8V15.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.1a2 2 0 1 0 0-4.8V8.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 7v10" strokeDasharray="1.6 2" strokeLinecap="round" />
    </svg>
  );
}

export function HeadsetIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.6}>
      <path d="M4.5 14.5v-2a7.5 7.5 0 0 1 15 0v2" strokeLinecap="round" />
      <rect x="3" y="14" width="3.2" height="5.2" rx="1.4" />
      <rect x="17.8" y="14" width="3.2" height="5.2" rx="1.4" />
      <path d="M17.8 19.2v.3a2.5 2.5 0 0 1-2.5 2.5h-2" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.5 15 9.1l7.2.7-5.4 4.8 1.6 7.1L12 18l-6.4 3.7 1.6-7.1L1.8 9.8l7.2-.7L12 2.5Z" />
    </svg>
  );
}

export function MailIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.6}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4.5 7 12 13l7.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BriefcaseIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.6}>
      <rect x="3.5" y="8" width="17" height="11" rx="2" />
      <path d="M8.5 8V6.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V8" strokeLinecap="round" />
      <path d="M3.5 13h17" />
    </svg>
  );
}

// Wave/boat mark used for the site logo (header, footer, favicon, admin
// sidebar) — replaces the old raster Logo.png with a dependency-free SVG so
// there's no external asset to go missing.
export function WaveBoatIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={1.6}>
      <path d="M4 16.5c1.4 1.3 3 1.3 4.4 0 1.4-1.3 3-1.3 4.4 0 1.4 1.3 3 1.3 4.4 0 1.4-1.3 3-1.3 4.4 0" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 13.5 8 6l2 3.5M12 13.5l1.5-5.5L16 13.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 6h5" strokeLinecap="round" />
    </svg>
  );
}
