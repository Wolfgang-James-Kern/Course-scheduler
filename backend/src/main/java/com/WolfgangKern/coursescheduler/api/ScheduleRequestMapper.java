package com.wolfgangkern.coursescheduler.api;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.wolfgangkern.coursescheduler.api.dto.ComponentCompatibilityDto;
import com.wolfgangkern.coursescheduler.api.dto.CourseComponentDto;
import com.wolfgangkern.coursescheduler.api.dto.CourseDto;
import com.wolfgangkern.coursescheduler.api.dto.MeetingDto;
import com.wolfgangkern.coursescheduler.api.dto.RuleConfigurationDto;
import com.wolfgangkern.coursescheduler.api.dto.SectionRequestDto;
import com.wolfgangkern.coursescheduler.core.model.AttendanceRequirement;
import com.wolfgangkern.coursescheduler.core.model.ComponentType;
import com.wolfgangkern.coursescheduler.core.model.ComponentCompatibility;
import com.wolfgangkern.coursescheduler.core.model.Course;
import com.wolfgangkern.coursescheduler.core.model.CourseComponent;
import com.wolfgangkern.coursescheduler.core.model.EnrollmentRequirement;
import com.wolfgangkern.coursescheduler.core.model.Meeting;
import com.wolfgangkern.coursescheduler.core.model.MeetingFrequency;
import com.wolfgangkern.coursescheduler.core.model.Section;
import com.wolfgangkern.coursescheduler.core.model.SectionPair;
import com.wolfgangkern.coursescheduler.core.rule.RuleConfiguration;
import com.wolfgangkern.coursescheduler.core.rule.RuleMode;
import com.wolfgangkern.coursescheduler.core.rule.RuleSettings;
import com.wolfgangkern.coursescheduler.core.rule.RuleType;

/**
 * Maps scheduling API input into validated domain objects.
 */
@Component
public final class ScheduleRequestMapper {
    /**
     * Maps requested courses while enforcing case-insensitive code uniqueness.
     *
     * @param courseDtos requested courses
     * @return domain courses
     */
    public List<Course> toCourses(List<CourseDto> courseDtos) {
        if (courseDtos == null) {
            return List.of();
        }
        Set<String> courseCodes = new HashSet<>();
        List<Course> courses = new ArrayList<>();
        for (CourseDto courseDto : courseDtos) {
            if (courseDto == null) {
                throw new IllegalArgumentException("Course input cannot be null.");
            }
            String courseCode = requireText(courseDto.code(), "Course code").toUpperCase(Locale.ROOT);
            if (!courseCodes.add(courseCode)) {
                throw new IllegalArgumentException("Course codes must be unique.");
            }
            List<CourseComponent> components = courseDto.components() == null
                ? List.of()
                : courseDto.components().stream().map(component -> toComponent(courseCode, component)).toList();
            List<ComponentCompatibility> compatibilities = courseDto.compatibilities() == null
                ? List.of()
                : courseDto.compatibilities().stream().map(this::toCompatibility).toList();
            courses.add(new Course(courseCode, components, compatibilities));
        }
        return List.copyOf(courses);
    }

    /**
     * Maps configured built-in rules.
     *
     * @param ruleDtos configured rules
     * @return domain rule configurations
     */
    public List<RuleConfiguration> toRules(List<RuleConfigurationDto> ruleDtos) {
        return ruleDtos == null ? List.of() : ruleDtos.stream().map(this::toRule).toList();
    }

