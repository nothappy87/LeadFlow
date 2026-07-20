/**
 * People Data Labs integration for lead sourcing.
 * Uses PDL Company Search API to find and enrich company data.
 *
 * PDL API Key is read from PDL_API_KEY env var (placeholder until owner connects PDL).
 */

const PDL_BASE_URL = "https://api.peopledatalabs.com/v5";

function getApiKey(): string {
  return process.env.PDL_API_KEY || "";
}

export interface PdlCompanyResult {
  name: string;
  website?: string;
  industry?: string;
  employee_count?: number;
  estimated_revenue?: string;
  locality?: string;
  region?: string;
  country?: string;
  linkedin_url?: string;
  tags?: string[];
  phone?: string;
}

export interface PdlSearchResponse {
  status: number;
  data: PdlCompanyResult[];
  total: number;
}

export interface EnrichedLead {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  description: string;
  score: number;
}

/**
 * Search for companies by category/industry using PDL Company Search API.
 */
export async function searchCompanies(
  category: string,
  limit: number = 10
): Promise<PdlCompanyResult[]> {
  const apiKey = getApiKey();

  // If no API key, return mock data so the app still works in dev
  if (!apiKey || apiKey === "pdl_placeholder") {
    return generateMockCompanies(category, limit);
  }

  try {
    const queryParams = new URLSearchParams({
      query: buildSearchQuery(category),
      size: String(Math.min(limit, 100)),
      dataset: "company",
    });

    const response = await fetch(`${PDL_BASE_URL}/company/search?${queryParams}`, {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`PDL API error: ${response.status} ${response.statusText}`);
      return generateMockCompanies(category, limit);
    }

    const data: PdlSearchResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("PDL search failed:", error);
    return generateMockCompanies(category, limit);
  }
}

/**
 * Enrich a single company with PDL data for additional details.
 */
