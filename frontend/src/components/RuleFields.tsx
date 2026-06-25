import { DAYS, formatDay } from "../constants.ts";
import type { Day, RuleConfiguration } from "../types.ts";
import styles from "./RuleDrawer.module.css";

type RuleFieldsProps = {
  rule: RuleConfiguration;
  onChange: (rule: RuleConfiguration) => void;
};

const MINUTE_RULE_LABELS = {
  MAXIMUM_GAP: "Maximum gap between classes",
  MAXIMUM_CONTINUOUS_BLOCK: "Maximum consecutive class time",
  MINIMUM_DAY_LENGTH: "Minimum class-day span",
  MAXIMUM_DAILY_SPAN: "Maximum daily span",
  MAXIMUM_WEEKLY_GAP: "Maximum total weekly gap",
} as const;

const HOUR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const MINUTE_OPTIONS = [0, 15, 30, 45];

export default function RuleFields({ rule, onChange }: RuleFieldsProps) {
  switch (rule.type) {
    case "EARLIEST_START":
    case "LATEST_END":
      return (
        <label className={styles.field}>
          <span>{rule.type === "EARLIEST_START" ? "Start no earlier than" : "End no later than"}</span>
          <input type="time" value={rule.time} onChange={(event) => onChange({ ...rule, time: event.target.value })} />
        </label>
      );
    case "MAXIMUM_GAP":
    case "MAXIMUM_CONTINUOUS_BLOCK":
    case "MINIMUM_DAY_LENGTH":
    case "MAXIMUM_DAILY_SPAN":
    case "MAXIMUM_WEEKLY_GAP":
      return minuteFields(rule as DurationMinuteRule, onChange);
    case "MAXIMUM_MEETINGS_PER_DAY":
    case "MAXIMUM_CAMPUS_DAYS":
      return (
        <label className={styles.field}>
          <span>{rule.type === "MAXIMUM_CAMPUS_DAYS" ? "Maximum campus days" : "Maximum meetings in one day"}</span>
          <input
            type="number"
            min="1"
            max={rule.type === "MAXIMUM_CAMPUS_DAYS" ? "5" : "12"}
            value={rule.count}
            onChange={(event) => onChange({ ...rule, count: Number(event.target.value) })}
          />
        </label>
      );
    case "BLOCKED_TIME":
      return (
        <div className={styles.blockedFields}>
          <label className={styles.field}>
            <span>Day</span>
            <select value={rule.day} onChange={(event) => onChange({ ...rule, day: event.target.value as Day })}>
              {DAYS.map((day) => (
                <option key={day} value={day}>{formatDay(day)}</option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>From</span>
            <input type="time" value={rule.startTime} onChange={(event) => onChange({ ...rule, startTime: event.target.value })} />
          </label>
          <label className={styles.field}>
            <span>Until</span>
            <input type="time" value={rule.endTime} onChange={(event) => onChange({ ...rule, endTime: event.target.value })} />
          </label>
        </div>
      );
    case "DAYS_OFF":
      return (
        <fieldset className={styles.dayPicker}>
          <legend>Preferred days off</legend>
          {DAYS.map((day) => {
            const checked = rule.days.includes(day);
            return (
              <label key={day}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange({
                    ...rule,
                    days: checked ? rule.days.filter((value) => value !== day) : [...rule.days, day],
                  })}
                />
                {formatDay(day, "short")}
              </label>
            );
          })}
        </fieldset>
      );
    case "BALANCE_WORKLOAD":
      return (
        <label className={styles.field}>
          <span>Maximum difference in daily class hours</span>
          <input
            type="number"
            min="0"
            max="12"
            step="1"
            value={rule.minutes / 60}
            onChange={(event) => onChange({ ...rule, minutes: Number(event.target.value) * 60 })}
          />
        </label>
      );
    case "AVOID_SINGLE_MEETING_DAYS":
      return <p className={styles.automaticSetting}>This rule automatically counts days containing exactly one meeting.</p>;
    case "OCCASIONAL_MEETINGS_AT_DAY_EDGES":
      return <p className={styles.automaticSetting}>This rule automatically detects occasional meetings positioned between regular classes.</p>;
    case "CLUSTER_CAMPUS_DAYS":
      return <p className={styles.automaticSetting}>This rule automatically evaluates empty weekdays between campus days.</p>;
  }
}

type RuleConfigurationBase = {
  mode: RuleConfiguration["mode"];
  importance: number;
};

type DurationMinuteRule = RuleConfigurationBase & {
  type: keyof typeof MINUTE_RULE_LABELS;
  minutes: number;
};

function minuteFields(
  rule: DurationMinuteRule,
  onChange: (rule: RuleConfiguration) => void,
) {
  const hours = Math.floor(rule.minutes / 60);
  const minutes = rule.minutes % 60;
  const minTotal = rule.type === "MAXIMUM_GAP" || rule.type === "MAXIMUM_WEEKLY_GAP" ? 0 : 15;

  function writeMinutes(nextHours: number, nextMinutes: number) {
    const total = Math.max(minTotal, nextHours * 60 + nextMinutes);
    onChange({ ...rule, minutes: total });
  }

  return (
    <div className={styles.durationFields}>
      <span className={styles.durationLabel}>{MINUTE_RULE_LABELS[rule.type]}</span>
      <div className={styles.durationInputs}>
        <label className={styles.durationPart}>
          <span className={styles.srOnly}>Hours</span>
          <select
            aria-label="Hours"
            value={hours}
            onChange={(event) => writeMinutes(Number(event.target.value), minutes)}
          >
            {HOUR_OPTIONS.map((value) => (
              <option key={value} value={value}>{value} hr</option>
            ))}
          </select>
        </label>
        <label className={styles.durationPart}>
          <span className={styles.srOnly}>Minutes</span>
          <select
            aria-label="Minutes"
            value={minutes}
            onChange={(event) => writeMinutes(hours, Number(event.target.value))}
          >
            {!MINUTE_OPTIONS.includes(minutes) && (
              <option value={minutes}>{minutes} min</option>
            )}
            {MINUTE_OPTIONS.map((value) => (
              <option key={value} value={value}>{value} min</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
