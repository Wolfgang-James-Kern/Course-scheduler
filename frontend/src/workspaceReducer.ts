import type { AcademicYearWorkspace, Semester } from "./academicYear.ts";
import type { CourseIn, RuleConfiguration, SolveResponse } from "./types.ts";

export type DrawerName = "courses" | "presets" | "rules" | "schedule-details" | null;

export type SemesterWorkspaceState = {
  courses: CourseIn[];
  response: SolveResponse | null;
  selectedSchedule: number;
  status: "idle" | "loading" | "complete";
  error: string;
  requestId: number;
};

export type WorkspaceState = {
  activeSemester: Semester;
  topN: number;
  rules: RuleConfiguration[];
  semesters: Record<Semester, SemesterWorkspaceState>;
  drawer: DrawerName;
  courseEditorIndex: number | null;
  revision: number;
};

export type WorkspaceAction =
  | { type: "SWITCH_SEMESTER"; semester: Semester }
  | { type: "OPEN_DRAWER"; drawer: Exclude<DrawerName, null> }
  | { type: "OPEN_COURSE_EDITOR"; index: number }
  | { type: "CLOSE_DRAWER" }
  | { type: "LOAD_WORKSPACE"; workspace: AcademicYearWorkspace }
  | { type: "RESET_WORKSPACE"; workspace: AcademicYearWorkspace }
  | { type: "SAVE_COURSE"; course: CourseIn; index: number | null; targetSemester: Semester }
  | { type: "SET_SEMESTER_COURSES"; semester: Semester; courses: CourseIn[] }
  | { type: "REMOVE_COURSE"; index: number }
  | { type: "MOVE_COURSE"; index: number; targetSemester: Semester }
  | { type: "SET_RULES"; rules: RuleConfiguration[] }
  | { type: "SET_RESULT_COUNT"; count: number }
  | { type: "SOLVE_STARTED"; semester: Semester; requestId: number; revision: number }
  | { type: "SOLVE_SUCCEEDED"; semester: Semester; requestId: number; revision: number; response: SolveResponse }
  | { type: "SOLVE_FAILED"; semester: Semester; requestId: number; revision: number; message: string }
  | { type: "SET_SEMESTER_ERROR"; semester: Semester; message: string }
  | { type: "SELECT_SCHEDULE"; index: number };

export function createWorkspaceState(workspace: AcademicYearWorkspace): WorkspaceState {
  return {
    activeSemester: workspace.activeSemester,
    topN: workspace.topN,
    rules: workspace.rules,
    semesters: {
      SEMESTER_1: semesterState(workspace.semesters.SEMESTER_1.courses),
      SEMESTER_2: semesterState(workspace.semesters.SEMESTER_2.courses),
    },
    drawer: null,
    courseEditorIndex: null,
    revision: 0,
  };
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case "SWITCH_SEMESTER":
      return { ...state, activeSemester: action.semester, courseEditorIndex: null };
    case "OPEN_DRAWER":
      return { ...state, drawer: action.drawer, courseEditorIndex: null };
    case "OPEN_COURSE_EDITOR":
      return { ...state, drawer: "courses", courseEditorIndex: action.index };
    case "CLOSE_DRAWER":
      return { ...state, drawer: null, courseEditorIndex: null };
    case "LOAD_WORKSPACE":
    case "RESET_WORKSPACE":
      return { ...createWorkspaceState(action.workspace), revision: state.revision + 1 };
    case "SAVE_COURSE":
      return saveCourse(state, action.course, action.index, action.targetSemester);
    case "SET_SEMESTER_COURSES":
      return invalidate(updateSemester(state, action.semester, semesterState(action.courses)));
    case "REMOVE_COURSE": {
      const semester = state.activeSemester;
      const courses = state.semesters[semester].courses.filter((_, index) => index !== action.index);
      return invalidate(updateSemester(state, semester, semesterState(courses)));
    }
    case "MOVE_COURSE":
      return moveCourse(state, action.index, action.targetSemester);
    case "SET_RULES":
      return clearResults({ ...state, rules: action.rules });
    case "SET_RESULT_COUNT":
      return clearResults({ ...state, topN: action.count });
    case "SOLVE_STARTED":
      if (action.revision !== state.revision) {
        return state;
      }
      return updateSemester(state, action.semester, {
        ...state.semesters[action.semester],
        status: "loading",
        error: "",
        requestId: action.requestId,
      });
    case "SOLVE_SUCCEEDED":
      if (!isCurrentRequest(state, action.semester, action.requestId, action.revision)) {
        return state;
      }
      return updateSemester(state, action.semester, {
        ...state.semesters[action.semester],
        status: "complete",
        response: action.response,
        selectedSchedule: 0,
        error: "",
      });
    case "SOLVE_FAILED":
      if (!isCurrentRequest(state, action.semester, action.requestId, action.revision)) {
        return state;
      }
      return updateSemester(state, action.semester, {
        ...state.semesters[action.semester],
        status: "idle",
        error: action.message,
      });
    case "SET_SEMESTER_ERROR":
      return updateSemester(state, action.semester, {
        ...state.semesters[action.semester],
        status: "idle",
        error: action.message,
      });
    case "SELECT_SCHEDULE":
      return updateSemester(state, state.activeSemester, {
        ...state.semesters[state.activeSemester],
        selectedSchedule: action.index,
      });
  }
}

