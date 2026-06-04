package com.wolfgangkern.coursescheduler.api.protection;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import tools.jackson.databind.ObjectMapper;

import com.wolfgangkern.coursescheduler.api.dto.ApiErrorDto;
import com.wolfgangkern.coursescheduler.config.ApiProtectionProperties;

/**
 * Limits per-client request rates and concurrent schedule calculations.
 */
@Component
public final class SolveProtectionFilter extends OncePerRequestFilter {
    private static final String SOLVE_PATH = "/api/solve";
    private static final int BUSY_RETRY_SECONDS = 2;

    private final ApiProtectionProperties properties;
    private final ObjectMapper objectMapper;
    private final Cache<String, Bucket> clientBuckets;
    private final Semaphore solvePermits;

    /**
     * Creates the API protection filter.
     *
     * @param properties configured API limits
     * @param objectMapper JSON response serializer
     */
    public SolveProtectionFilter(ApiProtectionProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        clientBuckets = Caffeine.newBuilder()
            .maximumSize(properties.clientCacheMaximumSize())
            .expireAfterAccess(properties.clientCacheExpiry())
            .build();
        solvePermits = new Semaphore(properties.maxConcurrentSolves(), true);
    }

    /**
     * Skips protection for health checks, preflight requests, and non-solve routes.
     *
     * @param request current request
     * @return true when this filter should not run
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equalsIgnoreCase(request.getMethod())
            || !SOLVE_PATH.equals(request.getServletPath());
    }

    /**
     * Applies the client rate limit and global concurrency limit.
     *
     * @param request current request
     * @param response current response
     * @param filterChain remaining filter chain
     * @throws ServletException when downstream request handling fails
     * @throws IOException when response writing fails
     */
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        Bucket bucket = clientBuckets.get(request.getRemoteAddr(), this::createBucket);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            long retrySeconds = Math.max(
                1,
                (long) Math.ceil(probe.getNanosToWaitForRefill() / (double) TimeUnit.SECONDS.toNanos(1))
            );
            writeError(
                response,
                HttpStatus.TOO_MANY_REQUESTS,
                "RATE_LIMIT_EXCEEDED",
                "Too many schedule requests. Wait before trying again.",
                retrySeconds
            );
            return;
        }
        if (!solvePermits.tryAcquire()) {
            writeError(
                response,
                HttpStatus.SERVICE_UNAVAILABLE,
                "SERVER_BUSY",
                "The scheduler is busy. Try again shortly.",
                BUSY_RETRY_SECONDS
            );
            return;
        }
        try {
            filterChain.doFilter(request, response);
        } finally {
            solvePermits.release();
        }
    }

    /**
     * Creates a full token bucket for one newly observed client.
     *
     * @param clientAddress client cache key
     * @return configured token bucket
     */
    private Bucket createBucket(String clientAddress) {
        return Bucket.builder()
            .addLimit(limit -> limit
                .capacity(properties.rateLimitCapacity())
                .refillGreedy(properties.rateLimitRefillTokens(), properties.rateLimitRefillPeriod()))
            .build();
    }

    /**
     * Writes a standard protection error response.
     *
     * @param response current response
     * @param status HTTP error status
     * @param code stable application error code
     * @param message safe user-facing message
     * @param retrySeconds suggested wait before retrying
     * @throws IOException when response serialization fails
     */
    private void writeError(
        HttpServletResponse response,
        HttpStatus status,
        String code,
        String message,
        long retrySeconds
    ) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        response.setHeader(HttpHeaders.RETRY_AFTER, String.valueOf(retrySeconds));
        objectMapper.writeValue(
            response.getOutputStream(),
            new ApiErrorDto(status.value(), code, message, null, SOLVE_PATH, Instant.now())
        );
    }
}
