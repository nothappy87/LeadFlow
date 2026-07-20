import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const totalLeads = (
    db().prepare("SELECT COUNT(*) as cnt FROM leads WHERE status != 'dismissed'").get() as { cnt: number }
  ).cnt;

  const leadsThisWeek = (
    db().prepare(
      "SELECT COUNT(*) as cnt FROM leads WHERE status != 'dismissed' AND created_at >= datetime('now', '-7 days')"
    ).get() as { cnt: number }
  ).cnt;

  const savedCount = (
    db().prepare("SELECT COUNT(*) as cnt FROM leads WHERE status = 'saved'").get() as { cnt: number }
  ).cnt;

  const byCategory = db()
    .prepare(
      `SELECT c.name as category, c.slug, COUNT(l.id) as count
       FROM categories c
       LEFT JOIN leads l ON l.category_id = c.id AND l.status != 'dismissed'
       GROUP BY c.id
       ORDER BY count DESC`
    )
    .all();

  res.status(200).json({
    totalLeads,
    leadsThisWeek,
    savedCount,
    byCategory,
  });
}
