import type { Validator } from "@shared/schema";

interface RiskRule {
  color: "good" | "neutral" | "bad";
  check: (validator: Validator) => boolean;
  message: (validator: Validator) => string;
}

const riskRules: RiskRule[] = [
  {
    color: "bad",
    check: (v) => v.slashed,
    message: (v) => `Validator ${v.stash} was slashed! Switch immediately!`,
  },
  {
    color: "bad", 
    check: (v) => v.commission > 2000, // 20%
    message: (v) => `Commission very high (${v.commission / 100}%)`,
  },
  {
    color: "bad",
    check: (v) => v.uptime < 85,
    message: (v) => `Low uptime (${v.uptime}%). Consider switching validators.`,
  },
  {
    color: "neutral",
    check: (v) => v.commission > 1000, // 10%
    message: (v) => `Commission moderate (${v.commission / 100}%)`,
  },
  {
    color: "neutral",
    check: (v) => v.uptime < 95,
    message: (v) => `Uptime could be better (${v.uptime}%)`,
  },
  {
    color: "good",
    check: () => true, // Default case
    message: (v) => `Validator ${v.stash} is performing well!`,
  },
];

export function evaluateValidatorRisk(validator: Validator) {
  for (const rule of riskRules) {
    if (rule.check(validator)) {
      return {
        type: rule.color,
        message: rule.message(validator),
      };
    }
  }
  
  return {
    type: "good" as const,
    message: `Validator ${validator.stash} is healthy!`,
  };
}

export function getRiskColor(validatorType: string): string {
  switch (validatorType) {
    case "good":
      return "text-success";
    case "neutral":
      return "text-warning";
    case "bad":
      return "text-danger";
    default:
      return "text-slate-400";
  }
}

export function getRiskBadgeColor(validatorType: string): string {
  switch (validatorType) {
    case "good":
      return "bg-success/20 text-success";
    case "neutral":
      return "bg-warning/20 text-warning";
    case "bad":
      return "bg-danger/20 text-danger";
    default:
      return "bg-slate-600/20 text-slate-400";
  }
}
