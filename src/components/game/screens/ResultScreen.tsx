import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { CaseOutcome } from "@/lib/pf-case/case-tree";
import femaleStrongMascot from "@/assets/results/result-mascot-female-strong.png";
import femaleMediumMascot from "@/assets/results/result-mascot-female-medium.png";
import femaleWeakMascot from "@/assets/results/result-mascot-female-weak.png";
import maleStrongMascot from "@/assets/results/result-mascot-male-strong.png";
import maleMediumMascot from "@/assets/results/result-mascot-male-medium.png";
import maleWeakMascot from "@/assets/results/result-mascot-male-weak.png";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

const RESULT_VIEW = {
  strong: {
    badge: "🎉 أداء ممتاز",
    title: { male: "برافو! سألت صح", female: "برافو! سألتي صح" },
    feedback: {
      male: "وصلت للصورة قبل ما تستعجل الحل. ده Problem Framing قوي.",
      female: "وصلتي للصورة قبل ما تستعجلي الحل. ده Problem Framing قوي.",
    },
    mascot: { male: maleStrongMascot, female: femaleStrongMascot },
    stars: 3,
    sound: "fanfare",
    page: "bg-[linear-gradient(135deg,#6ee7f9_0%,#d9f99d_45%,#fde68a_100%)]",
    stage: "border-[#fbbf24] bg-[#fffdf2]/92 shadow-[#f59e0b]/30",
    titleColor: "text-[#12524c]",
    badgeStyle: "border-[#f59e0b]/35 bg-white/75 text-[#8a4b00]",
    starOn: "bg-[#ffd447] text-[#7c3d00] shadow-[#f59e0b]/35",
    starOff: "bg-white/55 text-[#d9b56f]",
    button: "bg-[#12b981] text-white shadow-[#10b981]/35 hover:bg-[#0ea674]",
    chipOn: "bg-[#ecfccb] text-[#365314] border-[#84cc16]/45",
    chipOff: "bg-white/50 text-[#8a7a5b] border-white/70",
    confetti: ["#f59e0b", "#06b6d4", "#22c55e", "#ef4444", "#a855f7"],
  },
  medium: {
    badge: "✨ أداء جيد",
    title: { male: "حلّك ماشي صح", female: "حلّك ماشي صح" },
    feedback: {
      male: "أداؤك جيد، بس محتاج ترتب الأسئلة والاستنتاج بثقة أكتر.",
      female: "أداؤك جيد، بس محتاجة ترتبي الأسئلة والاستنتاج بثقة أكتر.",
    },
    mascot: { male: maleMediumMascot, female: femaleMediumMascot },
    stars: 2,
    sound: "successChime",
    page: "bg-[linear-gradient(135deg,#bae6fd_0%,#ede9fe_52%,#f8fafc_100%)]",
    stage: "border-[#93c5fd] bg-white/90 shadow-[#60a5fa]/25",
    titleColor: "text-[#233876]",
    badgeStyle: "border-[#8b5cf6]/25 bg-white/72 text-[#4c1d95]",
    starOn: "bg-[#facc15] text-[#713f12] shadow-[#facc15]/30",
    starOff: "bg-white/58 text-[#b8b4ca]",
    button: "bg-[#4f46e5] text-white shadow-[#6366f1]/35 hover:bg-[#4338ca]",
    chipOn: "bg-[#dbeafe] text-[#1e3a8a] border-[#60a5fa]/45",
    chipOff: "bg-white/52 text-[#74708a] border-white/70",
    confetti: ["#38bdf8", "#a78bfa", "#facc15", "#94a3b8", "#22c55e"],
  },
  weak: {
    badge: "💡 جرّب تاني",
    title: { male: "محتاج تسأل أذكى", female: "محتاجة تسألي أذكى" },
    feedback: {
      male: "ابدأ بأسئلة تفتح الصورة بدل ما تروح للحل بسرعة.",
      female: "ابدأي بأسئلة تفتح الصورة بدل ما تروحي للحل بسرعة.",
    },
    mascot: { male: maleWeakMascot, female: femaleWeakMascot },
    stars: 1,
    sound: "sparkle",
    page: "bg-[linear-gradient(135deg,#ffedd5_0%,#fef3c7_48%,#dcfce7_100%)]",
    stage: "border-[#fb923c] bg-[#fffaf0]/92 shadow-[#fb923c]/25",
    titleColor: "text-[#7c2d12]",
    badgeStyle: "border-[#fb923c]/30 bg-white/75 text-[#9a3412]",
    starOn: "bg-[#fb923c] text-white shadow-[#fb923c]/28",
    starOff: "bg-white/58 text-[#d8a77d]",
    button: "bg-[#f97316] text-white shadow-[#fb923c]/35 hover:bg-[#ea580c]",
    chipOn: "bg-[#ffedd5] text-[#9a3412] border-[#fb923c]/45",
    chipOff: "bg-white/52 text-[#9b765d] border-white/70",
    confetti: ["#fb923c", "#facc15", "#22c55e", "#38bdf8", "#f472b6"],
  },
} as const;

