import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;
  const d = db();

  // GET — single lead detail
  if (req.method === "GET") {
    const lead = d
      .prepare(
        `SELECT l.*, c.name AS category_name, c.slug AS category_slug
         FROM leads l
         JOIN categories c ON l.category_id = c.id
         WHERE l.id = ?`
      )
      .get(id);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    return res.status(200).json({ lead });
  }

  // PATCH — update lead status (or other fields)
  if (req.method === "PATCH") {
    const { status, company_name, contact_name, email, phone, description, score } =
      req.body || {};

    // Validate status if provided
    if (status && !["new", "saved", "dismissed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Build dynamic UPDATE
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (status) {
      updates.push("status = ?");
      values.push(status);
    }
    if (company_name) {
      updates.push("company_name = ?");
      values.push(company_name);
    }
    if (contact_name) {
      updates.push("contact_name = ?");
      values.push(contact_name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (description) {
      updates.push("description = ?");
      values.push(description);
    }
    if (score !== undefined) {
      const scoreNum = Number(score);
      if (scoreNum < 1 || scoreNum > 100) {
        return res.status(400).json({ error: "Score must be between 1 and 100" });
      }
      updates.push("score = ?");
      values.push(scoreNum);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id as string);
    const result = d
      .prepare(`UPDATE leads SET ${updates.join(", ")} WHERE id = ?`)
      .run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Return updated lead
    const updated = d
      .prepare(
        `SELECT l.*, c.name AS category_name, c.slug AS category_slug
         FROM leads l
         JOIN categories c ON l.category_id = c.id
         WHERE l.id = ?`
      )
      .get(id);

    return res.status(200).json({ lead: updated });
  }

  // DELETE — remove a lead
  if (req.method === "DELETE") {
    const result = d.prepare("DELETE FROM leads WHERE id = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
