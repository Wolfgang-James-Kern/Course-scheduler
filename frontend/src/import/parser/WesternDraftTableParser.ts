import type { ComponentType } from "../../types.ts";
import type { ImportResult } from "../types.ts";
import type { CourseImportParser } from "./CourseImportParser.ts";
import { ImportedCourseBuilder } from "./ImportedCourseBuilder.ts";
import { collapsedLine, normalizedLines, parseMeetingLine } from "./WesternText.ts";

export class WesternDraftTableParser implements CourseImportParser {
  readonly format = "WESTERN_DRAFT_TABLE" as const;

  supports(text: string): boolean {
    const normalized = text.replace(/[\t ]+/g, " ");
    const hasHeader = /Subject\s+(?:Status\s+)?Course Number\s+Component\s+Section/i.test(normalized);
    const hasCourseRows = normalizedLines(text).map(collapsedLine).some((line) => Boolean(this.courseCode(line)));
    const hasComponents = /(?:^|\n)\s*(?:LEC|TUT|LAB)\s*(?:\n|$)/im.test(text);
    const hasMeetingTimes = /\d{1,2}:\d{2}\s*[AP]M\s*-\s*\d{1,2}:\d{2}\s*[AP]M/i.test(text);
    return hasHeader || hasCourseRows && hasComponents && (hasMeetingTimes || /Runs From:/i.test(text));
  }

  parse(text: string): ImportResult {
    const builder = new ImportedCourseBuilder();
    let pendingComponent: ComponentType | null = null;

    for (const line of normalizedLines(text)) {
      const collapsed = collapsedLine(line);
      const courseCode = this.courseCode(collapsed);
      if (courseCode) {
        builder.selectCourse(courseCode);
        pendingComponent = null;
        continue;
      }
      const component = this.componentType(collapsed);
      if (component) {
        pendingComponent = component;
        continue;
      }
      if (pendingComponent) {
        const sectionMatch = collapsed.match(/^([A-Z0-9]{3,})\b/i);
        if (sectionMatch) {
          builder.addSection(pendingComponent, sectionMatch[1]);
          pendingComponent = null;
          continue;
        }
      }
      const meetings = parseMeetingLine(line);
      meetings?.forEach((meeting) => builder.addMeeting(meeting));
    }

    const result = builder.build();
    if (result.courses.length === 0) {
      result.issues.push({ severity: "ERROR", message: "No scheduled Western course sections were found." });
    }
    return { format: this.format, courses: result.courses, issues: result.issues };
  }

  private courseCode(line: string): string | null {
    const statusMatch = line.match(
      /^([A-Z][A-Z0-9]*)\s+(?:ENROLLED|DROPPED|PLANNED|SELECTED|WAITLISTED|WAIT LISTED)\s+(\d{4}[A-Z]?)$/i,
    );
    if (statusMatch) {
      return `${statusMatch[1]} ${statusMatch[2]}`.toUpperCase();
    }
    const match = line.match(/^([A-Z][A-Z ]*?)\s+(\d{4}[A-Z]?)$/i);
    return match ? `${match[1].trim()} ${match[2]}`.toUpperCase() : null;
  }

  private componentType(line: string): ComponentType | null {
    const value = line.toUpperCase();
    return value === "LEC" || value === "TUT" || value === "LAB" ? value : null;
  }

}
