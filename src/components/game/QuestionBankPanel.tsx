// ════════════════════════════════════════════════════════════════════════════
// QuestionBankPanel — التحقيق التفاعلي (V3)
// ════════════════════════════════════════════════════════════════════════════
// • مفيش tabs لكل الأسئلة. بدلها: set ديناميكي من 5 أسئلة معروضة في كارت سفلي.
// • مفيش تصنيفات/badges على الأسئلة (مفيش تسريب لنوع السؤال).
// • خلفية = مشهد المتجر مع الشخصية الحالية.
// • بعد كل سؤال: EnhancedDialogue بالإجابة → set جديد.
// • زرار التبديل بين أبو سعيد وسلمى يظهر بعد ما سلمى تتفتح.
// • زرار "قدّم التأطير" متاح في أي وقت بدون hint عن الجاهزية.
// ════════════════════════════════════════════════════════════════════════════

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Coins, MessageSquare, ArrowRightLeft, FileCheck, Sparkles } from "lucide-react";
import { usePFGameV2 } from "@/contexts/PFGameContextV2";
import type { Character, Question } from "@/data/pf-scenario";
import { EnhancedDialogue } from "./EnhancedDialogue";
import { useAuth } from "@/contexts/AuthContext";
import storeFrontImg from "@/assets/scenes/store-front.png";
import abuSaeedGreetingImg from "@/assets/scenes/abu-saeed-greeting.jpg";

interface Props {
  availableCharacters: Character[];
  onProceedToFraming?: () => void;
}

const characterMeta: Record<Character, { name: string; role: string; bg: string }> = {
  mansour: { name: "أ. منصور", role: "مدير الاستشارات", bg: storeFrontImg },
  abuSaeed: { name: "أبو سعيد", role: "صاحب المتجر", bg: abuSaeedGreetingImg },
  salma: { name: "سلمى", role: "محاسبة المتجر", bg: abuSaeedGreetingImg },
};

