import assert from "node:assert/strict";
import test from "node:test";
import { inferSemester } from "../src/academicYear.ts";
import { PRESETS } from "../src/data/examples.ts";
import { serializeBuiltInPreset, serializeSemesterPreset } from "../scripts/exportPresetSource.ts";
import {
  loadCustomPresets,
  saveCustomPresets,
} from "../src/presetStorage.ts";
import { defaultAcademicYearWorkspace, defaultRules } from "../src/requestDefaults.ts";
import { buildScheduleCourseDetails } from "../src/scheduleDetails.ts";
import type { CourseIn, ScheduleOut } from "../src/types.ts";
import { createWorkspaceState, courseSaveConflict, workspaceReducer } from "../src/workspaceReducer.ts";
import { isAcademicYearWorkspace, loadWorkspace, migrateAcademicYearSettings, saveWorkspace } from "../src/workspaceStorage.ts";

function installMemoryStorage() {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  return values;
}

function course(code: string): CourseIn {
  return {
    code,
    components: [{
      type: "LEC",
      enrollmentRequirement: "REQUIRED",
      attendanceRequirement: "MANDATORY",
      included: true,
      sections: [{ id: "001", meetings: [{ day: "MONDAY", startTime: "09:00", endTime: "10:00" }] }],
    }],
    compatibilities: [],
  };
}

test("course changes remain immutable and target one semester", () => {
  const original = createWorkspaceState(defaultAcademicYearWorkspace());
  const next = workspaceReducer(original, {
    type: "SAVE_COURSE",
    index: null,
    course: course("SE 2205A"),
    targetSemester: "SEMESTER_1",
  });

  assert.equal(original.semesters.SEMESTER_1.courses.length, 0);
  assert.equal(next.semesters.SEMESTER_1.courses[0].code, "SE 2205A");
  assert.equal(next.semesters.SEMESTER_2.courses.length, 0);
});

test("courses can move between semesters", () => {
  const workspace = defaultAcademicYearWorkspace();
  workspace.semesters.SEMESTER_1.courses = [course("TEST 1000")];
  const original = createWorkspaceState(workspace);
  const next = workspaceReducer(original, { type: "MOVE_COURSE", index: 0, targetSemester: "SEMESTER_2" });

  assert.equal(next.semesters.SEMESTER_1.courses.length, 0);
  assert.equal(next.semesters.SEMESTER_2.courses[0].code, "TEST 1000");
});

test("shared rule changes clear generated results for both semesters", () => {
  const original = createWorkspaceState(defaultAcademicYearWorkspace());
  original.semesters.SEMESTER_1.response = { schedules: [] };
  original.semesters.SEMESTER_2.response = { schedules: [] };
  const next = workspaceReducer(original, {
    type: "SET_RULES",
    rules: [{ type: "EARLIEST_START", mode: "HARD", importance: 3, time: "09:00" }],
  });

  assert.equal(next.rules.length, 1);
  assert.equal(next.semesters.SEMESTER_1.response, null);
  assert.equal(next.semesters.SEMESTER_2.response, null);
});

test("generated results and selection remain independent by semester", () => {
  const original = createWorkspaceState(defaultAcademicYearWorkspace());
  original.semesters.SEMESTER_2.selectedSchedule = 4;
  const loading = workspaceReducer(original, {
    type: "SOLVE_STARTED",
    semester: "SEMESTER_2",
    requestId: 1,
    revision: original.revision,
  });
  const solved = workspaceReducer(loading, {
    type: "SOLVE_SUCCEEDED",
    semester: "SEMESTER_2",
    requestId: 1,
    revision: original.revision,
    response: { schedules: [] },
  });

  assert.equal(solved.semesters.SEMESTER_1.status, "idle");
  assert.equal(solved.semesters.SEMESTER_2.status, "complete");
  assert.equal(solved.semesters.SEMESTER_2.selectedSchedule, 0);
});

test("stale solve responses cannot replace results after an input change", () => {
  const original = createWorkspaceState(defaultAcademicYearWorkspace());
  const loading = workspaceReducer(original, {
    type: "SOLVE_STARTED",
    semester: "SEMESTER_1",
    requestId: 1,
    revision: original.revision,
  });
  const edited = workspaceReducer(loading, { type: "SET_RESULT_COUNT", count: 3 });
  const stale = workspaceReducer(edited, {
    type: "SOLVE_SUCCEEDED",
    semester: "SEMESTER_1",
    requestId: 1,
    revision: original.revision,
    response: { schedules: [] },
  });

  assert.equal(stale.semesters.SEMESTER_1.status, "idle");
  assert.equal(stale.semesters.SEMESTER_1.response, null);
});

test("a sidebar course shortcut opens that course directly", () => {
  const original = createWorkspaceState(defaultAcademicYearWorkspace());
  const editing = workspaceReducer(original, { type: "OPEN_COURSE_EDITOR", index: 2 });

  assert.equal(editing.drawer, "courses");
  assert.equal(editing.courseEditorIndex, 2);
  const courseList = workspaceReducer(editing, { type: "OPEN_DRAWER", drawer: "courses" });
  assert.equal(courseList.courseEditorIndex, null);
});

