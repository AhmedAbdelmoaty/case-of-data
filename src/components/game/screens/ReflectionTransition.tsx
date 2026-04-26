import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileText, X } from "lucide-react";
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

  const bg =
    profile?.gender === "female"
      ? analystReflectingFemaleImg
      : analystReflectingMaleImg;

  const notes = state.notes || [];

  const reports = state.collectedReports
    .map((id) => EVIDENCE[id])
    .filter(Boolean);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <img
          src={bg}
          alt="Analyst reviewing"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/45 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-transparent to-background/35" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <motion.div
          dir="rtl"
          className="w-full max-w-xl rounded-3xl border border-primary/25 bg-card/75 p-5 shadow-[0_0_35px_hsl(var(--primary)/0.14)] backdrop-blur-sm md:p-6"
          initial={{ opacity: 0, y: 34, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Header */}
          <motion.div
            className="mb-5 border-b border-border/70 pb-4 text-right"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <div className="mb-2 h-1 w-16 rounded-full bg-primary shadow-[0_0_14px_hsl(var(--primary)/0.75)]" />

            <h2 className="text-2xl font-bold text-foreground">
              راجع ما جمعته
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              قبل ما تكتب تقريرك، راجع الملاحظات والتقارير اللي ظهرت لك أثناء المقابلة.
            </p>
          </motion.div>

          {/* Notes */}
          <motion.section
            className="mb-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">🧠</span>
              <h3 className="text-sm font-bold text-foreground">
                الملاحظات
              </h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {notes.length}
              </span>
            </div>

            <div className="space-y-2">
              {notes.length === 0 ? (
                <motion.div
                  className="rounded-2xl border border-border/70 bg-background/35 p-3 text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  مفيش ملاحظات محفوظة.
                </motion.div>
              ) : (
                notes.map((note, index) => (
                  <motion.div
                    key={`${note.id}-${index}`}
                    className="rounded-2xl border border-border/70 bg-background/40 p-3 text-right shadow-sm"
                    initial={{ opacity: 0, x: 18, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      delay: 0.34 + index * 0.08,
                      duration: 0.32,
                      ease: "easeOut",
                    }}
                    whileHover={{ scale: 1.015, x: -2 }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-base">✍️</span>
                      <p className="text-sm leading-7 text-foreground">
                        {note.text}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.section>

          {/* Reports */}
          <motion.section
            className="mb-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.35 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">📊</span>
              <h3 className="text-sm font-bold text-foreground">
                التقارير
              </h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {reports.length}
              </span>
            </div>

            <div className="space-y-2">
              {reports.length === 0 ? (
                <motion.div
                  className="rounded-2xl border border-border/70 bg-background/35 p-3 text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  مفيش تقارير ظهرت أثناء المقابلة.
                </motion.div>
              ) : (
                reports.map((report, index) => (
                  <motion.button
                    key={report.id}
                    onClick={() => setOpenReportId(report.id)}
                    className="group w-full rounded-2xl border border-border/70 bg-background/40 p-3 text-right shadow-sm transition-all hover:border-primary/45 hover:bg-background/60 hover:shadow-[0_0_22px_hsl(var(--primary)/0.12)]"
                    initial={{ opacity: 0, x: -18, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      delay: 0.5 + index * 0.08,
                      duration: 0.32,
                      ease: "easeOut",
                    }}
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-transform group-hover:scale-110">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold leading-6 text-foreground">
                          {report.title}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {report.issuer || "تقرير"}
                          {report.reportDate ? ` • ${report.reportDate}` : ""}
                        </p>
                      </div>

                      <span className="mt-1 text-base opacity-70 transition-opacity group-hover:opacity-100">
                        🧾
                      </span>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.button
            onClick={onComplete}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.015] hover:shadow-primary/40 active:scale-[0.98]"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.72, duration: 0.35 }}
          >
            ابدأ التقرير
            <ArrowLeft className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Report modal */}
      <AnimatePresence>
        {openReportId && EVIDENCE[openReportId] && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenReportId(null)}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto"
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.94 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
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
