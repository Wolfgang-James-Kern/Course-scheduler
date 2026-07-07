import { splitCoursesBySemester, type AcademicYearWorkspace, type Semester } from "./academicYear.ts";
import { COMPONENT_TYPES, DAYS } from "./constants.ts";
import { defaultAcademicYearWorkspace } from "./requestDefaults.ts";
import type {
  AttendanceRequirement,
  CourseIn,
  EnrollmentRequirement,
  MeetingFrequency,
  RuleConfiguration,
  RuleMode,
  RuleType,
  SolveRequest,
} from "./types.ts";
import { isValidTimeRange } from "./utils/time.ts";

const STORAGE_KEY = "course-scheduler-workspace-v3";
const LEGACY_STORAGE_KEY = "course-scheduler-workspace-v2";
const ENROLLMENT_REQUIREMENTS: readonly EnrollmentRequirement[] = ["REQUIRED", "OPTIONAL"];
const ATTENDANCE_REQUIREMENTS: readonly AttendanceRequirement[] = ["MANDATORY", "NON_MANDATORY"];
const MEETING_FREQUENCIES: readonly MeetingFrequency[] = ["WEEKLY", "OCCASIONAL"];
const RULE_MODES: readonly RuleMode[] = ["HARD", "PREFERENCE"];
const RULE_TYPES: readonly RuleType[] = [
  "EARLIEST_START",
  "LATEST_END",
  "MAXIMUM_GAP",
  "MAXIMUM_MEETINGS_PER_DAY",
  "MAXIMUM_CONTINUOUS_BLOCK",
  "MINIMUM_DAY_LENGTH",
  "MAXIMUM_DAILY_SPAN",
  "AVOID_SINGLE_MEETING_DAYS",
  "BLOCKED_TIME",
  "DAYS_OFF",
  "MAXIMUM_CAMPUS_DAYS",
  "MAXIMUM_WEEKLY_GAP",
  "BALANCE_WORKLOAD",
  "CLUSTER_CAMPUS_DAYS",
  "OCCASIONAL_MEETINGS_AT_DAY_EDGES",
];

type StoredWorkspace = {
  version: 3;
  workspace: AcademicYearWorkspace;
};

type LegacyStoredWorkspace = {
  version: 2;
  request: SolveRequest;
};

export function loadWorkspace(): AcademicYearWorkspace {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      const stored: unknown = JSON.parse(current);
      if (isStoredWorkspace(stored)) {
        return migrateAcademicYearSettings(stored.workspace);
      }
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const stored: unknown = JSON.parse(legacy);
      if (isLegacyStoredWorkspace(stored)) {
        return migrateLegacyRequest(stored.request);
      }
    }
    return defaultAcademicYearWorkspace();
  } catch {
    return defaultAcademicYearWorkspace();
  }
}

export function migrateLegacyRequest(request: SolveRequest, fallback: Semester = "SEMESTER_1"): AcademicYearWorkspace {
  const migrated = migrateRequestSettings(request);
  return {
    activeSemester: fallback,
    topN: migrated.topN,
    rules: migrated.rules,
    semesters: splitCoursesBySemester(migrated.courses, fallback),
  };
}

export function migrateAcademicYearSettings(workspace: AcademicYearWorkspace): AcademicYearWorkspace {
  return {
    ...workspace,
    semesters: {
      SEMESTER_1: { courses: migrateCourses(workspace.semesters.SEMESTER_1.courses) },
      SEMESTER_2: { courses: migrateCourses(workspace.semesters.SEMESTER_2.courses) },
    },
    rules: migrateRules(workspace.rules),
  };
}

export function migrateRequestSettings(request: SolveRequest): SolveRequest {
  return {
    ...request,
    courses: migrateCourses(request.courses),
    rules: migrateRules(request.rules),
  };
}

