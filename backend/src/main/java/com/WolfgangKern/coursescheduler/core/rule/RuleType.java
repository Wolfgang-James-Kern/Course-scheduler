package com.wolfgangkern.coursescheduler.core.rule;

/**
 * Identifies the built-in scheduling rules available to clients.
 */
public enum RuleType {
    EARLIEST_START,
    LATEST_END,
    MAXIMUM_GAP,
    MAXIMUM_MEETINGS_PER_DAY,
    MAXIMUM_CONTINUOUS_BLOCK,
    MINIMUM_DAY_LENGTH,
    MAXIMUM_DAILY_SPAN,
    AVOID_SINGLE_MEETING_DAYS,
    BLOCKED_TIME,
    DAYS_OFF,
    MAXIMUM_CAMPUS_DAYS,
    MAXIMUM_WEEKLY_GAP,
    BALANCE_WORKLOAD,
    CLUSTER_CAMPUS_DAYS,
    OCCASIONAL_MEETINGS_AT_DAY_EDGES
}
