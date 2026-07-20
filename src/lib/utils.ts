/**
 * Parse a lead description string to extract structured enriched data.
 * The PDL integration embeds employee count, revenue, location into the description.
 */
export interface EnrichedFields {
  locality?: string;
  employeeCount?: number;
  revenue?: string;
  tags?: string[];
}

export function parseEnrichedFields(description: string): {
  cleanDescription: string;
  enriched: EnrichedFields;
} {
  const enriched: EnrichedFields = {};

  // Extract locality: "based in <city>"
  const localityMatch = description.match(/based in ([\w\s]+?)(?:\.|,| with|\s*$)/);
  if (localityMatch) {
    enriched.locality = localityMatch[1].trim();
  }

  // Extract employee count: "with <N> employees"
  const empMatch = description.match(/with ([\d,]+) employees?/);
  if (empMatch) {
    enriched.employeeCount = parseInt(empMatch[1].replace(/,/g, ""), 10);
  }

  // Extract revenue: "Estimated revenue: <amount>"
  const revMatch = description.match(/Estimated revenue:\s*([^.]*)/);
  if (revMatch) {
    enriched.revenue = revMatch[1].trim();
  }

  // Extract tags: "Tags: <tags>"
  const tagsMatch = description.match(/Tags:\s*([^.]*)/);
  if (tagsMatch) {
    enriched.tags = tagsMatch[1]
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // Build a clean description without the structured data
  let clean = description;
  // Remove revenue estimate
  clean = clean.replace(/\s*Estimated revenue: [^.]*\.?/, "");
  // Remove tags
  clean = clean.replace(/\s*Tags: [^.]*\.?/, "");

  return { cleanDescription: clean.trim(), enriched };
}

/**
 * Check if Clerk keys are still placeholders.
 */
export function isPlaceholderClerkKey(): boolean {
  if (typeof window === "undefined") return false;
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  return (
    !key ||
    key.includes("placeholder") ||
    key.startsWith("pk_test_dGhpcy1pcy1hLXBsYWNlaG9sZGVy")
  );
}
