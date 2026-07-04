import { DAY_LABELS } from "../constants.ts";
import { buildScheduleCourseDetails } from "../scheduleDetails.ts";
import type { CourseIn, ScheduleOut } from "../types.ts";
import { formatTime } from "../utils/time.ts";
import styles from "./ScheduleDetailsPanel.module.css";

type ScheduleDetailsPanelProps = {
  courses: CourseIn[];
  schedule: ScheduleOut;
};

export default function ScheduleDetailsPanel({ courses, schedule }: ScheduleDetailsPanelProps) {
  const courseDetails = buildScheduleCourseDetails(courses, schedule);

  return (
    <div className={styles.courseList}>
      {courseDetails.map((course) => (
        <article className={styles.courseCard} key={course.code}>
          <header>
            <h3>{course.code}</h3>
          </header>
          <div className={styles.sectionList}>
            {course.sections.map((section) => (
              <section className={styles.section} key={`${section.componentType}-${section.id}`}>
                <strong>{section.componentType} {section.id}</strong>
                <div className={styles.meetings}>
                  {section.meetings.map((meeting, index) => (
                    <div key={`${meeting.day}-${meeting.startTime}-${index}`}>
                      <span>{DAY_LABELS[meeting.day]}</span>
                      <time>{formatTime(meeting.startTime)}–{formatTime(meeting.endTime)}</time>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
