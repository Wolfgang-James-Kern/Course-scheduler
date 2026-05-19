package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;
import java.util.List;

import com.wolfgangkern.coursescheduler.core.model.Meeting;

/**
 * Evaluates how far a schedule ends after a preferred daily end time.
 */
public final class LatestEndRule extends AbstractScheduleRule {
    private final LocalTime threshold;

    /**
     * Creates a latest-end strategy.
     *
     * @param mode hard requirement or preference
     * @param importance preference weight
     * @param threshold latest acceptable end
     */
    public LatestEndRule(RuleMode mode, int importance, LocalTime threshold) {
        super(RuleType.LATEST_END, mode, importance);
        this.threshold = threshold;
    }

    /**
     * Evaluates the final meeting on each active day.
     *
     * @param context analyzed schedule
     * @return latest-end result
     */
    @Override
    public RuleEvaluation evaluate(ScheduleContext context) {
        int violation = 0;
        for (DayOfWeek day : context.getActiveDays()) {
            List<Meeting> meetings = context.getMeetings(day);
            LocalTime lastEnd = meetings.get(meetings.size() - 1).endTime();
            if (lastEnd.isAfter(threshold)) {
                violation += Math.toIntExact(Duration.between(threshold, lastEnd).toMinutes());
            }
        }
        return result(
            violation,
            "All class days end at or before " + threshold + ".",
            "One or more class days end after " + threshold + "."
        );
    }
}
