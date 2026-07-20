import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

export default function AuthSection() {
  const { isSignedIn, isLoaded } = useAuth();

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
