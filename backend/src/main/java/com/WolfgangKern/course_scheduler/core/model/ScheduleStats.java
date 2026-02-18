package com.WolfgangKern.course_scheduler.core.model;

import java.time.LocalTime;

/**
 * ScheduleStats: Summary stats used for displaying and ranking schedule solutions.
 */
public class ScheduleStats {
    private final LocalTime earliestStart, latestEnd;
    private final int totalGapMinutes, daysWithClasses;

    public ScheduleStats(LocalTime earliestStart, LocalTime latestEnd, int totalGapMinutes, int daysWithClasses) {
        this.earliestStart = earliestStart;
        this.latestEnd = latestEnd;
        this.totalGapMinutes = totalGapMinutes;
        this.daysWithClasses = daysWithClasses;
    }

    /**
     * Getters, No setters needed as ScheduleStats are final after creation.
     */
    public LocalTime getEarliestStart() {
        return earliestStart;
    }
    public LocalTime getLatestEnd() {
        return latestEnd;
    }
    public int getTotalGapMinutes() {
        return totalGapMinutes;
    }
    public int getDaysWithClasses() {
        return daysWithClasses;
    }
}
