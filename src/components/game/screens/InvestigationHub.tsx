// ============================================================================
// InvestigationHub — main investigation screen
// Shows: budget + trust + evidence count header, randomized question list,
// last character response, discovered evidence sidebar, finish button.
// ============================================================================

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  Heart,
  FileSearch,
  MessageCircle,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const MIN_QUESTIONS_BEFORE_FINISH = 4;

// Deterministic shuffle (Fisher-Yates with seeded RNG) so order is stable
const seededShuffle = <T,>(items: T[], seed: string): T[] => {
  const arr = [...items];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 0xffffffff;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const InvestigationHub = () => {
  const {
    caseData,
    state,
    remainingBudget,
    isBudgetExhausted,
    isTrustCollapsed,
    discoveredEvidence,
    lastQuestion,
    lastAnswer,
    askQuestion,
    endInvestigation,
  } = usePFGame();

  // Randomized but stable order across renders for this case
  const orderedQuestions = useMemo(
    () => seededShuffle(caseData.questionBank, caseData.id),
    [caseData]
  );

  const trustPct = (state.trust / caseData.trustMechanics.max) * 100;
  const budgetPct = (state.askedQuestionIds.length / caseData.questionBudget) * 100;
  const canFinish = state.askedQuestionIds.length >= MIN_QUESTIONS_BEFORE_FINISH;
  const blocked = isBudgetExhausted || isTrustCollapsed;

  // Highlight new evidence briefly
  const [flashIds, setFlashIds] = useState<string[]>([]);
  const lastAnswerKey = lastAnswer ? `${lastAnswer.questionId}-${lastAnswer.order}` : null;
  const prevAnswerKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastAnswerKey && lastAnswerKey !== prevAnswerKeyRef.current && lastAnswer) {
      prevAnswerKeyRef.current = lastAnswerKey;
      if (lastAnswer.newEvidenceIds.length > 0) {
        setFlashIds(lastAnswer.newEvidenceIds);
        const t = setTimeout(() => setFlashIds([]), 2400);
        return () => clearTimeout(t);
      }
    }
  }, [lastAnswerKey, lastAnswer]);

  const moodLabel: Record<string, string> = {
    neutral: "محايد",
    confused: "محتار",
    annoyed: "متضايق",
    thoughtful: "بيفكّر",
    open: "متفاعل",
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                مرحلة الاستقصاء
              </div>
              <h1 className="text-lg md:text-xl font-bold truncate">{caseData.title}</h1>
            </div>
            <Badge variant="outline" className="shrink-0">
              {caseData.industryDomain}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {/* Budget */}
            <StatBlock
              icon={<Coins className="h-4 w-4" />}
              label="الأسئلة المتبقية"
              value={`${remainingBudget} / ${caseData.questionBudget}`}
              tone="primary"
              progress={budgetPct}
            />
            {/* Trust */}
            <StatBlock
              icon={<Heart className="h-4 w-4" />}
              label="ثقة أبو سعيد"
              value={`${state.trust} / ${caseData.trustMechanics.max}`}
              tone={state.trust <= 2 ? "danger" : state.trust >= 6 ? "success" : "warning"}
              progress={trustPct}
            />
            {/* Evidence */}
            <StatBlock
              icon={<FileSearch className="h-4 w-4" />}
              label="أدلة مكتشفة"
              value={`${discoveredEvidence.length}`}
              tone="accent"
              progress={Math.min(100, (discoveredEvidence.length / caseData.evidencePool.length) * 100)}
            />
          </div>
        </div>
      </header>

      {/* ============ MAIN ============ */}
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* ---------- LEFT: Last response + Question list ---------- */}
          <div className="space-y-5 min-w-0">
            {/* Last character response */}
            <AnimatePresence mode="wait">
              {lastQuestion && lastAnswer ? (
                <motion.div
                  key={lastAnswer.order}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="border-primary/30 bg-card/70 overflow-hidden">
                    <CardContent className="p-5 space-y-3">
                      {/* The question I asked */}
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                        <span className="leading-relaxed">سؤالك: {lastQuestion.text}</span>
                      </div>

                      {/* Abu Saeed reply */}
                      <div className="rounded-lg border border-border bg-secondary/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-foreground">أبو سعيد</span>
                          <Badge variant="outline" className="text-[10px]">
                            {moodLabel[lastQuestion.characterMood] ?? lastQuestion.characterMood}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {lastQuestion.characterResponse}
                        </p>
                      </div>

                      {/* Trust delta + new evidence summary */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {lastAnswer.trustAfter !== lastAnswer.trustBefore && (
                          <Badge
                            variant={lastAnswer.trustAfter > lastAnswer.trustBefore ? "success" : "destructive"}
                          >
                            الثقة {lastAnswer.trustAfter > lastAnswer.trustBefore ? "+" : ""}
                            {lastAnswer.trustAfter - lastAnswer.trustBefore}
                          </Badge>
                        )}
                        {lastAnswer.newEvidenceIds.length > 0 ? (
                          <Badge variant="accent" className="gap-1">
                            <Sparkles className="h-3 w-3" />
                            {lastAnswer.newEvidenceIds.length} دليل جديد
                          </Badge>
                        ) : (
                          <Badge variant="secondary">ما فيش دليل جديد</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="border-dashed border-border bg-card/40">
                  <CardContent className="p-5 text-sm text-muted-foreground leading-relaxed">
                    اختار سؤال من اللي تحت عشان تبدأ المحادثة مع أبو سعيد. عندك{" "}
                    <span className="text-foreground font-semibold">{caseData.questionBudget}</span> أسئلة
                    بس — اختار بحكمة.
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>

            {/* Question list header */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                الأسئلة المتاحة
              </h2>
              <span className="text-xs text-muted-foreground">
                {orderedQuestions.length - state.askedQuestionIds.length} من {orderedQuestions.length}
              </span>
            </div>

            {/* Blocked banner */}
            {blocked && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="p-4 text-sm text-foreground">
                  {isTrustCollapsed
                    ? "أبو سعيد فقد الثقة فيك تماماً. مش هيرد على أي سؤال تاني — لازم تنتقل للتحليل."
                    : "خلصت ميزانية الأسئلة. انتقل لمرحلة التحليل."}
                </CardContent>
              </Card>
            )}

            {/* Questions */}
            <div className="space-y-2">
              {orderedQuestions.map((q) => {
                const asked = state.askedQuestionIds.includes(q.id);
                return (
                  <motion.button
                    key={q.id}
                    whileHover={!asked && !blocked ? { x: -4 } : undefined}
                    onClick={() => !asked && !blocked && askQuestion(q.id)}
                    disabled={asked || blocked}
                    className={cn(
                      "w-full text-right rounded-lg border p-4 transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      asked
                        ? "border-border/60 bg-secondary/20 opacity-60 cursor-not-allowed"
                        : blocked
                          ? "border-border/40 bg-card/40 opacity-50 cursor-not-allowed"
                          : "border-border bg-card hover:border-primary/60 hover:bg-card/80 cursor-pointer"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                          asked
                            ? "bg-success/20 text-success"
                            : "bg-primary/15 text-primary"
                        )}
                      >
                        {asked ? <CheckCircle2 className="h-3.5 w-3.5" /> : "؟"}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90">{q.text}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Finish button */}
            <div className="pt-2 flex justify-end">
              <Button
                size="lg"
                variant={canFinish || blocked ? "accent" : "outline"}
                disabled={!canFinish && !blocked}
                onClick={endInvestigation}
                className="gap-2"
              >
                خلاص — انتقل للتحليل
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            {!canFinish && !blocked && (
              <p className="text-xs text-muted-foreground text-center">
                اسأل على الأقل {MIN_QUESTIONS_BEFORE_FINISH} أسئلة قبل ما تنتقل للتحليل
              </p>
            )}
          </div>

          {/* ---------- RIGHT: Evidence panel ---------- */}
          <aside className="lg:sticky lg:top-[200px] lg:self-start">
            <Card className="bg-card/60">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <FileSearch className="h-4 w-4 text-accent" />
                  دفتر الأدلة
                </h3>
                <Badge variant="secondary">{discoveredEvidence.length}</Badge>
              </div>
              <ScrollArea className="h-[420px]">
                <div className="p-3 space-y-2">
                  {discoveredEvidence.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-3 leading-relaxed">
                      لسه ما اكتشفتش أي دليل. كل سؤال ممكن يكشف معلومة أو حاجة جديدة.
                    </p>
                  ) : (
                    discoveredEvidence.map((e) => {
                      const isNew = flashIds.includes(e.id);
                      return (
                        <motion.div
                          key={e.id}
                          initial={isNew ? { opacity: 0, scale: 0.95 } : false}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "rounded-md border p-3 text-xs leading-relaxed transition-colors",
                            isNew
                              ? "border-accent bg-accent/10 text-foreground"
                              : "border-border/60 bg-secondary/30 text-foreground/85"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground shrink-0 mt-0.5">
                              {e.id}
                            </span>
                            <span>{e.text}</span>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Stat block (header)
// ----------------------------------------------------------------------------
const StatBlock = ({
  icon,
  label,
  value,
  tone,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "accent" | "success" | "warning" | "danger";
  progress: number;
}) => {
  const toneClass = {
    primary: "text-primary",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  }[tone];
  const indicatorClass = {
    primary: "bg-primary",
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
  }[tone];

  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3">
      <div className="flex items-center justify-between mb-1.5">
        <div className={cn("flex items-center gap-1.5 text-[11px] font-medium", toneClass)}>
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-sm font-bold tabular-nums text-foreground">{value}</span>
      </div>
      <Progress value={progress} indicatorClassName={indicatorClass} />
    </div>
  );
};
