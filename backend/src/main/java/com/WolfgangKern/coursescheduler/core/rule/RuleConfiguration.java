package com.wolfgangkern.coursescheduler.core.rule;

/**
 * Contains one validated built-in rule configuration.
 *
 * @param type built-in rule type
 * @param mode hard requirement or weighted preference
 * @param importance preference weight from one to five
 * @param settings type-specific rule settings
 */
public record RuleConfiguration(
    RuleType type,
    RuleMode mode,
    int importance,
    RuleSettings settings
) {
    /**
     * Validates common values and the relationship between a rule and its settings.
     */
    public RuleConfiguration {
        if (type == null || mode == null || settings == null) {
            throw new IllegalArgumentException("Rule type, mode, and settings are required.");
        }
        if (importance < 1 || importance > 5) {
            throw new IllegalArgumentException("Rule importance must be between 1 and 5.");
        }
        if (!accepts(type, settings)) {
            throw new IllegalArgumentException("Rule settings do not match rule type " + type + ".");
        }
    }

    /**
     * Determines whether a rule type accepts a settings variant.
     *
     * @param type rule type
     * @param settings proposed settings
     * @return true when the settings are valid for the rule type
     */
    private static boolean accepts(RuleType type, RuleSettings settings) {
        return switch (type) {
            case EARLIEST_START, LATEST_END -> settings instanceof RuleSettings.TimeThreshold;
            case MAXIMUM_GAP, MAXIMUM_WEEKLY_GAP, BALANCE_WORKLOAD ->
                settings instanceof RuleSettings.MinuteThreshold;
            case MAXIMUM_CONTINUOUS_BLOCK, MINIMUM_DAY_LENGTH, MAXIMUM_DAILY_SPAN ->
                settings instanceof RuleSettings.MinuteThreshold threshold && threshold.minutes() > 0;
            case MAXIMUM_MEETINGS_PER_DAY, MAXIMUM_CAMPUS_DAYS -> settings instanceof RuleSettings.CountThreshold;
            case DAYS_OFF -> settings instanceof RuleSettings.SelectedDays;
            case BLOCKED_TIME -> settings instanceof RuleSettings.BlockedPeriod;
            case AVOID_SINGLE_MEETING_DAYS, CLUSTER_CAMPUS_DAYS, OCCASIONAL_MEETINGS_AT_DAY_EDGES ->
                settings instanceof RuleSettings.None;
        };
    }
}
