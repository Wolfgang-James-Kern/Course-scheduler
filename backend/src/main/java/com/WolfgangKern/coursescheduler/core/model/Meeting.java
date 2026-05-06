package com.wolfgangkern.coursescheduler.core.model;

import java.time.DayOfWeek;
import java.time.LocalTime;

/**
 * One weekday meeting with an exact start and end time.
 */
public record Meeting(DayOfWeek day, LocalTime startTime, LocalTime endTime) {
    /**
     * Creates a validated meeting.
     */
    public Meeting {
        if (day == null || startTime == null || endTime == null) {
            throw new IllegalArgumentException("Meeting day, start time, and end time are required.");
        }
        if (day.getValue() > DayOfWeek.FRIDAY.getValue()) {
            throw new IllegalArgumentException("Meetings must occur between Monday and Friday.");
        }
        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("Meeting end time must be after its start time.");
        }
    }
}
