import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { getPlanLimits } from "@/lib/plans";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const d = db();

  // Get user plan info
  let plan = d.prepare("SELECT * FROM user_plans WHERE user_id = ?").get(userId) as {
    plan: string;
    leads_used_this_month: number;
    month_reset: string;
  } | undefined;

  if (!plan) {
    const now = new Date();
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      .toISOString()
      .slice(0, 10);
    d.prepare(
      "INSERT INTO user_plans (user_id, plan, leads_used_this_month, month_reset) VALUES (?, 'free', 0, ?)"
    ).run(userId, resetDate);
    plan = { plan: "free", leads_used_this_month: 0, month_reset: resetDate };
  }

  // Monthly reset check
  const now = new Date();
  const resetDate = new Date(plan.month_reset);
  if (now >= resetDate) {
    const newReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      .toISOString()
      .slice(0, 10);
    d.prepare(
      "UPDATE user_plans SET leads_used_this_month = 0, month_reset = ?, updated_at = datetime('now') WHERE user_id = ?"
    ).run(newReset, userId);
    plan.leads_used_this_month = 0;
    plan.month_reset = newReset;
  }

  const { leadsLimit } = getPlanLimits(plan.plan);

  // Handle query parameters: category, status, sort, page, limit
  const { category, status, sort, page, limit } = req.query;

  let query = `
    SELECT l.*, c.name AS category_name, c.slug AS category_slug
    FROM leads l
    JOIN categories c ON l.category_id = c.id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  // By default, hide dismissed leads
  const statusFilter = typeof status === "string" ? status : "active";
  if (statusFilter === "active") {
    query += " AND l.status != 'dismissed'";
  } else if (["new", "saved", "dismissed"].includes(statusFilter)) {
    query += " AND l.status = ?";
    params.push(statusFilter);
  }

  if (category && typeof category === "string") {
    query += " AND c.slug = ?";
    params.push(category);
  }

  // Sort
  const sortBy = typeof sort === "string" ? sort : "score";
  switch (sortBy) {
    case "newest":
      query += " ORDER BY l.created_at DESC";
      break;
    case "oldest":
      query += " ORDER BY l.created_at ASC";
      break;
    case "company":
      query += " ORDER BY l.company_name ASC";
      break;
    case "score":
    default:
      query += " ORDER BY l.score DESC";
      break;
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(String(page || "1"), 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(String(limit || "50"), 10) || 50));
  const offset = (pageNum - 1) * limitNum;

  query += " LIMIT ? OFFSET ?";
  params.push(limitNum, offset);

  const leads = d.prepare(query).all(...params);

  // Count total for pagination
  let countQuery = `
    SELECT COUNT(*) as cnt
    FROM leads l
    JOIN categories c ON l.category_id = c.id
    WHERE 1=1
  `;
  const countParams: (string | number)[] = [];

  if (statusFilter === "active") {
    countQuery += " AND l.status != 'dismissed'";
  } else if (["new", "saved", "dismissed"].includes(statusFilter)) {
    countQuery += " AND l.status = ?";
    countParams.push(statusFilter);
  }

  if (category && typeof category === "string") {
    countQuery += " AND c.slug = ?";
    countParams.push(category);
  }

  const totalCount = (d.prepare(countQuery).get(...countParams) as { cnt: number }).cnt;
  const totalPages = Math.ceil(totalCount / limitNum);

  return res.status(200).json({
    leads,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      totalPages,
    },
    planInfo: {
      plan: plan.plan,
      leadsUsed: plan.leads_used_this_month,
      leadsLimit,
      resetsAt: plan.month_reset,
    },
  });
}
