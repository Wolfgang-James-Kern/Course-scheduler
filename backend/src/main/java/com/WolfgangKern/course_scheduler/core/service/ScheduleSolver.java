package com.WolfgangKern.course_scheduler.core.service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.BitSet;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.stream.Collectors;

import com.WolfgangKern.course_scheduler.core.model.*;;

public class ScheduleSolver {
    private static final int SLOT_MINUTES = 30;
    private static final int SLOTS_PER_DAY = (23-8) * 60 / SLOT_MINUTES; // 8:00AM to 11:00PM
    private static final int DAYS_PER_WEEK = 5; // Monday to Friday
    private static final int TOTAL_SLOTS = SLOTS_PER_DAY * DAYS_PER_WEEK;

    /**
     * solve: Generates schedules based on the provided courses and constraints, returning the top N solutions.
     * @param courses list of courses
     * @param constraints optional constraints for schedule generation (may be null)
     * @param topN max number of schedules to return
     * @return list of ranked solutions, best first
     */
    public List<ScheduleSolution> solve(List<Course> courses, Constraints constraints, int topN) {
        if(courses == null || courses.isEmpty() || topN <= 0) 
            return Collections.emptyList();
        
        // Sort courses by number of sections to optimize backtracking
        List<Course> orderedCourses = courses.stream()
            .sorted(Comparator.comparingInt(c -> c.getSections().size()))
            .collect(Collectors.toList());

        // Max-heap to keep track of best solutions, keep worst at top for easy removal when we exceed topN
        PriorityQueue<ScheduleSolution> bestSolutions = new PriorityQueue<>(Comparator.comparingInt(ScheduleSolution::getScore).reversed());

        backtrack(orderedCourses, 0, constraints, new BitSet(TOTAL_SLOTS), new ArrayList<>(), bestSolutions, topN);

        //convert heap to sorted list (best first)
        List<ScheduleSolution> result = new ArrayList<>(bestSolutions);
        result.sort(Comparator.comparingInt(ScheduleSolution::getScore));
        return result;
    }

    /**
     * backtrack: Recursive DFS backtracking function to generate valid schedules, compute stats, and maintain top solutions.
     * @param courses ordered list of courses
     * @param index current course index
     * @param constraints constraints to validate against (may be null)
     * @param occupiedSlots BitSet representing occupied time slots in the current schedule
     * @param chosenSections list of currently chosen sections for the schedule being built
     * @param bestSolutions priority queue (max-heap) to maintain the top N solutions found so far
     * @param topN max number of solutions to keep in bestSolutions
     */
    private void backtrack(List<Course> courses, int index, Constraints constraints, BitSet occupiedSlots, List<Section> chosenSections, PriorityQueue<ScheduleSolution> bestSolutions, int topN) {
       // Base case: if we've considered all courses, compute stats and potentially add to best solutions
        if(index == courses.size()) {
            ScheduleStats stats = computeStats(chosenSections);
            // TODO: validate stats against big constraints if needed

            int score = score(stats, constraints);
            ScheduleSolution solution = new ScheduleSolution(new ArrayList<>(chosenSections), stats, score);

            if(bestSolutions.size() < topN) {
                bestSolutions.offer(solution);
            } else if(score < bestSolutions.peek().getScore()) {
                bestSolutions.poll(); // Remove worst solution
                bestSolutions.offer(solution); // Add new better solution
            }
            return;
        }


        // Iterate through sections of the current course, check for time conflicts using occupiedSlots, and recurse if valid
        for(Section section : courses.get(index).getSections()) {
            //TODO: Check if section meets small constraints before checking time conflicts

            BitSet sectionSlots = fillClassSlots(section);
            if(conflicts(occupiedSlots, sectionSlots)) {
                continue; // Skip this section if it conflicts with already chosen sections
            }

            occupiedSlots.or(sectionSlots); // Mark these slots as occupied
            chosenSections.add(section); // Choose this section

            backtrack(courses, index + 1, constraints, occupiedSlots, chosenSections, bestSolutions, topN); // Recurse to next course

            chosenSections.remove(chosenSections.size() - 1); // Backtrack: un-choose this section
            occupiedSlots.andNot(sectionSlots); // Backtrack: un-mark these slots
        }
    }

