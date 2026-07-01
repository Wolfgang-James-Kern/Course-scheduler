import { useState } from "react";
import { inferSemester, semesterLabel, type Semester } from "../academicYear.ts";
import { COMPONENT_TYPES } from "../constants.ts";
import {
  createDraft,
  emptyComponent,
  pruneCompatibilities,
  validateCourse,
  type ComponentDraft,
  type CourseDraft,
} from "../courseEditorModel.ts";
import type { ComponentType, CourseIn } from "../types.ts";
import CompatibilityEditor from "./CompatibilityEditor.tsx";
import ComponentCard from "./ComponentCard.tsx";
import styles from "./CourseDrawer.module.css";

type CourseEditorProps = {
  course: CourseIn;
  existingCodes: string[];
  initialSemester: Semester;
  onSave: (course: CourseIn, targetSemester: Semester) => void;
  onCancel: () => void;
};

export default function CourseEditor({ course, existingCodes, initialSemester, onSave, onCancel }: CourseEditorProps) {
  const [draft, setDraft] = useState<CourseDraft>(() => createDraft(course));
  const [targetSemester, setTargetSemester] = useState(initialSemester);
  const [error, setError] = useState("");
  const [expandedDraftId, setExpandedDraftId] = useState<string | null>(
    () => draft.components[0]?.draftId ?? null,
  );
  const effectiveExpandedId = draft.components.some((component) => component.draftId === expandedDraftId)
    ? expandedDraftId
    : (draft.components[0]?.draftId ?? null);

  function updateComponent(index: number, updater: (component: ComponentDraft) => ComponentDraft) {
    setDraft((current) => ({
      ...current,
      components: current.components.map((component, componentIndex) => (
        componentIndex === index ? updater(component) : component
      )),
    }));
  }

  function updateSectionId(componentIndex: number, sectionIndex: number, nextId: string) {
    setDraft((current) => {
      const component = current.components[componentIndex];
      const previousId = component.sections[sectionIndex].id;
      const normalizedPreviousId = previousId.trim().toUpperCase();
      return {
        ...current,
        components: current.components.map((existingComponent, existingComponentIndex) => (
          existingComponentIndex === componentIndex
            ? {
              ...existingComponent,
              sections: existingComponent.sections.map((section, existingSectionIndex) => (
                existingSectionIndex === sectionIndex ? { ...section, id: nextId } : section
              )),
            }
            : existingComponent
        )),
        compatibilities: current.compatibilities.map((compatibility) => ({
          ...compatibility,
          allowedPairs: compatibility.allowedPairs.map((pair) => ({
            firstSectionId: compatibility.firstComponent === component.type
              && pair.firstSectionId.trim().toUpperCase() === normalizedPreviousId
              ? nextId
              : pair.firstSectionId,
            secondSectionId: compatibility.secondComponent === component.type
              && pair.secondSectionId.trim().toUpperCase() === normalizedPreviousId
              ? nextId
              : pair.secondSectionId,
          })),
        })),
      };
    });
  }

  function addComponent() {
    const nextComponent = emptyComponent("LEC");
    setDraft((current) => {
      const type = COMPONENT_TYPES.find((candidate) => (
        !current.components.some((component) => component.type === candidate)
      ));
      if (!type) {
        return current;
      }
      return {
        ...current,
        components: [...current.components, { ...nextComponent, type }],
      };
    });
    setExpandedDraftId(nextComponent.draftId);
  }

  function changeComponentType(componentIndex: number, type: ComponentType) {
    setDraft((current) => {
      const nextCourse = {
        ...current,
        components: current.components.map((existingComponent, index) => (
          index === componentIndex
            ? { ...existingComponent, type }
            : existingComponent
        )),
      };
      return { ...nextCourse, compatibilities: pruneCompatibilities(nextCourse) };
    });
  }

  function removeComponent(componentIndex: number) {
    const removedId = draft.components[componentIndex]?.draftId;
    setDraft((current) => {
      const nextCourse = {
        ...current,
        components: current.components.filter((_, index) => index !== componentIndex),
      };
      return { ...nextCourse, compatibilities: pruneCompatibilities(nextCourse) };
    });
    setExpandedDraftId((currentExpanded) => {
      if (currentExpanded !== removedId) {
        return currentExpanded;
      }
      const remaining = draft.components.filter((_, index) => index !== componentIndex);
      return remaining[0]?.draftId ?? null;
    });
  }

  function removeSection(componentIndex: number, sectionIndex: number) {
    setDraft((current) => {
      const nextCourse = {
        ...current,
        components: current.components.map((existingComponent, index) => (
          index === componentIndex
            ? {
              ...existingComponent,
              sections: existingComponent.sections.filter((_, existingIndex) => existingIndex !== sectionIndex),
            }
            : existingComponent
        )),
      };
      return { ...nextCourse, compatibilities: pruneCompatibilities(nextCourse) };
    });
  }

  function save() {
    const normalizedCourse: CourseIn = {
      code: draft.code.trim().toUpperCase(),
      components: draft.components.map((component) => ({
        type: component.type,
        enrollmentRequirement: component.enrollmentRequirement,
        attendanceRequirement: component.attendanceRequirement,
        meetingFrequency: component.meetingFrequency ?? "WEEKLY",
        included: component.enrollmentRequirement === "REQUIRED" || component.included,
        sections: component.sections.map((section) => ({
          id: section.id.trim().toUpperCase(),
          meetings: section.meetings.map((meeting) => ({
            day: meeting.day,
            startTime: meeting.startTime,
            endTime: meeting.endTime,
          })),
        })),
      })),
      compatibilities: draft.compatibilities.map((compatibility) => ({
        ...compatibility,
        allowedPairs: compatibility.allowedPairs.map((pair) => ({
          firstSectionId: pair.firstSectionId.trim().toUpperCase(),
          secondSectionId: pair.secondSectionId.trim().toUpperCase(),
        })),
      })),
    };
    const validationError = validateCourse(normalizedCourse, existingCodes);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(normalizedCourse, targetSemester);
  }

  return (
    <div className={styles.editor}>
      <div className={styles.field}>
        <label htmlFor="course-code">Course code</label>
        <input
          id="course-code"
          autoFocus
          value={draft.code}
          placeholder="e.g. SE 3375"
          onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="course-semester">Add to</label>
        <select
          id="course-semester"
          value={targetSemester}
          onChange={(event) => setTargetSemester(event.target.value as Semester)}
        >
          <option value="SEMESTER_1">Semester 1</option>
          <option value="SEMESTER_2">Semester 2</option>
        </select>
        {inferSemester(draft.code) && inferSemester(draft.code) !== targetSemester && (
          <span className={styles.semesterWarning}>
            The course suffix suggests {semesterLabel(inferSemester(draft.code) as Semester)}.
          </span>
        )}
      </div>

      <div className={styles.sectionHeading}>
        <div>
          <h3>Components</h3>
          <p>Add the lectures, tutorials, and labs offered for this course.</p>
        </div>
        <button
          className={styles.secondaryButton}
          disabled={draft.components.length >= COMPONENT_TYPES.length}
          onClick={addComponent}
        >
          Add component
        </button>
      </div>

      {draft.components.length === 0 && (
        <div className={styles.emptyState}>No components added yet.</div>
      )}

      {draft.components.map((component, componentIndex) => (
        <ComponentCard
          key={component.draftId}
          component={component}
          expanded={effectiveExpandedId === component.draftId}
          onToggleExpand={() => setExpandedDraftId((current) => (
            current === component.draftId ? null : component.draftId
          ))}
          onChange={(updater) => updateComponent(componentIndex, updater)}
          onChangeType={(type) => changeComponentType(componentIndex, type)}
          onRemove={() => removeComponent(componentIndex)}
          onUpdateSectionId={(sectionIndex, nextId) => updateSectionId(componentIndex, sectionIndex, nextId)}
          onRemoveSection={(sectionIndex) => removeSection(componentIndex, sectionIndex)}
        />
      ))}

      {draft.components.length > 1 && (
        <CompatibilityEditor
          course={draft}
          onChange={(compatibilities) => setDraft((current) => ({ ...current, compatibilities }))}
        />
      )}

      {error && <div className={styles.error} role="alert">{error}</div>}

      <div className={styles.actions}>
        <button className={styles.secondaryButton} onClick={onCancel}>Cancel</button>
        <button className={styles.primaryButton} onClick={save}>Save course</button>
      </div>
    </div>
  );
}
