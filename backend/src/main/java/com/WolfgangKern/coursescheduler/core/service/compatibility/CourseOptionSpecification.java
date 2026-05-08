package com.wolfgangkern.coursescheduler.core.service.compatibility;

import java.util.List;

import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;

/**
 * Determines whether a section may be added to a partial course option.
 */
public interface CourseOptionSpecification {
    /**
     * Evaluates one candidate section.
     *
     * @param course course being expanded
     * @param selectedSections selected component sections
     * @param candidate candidate component section
     * @return true when the candidate is allowed
     */
    boolean allows(Course course, List<SelectedSection> selectedSections, SelectedSection candidate);
}
