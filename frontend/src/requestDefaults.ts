import type { RuleConfiguration } from "./types.ts";
import type { AcademicYearWorkspace } from "./academicYear.ts";

export function defaultRules(): RuleConfiguration[] {
  return [
    { type: "EARLIEST_START", mode: "PREFERENCE", importance: 4, time: "09:30" },
    { type: "LATEST_END", mode: "PREFERENCE", importance: 3, time: "18:30" },
    { type: "MAXIMUM_GAP", mode: "PREFERENCE", importance: 3, minutes: 60 },
    { type: "OCCASIONAL_MEETINGS_AT_DAY_EDGES", mode: "PREFERENCE", importance: 4 },
    { type: "AVOID_SINGLE_MEETING_DAYS", mode: "PREFERENCE", importance: 2 },
  ];
}

export function defaultAcademicYearWorkspace(): AcademicYearWorkspace {
  return {
    activeSemester: "SEMESTER_1",
    topN: 5,
    rules: defaultRules(),
    semesters: {
      SEMESTER_1: { courses: [] },
      SEMESTER_2: { courses: [] },
    },
  };
}
