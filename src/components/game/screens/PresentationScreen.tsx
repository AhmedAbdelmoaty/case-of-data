import { useState } from "react";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { FRAMING_OPTIONS } from "@/data/pf-scenario";
import { EnhancedDialogue } from "../EnhancedDialogue";
import storeFrontImg from "@/assets/scenes/store-front.png";

interface PresentationScreenProps {
  onComplete: () => void;
}

export const PresentationScreen = ({ onComplete }: PresentationScreenProps) => {
  const { state, isFramingCorrect } = usePFGame();
  const { profile } = useAuth();
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";
  const correct = isFramingCorrect();
  const chosenFraming = FRAMING_OPTIONS.find((f) => f.id === state.chosenFramingId);

  const dialogues = correct
    ? [
        {
          characterId: "detective",
          text: `أبو سعيد… بعد الأسئلة اللي سألتها، أنا شايف إن المتجر مش عنده مشكلة إقبال. الناس بتدخل وبتهتم. المشكلة الأقرب إن الاهتمام ده — خصوصاً في قسم الحريمي — مش بيتحول لشراء فعلي بالنسبة المتوقعة.`,
          mood: "neutral" as const,
        },
        {
          characterId: "abuSaeed",
          text: "والله فعلاً… أنا ما كنتش واخد بالي من ده بالشكل ده. فعلاً القسم شكله مليان بس مش كل اللي بيدخل بيشتري… يعني الحركة مش معناها بيع.",
          mood: "happy" as const,
        },
        {
          characterId: "abuSaeed",
          text: "أنا كنت حاسس إن المحل كله فيه مشكلة… بس أنت خلّيتني أشوف إن الموضوع أضيق من كده. شكراً يا أستاذ… فعلاً فرق معايا.",
          mood: "happy" as const,
        },
      ]
    : [
        {
          characterId: "detective",
          text: `أبو سعيد… بعد الأسئلة اللي سألتها، أنا شايف إن ${chosenFraming?.text?.slice(0, 80) || "المشكلة"}.`,
          mood: "neutral" as const,
        },
        {
          characterId: "abuSaeed",
          text: "مش عارف يا أستاذ… مش حاسس إن ده هو اللي بيحصل عندي بالظبط. يعني الكلام منطقي بس مش مطابق لإحساسي.",
          mood: "suspicious" as const,
        },
        {
          characterId: "abuSaeed",
          text: "يعني أنا مقدّر مجهودك… بس كنت متوقع الصورة تكون أوضح شوية. مش مشكلة… خلينا نشوف.",
          mood: "neutral" as const,
        },
      ];

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0">
        <img src={storeFrontImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <EnhancedDialogue
        dialogues={dialogues}
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
