import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  const result = db().prepare("UPDATE leads SET status = 'saved' WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Lead not found" });
  }

  res.status(200).json({ success: true, status: "saved" });
}