export function saveWorkspace(workspace: AcademicYearWorkspace): boolean {
  try {
    const stored: StoredWorkspace = { version: 3, workspace };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
}

export function isAcademicYearWorkspace(value: unknown): value is AcademicYearWorkspace {
  return isRecord(value)
    && (value.activeSemester === "SEMESTER_1" || value.activeSemester === "SEMESTER_2")
    && isIntegerBetween(value.topN, 1, 50)
    && Array.isArray(value.rules)
    && value.rules.length <= 20
    && value.rules.every(isRule)
    && isRecord(value.semesters)
    && isSemesterCourses(value.semesters.SEMESTER_1)
    && isSemesterCourses(value.semesters.SEMESTER_2);
}

export function isSolveRequest(value: unknown): value is SolveRequest {
  return isRecord(value)
    && isIntegerBetween(value.topN, 1, 50)
    && Array.isArray(value.courses)
    && value.courses.length > 0
    && value.courses.length <= 12
    && value.courses.every(isCourse)
    && Array.isArray(value.rules)
    && value.rules.length <= 20
    && value.rules.every(isRule);
}

function isStoredWorkspace(value: unknown): value is StoredWorkspace {
  return isRecord(value) && value.version === 3 && isAcademicYearWorkspace(value.workspace);
}

function isLegacyStoredWorkspace(value: unknown): value is LegacyStoredWorkspace {
  return isRecord(value) && value.version === 2 && isLegacySolveRequest(value.request);
}

function isLegacySolveRequest(value: unknown): value is SolveRequest {
  return isRecord(value)
    && isIntegerBetween(value.topN, 1, 50)
    && Array.isArray(value.courses)
    && value.courses.length > 0
    && value.courses.length <= 12
    && value.courses.every(isCourse)
    && Array.isArray(value.rules)
    && value.rules.length <= 20
    && value.rules.every((rule) => isRule(rule) || isLegacyBalanceRule(rule));
}

function isLegacyBalanceRule(value: unknown): boolean {
  return isRecord(value)
    && value.type === "BALANCE_WORKLOAD"
    && includes(RULE_MODES, value.mode)
    && isIntegerBetween(value.importance, 1, 5)
    && isIntegerBetween(value.count, 0, 12);
}

function isSemesterCourses(value: unknown): value is { courses: CourseIn[] } {
  return isRecord(value)
    && Array.isArray(value.courses)
    && value.courses.length <= 12
    && value.courses.every(isCourse);
}

function migrateCourses(courses: CourseIn[]): CourseIn[] {
  return courses.map((course) => ({
    ...course,
    components: course.components.map((component) => ({
      ...component,
      meetingFrequency: component.meetingFrequency ?? "WEEKLY",
    })),
  }));
}

function migrateRules(rules: RuleConfiguration[]): RuleConfiguration[] {
  return rules.map((rule) => {
    const legacy = rule as RuleConfiguration & { count?: number; minutes?: number };
    if (rule.type !== "BALANCE_WORKLOAD" || legacy.minutes !== undefined) {
      return rule;
    }
    return {
      type: "BALANCE_WORKLOAD",
      mode: rule.mode,
      importance: rule.importance,
      minutes: Math.max(0, legacy.count ?? 1) * 60,
    };
  });
}

function isCourse(value: unknown): value is CourseIn {
  if (
    !isRecord(value)
    || typeof value.code !== "string"
    || !value.code.trim()
    || !Array.isArray(value.components)
    || value.components.length === 0
    || value.components.length > 3
    || !Array.isArray(value.compatibilities)
    || value.compatibilities.length > 3
  ) {
    return false;
  }
  return value.components.every((component) => (
    isRecord(component)
    && includes(COMPONENT_TYPES, component.type)
    && includes(ENROLLMENT_REQUIREMENTS, component.enrollmentRequirement)
    && includes(ATTENDANCE_REQUIREMENTS, component.attendanceRequirement)
    && (component.meetingFrequency === undefined || includes(MEETING_FREQUENCIES, component.meetingFrequency))
    && typeof component.included === "boolean"
    && Array.isArray(component.sections)
    && component.sections.length <= 50
    && component.sections.every((section) => (
      isRecord(section)
      && typeof section.id === "string"
      && Boolean(section.id.trim())
      && Array.isArray(section.meetings)
      && section.meetings.length > 0
      && section.meetings.length <= 10
      && section.meetings.every((meeting) => (
        isRecord(meeting)
        && includes(DAYS, meeting.day)
        && typeof meeting.startTime === "string"
        && typeof meeting.endTime === "string"
        && isValidTimeRange(meeting.startTime, meeting.endTime)
      ))
    ))
  )) && value.compatibilities.every((compatibility) => (
    isRecord(compatibility)
    && includes(COMPONENT_TYPES, compatibility.firstComponent)
    && includes(COMPONENT_TYPES, compatibility.secondComponent)
    && compatibility.firstComponent !== compatibility.secondComponent
    && Array.isArray(compatibility.allowedPairs)
    && compatibility.allowedPairs.length <= 2500
    && compatibility.allowedPairs.every((pair) => (
      isRecord(pair)
      && typeof pair.firstSectionId === "string"
      && Boolean(pair.firstSectionId.trim())
      && typeof pair.secondSectionId === "string"
      && Boolean(pair.secondSectionId.trim())
    ))
  ));
}

function isRule(value: unknown): value is RuleConfiguration {
  if (
    !isRecord(value)
    || !includes(RULE_TYPES, value.type)
    || !includes(RULE_MODES, value.mode)
    || !isIntegerBetween(value.importance, 1, 5)
  ) {
    return false;
  }

  switch (value.type) {
    case "EARLIEST_START":
    case "LATEST_END":
      return typeof value.time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value.time);
    case "MAXIMUM_GAP":
    case "MAXIMUM_WEEKLY_GAP":
      return isIntegerBetween(value.minutes, 0, 10080);
    case "MAXIMUM_CONTINUOUS_BLOCK":
    case "MINIMUM_DAY_LENGTH":
    case "MAXIMUM_DAILY_SPAN":
      return isIntegerBetween(value.minutes, 1, 10080);
    case "BALANCE_WORKLOAD":
      return isIntegerBetween(value.minutes, 0, 10080) && (value.minutes as number) % 60 === 0;
    case "MAXIMUM_MEETINGS_PER_DAY":
    case "MAXIMUM_CAMPUS_DAYS":
      return isIntegerBetween(value.count, 1, 50);
    case "DAYS_OFF":
      return Array.isArray(value.days) && value.days.length > 0 && value.days.length <= 5
        && value.days.every((day) => includes(DAYS, day));
    case "BLOCKED_TIME":
      return includes(DAYS, value.day)
        && typeof value.startTime === "string"
        && typeof value.endTime === "string"
        && isValidTimeRange(value.startTime, value.endTime);
    case "AVOID_SINGLE_MEETING_DAYS":
    case "CLUSTER_CAMPUS_DAYS":
    case "OCCASIONAL_MEETINGS_AT_DAY_EDGES":
      return true;
  }
}

function includes<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

function isIntegerBetween(value: unknown, minimum: number, maximum: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= minimum && value <= maximum;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
