export const PLAN_PRICES = {
  starter: 2999,
  professional: 5999,
  business: 9999,
} as const;

export type PlanKey = keyof typeof PLAN_PRICES;

export function isValidPlan(planName: string): planName is PlanKey {
  return planName.toLowerCase() in PLAN_PRICES;
}

export function getPlanKey(planName: string): PlanKey {
  const name = planName.toLowerCase();
  if (name === "starter") return "starter";
  if (name === "professional") return "professional";
  if (name === "business") return "business";
  throw new Error(`Invalid plan: ${planName}`);
}

export const ADMIN_EMAILS = [
  "ratanlaldhakar0@gmail.com",
  "vasu@amrityogacenter.in",
  "shree@amrityogacenter.in"
];
