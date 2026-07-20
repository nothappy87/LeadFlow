import Link from "next/link";
import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-white hover:text-blue-400 transition-colors"
        >
          <span className="text-2xl">⚡</span>
          <span>LeadFlow</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              router.pathname === "/"
                ? "text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${
              router.pathname === "/dashboard"
                ? "text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
