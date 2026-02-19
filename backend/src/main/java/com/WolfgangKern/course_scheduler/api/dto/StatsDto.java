package com.WolfgangKern.course_scheduler.api.dto;

/**
 * StatsDto:  Summary stats used for displaying and ranking schedule solutions.
 */
public class StatsDto {
    private String earliestStart, latestEnd;
    private int totalGapMinutes, daysWithClasses;

    public StatsDto() {}

    public StatsDto(String earliestStart, String latestEnd, int totalGapMinutes, int daysWithClasses) {
        this.earliestStart = earliestStart;
        this.latestEnd = latestEnd;
        this.totalGapMinutes = totalGapMinutes;
        this.daysWithClasses = daysWithClasses;
    }

    /*
     * Getters and Setters, no special conditions needed 
     */

    public String getEarliestStart() {
        return earliestStart;
    }
    public String getLatestEnd() {
        return latestEnd;
    }
    public int getTotalGapMinutes() {
        return totalGapMinutes;
    }
    public int getDaysWithClasses() {
        return daysWithClasses;
    }
}