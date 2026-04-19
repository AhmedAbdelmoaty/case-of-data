import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Trash2, FileText } from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EVIDENCE } from "@/lib/pf-case/evidence-catalog";
import { ReportDocument } from "./ReportDocument";

type Tab = "notes" | "reports";

export const PFNotebook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("notes");
  const [openReportId, setOpenReportId] = useState<string | null>(null);
  const { state, removeNote } = usePFGame();
  const { playSound } = useSound();
  const { notes, collectedReports } = state;
  const prevCountRef = useRef(notes.length);
  const prevReportsRef = useRef(collectedReports.length);
  const [justAdded, setJustAdded] = useState(false);
  const [newNoteIds, setNewNoteIds] = useState<Set<number>>(new Set());

  // Bounce + glow + sound when a note OR a report is added
  useEffect(() => {
    const noteAdded = notes.length > prevCountRef.current;
    const reportAdded = collectedReports.length > prevReportsRef.current;

    if (noteAdded || reportAdded) {
      setJustAdded(true);
      try { playSound("penWrite"); } catch {}
      setTimeout(() => { try { playSound("sparkle"); } catch {} }, 180);

      if (noteAdded) {
        const newId = notes[notes.length - 1]?.roundId;
        if (newId !== undefined) {
          setNewNoteIds(prev => new Set(prev).add(newId));
          setTimeout(() => {
            setNewNoteIds(prev => {
              const next = new Set(prev);
              next.delete(newId);
              return next;
            });
          }, 5000);
        }
      }

      setTimeout(() => setJustAdded(false), 1200);
    }
    prevCountRef.current = notes.length;
    prevReportsRef.current = collectedReports.length;
  }, [notes.length, collectedReports.length, playSound, notes, collectedReports]);

  const totalCount = notes.length + collectedReports.length;

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => { try { playSound("pageFlip"); } catch {} ; setIsOpen(true); }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-md border text-foreground shadow-lg transition-all ${
          justAdded ? "border-primary shadow-primary/40 shadow-2xl animate-breathing-glow" : "border-border hover:border-primary/50"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 50, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: justAdded ? [1, 1.25, 0.95, 1.1, 1] : 1,
        }}
        transition={{ delay: 0.5, duration: justAdded ? 0.8 : 0.3 }}
      >
        <BookOpen className={`w-5 h-5 ${justAdded ? "text-primary animate-pulse" : "text-primary"}`} />
        <span className="text-sm font-bold">الدفتر</span>
        {totalCount > 0 && (
          <motion.span
            className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
            animate={justAdded ? { scale: [1, 1.6, 1], rotate: [0, 360] } : {}}
            transition={{ duration: 0.6 }}
          >
            {totalCount}
          </motion.span>
        )}
        {/* Sparkles */}
        <AnimatePresence>
          {justAdded && (
            <>
              {[0, 1, 2, 3, 4].map(i => (
                <motion.span
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-primary pointer-events-none"
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1.5,
                    x: Math.cos((i / 5) * Math.PI * 2) * 40,
                    y: Math.sin((i / 5) * Math.PI * 2) * 40,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  style={{ left: "50%", top: "50%" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-96 max-w-[92vw] bg-card border-l border-border z-[71] flex flex-col"
              initial={{ x: 380 }}
              animate={{ x: 0 }}
              exit={{ x: 380 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-foreground font-bold text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  📓 الدفتر
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border" dir="rtl">
                <button
                  onClick={() => setTab("notes")}
                  className={`flex-1 py-2.5 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    tab === "notes"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  ملاحظات ({notes.length})
                </button>
                <button
                  onClick={() => setTab("reports")}
                  className={`flex-1 py-2.5 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    tab === "reports"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  تقارير ({collectedReports.length})
                </button>
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {tab === "notes" && (
                  notes.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-sm" dir="rtl">
                        مفيش ملاحظات لسه.
                      </p>
                      <p className="text-muted-foreground text-xs mt-2" dir="rtl">
                        بعد كل رد من أبو سعيد، اضغط "احفظ في الدفتر" عشان تسجل المعلومة.
                      </p>
                    </div>
                  ) : (
                    notes.map((note, i) => {
                      const isNew = newNoteIds.has(note.roundId);
                      return (
                        <motion.div
                          key={note.roundId}
                          className={`p-3 rounded-lg border relative group transition-colors ${
                            isNew
                              ? "bg-primary/10 border-primary/30"
                              : "bg-muted/50 border-border"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-foreground text-sm leading-relaxed" dir="rtl">
                              {note.text}
                            </p>
                            <button
                              onClick={() => removeNote(note.roundId)}
                              className="shrink-0 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">جولة {note.roundId}</p>
                        </motion.div>
                      );
                    })
                  )
                )}

                {tab === "reports" && (
                  collectedReports.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-sm" dir="rtl">
                        مفيش تقارير لسه.
                      </p>
                      <p className="text-muted-foreground text-xs mt-2" dir="rtl">
                        لما أبو سعيد يسلّمك تقرير، هتلاقيه هنا تقدر ترجعله أي وقت.
                      </p>
                    </div>
                  ) : (
                    collectedReports.map((evidenceId, i) => {
                      const ev = EVIDENCE[evidenceId];
                      if (!ev) return null;
                      return (
                        <motion.button
                          key={evidenceId}
                          onClick={() => setOpenReportId(evidenceId)}
                          className="w-full p-3 rounded-lg border border-border bg-muted/40 hover:border-primary/50 hover:bg-muted/70 transition-all text-right"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          dir="rtl"
                        >
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground text-sm font-bold leading-snug">{ev.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {ev.issuer || "تقرير"} {ev.reportDate ? `• ${ev.reportDate}` : ""}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })
                  )
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Report viewer modal (from archive) */}
      <AnimatePresence>
        {openReportId && EVIDENCE[openReportId] && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenReportId(null)}
          >
            <motion.div
              className="relative max-w-xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenReportId(null)}
                className="absolute -top-2 -left-2 z-10 w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors shadow-lg"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
              <ReportDocument evidence={EVIDENCE[openReportId]} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
