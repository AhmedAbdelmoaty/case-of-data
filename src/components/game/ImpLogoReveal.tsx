import { motion } from "framer-motion";
import impLogo from "@/assets/brand/imp-logo.webp";

const sparks = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  x: ((index * 37) % 220) - 110,
  y: ((index * 53) % 130) - 65,
  delay: 0.12 + (index % 6) * 0.08,
}));

export const ImpLogoReveal = () => {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 bg-background/38 backdrop-blur-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.72] }}
        transition={{ duration: 1.1, times: [0, 0.35, 1] }}
      />

      <motion.div
        className="absolute left-1/2 top-[57vh] h-1 w-[48vw] max-w-[620px] origin-left -translate-x-1/2 -rotate-[18deg] overflow-hidden rounded-full bg-gradient-to-r from-transparent via-red-500/75 to-amber-300/90 shadow-[0_0_22px_rgba(239,68,68,0.45)]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 0.92], opacity: [0, 1, 0] }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          className="absolute inset-y-0 left-0 w-1/3 bg-white/80 blur-sm"
          animate={{ x: ["-120%", "360%"] }}
          transition={{ duration: 0.72, delay: 0.12, ease: "easeOut" }}
        />
      </motion.div>

      <div className="absolute left-1/2 top-[24vh] flex w-[min(520px,82vw)] -translate-x-1/2 items-center justify-center sm:top-[22vh]">
        {sparks.map((spark) => (
          <motion.span
            key={spark.id}
            className="absolute h-1.5 w-1.5 rounded-[2px] bg-amber-200 shadow-[0_0_12px_rgba(252,211,77,0.85)]"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.35, rotate: 0 }}
            animate={{
              x: spark.x,
              y: spark.y,
              opacity: [0, 1, 0],
              scale: [0.35, 1.25, 0.2],
              rotate: 180,
            }}
            transition={{ duration: 1.25, delay: spark.delay, ease: "easeOut" }}
          />
        ))}

        <motion.div
          className="absolute h-[118%] w-[118%] rounded-full border border-red-300/30"
          initial={{ opacity: 0, scale: 0.42, rotate: -12 }}
          animate={{ opacity: [0, 0.95, 0], scale: [0.42, 1.18, 1.34], rotate: 12 }}
          transition={{ duration: 1.55, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.div
          className="relative w-full overflow-hidden rounded-[34px] border border-white/45 bg-white/95 px-5 py-4 shadow-[0_22px_80px_rgba(0,0,0,0.42),0_0_42px_rgba(185,28,28,0.46)] sm:px-7 sm:py-5"
          initial={{ opacity: 0, scale: 0.28, y: 36, rotate: -7, filter: "blur(10px)" }}
          animate={{
            opacity: 1,
            scale: [0.28, 1.13, 0.98, 1],
            y: [36, -7, 2, 0],
            rotate: [-7, 2.5, -1, 0],
            filter: "blur(0px)",
          }}
          exit={{ opacity: 0, scale: 0.9, y: -12, filter: "blur(6px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute -inset-y-8 -left-16 w-20 rotate-12 bg-white/70 blur-md"
            initial={{ x: "-40%" }}
            animate={{ x: ["-40%", "760%"] }}
            transition={{ duration: 0.92, delay: 0.42, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-[34px] border-2 border-red-700/0"
            animate={{
              borderColor: [
                "rgba(185,28,28,0)",
                "rgba(185,28,28,0.58)",
                "rgba(185,28,28,0.08)",
              ],
              boxShadow: [
                "0 0 0 rgba(185,28,28,0)",
                "0 0 34px rgba(185,28,28,0.42)",
                "0 0 12px rgba(185,28,28,0.16)",
              ],
            }}
            transition={{ duration: 1.4, delay: 0.18 }}
          />
          <img
            src={impLogo}
            alt=""
            className="relative z-10 h-auto w-full select-none object-contain"
            draggable={false}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
