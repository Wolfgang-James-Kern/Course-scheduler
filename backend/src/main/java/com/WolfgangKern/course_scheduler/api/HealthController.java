package com.WolfgangKern.course_scheduler.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HealthController: Provides a simple health check endpoint for the Course Scheduler API.
 */
@RestController
public class HealthController {

    /**
     * health: Simple health check endpoint for testing
     * 
     * @return A string message indicating the health status of the Course Scheduler API.
     */
    @GetMapping("/api/health")//makes it so that when you go to /api/health, it will return a message indicating the health of the API
    public String health() {
        return "Course Scheduler is healthy!";
    }
}