test("duplicate course saves fail without changing the course lists", () => {
  const workspace = defaultAcademicYearWorkspace();
  workspace.semesters.SEMESTER_1.courses = [course("SE 2205A")];
  workspace.semesters.SEMESTER_2.courses = [course("SE 3309B")];
  const original = createWorkspaceState(workspace);

  assert.equal(
    courseSaveConflict(original, course("SE 3309B"), null, "SEMESTER_2"),
    "SE 3309B already exists in the target semester.",
  );

  const failed = workspaceReducer(original, {
    type: "SAVE_COURSE",
    index: null,
    course: course("SE 3309B"),
    targetSemester: "SEMESTER_2",
  });

  assert.equal(failed.semesters.SEMESTER_1.courses.length, 1);
  assert.equal(failed.semesters.SEMESTER_2.courses.length, 1);
  assert.match(failed.semesters.SEMESTER_1.error, /already exists/);
});

test("switching semesters clears the course editor index", () => {
  const original = createWorkspaceState(defaultAcademicYearWorkspace());
  const editing = workspaceReducer(original, { type: "OPEN_COURSE_EDITOR", index: 0 });
  const switched = workspaceReducer(editing, { type: "SWITCH_SEMESTER", semester: "SEMESTER_2" });

  assert.equal(switched.activeSemester, "SEMESTER_2");
  assert.equal(switched.courseEditorIndex, null);
  assert.equal(switched.drawer, "courses");
});

test("schedule details follow course-menu order", () => {
  const courses = [course("FIRST 1000A"), course("SECOND 2000B")];
  const schedule: ScheduleOut = {
    sections: [
      {
        courseCode: "SECOND 2000B",
        componentType: "LEC",
        attendanceRequirement: "MANDATORY",
        meetingFrequency: "WEEKLY",
        id: "002",
        meetings: [{ day: "TUESDAY", startTime: "11:30", endTime: "12:30" }],
      },
      {
        courseCode: "FIRST 1000A",
        componentType: "LAB",
        attendanceRequirement: "MANDATORY",
        meetingFrequency: "WEEKLY",
        id: "004",
        meetings: [{ day: "FRIDAY", startTime: "09:30", endTime: "11:30" }],
      },
    ],
    stats: { earliestStart: "09:30", latestEnd: "12:30", totalGapMinutes: 0, daysWithClasses: 2 },
    score: 0,
    ruleEvaluations: [],
  };

  const details = buildScheduleCourseDetails(courses, schedule);

  assert.deepEqual(details.map((item) => item.code), ["FIRST 1000A", "SECOND 2000B"]);
});

test("starting fresh clears both semesters and all rules", () => {
  const workspace = structuredClone(PRESETS[0].workspace);
  const original = createWorkspaceState(workspace);
  const reset = defaultAcademicYearWorkspace();
  reset.rules = [];
  const next = workspaceReducer(original, { type: "RESET_WORKSPACE", workspace: reset });

  assert.equal(next.semesters.SEMESTER_1.courses.length, 0);
  assert.equal(next.semesters.SEMESTER_2.courses.length, 0);
  assert.deepEqual(next.rules, []);
  assert.equal(next.drawer, null);
});

test("the built-in year preset contains both software engineering semesters", () => {
  const preset = PRESETS[0];
  assert.equal(preset.label, "SE Year 3");
  assert.deepEqual(preset.workspace.semesters.SEMESTER_1.courses.map((item) => item.code), [
    "ECE 4436A", "SE 3309A", "SE 3310A", "SE 3351A", "SE 3316A", "SE 3352A",
  ]);
  assert.deepEqual(preset.workspace.semesters.SEMESTER_2.courses.map((item) => item.code), [
    "ECE 3375B", "SE 3313B", "SE 3353B", "SE 3350B", "PHYSICS 2300B", "SE 3314B",
  ]);
  assert.deepEqual(preset.workspace.rules, defaultRules());
});

test("software engineering presets retain component attendance expectations", () => {
  const attendance = (semester: "SEMESTER_1" | "SEMESTER_2", code: string, componentType: string) => PRESETS[0]
    .workspace.semesters[semester].courses.find((item) => item.code === code)
    ?.components.find((component) => component.type === componentType)
    ?.attendanceRequirement;

  assert.equal(attendance("SEMESTER_1", "SE 3310A", "TUT"), "NON_MANDATORY");
  assert.equal(attendance("SEMESTER_1", "SE 3351A", "TUT"), "NON_MANDATORY");
  assert.equal(attendance("SEMESTER_1", "SE 3316A", "LAB"), "MANDATORY");
  assert.equal(attendance("SEMESTER_2", "SE 3313B", "LAB"), "NON_MANDATORY");
  assert.equal(attendance("SEMESTER_2", "SE 3353B", "TUT"), "NON_MANDATORY");
  assert.equal(attendance("SEMESTER_2", "ECE 3375B", "LAB"), "MANDATORY");
});

