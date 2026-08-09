import { useEffect, useState } from "react";

export default function AnimatedCounter({ value, duration = 1000, suffix = "" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!value) {
      setDisplay(0);
      return;
    }
    const start = performance.now();
    const startVal = 0;
    let raf;
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + (value - startVal) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display}{suffix}</>;
}