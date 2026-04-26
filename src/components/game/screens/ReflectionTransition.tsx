import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, FileText, Sparkles, X } from "lucide-react";
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

  const bg = profile?.gender === "female" ? analystReflectingFemaleImg : analystReflectingMaleImg;
  const notes = state.notes;
  const reports = state.collectedReports
    .map((id) => EVIDENCE[id])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <img src={bg} alt="Analyst reviewing notes" className="w-full h-full object-cover animate-ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/25" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-3xl rounded-3xl border border-primary/25 bg-card/90 backdrop-blur-md shadow-[0_0_50px_hsl(var(--primary)/0.16)] p-5 md:p-6"
          dir="rtl"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <motion.div
              className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/25"
              animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground">
              راجع ما جمعته
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              قبل ما تكتب تقريرك، راجع الملاحظات والتقارير اللي ظهرت لك أثناء المقابلة.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            <motion.section
              className="rounded-2xl border border-border bg-background/35 p-4"
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <h3 className="font-bold text-foreground">الملاحظات</h3>
                <span className="text-xs text-muted-foreground">({notes.length})</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground leading-7">
                    مفيش ملاحظات محفوظة.
                  </p>
                ) : (
                  notes.map((note, index) => (
                    <motion.div
                      key={note.roundId}
                      className="rounded-xl border border-border bg-card/70 p-3 text-right"
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.42 + index * 0.08 }}
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

            <motion.section
              className="rounded-2xl border border-border bg-background/35 p-4"
              initial={{ opacity: 0, x: -22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.38 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">📊</span>
                <h3 className="font-bold text-foreground">التقارير</h3>
                <span className="text-xs text-muted-foreground">({reports.length})</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground leading-7">
                    مفيش تقارير ظهرت أثناء المقابلة.
                  </p>
                ) : (
                  reports.map((report, index) => (
                    <motion.button
                      key={report.id}
                      onClick={() => setOpenReportId(report.id)}
                      className="w-full rounded-xl border border-border bg-card/70 p-3 text-right transition-all hover:border-primary/50 hover:bg-card hover:shadow-[0_0_22px_hsl(var(--primary)/0.12)]"
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.08 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold leading-6 text-foreground">
                            {report.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {report.issuer || "تقرير"} {report.reportDate ? `• ${report.reportDate}` : ""}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.section>
          </div>

          <motion.button
            onClick={onComplete}
            className="mt-5 w-full rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.01] hover:shadow-primary/40 active:scale-[0.98] flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.78 }}
          >
            ابدأ التقرير
            <ArrowLeft className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {openReportId && EVIDENCE[openReportId] && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenReportId(null)}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenReportId(null)}
                className="absolute -top-2 -left-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:bg-muted"
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
