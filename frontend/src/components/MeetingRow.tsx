import { DAYS, formatDay } from "../constants.ts";
import type { MeetingDraft } from "../courseEditorModel.ts";
import type { Day } from "../types.ts";
import styles from "./CourseDrawer.module.css";

type MeetingRowProps = {
  meeting: MeetingDraft;
  onChange: (meeting: MeetingDraft) => void;
  onRemove: () => void;
};

export default function MeetingRow({ meeting, onChange, onRemove }: MeetingRowProps) {
  return (
    <div className={styles.meetingRow}>
      <select
        aria-label="Meeting day"
        value={meeting.day}
        onChange={(event) => onChange({ ...meeting, day: event.target.value as Day })}
      >
        {DAYS.map((day) => (
          <option key={day} value={day}>{formatDay(day)}</option>
        ))}
      </select>
      <input
        aria-label="Start time"
        type="time"
        value={meeting.startTime}
        onChange={(event) => onChange({ ...meeting, startTime: event.target.value })}
      />
      <span>to</span>
      <input
        aria-label="End time"
        type="time"
        value={meeting.endTime}
        onChange={(event) => onChange({ ...meeting, endTime: event.target.value })}
      />
      <button
        className={styles.iconButton}
        aria-label="Remove meeting"
        onClick={onRemove}
      >
        &times;
      </button>
    </div>
  );
}
