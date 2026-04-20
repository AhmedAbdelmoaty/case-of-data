import type { DialogueLine } from "./types";

export const ABU_SAEED_DEBRIEF_STRONG: DialogueLine[] = [
  { characterId: "abuSaeed", text: "يعني أنا كنت باعتبر السنة اللي فاتت هي الطبيعي... وهي أصلًا ما كانتش الطبيعي؟", mood: "concerned" },
  { characterId: "detective", text: "بالضبط. وده اللي خلى إحساس المشكلة أكبر من الواقع الفعلي.", mood: "confident" },
  { characterId: "abuSaeed", text: "كده الصورة وضحت جدًا... أنا فعلًا كنت داخل على قرار بسرعة من غير ما أراجع المقارنة نفسها.", mood: "neutral" },
];

export const ABU_SAEED_DEBRIEF_MEDIUM: DialogueLine[] = [
  { characterId: "abuSaeed", text: "يعني المقارنة اللي أنا عاملها محتاجة مراجعة، ومش شرط يكون عندي مشكلة بيع بالشكل اللي كنت فاكره؟", mood: "concerned" },
  { characterId: "detective", text: "أيوه، بالضبط. لازم نثبت المرجع الأول قبل ما نبني عليه قرار.", mood: "neutral" },
  { characterId: "abuSaeed", text: "فاهم... يعني أنا كنت محتاج أحدد المشكلة بدقة أكتر قبل ما أتحرك.", mood: "neutral" },
];

export const ABU_SAEED_DEBRIEF_WEAK: DialogueLine[] = [
  { characterId: "abuSaeed", text: "يعني حضرتك شايف نعمل عروض ونشوف؟", mood: "concerned" },
  { characterId: "detective", text: "أيوه، ده ممكن يكون اتجاه مناسب.", mood: "uncertain" },
  { characterId: "abuSaeed", text: "ماشي... بس كنت حاسس إني محتاج أفهم الأول قبل ما أتحرك.", mood: "concerned" },
];