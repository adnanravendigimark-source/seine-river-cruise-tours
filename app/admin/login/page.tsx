import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin Login | Seine River Cruise Tours",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-center font-display text-lg font-bold text-stone-900">
          Seine River Cruise Tours
        </p>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-seine-amber">
          Content Admin
        </p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
