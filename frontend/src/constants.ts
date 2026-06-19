import type { ComponentType, Day } from "./types.ts";

export const DAYS: readonly Day[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export const COMPONENT_TYPES: readonly ComponentType[] = ["LEC", "TUT", "LAB"];

export const DAY_LABELS: Record<Day, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

export const DAY_SHORT_LABELS: Record<Day, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
};

export function formatDay(day: Day, style: "long" | "short" = "long"): string {
  return style === "short" ? DAY_SHORT_LABELS[day] : DAY_LABELS[day];
}
