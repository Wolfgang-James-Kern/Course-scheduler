package com.WolfgangKern.course_scheduler.api.dto;

import java.util.List;

/**
 * SectionDto: Represents a specific section of a course, including its meeting times.
 */
public class SectionDto {
    
    private String sectionId;
    private List<MeetingDto> meetings;

    SectionDto() {}

    /*
     * Getters and Setters, no special conditions needed
     */

    public String getSectionId() {
        return sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }

    public List<MeetingDto> getMeetings() {
        return meetings;
    }

    public void setMeetings(List<MeetingDto> meetings) {
        this.meetings = meetings;
    }
}