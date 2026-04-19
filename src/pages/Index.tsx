// ============================================================================
// Index — Session 1: InvestigationHub mounted directly so the user can play.
// Briefing/Travel/Arrival linking comes in Session 3.
// ============================================================================

import { useEffect } from "react";
import { PFGameProvider, usePFGame } from "@/contexts/PFGameContext";
import { InvestigationHub } from "@/components/game/screens/InvestigationHub";
import { Card, CardContent } from "@/components/ui/card";

const PhaseRouter = () => {
  const { state, setPhase } = usePFGame();

  // Temporary: skip briefing/travel/arrival until Session 3 wires the old screens
  useEffect(() => {
    if (state.phase === "briefing") setPhase("investigation");
  }, [state.phase, setPhase]);

  if (state.phase === "investigation") return <InvestigationHub />;

  // Placeholder for synthesis / framing / debrief — coming in Sessions 2 & 3
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6" dir="rtl">
      <Card className="max-w-md">
        <CardContent className="p-6 text-center space-y-2">
          <div className="text-xs uppercase tracking-wider text-primary">قريباً</div>
          <h2 className="text-xl font-bold">شاشة "{state.phase}" قيد البناء</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            انتهيت من مرحلة الاستقصاء. شاشات التحليل والتأطير والنتيجة هتتبني في الجلسات الجاية.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const Index = () => (
  <PFGameProvider>
    <PhaseRouter />
  </PFGameProvider>
);

export default Index;
