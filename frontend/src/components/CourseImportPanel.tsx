import { useState } from "react";
import { inferSemester, semesterLabel, type Semester } from "../academicYear.ts";
import { applyImportedCourses } from "../import/mapping/ImportedCourseMapper.ts";
import { CourseImportService } from "../import/service/CourseImportService.ts";
import type { ImportResolution, ImportResult } from "../import/types.ts";
import type { CourseIn } from "../types.ts";
import CompatibilityEditor from "./CompatibilityEditor.tsx";
import styles from "./CourseImportPanel.module.css";

const importService = new CourseImportService();

type CourseImportPanelProps = {
  activeSemester: Semester;
  semesterCourses: Record<Semester, CourseIn[]>;
  onImport: (courses: Record<Semester, CourseIn[]>) => void;
  onCancel: () => void;
};

export default function CourseImportPanel({ activeSemester, semesterCourses, onImport, onCancel }: CourseImportPanelProps) {
  const [text, setText] = useState("");
  const [fallbackCourseCode, setFallbackCourseCode] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [resolutions, setResolutions] = useState<Record<string, ImportResolution>>({});
  const [destinations, setDestinations] = useState<Record<string, Semester>>({});

  function parse() {
    const parsed = importService.parse(text, { fallbackCourseCode });
    setResult(parsed);
    setResolutions(Object.fromEntries(parsed.courses.map((course) => [course.code, "MERGE"])));
    setDestinations(Object.fromEntries(parsed.courses.map((course) => [
      course.code,
      inferSemester(course.code, text) ?? activeSemester,
    ])));
  }

  function updateCourse(index: number, course: CourseIn) {
    if (!result) {
      return;
    }
    setResult({
      ...result,
      courses: result.courses.map((existing, courseIndex) => courseIndex === index ? course : existing),
    });
  }

  function confirm() {
    if (!result) {
      return;
    }
    const nextCourses = {
      SEMESTER_1: structuredClone(semesterCourses.SEMESTER_1),
      SEMESTER_2: structuredClone(semesterCourses.SEMESTER_2),
    };
    (["SEMESTER_1", "SEMESTER_2"] as Semester[]).forEach((semester) => {
      const imports = result.courses.filter((course) => destinations[course.code] === semester);
      nextCourses[semester] = applyImportedCourses(nextCourses[semester], imports, resolutions);
    });
    onImport(nextCourses);
  }

  const hasErrors = result?.issues.some((issue) => issue.severity === "ERROR") ?? false;
  const canImport = Boolean(result && result.courses.length > 0 && !hasErrors);

  return (
    <div className={styles.panel}>
      <div className={styles.intro}>
        <h3>Import from Western</h3>
        <p>Copy a Western course-search result or the course table below a draft, then paste it here.</p>
      </div>

      <label className={styles.courseCodeField}>
        <span>Course code (if missing from copied text)</span>
        <input
          value={fallbackCourseCode}
          placeholder="e.g. DATASCI 3000B"
          onChange={(event) => {
            setFallbackCourseCode(event.target.value);
            setResult(null);
          }}
        />
      </label>

      <label className={styles.pasteField}>
        <span>Western course information</span>
        <textarea
          autoFocus
          value={text}
          placeholder="Paste copied Western course information"
          onChange={(event) => {
            setText(event.target.value);
            setResult(null);
          }}
        />
      </label>

      <div className={styles.parseActions}>
        <button className={styles.secondaryButton} onClick={onCancel}>Cancel</button>
        <button className={styles.parseButton} onClick={parse}>Review import</button>
      </div>

      {result && (
        <div className={styles.preview}>
          <div className={styles.previewHeading}>
            <div>
              <span>Detected format</span>
              <strong>{formatName(result.format)}</strong>
            </div>
            <b>{result.courses.length} {result.courses.length === 1 ? "course" : "courses"}</b>
          </div>

          {result.issues.length > 0 && (
            <div className={styles.issueList}>
              {result.issues.map((issue, index) => (
                <p className={issue.severity === "ERROR" ? styles.error : styles.warning} key={`${issue.message}-${index}`}>
                  {issue.message}
                </p>
              ))}
            </div>
          )}

          {result.courses.map((course, index) => {
            const destination = destinations[course.code] ?? activeSemester;
            const duplicate = semesterCourses[destination].some((existing) => existing.code.toUpperCase() === course.code.toUpperCase());
            const sectionCount = course.components.reduce((total, component) => total + component.sections.length, 0);
            return (
              <article className={styles.course} key={course.code}>
                <div className={styles.courseHeading}>
                  <div>
                    <strong>{course.code}</strong>
                    <span>{course.components.length} components · {sectionCount} sections</span>
                  </div>
                  <label>
                    <span>Import into</span>
                    <select
                      value={destination}
                      onChange={(event) => setDestinations({
                        ...destinations,
                        [course.code]: event.target.value as Semester,
                      })}
                    >
                      <option value="SEMESTER_1">Semester 1</option>
                      <option value="SEMESTER_2">Semester 2</option>
                    </select>
                  </label>
                  {duplicate && (
                    <label>
                      <span>Existing course</span>
                      <select
                        value={resolutions[course.code] ?? "MERGE"}
                        onChange={(event) => setResolutions({
                          ...resolutions,
                          [course.code]: event.target.value as ImportResolution,
                        })}
                      >
                        <option value="MERGE">Merge sections</option>
                        <option value="REPLACE">Replace course</option>
                        <option value="SKIP">Skip import</option>
                      </select>
                    </label>
                  )}
                </div>
                {destination !== activeSemester && (
                  <p className={styles.destinationNotice}>This course will be added to {semesterLabel(destination)}.</p>
                )}
                <div className={styles.componentSummary}>
                  {course.components.map((component) => (
                    <span key={component.type}>{component.type}: {component.sections.length}</span>
                  ))}
                </div>
                {course.compatibilities.length > 0 && (
                  <p className={styles.inferred}>Compatibility was inferred from the order of the Western course listing. Review it before importing.</p>
                )}
                <CompatibilityEditor
                  course={course}
                  onChange={(compatibilities) => updateCourse(index, { ...course, compatibilities })}
                />
              </article>
            );
          })}

          <button className={styles.importButton} disabled={!canImport} onClick={confirm}>
            Import reviewed courses
          </button>
        </div>
      )}
    </div>
  );
}

function formatName(format: ImportResult["format"]): string {
  if (format === "WESTERN_COURSE_SEARCH") {
    return "Western course search";
  }
  if (format === "WESTERN_DRAFT_TABLE") {
    return "Western draft table";
  }
  return "Unknown format";
}