    /**
     * Maps one course component and its sections.
     *
     * @param courseCode owning course code
     * @param dto component input
     * @return domain component
     */
    private CourseComponent toComponent(String courseCode, CourseComponentDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Course component input cannot be null.");
        }
        ComponentType type = parseEnum(ComponentType.class, dto.type(), "Component type");
        EnrollmentRequirement enrollment = dto.enrollmentRequirement() == null
            ? EnrollmentRequirement.REQUIRED
            : parseEnum(EnrollmentRequirement.class, dto.enrollmentRequirement(), "Enrollment requirement");
        AttendanceRequirement attendance = dto.attendanceRequirement() == null
            ? AttendanceRequirement.MANDATORY
            : parseEnum(AttendanceRequirement.class, dto.attendanceRequirement(), "Attendance requirement");
        MeetingFrequency frequency = dto.meetingFrequency() == null
            ? MeetingFrequency.WEEKLY
            : parseEnum(MeetingFrequency.class, dto.meetingFrequency(), "Meeting frequency");
        // Optional components require an explicit included=true; null means excluded.
        boolean included = Boolean.TRUE.equals(dto.included());
        List<Section> sections = dto.sections() == null
            ? List.of()
            : dto.sections().stream().map(this::toSection).toList();
        return new CourseComponent(type, enrollment, attendance, frequency, included, sections);
    }

    /**
     * Maps one component compatibility restriction.
     *
     * @param dto compatibility input
     * @return domain compatibility restriction
     */
    private ComponentCompatibility toCompatibility(ComponentCompatibilityDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Component compatibility input cannot be null.");
        }
        List<SectionPair> allowedPairs = dto.allowedPairs() == null
            ? List.of()
            : dto.allowedPairs().stream().map(pair -> {
                if (pair == null) {
                    throw new IllegalArgumentException("Section compatibility pair cannot be null.");
                }
                return new SectionPair(pair.firstSectionId(), pair.secondSectionId());
            }).toList();
        return new ComponentCompatibility(
            parseEnum(ComponentType.class, dto.firstComponent(), "First compatibility component"),
            parseEnum(ComponentType.class, dto.secondComponent(), "Second compatibility component"),
            allowedPairs
        );
    }

    /**
     * Maps one section.
     *
     * @param dto section input
     * @return domain section
     */
    private Section toSection(SectionRequestDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Section input cannot be null.");
        }
        List<Meeting> meetings = dto.meetings() == null
            ? List.of()
            : dto.meetings().stream().map(this::toMeeting).toList();
        return new Section(requireText(dto.id(), "Section identifier").toUpperCase(Locale.ROOT), meetings);
    }

    /**
     * Maps one meeting time.
     *
     * @param dto meeting input
     * @return domain meeting
     */
    private Meeting toMeeting(MeetingDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Meeting input cannot be null.");
        }
        return new Meeting(
            parseEnum(DayOfWeek.class, dto.day(), "Day"),
            LocalTime.parse(requireText(dto.startTime(), "Meeting start time")),
            LocalTime.parse(requireText(dto.endTime(), "Meeting end time"))
        );
    }

    /**
     * Maps one configured built-in rule.
     *
     * @param dto rule input
     * @return domain rule configuration
     */
    private RuleConfiguration toRule(RuleConfigurationDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Rule configuration cannot be null.");
        }
        RuleType type = parseEnum(RuleType.class, dto.type(), "Rule type");
        RuleMode mode = parseEnum(RuleMode.class, dto.mode(), "Rule mode");
        int importance = mode == RuleMode.HARD ? 1 : dto.importance() == null ? 3 : dto.importance();
        List<DayOfWeek> days = dto.days() == null
            ? List.of()
            : dto.days().stream().map(day -> parseEnum(DayOfWeek.class, day, "Day")).toList();
        RuleSettings settings = switch (type) {
            case EARLIEST_START, LATEST_END -> new RuleSettings.TimeThreshold(
                requireValue(parseOptionalTime(dto.time()), "time"));
            case MAXIMUM_GAP, MAXIMUM_WEEKLY_GAP, BALANCE_WORKLOAD -> new RuleSettings.MinuteThreshold(
                requireNonNegative(dto.minutes(), "minutes"));
            case MAXIMUM_CONTINUOUS_BLOCK, MINIMUM_DAY_LENGTH, MAXIMUM_DAILY_SPAN ->
                new RuleSettings.MinuteThreshold(requirePositive(dto.minutes(), "minutes"));
            case MAXIMUM_MEETINGS_PER_DAY, MAXIMUM_CAMPUS_DAYS ->
                new RuleSettings.CountThreshold(requirePositive(dto.count(), "count"));
            case DAYS_OFF -> new RuleSettings.SelectedDays(days);
            case BLOCKED_TIME -> new RuleSettings.BlockedPeriod(
                requireValue(dto.day() == null || dto.day().isBlank()
                    ? null
                    : parseEnum(DayOfWeek.class, dto.day(), "Day"), "day"),
                requireValue(parseOptionalTime(dto.startTime()), "startTime"),
                requireValue(parseOptionalTime(dto.endTime()), "endTime"));
            case AVOID_SINGLE_MEETING_DAYS, CLUSTER_CAMPUS_DAYS, OCCASIONAL_MEETINGS_AT_DAY_EDGES ->
                new RuleSettings.None();
        };
        return new RuleConfiguration(type, mode, importance, settings);
    }

    /**
     * Parses an enum value with a friendly failure message.
     *
     * @param type enum class
     * @param rawValue text value
     * @param fieldName field label for errors
     * @param <T> enum type
     * @return parsed enum constant
     */
    private <T extends Enum<T>> T parseEnum(Class<T> type, String rawValue, String fieldName) {
        String value = requireText(rawValue, fieldName).toUpperCase(Locale.ROOT);
        try {
            return Enum.valueOf(type, value);
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Invalid " + fieldName + ": " + value + ".");
        }
    }

    /**
     * Requires a non-null rule setting.
     *
     * @param value supplied setting
     * @param name setting name
     * @param <T> setting type
     * @return supplied setting
     */
    private <T> T requireValue(T value, String name) {
        if (value == null) {
            throw new IllegalArgumentException(name + " is required for this rule.");
        }
        return value;
    }

    /**
     * Requires a positive integer rule setting.
     *
     * @param value supplied setting
     * @param name setting name
     * @return validated setting
     */
    private int requirePositive(Integer value, String name) {
        int required = requireValue(value, name);
        if (required < 1) {
            throw new IllegalArgumentException(name + " must be at least 1.");
        }
        return required;
    }

    /**
     * Requires a non-negative integer rule setting.
     *
     * @param value supplied setting
     * @param name setting name
     * @return validated setting
     */
    private int requireNonNegative(Integer value, String name) {
        int required = requireValue(value, name);
        if (required < 0) {
            throw new IllegalArgumentException(name + " cannot be negative.");
        }
        return required;
    }

    /**
     * Parses an optional time value.
     *
     * @param value time text
     * @return parsed time or null
     */
    private LocalTime parseOptionalTime(String value) {
        return value == null || value.isBlank() ? null : LocalTime.parse(value);
    }

    /**
     * Requires trimmed, non-blank request text.
     *
     * @param value supplied text
     * @param name field name
     * @return trimmed text
     */
    private String requireText(String value, String name) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(name + " is required.");
        }
        return value.trim();
    }
}