function semesterState(courses: CourseIn[]): SemesterWorkspaceState {
  return { courses, response: null, selectedSchedule: 0, status: "idle", error: "", requestId: 0 };
}

function updateSemester(state: WorkspaceState, semester: Semester, next: SemesterWorkspaceState): WorkspaceState {
  return { ...state, semesters: { ...state.semesters, [semester]: next } };
}

function clearResults(state: WorkspaceState): WorkspaceState {
  return {
    ...state,
    semesters: {
      SEMESTER_1: { ...semesterState(state.semesters.SEMESTER_1.courses), requestId: state.semesters.SEMESTER_1.requestId },
      SEMESTER_2: { ...semesterState(state.semesters.SEMESTER_2.courses), requestId: state.semesters.SEMESTER_2.requestId },
    },
    revision: state.revision + 1,
  };
}

function invalidate(state: WorkspaceState): WorkspaceState {
  return { ...state, revision: state.revision + 1 };
}

function isCurrentRequest(
  state: WorkspaceState,
  semester: Semester,
  requestId: number,
  revision: number,
): boolean {
  return revision === state.revision && requestId === state.semesters[semester].requestId;
}

/** Returns a user-facing error when a course cannot be saved, otherwise null. */
export function courseSaveConflict(
  state: WorkspaceState,
  course: CourseIn,
  index: number | null,
  target: Semester,
): string | null {
  const source = state.activeSemester;
  const sourceCourses = state.semesters[source].courses;
  const remainingSource = index === null
    ? sourceCourses
    : sourceCourses.filter((_, courseIndex) => courseIndex !== index);
  const targetCourses = target === source ? remainingSource : state.semesters[target].courses;
  if (targetCourses.some((existing) => existing.code.toUpperCase() === course.code.toUpperCase())) {
    return `${course.code} already exists in the target semester.`;
  }
  return null;
}

function saveCourse(state: WorkspaceState, course: CourseIn, index: number | null, target: Semester): WorkspaceState {
  const conflict = courseSaveConflict(state, course, index, target);
  const source = state.activeSemester;
  if (conflict) {
    return updateSemester(state, source, {
      ...state.semesters[source],
      error: conflict,
    });
  }
  const sourceCourses = [...state.semesters[source].courses];
  if (index !== null) {
    sourceCourses.splice(index, 1);
  }
  const targetCourses = target === source ? sourceCourses : [...state.semesters[target].courses];
  if (target === source && index !== null) {
    targetCourses.splice(index, 0, course);
  } else {
    targetCourses.push(course);
  }
  let next = updateSemester(state, source, semesterState(sourceCourses));
  next = updateSemester(next, target, semesterState(targetCourses));
  return invalidate({ ...next, activeSemester: target });
}

function moveCourse(state: WorkspaceState, index: number, target: Semester): WorkspaceState {
  const source = state.activeSemester;
  const course = state.semesters[source].courses[index];
  if (!course || target === source) {
    return state;
  }
  if (state.semesters[target].courses.some((existing) => existing.code.toUpperCase() === course.code.toUpperCase())) {
    return updateSemester(state, source, {
      ...state.semesters[source],
      error: `${course.code} already exists in the target semester.`,
    });
  }
  const sourceCourses = state.semesters[source].courses.filter((_, courseIndex) => courseIndex !== index);
  const targetCourses = [...state.semesters[target].courses, course];
  let next = updateSemester(state, source, semesterState(sourceCourses));
  next = updateSemester(next, target, semesterState(targetCourses));
  return invalidate(next);
}
