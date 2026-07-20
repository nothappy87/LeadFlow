import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const lead = db()
    .prepare(
      `SELECT l.*, c.name as category_name, c.slug as category_slug
       FROM leads l
       JOIN categories c ON l.category_id = c.id
       WHERE l.id = ?`
    )
    .get(id);

  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  res.status(200).json({ lead });
}
