package com.wolfgangkern.coursescheduler.api.dto;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Configures one rule selected from the built-in catalog.
 *
 * @param type built-in rule identifier
 * @param mode HARD or PREFERENCE
 * @param importance preference weight from one to five
 * @param time general time threshold
 * @param minutes duration threshold in minutes
 * @param count numeric threshold
 * @param days selected days
 * @param day selected day for a blocked period
 * @param startTime blocked-period start
 * @param endTime blocked-period end
 */
public record RuleConfigurationDto(
    @NotBlank(message = "Rule type is required.")
    String type,
    @NotBlank(message = "Rule mode is required.")
    @Pattern(regexp = "(?i)HARD|PREFERENCE", message = "Rule mode must be HARD or PREFERENCE.")
    String mode,
    @Min(value = 1, message = "Rule importance must be between 1 and 5.")
    @Max(value = 5, message = "Rule importance must be between 1 and 5.")
    Integer importance,
    @Pattern(regexp = "(?:[01]\\d|2[0-3]):[0-5]\\d", message = "Rule time must use HH:mm format.")
    String time,
    @Min(value = 0, message = "Rule minutes cannot be negative.")
    @Max(value = 10080, message = "Rule minutes cannot exceed one week.")
    Integer minutes,
    @Min(value = 1, message = "Rule count must be at least 1.")
    @Max(value = 50, message = "Rule count cannot exceed 50.")
    Integer count,
    @Size(max = 5, message = "At most five weekdays can be selected.")
    List<@Pattern(regexp = "(?i)MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY", message = "Selected days must be weekdays.") String> days,
    @Pattern(regexp = "(?i)MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY", message = "Selected day must be a weekday.")
    String day,
    @Pattern(regexp = "(?:[01]\\d|2[0-3]):[0-5]\\d", message = "Blocked start time must use HH:mm format.")
    String startTime,
    @Pattern(regexp = "(?:[01]\\d|2[0-3]):[0-5]\\d", message = "Blocked end time must use HH:mm format.")
    String endTime
) {}
