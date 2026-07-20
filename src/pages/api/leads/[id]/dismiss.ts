import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  const result = db().prepare("UPDATE leads SET status = 'dismissed' WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Lead not found" });
  }

  res.status(200).json({ success: true, status: "dismissed" });
}
