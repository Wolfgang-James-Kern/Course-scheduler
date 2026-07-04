import { useId, useRef, type ReactNode } from "react";
import { useDialogFocusTrap } from "../hooks/useDialogFocusTrap.ts";
import styles from "./Drawer.module.css";

type DrawerProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Drawer({ title, subtitle, children, onClose }: DrawerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useDialogFocusTrap(layerRef, onClose);

  return (
    <div className={styles.layer} ref={layerRef} role="presentation">
      <button
        className={styles.backdrop}
        type="button"
        tabIndex={-1}
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Workspace</p>
            <h2 id={titleId}>{title}</h2>
            <p id={descriptionId}>{subtitle}</p>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close panel">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </header>
        <div className={styles.content}>{children}</div>
      </aside>
    </div>
  );
}
