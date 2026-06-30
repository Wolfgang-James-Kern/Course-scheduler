import type { ComponentCompatibilityIn, ComponentType, CourseIn } from "../types.ts";
import styles from "./CompatibilityEditor.module.css";

type ComponentPair = {
  first: ComponentType;
  second: ComponentType;
};

type CompatibilityEditorProps = {
  course: CourseIn;
  onChange: (compatibilities: ComponentCompatibilityIn[]) => void;
};

export default function CompatibilityEditor({ course, onChange }: CompatibilityEditorProps) {
  const pairs = componentPairs(course);
  const availablePairs = pairs.filter((pair) => !course.compatibilities.some((rule) => samePair(rule, pair)));

  function addRule(pair: ComponentPair) {
    const first = course.components.find((component) => component.type === pair.first);
    const second = course.components.find((component) => component.type === pair.second);
    if (!first || !second) {
      return;
    }
    onChange([...course.compatibilities, {
      firstComponent: pair.first,
      secondComponent: pair.second,
      allowedPairs: first.sections.flatMap((firstSection) => second.sections.map((secondSection) => ({
        firstSectionId: firstSection.id,
        secondSectionId: secondSection.id,
      }))),
    }]);
  }

  function togglePair(ruleIndex: number, firstSectionId: string, secondSectionId: string) {
    const rule = course.compatibilities[ruleIndex];
    const allowed = rule.allowedPairs.some((pair) => (
      pair.firstSectionId === firstSectionId && pair.secondSectionId === secondSectionId
    ));
    const allowedPairs = allowed
      ? rule.allowedPairs.filter((pair) => !(
        pair.firstSectionId === firstSectionId && pair.secondSectionId === secondSectionId
      ))
      : [...rule.allowedPairs, { firstSectionId, secondSectionId }];
    onChange(course.compatibilities.map((compatibility, index) => (
      index === ruleIndex ? { ...compatibility, allowedPairs } : compatibility
    )));
  }

  return (
    <section className={styles.editor}>
      <div className={styles.heading}>
        <div>
          <h3>Section compatibility</h3>
          <p>Restrict which component sections can be registered together.</p>
        </div>
      </div>

      {course.compatibilities.length === 0 && (
        <p className={styles.unrestricted}>All component section combinations are currently allowed.</p>
      )}

      {course.compatibilities.map((rule, ruleIndex) => {
        const first = course.components.find((component) => component.type === rule.firstComponent);
        const second = course.components.find((component) => component.type === rule.secondComponent);
        if (!first || !second) {
          return null;
        }
        return (
          <article className={styles.rule} key={`${rule.firstComponent}-${rule.secondComponent}`}>
            <div className={styles.ruleHeading}>
              <strong>{rule.firstComponent} and {rule.secondComponent}</strong>
              <button onClick={() => onChange(course.compatibilities.filter((_, index) => index !== ruleIndex))}>
                Allow all combinations
              </button>
            </div>
            <div className={styles.matrixViewport}>
              <table>
                <thead>
                  <tr>
                    <th>{rule.firstComponent}</th>
                    {second.sections.map((section) => <th key={section.id}>{rule.secondComponent} {section.id}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {first.sections.map((firstSection) => (
                    <tr key={firstSection.id}>
                      <th>{rule.firstComponent} {firstSection.id}</th>
                      {second.sections.map((secondSection) => {
                        const checked = rule.allowedPairs.some((pair) => (
                          pair.firstSectionId === firstSection.id && pair.secondSectionId === secondSection.id
                        ));
                        return (
                          <td key={secondSection.id}>
                            <input
                              type="checkbox"
                              checked={checked}
                              aria-label={`${firstSection.id} compatible with ${secondSection.id}`}
                              onChange={() => togglePair(ruleIndex, firstSection.id, secondSection.id)}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rule.allowedPairs.length === 0 && (
              <p className={styles.warning}>No combinations are allowed, so this course cannot produce a schedule.</p>
            )}
          </article>
        );
      })}

      {availablePairs.length > 0 && (
        <div className={styles.addRules}>
          {availablePairs.map((pair) => (
            <button key={`${pair.first}-${pair.second}`} onClick={() => addRule(pair)}>
              Configure {pair.first} and {pair.second}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function componentPairs(course: CourseIn): ComponentPair[] {
  const pairs: ComponentPair[] = [];
  for (let first = 0; first < course.components.length; first += 1) {
    for (let second = first + 1; second < course.components.length; second += 1) {
      if (course.components[first].sections.length > 0 && course.components[second].sections.length > 0) {
        pairs.push({ first: course.components[first].type, second: course.components[second].type });
      }
    }
  }
  return pairs;
}

function samePair(rule: ComponentCompatibilityIn, pair: ComponentPair): boolean {
  return rule.firstComponent === pair.first && rule.secondComponent === pair.second
    || rule.firstComponent === pair.second && rule.secondComponent === pair.first;
}
