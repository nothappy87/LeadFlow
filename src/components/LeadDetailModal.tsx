import { useEffect, useCallback } from "react";

interface Lead {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  description: string;
  score: number;
  status: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  created_at: string;
}

interface Props {
  lead: Lead;
  onClose: () => void;
  onSave: (id: number) => void;
  onDismiss: (id: number) => void;
}

function scoreBadge(score: number) {
  if (score >= 70) {
    return { color: "bg-green-600", label: "Hot", textColor: "text-green-100" };
  }
  if (score >= 40) {
    return { color: "bg-yellow-600", label: "Warm", textColor: "text-yellow-100" };
  }
  return { color: "bg-red-600", label: "Cold", textColor: "text-red-100" };
}

export default function LeadDetailModal({ lead, onClose, onSave, onDismiss }: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const badge = scoreBadge(lead.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">{lead.company_name}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{lead.contact_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Score + Category */}
        <div className="px-6 py-3 flex items-center gap-3 border-b border-gray-800">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color} ${badge.textColor}`}
          >
            {badge.label} · {lead.score}
          </span>
          {lead.category_name && (
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
              {lead.category_name}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              About
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">{lead.description}</p>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Email
              </h3>
              <a
                href={`mailto:${lead.email}`}
                className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
              >
                {lead.email}
              </a>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Phone
              </h3>
              <a
                href={`tel:${lead.phone}`}
                className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
              >
                {lead.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-800 bg-gray-900/50">
          <button
            onClick={() => onDismiss(lead.id)}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={() => onSave(lead.id)}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-colors"
          >
            Save Lead
          </button>
        </div>
      </div>
    </div>
  );
}
