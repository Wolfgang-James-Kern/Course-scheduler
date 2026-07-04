import { useEffect, useRef, type RefObject } from "react";

export function useDialogFocusTrap(
  dialogRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    if (!dialog) {
      return undefined;
    }
    const activeDialog: HTMLElement = dialog;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inertTargets: HTMLElement[] = [];
    let node: HTMLElement | null = activeDialog;
    while (node !== null && node !== document.body) {
      const parent: HTMLElement | null = node.parentElement;
      if (parent === null) {
        break;
      }
      for (const sibling of Array.from(parent.children)) {
        if (sibling !== node && sibling instanceof HTMLElement && !sibling.contains(activeDialog)) {
          sibling.inert = true;
          inertTargets.push(sibling);
        }
      }
      node = parent;
    }

    function focusFirst() {
      const dialog = activeDialog.getAttribute("role") === "dialog"
        ? activeDialog
        : activeDialog.querySelector<HTMLElement>('[role="dialog"]');
      const focusRoot = dialog ?? activeDialog;
      const elements = getFocusableElements(focusRoot);
      (elements[0] ?? focusRoot).focus();
    }
    focusFirst();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const elements = getFocusableElements(activeDialog);
      if (elements.length === 0) {
        event.preventDefault();
        activeDialog.focus();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const observer = new MutationObserver(() => {
      if (!activeDialog.contains(document.activeElement)) {
        focusFirst();
      }
    });
    observer.observe(activeDialog, { childList: true, subtree: true });

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
      document.body.style.overflow = previousOverflow;
      for (const target of inertTargets) {
        target.inert = false;
      }
      previousFocus?.focus();
    };
  }, [dialogRef]);
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(
    "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
  )).filter((element) => {
    if (element.tabIndex < 0) {
      return false;
    }
    if (element.getAttribute("aria-hidden") === "true" || element.closest("[inert]")) {
      return false;
    }
    if (element.closest("fieldset[disabled]")) {
      return false;
    }
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}
