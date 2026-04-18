// ============================================================================
// Index — TEMPORARY scaffold during rebuild (Phase 2 complete)
// Old screens are intentionally NOT mounted — they depend on a removed API
// and will be replaced in Phase 3 (InvestigationHub, SynthesisScreen,
// FramingBuilder, DebriefScreen).
// ============================================================================

import { PFGameProvider, usePFGame } from "@/contexts/PFGameContext";

const RebuildNotice = () => {
  const { caseData, state, remainingBudget, availableQuestions } = usePFGame();

  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          Phase 2 / 5 — Context layer rebuilt
        </div>

        <h1 className="text-3xl font-bold">{caseData.title}</h1>
        <p className="text-muted-foreground leading-relaxed">
          الـ Schema الجديد و PFGameContext تم بناؤهم. الشاشات الجديدة
          (Investigation Hub، Synthesis، Framing Builder، Debrief) هتتبني في
          المرحلة 3.
        </p>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg border border-border p-4">
            <div className="text-2xl font-bold text-primary">{caseData.questionBank.length}</div>
            <div className="text-muted-foreground">سؤال في البنك</div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-2xl font-bold text-primary">{remainingBudget}</div>
            <div className="text-muted-foreground">ميزانية الأسئلة</div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="text-2xl font-bold text-primary">{state.trust}</div>
            <div className="text-muted-foreground">الثقة</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          المرحلة الحالية: <span className="font-mono text-foreground">{state.phase}</span>
          {" · "}
          أسئلة متاحة: <span className="font-mono text-foreground">{availableQuestions.length}</span>
        </div>
      </div>
    </div>
  );
};

const Index = () => (
  <PFGameProvider>
    <RebuildNotice />
  </PFGameProvider>
);

export default Index;
