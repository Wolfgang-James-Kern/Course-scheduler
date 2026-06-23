import type { Day, MeetingIn } from "../../types.ts";

const DAY_PATTERN = "(?:M|Tu|W|Th|F)";
const MEETING_PATTERN = new RegExp(
  `^(${DAY_PATTERN}(?:\\s+${DAY_PATTERN})*)\\s+(\\d{1,2}:\\d{2}\\s*[AP]M)\\s*-\\s*(\\d{1,2}:\\d{2}\\s*[AP]M)(?:\\s+.*)?$`,
  "i",
);

const DAYS: Record<string, Day> = {
  M: "MONDAY",
  TU: "TUESDAY",
  W: "WEDNESDAY",
  TH: "THURSDAY",
  F: "FRIDAY",
};

export function normalizedLines(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""));
}

export function collapsedLine(line: string): string {
  return line.trim().replace(/[ \t]+/g, " ");
}

export function parseMeetingLine(line: string): MeetingIn[] | null {
  const match = collapsedLine(line).match(MEETING_PATTERN);
  if (!match) {
    return null;
  }
  const startTime = parseWesternTime(match[2]);
  const endTime = parseWesternTime(match[3]);
  if (!startTime || !endTime || endTime <= startTime) {
    return null;
  }
  const dayTokens = match[1].split(/\s+/);
  const days = dayTokens.map((token) => DAYS[token.toUpperCase()]).filter((day): day is Day => Boolean(day));
  if (days.length !== dayTokens.length) {
    return null;
  }
  return days.map((day) => ({ day, startTime, endTime }));
}

function parseWesternTime(value: string): string | null {
  const match = value.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/);
  if (!match) {
    return null;
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    return null;
  }
  const normalizedHour = (hour % 12) + (match[3] === "PM" ? 12 : 0);
  return `${normalizedHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}
