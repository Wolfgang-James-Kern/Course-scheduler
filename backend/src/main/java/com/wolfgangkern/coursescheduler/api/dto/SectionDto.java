package com.wolfgangkern.coursescheduler.api.dto;

import java.util.List;

/**
 * Represents one component section in an API payload.
 *
 * @param courseCode owning course code in schedule responses
 * @param componentType owning component type in schedule responses
 * @param attendanceRequirement attendance requirement in schedule responses
 * @param meetingFrequency meeting frequency in schedule responses
 * @param id section identifier
 * @param meetings section meetings
 */
public record SectionDto(
    String courseCode,
    String componentType,
    String attendanceRequirement,
    String meetingFrequency,
    String id,
    List<MeetingDto> meetings
) {}
