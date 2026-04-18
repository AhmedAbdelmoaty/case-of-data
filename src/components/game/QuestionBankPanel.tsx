// ════════════════════════════════════════════════════════════════════════════
// QuestionBankPanel — الواجهة الرئيسية للتحقيق
// ════════════════════════════════════════════════════════════════════════════
// تعرض:
// - بنك الأسئلة لكل شخصية (تابات تبديل بين الشخصيات)
// - الأسئلة المفتوحة (قابلة للنقر) والمقفولة (رمادية مع تلميح "اكتشف معلومة جديدة")
// - عداد الميزانية
// - الدفتر (الـ insights المكتشفة)
// - عند النقر على سؤال → عرض الإجابة عبر EnhancedDialogue
// ════════════════════════════════════════════════════════════════════════════

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, BookOpen, AlertCircle, CheckCircle2, Coins, MessageSquare } from "lucide-react";
import { usePFGameV2 } from "@/contexts/PFGameContextV2";
import type { Character, Question } from "@/data/pf-scenario";
import { QUESTIONS_BY_CHARACTER } from "@/data/pf-scenario";
import { EnhancedDialogue } from "./EnhancedDialogue";
import { useAuth } from "@/contexts/AuthContext";

interface QuestionBankPanelProps {
  /** الشخصيات المتاحة في هذه المرحلة (مثلاً ["abuSaeed", "salma"] في المتجر) */
  availableCharacters: Character[];
  /** هل اللاعب يقدر يقفل التحقيق ويروح للتأطير؟ */
  onProceedToFraming?: () => void;
  /** الحد الأدنى من الأسئلة الذهبية المطلوبة قبل ما يقدر يقفل التحقيق */
  minGoldenToFinish?: number;
}

const characterMeta: Record<Character, { name: string; role: string; color: string; bgGradient: string }> = {
  mansour: {
    name: "أ. منصور",
    role: "مدير الاستشارات",
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/40",
  },
  abuSaeed: {
    name: "أبو سعيد",
    role: "صاحب المتجر",
    color: "text-teal-400",
    bgGradient: "from-teal-500/20 to-teal-600/10 border-teal-500/40",
  },
  salma: {
    name: "سلمى",
    role: "محاسبة المتجر",
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 to-purple-600/10 border-purple-500/40",
  },
};

