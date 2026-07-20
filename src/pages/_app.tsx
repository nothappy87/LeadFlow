import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // Don't show nav on 404 or error pages - only on known routes
  const showNav = router.pathname === "/" || router.pathname === "/dashboard";

  return (
    <>
      {showNav && <NavBar />}
      <Component {...pageProps} />
    </>
  );
}
