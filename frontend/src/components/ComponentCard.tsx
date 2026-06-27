import { COMPONENT_TYPES } from "../constants.ts";
import {
  emptyMeeting,
  emptySection,
  type ComponentDraft,
  type MeetingDraft,
} from "../courseEditorModel.ts";
import type {
  AttendanceRequirement,
  ComponentType,
  EnrollmentRequirement,
  MeetingFrequency,
} from "../types.ts";
import MeetingRow from "./MeetingRow.tsx";
import styles from "./CourseDrawer.module.css";

type ComponentCardProps = {
  component: ComponentDraft;
  expanded: boolean;
  onToggleExpand: () => void;
  onChange: (updater: (component: ComponentDraft) => ComponentDraft) => void;
  onChangeType: (type: ComponentType) => void;
  onRemove: () => void;
  onUpdateSectionId: (sectionIndex: number, nextId: string) => void;
  onRemoveSection: (sectionIndex: number) => void;
};

export default function ComponentCard({
  component,
  expanded,
  onToggleExpand,
  onChange,
  onChangeType,
  onRemove,
  onUpdateSectionId,
  onRemoveSection,
}: ComponentCardProps) {
  function updateMeeting(sectionIndex: number, meetingIndex: number, nextMeeting: MeetingDraft) {
    onChange((current) => ({
      ...current,
      sections: current.sections.map((section, currentSectionIndex) => (
        currentSectionIndex === sectionIndex
          ? {
            ...section,
            meetings: section.meetings.map((meeting, currentMeetingIndex) => (
              currentMeetingIndex === meetingIndex ? nextMeeting : meeting
            )),
          }
          : section
      )),
    }));
  }

  function removeMeeting(sectionIndex: number, meetingIndex: number) {
    onChange((current) => ({
      ...current,
      sections: current.sections.map((section, currentSectionIndex) => (
        currentSectionIndex === sectionIndex
          ? {
            ...section,
            meetings: section.meetings.filter((_, currentMeetingIndex) => currentMeetingIndex !== meetingIndex),
          }
          : section
      )),
    }));
  }

  function addMeeting(sectionIndex: number) {
    onChange((current) => ({
      ...current,
      sections: current.sections.map((section, currentSectionIndex) => (
        currentSectionIndex === sectionIndex
          ? { ...section, meetings: [...section.meetings, emptyMeeting()] }
          : section
      )),
    }));
  }

  return (
    <article className={styles.componentCard}>
      <div className={styles.componentHeader}>
        <button
          type="button"
          className={styles.componentToggle}
          aria-expanded={expanded}
          onClick={onToggleExpand}
        >
          <strong>{component.type}</strong>
          <span>
            {component.sections.length} {component.sections.length === 1 ? "section" : "sections"}
          </span>
        </button>
        <button
          className={styles.iconButton}
          aria-label={`Remove ${component.type} component`}
          onClick={onRemove}
        >
          &times;
        </button>
      </div>

      {expanded && (
        <>
          <label className={styles.componentType}>
            <span>Component</span>
            <select
              value={component.type}
              onChange={(event) => onChangeType(event.target.value as ComponentType)}
            >
              {COMPONENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>

          <div className={styles.componentSettings}>
            <label className={styles.field}>
              <span>Registration</span>
              <select
                value={component.enrollmentRequirement}
                onChange={(event) => {
                  const enrollmentRequirement = event.target.value as EnrollmentRequirement;
                  onChange((current) => ({
                    ...current,
                    enrollmentRequirement,
                    included: enrollmentRequirement === "REQUIRED" || current.included,
                  }));
                }}
              >
                <option value="REQUIRED">Required</option>
                <option value="OPTIONAL">Optional</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Attendance</span>
              <select
                value={component.attendanceRequirement}
                onChange={(event) => onChange((current) => ({
                  ...current,
                  attendanceRequirement: event.target.value as AttendanceRequirement,
                }))}
              >
                <option value="MANDATORY">Mandatory</option>
                <option value="NON_MANDATORY">Non-mandatory</option>
              </select>
            </label>
            <label className={`${styles.field} ${styles.frequencyField}`}>
              <span>Meeting frequency</span>
              <select
                value={component.meetingFrequency ?? "WEEKLY"}
                onChange={(event) => onChange((current) => ({
                  ...current,
                  meetingFrequency: event.target.value as MeetingFrequency,
                }))}
              >
                <option value="WEEKLY">Weekly</option>
                <option value="OCCASIONAL">Occasional (about every three weeks)</option>
              </select>
            </label>
          </div>

          {component.enrollmentRequirement === "OPTIONAL" && (
            <label className={styles.includeToggle}>
              <input
                type="checkbox"
                checked={component.included}
                onChange={(event) => {
                  const included = event.target.checked;
                  onChange((current) => ({ ...current, included }));
                }}
              />
              Include this optional component when generating schedules
            </label>
          )}

          {component.attendanceRequirement === "NON_MANDATORY" && (
            <p className={styles.componentNote}>
              Registration conflicts are still prevented, but these meetings will not affect rules or scoring.
            </p>
          )}

          {component.meetingFrequency === "OCCASIONAL" && (
            <p className={styles.componentNote}>
              Registration conflicts are always prevented. Preference penalties are frequency-weighted, and requirements must pass both week types.
            </p>
          )}

          <div className={styles.subheading}>
            <strong>Sections</strong>
            <button
              className={styles.textButton}
              onClick={() => onChange((current) => ({
                ...current,
                sections: [...current.sections, emptySection()],
              }))}
            >
              + Add section
            </button>
          </div>

          {component.sections.length === 0 && <div className={styles.componentEmpty}>No sections added.</div>}

          {component.sections.map((section, sectionIndex) => (
            <section className={styles.sectionCard} key={section.draftId}>
              <div className={styles.sectionTopline}>
                <div className={styles.field}>
                  <label htmlFor={`section-${component.draftId}-${sectionIndex}`}>Section ID</label>
                  <input
                    id={`section-${component.draftId}-${sectionIndex}`}
                    value={section.id}
                    placeholder="e.g. 001"
                    onChange={(event) => onUpdateSectionId(sectionIndex, event.target.value)}
                  />
                </div>
                <button
                  className={styles.iconButton}
                  aria-label="Remove section"
                  onClick={() => onRemoveSection(sectionIndex)}
                >
                  &times;
                </button>
              </div>

              <div className={styles.meetingList}>
                {section.meetings.map((meeting, meetingIndex) => (
                  <MeetingRow
                    key={meeting.draftId}
                    meeting={meeting}
                    onChange={(nextMeeting) => updateMeeting(sectionIndex, meetingIndex, nextMeeting)}
                    onRemove={() => removeMeeting(sectionIndex, meetingIndex)}
                  />
                ))}
              </div>

              <button
                className={styles.textButton}
                onClick={() => addMeeting(sectionIndex)}
              >
                + Add meeting
              </button>
            </section>
          ))}
        </>
      )}
    </article>
  );
}
