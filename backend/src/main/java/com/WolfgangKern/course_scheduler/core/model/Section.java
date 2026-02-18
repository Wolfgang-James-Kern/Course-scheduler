package com.WolfgangKern.course_scheduler.core.model;

import java.util.List;

/**
 * Section: Represents a specific section of a course, identified by a unique section ID and containing a list of meetings (times when the section meets).
 */
public class Section {
    private final String courseCode, sectionId;
    private final List<Meeting> meetings;

    public Section(String courseCode, String sectionId, List<Meeting> meetings) {
        this.courseCode = courseCode;
        this.sectionId = sectionId;
        this.meetings = meetings;
    }

    /**
     * Getters, No setters needed as sections are final after creation.
     */

    public String getCourseCode() {
        return courseCode;
    }
    public String getSectionId() {
        return sectionId;
    }
    public List<Meeting> getMeetings() {
        return meetings;
    }
}
