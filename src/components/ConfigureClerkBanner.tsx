/**
 * Shown on the landing page when Clerk keys are still placeholders.
 * Doesn't crash — just shows a friendly configuration banner.
 */
export default function ConfigureClerkBanner() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-4 mb-8 text-center animate-fade-in">
      <div className="flex items-center justify-center gap-2 mb-1">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-amber-400 shrink-0"
        >
          <path
            d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-amber-300 font-semibold text-sm">
          Clerk keys not configured
        </span>
      </div>
      <p className="text-amber-200/70 text-sm max-w-md mx-auto">
        Set your{" "}
        <code className="bg-amber-500/20 px-1.5 py-0.5 rounded text-xs text-amber-200">
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        </code>{" "}
        and{" "}
        <code className="bg-amber-500/20 px-1.5 py-0.5 rounded text-xs text-amber-200">
          CLERK_SECRET_KEY
        </code>{" "}
        in{" "}
        <code className="bg-amber-500/20 px-1.5 py-0.5 rounded text-xs text-amber-200">
          .env.local
        </code>{" "}
        to enable authentication. The app will render with limited functionality
        until configured.
      </p>
    </div>
  );
}
