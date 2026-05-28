package com.wolfgangkern.coursescheduler.api.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Represents one configurable component within a course request.
 *
 * @param type LEC, TUT, or LAB
 * @param enrollmentRequirement REQUIRED or OPTIONAL
 * @param attendanceRequirement MANDATORY or NON_MANDATORY
 * @param meetingFrequency WEEKLY or OCCASIONAL
 * @param included whether an optional component participates in registration
 * @param sections available component sections
 */
public record CourseComponentDto(
    @NotBlank(message = "Component type is required.")
    @Pattern(regexp = "(?i)LEC|TUT|LAB", message = "Component type must be LEC, TUT, or LAB.")
    String type,
    @Pattern(regexp = "(?i)REQUIRED|OPTIONAL", message = "Enrollment requirement must be REQUIRED or OPTIONAL.")
    String enrollmentRequirement,
    @Pattern(regexp = "(?i)MANDATORY|NON_MANDATORY", message = "Attendance requirement must be MANDATORY or NON_MANDATORY.")
    String attendanceRequirement,
    @Pattern(regexp = "(?i)WEEKLY|OCCASIONAL", message = "Meeting frequency must be WEEKLY or OCCASIONAL.")
    String meetingFrequency,
    Boolean included,
    @Size(max = 50, message = "A component can contain at most 50 sections.")
    List<@Valid SectionRequestDto> sections
) {}
