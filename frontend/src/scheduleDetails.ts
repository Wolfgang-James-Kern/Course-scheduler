import type { CourseIn, ScheduleOut, SectionOut } from "./types.ts";

export type ScheduleCourseDetails = {
  code: string;
  sections: SectionOut[];
};

export function buildScheduleCourseDetails(courses: CourseIn[], schedule: ScheduleOut): ScheduleCourseDetails[] {
  return courses.flatMap((course) => {
    const sections = schedule.sections.filter((section) => section.courseCode === course.code);
    return sections.length > 0 ? [{ code: course.code, sections }] : [];
  });
}
