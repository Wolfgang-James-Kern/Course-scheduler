package com.WolfgangKern.course_scheduler.api.dto;

import java.util.List;

/**
 * ConstraintsDto: Optional constraints used when ranking schedules
 */
public class ConstraintsDto {
    private String earliestStart, latestEnd;
    private List<String> daysOff;
    private Integer maxGapMinutes;

    ConstraintsDto() {}

    /*
     * Getters and Setters, no special conditions needed
     */

    public String getEarliestStart() {
        return earliestStart;
    }

    public void setEarliestStart(String earliestStart) {
        this.earliestStart = earliestStart;
    }

    public String getLatestEnd() {
        return latestEnd;
    }

    public void setLatestEnd(String latestEnd) {
        this.latestEnd = latestEnd;
    }

    public List<String> getDaysOff() {
        return daysOff;
    }
    
    public void setDaysOff(List<String> daysOff) {
        this.daysOff = daysOff;
    }

    public Integer getMaxGapMinutes() {
        return maxGapMinutes;
    }

    public void setMaxGapMinutes(Integer maxGapMinutes) {
        this.maxGapMinutes = maxGapMinutes;
    }
}