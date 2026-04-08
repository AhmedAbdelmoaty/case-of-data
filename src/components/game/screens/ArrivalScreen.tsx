import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, DoorOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { gText } from "@/lib/gText";
import { InteractiveDialogue, type TimelineEntry } from "../InteractiveDialogue";
import { PFNotebook } from "../PFNotebook";
import { INQUIRY_ROUNDS, FRAMING_OPTIONS } from "@/data/pf-scenario";
import { usePFGame } from "@/contexts/PFGameContext";
import storeFrontImg from "@/assets/scenes/store-front.png";
import type { ChoiceOption } from "../InteractiveDialogue";

interface ArrivalScreenProps {
  onComplete: () => void;
}

export const ArrivalScreen = ({ onComplete }: ArrivalScreenProps) => {
  const { profile } = useAuth();
  const { chooseQuestion, addNote, chooseFraming } = usePFGame();
  const g = profile?.gender || "male";
  const name = profile?.display_name || "محلل";
  const [phase, setPhase] = useState<"storefront" | "conversation">("storefront");
  const [savedNoteIds, setSavedNoteIds] = useState<string[]>([]);

  // Build the full timeline: intro dialogue + 7 inquiry rounds + framing
  const timeline = useMemo((): TimelineEntry[] => {
    const entries: TimelineEntry[] = [];

    // ---- Intro dialogue with Abu Saeed ----
    entries.push({
      type: "line",
      line: {
        characterId: "abuSaeed",
        text: `أهلاً وسهلاً… ${gText("نوّرت", "نوّرتي", g)} يا ${gText("أستاذ", "أستاذة", g)}. ${gText("اتفضل", "اتفضلي", g)}.`,
        mood: "happy",
      },
    });
    entries.push({
      type: "line",
      line: {
        characterId: "abuSaeed",
        text: "أنا أبو سعيد. المحل ده بقالي فيه أكتر من 12 سنة والحمد لله… عملته بإيدي من الصفر.",
        mood: "neutral",
      },
    });
    entries.push({
      type: "line",
      line: {
        characterId: "abuSaeed",
        text: "بس من كام أسبوع كده… حاسس إن فيه حاجة مش مظبوطة.",
        mood: "nervous",
      },
    });
    entries.push({
      type: "line",
      line: {
        characterId: "abuSaeed",
        text: "الحركة في المحل كويسة… الناس بتيجي وبتتفرج وبتدخل وبتطلع… يعني المحل مش فاضي.",
        mood: "neutral",
      },
    });
    entries.push({
      type: "line",
      line: {
        characterId: "abuSaeed",
        text: "بس لما باجي أحسب آخر الأسبوع… بلاقي الرقم أقل من اللي متوقعه. مش عارف ليه. الحركة كويسة بس الفلوس مش بتيجي زي الأول.",
        mood: "nervous",
      },
    });
    entries.push({
      type: "line",
      line: {
        characterId: "detective",
        text: "طيب… خليني أسألك كام سؤال عشان أفهم الصورة كويس.",
        mood: "neutral",
      },
    });
    entries.push({
      type: "line",
      line: {
        characterId: "abuSaeed",
        text: `اتفضل… اسأل اللي ${gText("عايزه", "عايزاه", g)}. أنا محتاج حد يفهمني إيه اللي بيحصل.`,
        mood: "neutral",
      },
    });

    // ---- 7 Inquiry Rounds as choice breakpoints ----
    INQUIRY_ROUNDS.forEach((round) => {
      entries.push({
        type: "choice",
        options: round.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          tier: opt.tier,
          points: opt.points,
          response: opt.response,
          responseCharacterId: "abuSaeed",
          responseMood: (opt.tier === "strong" ? "nervous" : "neutral") as "neutral" | "nervous",
          isSaveable: true,
          saveId: `round-${round.id}`,
        })),
      });
    });

    // ---- Transition to framing ----
    entries.push({
      type: "line",
      line: {
        characterId: "abuSaeed",
        text: "طيب… أنا قولتلك كل حاجة أعرفها. إنت دلوقتي إيه رأيك؟ إيه المشكلة الحقيقية؟",
        mood: "nervous",
      },
    });

    // ---- Framing as a choice breakpoint ----
    entries.push({
      type: "choice",
      options: FRAMING_OPTIONS.map((f) => ({
        id: f.id,
        text: f.text,
        response: f.isCorrect
          ? "يا ساتر… فعلاً! أنا ما كنتش شايف الصورة دي خالص. شكراً ليك — دلوقتي فاهم المشكلة."
          : "ممكن… بس مش حاسس إن دي الصورة الكاملة.",
        responseCharacterId: "abuSaeed",
        responseMood: (f.isCorrect ? "happy" : "nervous") as "happy" | "nervous",
      })),
    });

    return entries;
  }, [g, name]);

  const handleChoice = useCallback((optionId: string, option: any) => {
    // Check if it's an inquiry round choice
    for (const round of INQUIRY_ROUNDS) {
      const found = round.options.find((o) => o.id === optionId);
      if (found) {
        chooseQuestion(found);
        return;
      }
    }
    // Check if it's a framing choice
    const framingOption = FRAMING_OPTIONS.find((f) => f.id === optionId);
    if (framingOption) {
      chooseFraming(optionId);
    }
  }, [chooseQuestion, chooseFraming]);

  const handleSaveNote = useCallback((saveId: string, saveText: string) => {
    if (!savedNoteIds.includes(saveId)) {
      setSavedNoteIds((prev) => [...prev, saveId]);
      const roundNum = parseInt(saveId.replace("round-", ""), 10);
      if (!isNaN(roundNum)) {
        addNote(roundNum, saveText);
      }
    }
  }, [savedNoteIds, addNote]);

  if (phase === "storefront") {
    return (
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img src={storeFrontImg} alt="Store Front" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <motion.div
            className="flex flex-col items-center px-8 py-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 mb-6"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-bold">وصلت المتجر</span>
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-0.5 drop-shadow-lg">
              Fashion House
            </h1>
            <p className="text-white/70 text-xs" dir="rtl">أبو سعيد مستنيك جوه</p>
          </motion.div>

          <motion.button
            className="relative px-8 py-3 rounded-xl text-base font-bold overflow-hidden group"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
            onClick={() => setPhase("conversation")}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10 flex items-center gap-2 text-white">
              <DoorOpen className="w-5 h-5" />
              ادخل المتجر
            </span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />

      <motion.div
        className="relative z-10 pt-12 pb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-muted-foreground text-sm">داخل المتجر 🏪</p>
        <h2 className="text-accent font-bold text-lg">Fashion House</h2>
      </motion.div>

      <PFNotebook />

      <InteractiveDialogue
        timeline={timeline}
        isActive={phase === "conversation"}
        onComplete={onComplete}
        onChoice={handleChoice}
        onSaveNote={handleSaveNote}
        savedNoteIds={savedNoteIds}
        playerName={name}
        playerGender={g as "male" | "female"}
      />
    </div>
  );
};
