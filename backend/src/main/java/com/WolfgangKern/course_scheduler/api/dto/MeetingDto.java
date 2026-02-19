package com.WolfgangKern.course_scheduler.api.dto;

/**
 * MeetingDto: Represents a single meeting time for a section.
 */
public class MeetingDto {
    private String day, startTime, endTime;

    public MeetingDto() {}

    public MeetingDto(String day, String startTime, String endTime) {
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    /*
     * Getters and Setters, no special conditions needed
     */

    public String getDay() {
        return day;
    }
    
    public void setDay(String day) {
        this.day = day;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}