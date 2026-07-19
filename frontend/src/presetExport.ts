import type { AcademicYearWorkspace, Semester } from "./academicYear.ts";

export function serializeSemesterPreset(
  workspace: AcademicYearWorkspace,
  semester: Semester,
  label: string,
): string {
  return withSourceExpressions({
    label,
    request: {
      topN: workspace.topN,
      courses: workspace.semesters[semester].courses,
      rules: "__DEFAULT_RULES__",
    },
  });
}

export function serializeBuiltInPreset(workspace: AcademicYearWorkspace, label: string): string {
  const semesterOneLabel = `${label} - Semester 1`;
  const semesterTwoLabel = `${label} - Semester 2`;
  return withSourceExpressions({
    label,
    workspace: {
      activeSemester: workspace.activeSemester,
      topN: workspace.topN,
      rules: "__DEFAULT_RULES__",
      semesters: {
        SEMESTER_1: { courses: "__SEMESTER_1_COURSES__" },
        SEMESTER_2: { courses: "__SEMESTER_2_COURSES__" },
      },
    },
  })
    .replace(
      '"__SEMESTER_1_COURSES__"',
      `SEMESTER_PRESETS.find((preset) => preset.label === ${JSON.stringify(semesterOneLabel)})!.request.courses`,
    )
    .replace(
      '"__SEMESTER_2_COURSES__"',
      `SEMESTER_PRESETS.find((preset) => preset.label === ${JSON.stringify(semesterTwoLabel)})!.request.courses`,
    );
}

function withSourceExpressions(value: unknown): string {
  return JSON.stringify(value, null, 2).replace('"__DEFAULT_RULES__"', "defaultRules()");
}
