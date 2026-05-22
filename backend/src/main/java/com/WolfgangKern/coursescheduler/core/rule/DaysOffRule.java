package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.util.List;

/**
 * Evaluates whether selected days remain free of classes.
 */
public final class DaysOffRule extends AbstractScheduleRule {
    private static final int ACTIVE_DAY_PENALTY = 60;
    private final List<DayOfWeek> daysOff;

    /**
     * Creates a selected-days-off strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param daysOff days that should remain free
     */
    public DaysOffRule(RuleMode mode, int importance, List<DayOfWeek> daysOff) {
        super(RuleType.DAYS_OFF, mode, importance);
        this.daysOff = List.copyOf(daysOff);
    }

    /**
     * Evaluates the selected days for scheduled meetings.
     *
     * @param context analyzed schedule
     * @return days-off result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        long activeSelectedDays = daysOff.stream()
            .filter(day -> !context.getMeetings(day).isEmpty())
            .count();
        return result(
            Math.toIntExact(activeSelectedDays) * ACTIVE_DAY_PENALTY,
            "All selected days remain free of classes.",
            "At least one selected day contains classes."
        );
    }
}
