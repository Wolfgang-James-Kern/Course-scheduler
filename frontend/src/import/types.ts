import type { CourseIn } from "../types.ts";

export type ImportFormat = "WESTERN_COURSE_SEARCH" | "WESTERN_DRAFT_TABLE";
export type ImportSeverity = "WARNING" | "ERROR";
export type ImportResolution = "MERGE" | "REPLACE" | "SKIP";

export type ImportIssue = {
  severity: ImportSeverity;
  message: string;
};

export type ImportResult = {
  format: ImportFormat | null;
  courses: CourseIn[];
  issues: ImportIssue[];
};

export type ImportContext = {
  fallbackCourseCode?: string;
};
