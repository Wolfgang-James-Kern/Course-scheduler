import type { ComponentCompatibilityIn, CourseComponentIn, CourseIn } from "../../types.ts";
import type { ImportResolution } from "../types.ts";

export function applyImportedCourses(
  existingCourses: CourseIn[],
  importedCourses: CourseIn[],
  resolutions: Record<string, ImportResolution>,
): CourseIn[] {
  const result = structuredClone(existingCourses);
  for (const imported of importedCourses) {
    const resolution = resolutions[imported.code] ?? "MERGE";
    if (resolution === "SKIP") {
      continue;
    }
    const existingIndex = result.findIndex((course) => course.code.toUpperCase() === imported.code.toUpperCase());
    if (existingIndex < 0) {
      result.push(structuredClone(imported));
    } else if (resolution === "REPLACE") {
      result[existingIndex] = structuredClone(imported);
    } else {
      result[existingIndex] = mergeCourse(result[existingIndex], imported);
    }
  }
  return result;
}

function mergeCourse(existing: CourseIn, imported: CourseIn): CourseIn {
  const components = structuredClone(existing.components);
  for (const importedComponent of imported.components) {
    const index = components.findIndex((component) => component.type === importedComponent.type);
    if (index < 0) {
      components.push(structuredClone(importedComponent));
    } else {
      components[index] = mergeComponent(components[index], importedComponent);
    }
  }
  return {
    ...existing,
    components,
    compatibilities: mergeCompatibilities(existing.compatibilities, imported.compatibilities),
  };
}

function mergeComponent(existing: CourseComponentIn, imported: CourseComponentIn): CourseComponentIn {
  const sections = structuredClone(existing.sections);
  for (const importedSection of imported.sections) {
    const index = sections.findIndex((section) => section.id === importedSection.id);
    if (index < 0) {
      sections.push(structuredClone(importedSection));
    } else {
      sections[index] = structuredClone(importedSection);
    }
  }
  return { ...existing, sections };
}

function mergeCompatibilities(
  existing: ComponentCompatibilityIn[],
  imported: ComponentCompatibilityIn[],
): ComponentCompatibilityIn[] {
  const merged = structuredClone(existing);
  for (const compatibility of imported) {
    const index = merged.findIndex((candidate) => sameComponentPair(candidate, compatibility));
    if (index < 0) {
      merged.push(structuredClone(compatibility));
    } else {
      merged[index] = structuredClone(compatibility);
    }
  }
  return merged;
}

function sameComponentPair(first: ComponentCompatibilityIn, second: ComponentCompatibilityIn): boolean {
  return first.firstComponent === second.firstComponent && first.secondComponent === second.secondComponent
    || first.firstComponent === second.secondComponent && first.secondComponent === second.firstComponent;
}
