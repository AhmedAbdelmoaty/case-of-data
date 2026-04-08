import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Trash2 } from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";

export const PFNotebook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, removeNote } = usePFGame();
  const { notes } = state;

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-md border border-border text-foreground shadow-lg hover:border-primary/50 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <BookOpen className="w-5 h-5 text-primary" />
        <span className="text-sm font-bold">الدفتر</span>
        {notes.length > 0 && (
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
            {notes.length}
          </span>
        )}
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
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-card border-l border-border z-[71] flex flex-col"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-foreground font-bold text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  📓 دفتر الملاحظات
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-sm" dir="rtl">
                      مفيش ملاحظات لسه.
                    </p>
                    <p className="text-muted-foreground text-xs mt-2" dir="rtl">
                      بعد كل رد من أبو سعيد، اضغط "احفظ في الدفتر" عشان تسجل المعلومة.
                    </p>
                  </div>
                ) : (
                  notes.map((note, i) => (
                    <motion.div
                      key={note.roundId}
                      className="p-3 rounded-lg bg-muted/50 border border-border relative group"
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
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
