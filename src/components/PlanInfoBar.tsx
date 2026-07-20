import Link from "next/link";

interface PlanInfoBarProps {
  plan: string;
  leadsUsed: number;
  leadsLimit: number;
  resetsAt?: string;
}

export default function PlanInfoBar({
  plan,
  leadsUsed,
  leadsLimit,
}: PlanInfoBarProps) {
  const quotaPercent =
    leadsLimit > 0
      ? Math.min(100, Math.round((leadsUsed / leadsLimit) * 100))
      : 0;

  const isFree = plan === "free";
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Plan info + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-sm text-gray-400">
              <span className="text-white font-semibold">{planLabel} Plan</span>
              {" — "}
              <span>
                {leadsUsed} of {leadsLimit} leads used this month
              </span>
            </p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                quotaPercent >= 90
                  ? "bg-red-500"
                  : quotaPercent >= 70
                  ? "bg-amber-500"
                  : "bg-teal-500"
              }`}
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
        </div>

        {/* Upgrade CTA for free users */}
        {isFree && (
          <Link
            href="/#pricing"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M13 7l5 5m0 0l-5 5m5-5H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Upgrade to Pro
          </Link>
        )}
      </div>
    </div>
  );
}
