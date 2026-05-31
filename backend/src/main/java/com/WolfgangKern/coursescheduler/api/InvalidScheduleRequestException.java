package com.wolfgangkern.coursescheduler.api;

/**
 * Identifies a client-provided scheduling request that cannot be processed.
 */
public final class InvalidScheduleRequestException extends RuntimeException {
    private final String code;
    private final String field;

    /**
     * Creates a request validation failure.
     *
     * @param code stable error code
     * @param message client-safe message
     * @param field invalid field, when known
     */
    public InvalidScheduleRequestException(String code, String message, String field) {
        super(message);
        this.code = code;
        this.field = field;
    }

    /**
     * Returns the stable error code.
     *
     * @return error code
     */
    public String getCode() {
        return code;
    }

    /**
     * Returns the invalid field, when known.
     *
     * @return field path or null
     */
    public String getField() {
        return field;
    }
}
