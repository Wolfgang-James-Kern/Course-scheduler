package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.time.Duration;
import java.util.List;

import com.wolfgangkern.coursescheduler.core.model.Meeting;

/**
 * Evaluates the elapsed time between the first and final meeting on each class day.
 */
public final class MaximumDailySpanRule extends AbstractScheduleRule {
    private final int maximumMinutes;

    /**
     * Creates a maximum-daily-span strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param maximumMinutes largest acceptable daily span
     */
    public MaximumDailySpanRule(RuleMode mode, int importance, int maximumMinutes) {
        super(RuleType.MAXIMUM_DAILY_SPAN, mode, importance);
        this.maximumMinutes = maximumMinutes;
    }

    /**
     * Evaluates each active day from its first start to its final end.
     *
     * @param context analyzed schedule
     * @return daily-span result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int violation = 0;
        for (DayOfWeek day : context.getActiveDays()) {
            List<Meeting> meetings = context.getMeetings(day);
            long span = Duration.between(
                meetings.get(0).startTime(),
                meetings.get(meetings.size() - 1).endTime()
            ).toMinutes();
            violation += (int) Math.max(0, span - maximumMinutes);
        }
        return result(
            violation,
            "No class day spans more than " + maximumMinutes + " minutes.",
            "At least one class day spans more than " + maximumMinutes + " minutes."
        );
    }
}
