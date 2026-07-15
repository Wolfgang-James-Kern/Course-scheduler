package com.wolfgangkern.coursescheduler.core.rule;

/**
 * Evaluates the difference between the busiest and lightest active class days.
 */
public final class BalanceWorkloadRule extends AbstractScheduleRule {
    private final int maximumDifferenceMinutes;

    /**
     * Creates a workload-balance strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param maximumDifferenceMinutes largest acceptable difference in scheduled minutes
     */
    public BalanceWorkloadRule(RuleMode mode, int importance, int maximumDifferenceMinutes) {
        super(RuleType.BALANCE_WORKLOAD, mode, importance);
        this.maximumDifferenceMinutes = maximumDifferenceMinutes;
    }

    /**
     * Compares scheduled class minutes across active class days.
     *
     * @param context analyzed schedule
     * @return workload-balance result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        if (context.getActiveDays().size() < 2) {
            return result(0, "The workload is balanced across active days.", "The workload is not balanced.");
        }
        int minimum = context.getActiveDays().stream()
            .mapToInt(context::getScheduledMinutes)
            .min()
            .orElse(0);
        int maximum = context.getActiveDays().stream()
            .mapToInt(context::getScheduledMinutes)
            .max()
            .orElse(0);
        int excessDifference = Math.max(0, maximum - minimum - maximumDifferenceMinutes);
        return result(
            excessDifference,
            "Daily class time differs by no more than " + thresholdDescription() + ".",
            "Daily class time differs by more than " + thresholdDescription() + "."
        );
    }

    /**
     * Formats the configured threshold for schedule explanations.
     *
     * @return threshold expressed in hours when possible
     */
    private String thresholdDescription() {
        if (maximumDifferenceMinutes % 60 == 0) {
            int hours = maximumDifferenceMinutes / 60;
            return hours + (hours == 1 ? " hour" : " hours");
        }
        return maximumDifferenceMinutes + " minutes";
    }
}
