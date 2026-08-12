import type { ComponentType } from "react";
import {
  ShieldCheckIcon,
  ClockPayIcon,
  RefundIcon,
  LockIcon,
  TicketIcon,
  HeadsetIcon,
  StarIcon,
  MailIcon,
  BriefcaseIcon,
} from "@/components/icons";

// Fixed set of icons the "why us" / "what we can help with" trust cards
// can use — these are the only icons that exist as dependency-free SVG
// components in components/icons.tsx. The DB stores the plain string key
// (e.g. "ShieldCheckIcon"), never a component reference, so both the
// admin picker (client component) and the public About/Contact pages
// (server components) render from this same map. Kept in its own
// server-safe file (no "use client") so importing it from a Server
// Component never accidentally pulls in client-only bundling.
export const ICON_OPTIONS: Record<string, ComponentType<{ className?: string }>> = {
  ShieldCheckIcon,
  ClockPayIcon,
  RefundIcon,
  LockIcon,
  TicketIcon,
  HeadsetIcon,
  StarIcon,
  MailIcon,
  BriefcaseIcon,
};

export function getIconComponent(key: string) {
  return ICON_OPTIONS[key] || ShieldCheckIcon;
}
