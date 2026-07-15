package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;

/**
 * Evaluates how far a schedule begins before a preferred daily start time.
 */
public final class EarliestStartRule extends AbstractScheduleRule {
    private final LocalTime threshold;

    /**
     * Creates an earliest-start strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param threshold earliest acceptable start
     */
    public EarliestStartRule(RuleMode mode, int importance, LocalTime threshold) {
        super(RuleType.EARLIEST_START, mode, importance);
        this.threshold = threshold;
    }

    /**
     * Evaluates the first meeting on each active day.
     *
     * @param context analyzed schedule
     * @return earliest-start result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int violation = 0;
        for (DayOfWeek day : context.getActiveDays()) {
            LocalTime firstStart = context.getMeetings(day).get(0).startTime();
            if (firstStart.isBefore(threshold)) {
                violation += Math.toIntExact(Duration.between(firstStart, threshold).toMinutes());
            }
        }
        return result(
            violation,
            "All class days begin at or after " + threshold + ".",
            "One or more class days begin before " + threshold + "."
        );
    }
}
