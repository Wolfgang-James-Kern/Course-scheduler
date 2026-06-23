import type {
  ComponentType,
  CourseComponentIn,
  CourseIn,
  MeetingIn,
  SectionIn,
} from "../../types.ts";
import type { ImportIssue } from "../types.ts";

export class ImportedCourseBuilder {
  private readonly courses = new Map<string, CourseIn>();
  private readonly issues: ImportIssue[] = [];
  private currentCourse: CourseIn | null = null;
  private currentSection: SectionIn | null = null;

  selectCourse(code: string): void {
    const normalizedCode = code.trim().toUpperCase();
    const course = this.courses.get(normalizedCode) ?? {
      code: normalizedCode,
      components: [],
      compatibilities: [],
    };
    this.courses.set(normalizedCode, course);
    this.currentCourse = course;
    this.currentSection = null;
  }

  addSection(type: ComponentType, sectionId: string): void {
    if (!this.currentCourse) {
      this.issues.push({ severity: "ERROR", message: "A section appeared before its course heading." });
      return;
    }
    const component = this.component(type);
    const normalizedId = sectionId.trim().toUpperCase();
    const existing = component.sections.find((section) => section.id === normalizedId);
    if (existing) {
      this.currentSection = existing;
      this.issues.push({
        severity: "WARNING",
        message: `${this.currentCourse.code} ${type} ${normalizedId} appeared more than once and was merged.`,
      });
      return;
    }
    const section: SectionIn = { id: normalizedId, meetings: [] };
    component.sections.push(section);
    this.currentSection = section;
  }

  addMeeting(meeting: MeetingIn): void {
    if (!this.currentSection) {
      return;
    }
    const duplicate = this.currentSection.meetings.some((existing) => (
      existing.day === meeting.day
      && existing.startTime === meeting.startTime
      && existing.endTime === meeting.endTime
    ));
    if (!duplicate) {
      this.currentSection.meetings.push(meeting);
    }
  }

  build(): { courses: CourseIn[]; issues: ImportIssue[] } {
    const courses: CourseIn[] = [];
    for (const course of this.courses.values()) {
      const components = course.components
        .map((component) => ({
          ...component,
          sections: component.sections.filter((section) => {
            if (section.meetings.length > 0) {
              return true;
            }
            this.issues.push({
              severity: "WARNING",
              message: `${course.code} ${component.type} ${section.id} was skipped because it has no scheduled meetings.`,
            });
            return false;
          }),
        }))
        .filter((component) => component.sections.length > 0);
      if (components.length === 0) {
        const hadSections = course.components.some((component) => component.sections.length > 0);
        this.issues.push({
          severity: hadSections ? "WARNING" : "ERROR",
          message: hadSections
            ? `${course.code} was skipped because its sections do not have scheduled meeting times.`
            : `${course.code} did not contain any sections.`,
        });
        continue;
      }
      const componentTypes = new Set(components.map((component) => component.type));
      const sectionIds = new Map(components.map((component) => [
        component.type,
        new Set(component.sections.map((section) => section.id)),
      ]));
      const compatibilities = course.compatibilities
        .filter((compatibility) => (
          componentTypes.has(compatibility.firstComponent)
          && componentTypes.has(compatibility.secondComponent)
        ))
        .map((compatibility) => ({
          ...compatibility,
          allowedPairs: compatibility.allowedPairs.filter((pair) => (
            sectionIds.get(compatibility.firstComponent)?.has(pair.firstSectionId)
            && sectionIds.get(compatibility.secondComponent)?.has(pair.secondSectionId)
          )),
        }));
      courses.push({ ...course, components, compatibilities });
    }
    return { courses, issues: [...this.issues] };
  }

  private component(type: ComponentType): CourseComponentIn {
    const existing = this.currentCourse?.components.find((component) => component.type === type);
    if (existing) {
      return existing;
    }
    const component: CourseComponentIn = {
      type,
      enrollmentRequirement: "REQUIRED",
      attendanceRequirement: "MANDATORY",
      meetingFrequency: "WEEKLY",
      included: true,
      sections: [],
    };
    this.currentCourse?.components.push(component);
    return component;
  }
}
