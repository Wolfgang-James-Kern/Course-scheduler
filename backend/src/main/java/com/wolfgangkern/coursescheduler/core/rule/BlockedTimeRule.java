package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;

import com.wolfgangkern.coursescheduler.core.model.Meeting;

/**
 * Evaluates meeting overlap with one blocked period on a selected day.
 */
public final class BlockedTimeRule extends AbstractScheduleRule {
    private final DayOfWeek day;
    private final LocalTime startTime;
    private final LocalTime endTime;

    /**
     * Creates a blocked-time strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param day blocked day
     * @param startTime beginning of the blocked period
     * @param endTime end of the blocked period
     */
    public BlockedTimeRule(RuleMode mode, int importance, DayOfWeek day, LocalTime startTime, LocalTime endTime) {
        super(RuleType.BLOCKED_TIME, mode, importance);
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    /**
     * Calculates the number of meeting minutes inside the blocked period.
     *
     * @param context analyzed schedule
     * @return blocked-time result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int violation = 0;
        for (Meeting meeting : context.getMeetings(day)) {
            LocalTime overlapStart = meeting.startTime().isAfter(startTime) ? meeting.startTime() : startTime;
            LocalTime overlapEnd = meeting.endTime().isBefore(endTime) ? meeting.endTime() : endTime;
            if (overlapStart.isBefore(overlapEnd)) {
                violation += Math.toIntExact(Duration.between(overlapStart, overlapEnd).toMinutes());
            }
        }
        return result(
            violation,
            "No meetings overlap the blocked period on " + day + ".",
            "A meeting overlaps the blocked period on " + day + "."
        );
    }
}
