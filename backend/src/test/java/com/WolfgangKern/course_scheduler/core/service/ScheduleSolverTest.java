package com.WolfgangKern.course_scheduler.core.service;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.WolfgangKern.course_scheduler.core.model.*;

public class ScheduleSolverTest {
    private final ScheduleSolver solver = new ScheduleSolver();

     @Test
     void test_computeStats_void() {
         // Create mock sections and meetings
         Meeting m1 = new Meeting(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(10, 0));
         Meeting m2 = new Meeting(DayOfWeek.MONDAY, LocalTime.of(17, 30), LocalTime.of(19, 0));
         Section s1 = new Section("CS 1010", "001", List.of(m1, m2));
         Course c1 = new Course("CS 1010", List.of(s1));

         Meeting m3 = new Meeting(DayOfWeek.WEDNESDAY, LocalTime.of(11, 0), LocalTime.of(12, 0));
         Section s2 = new Section("MATH 2001", "001", List.of(m3));
         Course c2 = new Course("MATH 2001", List.of(s2));

         List<ScheduleSolution> solutions = solver.solve(List.of(c1, c2), new Constraints(null, null, null, null), 5);

         ScheduleStats stats = solutions.get(0).getStats();

         assertTrue(stats.getEarliestStart().equals(LocalTime.of(9, 0)));
         assertTrue(stats.getLatestEnd().equals(LocalTime.of(19, 0)));
         assertTrue(stats.getTotalGapMinutes() == 60*7.5); // 7.5 hours gap on Monday
         assertTrue(stats.getDaysWithClasses() == 2);
     }

     @Test 
     void solve_Returns_Empty_When_No_Courses() {
         List<ScheduleSolution> solutions = solver.solve(Collections.emptyList(), new Constraints(null, null, null, null), 5);
         assertTrue(solutions.isEmpty());
     }

     @Test
     void solve_Returns_Solutions_When_Courses_Present() {
         Meeting m1 = new Meeting(DayOfWeek.MONDAY, LocalTime.of(10, 0), LocalTime.of(11, 0));
         Meeting m2 = new Meeting(DayOfWeek.TUESDAY, LocalTime.of(10, 0), LocalTime.of(11, 0));
         
         Section s1 = new Section("CS 1010", "001", List.of(m1));
         Section s2 = new Section("CS 1010", "002", List.of(m2));

         Course c1 = new Course("CS 1010", List.of(s1, s2));

         Meeting m3 = new Meeting(DayOfWeek.MONDAY, LocalTime.of(11, 0), LocalTime.of(12, 0));
         Meeting m4 = new Meeting(DayOfWeek.TUESDAY, LocalTime.of(11, 0), LocalTime.of(12, 0));
         
         Section s3 = new Section("Math 2001", "001", List.of(m3));
         Section s4 = new Section("Math 2001", "002", List.of(m4));

         Course c2 = new Course("MATH 2001", List.of(s3, s4));

         List<ScheduleSolution> solutions = solver.solve(List.of(c1, c2), new Constraints(null, null, null, null), 5);
         assertTrue(solutions.size() == 4); // 4 combinations: (s1, s3), (s1, s4), (s2, s3), (s2, s4)
    }

    @Test
     void solve_Excludes_Conflicting_Combinations() {
         Meeting m1 = new Meeting(DayOfWeek.MONDAY, LocalTime.of(10, 0), LocalTime.of(11, 0));
         Meeting m2 = new Meeting(DayOfWeek.TUESDAY, LocalTime.of(10, 0), LocalTime.of(11, 0));
         
         Section s1 = new Section("CS 1010", "001", List.of(m1));
         Section s2 = new Section("CS 1010", "002", List.of(m2));

         Course c1 = new Course("CS 1010", List.of(s1, s2));

         Meeting m3 = new Meeting(DayOfWeek.MONDAY, LocalTime.of(10, 30), LocalTime.of(11, 30));
         Meeting m4 = new Meeting(DayOfWeek.TUESDAY, LocalTime.of(11, 0), LocalTime.of(12, 0));
         
         Section s3 = new Section("Math 2001", "001", List.of(m3));
         Section s4 = new Section("Math 2001", "002", List.of(m4));

         Course c2 = new Course("MATH 2001", List.of(s3, s4));

         List<ScheduleSolution> solutions = solver.solve(List.of(c1, c2), new Constraints(null, null, null, null), 5);
         assertTrue(solutions.size() == 3); // 3 combinations: (s1, s4), (s2, s3), (s2, s4)
    }

    

    @Test
    void solve_Respects_TopN_Limit() {
         Meeting m1 = new Meeting(DayOfWeek.MONDAY, LocalTime.of(10, 0), LocalTime.of(11, 0));
         Meeting m2 = new Meeting(DayOfWeek.TUESDAY, LocalTime.of(10, 0), LocalTime.of(11, 0));
         
         Section s1 = new Section("CS 1010", "001", List.of(m1));
         Section s2 = new Section("CS 1010", "002", List.of(m2));

         Course c1 = new Course("CS 1010", List.of(s1, s2));

         Meeting m3 = new Meeting(DayOfWeek.MONDAY, LocalTime.of(11, 0), LocalTime.of(12, 0));
         Meeting m4 = new Meeting(DayOfWeek.TUESDAY, LocalTime.of(11, 0), LocalTime.of(12, 0));
         
         Section s3 = new Section("Math 2001", "001", List.of(m3));
         Section s4 = new Section("Math 2001", "002", List.of(m4));

         Course c2 = new Course("MATH 2001", List.of(s3, s4));

         List<ScheduleSolution> solutions = solver.solve(List.of(c1, c2), new Constraints(null, null, null, null), 2);
         assertTrue(solutions.size() == 2); // Should only return top 2 solutions
    }   

    @Test
    void solve_Returns_Sorted_Best_First() {
         Meeting m1 = new Meeting(DayOfWeek.MONDAY, LocalTime.of(10, 0), LocalTime.of(11, 0));
         Meeting m2 = new Meeting(DayOfWeek.TUESDAY, LocalTime.of(11, 0), LocalTime.of(12, 0));
         
         Section s1 = new Section("CS 1010", "001", List.of(m1));
         Section s2 = new Section("CS 1010", "002", List.of(m2));

         Course c1 = new Course("CS 1010", List.of(s1, s2));

         Meeting m3 = new Meeting(DayOfWeek.MONDAY, LocalTime.of(13, 0), LocalTime.of(14, 0));
         Meeting m4 = new Meeting(DayOfWeek.TUESDAY, LocalTime.of(14, 0), LocalTime.of(15, 0));
         
         Section s3 = new Section("Math 2001", "001", List.of(m3));
         Section s4 = new Section("Math 2001", "002", List.of(m4));

         Course c2 = new Course("MATH 2001", List.of(s3, s4));

         List<ScheduleSolution> solutions = solver.solve(List.of(c1, c2), new Constraints(null, null, null, null), 5);
         for(int i = 1; i < solutions.size(); i++) {
             assertTrue(solutions.get(i-1).getScore() <= solutions.get(i).getScore()); // Solutions should be sorted by score in ascending order
         }  
    }

}
