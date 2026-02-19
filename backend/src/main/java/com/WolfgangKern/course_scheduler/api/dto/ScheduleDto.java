package com.WolfgangKern.course_scheduler.api.dto;

import java.util.List;

/**
 * ScheduleDto: Represents a generated schedule, containing the chosen sections, computed statistics, and an overall score.
 */
public class ScheduleDto {
    private List<SectionDto> sections;
    private StatsDto stats;
    private int score; // lower is better

    public ScheduleDto() {}

    public ScheduleDto(List<SectionDto> sections, StatsDto stats, int score) {
        this.sections = sections;
        this.stats = stats;
        this.score = score;
    }

    /*
     * Getters and Setters, no special conditions needed 
     */

    public List<SectionDto> getSections() {
        return sections;
    }

    public void setSections(List<SectionDto> sections) {
        this.sections = sections;
    }

    public StatsDto getStats() {
        return stats;
    }

    public void setStats(StatsDto stats) {
        this.stats = stats;
    }

    public int getScore() {
        return score;
    }
    
    public void setScore(int score) {
        this.score = score;
    }
}