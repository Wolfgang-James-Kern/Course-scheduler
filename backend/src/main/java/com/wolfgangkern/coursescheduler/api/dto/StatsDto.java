package com.wolfgangkern.coursescheduler.api.dto;

/**
 * Summarizes visible schedule characteristics for the full week, including occasional meetings.
 *
 * @param earliestStart earliest meeting start
 * @param latestEnd latest meeting end
 * @param totalGapMinutes total time between classes
 * @param daysWithClasses number of active class days
 */
public record StatsDto(
    String earliestStart,
    String latestEnd,
    int totalGapMinutes,
    int daysWithClasses
) {}
