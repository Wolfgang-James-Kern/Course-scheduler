package com.WolfgangKern.course_scheduler.core.model;

import java.util.List;

/**
 * ScheduleSolution: Represents a complete schedule solution, which includes the selected sections, their associated statistics, and an overall score.
 */
public class ScheduleSolution {
    private final List<Section> sections;
    private final ScheduleStats stats;
    private final int score; //lower is better

    public ScheduleSolution(List<Section> sections, ScheduleStats stats, int score) {
        this.sections = sections;
        this.stats = stats;
        this.score = score;
    }

    /**
     * Getters, No setters needed as ScheduleSolutions are final after creation.
     */

    public List<Section> getSections() {
        return sections;
    }
    public ScheduleStats getStats() {
        return stats;
    }
    public int getScore() {
        return score;
    }
}
