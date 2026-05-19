package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.time.Duration;
import java.util.List;

import com.wolfgangkern.coursescheduler.core.model.Meeting;

/**
 * Evaluates individual gaps between consecutive meetings on the same day.
 */
public final class MaximumGapRule extends AbstractScheduleRule {
    private final int maximumMinutes;

    /**
     * Creates a maximum-gap strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param maximumMinutes largest acceptable gap
     */
    public MaximumGapRule(RuleMode mode, int importance, int maximumMinutes) {
        super(RuleType.MAXIMUM_GAP, mode, importance);
        this.maximumMinutes = maximumMinutes;
    }

    /**
     * Evaluates every consecutive same-day meeting pair.
     *
     * @param context analyzed schedule
     * @return maximum-gap result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int violation = 0;
        for (DayOfWeek day : context.getActiveDays()) {
            List<Meeting> meetings = context.getMeetings(day);
            for (int index = 0; index < meetings.size() - 1; index++) {
                long gap = Duration.between(meetings.get(index).endTime(), meetings.get(index + 1).startTime()).toMinutes();
                violation += (int) Math.max(0, gap - maximumMinutes);
            }
        }
        return result(
            violation,
            "No gap exceeds " + maximumMinutes + " minutes.",
            "At least one gap exceeds " + maximumMinutes + " minutes."
        );
    }
}
