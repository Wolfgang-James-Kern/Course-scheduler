import { useCallback, useEffect, useRef } from "react";
import { buildSolveRequest, SEMESTERS, type AcademicYearWorkspace, type Semester } from "../academicYear.ts";
import { solveSchedules } from "../api.ts";
import { validateRule } from "../ruleCatalog.ts";
import type { WorkspaceAction, WorkspaceState } from "../workspaceReducer.ts";

type WorkspaceDispatch = (action: WorkspaceAction) => void;

export function useScheduleGeneration(
  workspace: AcademicYearWorkspace,
  state: WorkspaceState,
  dispatch: WorkspaceDispatch,
) {
  const nextRequestId = useRef(0);
  const controllers = useRef<Partial<Record<Semester, AbortController>>>({});

  useEffect(() => () => {
    Object.values(controllers.current).forEach((controller) => controller.abort());
  }, []);

  const generateSemester = useCallback(async (semester: Semester) => {
    const request = buildSolveRequest(workspace, semester);
    const validationError = validateRequest(request);
    if (validationError) {
      dispatch({ type: "SET_SEMESTER_ERROR", semester, message: validationError });
      return;
    }

    controllers.current[semester]?.abort();
    const controller = new AbortController();
    controllers.current[semester] = controller;
    const requestId = nextRequestId.current + 1;
    nextRequestId.current = requestId;
    const revision = state.revision;
    dispatch({ type: "SOLVE_STARTED", semester, requestId, revision });

    try {
      const response = await solveSchedules(request, controller.signal);
      dispatch({ type: "SOLVE_SUCCEEDED", semester, requestId, revision, response });
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }
      dispatch({
        type: "SOLVE_FAILED",
        semester,
        requestId,
        revision,
        message: error instanceof Error ? error.message : "Unable to generate schedules.",
      });
    }
  }, [dispatch, state.revision, workspace]);

  const generateBothSemesters = useCallback(async () => {
    await Promise.all(SEMESTERS.map(generateSemester));
  }, [generateSemester]);

  return { generateSemester, generateBothSemesters };
}

function validateRequest(request: ReturnType<typeof buildSolveRequest>): string | null {
  if (request.courses.length === 0) {
    return "Add at least one course before generating schedules.";
  }
  for (const rule of request.rules) {
    const error = validateRule(rule);
    if (error) {
      return error;
    }
  }
  return null;
}
