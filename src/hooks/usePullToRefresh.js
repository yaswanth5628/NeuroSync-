import { useEffect, useRef, useState } from "react";

/**
 * Lightweight pull-to-refresh for touch devices.
 * Attaches to the app's scroll container (the <main> element) and triggers
 * `onRefresh` when the user pulls down past `threshold` while scrolled to the
 * top. Returns the current pull distance and refreshing flag for rendering
 * an indicator. No-op on desktop (no touch events).
 */
export function usePullToRefresh(onRefresh, { threshold = 70, max = 100 } = {}) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const pullRef = useRef(0);
  const cbRef = useRef(onRefresh);
  cbRef.current = onRefresh;
  const refreshingRef = useRef(false);
  refreshingRef.current = refreshing;

  useEffect(() => {
    const scroller = document.querySelector("main");
    if (!scroller) return;

    const onTouchStart = (e) => {
      if (scroller.scrollTop <= 0 && !refreshingRef.current) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      } else {
        pulling.current = false;
      }
    };

    const onTouchMove = (e) => {
      if (!pulling.current) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0 && scroller.scrollTop <= 0) {
        const resisted = Math.min(dy * 0.5, max);
        pullRef.current = resisted;
        setPull(resisted);
        if (dy > 6 && e.cancelable) e.preventDefault();
      }
    };

    const onTouchEnd = async () => {
      if (!pulling.current) {
        setPull(0);
        pullRef.current = 0;
        return;
      }
      pulling.current = false;
      const triggered = pullRef.current >= threshold;
      pullRef.current = 0;
      if (triggered) {
        setRefreshing(true);
        setPull(0);
        try {
          await cbRef.current?.();
        } finally {
          setRefreshing(false);
        }
      } else {
        setPull(0);
      }
    };

    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("touchend", onTouchEnd);
    };
  }, [threshold, max]);

  return { pull, refreshing };
}