import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category } = req.query;

  let leads;
  if (category && typeof category === "string") {
    leads = db()
      .prepare(
        `SELECT l.*, c.name as category_name, c.slug as category_slug
         FROM leads l
         JOIN categories c ON l.category_id = c.id
         WHERE c.slug = ? AND l.status != 'dismissed'
         ORDER BY l.score DESC`
      )
      .all(category);
  } else {
    leads = db()
      .prepare(
        `SELECT l.*, c.name as category_name, c.slug as category_slug
         FROM leads l
         JOIN categories c ON l.category_id = c.id
         WHERE l.status != 'dismissed'
         ORDER BY l.score DESC`
      )
      .all();
  }

  res.status(200).json({ leads });
}
