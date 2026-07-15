package com.wolfgangkern.coursescheduler.core.model;

import java.util.List;

/**
 * A selected section plus the course-component metadata that owns it.
 */
public record SelectedSection(
    String courseCode,
    ComponentType componentType,
    AttendanceRequirement attendanceRequirement,
    MeetingFrequency meetingFrequency,
    Section section
) {
    /**
     * Creates a selected section with complete ownership metadata.
     */
    public SelectedSection {
        if (courseCode == null || courseCode.isBlank()) {
            throw new IllegalArgumentException("Selected section course code is required.");
        }
        if (componentType == null || attendanceRequirement == null || meetingFrequency == null || section == null) {
            throw new IllegalArgumentException("Selected section metadata is required.");
        }
    }

    /**
     * Returns the section identifier.
     */
    public String id() {
        return section.id();
    }

    /**
     * Returns the selected section meetings.
     */
    public List<Meeting> meetings() {
        return section.meetings();
    }
}