const chips = {
  male: ["🎯 اسأل صح", "🧩 افهم الصورة", "⚡ قرر بثقة"],
  female: ["🎯 اسألي صح", "🧩 افهمي الصورة", "⚡ قرري بثقة"],
} as const;

const helperCopy = {
  male: "كل محاولة بتقربك",
  female: "كل محاولة بتقربك",
} as const;

const replayCopy = {
  male: "العب مرة أخرى",
  female: "العبي مرة أخرى",
} as const;

const confettiPieces = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 23) % 98}%`,
  delay: (index % 10) * 0.09,
  duration: 2.8 + (index % 5) * 0.25,
  rotate: (index * 47) % 180,
  size: index % 3 === 0 ? "h-3 w-2" : index % 3 === 1 ? "h-2 w-2" : "h-2.5 w-1.5",
}));

export const ResultScreen = ({ onNavigate }: ResultScreenProps) => {
  const { state } = usePFGame();
  const { profile } = useAuth();
  const { playSound } = useSound();

  const playerName = profile?.first_name || profile?.display_name || "محلل";
  const playerGender = (profile?.gender || "male") as "male" | "female";
  const outcome = (state.outcome || "medium") as CaseOutcome;
  const view = RESULT_VIEW[outcome];
  const mascot = view.mascot[playerGender];
  const title = view.title[playerGender];
  const feedback = view.feedback[playerGender];
  const genderedChips = chips[playerGender];

  // Record completion once per game session
  const recordedRef = useRef(false);
  useEffect(() => {
    if (recordedRef.current) return;
    if (!profile?.first_name || !profile?.last_name) return;
    const key = "pf-game-submitted";
    if (localStorage.getItem(key)) return;
    recordedRef.current = true;
    localStorage.setItem(key, "1");

    const fullSpine =
      !state.trackEntered &&
      state.history.length >= 5 &&
      state.history.every((h) => h.choice === "correct");
    const qualified = fullSpine && (state.framingCorrectCount ?? 0) >= 2;
    const startedAt = state.gameStartedAt ?? Date.now();
    const duration_ms = Date.now() - startedAt;

    supabase
      .from("completed_players")
      .insert({
        first_name: profile.first_name,
        last_name: profile.last_name,
        qualified,
        outcome: state.outcome,
        framing_correct: state.framingCorrectCount,
        duration_ms,
        started_at: new Date(startedAt).toISOString(),
      })
      .then(({ error }) => {
        if (error) {
          localStorage.removeItem(key);
          console.warn("Failed to record completion:", error.message);
        }
      });
  }, [profile?.first_name, profile?.last_name, state]);

  const soundPlayedRef = useRef(false);
  useEffect(() => {
    if (soundPlayedRef.current) return;
    soundPlayedRef.current = true;
    playSound(view.sound);
    if (outcome === "strong") {
      const timer = window.setTimeout(() => playSound("confetti"), 460);
      return () => window.clearTimeout(timer);
    }
  }, [outcome, playSound, view.sound]);

  const litChipCount = useMemo(() => {
    if (outcome === "strong") return 3;
    if (outcome === "medium") return 2;
    return 1;
  }, [outcome]);

  return (
    <div className={cn("relative h-[100dvh] overflow-hidden text-[#172033]", view.page)} dir="rtl">
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(90deg,rgba(255,255,255,.32)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.28)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,.76),rgba(255,255,255,.2)_42%,transparent_68%)]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {outcome !== "weak" &&
          confettiPieces.map((piece) => (
            <motion.span
              key={piece.id}
              className={cn("absolute top-[-8%] rounded-sm", piece.size)}
              style={{
                left: piece.left,
                rotate: `${piece.rotate}deg`,
                backgroundColor: view.confetti[piece.id % view.confetti.length],
              }}
              initial={{ y: "-10vh", opacity: 0, scale: 0.8 }}
              animate={{ y: "112vh", opacity: [0, 1, 1, 0], scale: [0.7, 1, 0.95] }}
              transition={{
                delay: piece.delay,
                duration: piece.duration,
                repeat: outcome === "strong" ? Infinity : 0,
                repeatDelay: 1.6,
                ease: "linear",
              }}
            />
          ))}
      </div>

      <main className="relative z-10 flex h-full items-center justify-center px-3 py-3 sm:px-5 sm:py-4">
        <section
          className={cn(
            "grid h-full max-h-[820px] w-full max-w-6xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden border-4 p-3 shadow-2xl sm:p-5",
            view.stage
          )}
          style={{ borderRadius: "28px" }}
        >
          <motion.div
            className={cn(
              "mx-auto inline-flex h-11 items-center gap-2 rounded-2xl border px-5 text-sm font-black shadow-lg backdrop-blur-sm sm:h-12 sm:text-base",
              view.badgeStyle
            )}
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            dir="rtl"
          >
            <span>{view.badge}</span>
            <span className="h-5 w-px bg-current/20" />
            <span className="text-[#4b5563]">يا {playerName}</span>
          </motion.div>

          <div className="grid min-h-0 grid-cols-1 items-center gap-2 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
            <div className="relative flex min-h-0 items-center justify-center">
              <motion.div
                className="absolute bottom-[5%] h-[18%] w-[76%] max-w-[520px] bg-black/10 blur-2xl"
                style={{ borderRadius: "50%" }}
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.45, duration: 0.45 }}
              />
              <motion.img
                src={mascot}
                alt=""
                className="relative z-10 max-h-[min(52vh,520px)] w-auto max-w-[92%] object-contain drop-shadow-[0_28px_38px_rgba(15,23,42,.22)] sm:max-h-[min(60vh,560px)]"
                initial={{ opacity: 0, y: 42, scale: 0.74, rotate: outcome === "weak" ? -4 : 4 }}
                animate={{
                  opacity: 1,
                  y: outcome === "weak" ? 0 : [0, -7, 0],
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  opacity: { delay: 0.15, duration: 0.25 },
                  scale: { delay: 0.15, type: "spring", stiffness: 180, damping: 12 },
                  rotate: { delay: 0.15, duration: 0.42 },
                  y: { delay: 0.8, duration: 2.8, repeat: outcome === "weak" ? 0 : Infinity, ease: "easeInOut" },
                }}
              />
            </div>

            <div className="flex min-h-0 flex-col items-center justify-center text-center">
              <motion.div
                className="mb-2 flex items-center justify-center gap-2 sm:mb-3"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.16, delayChildren: 0.42 } },
                }}
              >
                {[0, 1, 2].map((index) => {
                  const earned = index < view.stars;
                  return (
                    <motion.div
                      key={index}
                      className={cn(
                        "flex h-[clamp(46px,7vw,82px)] w-[clamp(46px,7vw,82px)] items-center justify-center text-[clamp(1.8rem,4.8vw,3.9rem)] font-black shadow-xl",
                        earned ? view.starOn : view.starOff
                      )}
                      style={{
                        clipPath:
                          "polygon(50% 0%, 61% 34%, 98% 35%, 68% 56%, 79% 91%, 50% 70%, 21% 91%, 32% 56%, 2% 35%, 39% 34%)",
                      }}
                      variants={{
                        hidden: { opacity: 0, scale: 0.25, y: 18, rotate: -24 },
                        show: { opacity: 1, scale: 1, y: 0, rotate: 0 },
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 13 }}
                    >
                      ★
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.h1
                className={cn(
                  "max-w-[560px] text-balance text-[clamp(1.35rem,3.4vw,2.8rem)] font-black leading-[1.16]",
                  view.titleColor
                )}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.42 }}
              >
                {title}
              </motion.h1>

              <motion.p
                className="mt-2 max-w-[520px] text-balance text-[clamp(.95rem,1.8vw,1.25rem)] font-black leading-7 text-[#475569] sm:mt-3"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.88, duration: 0.38 }}
              >
                {feedback}
              </motion.p>

              <motion.div
                className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:mt-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.02, duration: 0.34 }}
              >
                {genderedChips.map((chip, index) => (
                  <span
                    key={chip}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full border px-3 text-xs font-black shadow-sm sm:h-10 sm:px-4 sm:text-sm",
                      index < litChipCount ? view.chipOn : view.chipOff
                    )}
                  >
                    {chip}
                  </span>
                ))}
              </motion.div>

              {outcome === "weak" && (
                <motion.div
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/65 px-4 py-2 text-sm font-black text-[#92400e] shadow-md sm:mt-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: [1, 1.04, 1] }}
                  transition={{
                    opacity: { delay: 1.12, duration: 0.3 },
                    scale: { delay: 1.3, duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  {helperCopy[playerGender]}
                </motion.div>
              )}
            </div>
          </div>

          <motion.div
            className="mx-auto flex w-full max-w-[360px] justify-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.12, duration: 0.35 }}
          >
            <motion.button
              onClick={() => onNavigate("company-briefing")}
              className={cn(
                "flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-base font-black shadow-xl outline-none ring-offset-2 transition-transform focus-visible:ring-2 focus-visible:ring-slate-900 sm:h-14",
                view.button
              )}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <RotateCcw className="h-5 w-5" />
              {replayCopy[playerGender]}
            </motion.button>
          </motion.div>
        </section>
      </main>
    </div>
  );
};
