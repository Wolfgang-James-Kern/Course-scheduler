package com.wolfgangkern.coursescheduler.config;

import java.time.Duration;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Defines configurable limits and trusted browser origins for the scheduling API.
 *
 * @param allowedOrigins browser origins allowed to call the API
 * @param rateLimitCapacity maximum tokens held by one client bucket
 * @param rateLimitRefillTokens tokens restored during each refill period
 * @param rateLimitRefillPeriod interval between token refills
 * @param maxConcurrentSolves maximum solve requests processed at once
 * @param clientCacheMaximumSize maximum tracked client buckets
 * @param clientCacheExpiry inactive duration before a client bucket expires
 */
@Validated
@ConfigurationProperties("app.api")
public record ApiProtectionProperties(
    @NotEmpty List<@NotBlank String> allowedOrigins,
    @Min(1) long rateLimitCapacity,
    @Min(1) long rateLimitRefillTokens,
    @NotNull Duration rateLimitRefillPeriod,
    @Min(1) int maxConcurrentSolves,
    @Min(1) long clientCacheMaximumSize,
    @NotNull Duration clientCacheExpiry
) {}
