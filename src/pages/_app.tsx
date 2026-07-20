import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Only show nav on dashboard (which is SSR-only, so Clerk works there)
  const showNav = router.pathname === "/dashboard";

  return (
    <>
      {showNav && <NavBar />}
      <Component {...pageProps} />
    </>
  );
}
