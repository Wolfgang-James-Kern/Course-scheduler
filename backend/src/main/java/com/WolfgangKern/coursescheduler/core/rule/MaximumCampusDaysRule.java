package com.wolfgangkern.coursescheduler.core.rule;

/**
 * Evaluates the number of days a student must attend campus.
 */
public final class MaximumCampusDaysRule extends AbstractScheduleRule {
    private static final int EXCESS_DAY_PENALTY = 60;
    private final int maximumDays;

    /**
     * Creates a maximum-campus-days strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param maximumDays largest acceptable campus-day count
     */
    public MaximumCampusDaysRule(RuleMode mode, int importance, int maximumDays) {
        super(RuleType.MAXIMUM_CAMPUS_DAYS, mode, importance);
        this.maximumDays = maximumDays;
    }

    /**
     * Evaluates the weekly campus-day count.
     *
     * @param context analyzed schedule
     * @return campus-day result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int excessDays = Math.max(0, context.getActiveDays().size() - maximumDays);
        return result(
            excessDays * EXCESS_DAY_PENALTY,
            "The schedule uses no more than " + maximumDays + " campus days.",
            "The schedule uses more than " + maximumDays + " campus days."
        );
    }
}
