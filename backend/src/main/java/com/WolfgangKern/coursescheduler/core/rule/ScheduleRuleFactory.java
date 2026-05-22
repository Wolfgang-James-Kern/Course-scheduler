package com.wolfgangkern.coursescheduler.core.rule;

import org.springframework.stereotype.Component;

/**
 * Creates the appropriate strategy for each validated built-in rule configuration.
 */
@Component
public final class ScheduleRuleFactory {
    /**
     * Creates a configured scheduling rule.
     *
     * @param configuration validated rule settings
     * @return configured strategy
     */
    public ScheduleRule create(RuleConfiguration configuration) {
        return switch (configuration.type()) {
            case EARLIEST_START -> new EarliestStartRule(
                configuration.mode(), configuration.importance(), time(configuration));
            case LATEST_END -> new LatestEndRule(
                configuration.mode(), configuration.importance(), time(configuration));
            case MAXIMUM_GAP -> new MaximumGapRule(
                configuration.mode(), configuration.importance(), minutes(configuration));
            case MAXIMUM_MEETINGS_PER_DAY -> new MaximumMeetingsPerDayRule(
                configuration.mode(), configuration.importance(), count(configuration));
            case MAXIMUM_CONTINUOUS_BLOCK -> new MaximumContinuousBlockRule(
                configuration.mode(), configuration.importance(), minutes(configuration));
            case MINIMUM_DAY_LENGTH -> new MinimumDayLengthRule(
                configuration.mode(), configuration.importance(), minutes(configuration));
            case MAXIMUM_DAILY_SPAN -> new MaximumDailySpanRule(
                configuration.mode(), configuration.importance(), minutes(configuration));
            case AVOID_SINGLE_MEETING_DAYS -> new AvoidSingleMeetingDaysRule(
                configuration.mode(), configuration.importance());
            case BLOCKED_TIME -> {
                RuleSettings.BlockedPeriod blocked = (RuleSettings.BlockedPeriod) configuration.settings();
                yield new BlockedTimeRule(
                    configuration.mode(),
                    configuration.importance(),
                    blocked.day(),
                    blocked.startTime(),
                    blocked.endTime());
            }
            case DAYS_OFF -> new DaysOffRule(
                configuration.mode(),
                configuration.importance(),
                ((RuleSettings.SelectedDays) configuration.settings()).days());
            case MAXIMUM_CAMPUS_DAYS -> new MaximumCampusDaysRule(
                configuration.mode(), configuration.importance(), count(configuration));
            case MAXIMUM_WEEKLY_GAP -> new MaximumWeeklyGapRule(
                configuration.mode(), configuration.importance(), minutes(configuration));
            case BALANCE_WORKLOAD -> new BalanceWorkloadRule(
                configuration.mode(), configuration.importance(), minutes(configuration));
            case CLUSTER_CAMPUS_DAYS -> new ClusterCampusDaysRule(
                configuration.mode(), configuration.importance());
            case OCCASIONAL_MEETINGS_AT_DAY_EDGES -> new OccasionalMeetingsAtDayEdgesRule(
                configuration.mode(), configuration.importance());
        };
    }

    /**
     * Returns a validated time threshold.
     *
     * @param configuration rule configuration
     * @return threshold time
     */
    private java.time.LocalTime time(RuleConfiguration configuration) {
        return ((RuleSettings.TimeThreshold) configuration.settings()).time();
    }

    /**
     * Returns a validated minute threshold.
     *
     * @param configuration rule configuration
     * @return threshold minutes
     */
    private int minutes(RuleConfiguration configuration) {
        return ((RuleSettings.MinuteThreshold) configuration.settings()).minutes();
    }

    /**
     * Returns a validated count threshold.
     *
     * @param configuration rule configuration
     * @return threshold count
     */
    private int count(RuleConfiguration configuration) {
        return ((RuleSettings.CountThreshold) configuration.settings()).count();
    }
}
