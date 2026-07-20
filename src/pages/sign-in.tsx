import { GetServerSideProps } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";

// Detect placeholder to show fallback
function isPlaceholderKey(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return (
    !key ||
    key.includes("placeholder") ||
    key.startsWith("pk_test_dGhpcy1pcy1hLXBsYWNlaG9sZGVy")
  );
}

// Use getServerSideProps to prevent static generation (avoids Clerk SSR errors)
export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

const ClerkSignIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignIn })),
  { ssr: false }
);

export default function SignInPage() {
  if (isPlaceholderKey()) {
    return (
      <>
        <Head>
          <title>Sign In — SendWell</title>
        </Head>
        <main className="min-h-[calc(100vh-3.5rem)] bg-gray-950 flex items-center justify-center px-4">
          <div className="text-center bg-gray-900 border border-amber-500/30 rounded-2xl p-8 max-w-md">
            <div className="flex justify-center mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-400">
                <path d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Clerk keys not configured
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Set your Clerk publishable key and secret key in{" "}
              <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs text-amber-300">
                .env.local
              </code>{" "}
              to enable authentication.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In — SendWell</title>
      </Head>
      <main className="min-h-[calc(100vh-3.5rem)] bg-gray-950 flex items-center justify-center px-4">
        <ClerkSignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold",
              card: "bg-gray-900 border border-gray-800 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "border-gray-700 text-white",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-gray-800 border-gray-700 text-white",
              footerActionLink: "text-teal-400 hover:text-teal-300",
              dividerLine: "bg-gray-700",
              dividerText: "text-gray-500",
            },
          }}
        />
      </main>
    </>
  );
}
