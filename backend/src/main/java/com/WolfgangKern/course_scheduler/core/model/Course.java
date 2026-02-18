package com.WolfgangKern.course_scheduler.core.model;

import java.util.List;

/**
 * Course: Represents a course with a unique course code and a list of sections (different offerings of the course).
 */
public class Course {
    private final String code;
    private final List<Section> sections;

    public Course(String code, List<Section> sections) {
        this.code = code; 
        this.sections = sections;
    }

    /**
     * Getters, No setters needed as Courses are final after creation.
     */

    public String getCode() {
        return code;
    }

    public List<Section> getSections() {
        return sections;
    }
    
}
