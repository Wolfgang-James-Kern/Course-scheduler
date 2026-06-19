import type { ComponentType, CourseComponentIn, CourseIn, MeetingIn, SectionIn } from "./types.ts";
import { isValidTimeRange } from "./utils/time.ts";

export type MeetingDraft = MeetingIn & { draftId: string };
export type SectionDraft = Omit<SectionIn, "meetings"> & { draftId: string; meetings: MeetingDraft[] };
export type ComponentDraft = Omit<CourseComponentIn, "sections"> & { draftId: string; sections: SectionDraft[] };
export type CourseDraft = Omit<CourseIn, "components"> & { components: ComponentDraft[] };

export function emptyCourse(): CourseIn {
  const component = emptyComponent("LEC");
  return {
    code: "",
    components: [{
      type: component.type,
      enrollmentRequirement: component.enrollmentRequirement,
      attendanceRequirement: component.attendanceRequirement,
      meetingFrequency: component.meetingFrequency,
      included: component.included,
      sections: component.sections.map((section) => ({
        id: section.id,
        meetings: section.meetings.map((meeting) => ({
          day: meeting.day,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
        })),
      })),
    }],
    compatibilities: [],
  };
}

export function emptyComponent(type: ComponentType): ComponentDraft {
  return {
    draftId: newDraftId(),
    type,
    enrollmentRequirement: "REQUIRED",
    attendanceRequirement: "MANDATORY",
    meetingFrequency: "WEEKLY",
    included: true,
    sections: [emptySection()],
  };
}

export function emptySection(): SectionDraft {
  return { draftId: newDraftId(), id: "", meetings: [emptyMeeting()] };
}

export function emptyMeeting(): MeetingDraft {
  return { draftId: newDraftId(), day: "MONDAY", startTime: "09:30", endTime: "10:30" };
}

export function createDraft(course: CourseIn): CourseDraft {
  return {
    ...structuredClone(course),
    components: course.components.map((component) => ({
      ...structuredClone(component),
      draftId: newDraftId(),
      sections: component.sections.map((section) => ({
        ...structuredClone(section),
        draftId: newDraftId(),
        meetings: section.meetings.map((meeting) => ({ ...meeting, draftId: newDraftId() })),
      })),
    })),
  };
}

function newDraftId(): string {
  return crypto.randomUUID();
}

export function pruneCompatibilities(course: CourseIn): CourseIn["compatibilities"] {
  const sectionIds = new Map(course.components.map((component) => [
    component.type,
    new Set(component.sections.map((section) => section.id.trim().toUpperCase())),
  ]));
  return course.compatibilities
    .filter((compatibility) => (
      sectionIds.has(compatibility.firstComponent)
      && sectionIds.has(compatibility.secondComponent)
      && compatibility.firstComponent !== compatibility.secondComponent
    ))
    .map((compatibility) => ({
      ...compatibility,
      allowedPairs: compatibility.allowedPairs.filter((pair) => (
        sectionIds.get(compatibility.firstComponent)?.has(pair.firstSectionId.trim().toUpperCase())
        && sectionIds.get(compatibility.secondComponent)?.has(pair.secondSectionId.trim().toUpperCase())
      )),
    }));
}

export function validateCourse(course: CourseIn, existingCodes: string[]): string | null {
  if (!course.code.trim()) {
    return "Enter a course code.";
  }
  if (existingCodes.includes(course.code.trim().toUpperCase())) {
    return "Course codes must be unique.";
  }
  if (course.components.length === 0) {
    return "Add at least one course component.";
  }
  const componentTypes = new Set<ComponentType>();
  let includedComponents = 0;

  for (const component of course.components) {
    if (componentTypes.has(component.type)) {
      return "A course can only contain one component of each type.";
    }
    componentTypes.add(component.type);
    const included = component.enrollmentRequirement === "REQUIRED" || component.included;
    if (included) {
      includedComponents += 1;
    }
    if (included && component.sections.length === 0) {
      return `${component.type} needs at least one section while it is included.`;
    }
    const sectionIds = new Set<string>();
    for (const section of component.sections) {
      if (!section.id.trim()) {
        return `Every ${component.type} section needs an identifier.`;
      }
      if (sectionIds.has(section.id.trim().toUpperCase())) {
        return `${component.type} section identifiers must be unique.`;
      }
      sectionIds.add(section.id.trim().toUpperCase());
      if (section.meetings.length === 0) {
        return `${component.type} section ${section.id} needs at least one meeting.`;
      }
      if (section.meetings.some((meeting) => !isValidTimeRange(meeting.startTime, meeting.endTime))) {
        return `Check the meeting times in ${component.type} section ${section.id}.`;
      }
      for (let first = 0; first < section.meetings.length; first += 1) {
        for (let second = first + 1; second < section.meetings.length; second += 1) {
          const firstMeeting = section.meetings[first];
          const secondMeeting = section.meetings[second];
          if (
            firstMeeting.day === secondMeeting.day
            && firstMeeting.startTime < secondMeeting.endTime
            && secondMeeting.startTime < firstMeeting.endTime
          ) {
            return `${component.type} section ${section.id} contains overlapping meetings.`;
          }
        }
      }
    }
  }
  const compatibilityPairs = new Set<string>();
  for (const compatibility of course.compatibilities) {
    const first = course.components.find((component) => component.type === compatibility.firstComponent);
    const second = course.components.find((component) => component.type === compatibility.secondComponent);
    if (!first || !second || first === second) {
      return "Section compatibility must reference two existing components.";
    }
    const key = [compatibility.firstComponent, compatibility.secondComponent].sort().join(":");
    if (compatibilityPairs.has(key)) {
      return "Each component pair can only have one compatibility rule.";
    }
    compatibilityPairs.add(key);
    const firstIds = new Set(first.sections.map((section) => section.id.trim().toUpperCase()));
    const secondIds = new Set(second.sections.map((section) => section.id.trim().toUpperCase()));
    if (compatibility.allowedPairs.some((pair) => (
      !firstIds.has(pair.firstSectionId.trim().toUpperCase())
      || !secondIds.has(pair.secondSectionId.trim().toUpperCase())
    ))) {
      return "Section compatibility references a section that no longer exists.";
    }
  }
  return includedComponents === 0 ? "Include at least one course component." : null;
}
