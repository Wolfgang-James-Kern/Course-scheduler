package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.util.List;

/**
 * Evaluates empty weekdays that separate active campus days.
 */
public final class ClusterCampusDaysRule extends AbstractScheduleRule {
    private static final int SEPARATED_DAY_PENALTY = 60;

    /**
     * Creates a campus-day clustering strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     */
    public ClusterCampusDaysRule(RuleMode mode, int importance) {
        super(RuleType.CLUSTER_CAMPUS_DAYS, mode, importance);
    }

    /**
     * Evaluates whether active campus days form one consecutive range.
     *
     * @param context analyzed schedule
     * @return campus-day clustering result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        List<DayOfWeek> activeDays = context.getActiveDays();
        if (activeDays.size() < 2) {
            return result(0, "Campus days are clustered.", "Campus days are separated.");
        }
        int firstDay = activeDays.get(0).getValue();
        int lastDay = activeDays.get(activeDays.size() - 1).getValue();
        int emptyDaysInsideRange = lastDay - firstDay + 1 - activeDays.size();
        return result(
            emptyDaysInsideRange * SEPARATED_DAY_PENALTY,
            "Campus days are consecutive.",
            "One or more free weekdays separate campus days."
        );
    }
}
