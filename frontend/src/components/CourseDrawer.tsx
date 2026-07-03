import { useState } from "react";
import { otherSemester, semesterLabel, type Semester } from "../academicYear.ts";
import { emptyCourse } from "../courseEditorModel.ts";
import type { CourseIn } from "../types.ts";
import CourseEditor from "./CourseEditor.tsx";
import CourseImportPanel from "./CourseImportPanel.tsx";
import styles from "./CourseDrawer.module.css";

type CourseDrawerProps = {
  semester: Semester;
  courses: CourseIn[];
  otherSemesterCourses: CourseIn[];
  initialEditingIndex: number | null;
  onSave: (course: CourseIn, index: number | null, targetSemester: Semester) => boolean;
  onRemove: (index: number) => void;
  onMove: (index: number, targetSemester: Semester) => void;
  onSetSemesterCourses: (semester: Semester, courses: CourseIn[]) => void;
};

export default function CourseDrawer({
  semester,
  courses,
  otherSemesterCourses,
  initialEditingIndex,
  onSave,
  onRemove,
  onMove,
  onSetSemesterCourses,
}: CourseDrawerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null | "new" | "import">(() => (
    initialEditingIndex !== null && courses[initialEditingIndex] ? initialEditingIndex : null
  ));

  if (editingIndex === "import") {
    return (
      <CourseImportPanel
        activeSemester={semester}
        semesterCourses={{
          [semester]: courses,
          [otherSemester(semester)]: otherSemesterCourses,
        } as Record<Semester, CourseIn[]>}
        onCancel={() => setEditingIndex(null)}
        onImport={(nextCourses) => {
          onSetSemesterCourses("SEMESTER_1", nextCourses.SEMESTER_1);
          onSetSemesterCourses("SEMESTER_2", nextCourses.SEMESTER_2);
          setEditingIndex(null);
        }}
      />
    );
  }

  if (editingIndex !== null) {
    const index = editingIndex === "new" ? null : editingIndex;
    return (
      <CourseEditor
        key={editingIndex}
        course={index === null ? emptyCourse() : courses[index]}
        existingCodes={[
          ...courses.filter((_, courseIndex) => courseIndex !== index),
          ...otherSemesterCourses,
        ].map((course) => course.code.toUpperCase())}
        initialSemester={semester}
        onCancel={() => setEditingIndex(null)}
        onSave={(course, targetSemester) => {
          if (onSave(course, index, targetSemester)) {
            setEditingIndex(null);
          }
        }}
      />
    );
  }

  return (
    <div>
      <div className={styles.courseActions}>
        <button className={styles.primaryButtonFull} onClick={() => setEditingIndex("new")}>+ Add course</button>
        <button className={styles.importButton} onClick={() => setEditingIndex("import")}>Import from Western</button>
      </div>
      <div className={styles.courseList}>
        {courses.length === 0 && (
          <div className={styles.emptyState}>
            <strong>Your course list is empty.</strong>
            <span>Add each course and its lecture, tutorial, or lab components.</span>
          </div>
        )}
        {courses.map((course, index) => {
          const sectionCount = course.components.reduce((total, component) => total + component.sections.length, 0);
          return (
            <article className={styles.courseCard} key={course.code}>
              <div>
                <strong>{course.code}</strong>
                <span>{course.components.map((component) => component.type).join(" / ")}</span>
                <small>{sectionCount} {sectionCount === 1 ? "section" : "sections"}</small>
              </div>
              <div className={styles.cardActions}>
                <button onClick={() => setEditingIndex(index)}>Edit</button>
                <button onClick={() => onMove(index, otherSemester(semester))}>
                  Move to {semesterLabel(otherSemester(semester))}
                </button>
                <button
                  className={styles.dangerButton}
                  onClick={() => {
                    if (window.confirm(`Remove ${course.code} from ${semesterLabel(semester)}?`)) {
                      onRemove(index);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
