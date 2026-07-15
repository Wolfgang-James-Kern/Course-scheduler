package com.wolfgangkern.coursescheduler.core.service.compatibility;

import java.util.List;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;

/**
 * Combines registration-validity specifications for course options.
 */
@Component
public final class CompositeCourseOptionSpecification implements CourseOptionSpecification {
    private final List<CourseOptionSpecification> specifications;

    /**
     * Creates the registration-validity composite.
     *
     * @param meetingConflicts meeting-conflict specification
     * @param sectionCompatibility section-pair specification
     */
    public CompositeCourseOptionSpecification(
        MeetingConflictSpecification meetingConflicts,
        SectionCompatibilitySpecification sectionCompatibility
    ) {
        this.specifications = List.of(meetingConflicts, sectionCompatibility);
    }

    /**
     * Requires every registration-validity specification to allow the candidate.
     *
     * @param course course being expanded
     * @param selectedSections selected component sections
     * @param candidate candidate component section
     * @return true when every specification allows the candidate
     */
    @Override
    public boolean allows(Course course, List<SelectedSection> selectedSections, SelectedSection candidate) {
        return specifications.stream().allMatch(specification -> (
            specification.allows(course, selectedSections, candidate)
        ));
    }
}
