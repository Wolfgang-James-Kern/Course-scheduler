package com.wolfgangkern.coursescheduler.api;

import java.time.Instant;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.wolfgangkern.coursescheduler.api.dto.ApiErrorDto;

/**
 * Converts invalid scheduling requests into consistent client-facing responses.
 */
@RestControllerAdvice
public final class ApiExceptionHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(ApiExceptionHandler.class);

    /**
     * Handles invalid domain values and rule configurations.
     *
     * @param exception validation failure
     * @return bad-request response
     */
    @ExceptionHandler(InvalidScheduleRequestException.class)
    public ResponseEntity<ApiErrorDto> handleInvalidRequest(
        InvalidScheduleRequestException exception,
        HttpServletRequest request
    ) {
        return badRequest(exception.getCode(), exception.getMessage(), exception.getField(), request.getRequestURI());
    }

    /**
     * Handles declarative request-field validation failures.
     *
     * @param exception validation failure
     * @param request current request
     * @return bad-request response
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDto> handleValidationFailure(
        MethodArgumentNotValidException exception,
        HttpServletRequest request
    ) {
        var fieldError = exception.getBindingResult().getFieldErrors().stream().findFirst().orElse(null);
        String message = fieldError == null ? "The scheduling request is invalid." : fieldError.getDefaultMessage();
        String field = fieldError == null ? null : fieldError.getField();
        return badRequest("VALIDATION_ERROR", message, field, request.getRequestURI());
    }

    /**
     * Handles malformed JSON request bodies.
     *
     * @param exception message conversion failure
     * @return bad-request response
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorDto> handleUnreadableRequest(
        HttpMessageNotReadableException exception,
        HttpServletRequest request
    ) {
        return badRequest("MALFORMED_JSON", "The request body is not valid.", null, request.getRequestURI());
    }

    /**
     * Handles requests whose body is not JSON.
     *
     * @param exception media-type negotiation failure
     * @param request current request
     * @return unsupported-media-type response
     */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiErrorDto> handleUnsupportedMediaType(
        HttpMediaTypeNotSupportedException exception,
        HttpServletRequest request
    ) {
        ApiErrorDto error = new ApiErrorDto(
            HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(),
            "UNSUPPORTED_MEDIA_TYPE",
            "The request body must use application/json.",
            null,
            request.getRequestURI(),
            Instant.now()
        );
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(error);
    }

    /**
     * Handles unexpected failures without exposing internal details to clients.
     *
     * @param exception unexpected failure
     * @param request current request
     * @return internal-server-error response
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorDto> handleUnexpectedFailure(
        Exception exception,
        HttpServletRequest request
    ) {
        LOGGER.error("Unhandled exception while processing {}", request.getRequestURI(), exception);
        ApiErrorDto error = new ApiErrorDto(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "INTERNAL_ERROR",
            "An unexpected error occurred.",
            null,
            request.getRequestURI(),
            Instant.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Creates a standard bad-request response.
     *
     * @param code stable error code
     * @param message error message
     * @param field invalid field, when known
     * @param path request path
     * @return response entity
     */
    private ResponseEntity<ApiErrorDto> badRequest(String code, String message, String field, String path) {
        ApiErrorDto error = new ApiErrorDto(
            HttpStatus.BAD_REQUEST.value(),
            code,
            message == null || message.isBlank() ? "The scheduling request is invalid." : message,
            field,
            path,
            Instant.now()
        );
        return ResponseEntity.badRequest().body(error);
    }
}
