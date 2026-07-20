export interface PlanConfig {
  name: string;
  leadsPerMonth: number;
  features: string[];
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    name: "Free",
    leadsPerMonth: 10,
    features: ["10 leads/month", "5 categories", "Basic scoring"],
  },
  pro: {
    name: "Pro",
    leadsPerMonth: 100,
    features: ["100 leads/month", "All categories", "CRM export", "Email alerts"],
  },
  business: {
    name: "Business",
    leadsPerMonth: 500,
    features: ["500 leads/month", "Priority scoring", "Advanced filters", "API access", "Priority support"],
  },
};

export function getPlanLimits(plan: string): { leadsLimit: number } {
  const config = PLANS[plan] || PLANS.free;
  return { leadsLimit: config.leadsPerMonth };
}

export function getUserPlanInfo(
  plan: string,
  leadsUsed: number,
  monthReset: string
): { plan: string; leadsUsed: number; leadsLimit: number; resetsAt: string } {
  const { leadsLimit } = getPlanLimits(plan);
  return {
    plan,
    leadsUsed,
    leadsLimit,
    resetsAt: monthReset,
  };
}

export function canGenerateLeads(plan: string, leadsUsed: number): boolean {
  const { leadsLimit } = getPlanLimits(plan);
  return leadsUsed < leadsLimit;
}
