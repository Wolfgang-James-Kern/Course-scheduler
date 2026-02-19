package com.WolfgangKern.course_scheduler.api.dto;

import java.util.List;

/**
 * SectionDto: Represents a specific section of a course, including its meeting times.
 */
public class SectionDto {
    
    private String courseCode, id;
    private List<MeetingDto> meetings;

    public SectionDto() {}

    public SectionDto(String courseCode, String id, List<MeetingDto> meetings) {
        this.courseCode = courseCode;
        this.id = id;
        this.meetings = meetings;
    }

    /*
     * Getters and Setters, no special conditions needed
     */

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getId() {
        return id;
    }

    public void setId(String sectionId) {
        this.id = sectionId;
    }

    public List<MeetingDto> getMeetings() {
        return meetings;
    }

    public void setMeetings(List<MeetingDto> meetings) {
        this.meetings = meetings;
    }
}