test("workspace storage round-trips the current academic-year version", () => {
  installMemoryStorage();
  const workspace = structuredClone(PRESETS[0].workspace);

  saveWorkspace(workspace);

  assert.deepEqual(loadWorkspace(), migrateAcademicYearSettings(workspace));
});

test("legacy workspaces migrate settings and split A and B courses", () => {
  const values = installMemoryStorage();
  const first = course("SE 2205A");
  values.set("course-scheduler-workspace-v2", JSON.stringify({
    version: 2,
    request: {
      topN: 5,
      courses: [first, course("SE 2250B")],
      rules: [{ type: "BALANCE_WORKLOAD", mode: "PREFERENCE", importance: 3, count: 2 }],
    },
  }));

  const workspace = loadWorkspace();

  assert.equal(workspace.semesters.SEMESTER_1.courses[0].code, "SE 2205A");
  assert.equal(workspace.semesters.SEMESTER_2.courses[0].code, "SE 2250B");
  assert.equal(workspace.semesters.SEMESTER_1.courses[0].components[0].meetingFrequency, "WEEKLY");
  assert.deepEqual(workspace.rules, [
    { type: "BALANCE_WORKLOAD", mode: "PREFERENCE", importance: 3, minutes: 120 },
  ]);
});

test("semester inference prefers Western dates and falls back to suffixes", () => {
  assert.equal(inferSemester("SE 2205A"), "SEMESTER_1");
  assert.equal(inferSemester("SE 2205A", "SE 2205A\nRuns From: 04-January-2027 To: 09-April-2027"), "SEMESTER_2");
  assert.equal(inferSemester("TEST 1000"), null);
});

test("custom academic-year presets persist independently", () => {
  const values = installMemoryStorage();
  const preset = {
    id: "year-options",
    label: "Year options",
    workspace: structuredClone(PRESETS[0].workspace),
  };

  assert.equal(saveCustomPresets([preset]), true);
  saveWorkspace(defaultAcademicYearWorkspace());

  assert.deepEqual(loadCustomPresets(), [{ ...preset, workspace: migrateAcademicYearSettings(preset.workspace) }]);
  assert.equal(values.has("course-scheduler-custom-presets-v2"), true);
  assert.equal(values.has("course-scheduler-workspace-v3"), true);
});

test("preset source exports are ready for the built-in catalogs", () => {
  const workspace = structuredClone(PRESETS[0].workspace);
  const semester = serializeSemesterPreset(workspace, "SEMESTER_1", "Test Year - Semester 1");
  const preset = serializeBuiltInPreset(workspace, "Test Year");

  assert.ok(semester.includes('"label": "Test Year - Semester 1"'));
  assert.ok(semester.includes('"code": "ECE 4436A"'));
  assert.ok(semester.includes('"rules": defaultRules()'));
  assert.ok(preset.includes('"label": "Test Year"'));
  assert.ok(preset.includes('preset.label === "Test Year - Semester 1"'));
  assert.ok(preset.includes('preset.label === "Test Year - Semester 2"'));
  assert.ok(preset.includes('"rules": defaultRules()'));
});

test("invalid custom preset storage is ignored", () => {
  const values = installMemoryStorage();
  values.set("course-scheduler-custom-presets-v2", JSON.stringify({ version: 2, presets: [{ label: "Broken" }] }));

  assert.deepEqual(loadCustomPresets(), []);
});

test("workspace storage rejects an obsolete unversioned request", () => {
  const values = installMemoryStorage();
  values.set("course-scheduler-workspace-v2", JSON.stringify({ topN: 10, courses: [], rules: [] }));

  assert.deepEqual(loadWorkspace(), defaultAcademicYearWorkspace());
});

test("workspace validation rejects invalid enum and clock values", () => {
  const invalidDay = structuredClone(PRESETS[0].workspace) as unknown as Record<string, unknown>;
  const semesters = invalidDay.semesters as Record<string, { courses: CourseIn[] }>;
  semesters.SEMESTER_1.courses[0].components[0].sections[0].meetings[0] = {
    day: "SATURDAY" as CourseIn["components"][number]["sections"][number]["meetings"][number]["day"],
    startTime: "09:00",
    endTime: "10:00",
  };
  assert.equal(isAcademicYearWorkspace(invalidDay), false);

  const invalidTime = structuredClone(PRESETS[0].workspace);
  invalidTime.semesters.SEMESTER_1.courses[0].components[0].sections[0].meetings[0].startTime = "29:00";
  assert.equal(isAcademicYearWorkspace(invalidTime), false);
});

test("workspace saves report storage quota failures", () => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: () => null,
      setItem: () => {
        throw new Error("Quota exceeded");
      },
    },
  });

  assert.equal(saveWorkspace(defaultAcademicYearWorkspace()), false);
});
