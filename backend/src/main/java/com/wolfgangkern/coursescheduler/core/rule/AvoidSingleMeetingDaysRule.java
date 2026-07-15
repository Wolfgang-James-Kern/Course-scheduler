package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;

/**
 * Evaluates class days that require attendance for only one meeting.
 */
public final class AvoidSingleMeetingDaysRule extends AbstractScheduleRule {
    private static final int SINGLE_MEETING_DAY_PENALTY = 60;

    /**
     * Creates a single-meeting-day strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     */
    public AvoidSingleMeetingDaysRule(RuleMode mode, int importance) {
        super(RuleType.AVOID_SINGLE_MEETING_DAYS, mode, importance);
    }

    /**
     * Counts active days containing exactly one meeting.
     *
     * @param context analyzed schedule
     * @return single-meeting-day result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int singleMeetingDays = 0;
        for (DayOfWeek day : context.getActiveDays()) {
            if (context.getMeetings(day).size() == 1) {
                singleMeetingDays++;
            }
        }
        return result(
            singleMeetingDays * SINGLE_MEETING_DAY_PENALTY,
            "No campus day contains only one meeting.",
            "At least one campus day contains only one meeting."
        );
    }
}
