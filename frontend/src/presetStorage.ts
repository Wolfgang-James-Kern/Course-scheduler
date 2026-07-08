import type { AcademicYearWorkspace } from "./academicYear.ts";
import { isAcademicYearWorkspace, isSolveRequest, migrateAcademicYearSettings, migrateLegacyRequest } from "./workspaceStorage.ts";
import type { SolveRequest } from "./types.ts";

const STORAGE_KEY = "course-scheduler-custom-presets-v2";
const LEGACY_STORAGE_KEY = "course-scheduler-custom-presets-v1";

export type CustomPreset = {
  id: string;
  label: string;
  workspace: AcademicYearWorkspace;
};

type StoredPresets = {
  version: 2;
  presets: CustomPreset[];
};

type LegacyCustomPreset = {
  id: string;
  label: string;
  request: SolveRequest;
};

type LegacyStoredPresets = {
  version: 1;
  presets: LegacyCustomPreset[];
};

export function loadCustomPresets(): CustomPreset[] {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      const stored: unknown = JSON.parse(current);
      if (isStoredPresets(stored)) {
        return stored.presets.map((preset) => ({
          ...preset,
          workspace: migrateAcademicYearSettings(preset.workspace),
        }));
      }
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) {
      return [];
    }
    const stored: unknown = JSON.parse(legacy);
    return isLegacyStoredPresets(stored)
      ? stored.presets.map(({ request, ...preset }) => ({ ...preset, workspace: migrateLegacyRequest(request) }))
      : [];
  } catch {
    return [];
  }
}

export function saveCustomPresets(presets: CustomPreset[]): boolean {
  try {
    const stored: StoredPresets = { version: 2, presets };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
}

function isStoredPresets(value: unknown): value is StoredPresets {
  return isRecord(value)
    && value.version === 2
    && Array.isArray(value.presets)
    && value.presets.every((preset) => (
      isPresetIdentity(preset)
      && isAcademicYearWorkspace(preset.workspace)
    ));
}

function isLegacyStoredPresets(value: unknown): value is LegacyStoredPresets {
  return isRecord(value)
    && value.version === 1
    && Array.isArray(value.presets)
    && value.presets.every((preset) => isPresetIdentity(preset) && isSolveRequest(preset.request));
}

function isPresetIdentity(value: unknown): value is { id: string; label: string } & Record<string, unknown> {
  return isRecord(value)
    && typeof value.id === "string"
    && value.id.length > 0
    && typeof value.label === "string"
    && value.label.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
