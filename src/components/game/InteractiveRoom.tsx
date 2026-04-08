import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSoundEffects";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  icon?: string;
  glowColor?: string;
}

interface InteractiveRoomProps {
  backgroundImage: string;
  hotspots: Hotspot[];
  onHotspotClick: (hotspotId: string) => void;
  activeHotspot: string | null;
  children?: ReactNode;
  overlayContent?: ReactNode;
  onCloseOverlay?: () => void;
}

export const InteractiveRoom = ({
  backgroundImage,
  hotspots,
  onHotspotClick,
  activeHotspot,
  children,
  overlayContent,
  onCloseOverlay,
}: InteractiveRoomProps) => {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const { playSound } = useSound();

  const handleHotspotClick = (hotspotId: string) => {
    playSound("click");
    onHotspotClick(hotspotId);
  };

  const handleHover = (hotspotId: string) => {
    setHoveredHotspot(hotspotId);
    playSound("hover");
  };

  const handleCloseOverlay = () => {
    playSound("click");
    onCloseOverlay?.();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <motion.img
        src={backgroundImage}
        alt="Room"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <motion.button
          key={hotspot.id}
          className="absolute cursor-pointer group"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          onClick={() => handleHotspotClick(hotspot.id)}
          onMouseEnter={() => handleHover(hotspot.id)}
          onMouseLeave={() => setHoveredHotspot(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Pulsing indicator */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary/60"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.6, 0.15, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Icon */}
          {hotspot.icon && (
            <motion.span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              animate={{
                y: hoveredHotspot === hotspot.id ? -5 : 0,
              }}
            >
              {hotspot.icon}
            </motion.span>
          )}

          {/* Label tooltip */}
          <AnimatePresence>
            {hoveredHotspot === hotspot.id && (
              <motion.div
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-background/95 border border-primary/50 rounded-lg whitespace-nowrap z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
                }}
              >
                <span className="text-primary font-bold text-sm">
                  {hotspot.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      ))}

      {/* Additional children (like navigation buttons) */}
      {children}

      {/* Content Overlay */}
      <AnimatePresence>
        {overlayContent && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseOverlay}
            />

            {/* Content */}
            <motion.div
              className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-auto mx-4"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Close button - hidden if content has its own close */}
              {overlayContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
