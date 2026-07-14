import assert from "node:assert/strict";
import test from "node:test";
import { solveSchedules } from "../src/api.ts";
import type { SolveRequest } from "../src/types.ts";

const request: SolveRequest = { topN: 1, courses: [], rules: [] };

test("maps rate-limit errors to a user-facing message", async (context) => {
  context.mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({
    code: "RATE_LIMIT_EXCEEDED",
  }), { status: 429 }));

  await assert.rejects(
    solveSchedules(request),
    { message: "Too many schedule requests. Wait a moment and try again." },
  );
});

test("maps busy-server errors to a user-facing message", async (context) => {
  context.mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({
    code: "SERVER_BUSY",
  }), { status: 503 }));

  await assert.rejects(
    solveSchedules(request),
    { message: "The scheduler is currently busy. Try again shortly." },
  );
});
