package com.wolfgangkern.coursescheduler.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Represents one weekday meeting in an API payload.
 *
 * @param day meeting day
 * @param startTime meeting start in HH:mm format
 * @param endTime meeting end in HH:mm format
 */
public record MeetingDto(
    @NotBlank(message = "Meeting day is required.")
    @Pattern(regexp = "(?i)MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY", message = "Meeting day must be a weekday.")
    String day,
    @NotBlank(message = "Meeting start time is required.")
    @Pattern(regexp = "(?:[01]\\d|2[0-3]):[0-5]\\d", message = "Meeting start time must use HH:mm format.")
    String startTime,
    @NotBlank(message = "Meeting end time is required.")
    @Pattern(regexp = "(?:[01]\\d|2[0-3]):[0-5]\\d", message = "Meeting end time must use HH:mm format.")
    String endTime
) {}
