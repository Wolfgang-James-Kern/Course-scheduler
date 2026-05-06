package com.wolfgangkern.coursescheduler.core.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Represents one lecture, tutorial, or lab component within a course.
 */
public final class CourseComponent {
    private final ComponentType type;
    private final EnrollmentRequirement enrollmentRequirement;
    private final AttendanceRequirement attendanceRequirement;
    private final MeetingFrequency meetingFrequency;
    private final boolean included;
    private final List<Section> sections;

    /**
     * Creates a validated course component.
     *
     * @param type component type
     * @param enrollmentRequirement registration requirement
     * @param attendanceRequirement attendance requirement
     * @param meetingFrequency meeting frequency
     * @param included whether an optional component is included
     * @param sections available component sections
     */
    public CourseComponent(
        ComponentType type,
        EnrollmentRequirement enrollmentRequirement,
        AttendanceRequirement attendanceRequirement,
        MeetingFrequency meetingFrequency,
        boolean included,
        List<Section> sections
    ) {
        if (type == null || enrollmentRequirement == null || attendanceRequirement == null || meetingFrequency == null) {
            throw new IllegalArgumentException("Component metadata is required.");
        }
        if (sections == null) {
            throw new IllegalArgumentException("Component sections are required.");
        }
        boolean active = enrollmentRequirement == EnrollmentRequirement.REQUIRED || included;
        if (active && sections.isEmpty()) {
            throw new IllegalArgumentException("An included " + type + " component must contain at least one section.");
        }
        validateSections(type, sections);
        this.type = type;
        this.enrollmentRequirement = enrollmentRequirement;
        this.attendanceRequirement = attendanceRequirement;
        this.meetingFrequency = meetingFrequency;
        this.included = enrollmentRequirement == EnrollmentRequirement.REQUIRED || included;
        this.sections = List.copyOf(sections);
    }

    /**
     * Creates a weekly component for callers that do not provide frequency metadata.
     *
     * @param type component type
     * @param enrollmentRequirement registration requirement
     * @param attendanceRequirement attendance requirement
     * @param included whether an optional component is included
     * @param sections available component sections
     */
    public CourseComponent(
        ComponentType type,
        EnrollmentRequirement enrollmentRequirement,
        AttendanceRequirement attendanceRequirement,
        boolean included,
        List<Section> sections
    ) {
        this(type, enrollmentRequirement, attendanceRequirement, MeetingFrequency.WEEKLY, included, sections);
    }

    /**
     * Returns the component type.
     *
     * @return component type
     */
    public ComponentType getType() {
        return type;
    }

    /**
     * Returns the registration requirement.
     *
     * @return enrollment requirement
     */
    public EnrollmentRequirement getEnrollmentRequirement() {
        return enrollmentRequirement;
    }

    /**
     * Returns the attendance requirement.
     *
     * @return attendance requirement
     */
    public AttendanceRequirement getAttendanceRequirement() {
        return attendanceRequirement;
    }

    /**
     * Returns how often this component normally meets.
     *
     * @return meeting frequency
     */
    public MeetingFrequency getMeetingFrequency() {
        return meetingFrequency;
    }

    /**
     * Reports whether this component participates in registration generation.
     *
     * @return true when a section must be selected
     */
    public boolean isIncluded() {
        return included;
    }

    /**
     * Returns the available sections.
     *
     * @return immutable section list
     */
    public List<Section> getSections() {
        return sections;
    }

    /**
     * Validates section identity within the component.
     *
     * @param type component type
     * @param sections component sections
     */
    private void validateSections(ComponentType type, List<Section> sections) {
        Set<String> sectionIds = new HashSet<>();
        for (Section section : sections) {
            if (section == null) {
                throw new IllegalArgumentException("Component sections cannot contain null values.");
            }
            if (!sectionIds.add(section.id().toUpperCase(java.util.Locale.ROOT))) {
                throw new IllegalArgumentException("Component " + type + " contains duplicate section identifiers.");
            }
        }
    }
}
