"use client";

import { useEffect, useRef, useState } from "react";

export function useTimeOnTask(active = true) {
  const startedAt = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!active) return;
    startedAt.current = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000);
      elapsedRef.current = elapsed;
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => {
      window.clearInterval(interval);
      if (startedAt.current) {
        elapsedRef.current = Math.floor((Date.now() - startedAt.current) / 1000);
      }
    };
  }, [active]);

  return { elapsedSeconds, getElapsedSeconds: () => elapsedRef.current };
}
