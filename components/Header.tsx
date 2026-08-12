import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-stone-900/10 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-900/70 md:flex">
          <Link href="/" className="hover:text-seine-teal">Home</Link>
          <Link href="/about" className="hover:text-seine-teal">About Us</Link>
          <Link href="/blog" className="hover:text-seine-teal">Blog</Link>
          <Link href="/contact" className="hover:text-seine-teal">Contact</Link>
        </nav>
        <Link
          href="/#tours"
          className="rounded-full bg-seine-amber px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-seine-amber/90"
        >
          Book a Cruise
        </Link>
      </div>
    </header>
  );
}
