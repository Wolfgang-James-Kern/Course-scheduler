package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;
import java.util.List;

import com.wolfgangkern.coursescheduler.core.model.Meeting;

/**
 * Evaluates consecutive back-to-back meeting blocks within each class day.
 */
public final class MaximumContinuousBlockRule extends AbstractScheduleRule {
    private final int maximumMinutes;

    /**
     * Creates a maximum-continuous-block strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param maximumMinutes largest acceptable continuous block
     */
    public MaximumContinuousBlockRule(RuleMode mode, int importance, int maximumMinutes) {
        super(RuleType.MAXIMUM_CONTINUOUS_BLOCK, mode, importance);
        this.maximumMinutes = maximumMinutes;
    }

    /**
     * Evaluates every sequence of meetings with no break between them.
     *
     * @param context analyzed schedule
     * @return continuous-block result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int violation = 0;
        for (DayOfWeek day : context.getActiveDays()) {
            List<Meeting> meetings = context.getMeetings(day);
            LocalTime blockStart = meetings.get(0).startTime();
            LocalTime blockEnd = meetings.get(0).endTime();

            for (int index = 1; index < meetings.size(); index++) {
                Meeting meeting = meetings.get(index);
                if (meeting.startTime().equals(blockEnd)) {
                    blockEnd = meeting.endTime();
                    continue;
                }
                violation += excessMinutes(blockStart, blockEnd);
                blockStart = meeting.startTime();
                blockEnd = meeting.endTime();
            }
            violation += excessMinutes(blockStart, blockEnd);
        }
        return result(
            violation,
            "No continuous class block exceeds " + maximumMinutes + " minutes.",
            "At least one continuous class block exceeds " + maximumMinutes + " minutes."
        );
    }

    /**
     * Calculates the time by which one block exceeds the configured maximum.
     *
     * @param start block start
     * @param end block end
     * @return excess minutes
     */
    private int excessMinutes(LocalTime start, LocalTime end) {
        long duration = Duration.between(start, end).toMinutes();
        return (int) Math.max(0, duration - maximumMinutes);
    }
}
