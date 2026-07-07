import { useEffect, useState } from "react";
import type { AcademicYearWorkspace } from "../academicYear.ts";
import { saveWorkspace } from "../workspaceStorage.ts";

export type PersistenceStatus = "saved" | "failed";

export function useWorkspacePersistence(workspace: AcademicYearWorkspace): PersistenceStatus {
  const [status, setStatus] = useState<PersistenceStatus>("saved");

  useEffect(() => {
    let active = true;
    const nextStatus = saveWorkspace(workspace) ? "saved" : "failed";
    queueMicrotask(() => {
      if (active) {
        setStatus(nextStatus);
      }
    });
    return () => {
      active = false;
    };
  }, [workspace]);

  return status;
}
