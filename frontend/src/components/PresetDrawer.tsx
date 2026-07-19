import { useState, type FormEvent } from "react";
import type { AcademicYearWorkspace } from "../academicYear.ts";
import type { Preset } from "../data/examples.ts";
import type { CustomPreset } from "../presetStorage.ts";
import PresetDeveloperTools from "./PresetDeveloperTools.tsx";
import styles from "./PresetDrawer.module.css";

const PRESET_TOOLS_ENABLED = import.meta.env.DEV
  && import.meta.env.VITE_ENABLE_PRESET_TOOLS === "true";

type PresetDrawerProps = {
  builtInPresets: Preset[];
  currentWorkspace: AcademicYearWorkspace;
  presets: CustomPreset[];
  onSave: (label: string) => boolean;
  onLoad: (workspace: AcademicYearWorkspace) => void;
  onDelete: (preset: CustomPreset) => void;
};

export default function PresetDrawer({
  builtInPresets,
  currentWorkspace,
  presets,
  onSave,
  onLoad,
  onDelete,
}: PresetDrawerProps) {
  const [label, setLabel] = useState("");
  const normalizedLabel = label.trim();
  const replacesExisting = presets.some((preset) => preset.label.toLowerCase() === normalizedLabel.toLowerCase());

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (normalizedLabel && onSave(normalizedLabel)) {
      setLabel("");
    }
  }

  return (
    <div className={styles.panel}>
      <section className={`${styles.presetSection} ${styles.builtInPresets}`}>
        <div className={styles.heading}>
          <h3>Built-in presets</h3>
          <span>{builtInPresets.length}</span>
        </div>
        <div className={styles.presetList}>
          {builtInPresets.map((preset) => (
            <article key={preset.label}>
              <div>
                <strong>{preset.label}</strong>
                <small>{presetSummary(preset.workspace)}</small>
              </div>
              <div className={styles.actions}>
                <button onClick={() => onLoad(preset.workspace)}>Load</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <form className={styles.saveForm} onSubmit={submit}>
        <div>
          <h3>Save the current workspace</h3>
          <p>
            Presets include both semesters, {currentWorkspace.rules.length} shared rules, and the selected result count.
          </p>
        </div>
        <label>
          <span>Preset name</span>
          <input
            maxLength={60}
            value={label}
            placeholder="e.g. Third-year registration options"
            onChange={(event) => setLabel(event.target.value)}
          />
        </label>
        <button disabled={!normalizedLabel} type="submit">
          {replacesExisting ? "Replace preset" : "Save preset"}
        </button>
      </form>

      <section className={styles.presetSection}>
        <div className={styles.heading}>
          <h3>Saved presets</h3>
          <span>{presets.length}</span>
        </div>
        {presets.length === 0 ? (
          <p className={styles.emptyState}>Your named presets will appear here.</p>
        ) : (
          <div className={styles.presetList}>
            {presets.map((preset) => (
              <article key={preset.id}>
                <div>
                  <strong>{preset.label}</strong>
                  <small>{presetSummary(preset.workspace)}</small>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => onLoad(preset.workspace)}>Load</button>
                  <button className={styles.deleteButton} onClick={() => onDelete(preset)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {PRESET_TOOLS_ENABLED && (
        <PresetDeveloperTools workspace={currentWorkspace} presetName={normalizedLabel} />
      )}

    </div>
  );
}

function presetSummary(workspace: AcademicYearWorkspace): string {
  return `${workspace.semesters.SEMESTER_1.courses.length} in Semester 1 · ${workspace.semesters.SEMESTER_2.courses.length} in Semester 2`;
}
