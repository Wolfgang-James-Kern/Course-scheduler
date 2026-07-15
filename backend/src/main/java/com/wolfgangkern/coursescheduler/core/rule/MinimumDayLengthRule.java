package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.time.Duration;
import java.util.List;

import com.wolfgangkern.coursescheduler.core.model.Meeting;

/**
 * Evaluates class days whose span is shorter than a configured minimum.
 */
public final class MinimumDayLengthRule extends AbstractScheduleRule {
    private final int minimumMinutes;

    /**
     * Creates a minimum-day-length strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param minimumMinutes shortest acceptable class-day span
     */
    public MinimumDayLengthRule(RuleMode mode, int importance, int minimumMinutes) {
        super(RuleType.MINIMUM_DAY_LENGTH, mode, importance);
        this.minimumMinutes = minimumMinutes;
    }

    /**
     * Evaluates the span from the first meeting to the final meeting on each active day.
     *
     * @param context analyzed schedule
     * @return minimum-day-length result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int violation = 0;
        for (DayOfWeek day : context.getActiveDays()) {
            List<Meeting> meetings = context.getMeetings(day);
            long dayLength = Duration.between(
                meetings.get(0).startTime(),
                meetings.get(meetings.size() - 1).endTime()
            ).toMinutes();
            violation += (int) Math.max(0, minimumMinutes - dayLength);
        }
        return result(
            violation,
            "Every class day spans at least " + minimumMinutes + " minutes.",
            "At least one class day is shorter than " + minimumMinutes + " minutes."
        );
    }
}
