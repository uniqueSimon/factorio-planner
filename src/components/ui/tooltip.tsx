import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipProps {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "bottom-left" | "bottom-right";
  delay?: number;
}

type Coords = { top: number; left: number };

export const Tooltip = ({ tooltip, children, position = "top", delay = 0 }: TooltipProps) => {
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [coords, setCoords] = React.useState<Coords>({ top: 0, left: 0 });

  const updatePosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    const tip = tooltipRef.current;
    if (!trigger || !tip) return;

    const rect = trigger.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    if (position === "top") {
      top = rect.top - gap - tipRect.height;
      left = rect.left + rect.width / 2 - tipRect.width / 2;
    } else if (position === "bottom") {
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - tipRect.width / 2;
    } else if (position === "bottom-left") {
      top = rect.bottom + gap;
      left = rect.left;
    } else if (position === "bottom-right") {
      top = rect.bottom + gap;
      left = rect.right - tipRect.width;
    }

    const padding = 4;
    const maxLeft = window.innerWidth - tipRect.width - padding;
    const maxTop = window.innerHeight - tipRect.height - padding;

    setCoords({
      top: Math.min(Math.max(top, padding), maxTop),
      left: Math.min(Math.max(left, padding), maxLeft),
    });
  }, [position]);

  React.useLayoutEffect(() => {
    if (!visible) return;
    updatePosition();
  }, [visible, tooltip, updatePosition]);

  React.useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    if (delay === 0) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [open, delay]);

  React.useEffect(() => {
    if (!visible) return;
    const onChange = () => updatePosition();

    // Capture scroll events from any scroll container (like the drawer)
    window.addEventListener("scroll", onChange, true);
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange, true);
      window.removeEventListener("resize", onChange);
    };
  }, [open, updatePosition]);

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </span>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={cn(
              "fixed w-max rounded-lg bg-gray-800 p-2 text-sm text-white shadow-lg z-[9999] pointer-events-none",
              "transition-opacity duration-100",
              visible ? "opacity-100" : "opacity-0"
            )}
            style={{ top: coords.top, left: coords.left }}
          >
            {tooltip}
          </div>,
          document.body
        )}
    </>
  );
};
