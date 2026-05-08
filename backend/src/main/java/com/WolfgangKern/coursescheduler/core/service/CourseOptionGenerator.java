package com.wolfgangkern.coursescheduler.core.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.CourseComponent;
import com.wolfgangkern.coursescheduler.core.model.CourseOption;
import com.wolfgangkern.coursescheduler.core.model.Section;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;
import com.wolfgangkern.coursescheduler.core.service.compatibility.CompositeCourseOptionSpecification;
import com.wolfgangkern.coursescheduler.core.service.compatibility.CourseOptionSpecification;

/**
 * Generates registration-valid combinations containing one section per included component.
 */
@Component
public final class CourseOptionGenerator {
    private final CourseOptionSpecification optionSpecification;

    /**
     * Creates a course-option generator.
     *
     * @param optionSpecification registration-validity specification
     */
    public CourseOptionGenerator(CompositeCourseOptionSpecification optionSpecification) {
        this.optionSpecification = optionSpecification;
    }

    /**
     * Generates every conflict-free component selection for one course.
     *
     * @param course course to expand
     * @return valid course options
     */
    public List<CourseOption> generate(Course course) {
        List<CourseComponent> includedComponents = course.getComponents().stream()
            .filter(CourseComponent::isIncluded)
            .sorted(Comparator.comparingInt(component -> component.getSections().size()))
            .toList();
        List<CourseOption> options = new ArrayList<>();
        generateNext(course, includedComponents, 0, new ArrayList<>(), options);
        return options;
    }

    /**
     * Selects the next component section using depth-first backtracking.
     *
     * @param course course being expanded
     * @param components included components
     * @param componentIndex current component index
     * @param selectedSections current component selections
     * @param options completed course options
     */
    private void generateNext(
        Course course,
        List<CourseComponent> components,
        int componentIndex,
        List<SelectedSection> selectedSections,
        List<CourseOption> options
    ) {
        if (componentIndex == components.size()) {
            options.add(new CourseOption(course.getCode(), selectedSections));
            return;
        }
        CourseComponent component = components.get(componentIndex);
        for (Section section : component.getSections()) {
            SelectedSection candidate = new SelectedSection(
                course.getCode(),
                component.getType(),
                component.getAttendanceRequirement(),
                component.getMeetingFrequency(),
                section
            );
            if (!optionSpecification.allows(course, selectedSections, candidate)) {
                continue;
            }
            selectedSections.add(candidate);
            generateNext(course, components, componentIndex + 1, selectedSections, options);
            selectedSections.remove(selectedSections.size() - 1);
        }
    }
}
