"use client";

import { useEffect } from "react";

// Sends one GA4 event per click on a GetYourGuide booking link:
//   affiliate_click { tour_id: "t451750", placement: "tour_card", page_path: "/" }
// so booking clicks can be measured per tour, per placement and per page.
// A single delegated listener — links themselves are untouched, navigation
// is never delayed, and it does nothing if gtag hasn't loaded (e.g. blocked).
type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

export default function AffiliateClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.type === "auxclick" && event.button !== 1) return; // middle-click only
      const target = event.target as Element | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      let url: URL;
      try {
        url = new URL(link.href);
      } catch {
        return;
      }
      if (!/(^|\.)getyourguide\.com$/i.test(url.hostname)) return;
      const gtag = (window as unknown as { gtag?: Gtag }).gtag;
      if (typeof gtag !== "function") return;
      gtag("event", "affiliate_click", {
        tour_id: url.pathname.match(/-(t\d+)\/?$/)?.[1] ?? "unknown",
        placement: link.closest("[data-placement]")?.getAttribute("data-placement") ?? "other",
        page_path: window.location.pathname,
        transport_type: "beacon",
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("auxclick", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onClick, { capture: true });
    };
  }, []);
  return null;
}