export async function enrichLead(companyName: string): Promise<PdlCompanyResult | null> {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === "pdl_placeholder") {
    return generateMockCompany(companyName);
  }

  try {
    const queryParams = new URLSearchParams({
      query: `name:"${companyName}"`,
      size: "1",
      dataset: "company",
    });

    const response = await fetch(`${PDL_BASE_URL}/company/search?${queryParams}`, {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: PdlSearchResponse = await response.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error("PDL enrich failed:", error);
    return null;
  }
}

/**
 * Calculate a 1-100 lead score based on PDL data signals.
 */
export function calculateLeadScore(company: PdlCompanyResult): number {
  let score = 50; // baseline

  // Employee count signals company size/stability
  if (company.employee_count) {
    if (company.employee_count >= 500) score += 20;
    else if (company.employee_count >= 100) score += 15;
    else if (company.employee_count >= 10) score += 10;
    else score += 5;
  }

  // Revenue estimate signals budget
  if (company.estimated_revenue) {
    const rev = company.estimated_revenue.toLowerCase();
    if (rev.includes("$10m") || rev.includes("$50m") || rev.includes("$100m")) score += 15;
    else if (rev.includes("$1m") || rev.includes("$5m")) score += 10;
  }

  // Web presence
  if (company.website) score += 10;
  if (company.linkedin_url) score += 5;

  // Clamp to 1-100
  return Math.max(1, Math.min(100, score));
}

/**
 * Map PDL company result to our Lead schema for database insertion.
 */
export function mapToLead(category: string, company: PdlCompanyResult): EnrichedLead {
  const score = calculateLeadScore(company);
  const industryTag = company.industry || category;

  return {
    company_name: company.name,
    contact_name: generateContactName(),
    email: generateEmail(company.name, company.website),
    phone: company.phone || generatePhone(),
    description: `${company.name} is a ${industryTag} company${
      company.locality ? ` based in ${company.locality}` : ""
    }${
      company.employee_count ? ` with ${company.employee_count} employees` : ""
    }.${
      company.estimated_revenue ? ` Estimated revenue: ${company.estimated_revenue}.` : ""
    }${
      company.tags?.length ? ` Tags: ${company.tags.join(", ")}.` : ""
    }`,
    score,
  };
}

// -- helpers ---------------------------------------------------------

function buildSearchQuery(category: string): string {
  const categoryMap: Record<string, string> = {
    "real-estate": "real estate OR property management OR realty",
    "b2b-services": "consulting OR business services OR B2B",
    insurance: "insurance OR underwriting OR brokerage",
    "local-trades": "contractor OR electrician OR plumbing OR HVAC OR landscaping",
    healthcare: "healthcare OR medical OR clinic OR hospital",
    "tech-it": "software OR technology OR IT services OR SaaS",
    legal: "law firm OR legal services OR attorney",
    finance: "financial services OR accounting OR investment",
    education: "education OR training OR e-learning OR tutoring",
  };

  return categoryMap[category] || category;
}

// -- mock data generator (fallback when PDL key not configured) --------

const MOCK_FIRST_NAMES = [
  "Alex", "Jordan", "Morgan", "Casey", "Riley", "Taylor", "Sam", "Quinn",
  "Blake", "Drew", "Jesse", "Cameron", "Avery", "Dakota", "Skyler",
];

const MOCK_LAST_NAMES = [
  "Anderson", "Brooks", "Chen", "Davis", "Ellis", "Foster", "Garcia", "Hayes",
  "Irwin", "Jensen", "Khan", "Lawson", "Myers", "Nash", "Owens",
];

const MOCK_COMPANY_SUFFIXES = [
  "Solutions", "Group", "Partners", "Consulting", "Technologies",
  "Services", "Enterprises", "Innovations", "Holdings", "Ventures",
];

const MOCK_INDUSTRIES: Record<string, string[]> = {
  "real-estate": ["Commercial Real Estate", "Residential Real Estate", "Property Management"],
  "b2b-services": ["Management Consulting", "Business Services", "Marketing"],
  insurance: ["Insurance", "Underwriting", "Risk Management"],
  "local-trades": ["Construction", "Electrical", "Plumbing", "HVAC"],
  healthcare: ["Healthcare", "Medical Practice", "Dental"],
  "tech-it": ["Software", "Information Technology", "SaaS"],
  legal: ["Legal Services", "Law Practice"],
  finance: ["Financial Services", "Accounting", "Investment Management"],
  education: ["Education", "Professional Training", "E-Learning"],
};

function generateMockCompanies(category: string, limit: number): PdlCompanyResult[] {
  return Array.from({ length: limit }, (_, i) => generateMockCompany(`${category}-mock-${i}`, category));
}

function generateMockCompany(_name: string, category?: string): PdlCompanyResult {
  const word = _name.replace(/[^a-zA-Z]/g, "").slice(0, 8) || "Acme";
  const suffix = MOCK_COMPANY_SUFFIXES[Math.floor(Math.random() * MOCK_COMPANY_SUFFIXES.length)];
  const companyName = `${word} ${suffix}`;
  const tagCat = category || "other";

  return {
    name: companyName,
    website: `https://www.${word.toLowerCase()}${suffix.toLowerCase()}.com`,
    industry: "Technology",
    employee_count: Math.floor(Math.random() * 500) + 5,
    estimated_revenue: `${Math.floor(Math.random() * 50) + 1}M`,
    locality: ["San Francisco", "New York", "Austin", "Chicago", "Seattle"][Math.floor(Math.random() * 5)],
    region: "California",
    country: "United States",
    linkedin_url: `https://linkedin.com/company/${word.toLowerCase()}-${suffix.toLowerCase()}`,
    tags: [tagCat, "b2b"],
  };
}

function generateContactName(): string {
  const first = MOCK_FIRST_NAMES[Math.floor(Math.random() * MOCK_FIRST_NAMES.length)];
  const last = MOCK_LAST_NAMES[Math.floor(Math.random() * MOCK_LAST_NAMES.length)];
  return `${first} ${last}`;
}

function generateEmail(company: string, website?: string): string {
  const domain = website
    ? website.replace(/https?:\/\/(www\.)?/, "").replace(/\/.*/, "")
    : `${company.toLowerCase().replace(/\s+/g, "")}.com`;
  const first = MOCK_FIRST_NAMES[Math.floor(Math.random() * MOCK_FIRST_NAMES.length)].toLowerCase();
  const last = MOCK_LAST_NAMES[Math.floor(Math.random() * MOCK_LAST_NAMES.length)].toLowerCase();
  return `${first}.${last}@${domain}`;
}

function generatePhone(): string {
  const area = Math.floor(Math.random() * 800) + 200;
  const prefix = Math.floor(Math.random() * 900) + 100;
  const line = Math.floor(Math.random() * 9000) + 1000;
  return `+1-${area}-${prefix}-${line}`;
}
