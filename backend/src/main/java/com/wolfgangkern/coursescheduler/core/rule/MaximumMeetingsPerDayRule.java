package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;

/**
 * Evaluates the number of meeting blocks assigned to each class day.
 */
public final class MaximumMeetingsPerDayRule extends AbstractScheduleRule {
    private static final int EXCESS_MEETING_PENALTY = 30;
    private final int maximumMeetings;

    /**
     * Creates a maximum-meetings strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param maximumMeetings largest acceptable daily meeting count
     */
    public MaximumMeetingsPerDayRule(RuleMode mode, int importance, int maximumMeetings) {
        super(RuleType.MAXIMUM_MEETINGS_PER_DAY, mode, importance);
        this.maximumMeetings = maximumMeetings;
    }

    /**
     * Evaluates each active day's meeting count.
     *
     * @param context analyzed schedule
     * @return meeting-count result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int excessMeetings = 0;
        for (DayOfWeek day : context.getActiveDays()) {
            excessMeetings += Math.max(0, context.getMeetings(day).size() - maximumMeetings);
        }
        return result(
            excessMeetings * EXCESS_MEETING_PENALTY,
            "No class day contains more than " + maximumMeetings + " meetings.",
            "At least one class day contains more than " + maximumMeetings + " meetings."
        );
    }
}
