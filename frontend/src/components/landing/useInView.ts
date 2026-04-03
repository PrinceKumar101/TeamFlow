import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element = HTMLElement>(threshold = 0.15) {
  const [inView, setInView] = useState(false);
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const ref = (el: T | null) => {
    elementRef.current = el;
  };

  return { ref, inView };
}
