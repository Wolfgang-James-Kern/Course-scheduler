import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { AcademicYearWorkspace, Semester } from "../src/academicYear.ts";
import { isAcademicYearWorkspace } from "../src/workspaceStorage.ts";

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

function workspaceFromJson(value: unknown): AcademicYearWorkspace {
  if (isAcademicYearWorkspace(value)) {
    return value;
  }
  if (
    typeof value === "object"
    && value !== null
    && "version" in value
    && value.version === 3
    && "workspace" in value
    && isAcademicYearWorkspace(value.workspace)
  ) {
    return value.workspace;
  }
  throw new Error("The input file does not contain a valid academic-year workspace.");
}

async function main(args: string[]) {
  if (args.includes("--help") || args.length < 2) {
    console.log("Usage: npm run export:preset -- <workspace-json-file> \"<preset label>\"");
    process.exitCode = args.includes("--help") ? 0 : 1;
    return;
  }

  const [filePath, label] = args;
  const workspace = workspaceFromJson(JSON.parse(await readFile(filePath, "utf8")));
  const output = [
    serializeSemesterPreset(workspace, "SEMESTER_1", `${label} - Semester 1`),
    serializeSemesterPreset(workspace, "SEMESTER_2", `${label} - Semester 2`),
    serializeBuiltInPreset(workspace, label),
  ];
  console.log(output.join("\n\n"));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Unable to export preset source.");
    process.exitCode = 1;
  });
}
