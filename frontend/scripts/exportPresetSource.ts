import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { AcademicYearWorkspace } from "../src/academicYear.ts";
import { serializeBuiltInPreset, serializeSemesterPreset } from "../src/presetExport.ts";
import { isAcademicYearWorkspace } from "../src/workspaceStorage.ts";

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
