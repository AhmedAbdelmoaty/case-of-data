import { useState } from "react";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { gText } from "@/lib/gText";

interface DebriefScreenProps {
  onComplete: () => void;
}

export const DebriefScreen = ({ onComplete }: DebriefScreenProps) => {
  const { state, getPerformanceTier, isFramingCorrect } = usePFGame();
  const { profile } = useAuth();
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";
  const tier = getPerformanceTier();
  const correct = isFramingCorrect();

  const getDialogues = () => {
    if (tier === "exceptional") {
      return [
        {
          characterId: "mansour",
          text: `${gText("أهلاً يا", "أهلاً يا", g)} ${playerName}! أبو سعيد اتصل بيا وقالي إنه مبسوط جداً من التحليل.`,
          mood: "happy" as const,
        },
        {
          characterId: "mansour",
          text: `${gText("ممتاز", "ممتازة", g)} يا ${playerName}! التحليل ده قوي جداً. ${gText("فكّكت", "فكّكتي", g)} المشكلة بمنهجية و${gText("فصلت", "فصلتي", g)} بين الإحساس والواقع. ده بالظبط اللي بنتوقعه من محلل بيناكل.`,
          mood: "happy" as const,
        },
        {
          characterId: "mansour",
          text: `كمّل كده يا ${playerName}. العميل اتطمّن إننا فاهمين مشكلته… وده أهم حاجة في شغلنا. 🏆`,
          mood: "happy" as const,
        },
      ];
    }

    if (tier === "promising") {
      return [
        {
          characterId: "mansour",
          text: `أهلاً يا ${playerName}. تعالى نتكلم عن الزيارة.`,
          mood: "neutral" as const,
        },
        {
          characterId: "mansour",
          text: `شغل كويس بس ممكن ${gText("تكون أعمق", "تكوني أعمق", g)} شوية. ${correct ? "التأطير كان صح وده ممتاز." : "التأطير محتاج يتظبط أكتر."} المرة الجاية ${gText("ركّز", "ركّزي", g)} أكتر على تفكيك المشكلة خطوة خطوة.`,
          mood: "neutral" as const,
        },
        {
          characterId: "mansour",
          text: `${gText("أنت عندك", "أنتِ عندك", g)} أساس كويس. بس لازم نوصل لمستوى إن العميل يحس إننا فهمنا المشكلة أعمق منه.`,
          mood: "neutral" as const,
        },
      ];
    }

    // beginner
    return [
      {
        characterId: "mansour",
        text: `يا ${playerName}… تعالى ${gText("اقعد", "اقعدي", g)}.`,
        mood: "neutral" as const,
      },
      {
        characterId: "mansour",
        text: `بص يا ${playerName}… أنا حاسس إنك ${gText("استعجلت", "استعجلتي", g)} شوية. العميل مش مقتنع تماماً وده بيأثر على سمعة الشركة. ${gText("خد", "خدي", g)} وقتك المرة الجاية و${gText("فكّك", "فكّكي", g)} المشكلة قبل ما ${gText("تقفز", "تقفزي", g)} لحلول.`,
        mood: "angry" as const,
      },
      {
        characterId: "mansour",
        text: `مش مشكلة… كلنا بنتعلم. بس لازم ${gText("ترجع", "ترجعي", g)} ${gText("تذاكر", "تذاكري", g)} كويس و${gText("تجرب", "تجربي", g)} تاني. الأسئلة القوية هي اللي بتفرق.`,
        mood: "neutral" as const,
      },
    ];
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />

      <EnhancedDialogue
        dialogues={getDialogues()}
        isActive={true}
        onComplete={onComplete}
        currentIndex={dialogueIndex}
        onIndexChange={setDialogueIndex}
        playerName={playerName}
        playerGender={g}
      />
    </div>
  );
};
