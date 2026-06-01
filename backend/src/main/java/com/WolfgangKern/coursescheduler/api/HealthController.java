package com.wolfgangkern.coursescheduler.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Exposes a lightweight API health check.
 */
@RestController
public final class HealthController {
    /**
     * Reports that the application is available.
     *
     * @return health message
     */
    @GetMapping("/api/health")
    public String health() {
        return "Course Scheduler is healthy!";
    }
}
