"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AuthSection() {
  let isLoaded = false;
  let isSignedIn = false;

  try {
    const auth = useAuth();
    isLoaded = auth.isLoaded;
    isSignedIn = auth.isSignedIn ?? false;
  } catch {
    // Clerk not available (placeholder keys) — show sign-in links instead
    return <FallbackAuthLinks />;
  }

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonAvatarBox: "w-8 h-8",
          },
        }}
      />
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="text-sm font-medium px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
        Sign In
      </button>
    </SignInButton>
  );
}

/** Fallback when Clerk isn't configured — shows direct sign-in/sign-up links */
function FallbackAuthLinks() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/sign-in"
        className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className="text-sm font-medium px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
