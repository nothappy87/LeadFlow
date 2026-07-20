import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { getPlanLimits, canGenerateLeads } from "@/lib/plans";
import { searchCompanies, mapToLead } from "@/lib/pdl";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { category, count } = req.body || {};
  const limit = Math.min(Number(count) || 5, 20); // cap at 20 per request

  if (!category || typeof category !== "string") {
    return res.status(400).json({ error: "Category is required" });
  }

  const d = db();

  // Check user plan and quota
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

  // Monthly reset
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

  if (!canGenerateLeads(plan.plan, plan.leads_used_this_month)) {
    const { leadsLimit } = getPlanLimits(plan.plan);
    return res.status(429).json({
      error: "Monthly lead limit reached",
      plan: plan.plan,
      leadsUsed: plan.leads_used_this_month,
      leadsLimit,
    });
  }

  // How many leads can we still generate this month?
  const remaining = Math.min(
    limit,
    getPlanLimits(plan.plan).leadsLimit - plan.leads_used_this_month
  );

  // Verify the category slug exists
  const categoryRow = d
    .prepare("SELECT id, slug FROM categories WHERE slug = ?")
    .get(category) as { id: number; slug: string } | undefined;

  if (!categoryRow) {
    return res.status(400).json({ error: "Invalid category" });
  }

  // Fetch from PDL (or mock fallback)
  let companies;
  try {
    companies = await searchCompanies(category, remaining);
  } catch {
    return res.status(502).json({ error: "Lead generation service unavailable" });
  }

  // Insert generated leads into the database
  const insertLead = d.prepare(`
    INSERT INTO leads (category_id, company_name, contact_name, email, phone, description, score, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))
  `);

  const generated: Array<{
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
  }> = [];

  const insertMany = d.transaction(() => {
    for (const company of companies) {
      const lead = mapToLead(category, company);
      const result = insertLead.run(
        categoryRow.id,
        lead.company_name,
        lead.contact_name,
        lead.email,
        lead.phone,
        lead.description,
        lead.score
      );
      generated.push({
        id: Number(result.lastInsertRowid),
        company_name: lead.company_name,
        contact_name: lead.contact_name,
        email: lead.email,
        phone: lead.phone,
        description: lead.description,
        score: lead.score,
        status: "new",
        category_id: categoryRow.id,
        created_at: new Date().toISOString(),
      });
    }
  });

  insertMany();

  // Update lead usage count
  d.prepare(
    "UPDATE user_plans SET leads_used_this_month = leads_used_this_month + ?, updated_at = datetime('now') WHERE user_id = ?"
  ).run(generated.length, userId);

  const { leadsLimit } = getPlanLimits(plan.plan);
  const newUsed = plan.leads_used_this_month + generated.length;

  return res.status(200).json({
    generated: generated.length,
    leads: generated,
    planInfo: {
      plan: plan.plan,
      leadsUsed: newUsed,
      leadsLimit,
      resetsAt: plan.month_reset,
    },
  });
}
