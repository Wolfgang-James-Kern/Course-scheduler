package com.wolfgangkern.coursescheduler.core.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Consumer;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.CourseOption;
import com.wolfgangkern.coursescheduler.core.model.SelectedSection;

/**
 * Combines registration-valid course options into conflict-free schedules.
 */
@Component
public final class ScheduleGenerator {
    private final ConflictDetector conflictDetector;
    private final CourseOptionGenerator courseOptionGenerator;

    /**
     * Creates a schedule generator.
     *
     * @param conflictDetector exact meeting conflict detector
     * @param courseOptionGenerator component combination generator
     */
    public ScheduleGenerator(ConflictDetector conflictDetector, CourseOptionGenerator courseOptionGenerator) {
        this.conflictDetector = conflictDetector;
        this.courseOptionGenerator = courseOptionGenerator;
    }

    /**
     * Streams generated schedules without retaining every global combination.
     *
     * @param courses requested courses
     * @param scheduleConsumer generated-schedule consumer
     */
    public void generate(List<Course> courses, Consumer<List<SelectedSection>> scheduleConsumer) {
        List<List<CourseOption>> optionsByCourse = courses.stream()
            .map(courseOptionGenerator::generate)
            .sorted(Comparator.comparingInt(List::size))
            .toList();
        if (optionsByCourse.stream().anyMatch(List::isEmpty)) {
            return;
        }
        generateNext(optionsByCourse, 0, new ArrayList<>(), scheduleConsumer);
    }

    /**
     * Selects the next non-conflicting course option using depth-first backtracking.
     *
     * @param optionsByCourse course options ordered by branching factor
     * @param courseIndex current course index
     * @param selectedSections current partial schedule
     * @param scheduleConsumer completed-schedule consumer
     */
    private void generateNext(
        List<List<CourseOption>> optionsByCourse,
        int courseIndex,
        List<SelectedSection> selectedSections,
        Consumer<List<SelectedSection>> scheduleConsumer
    ) {
        if (courseIndex == optionsByCourse.size()) {
            scheduleConsumer.accept(List.copyOf(selectedSections));
            return;
        }

        for (CourseOption option : optionsByCourse.get(courseIndex)) {
            if (conflicts(selectedSections, option.sections())) {
                continue;
            }
            selectedSections.addAll(option.sections());
            generateNext(optionsByCourse, courseIndex + 1, selectedSections, scheduleConsumer);
            selectedSections.subList(selectedSections.size() - option.sections().size(), selectedSections.size()).clear();
        }
    }

    /**
     * Checks every section in a course option against the partial schedule.
     *
     * @param selectedSections current partial schedule
     * @param candidateSections candidate course option
     * @return true when registration times overlap
     */
    private boolean conflicts(List<SelectedSection> selectedSections, List<SelectedSection> candidateSections) {
        return candidateSections.stream().anyMatch(section -> conflictDetector.conflicts(selectedSections, section));
    }
}
