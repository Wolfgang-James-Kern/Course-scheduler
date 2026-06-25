import type { RuleConfiguration, RuleType } from "./types.ts";
import { isValidTime, isValidTimeRange } from "./utils/time.ts";

export type RuleScope = "Daily" | "Weekly";

export type RuleDefinition = {
  type: RuleType;
  name: string;
  scope: RuleScope;
  description: string;
  create: () => RuleConfiguration;
};

export const RULE_CATALOG: readonly RuleDefinition[] = [
  definition("EARLIEST_START", "Earliest start", "Daily", "Avoid beginning class days before a selected time.", () => ({ type: "EARLIEST_START", mode: "PREFERENCE", importance: 4, time: "09:30" })),
  definition("LATEST_END", "Latest end", "Daily", "Avoid ending class days after a selected time.", () => ({ type: "LATEST_END", mode: "PREFERENCE", importance: 3, time: "18:30" })),
  definition("MAXIMUM_GAP", "Maximum gap", "Daily", "Limit long breaks between consecutive classes.", () => ({ type: "MAXIMUM_GAP", mode: "PREFERENCE", importance: 3, minutes: 60 })),
  definition("MAXIMUM_MEETINGS_PER_DAY", "Meetings per day", "Daily", "Keep individual class days from becoming overloaded.", () => ({ type: "MAXIMUM_MEETINGS_PER_DAY", mode: "PREFERENCE", importance: 3, count: 4 })),
  definition("MAXIMUM_CONTINUOUS_BLOCK", "Continuous class block", "Daily", "Avoid too many back-to-back class hours without a break.", () => ({ type: "MAXIMUM_CONTINUOUS_BLOCK", mode: "PREFERENCE", importance: 3, minutes: 180 })),
  definition("MINIMUM_DAY_LENGTH", "Minimum day length", "Daily", "Avoid travelling to campus for a very short class day.", () => ({ type: "MINIMUM_DAY_LENGTH", mode: "PREFERENCE", importance: 3, minutes: 120 })),
  definition("MAXIMUM_DAILY_SPAN", "Maximum daily span", "Daily", "Limit the time from the first class to the final class of a day.", () => ({ type: "MAXIMUM_DAILY_SPAN", mode: "PREFERENCE", importance: 3, minutes: 480 })),
  definition("AVOID_SINGLE_MEETING_DAYS", "Avoid single-class days", "Daily", "Avoid travelling to campus for only one meeting.", () => ({ type: "AVOID_SINGLE_MEETING_DAYS", mode: "PREFERENCE", importance: 2 })),
  definition("OCCASIONAL_MEETINGS_AT_DAY_EDGES", "Occasional meetings at day edges", "Daily", "Keep occasional components before or after the regular classes on their day.", () => ({ type: "OCCASIONAL_MEETINGS_AT_DAY_EDGES", mode: "PREFERENCE", importance: 4 })),
  definition("BLOCKED_TIME", "Blocked time", "Daily", "Keep one period on a selected day available.", () => ({ type: "BLOCKED_TIME", mode: "HARD", importance: 3, day: "MONDAY", startTime: "12:00", endTime: "13:00" })),
  definition("DAYS_OFF", "Days off", "Weekly", "Keep selected weekdays free from classes.", () => ({ type: "DAYS_OFF", mode: "PREFERENCE", importance: 3, days: ["FRIDAY"] })),
  definition("MAXIMUM_CAMPUS_DAYS", "Campus days", "Weekly", "Limit how many days require attending campus.", () => ({ type: "MAXIMUM_CAMPUS_DAYS", mode: "PREFERENCE", importance: 3, count: 4 })),
  definition("MAXIMUM_WEEKLY_GAP", "Maximum weekly gap", "Weekly", "Limit accumulated waiting time between classes across the week.", () => ({ type: "MAXIMUM_WEEKLY_GAP", mode: "PREFERENCE", importance: 3, minutes: 300 })),
  definition("BALANCE_WORKLOAD", "Balance class time", "Weekly", "Keep scheduled class hours similar across active class days.", () => ({ type: "BALANCE_WORKLOAD", mode: "PREFERENCE", importance: 3, minutes: 60 })),
  definition("CLUSTER_CAMPUS_DAYS", "Cluster campus days", "Weekly", "Prefer consecutive campus days instead of days scattered across the week.", () => ({ type: "CLUSTER_CAMPUS_DAYS", mode: "PREFERENCE", importance: 3 })),
];

export function getRuleDefinition(type: RuleType): RuleDefinition {
  const entry = RULE_CATALOG.find((candidate) => candidate.type === type);
  if (!entry) {
    throw new Error(`Unknown rule type: ${type}`);
  }
  return entry;
}

export function ruleName(type: RuleType): string {
  return getRuleDefinition(type).name;
}

export function validateRule(rule: RuleConfiguration): string | null {
  const label = ruleName(rule.type);
  if (!Number.isInteger(rule.importance) || rule.importance < 1 || rule.importance > 5) {
    return `${label} needs an importance between one and five.`;
  }

  switch (rule.type) {
    case "EARLIEST_START":
    case "LATEST_END":
      return isValidTime(rule.time) ? null : `${label} needs a valid time.`;
    case "MAXIMUM_GAP":
    case "MAXIMUM_WEEKLY_GAP":
      return Number.isInteger(rule.minutes) && rule.minutes >= 0
        ? null
        : `${label} needs a non-negative number of minutes.`;
    case "MAXIMUM_CONTINUOUS_BLOCK":
    case "MINIMUM_DAY_LENGTH":
    case "MAXIMUM_DAILY_SPAN":
      return Number.isInteger(rule.minutes) && rule.minutes > 0
        ? null
        : `${label} needs a positive number of minutes.`;
    case "BALANCE_WORKLOAD":
      return Number.isInteger(rule.minutes) && rule.minutes >= 0 && rule.minutes % 60 === 0
        ? null
        : "Balance class time needs a non-negative whole number of hours.";
    case "MAXIMUM_MEETINGS_PER_DAY":
    case "MAXIMUM_CAMPUS_DAYS":
      return Number.isInteger(rule.count) && rule.count > 0
        ? null
        : `${label} needs a value of at least one.`;
    case "DAYS_OFF":
      return rule.days.length > 0 ? null : "Days off needs at least one selected day.";
    case "BLOCKED_TIME":
      return isValidTimeRange(rule.startTime, rule.endTime)
        ? null
        : "Blocked time needs a day and a valid time range.";
    case "AVOID_SINGLE_MEETING_DAYS":
    case "CLUSTER_CAMPUS_DAYS":
    case "OCCASIONAL_MEETINGS_AT_DAY_EDGES":
      return null;
  }
}

function definition(
  type: RuleType,
  name: string,
  scope: RuleScope,
  description: string,
  create: () => RuleConfiguration,
): RuleDefinition {
  return { type, name, scope, description, create };
}
