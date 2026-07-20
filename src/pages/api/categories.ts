import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const categories = db().prepare("SELECT * FROM categories ORDER BY name").all();
  res.status(200).json({ categories });
}