export const QuestionBankPanel = ({ availableCharacters, onProceedToFraming }: Props) => {
  const { user, profile } = useAuth();
  const playerName = profile?.display_name || user?.email?.split("@")[0] || "المحلل";
  const playerGender = (profile?.gender as "male" | "female") || "male";

  const {
    state,
    askQuestion,
    isQuestionAsked,
    getQuestionsForCurrentSet,
    isCharacterUnlocked,
    getResolvedQuestion,
    clearLastAsked,
  } = usePFGameV2();

  // الشخصية النشطة — تبدأ بأبو سعيد، يقدر يحول لسلمى لما تتفتح
  const [activeCharacter, setActiveCharacter] = useState<Character>(availableCharacters[0]);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [showNotebook, setShowNotebook] = useState(false);
  const [showFramingConfirm, setShowFramingConfirm] = useState(false);

  const salmaUnlocked = isCharacterUnlocked("salma");
  const currentSet = useMemo(
    () => getQuestionsForCurrentSet(activeCharacter),
    [getQuestionsForCurrentSet, activeCharacter]
  );

  const handleAskQuestion = (question: Question) => {
    if (isQuestionAsked(question.id)) {
      setActiveQuestion(question);
      return;
    }
    if (state.budgetRemaining <= 0) return;
    const asked = askQuestion(question.id);
    if (asked) setActiveQuestion(asked);
  };

  const handleDialogueClose = () => {
    setActiveQuestion(null);
    clearLastAsked();
  };

  // عرض الإجابة المناسبة (لو premature بقى key، نستخدم النسخة الـ key)
  const getDialogueForQuestion = (q: Question) => {
    const resolved = getResolvedQuestion(q.id);
    return resolved ? resolved.effectiveAnswer : q.answer;
  };

  const bg = characterMeta[activeCharacter].bg;
  const noBudget = state.budgetRemaining <= 0;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* الخلفية: مشهد المتجر */}
      <div className="absolute inset-0">
        <img src={bg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/95" />
      </div>

      {/* Header — ميزانية + دفتر + تأطير */}
      <div className="relative z-10 pt-20 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/80 backdrop-blur-md border border-amber-500/40">
              <Coins className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-foreground">{state.budgetRemaining}</span>
              <span className="text-xs text-muted-foreground">/14 سؤال</span>
            </div>
            <button
              onClick={() => setShowNotebook((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/80 backdrop-blur-md border border-blue-500/40 hover:border-blue-500/70 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-foreground">{state.insights.length}</span>
              <span className="text-xs text-muted-foreground">دفتر</span>
            </button>
          </div>

          <button
            onClick={() => setShowFramingConfirm(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
          >
            <FileCheck className="w-4 h-4" />
            قدّم التأطير
          </button>
        </div>
      </div>

      {/* محول الشخصيات (يظهر بعد سلمى) */}
      {salmaUnlocked && availableCharacters.length > 1 && (
        <div className="relative z-10 mt-6 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
            {availableCharacters.map((char) => {
              const isActive = activeCharacter === char;
              const isLocked = !isCharacterUnlocked(char);
              return (
                <button
                  key={char}
                  disabled={isLocked}
                  onClick={() => setActiveCharacter(char)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 backdrop-blur-md transition-all ${
                    isActive
                      ? "bg-primary/30 border-primary text-foreground"
                      : isLocked
                        ? "bg-muted/20 border-border text-muted-foreground opacity-50 cursor-not-allowed"
                        : "bg-card/60 border-border text-foreground hover:border-primary/50"
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span className="font-bold">{characterMeta[char].name}</span>
                  <span className="text-xs text-muted-foreground">— {characterMeta[char].role}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* عنوان الشخصية الحالية */}
      <div className="relative z-10 mt-8 text-center">
        <motion.div
          key={activeCharacter}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block px-6 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-border"
        >
          <p className="text-sm text-muted-foreground">بتكلم</p>
          <h2 className="text-2xl font-bold text-foreground">{characterMeta[activeCharacter].name}</h2>
          <p className="text-xs text-muted-foreground">{characterMeta[activeCharacter].role}</p>
        </motion.div>
      </div>

      {/* بطاقة الأسئلة المعروضة (الـ Set) */}
      <div className="relative z-10 mt-6 px-4 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-foreground/80 text-sm mb-3 justify-center" dir="rtl">
            <MessageSquare className="w-4 h-4" />
            <span>اختر سؤالك التالي بحكمة</span>
          </div>

          {currentSet.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center p-8 rounded-2xl bg-card/70 backdrop-blur-md border border-border"
              dir="rtl"
            >
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <p className="text-foreground font-bold">سألت كل اللي تقدر تسأله من {characterMeta[activeCharacter].name}.</p>
              {salmaUnlocked && availableCharacters.length > 1 ? (
                <p className="text-muted-foreground text-sm mt-2">جرّب الشخصية التانية، أو قدّم التأطير.</p>
              ) : (
                <p className="text-muted-foreground text-sm mt-2">قدّم التأطير لما تكون جاهز.</p>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {currentSet.map((q, idx) => {
                  const asked = isQuestionAsked(q.id);
                  return (
                    <motion.button
                      key={q.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleAskQuestion(q)}
                      disabled={noBudget && !asked}
                      whileHover={!noBudget || asked ? { scale: 1.01, x: -3 } : {}}
                      whileTap={!noBudget || asked ? { scale: 0.99 } : {}}
                      className={`w-full text-right p-4 rounded-xl border backdrop-blur-md transition-all ${
                        asked
                          ? "bg-emerald-500/10 border-emerald-500/40 text-foreground/70"
                          : noBudget
                            ? "bg-card/40 border-border opacity-50 cursor-not-allowed text-muted-foreground"
                            : "bg-card/80 border-border hover:border-primary/60 text-foreground cursor-pointer"
                      }`}
                      dir="rtl"
                    >
                      <p className="text-base leading-relaxed">{q.text}</p>
                      {asked && (
                        <p className="text-xs text-emerald-400 mt-1">✓ سألت ده — اضغط لإعادة قراءة الإجابة</p>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </AnimatePresence>
          )}

          {noBudget && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/40 text-center"
              dir="rtl"
            >
              <p className="text-destructive font-bold">خلصت ميزانيتك من الأسئلة.</p>
              <p className="text-sm text-muted-foreground mt-1">قدّم التأطير بناءً على اللي اكتشفته.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Notebook drawer */}
      <AnimatePresence>
        {showNotebook && (
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 z-40 bg-card/95 backdrop-blur-xl border-l border-border overflow-y-auto"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  الدفتر
                </h3>
                <button
                  onClick={() => setShowNotebook(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              {state.insights.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8" dir="rtl">
                  لسه ما اكتشفتش أي معلومة. ابدأ بالسؤال.
                </p>
              ) : (
                <div className="space-y-2">
                  {state.insights.map((ins) => (
                    <div
                      key={ins.questionId + ins.timestamp}
                      className={`p-3 rounded-lg border text-sm ${
                        ins.isKey
                          ? "bg-amber-500/10 border-amber-500/40 text-foreground"
                          : "bg-muted/20 border-border/40 text-muted-foreground"
                      }`}
                      dir="rtl"
                    >
                      {ins.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تأكيد التأطير */}
      <AnimatePresence>
        {showFramingConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowFramingConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-card border border-border rounded-2xl p-6 text-right"
              dir="rtl"
            >
              <FileCheck className="w-10 h-10 text-primary mb-3" />
              <h3 className="text-xl font-bold text-foreground mb-2">جاهز للتأطير؟</h3>
              <p className="text-muted-foreground text-sm mb-4">
                هتقفل التحقيق وتنتقل لشاشة التأطير. مش هتقدر ترجع تسأل تاني.
                {state.budgetRemaining > 0 && ` لسه فاضلك ${state.budgetRemaining} سؤال.`}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFramingConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted/50"
                >
                  لسه
                </button>
                <button
                  onClick={() => { setShowFramingConfirm(false); onProceedToFraming?.(); }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-bold"
                >
                  أيوه، قدّم
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogue للسؤال النشط */}
      {activeQuestion && (
        <EnhancedDialogue
          isActive
          dialogues={[
            { characterId: "detective", text: activeQuestion.text, mood: "neutral" },
            {
              characterId: activeQuestion.character,
              text: getDialogueForQuestion(activeQuestion),
              mood: "neutral",
            },
          ]}
          onComplete={handleDialogueClose}
          onClose={handleDialogueClose}
          playerName={playerName}
          playerGender={playerGender}
        />
      )}
    </div>
  );
};
