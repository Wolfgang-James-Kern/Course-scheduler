import type { ImportContext, ImportFormat, ImportResult } from "../types.ts";

export interface CourseImportParser {
  readonly format: ImportFormat;
  supports(text: string): boolean;
  parse(text: string, context?: ImportContext): ImportResult;
}
