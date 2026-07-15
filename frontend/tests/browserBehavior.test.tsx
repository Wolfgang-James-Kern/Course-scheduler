import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { JSDOM } from "jsdom";
import React from "react";
import { useRef, useState } from "react";
import { validateRule } from "../src/ruleCatalog.ts";
import { useDialogFocusTrap } from "../src/hooks/useDialogFocusTrap.ts";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });
const browserGlobals = {
  window: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  HTMLElement: dom.window.HTMLElement,
  KeyboardEvent: dom.window.KeyboardEvent,
  Node: dom.window.Node,
  MutationObserver: dom.window.MutationObserver,
  getComputedStyle: dom.window.getComputedStyle,
  IS_REACT_ACT_ENVIRONMENT: true,
};
Object.entries(browserGlobals).forEach(([name, value]) => {
  Object.defineProperty(globalThis, name, { configurable: true, value, writable: true });
});

const { cleanup, render, screen } = await import("@testing-library/react");
const userEvent = (await import("@testing-library/user-event")).default;

afterEach(() => cleanup());

test("dialog focus is trapped, Escape closes it, and focus returns to its opener", async () => {
  const user = userEvent.setup({ document: dom.window.document });
  render(<DialogHarness />);
  const opener = screen.getByRole("button", { name: "Open dialog" });

  await user.click(opener);

  const first = screen.getByRole("button", { name: "First action" });
  const last = screen.getByRole("button", { name: "Last action" });
  assert.equal(document.activeElement, first);
  last.focus();
  await user.tab();
  assert.equal(document.activeElement, first);

  await user.keyboard("{Escape}");

  assert.equal(screen.queryByRole("dialog"), null);
  assert.equal(document.activeElement, opener);
});

test("rule validation rejects impossible clock values and invalid ranges", () => {
  assert.equal(validateRule({
    type: "EARLIEST_START",
    mode: "HARD",
    importance: 1,
    time: "25:00",
  }), "Earliest start needs a valid time.");
  assert.equal(validateRule({
    type: "BLOCKED_TIME",
    mode: "HARD",
    importance: 1,
    day: "MONDAY",
    startTime: "12:00",
    endTime: "11:00",
  }), "Blocked time needs a day and a valid time range.");
});

function DialogHarness() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      {open && <TestDialog onClose={() => setOpen(false)} />}
    </div>
  );
}

function TestDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLElement>(null);
  useDialogFocusTrap(ref, onClose);
  return (
    <aside ref={ref} role="dialog" tabIndex={-1}>
      <button>First action</button>
      <button>Last action</button>
    </aside>
  );
}
