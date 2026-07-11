import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { DAYS, DAY_LABELS } from "../constants.ts";
import type { Day, ScheduleOut } from "../types";
import { formatTime, toMinutes } from "../utils/time";
import styles from "./WeekGrid.module.css";

const ROW_MINUTES = 30;
const ROW_HEIGHT = 35;
const MOBILE_BREAKPOINT = 760;

type MeetingBlock = {
  courseCode: string;
  componentType: string;
  attendanceRequirement: string;
  meetingFrequency: string;
  sectionId: string;
  day: Day;
  startTime: string;
  endTime: string;
  lane: number;
  laneCount: number;
};

type GridVariables = CSSProperties & {
  "--row-height": string;
  "--grid-height": string;
};

type BlockStyle = CSSProperties;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function hashCourseCode(courseCode: string): number {
  let hash = 0;
  for (const character of courseCode) {
    hash = character.charCodeAt(0) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function courseColor(courseCode: string): string {
  return `hsl(${hashCourseCode(courseCode) % 360}, 48%, 88%)`;
}

function assignLanes(dayBlocks: Omit<MeetingBlock, "lane" | "laneCount">[]): MeetingBlock[] {
  const sorted = [...dayBlocks].sort((a, b) => {
    const startDiff = toMinutes(a.startTime) - toMinutes(b.startTime);
    if (startDiff !== 0) {
      return startDiff;
    }
    return toMinutes(b.endTime) - toMinutes(a.endTime);
  });

  const laneEnds: number[] = [];
  const placed = sorted.map((block) => {
    const start = toMinutes(block.startTime);
    const end = toMinutes(block.endTime);
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    return { ...block, lane, laneCount: 1 };
  });

  for (let index = 0; index < placed.length; index += 1) {
    const block = placed[index];
    const start = toMinutes(block.startTime);
    const end = toMinutes(block.endTime);
    let maxLane = block.lane;
    for (let otherIndex = 0; otherIndex < placed.length; otherIndex += 1) {
      if (otherIndex === index) {
        continue;
      }
      const other = placed[otherIndex];
      if (toMinutes(other.startTime) < end && toMinutes(other.endTime) > start) {
        maxLane = Math.max(maxLane, other.lane);
      }
    }
    block.laneCount = maxLane + 1;
  }

  // Expand laneCount to the cluster max so siblings in an overlap group share width.
  for (let index = 0; index < placed.length; index += 1) {
    const block = placed[index];
    const start = toMinutes(block.startTime);
    const end = toMinutes(block.endTime);
    let clusterMax = block.laneCount;
    for (const other of placed) {
      if (toMinutes(other.startTime) < end && toMinutes(other.endTime) > start) {
        clusterMax = Math.max(clusterMax, other.laneCount);
      }
    }
    block.laneCount = clusterMax;
  }

  return placed;
}

function useIsMobile(breakpoint: number): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

function DayColumn({
  day,
  dayIndex,
  blocks,
  dayStart,
  dayEnd,
}: {
  day: Day;
  dayIndex: number;
  blocks: MeetingBlock[];
  dayStart: number;
  dayEnd: number;
}) {
  return (
    <div className={`${styles.dayColumn} ${dayIndex % 2 === 1 ? styles.dayColumnAlt : ""}`} data-day={day}>
      {blocks.map((block) => {
        const start = clamp(toMinutes(block.startTime), dayStart, dayEnd);
        const end = clamp(toMinutes(block.endTime), dayStart, dayEnd);
        const top = ((start - dayStart) / ROW_MINUTES) * ROW_HEIGHT;
        const durationMinutes = end - start;
        const height = Math.max(18, (durationMinutes / ROW_MINUTES) * ROW_HEIGHT);
        const widthPercent = 100 / block.laneCount;
        const leftPercent = block.lane * widthPercent;
        const isCompact = durationMinutes <= 45 || height < 40;
        const isOptional = block.attendanceRequirement === "NON_MANDATORY";
        const isOccasional = block.meetingFrequency === "OCCASIONAL";
        const className = [
          styles.courseBlock,
          isCompact ? styles.compactBlock : "",
          isOptional ? styles.nonMandatoryBlock : "",
          isOccasional ? styles.occasionalBlock : "",
        ].filter(Boolean).join(" ");
        const style: BlockStyle = {
          top,
          height,
          left: `calc(${leftPercent}% + 4px)`,
          width: `calc(${widthPercent}% - 8px)`,
          background: courseColor(block.courseCode),
          zIndex: 2 + block.lane,
        };

        return (
          <article
            className={className}
            key={`${block.courseCode}-${block.sectionId}-${block.day}-${block.startTime}-${block.endTime}-${block.meetingFrequency}`}
            style={style}
            tabIndex={0}
            title={`${block.courseCode} ${block.componentType} ${block.sectionId}, ${formatTime(block.startTime)} to ${formatTime(block.endTime)}${isOptional ? ", attendance optional" : ""}${isOccasional ? ", occasional meeting" : ""}`}
          >
            <strong>{block.courseCode}</strong>
            {!isCompact && <span>{block.componentType} {block.sectionId}</span>}
            {!isCompact && <small>{formatTime(block.startTime)} – {formatTime(block.endTime)}</small>}
            {isCompact && (
              <small>{block.componentType} · {formatTime(block.startTime)}</small>
            )}
            {(isOptional || isOccasional) && (
              <div className={styles.blockBadges}>
                {isOptional && <em className={styles.optionalBadge}>Optional</em>}
                {isOccasional && <em className={styles.occasionalBadge}>Occasional</em>}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default function WeekGrid({ schedule }: { schedule: ScheduleOut }) {
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const blocksByDay = useMemo(() => {
    const raw = schedule.sections.flatMap((section) => section.meetings.map((meeting) => ({
      courseCode: section.courseCode,
      componentType: section.componentType,
      attendanceRequirement: section.attendanceRequirement,
      meetingFrequency: section.meetingFrequency,
      sectionId: section.id,
      ...meeting,
    })));

    const byDay = Object.fromEntries(DAYS.map((day) => [day, [] as MeetingBlock[]])) as Record<Day, MeetingBlock[]>;
    for (const day of DAYS) {
      byDay[day] = assignLanes(raw.filter((block) => block.day === day));
    }
    return byDay;
  }, [schedule]);

  const allBlocks = useMemo(() => DAYS.flatMap((day) => blocksByDay[day]), [blocksByDay]);

  const startTimes = allBlocks.map((block) => toMinutes(block.startTime));
  const endTimes = allBlocks.map((block) => toMinutes(block.endTime));
  const earliestMeeting = startTimes.length > 0 ? Math.min(...startTimes) : 8 * 60;
  const latestMeeting = endTimes.length > 0 ? Math.max(...endTimes) : 18 * 60;
  const dayStart = earliestMeeting < 8 * 60
    ? Math.max(0, Math.floor((earliestMeeting - 30) / ROW_MINUTES) * ROW_MINUTES)
    : 8 * 60;
  const dayEnd = latestMeeting > 18 * 60
    ? Math.min(24 * 60, Math.ceil((latestMeeting + 30) / ROW_MINUTES) * ROW_MINUTES)
    : 18 * 60;
  const rowCount = Math.max(1, (dayEnd - dayStart) / ROW_MINUTES);
  const gridHeight = rowCount * ROW_HEIGHT;
  const gridVariables: GridVariables = {
    "--row-height": `${ROW_HEIGHT}px`,
    "--grid-height": `${gridHeight}px`,
  };

  const visibleDays = isMobile ? [DAYS[activeDayIndex]] : DAYS;

  return (
    <div className={styles.viewport}>
      {isMobile && (
        <div className={styles.dayPager} aria-label="Day pager">
          <button
            type="button"
            aria-label="Previous day"
            disabled={activeDayIndex === 0}
            onClick={() => setActiveDayIndex((index) => Math.max(0, index - 1))}
          >
            ‹
          </button>
          <strong>{DAY_LABELS[DAYS[activeDayIndex]]}</strong>
          <button
            type="button"
            aria-label="Next day"
            disabled={activeDayIndex === DAYS.length - 1}
            onClick={() => setActiveDayIndex((index) => Math.min(DAYS.length - 1, index + 1))}
          >
            ›
          </button>
        </div>
      )}

      <div className={`${styles.week} ${isMobile ? styles.weekSingleDay : ""}`} style={gridVariables}>
        <div className={styles.headerCorner}>Time</div>
        {visibleDays.map((day) => (
          <div className={styles.dayHeader} key={day}>
            <span>{day.slice(0, 3)}</span>
            <strong>{DAY_LABELS[day]}</strong>
          </div>
        ))}

        <div className={styles.timeRail}>
          {Array.from({ length: rowCount }, (_, index) => dayStart + index * ROW_MINUTES).map((time) => (
            <div className={styles.timeLabel} key={time}>{formatTime(`${Math.floor(time / 60).toString().padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`)}</div>
          ))}
        </div>

        {visibleDays.map((day) => (
          <DayColumn
            key={day}
            day={day}
            dayIndex={DAYS.indexOf(day)}
            blocks={blocksByDay[day]}
            dayStart={dayStart}
            dayEnd={dayEnd}
          />
        ))}
      </div>
    </div>
  );
}