    /**
     * computeStats: Computes statistics for a given schedule (list of chosen sections)
     * 
     * @param chosen list of chosen sections in the schedule
     * @return ScheduleStats object containing computed statistics for the schedule
     */
    private ScheduleStats computeStats(List<Section> chosen) {
        Map<DayOfWeek, List<Meeting>> scheduleMap = groupMeetingsByDay(chosen);

        LocalTime earliest = null, latest = null;

        int totalGap = 0;
        int daysWithClasses = 0;

        for(DayOfWeek day : DayOfWeek.values()){
            List<Meeting> meetings = scheduleMap.get(day);
            if(meetings == null || meetings.isEmpty()) 
                continue;

            daysWithClasses++;

            for(Meeting meeting : meetings) {
                if(earliest == null || meeting.getStartTime().isBefore(earliest)) 
                    earliest = meeting.getStartTime();
                if(latest == null || meeting.getEndTime().isAfter(latest)) 
                    latest = meeting.getEndTime();
            }

            totalGap += calculateDailyGap(meetings);
        }

        return new ScheduleStats(earliest, latest, totalGap, daysWithClasses);
    }

    /**
     * groupMeetingsByDay: Groups meetings from the chosen sections by day of the week
     * @param chosen chosen sections
     * @return map of day -> meeting list
     */
    private Map<DayOfWeek, List<Meeting>> groupMeetingsByDay(List<Section> chosen) {
        Map<DayOfWeek, List<Meeting>> scheduleMap = new HashMap<>();
        for(Section section : chosen) {
            for(Meeting meeting : section.getMeetings()) {
                scheduleMap.computeIfAbsent(meeting.getDay(), k -> new ArrayList<>()).add(meeting);
            }
        }
        return scheduleMap;
    }

    /**
     * calculateDailyGap: Calculates the total gap time between meetings in a single day
     * @param meetings list of meetings for a day
     * @return total gap time in minutes
     */
    private int calculateDailyGap(List<Meeting> meetings) {
        if(meetings.size() <= 1) 
            return 0;

        // Sort meetings by start time
        meetings.sort(Comparator.comparing(Meeting::getStartTime));

        int gap = 0;
        for(int i = 0; i < meetings.size()-1; i++) {
            LocalTime currEnd = meetings.get(i).getEndTime();
            LocalTime nextStart = meetings.get(i+1).getStartTime();
            if(nextStart.isAfter(currEnd)) {
                gap += java.time.Duration.between(currEnd, nextStart).toMinutes();
            }
        }
        return gap;
    }

    /**
     * meetsConstraints: Checks if a given section meets the specified constraints.
     * 
     * @param section the section to check
     * @param constraints the constraints to validate against (may be null)
     * @return true if the section meets the constraints, false otherwise
     */
    private boolean meetsConstraints(Section section, Constraints constraints) {
        return true; // TODO: Implement constraint checking logic based on the properties of the section and the constraints provided (e.g., time preferences, day preferences, etc.)
    }

    /**
     * score: Computes a score for a schedule based on its statistics and the provided constraints, used for ranking solutions.
     * @param stats stats to score
     * @param constraints constraints to consider in scoring (may be null)
     * @return integer score for the schedule, lower is better
     */
    private int score(ScheduleStats stats, Constraints constraints) {
        return stats.getTotalGapMinutes() + stats.getDaysWithClasses()*10; // Placeholder: can be enhanced to consider more factors and constraints
    }

    /**
     * fillClassSlots: Converts a section's meetings into a BitSet representing occupied time slots for conflict checking.
     * @param section section to convert
     * @return BitSet representing occupied time slots for the section's meetings
     */
    private BitSet fillClassSlots(Section section) {
        BitSet slots = new BitSet(TOTAL_SLOTS);
        for(Meeting meeting : section.getMeetings()) {
            int dayIndex = meeting.getDay().getValue() - 1; // Monday=0
            int startSlot = toSlotIndex(meeting.getStartTime()); 
            int endSlot = toSlotIndex(meeting.getEndTime());

            int baseIndex = dayIndex * SLOTS_PER_DAY;
            slots.set(baseIndex + startSlot, baseIndex + endSlot); // Mark slots as occupied
        }
        return slots;
    }

    /**
     * toSlotIndex: Converts a LocalTime to a slot index based on the defined time range and slot length.
     * @param time the LocalTime to convert
     * @return integer index of the slot corresponding to the given time in the range [0, SLOTS_PER_DAY)]
     */
    private int toSlotIndex(LocalTime time) {
        return ( (time.getHour() - 8) * 60 + time.getMinute() ) / SLOT_MINUTES;//hours from 8:00AM, converted to minutes + minutes, divided by slot length
    }

    /**
     * conflicts: Checks if the candidate section's time slots conflict with already occupied slots in the current schedule.
     * @param occupied BitSet representing currently occupied time slots in the schedule
     * @param candidate BitSet representing the candidate section's time slots
     * @return true if there is a conflict (overlap) between occupied and candidate slots, false otherwise
     */
    private boolean conflicts(BitSet occupied, BitSet candidate) {
        BitSet temp = (BitSet) occupied.clone();
        temp.and(candidate);
        return !temp.isEmpty(); // If there's any overlap, it means a conflict
    }
}
