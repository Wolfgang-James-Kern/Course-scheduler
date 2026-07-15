package com.wolfgangkern.coursescheduler.core.model;

import java.util.Collection;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Represents a requested course and its lecture, tutorial, and lab components.
 */
public final class Course {
    private final String code;
    private final List<CourseComponent> components;
    private final List<ComponentCompatibility> compatibilities;

    /**
     * Creates a component-based course.
     *
     * @param code course code
     * @param components course components
     */
    public Course(String code, Collection<CourseComponent> components) {
        this(code, components, List.of());
    }

    /**
     * Creates a component-based course with section compatibility restrictions.
     *
     * @param code course code
     * @param components course components
     * @param compatibilities allowed cross-component section pairs
     */
    public Course(
        String code,
        Collection<CourseComponent> components,
        Collection<ComponentCompatibility> compatibilities
    ) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Course code is required.");
        }
        if (components == null || components.isEmpty()) {
            throw new IllegalArgumentException("Course " + code + " must contain at least one component.");
        }
        if (compatibilities == null) {
            throw new IllegalArgumentException("Course compatibility restrictions are required.");
        }
        List<CourseComponent> componentList = List.copyOf(components);
        List<ComponentCompatibility> compatibilityList = List.copyOf(compatibilities);
        validateComponents(code, componentList);
        validateCompatibilities(code, componentList, compatibilityList);
        this.code = code;
        this.components = componentList;
        this.compatibilities = compatibilityList;
    }

    /**
     * Returns the course code.
     *
     * @return course code
     */
    public String getCode() {
        return code;
    }

    /**
     * Returns the course components.
     *
     * @return immutable component list
     */
    public List<CourseComponent> getComponents() {
        return components;
    }

    /**
     * Returns section compatibility restrictions.
     *
     * @return immutable compatibility list
     */
    public List<ComponentCompatibility> getCompatibilities() {
        return compatibilities;
    }

    /**
     * Validates component identity and active registration state.
     *
     * @param code course code
     * @param components course components
     */
    private void validateComponents(String code, List<CourseComponent> components) {
        Set<ComponentType> types = new HashSet<>();
        boolean hasIncludedComponent = false;
        for (CourseComponent component : components) {
            if (!types.add(component.getType())) {
                throw new IllegalArgumentException("Course " + code + " contains duplicate component types.");
            }
            hasIncludedComponent |= component.isIncluded();
        }
        if (!hasIncludedComponent) {
            throw new IllegalArgumentException("Course " + code + " must include at least one component.");
        }
    }

    /**
     * Validates compatibility identity and referenced section identifiers.
     *
     * @param code course code
     * @param components course components
     * @param compatibilities compatibility restrictions
     */
    private void validateCompatibilities(
        String code,
        List<CourseComponent> components,
        List<ComponentCompatibility> compatibilities
    ) {
        EnumMap<ComponentType, Set<String>> sectionIdsByComponent = new EnumMap<>(ComponentType.class);
        for (CourseComponent component : components) {
            Set<String> sectionIds = new HashSet<>();
            component.getSections().forEach(section -> sectionIds.add(section.id().toUpperCase(Locale.ROOT)));
            sectionIdsByComponent.put(component.getType(), sectionIds);
        }

        Set<String> componentPairs = new HashSet<>();
        for (ComponentCompatibility compatibility : compatibilities) {
            ComponentType firstType = compatibility.getFirstComponent();
            ComponentType secondType = compatibility.getSecondComponent();
            Set<String> firstSectionIds = sectionIdsByComponent.get(firstType);
            Set<String> secondSectionIds = sectionIdsByComponent.get(secondType);
            if (firstSectionIds == null || secondSectionIds == null) {
                throw new IllegalArgumentException("Course " + code + " compatibility references a missing component.");
            }
            String pairKey = firstType.ordinal() < secondType.ordinal()
                ? firstType + ":" + secondType
                : secondType + ":" + firstType;
            if (!componentPairs.add(pairKey)) {
                throw new IllegalArgumentException("Course " + code + " contains duplicate component compatibility rules.");
            }
            for (SectionPair pair : compatibility.getAllowedPairs()) {
                if (!firstSectionIds.contains(pair.firstSectionId())
                    || !secondSectionIds.contains(pair.secondSectionId())) {
                    throw new IllegalArgumentException("Course " + code + " compatibility references an unknown section.");
                }
            }
        }
    }
}
