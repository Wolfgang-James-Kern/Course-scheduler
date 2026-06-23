import type { ComponentCompatibilityIn, ComponentType, CourseIn } from "../../types.ts";
import type { ImportContext, ImportResult } from "../types.ts";
import type { CourseImportParser } from "./CourseImportParser.ts";
import { ImportedCourseBuilder } from "./ImportedCourseBuilder.ts";
import { collapsedLine, normalizedLines, parseMeetingLine } from "./WesternText.ts";

type ParsedRecord = {
  type: ComponentType;
  sectionId: string;
};

export class WesternCourseSearchParser implements CourseImportParser {
  readonly format = "WESTERN_COURSE_SEARCH" as const;

  supports(text: string): boolean {
    const normalized = text.replace(/[\t ]+/g, " ");
    const fullCourse = /Course Description:/i.test(text)
      && /Class runs:/i.test(text)
      && /Component\s+Section\s+Class Nbr/i.test(normalized);
    const componentFragment = /(?:^|\n)\s*(?:LEC|TUT|LAB)\s*(?:\n|$)/im.test(text)
      && /\d{1,2}:\d{2}\s*[AP]M\s*-\s*\d{1,2}:\d{2}\s*[AP]M/i.test(text);
    return fullCourse || componentFragment;
  }

  parse(text: string, context?: ImportContext): ImportResult {
    const lines = normalizedLines(text);
    const heading = lines.map(collapsedLine).find((line) => this.courseCode(line));
    const code = heading ? this.courseCode(heading) : context?.fallbackCourseCode?.trim().toUpperCase() || null;
    if (!code) {
      return {
        format: this.format,
        courses: [],
        issues: [{
          severity: "ERROR",
          message: "Western did not include the course heading. Enter the course code and review the import again.",
        }],
      };
    }

    const builder = new ImportedCourseBuilder();
    const records: ParsedRecord[] = [];
    builder.selectCourse(code);
    let pendingComponent: ComponentType | null = null;

    for (const line of lines) {
      const collapsed = collapsedLine(line);
      const component = this.componentType(collapsed);
      if (component) {
        pendingComponent = component;
        continue;
      }
      if (pendingComponent) {
        const sectionMatch = collapsed.match(/^([A-Z0-9]{3,})\b/i);
        if (sectionMatch) {
          const sectionId = sectionMatch[1].toUpperCase();
          builder.addSection(pendingComponent, sectionId);
          records.push({ type: pendingComponent, sectionId });
          pendingComponent = null;
          continue;
        }
      }
      const meetings = parseMeetingLine(line);
      meetings?.forEach((meeting) => builder.addMeeting(meeting));
    }

    const initial = builder.build();
    if (initial.courses.length === 0) {
      initial.issues.push({ severity: "ERROR", message: "No scheduled Western course sections were found." });
    }
    const course = initial.courses[0];
    if (course) {
      course.compatibilities = this.inferCompatibilities(course, records);
    }
    return { format: this.format, courses: initial.courses, issues: initial.issues };
  }

  private courseCode(line: string): string | null {
    const match = line.match(/^([A-Z][A-Z ]*?)\s+(\d{4}[A-Z]?)\s+-/i);
    return match ? `${match[1].trim()} ${match[2]}`.toUpperCase() : null;
  }

  private componentType(line: string): ComponentType | null {
    const value = line.toUpperCase();
    return value === "LEC" || value === "TUT" || value === "LAB" ? value : null;
  }

  private inferCompatibilities(course: CourseIn, records: ParsedRecord[]): ComponentCompatibilityIn[] {
    const lectureCount = records.filter((record) => record.type === "LEC").length;
    if (lectureCount === 0) {
      return [];
    }
    const visiblyGrouped = lectureCount === 1 || records.some((record, index) => (
      record.type !== "LEC" && records.slice(index + 1).some((later) => later.type === "LEC")
    ));
    if (!visiblyGrouped) {
      return [];
    }

    const validSections = new Map(course.components.map((component) => [
      component.type,
      new Set(component.sections.map((section) => section.id)),
    ]));
    const pairsByComponent = new Map<ComponentType, ComponentCompatibilityIn>();
    let currentLecture: string | null = null;
    for (const record of records) {
      if (record.type === "LEC") {
        currentLecture = record.sectionId;
        continue;
      }
      if (
        !currentLecture
        || !validSections.get("LEC")?.has(currentLecture)
        || !validSections.get(record.type)?.has(record.sectionId)
      ) {
        continue;
      }
      const compatibility = pairsByComponent.get(record.type) ?? {
        firstComponent: "LEC",
        secondComponent: record.type,
        allowedPairs: [],
      };
      compatibility.allowedPairs.push({
        firstSectionId: currentLecture,
        secondSectionId: record.sectionId,
      });
      pairsByComponent.set(record.type, compatibility);
    }
    return [...pairsByComponent.values()];
  }
}
