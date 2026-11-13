"use client";

import { useSyncExternalStore } from "react";

/** Network Information API: Chromium only; Safari and Firefox never report data saver. */
type Connection = EventTarget & { saveData?: boolean };

function connection() {
  return (navigator as Navigator & { connection?: Connection }).connection;
}

function subscribe(onChange: () => void) {
  const c = connection();
  c?.addEventListener("change", onChange);
  return () => c?.removeEventListener("change", onChange);
}

/** True when the user has asked the browser or OS to use less data. */
export function useSaveData() {
  return useSyncExternalStore(subscribe, () => connection()?.saveData === true, () => false);
}
