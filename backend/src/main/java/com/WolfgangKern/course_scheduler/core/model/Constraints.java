package com.WolfgangKern.course_scheduler.core.model;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

/**
 * Constraints: Represents the scheduling constraints for a student, including preferred start and end times for classes, days off, and maximum gap time between classes.
 */
public class Constraints {
    private final LocalTime startTime, endTime;
    private final List<DayOfWeek> daysOff;
    private final Integer maxGapMinutes;

    public Constraints(LocalTime startTime, LocalTime endTime, List<DayOfWeek> daysOff, Integer maxGapMinutes) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.daysOff = daysOff;
        this.maxGapMinutes = maxGapMinutes;
    }

    /*
     * Getters, no setters needed as constraints are final after creation
     */
    
    public LocalTime getStartTime() {
        return startTime;
    }
    public LocalTime getEndTime() {
        return endTime;
    }
    public List<DayOfWeek> getDaysOff() {
        return daysOff;
    }
    public Integer getMaxGapMinutes() {
        return maxGapMinutes;
    }
}
