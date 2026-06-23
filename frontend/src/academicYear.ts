import type { CourseIn, RuleConfiguration, SolveRequest } from "./types.ts";

export type Semester = "SEMESTER_1" | "SEMESTER_2";

export const SEMESTERS: Semester[] = ["SEMESTER_1", "SEMESTER_2"];

export type AcademicYearWorkspace = {
  activeSemester: Semester;
  topN: number;
  rules: RuleConfiguration[];
  semesters: Record<Semester, { courses: CourseIn[] }>;
};

export function semesterLabel(semester: Semester): string {
  return semester === "SEMESTER_1" ? "Semester 1" : "Semester 2";
}

export function otherSemester(semester: Semester): Semester {
  return semester === "SEMESTER_1" ? "SEMESTER_2" : "SEMESTER_1";
}

export function semesterFromCourseCode(code: string): Semester | null {
  const suffix = code.trim().match(/\d{4}([AB])$/i)?.[1].toUpperCase();
  return suffix === "A" ? "SEMESTER_1" : suffix === "B" ? "SEMESTER_2" : null;
}

export function semesterFromWesternText(code: string, text: string): Semester | null {
  const normalized = text.replace(/\r\n?/g, "\n");
  const [subject = "", number = ""] = code.trim().split(/\s+(?=\d{4}[A-Z]?$)/i);
  const codePattern = new RegExp(`${escapePattern(subject)}\\s+${escapePattern(number)}`, "i");
  const start = normalized.search(codePattern);
  const relevantText = start >= 0 ? normalized.slice(start, start + 1800) : normalized;
  const date = relevantText.match(/Runs From:\s*\d{1,2}[-/]([A-Za-z]+|\d{1,2})[-/]\d{4}/i)?.[1];
  if (!date) {
    return null;
  }
  const month = monthNumber(date);
  if (month >= 8 && month <= 12) {
    return "SEMESTER_1";
  }
  if (month >= 1 && month <= 5) {
    return "SEMESTER_2";
  }
  return null;
}

export function inferSemester(code: string, westernText?: string): Semester | null {
  return westernText ? semesterFromWesternText(code, westernText) ?? semesterFromCourseCode(code) : semesterFromCourseCode(code);
}

export function splitCoursesBySemester(courses: CourseIn[], fallback: Semester): Record<Semester, { courses: CourseIn[] }> {
  const semesters: Record<Semester, { courses: CourseIn[] }> = {
    SEMESTER_1: { courses: [] },
    SEMESTER_2: { courses: [] },
  };
  courses.forEach((course) => semesters[semesterFromCourseCode(course.code) ?? fallback].courses.push(course));
  return semesters;
}

export function buildSolveRequest(workspace: AcademicYearWorkspace, semester: Semester): SolveRequest {
  return {
    topN: workspace.topN,
    rules: workspace.rules,
    courses: workspace.semesters[semester].courses,
  };
}

function monthNumber(value: string): number {
  if (/^\d+$/.test(value)) {
    return Number(value);
  }
  const names = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return names.findIndex((month) => value.toUpperCase().startsWith(month)) + 1;
}

function escapePattern(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
