"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function HeroCTA() {
  let isSignedIn = false;
  let isLoaded = false;

  try {
    const auth = useAuth();
    isLoaded = auth.isLoaded;
    isSignedIn = auth.isSignedIn ?? false;
  } catch {
    // Clerk not available (placeholder keys) — show default CTA
    return <DefaultCTA />;
  }

  // Show a consistent fallback while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <div className="px-8 py-3.5 bg-amber-500 text-white rounded-xl text-base font-semibold opacity-50">
          Get Started - It&apos;s Free
        </div>
        <div className="px-8 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-base font-medium text-gray-300 opacity-50">
          View Demo Leads
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/dashboard"
          className="px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-teal-600/25 active:scale-[0.98]"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return <DefaultCTA />;
}

function DefaultCTA() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/sign-up"
        className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98]"
      >
        Get Started - It&apos;s Free
      </Link>
      <Link
        href="/dashboard"
        className="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-base font-medium text-gray-300 transition-all duration-200 active:scale-[0.98]"
      >
        View Demo Leads
      </Link>
    </div>
  );
}
