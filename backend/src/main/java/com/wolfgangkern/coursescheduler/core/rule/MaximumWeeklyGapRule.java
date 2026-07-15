package com.wolfgangkern.coursescheduler.core.rule;

/**
 * Evaluates accumulated waiting time between classes across the school week.
 */
public final class MaximumWeeklyGapRule extends AbstractScheduleRule {
    private final int maximumMinutes;

    /**
     * Creates a maximum-weekly-gap strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param maximumMinutes largest acceptable weekly gap total
     */
    public MaximumWeeklyGapRule(RuleMode mode, int importance, int maximumMinutes) {
        super(RuleType.MAXIMUM_WEEKLY_GAP, mode, importance);
        this.maximumMinutes = maximumMinutes;
    }

    /**
     * Evaluates total calculated gap time for the week.
     *
     * @param context analyzed schedule
     * @return weekly-gap result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int totalGapMinutes = context.getStats().totalGapMinutes();
        int violation = Math.max(0, totalGapMinutes - maximumMinutes);
        return result(
            violation,
            "Weekly gap time does not exceed " + maximumMinutes + " minutes.",
            "Weekly gap time exceeds " + maximumMinutes + " minutes."
        );
    }
}
