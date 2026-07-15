package com.wolfgangkern.coursescheduler.core.rule;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

/**
 * Provides the type-specific settings accepted by built-in scheduling rules.
 */
public sealed interface RuleSettings permits
    RuleSettings.None,
    RuleSettings.TimeThreshold,
    RuleSettings.MinuteThreshold,
    RuleSettings.CountThreshold,
    RuleSettings.SelectedDays,
    RuleSettings.BlockedPeriod {

    /**
     * Represents a rule without configurable parameters.
     */
    record None() implements RuleSettings {}

    /**
     * Provides one required time threshold.
     *
     * @param time threshold time
     */
    record TimeThreshold(LocalTime time) implements RuleSettings {
        /**
         * Creates a required time threshold.
         */
        public TimeThreshold {
            if (time == null) {
                throw new IllegalArgumentException("A time threshold is required for this rule.");
            }
        }
    }

    /**
     * Provides a duration threshold.
     *
     * @param minutes threshold minutes
     */
    record MinuteThreshold(int minutes) implements RuleSettings {
        /**
         * Creates a non-negative duration threshold.
         */
        public MinuteThreshold {
            if (minutes < 0) {
                throw new IllegalArgumentException("Rule minutes cannot be negative.");
            }
        }
    }

    /**
     * Provides a positive count threshold.
     *
     * @param count threshold count
     */
    record CountThreshold(int count) implements RuleSettings {
        /**
         * Creates a positive count threshold.
         */
        public CountThreshold {
            if (count < 1) {
                throw new IllegalArgumentException("Rule count must be at least 1.");
            }
        }
    }

    /**
     * Provides selected weekdays.
     *
     * @param days selected weekdays
     */
    record SelectedDays(List<DayOfWeek> days) implements RuleSettings {
        /**
         * Creates a non-empty immutable weekday selection.
         */
        public SelectedDays {
            if (days == null || days.isEmpty() || days.stream().anyMatch(java.util.Objects::isNull)) {
                throw new IllegalArgumentException("At least one day is required for this rule.");
            }
            days = List.copyOf(days);
        }
    }

    /**
     * Provides one blocked weekday period.
     *
     * @param day blocked day
     * @param startTime period start
     * @param endTime period end
     */
    record BlockedPeriod(DayOfWeek day, LocalTime startTime, LocalTime endTime) implements RuleSettings {
        /**
         * Creates a valid blocked period.
         */
        public BlockedPeriod {
            if (day == null || startTime == null || endTime == null) {
                throw new IllegalArgumentException("Blocked day and times are required.");
            }
            if (!endTime.isAfter(startTime)) {
                throw new IllegalArgumentException("Blocked end time must be after start time.");
            }
        }
    }
}
