package com.wolfgangkern.coursescheduler.core.service;

import com.wolfgangkern.coursescheduler.core.rule.ScheduleContext;

/**
 * Contains regular-week and occasional-week views of one schedule.
 *
 * @param regularWeek schedule without occasional meetings
 * @param fullWeek schedule including occasional meetings
 */
public record ScheduleAnalysis(ScheduleContext regularWeek, ScheduleContext fullWeek) {
    /**
     * Creates a complete schedule analysis.
     */
    public ScheduleAnalysis {
        if (regularWeek == null || fullWeek == null) {
            throw new IllegalArgumentException("Both schedule contexts are required.");
        }
    }
}
