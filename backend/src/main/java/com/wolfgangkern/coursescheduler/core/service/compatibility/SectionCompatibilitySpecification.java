package com.wolfgangkern.coursescheduler.core.service.compatibility;

import java.util.List;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.core.model.ComponentCompatibility;
import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;

/**
 * Enforces explicitly configured cross-component section pairings.
 */
@Component
public final class SectionCompatibilitySpecification implements CourseOptionSpecification {
    /**
     * Evaluates all applicable section-pair restrictions.
     *
     * @param course course being expanded
     * @param selectedSections selected component sections
     * @param candidate candidate component section
     * @return true when every applicable pairing allows the candidate
     */
    @Override
    public boolean allows(Course course, List<SelectedSection> selectedSections, SelectedSection candidate) {
        for (SelectedSection selected : selectedSections) {
            ComponentCompatibility compatibility = findCompatibility(course, selected, candidate);
            if (compatibility != null && !compatibility.allows(selected, candidate)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Finds the restriction for two component types.
     *
     * @param course course being expanded
     * @param selected selected section
     * @param candidate candidate section
     * @return matching restriction or null when combinations are unrestricted
     */
    private ComponentCompatibility findCompatibility(
        Course course,
        SelectedSection selected,
        SelectedSection candidate
    ) {
        return course.getCompatibilities().stream()
            .filter(compatibility -> compatibility.appliesTo(
                selected.componentType(),
                candidate.componentType()
            ))
            .findFirst()
            .orElse(null);
    }
}
