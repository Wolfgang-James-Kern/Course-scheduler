package com.wolfgangkern.coursescheduler.core.model;

import java.time.LocalTime;

/**
 * Summarizes visible schedule characteristics for the full week, including occasional meetings.
 */
public record ScheduleStats(
    LocalTime earliestStart,
    LocalTime latestEnd,
    int totalGapMinutes,
    int daysWithClasses
) {
    /**
     * Creates validated schedule statistics.
     */
    public ScheduleStats {
        if (totalGapMinutes < 0 || daysWithClasses < 0) {
            throw new IllegalArgumentException("Schedule statistics cannot be negative.");
        }
    }
}
