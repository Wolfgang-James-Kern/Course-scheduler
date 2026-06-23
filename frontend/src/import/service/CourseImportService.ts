import type { ImportContext, ImportResult } from "../types.ts";
import type { CourseImportParser } from "../parser/CourseImportParser.ts";
import { WesternCourseSearchParser } from "../parser/WesternCourseSearchParser.ts";
import { WesternDraftTableParser } from "../parser/WesternDraftTableParser.ts";

export class CourseImportService {
  private readonly parsers: CourseImportParser[];

  constructor(
    parsers: CourseImportParser[] = [
      new WesternDraftTableParser(),
      new WesternCourseSearchParser(),
    ],
  ) {
    this.parsers = parsers;
  }

  parse(text: string, context?: ImportContext): ImportResult {
    if (!text.trim()) {
      return {
        format: null,
        courses: [],
        issues: [{ severity: "ERROR", message: "Paste Western course information before parsing." }],
      };
    }
    const parser = this.parsers.find((candidate) => candidate.supports(text));
    if (!parser) {
      return {
        format: null,
        courses: [],
        issues: [{ severity: "ERROR", message: "The pasted text is not a supported Western course format." }],
      };
    }
    return parser.parse(text, context);
  }
}
