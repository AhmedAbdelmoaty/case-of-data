import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, FileText } from "lucide-react";

export type FlyKind = "note" | "report";

export interface FlyToNotebookDetail {
  fromX: number;
  fromY: number;
  kind: FlyKind;
}

interface FlyingItem extends FlyToNotebookDetail {
  id: number;
}

let nextId = 1;

/**
 * Dispatch a flying icon from a screen point toward the notebook button.
 * The notebook target is found via [data-notebook-target] selector.
 */
export const flyToNotebook = (detail: FlyToNotebookDetail) => {
  window.dispatchEvent(new CustomEvent("flyToNotebook", { detail }));
};

/** Convenience: dispatch from a DOM element's bounding box center. */
export const flyToNotebookFromEl = (el: HTMLElement | null, kind: FlyKind) => {
  if (!el) return;
  const r = el.getBoundingClientRect();
  flyToNotebook({
    fromX: r.left + r.width / 2,
    fromY: r.top + r.height / 2,
    kind,
  });
};

const getNotebookCenter = (): { x: number; y: number } | null => {
  const el = document.querySelector<HTMLElement>("[data-notebook-target]");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

export const FlyingItemsLayer = () => {
  const [items, setItems] = useState<FlyingItem[]>([]);

  useEffect(() => {
    const onFly = (e: Event) => {
      const detail = (e as CustomEvent<FlyToNotebookDetail>).detail;
      if (!detail) return;
      const id = nextId++;
      setItems((prev) => [...prev, { ...detail, id }]);
      // auto-cleanup after animation
      window.setTimeout(() => {
        setItems((prev) => prev.filter((it) => it.id !== id));
      }, 1100);
    };
    window.addEventListener("flyToNotebook", onFly);
    return () => window.removeEventListener("flyToNotebook", onFly);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
      <AnimatePresence>
        {items.map((item) => (
          <FlyingItem key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const FlyingItem = ({ item }: { item: FlyingItem }) => {
  const target = getNotebookCenter() ?? { x: window.innerWidth - 80, y: 80 };
  const dx = target.x - item.fromX;
  const dy = target.y - item.fromY;
  // arc: peak rises above the straight line
  const peakY = Math.min(item.fromY, target.y) - 80;

  const Icon = item.kind === "report" ? FileText : StickyNote;
  const color = item.kind === "report" ? "from-amber-400 to-orange-500" : "from-primary to-cyan-400";

  return (
    <motion.div
      className="absolute"
      style={{ left: item.fromX, top: item.fromY }}
      initial={{ x: 0, y: 0, scale: 0.4, rotate: 0, opacity: 0 }}
      animate={{
        x: [0, dx * 0.4, dx],
        y: [0, peakY - item.fromY, dy],
        scale: [0.6, 1.4, 0.5],
        rotate: [0, 180, 360],
        opacity: [0, 1, 0.9, 0],
      }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], times: [0, 0.05, 0.5, 1] }}
    >
      <div className={`relative -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-[0_0_24px_hsl(var(--primary)/0.6)]`}>
        <Icon className="h-5 w-5 text-white" />
        {/* trailing sparkles */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-white"
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 0, x: -10 - i * 6, y: 4 + i * 3 }}
            transition={{ duration: 0.6, delay: i * 0.08, repeat: Infinity, repeatDelay: 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
};
