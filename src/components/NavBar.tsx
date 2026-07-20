import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Auth section is client-only to avoid Clerk SSR issues with placeholder keys
const AuthSection = dynamic(() => import("@/components/AuthSection"), {
  ssr: false,
  loading: () => (
    <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
  ),
});

export default function NavBar() {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-white hover:text-teal-400 transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-teal-400"
          >
            <path
              d="M13 2L3 14h6l-2 8 10-12h-6l2-8z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span>SendWell</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              router.pathname === "/"
                ? "text-teal-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${
              router.pathname === "/dashboard"
                ? "text-teal-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/#pricing"
            className={`text-sm font-medium transition-colors ${
              router.pathname === "/" && router.asPath.includes("pricing")
                ? "text-teal-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Pricing
          </Link>
          <AuthSection />
        </div>
      </div>
    </nav>
  );
}
