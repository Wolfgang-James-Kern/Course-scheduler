import type { SolveRequest, SolveResponse } from "./types";

export async function solveSchedules(request: SolveRequest): Promise<SolveResponse> {
    const response = await fetch("/api/solve", {
        method: "POST", 
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(request)
    });

    return response.json();
}