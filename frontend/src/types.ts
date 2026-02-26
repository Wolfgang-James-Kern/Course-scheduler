export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";

export type MeetingIn = {
  day: Day;
  startTime: string;// "HH:MM"
  endTime: string;
};

export type SectionIn = {
  id: string;
  meetings: MeetingIn[];
};

export type CourseIn = {
    code: string;
    sections: SectionIn[];
};

export type ConstraintsIn = {
    earliestStart?: string;
    latestEnd?: string;
    maxGapMinutes?: number;
};

export type SolveRequest = {
    topN: number;
    constraints: ConstraintsIn;
    courses: CourseIn[];
};

export type MeetingOut = {
  day: string;//e.g. "MONDAY"
  startTime: string;// "HH:MM"
  endTime: string;
};

export type SectionOut = {
  courseCode: string;
  id: string;
  meetings: MeetingOut[];
};

export type StatsOut = {
    earliestStart: string;
    latestEnd: string;
    totalGapMinutes: number;
    daysWithClasses: number;
};

export type ScheduleOut = {
    sections: SectionOut[];
    stats: StatsOut;
    score: number;
};

export type SolveResponse = {
    schedules: ScheduleOut[];
};
