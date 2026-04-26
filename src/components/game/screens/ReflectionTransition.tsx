import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileText, X, StickyNote } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePFGame } from "@/contexts/PFGameContext";
import { EVIDENCE } from "@/lib/pf-case/evidence-catalog";
import { ReportDocument } from "../ReportDocument";
import analystReflectingMaleImg from "@/assets/scenes/analyst-reflecting-male.webp";
import analystReflectingFemaleImg from "@/assets/scenes/analyst-reflecting-female.webp";

interface ReflectionTransitionProps {
  onComplete: () => void;
}

export const ReflectionTransition = ({ onComplete }: ReflectionTransitionProps) => {
  const { profile } = useAuth();
  const { state } = usePFGame();
  const [openReportId, setOpenReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"notes" | "reports">("notes");

  const bg =
    profile?.gender === "female"
      ? analystReflectingFemaleImg
      : analystReflectingMaleImg;

  const notes = state.notes || [];
  const reports = state.collectedReports
    .map((id) => EVIDENCE[id])
    .filter(Boolean);

  // Quick background reveal then snappy content build
  const BG_REVEAL = 0.35;
  const CARD_DELAY = BG_REVEAL + 0.05;
  const ITEMS_DELAY = CARD_DELAY + 0.15;

  return (
    <div className="fixed inset-0 overflow-hidden bg-background">
      {/* Background — quick fade, no scale to avoid layout repaint cost */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: BG_REVEAL, ease: "easeOut" }}
      >
        <img
          src={bg}
          alt="Analyst reviewing"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/30" />
      </motion.div>

      {/* Static ambient glow (no animation = no repaint) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      {/* Main panel */}
      <div className="relative z-10 flex h-full items-center justify-center px-3 py-3">
        <motion.div
          dir="rtl"
          className="flex w-full max-w-2xl flex-col rounded-2xl border border-primary/30 bg-card/90 p-4 shadow-[0_0_50px_hsl(var(--primary)/0.18)]"
          style={{ maxHeight: "calc(100vh - 1.5rem)", willChange: "transform, opacity" }}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.35,
            delay: CARD_DELAY,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Header */}
          <motion.div
            className="mb-3 text-right"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: CARD_DELAY + 0.05, duration: 0.25 }}
          >
            <motion.div
              className="mb-2 h-1 w-14 rounded-full bg-primary shadow-[0_0_14px_hsl(var(--primary)/0.8)]"
              initial={{ width: 0 }}
              animate={{ width: 56 }}
              transition={{ delay: CARD_DELAY + 0.1, duration: 0.35 }}
            />
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              راجع ما جمعته
            </h2>
            <p className="mt-1 text-xs leading-6 text-muted-foreground md:text-sm">
              راجع ملاحظاتك وتقاريرك قبل ما تكتب التقرير.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            className="mb-3 flex gap-2 rounded-xl border border-border/60 bg-background/40 p-1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: CARD_DELAY + 0.1, duration: 0.25 }}
          >
            <button
              onClick={() => setActiveTab("notes")}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors md:text-sm ${
                activeTab === "notes"
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "notes" && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-lg bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.5)]"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <StickyNote className="relative z-10 h-3.5 w-3.5" />
              <span className="relative z-10">الملاحظات</span>
              <span className="relative z-10 rounded-full bg-background/30 px-1.5 py-0.5 text-[10px]">
                {notes.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors md:text-sm ${
                activeTab === "reports"
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "reports" && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-lg bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.5)]"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <FileText className="relative z-10 h-3.5 w-3.5" />
              <span className="relative z-10">التقارير</span>
              <span className="relative z-10 rounded-full bg-background/30 px-1.5 py-0.5 text-[10px]">
                {reports.length}
              </span>
            </button>
          </motion.div>

          {/* Content area */}
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
            <AnimatePresence mode="wait">
              {activeTab === "notes" ? (
                <motion.div
                  key="notes"
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {notes.length === 0 ? (
                    <div className="col-span-full rounded-xl border border-border/60 bg-background/30 p-3 text-center text-xs text-muted-foreground">
                      مفيش ملاحظات محفوظة.
                    </div>
                  ) : (
                    notes.map((note, index) => (
                      <motion.div
                        key={`${note.id}-${index}`}
                        className="group rounded-xl border border-border/60 bg-background/45 p-2.5 text-right shadow-sm transition-colors hover:border-primary/50 hover:shadow-[0_0_16px_hsl(var(--primary)/0.18)]"
                        style={{ willChange: "transform, opacity" }}
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: ITEMS_DELAY + index * 0.05,
                          duration: 0.28,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 text-sm">✍️</span>
                          <p className="text-xs leading-6 text-foreground">{note.text}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="reports"
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {reports.length === 0 ? (
                    <div className="col-span-full rounded-xl border border-border/60 bg-background/30 p-3 text-center text-xs text-muted-foreground">
                      مفيش تقارير ظهرت.
                    </div>
                  ) : (
                    reports.map((report, index) => (
                      <motion.button
                        key={report.id}
                        onClick={() => setOpenReportId(report.id)}
                        className="group rounded-xl border border-border/60 bg-background/45 p-2.5 text-right shadow-sm transition-colors hover:border-primary/60 hover:bg-background/65 hover:shadow-[0_0_18px_hsl(var(--primary)/0.22)]"
                        style={{ willChange: "transform, opacity" }}
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: ITEMS_DELAY + index * 0.05,
                          duration: 0.28,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold leading-5 text-foreground line-clamp-2">
                              {report.title}
                            </p>
                            <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">
                              {report.issuer || "تقرير"}
                              {report.reportDate ? ` • ${report.reportDate}` : ""}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA */}
          <motion.button
            onClick={onComplete}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.01] active:scale-[0.98]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ITEMS_DELAY + 0.25, duration: 0.3 }}
          >
            ابدأ التقرير
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* Report modal */}
      <AnimatePresence>
        {openReportId && EVIDENCE[openReportId] && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpenReportId(null)}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenReportId(null)}
                className="absolute -left-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:bg-muted"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
              <ReportDocument evidence={EVIDENCE[openReportId]} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
