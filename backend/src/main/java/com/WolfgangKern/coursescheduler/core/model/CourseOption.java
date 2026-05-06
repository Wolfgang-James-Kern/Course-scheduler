package com.wolfgangkern.coursescheduler.core.model;

import java.util.List;

/**
 * Represents one registration-valid selection of component sections for a course.
 *
 * @param courseCode owning course code
 * @param sections one selected section from every included component
 */
public record CourseOption(String courseCode, List<SelectedSection> sections) {
    /**
     * Protects selected sections from later mutation.
     */
    public CourseOption {
        if (courseCode == null || courseCode.isBlank() || sections == null) {
            throw new IllegalArgumentException("Course option metadata is required.");
        }
        if (sections.isEmpty()) {
            throw new IllegalArgumentException("Course option must contain at least one section.");
        }
        sections = List.copyOf(sections);
    }
}
