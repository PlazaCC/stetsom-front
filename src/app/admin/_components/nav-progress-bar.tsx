"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef(pathname);

  function stopTick() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("http") || href.startsWith("#")) return;
      if (href === window.location.pathname) return;

      prevPathRef.current = pathname;
      setVisible(true);
      setWidth(12);
      stopTick();
      intervalRef.current = setInterval(() => {
        setWidth((w) => Math.min(w + Math.random() * 10, 82));
      }, 350);
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      stopTick();
    };
  }, [pathname]);

  useEffect(() => {
    if (!visible || pathname === prevPathRef.current) return;
    stopTick();
    setWidth(100);
    const t = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 250);
    return () => clearTimeout(t);
  }, [pathname, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nav-progress"
          className="pointer-events-none fixed top-0 left-0 z-[9999] h-[2px] bg-cms-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${width}%` }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  );
}
