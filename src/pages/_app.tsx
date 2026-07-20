import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import NavBar from "@/components/NavBar";
import "@/styles/globals.css";

// Detect placeholder Clerk keys
function isPlaceholderKey(): boolean {
  if (typeof window !== "undefined") {
    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
    return (
      !key ||
      key.includes("placeholder") ||
      key.startsWith("pk_test_dGhpcy1pcy1hLXBsYWNlaG9sZGVy")
    );
  }
  // Server-side: NEXT_PUBLIC_ vars are inlined at build time
  return true; // safe default for SSR with placeholder keys
}

// Only load Clerk client-side and only when keys are valid
const ClerkProviderWrapper = dynamic(
  () =>
    import("@clerk/nextjs").then((mod) => {
      const ClerkProv = mod.ClerkProvider;
      return {
        default: ({ children }: { children: React.ReactNode }) => (
          <ClerkProv
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          >
            {children}
          </ClerkProv>
        ),
      };
    }),
  { ssr: false }
);

function SafeClerkProvider({ children }: { children: React.ReactNode }) {
  if (isPlaceholderKey()) {
    return <>{children}</>;
  }
  return <ClerkProviderWrapper>{children}</ClerkProviderWrapper>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SafeClerkProvider>
      <NavBar />
      <Component {...pageProps} />
    </SafeClerkProvider>
  );
}
