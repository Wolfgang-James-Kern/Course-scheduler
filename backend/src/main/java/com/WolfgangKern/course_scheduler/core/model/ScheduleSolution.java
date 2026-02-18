package com.WolfgangKern.course_scheduler.core.model;

import java.util.List;

/**
 * ScheduleSolution: Represents a complete schedule solution, which includes the selected sections, their associated statistics, and an overall score.
 */
public class ScheduleSolution {
    private final List<Section> selectedSections;
    private ScheduleStats stats;
    private final int score; //lower is better

    public ScheduleSolution(List<Section> selectedSections, ScheduleStats stats, int score) {
        this.selectedSections = selectedSections;
        this.stats = stats;
        this.score = score;
    }

    /**
     * Getters, No setters needed as ScheduleSolutions are final after creation.
     */

    public List<Section> getSelectedSections() {
        return selectedSections;
    }
    public ScheduleStats getScheduleStats() {
        return stats;
    }
    public int getScore() {
        return score;
    }
}
