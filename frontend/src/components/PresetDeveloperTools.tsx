import { useState } from "react";
import type { AcademicYearWorkspace } from "../academicYear.ts";
import { serializeBuiltInPreset, serializeSemesterPreset } from "../presetExport.ts";
import styles from "./PresetDrawer.module.css";

type PresetDeveloperToolsProps = {
  workspace: AcademicYearWorkspace;
  presetName: string;
};

export default function PresetDeveloperTools({ workspace, presetName }: PresetDeveloperToolsProps) {
  const [copyStatus, setCopyStatus] = useState("");

  async function copyPresetSource(source: string, description: string) {
    try {
      await navigator.clipboard.writeText(source);
      setCopyStatus(`${description} copied.`);
    } catch {
      setCopyStatus("Unable to copy preset source.");
    }
  }

  return (
    <section className={styles.developerTools}>
      <div>
        <h3>Developer exports</h3>
        <p>Uses the preset name above and copies source ready for the built-in catalogs.</p>
      </div>
      <div className={styles.developerActions}>
        <button
          disabled={!presetName}
          type="button"
          onClick={() => copyPresetSource(
            serializeSemesterPreset(workspace, "SEMESTER_1", `${presetName} - Semester 1`),
            "Semester 1 source",
          )}
        >
          Copy Semester 1
        </button>
        <button
          disabled={!presetName}
          type="button"
          onClick={() => copyPresetSource(
            serializeSemesterPreset(workspace, "SEMESTER_2", `${presetName} - Semester 2`),
            "Semester 2 source",
          )}
        >
          Copy Semester 2
        </button>
        <button
          disabled={!presetName}
          type="button"
          onClick={() => copyPresetSource(
            serializeBuiltInPreset(workspace, presetName),
            "Combined preset source",
          )}
        >
          Copy PRESETS entry
        </button>
      </div>
      {copyStatus && <p className={styles.copyStatus} role="status">{copyStatus}</p>}
    </section>
  );
}
