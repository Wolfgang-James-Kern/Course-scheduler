export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";

export type MeetingIn = {
  day: Day;
  startTime: string;
  endTime: string;
};

export type SectionIn = {
  id: string;
  meetings: MeetingIn[];
};

export type ComponentType = "LEC" | "TUT" | "LAB";
export type EnrollmentRequirement = "REQUIRED" | "OPTIONAL";
export type AttendanceRequirement = "MANDATORY" | "NON_MANDATORY";
export type MeetingFrequency = "WEEKLY" | "OCCASIONAL";

export type CourseComponentIn = {
  type: ComponentType;
  enrollmentRequirement: EnrollmentRequirement;
  attendanceRequirement: AttendanceRequirement;
  meetingFrequency?: MeetingFrequency;
  included: boolean;
  sections: SectionIn[];
};

export type SectionPairIn = {
  firstSectionId: string;
  secondSectionId: string;
};

export type ComponentCompatibilityIn = {
  firstComponent: ComponentType;
  secondComponent: ComponentType;
  allowedPairs: SectionPairIn[];
};

export type CourseIn = {
  code: string;
  components: CourseComponentIn[];
  compatibilities: ComponentCompatibilityIn[];
};

export type RuleType =
  | "EARLIEST_START"
  | "LATEST_END"
  | "MAXIMUM_GAP"
  | "MAXIMUM_MEETINGS_PER_DAY"
  | "MAXIMUM_CONTINUOUS_BLOCK"
  | "MINIMUM_DAY_LENGTH"
  | "MAXIMUM_DAILY_SPAN"
  | "AVOID_SINGLE_MEETING_DAYS"
  | "BLOCKED_TIME"
  | "DAYS_OFF"
  | "MAXIMUM_CAMPUS_DAYS"
  | "MAXIMUM_WEEKLY_GAP"
  | "BALANCE_WORKLOAD"
  | "CLUSTER_CAMPUS_DAYS"
  | "OCCASIONAL_MEETINGS_AT_DAY_EDGES";

export type RuleMode = "HARD" | "PREFERENCE";

type RuleConfigurationBase = {
  mode: RuleMode;
  importance: number;
};

export type RuleConfiguration =
  | RuleConfigurationBase & {
    type: "EARLIEST_START" | "LATEST_END";
    time: string;
  }
  | RuleConfigurationBase & {
    type:
      | "MAXIMUM_GAP"
      | "MAXIMUM_CONTINUOUS_BLOCK"
      | "MINIMUM_DAY_LENGTH"
      | "MAXIMUM_DAILY_SPAN"
      | "MAXIMUM_WEEKLY_GAP"
      | "BALANCE_WORKLOAD";
    minutes: number;
  }
  | RuleConfigurationBase & {
    type: "MAXIMUM_MEETINGS_PER_DAY" | "MAXIMUM_CAMPUS_DAYS";
    count: number;
  }
  | RuleConfigurationBase & {
    type: "DAYS_OFF";
    days: Day[];
  }
  | RuleConfigurationBase & {
    type: "BLOCKED_TIME";
    day: Day;
    startTime: string;
    endTime: string;
  }
  | RuleConfigurationBase & {
    type: "AVOID_SINGLE_MEETING_DAYS" | "CLUSTER_CAMPUS_DAYS" | "OCCASIONAL_MEETINGS_AT_DAY_EDGES";
  };

export type SolveRequest = {
  topN: number;
  rules: RuleConfiguration[];
  courses: CourseIn[];
};

export type MeetingOut = {
  day: Day;
  startTime: string;
  endTime: string;
};

export type SectionOut = {
  courseCode: string;
  componentType: ComponentType;
  attendanceRequirement: AttendanceRequirement;
  meetingFrequency: MeetingFrequency;
  id: string;
  meetings: MeetingOut[];
};

export type StatsOut = {
  earliestStart: string | null;
  latestEnd: string | null;
  totalGapMinutes: number;
  daysWithClasses: number;
};

export type RuleEvaluation = {
  type: RuleType;
  mode: RuleMode;
  satisfied: boolean;
  violation: number;
  penalty: number;
  explanation: string;
};

export type ScheduleOut = {
  sections: SectionOut[];
  stats: StatsOut;
  score: number;
  ruleEvaluations: RuleEvaluation[];
};

export type SolveResponse = {
  schedules: ScheduleOut[];
};
