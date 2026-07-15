package com.wolfgangkern.coursescheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Starts the Course Scheduler backend application.
 */
@SpringBootApplication
public class CourseSchedulerApplication {
    /**
     * Starts Spring Boot.
     *
     * @param args application arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(CourseSchedulerApplication.class, args);
    }
}
