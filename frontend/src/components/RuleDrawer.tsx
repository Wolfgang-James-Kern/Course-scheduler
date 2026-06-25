import { useMemo, useState } from "react";
import { getRuleDefinition, RULE_CATALOG } from "../ruleCatalog.ts";
import type { RuleConfiguration, RuleType } from "../types.ts";
import RuleFields from "./RuleFields.tsx";
import styles from "./RuleDrawer.module.css";

type RuleDrawerProps = {
  rules: RuleConfiguration[];
  onChange: (rules: RuleConfiguration[]) => void;
};

export default function RuleDrawer({ rules, onChange }: RuleDrawerProps) {
  const availableEntries = useMemo(() => RULE_CATALOG.filter((entry) => (
    entry.type === "BLOCKED_TIME" || !rules.some((rule) => rule.type === entry.type)
  )), [rules]);
  const [selectedType, setSelectedType] = useState<RuleType | null>(null);
  const [expandedRuleIndex, setExpandedRuleIndex] = useState<number | null>(
    () => (rules.length > 0 ? 0 : null),
  );

  const effectiveSelectedType = availableEntries.some((entry) => entry.type === selectedType)
    ? selectedType as RuleType
    : (availableEntries[0]?.type ?? "BLOCKED_TIME");
  const effectiveExpandedIndex = expandedRuleIndex !== null && expandedRuleIndex < rules.length
    ? expandedRuleIndex
    : null;

  function updateRule(index: number, nextRule: RuleConfiguration) {
    onChange(rules.map((rule, ruleIndex) => ruleIndex === index ? nextRule : rule));
  }

  function addRule() {
    const entry = RULE_CATALOG.find((candidate) => candidate.type === effectiveSelectedType) ?? availableEntries[0];
    if (!entry) {
      return;
    }
    onChange([...rules, entry.create()]);
    setExpandedRuleIndex(rules.length);
    const remaining = availableEntries.filter((candidate) => (
      candidate.type !== entry.type || candidate.type === "BLOCKED_TIME"
    ));
    setSelectedType(remaining[0]?.type ?? "BLOCKED_TIME");
  }

  function removeRule(index: number) {
    onChange(rules.filter((_, ruleIndex) => ruleIndex !== index));
    setExpandedRuleIndex((current) => {
      if (current === null) {
        return null;
      }
      if (current === index) {
        return null;
      }
      return current > index ? current - 1 : current;
    });
  }

  return (
    <div className={styles.ruleEditor}>
      <div className={styles.addRule}>
        <label>
          <span>Add a built-in rule</span>
          <select
            value={effectiveSelectedType}
            onChange={(event) => setSelectedType(event.target.value as RuleType)}
          >
            {availableEntries.map((entry) => (
              <option value={entry.type} key={entry.type}>{entry.scope} · {entry.name}</option>
            ))}
          </select>
        </label>
        <button onClick={addRule} disabled={availableEntries.length === 0}>Add</button>
      </div>

      {rules.length === 0 && (
        <div className={styles.emptyState}>
          <strong>No rules selected.</strong>
          <span>Schedules will be ranked equally until you add preferences.</span>
        </div>
      )}

      <div className={styles.ruleList}>
        {rules.map((rule, index) => {
          const entry = getRuleDefinition(rule.type);
          const expanded = effectiveExpandedIndex === index;
          return (
            <article className={styles.ruleCard} key={`${rule.type}-${index}`}>
              <div className={styles.cardHeader}>
                <button
                  type="button"
                  className={styles.cardToggle}
                  aria-expanded={expanded}
                  onClick={() => setExpandedRuleIndex((current) => current === index ? null : index)}
                >
                  <span className={styles.scope}>{entry.scope}</span>
                  <h3>{entry.name}</h3>
                  {!expanded && (
                    <span className={styles.modeBadge}>
                      {rule.mode === "HARD" ? "Required" : "Preference"}
                    </span>
                  )}
                  {expanded && <p>{entry.description}</p>}
                </button>
                <button aria-label={`Remove ${entry.name}`} onClick={() => removeRule(index)}>×</button>
              </div>

              {expanded && (
                <>
                  <div className={styles.modeControl}>
                    <button
                      className={rule.mode === "PREFERENCE" ? styles.activeMode : ""}
                      aria-pressed={rule.mode === "PREFERENCE"}
                      onClick={() => updateRule(index, { ...rule, mode: "PREFERENCE" })}
                    >
                      Preference
                    </button>
                    <button
                      className={rule.mode === "HARD" ? styles.activeMode : ""}
                      aria-pressed={rule.mode === "HARD"}
                      onClick={() => updateRule(index, { ...rule, mode: "HARD" })}
                    >
                      Required
                    </button>
                  </div>

                  <RuleFields rule={rule} onChange={(nextRule) => updateRule(index, nextRule)} />

                  {rule.mode === "PREFERENCE" ? (
                    <label className={styles.importance}>
                      <span>Importance</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={rule.importance}
                        onChange={(event) => updateRule(index, { ...rule, importance: Number(event.target.value) })}
                      />
                      <strong>{["", "Low", "Moderate", "High", "Very high", "Critical"][rule.importance]}</strong>
                    </label>
                  ) : (
                    <p className={styles.requirementNote}>Schedules that violate this rule will be excluded.</p>
                  )}
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
