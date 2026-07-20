import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState, useCallback } from "react";
import db from "@/lib/db";
import LeadDetailModal from "@/components/LeadDetailModal";

// ── types ──────────────────────────────────────────────

interface Category {
  id: number;
  name: string;
  slug: string;
}

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

interface Stats {
  totalLeads: number;
  leadsThisWeek: number;
  savedCount: number;
}

interface Props {
  categories: Category[];
  leads: Lead[];
  stats: Stats;
}

// ── helpers ────────────────────────────────────────────

function scoreBadge(score: number) {
  if (score >= 70) return { bg: "bg-green-600", label: "Hot", ring: "ring-green-500/30" };
  if (score >= 40) return { bg: "bg-yellow-600", label: "Warm", ring: "ring-yellow-500/30" };
  return { bg: "bg-red-600", label: "Cold", ring: "ring-red-500/30" };
}

// ── skeleton card ──────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-5 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
        <div className="skeleton h-6 w-12 rounded-full" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-7 w-16 rounded" />
        <div className="skeleton h-7 w-16 rounded" />
      </div>
    </div>
  );
}

// ── page component ─────────────────────────────────────

export default function Dashboard({ categories, leads: serverLeads, stats: serverStats }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentLeads, setCurrentLeads] = useState<Lead[]>(serverLeads);
  const [stats] = useState<Stats>(serverStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [dismissing, setDismissing] = useState<Set<number>>(new Set());

  // Fetch leads by category
  const fetchLeads = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads?category=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const data = await res.json();
      setCurrentLeads(data.leads || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setCurrentLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Category change handler
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug) {
      fetchLeads(slug);
    } else {
      setCurrentLeads(serverLeads);
      setError(null);
    }
  };

  // Save lead — optimistically remove from view
  const handleSave = useCallback(async (id: number) => {
    setDismissing((prev) => new Set(prev).add(id));
    try {
      await fetch(`/api/leads/${id}/save`, { method: "POST" });
    } catch {
      // silently fail — card stays removed optimistically
    }
    setCurrentLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLead(null);
    setDismissing((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Dismiss lead — optimistically remove from view
  const handleDismiss = useCallback(async (id: number) => {
    setDismissing((prev) => new Set(prev).add(id));
    try {
      await fetch(`/api/leads/${id}/dismiss`, { method: "POST" });
    } catch {
      // silently fail
    }
    setCurrentLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLead(null);
    setDismissing((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Derive which cards are being actioned (for opacity animation)
  const isAnimatingOut = (id: number) => dismissing.has(id);

  return (
    <>
      <Head>
        <title>Dashboard — LeadFlow</title>
      </Head>

      <main className="min-h-[calc(100vh-3.5rem)] bg-gray-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Browse qualified leads and grow your pipeline.
            </p>
          </div>

          {/* ── Stats bar ──────────────────────────── */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            {[
              { label: "Total Leads", value: stats.totalLeads, emoji: "📊" },
              { label: "This Week", value: stats.leadsThisWeek, emoji: "📅" },
              { label: "Saved", value: stats.savedCount, emoji: "⭐" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
              >
                <p className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center gap-1.5">
                  <span className="hidden sm:inline">{s.emoji}</span>
                  {s.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* ── Category selector ──────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <select
              className="bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors disabled:opacity-50"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={loading}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <p className="text-gray-500 text-sm">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading leads…
                </span>
              ) : (
                `${currentLeads.length} lead${currentLeads.length !== 1 ? "s" : ""} found`
              )}
            </p>
          </div>

          {/* ── Error state ────────────────────────── */}
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-800 rounded-xl p-4 flex items-center justify-between animate-slide-down">
              <p className="text-red-300 text-sm">
                Failed to load leads: {error}
              </p>
              <button
                onClick={() => selectedCategory && fetchLeads(selectedCategory)}
                className="text-sm px-3 py-1.5 bg-red-800 hover:bg-red-700 text-red-100 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Empty states ───────────────────────── */}
          {!loading && !error && currentLeads.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              {!selectedCategory ? (
                <>
                  <div className="text-5xl mb-4">👆</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Pick a category to get started
                  </h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Select your industry from the dropdown above and we&apos;ll surface the
                    best leads for your business.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No leads found
                  </h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    No leads available for this category right now. Try picking a
                    different one — there might be better matches elsewhere.
                  </p>
                </>
              )}
            </div>
          )}

          {/* ── Loading skeleton ───────────────────── */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* ── Lead cards ─────────────────────────── */}
          {!loading && !error && currentLeads.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentLeads.map((lead) => {
                const badge = scoreBadge(lead.score);
                const fading = isAnimatingOut(lead.id);
                return (
                  <div
                    key={lead.id}
                    className={`bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/5 group ${
                      fading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                          {lead.company_name}
                        </h3>
                        <p className="text-gray-500 text-sm truncate">
                          {lead.contact_name}
                        </p>
                      </div>
                      <span
                        className={`ml-2 shrink-0 px-2.5 py-1 rounded-full text-xs font-bold text-white ${badge.bg} ring-1 ${badge.ring}`}
                      >
                        {badge.label} · {lead.score}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {lead.description}
                    </p>

                    {/* Action buttons — stop click propagation */}
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="flex-1 text-xs px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-all duration-200 font-medium"
                        onClick={() => handleSave(lead.id)}
                      >
                        Save
                      </button>
                      <button
                        className="flex-1 text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-lg transition-all duration-200 font-medium"
                        onClick={() => handleDismiss(lead.id)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Lead detail modal ─────────────────────── */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSave={handleSave}
          onDismiss={handleDismiss}
        />
      )}
    </>
  );
}

// ── SSR data fetch ────────────────────────────────────

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const d = db();

  const categories = d.prepare("SELECT * FROM categories ORDER BY name").all() as Category[];

  const leads = d
    .prepare(
      `SELECT l.*, c.name AS category_name, c.slug AS category_slug
       FROM leads l
       JOIN categories c ON l.category_id = c.id
       WHERE l.status != 'dismissed'
       ORDER BY l.score DESC
       LIMIT 50`
    )
    .all() as Lead[];

  const totalLeads = (
    d.prepare("SELECT COUNT(*) as cnt FROM leads WHERE status != 'dismissed'").get() as { cnt: number }
  ).cnt;

  const leadsThisWeek = (
    d
      .prepare(
        "SELECT COUNT(*) as cnt FROM leads WHERE status != 'dismissed' AND created_at >= datetime('now', '-7 days')"
      )
      .get() as { cnt: number }
  ).cnt;

  const savedCount = (
    d.prepare("SELECT COUNT(*) as cnt FROM leads WHERE status = 'saved'").get() as { cnt: number }
  ).cnt;

  return {
    props: {
      categories,
      leads,
      stats: { totalLeads, leadsThisWeek, savedCount },
    },
  };
};
