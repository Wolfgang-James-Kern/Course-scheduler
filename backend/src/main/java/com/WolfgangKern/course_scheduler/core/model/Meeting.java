package com.WolfgangKern.course_scheduler.core.model;

import java.time.DayOfWeek;
import java.time.LocalTime;

/**
 * Meeting: Represents a single meeting time for a section, including the day of the week and start/end times.
 */
public class Meeting {
    private final DayOfWeek Day;
    private final LocalTime startTime, endTime;

    public Meeting(DayOfWeek day, LocalTime startTime, LocalTime endTime) {
        this.Day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    /*
     * Getters, no setters needed as meetings are final after creation
     */
    public DayOfWeek getDay() {
        return Day;
    }
    public LocalTime getStartTime() {
        return startTime;
    }
    public LocalTime getEndTime() {
        return endTime;
    }

    /**
     * toString: Provides a string representation of the meeting in the format "DAY START-END" e.g. "MONDAY 10:00-11:15"
     */
    public String toString() {
        return Day.toString() + " " + startTime.toString() + "-" + endTime.toString();
    }
}
