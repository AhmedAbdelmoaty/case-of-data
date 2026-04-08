import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, Check, BarChart3, X } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { GameOverlay } from "../GameOverlay";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { DASHBOARD_DATA, EVIDENCE_ITEMS, PHASES } from "@/data/case1";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import dataRoomBg from "@/assets/rooms/data-room.png";
import dataScene1 from "@/assets/scenes/data-scene-1.png";
import dataScene2 from "@/assets/scenes/data-scene-2.png";

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

// Hotspot positions for CTA scene backgrounds
const sceneHotspotPositions: Record<string, Record<string, { x: number; y: number; w: number; h: number }>> = {
  // Data Scene 1: left monitor (bar chart D1), right monitor (line chart D2)
  "data-1": {
    D1: { x: 10, y: 12, w: 28, h: 45 },   // left monitor with bar chart
    D2: { x: 52, y: 10, w: 32, h: 48 },   // right monitor with line chart
  },
  // Data Scene 2: notebook (left, K2), monitor (right, D3)
  "data-2": {
    K2: { x: 8, y: 35, w: 28, h: 40 },    // open notebook on left
    D3: { x: 42, y: 10, w: 35, h: 50 },   // monitor with bar chart
  },
};

// Cumulative room hotspot positions (data-room.png)
const cumulativeHotspotPositions: Record<string, { x: number; y: number; w: number; h: number }> = {
  D2: { x: 5, y: 40, w: 14, h: 20 },    // left monitor (line chart "Invoices")
  D1: { x: 20, y: 36, w: 16, h: 22 },   // second left monitor (bar chart "Invoices by Hour")
  D3: { x: 68, y: 44, w: 18, h: 25 },   // large right monitor (bar chart "Footprint by Horse")
  K2: { x: 50, y: 63, w: 16, h: 18 },   // open book on desk
};

// Map phase IDs to scene images
const phaseSceneImages: Record<string, string> = {
  "data-1": dataScene1,
  "data-2": dataScene2,
};

export const DashboardScreen = ({ onNavigate }: DashboardScreenProps) => {
  const { state, addToNotebook, isInNotebook, viewDashboardItem, viewEvidence, isEvidenceViewed } = useGame();
  const { playSound } = useSound();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const currentPhase = PHASES[state.currentPhaseIndex];
  const isCTAEntry = state.entryMethod === "cta" && currentPhase?.targetRoom === "dashboard";

  // Combine dashboard items + K2
  const k2Evidence = EVIDENCE_ITEMS.find(e => e.id === "K2");
  const allItems = [...DASHBOARD_DATA.map(d => ({ ...d, isK2: false }))];
  if (k2Evidence && state.unlockedDashboard.includes("K2")) {
    allItems.push({ id: "K2", name: k2Evidence.name, description: k2Evidence.description, saveId: k2Evidence.saveId, saveText: k2Evidence.saveText, type: "table" as any, data: k2Evidence.data, isK2: true } as any);
  }

  const unlockedItems = isCTAEntry
    ? allItems.filter(item => currentPhase.sceneItems?.includes(item.id))
    : allItems.filter(item => state.unlockedDashboard.includes(item.id));

  // Pick background
  const backgroundImage = isCTAEntry
    ? (phaseSceneImages[currentPhase.id] || dataRoomBg)
    : dataRoomBg;

  // Pick hotspot positions
  const hotspots = unlockedItems.map((item) => {
    let pos: { x: number; y: number; w: number; h: number };
    if (isCTAEntry && sceneHotspotPositions[currentPhase.id]?.[item.id]) {
      pos = sceneHotspotPositions[currentPhase.id][item.id];
    } else if (cumulativeHotspotPositions[item.id]) {
      pos = cumulativeHotspotPositions[item.id];
    } else {
      pos = { x: 50, y: 50, w: 14, h: 14 };
    }
    return { id: item.id, x: pos.x, y: pos.y, width: pos.w, height: pos.h, label: `📊 ${item.name}`, icon: "📊" };
  });

  const handleHotspotClick = (hotspotId: string) => {
    setActiveItem(hotspotId);
    if (hotspotId === "K2") {
      if (!isEvidenceViewed("K2")) viewEvidence("K2");
    } else {
      viewDashboardItem(hotspotId);
    }
    playSound("click");
  };

  const handleSave = (saveId: string, saveText: string) => {
    if (!isInNotebook(saveId)) {
      const source = saveId.startsWith("K") ? "evidence" : "dashboard";
      addToNotebook({ text: saveText, source: source as any, sourceId: saveId });
      toast.success("تم الحفظ في الدفتر!");
      playSound("collect");
    }
  };

  const currentItem = unlockedItems.find(item => item.id === activeItem);

  const renderOverlay = () => {
    if (!currentItem) return undefined;
    const saved = isInNotebook(currentItem.saveId);

    return (
      <div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {currentItem.name}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={() => handleSave(currentItem.saveId, currentItem.saveText)} disabled={saved}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${saved ? "bg-neon-green/20 text-neon-green" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
              {saved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
              {saved ? "محفوظ" : "احفظ"}
            </button>
            <button onClick={() => setActiveItem(null)} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{currentItem.description}</p>

        {currentItem.id === "D1" && (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentItem.data.labels.map((label: string, i: number) => ({ name: label, value: currentItem.data.values[i] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Bar dataKey="value" name="صافي المبيعات" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {currentItem.id === "D2" && (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentItem.data.labels.map((label: string, i: number) => ({ day: label, count: currentItem.data.values[i] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[75, 95]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Line type="monotone" dataKey="count" name="عدد الفواتير" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {currentItem.id === "D3" && (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentItem.data.labels.map((label: string, i: number) => ({ time: label, count: currentItem.data.values[i] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Bar dataKey="count" name="فواتير" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {currentItem.id === "K2" && (
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm"><thead className="bg-secondary/50"><tr>
              <th className="text-right p-3 text-foreground">الصنف</th>
              <th className="text-right p-3 text-foreground">7–13 فبراير</th>
              <th className="text-right p-3 text-foreground">14–20 فبراير</th>
            </tr></thead><tbody>
              {currentItem.data.rows.map((row: any, i: number) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-3 text-foreground">{row.item}</td>
                  <td className="p-3 text-foreground">{row.prev}</td>
                  <td className="p-3 text-foreground">{row.current}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <InteractiveRoom backgroundImage={backgroundImage} hotspots={hotspots} onHotspotClick={handleHotspotClick} activeHotspot={activeItem} overlayContent={activeItem ? renderOverlay() : undefined} onCloseOverlay={() => setActiveItem(null)}>
        <motion.div className="absolute top-12 right-4 z-20 flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
            <span className="text-muted-foreground text-sm">بيانات: {unlockedItems.length}</span>
            {isCTAEntry && <span className="text-xs text-primary mr-2">جديدة</span>}
          </div>
        </motion.div>
      </InteractiveRoom>
      <GameOverlay currentScreen="dashboard" onNavigate={onNavigate} />
    </>
  );
};
