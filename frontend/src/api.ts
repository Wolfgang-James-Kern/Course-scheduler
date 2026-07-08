import type { SolveRequest, SolveResponse } from "./types";

type ApiErrorBody = {
  code?: string;
  message?: string;
  field?: string | null;
};

const CODE_MESSAGES: Record<string, string> = {
  REQUEST_TOO_COMPLEX: "Too many course section combinations to search. Narrow sections or optional components, then try again.",
  VALIDATION_ERROR: "Some schedule inputs are invalid. Check course and rule fields.",
  MALFORMED_JSON: "The scheduling request could not be read.",
  RATE_LIMIT_EXCEEDED: "Too many schedule requests. Wait a moment and try again.",
  SERVER_BUSY: "The scheduler is currently busy. Try again shortly.",
  INTERNAL_ERROR: "The scheduler hit an unexpected error. Try again in a moment.",
};

export async function solveSchedules(request: SolveRequest, signal?: AbortSignal): Promise<SolveResponse> {
  const response = await fetch("/api/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    let error: ApiErrorBody = {};
    try {
      error = await response.json() as ApiErrorBody;
    } catch {
      error = {};
    }
    const mapped = error.code ? CODE_MESSAGES[error.code] : undefined;
    throw new Error(mapped ?? error.message ?? `Unable to generate schedules (${response.status}).`);
  }

  const payload = await response.json() as SolveResponse;
  if (!payload || !Array.isArray(payload.schedules)) {
    throw new Error("The scheduler returned an unexpected response.");
  }
  return payload;
}
