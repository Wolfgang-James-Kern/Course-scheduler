import { PRESETS } from "../src/data/examples.ts";
import { buildSolveRequest, SEMESTERS, semesterLabel } from "../src/academicYear.ts";

let failed = false;
const apiBase = process.env.SCHEDULER_API_BASE ?? "http://127.0.0.1:8080";

for (const preset of PRESETS) {
  for (const semester of SEMESTERS) {
    const startedAt = performance.now();
    const response = await fetch(`${apiBase}/api/solve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildSolveRequest(preset.workspace, semester)),
    });
    const body = await response.json() as { schedules?: unknown[]; message?: string };
    const duration = Math.round(performance.now() - startedAt);
    console.log(`${preset.label} ${semesterLabel(semester)} | status=${response.status} | schedules=${body.schedules?.length ?? 0} | duration=${duration}ms`);
    if (!response.ok) {
      failed = true;
      console.error(body.message ?? "Preset request failed.");
    } else if (!body.schedules || body.schedules.length === 0) {
      failed = true;
      console.error("Preset did not produce a valid schedule.");
    }
  }
}

if (failed) {
  process.exitCode = 1;
}
