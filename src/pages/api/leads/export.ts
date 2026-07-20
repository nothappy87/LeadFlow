import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const d = db();

  // Accept optional category filter
  const { category } = req.query;

  let query = `
    SELECT l.company_name, l.contact_name, l.email, l.phone, l.description,
           l.score, l.status, c.name AS category, l.created_at
    FROM leads l
    JOIN categories c ON l.category_id = c.id
    WHERE l.status != 'dismissed'
  `;
  const params: string[] = [];

  if (category && typeof category === "string") {
    query += " AND c.slug = ?";
    params.push(category);
  }

  query += " ORDER BY l.score DESC LIMIT 500";

  const leads = d.prepare(query).all(...params) as Array<Record<string, unknown>>;

  // Build CSV
  const headers = [
    "Company Name",
    "Contact Name",
    "Email",
    "Phone",
    "Description",
    "Score",
    "Status",
    "Category",
    "Created At",
  ];

  const escapeCSV = (val: unknown): string => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = [headers.join(",")];
  for (const lead of leads) {
    csvRows.push(
      headers
        .map((h) => {
          const key = h.toLowerCase().replace(/ /g, "_");
          return escapeCSV(lead[key]);
        })
        .join(",")
    );
  }

  const csv = csvRows.join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="sendwell-leads-${new Date().toISOString().slice(0, 10)}.csv"`
  );
  res.status(200).send(csv);
}
