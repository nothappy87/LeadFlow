import { SignIn } from "@clerk/nextjs";
import Head from "next/head";
import dynamic from "next/dynamic";

const ClerkSignIn = dynamic(() => Promise.resolve({ default: SignIn }), { ssr: false });

export default function SignInPage() {
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
