import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { CASE_INFO } from "@/data/case1";

export const FloatingNotebook = () => {
  const { state, removeFromNotebook } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  return (
    <>
      {/* Floating notebook button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 z-40 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl bg-background/90 backdrop-blur-sm border border-primary/40 shadow-lg"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: "0 4px 20px hsl(var(--primary) / 0.3)" }}
      >
        <div className="relative">
          <span className="text-xl">📓</span>
          {state.notebook.length > 0 && (
            <span className="absolute -top-2 -right-3 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">
              {state.notebook.length}
            </span>
          )}
        </div>
        <span className="text-[9px] font-medium text-primary leading-none">الدفتر</span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border overflow-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  📓 الدفتر ({state.notebook.length})
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-secondary">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Case Summary */}
              <div className="p-4 border-b border-border">
                <button onClick={() => setShowSummary(!showSummary)} className="flex items-center justify-between w-full text-sm">
                  <span className="font-bold text-foreground">📁 ملخص القضية</span>
                  {showSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showSummary && (
                  <div className="mt-2 p-3 rounded-lg bg-secondary/30 text-sm">
                    <p className="font-bold text-foreground mb-1">{CASE_INFO.title}</p>
                    <p className="text-muted-foreground text-xs mb-1">{CASE_INFO.date}</p>
                    <p className="text-muted-foreground text-xs">{CASE_INFO.summary}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="p-4">
                {state.notebook.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-4">📓</p>
                    <p className="text-muted-foreground">الدفتر فاضي!</p>
                    <p className="text-muted-foreground text-sm mt-1">اجمع أدلة واحفظ الملاحظات هنا.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {state.notebook.map((note, i) => (
                      <motion.div key={note.id}
                        className="p-3 rounded-lg bg-card/50 border border-border flex items-start gap-2"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                      >
                        <span className="text-sm mt-0.5">
                          {note.source === "evidence" ? "📁" : note.source === "interview" ? "👤" : note.source === "dashboard" ? "📊" : "📖"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground text-xs">{note.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{note.sourceId}</p>
                        </div>
                        <button onClick={() => removeFromNotebook(note.sourceId)}
                          className="p-1 hover:bg-destructive/20 rounded text-muted-foreground hover:text-destructive shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
