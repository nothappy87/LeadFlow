import { useState } from "react";

interface GenerateLeadsButtonProps {
  category: string;
  onSuccess: (data: {
    generated: number;
    leads: Array<{
      id: number;
      company_name: string;
      contact_name: string;
      email: string;
      phone: string;
      description: string;
      score: number;
      status: string;
      category_id: number;
      created_at: string;
    }>;
    planInfo: {
      plan: string;
      leadsUsed: number;
      leadsLimit: number;
      resetsAt: string;
    };
  }) => void;
  onPlanInfoUpdate: (planInfo: {
    plan: string;
    leadsUsed: number;
    leadsLimit: number;
    resetsAt: string;
  }) => void;
  disabled?: boolean;
}

export default function GenerateLeadsButton({
  category,
  onSuccess,
  onPlanInfoUpdate,
  disabled = false,
}: GenerateLeadsButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handleGenerate = async () => {
    if (!category || loading) return;

    setLoading(true);
    setError(null);
    setShowUpgradePrompt(false);

    try {
      const res = await fetch("/api/leads/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, count: 5 }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          // Quota exceeded
          setShowUpgradePrompt(true);
          if (data.planInfo) {
            onPlanInfoUpdate(data.planInfo);
          }
          return;
        }
        if (res.status === 401) {
          setError("Please sign in to generate leads.");
          return;
        }
        setError(data.error || "Failed to generate leads.");
        return;
      }

      // Success
      onSuccess(data);
      if (data.planInfo) {
        onPlanInfoUpdate(data.planInfo);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <button
        onClick={handleGenerate}
        disabled={loading || disabled || !category}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-teal-600/25 active:scale-[0.98] disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Generate Leads
          </>
        )}
      </button>

      {/* Error state */}
      {error && (
        <p className="text-sm text-red-400 animate-slide-down">{error}</p>
      )}

      {/* Upgrade prompt */}
      {showUpgradePrompt && (
        <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl animate-slide-down">
          <p className="text-sm text-amber-300">
            You&apos;ve reached your monthly lead limit.
          </p>
          <a
            href="/#pricing"
            className="shrink-0 text-sm font-semibold px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Upgrade
          </a>
          <button
            onClick={() => setShowUpgradePrompt(false)}
            className="text-amber-400 hover:text-amber-300 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
