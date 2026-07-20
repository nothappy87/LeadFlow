import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <NavBar />
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