const categoryLabels: Record<string, { label: string; color: string }> = {
  C: { label: "سياق", color: "bg-slate-500/20 text-slate-300 border-slate-500/40" },
  B: { label: "مرجع المقارنة", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  D: { label: "تفكيك", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  E: { label: "عوامل خارجية", color: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
  V: { label: "شكل النجاح", color: "bg-pink-500/20 text-pink-300 border-pink-500/40" },
};

export const QuestionBankPanel = ({
  availableCharacters,
  onProceedToFraming,
  minGoldenToFinish = 4,
}: QuestionBankPanelProps) => {
  const { user } = useAuth();
  const playerName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "المحلل";
  const playerGender = (user?.user_metadata?.gender as "male" | "female") || "male";

  const {
    state,
    askQuestion,
    isQuestionAsked,
    getUnlockedQuestionsFor,
    getLockedQuestionsFor,
  } = usePFGameV2();

  const [activeTab, setActiveTab] = useState<Character>(availableCharacters[0]);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [showNotebook, setShowNotebook] = useState(false);

  const goldenAskedCount = useMemo(
    () =>
      state.askedIds.filter((id) => {
        const q = QUESTIONS_BY_CHARACTER[activeTab].find((qq) => qq.id === id);
        return false; // فقط للحساب الإجمالي تحت
      }).length,
    [state.askedIds, activeTab]
  );

  const totalGoldenAsked = useMemo(
    () =>
      state.askedIds.filter((id) => {
        const q = [
          ...QUESTIONS_BY_CHARACTER.abuSaeed,
          ...QUESTIONS_BY_CHARACTER.salma,
          ...QUESTIONS_BY_CHARACTER.mansour,
        ].find((qq) => qq.id === id);
        return q?.isGolden;
      }).length,
    [state.askedIds]
  );

  const handleAskQuestion = (question: Question) => {
    if (isQuestionAsked(question.id)) {
      // إذا متسأل قبل، اعرض الإجابة فقط بدون استهلاك
      setActiveQuestion(question);
      return;
    }
    if (question.character !== "mansour" && state.budgetRemaining <= 0) return;
    const asked = askQuestion(question.id);
    if (asked) setActiveQuestion(asked);
  };

  const handleDialogueClose = () => setActiveQuestion(null);

  const canFinish = totalGoldenAsked >= minGoldenToFinish;

  const renderQuestion = (question: Question, isUnlocked: boolean) => {
    const isAsked = isQuestionAsked(question.id);
    const cat = categoryLabels[question.category];
    const isLockedByBudget =
      !isAsked && isUnlocked && question.character !== "mansour" && state.budgetRemaining <= 0;

    return (
      <motion.button
        key={question.id}
        onClick={() => isUnlocked && !isLockedByBudget && handleAskQuestion(question)}
        disabled={!isUnlocked || isLockedByBudget}
        whileHover={isUnlocked && !isLockedByBudget ? { scale: 1.01, x: -4 } : {}}
        whileTap={isUnlocked && !isLockedByBudget ? { scale: 0.99 } : {}}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          w-full text-right p-4 rounded-xl border transition-all relative overflow-hidden
          ${
            !isUnlocked
              ? "bg-muted/20 border-border/30 cursor-not-allowed opacity-50"
              : isAsked
              ? "bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-500/60"
              : isLockedByBudget
              ? "bg-red-500/5 border-red-500/30 cursor-not-allowed opacity-60"
              : "bg-card/60 border-border hover:border-primary/60 hover:bg-card/90 cursor-pointer"
          }
        `}
        dir="rtl"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-md border ${cat.color}`}>
              {cat.label}
            </span>
            {isAsked && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                تم السؤال
              </span>
            )}
            {!isUnlocked && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground border border-border/50 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                مقفول
              </span>
            )}
          </div>
        </div>

        <p
          className={`text-base leading-relaxed ${
            isUnlocked ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {!isUnlocked ? "❓ سؤال مقفول — اكتشف معلومة جديدة لفتحه" : question.text}
        </p>

        {isLockedByBudget && (
          <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            مفيش ميزانية — استخدم اللي معاك بحكمة
          </p>
        )}
      </motion.button>
    );
  };

  const unlockedQuestions = getUnlockedQuestionsFor(activeTab);
  const lockedQuestions = getLockedQuestionsFor(activeTab);

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4">
      {/* Header — Budget + Notebook */}
      <div className="max-w-5xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Budget */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <Coins className="w-5 h-5" />
              <span className="font-bold">ميزانية الأسئلة</span>
            </div>
            <span className="text-2xl font-bold text-amber-300">{state.budgetRemaining}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            (أسئلة المدير منصور مجانية)
          </p>
        </div>

        {/* Insights collected */}
        <button
          onClick={() => setShowNotebook(!showNotebook)}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 rounded-xl p-4 text-right hover:border-blue-500/60 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400">
              <BookOpen className="w-5 h-5" />
              <span className="font-bold">الدفتر</span>
            </div>
            <span className="text-2xl font-bold text-blue-300">{state.insights.length}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            اضغط لعرض المعلومات المكتشفة
          </p>
        </button>

        {/* Golden indicator (no spoiler — just a strength meter) */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">قوة التحقيق</span>
            </div>
            <span className="text-2xl font-bold text-emerald-300">
              {totalGoldenAsked}/{minGoldenToFinish}+
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {canFinish ? "✓ جاهز للتأطير" : "محتاج معلومات أكتر للتأطير"}
          </p>
        </div>
      </div>

      {/* Notebook drawer */}
      <AnimatePresence>
        {showNotebook && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-5xl mx-auto mb-6 bg-card/60 border border-border rounded-xl overflow-hidden"
          >
            <div className="p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                دفتر الملاحظات
              </h3>
              {state.insights.length === 0 ? (
                <p className="text-sm text-muted-foreground">لسه ما اكتشفتش أي معلومة. ابدأ بالسؤال.</p>
              ) : (
                <div className="space-y-2">
                  {state.insights.map((insight) => (
                    <div
                      key={insight.questionId}
                      className={`p-3 rounded-lg border text-sm ${
                        insight.isGolden
                          ? "bg-amber-500/5 border-amber-500/30 text-foreground"
                          : "bg-muted/30 border-border/40 text-muted-foreground"
                      }`}
                      dir="rtl"
                    >
                      <div className="flex items-start gap-2">
                        {insight.isGolden && <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />}
                        <span>{insight.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character tabs */}
      <div className="max-w-5xl mx-auto mb-4">
        <div className="flex gap-2 flex-wrap">
          {availableCharacters.map((char) => {
            const meta = characterMeta[char];
            const isActive = activeTab === char;
            const charQuestions = QUESTIONS_BY_CHARACTER[char];
            const askedCount = charQuestions.filter((q) => isQuestionAsked(q.id)).length;
            return (
              <button
                key={char}
                onClick={() => setActiveTab(char)}
                className={`
                  px-4 py-3 rounded-xl border transition-all flex items-center gap-3
                  ${
                    isActive
                      ? `bg-gradient-to-br ${meta.bgGradient} border-2`
                      : "bg-card/40 border-border hover:border-primary/40"
                  }
                `}
              >
                <div className="text-right">
                  <div className={`font-bold ${isActive ? meta.color : "text-foreground"}`}>
                    {meta.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{meta.role}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-background/40 text-muted-foreground">
                  {askedCount}/{charQuestions.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions list */}
      <div className="max-w-5xl mx-auto space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3" dir="rtl">
          <MessageSquare className="w-4 h-4" />
          <span>اختر سؤال لتطرحه على {characterMeta[activeTab].name}</span>
        </div>

        {unlockedQuestions.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            مفيش أسئلة مفتوحة دلوقتي — جرب شخصية تانية
          </p>
        )}

        {unlockedQuestions.map((q) => renderQuestion(q, true))}

        {lockedQuestions.length > 0 && (
          <>
            <div className="text-xs text-muted-foreground mt-6 mb-2 text-right" dir="rtl">
              أسئلة مقفولة (تتفتح بناءً على معلومات تكتشفها):
            </div>
            {lockedQuestions.map((q) => renderQuestion(q, false))}
          </>
        )}
      </div>

      {/* Proceed to framing */}
      {onProceedToFraming && (
        <div className="max-w-5xl mx-auto mt-8 flex justify-center">
          <button
            onClick={onProceedToFraming}
            disabled={!canFinish}
            className={`
              px-8 py-4 rounded-xl font-bold text-lg transition-all
              ${
                canFinish
                  ? "bg-gradient-to-r from-primary to-amber-500 text-primary-foreground hover:scale-105 shadow-lg shadow-primary/30"
                  : "bg-muted/30 text-muted-foreground cursor-not-allowed"
              }
            `}
          >
            {canFinish
              ? "خلصت التحقيق — اعمل تأطير المشكلة ←"
              : `اكتشف ${minGoldenToFinish - totalGoldenAsked} معلومة محورية كمان قبل التأطير`}
          </button>
        </div>
      )}

      {/* Active question dialogue */}
      {activeQuestion && (
        <EnhancedDialogue
          isActive={true}
          dialogues={[
            {
              characterId: "detective",
              text: activeQuestion.text,
              mood: "neutral",
            },
            {
              characterId: activeQuestion.character,
              text: activeQuestion.answer,
              mood: "neutral",
              isSaveable: false,
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
