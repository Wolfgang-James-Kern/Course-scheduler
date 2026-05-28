package com.wolfgangkern.coursescheduler.api.dto;

import java.time.Instant;

/**
 * Provides a stable error response for invalid API requests.
 *
 * @param status HTTP status code
 * @param code stable error code
 * @param message user-safe error message
 * @param field invalid request field, when available
 * @param path request path
 * @param timestamp time at which the error occurred
 */
public record ApiErrorDto(
    int status,
    String code,
    String message,
    String field,
    String path,
    Instant timestamp
) {}
