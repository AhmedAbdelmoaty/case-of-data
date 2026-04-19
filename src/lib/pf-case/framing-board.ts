// ============================================================
// Framing Board — 4 sections × 4 options, in plain shopkeeper Arabic
// ============================================================
// Rewritten to remove technical jargon (baseline, patterns, تشغيلي, etc.)

export interface FramingChoice {
  id: string;
  text: string;
}

export interface FramingSection {
  id: "client_view" | "hypothesis" | "true_frame" | "next_decision";
  title: string;
  options: FramingChoice[];
}

export interface FramingSelection {
  client_view: string | null;
  hypothesis: string | null;
  true_frame: string | null;
  next_decision: string | null;
}

export const FRAMING_SECTIONS: FramingSection[] = [
  {
    id: "client_view",
    title: "1. أبو سعيد كان شايف المشكلة إزاي؟",
    options: [
      { id: "cv_lower_than_expected", text: "إن مبيعات الشهر أقل من اللي هو متوقّعها." },
      { id: "cv_team_weak", text: "إن فريق البيع ضعيف ومش بيشتغل صح." },
      { id: "cv_competitors", text: "إن المنافسين بياخدوا منه السوق." },
      { id: "cv_marketing", text: "إن التسويق ضعيف ومحتاج حملات إعلانية." },
    ],
  },
  {
    id: "hypothesis",
    title: "2. الفرضية اللي مشيت وراها أثناء الأسئلة",
    options: [
      {
        id: "hp_baseline_unchecked",
        text: "المقارنة اللي بنى عليها كلامه نفسها مش مفحوصة — يمكن المرجع غلط.",
      },
      {
        id: "hp_internal_execution",
        text: "في ضعف في تنفيذ الفريق الداخلي.",
      },
      {
        id: "hp_ops_disruption",
        text: "في خلل في الشغل اليومي — البضاعة بتتأخر، والبيع بيتأثر.",
      },
      {
        id: "hp_external_pressure",
        text: "في ضغط من بره — منافسين أو ضعف طلب في السوق.",
      },
    ],
  },
  {
    id: "true_frame",
    title: "3. التأطير الأدق للمشكلة",
    options: [
      {
        id: "tf_misleading_baseline",
        text: "المقارنة اللي بنى عليها قراره مش متينة — بيقارن بسنة كانت استثنائية، مش بسنة عادية.",
      },
      {
        id: "tf_internal_gap",
        text: "في فجوة في شغل الفريق محتاجة تدريب ومتابعة.",
      },
      {
        id: "tf_operational",
        text: "في مشكلة في تنظيم الشغل اليومي وإدارة البضاعة.",
      },
      {
        id: "tf_pricing_marketing",
        text: "في ضغط من السوق على السعر، ومحتاج عروض وحملات.",
      },
    ],
  },
  {
    id: "next_decision",
    title: "4. القرار التالي اللي تنصح بيه",
    options: [
      {
        id: "nd_revalidate_baseline",
        text: "نراجع المقارنة الأول قبل أي قرار، ونشوف الأرقام بدون الأوردر الاستثنائي.",
      },
      {
        id: "nd_training",
        text: "نعمل برنامج تدريب ومتابعة منتظمة للفريق.",
      },
      {
        id: "nd_ops_fix",
        text: "نحسّن تنظيم الشغل اليومي وإدارة البضاعة.",
      },
      {
        id: "nd_promotions",
        text: "نطلق عروض وحملات إعلانية على طول.",
      },
    ],
  },
];

export const CORRECT_FRAMING = {
  client_view: "cv_lower_than_expected",
  hypothesis: "hp_baseline_unchecked",
  true_frame: "tf_misleading_baseline",
  next_decision: "nd_revalidate_baseline",
} as const;

export function countCorrectFraming(selection: FramingSelection): number {
  let n = 0;
  if (selection.client_view === CORRECT_FRAMING.client_view) n++;
  if (selection.hypothesis === CORRECT_FRAMING.hypothesis) n++;
  if (selection.true_frame === CORRECT_FRAMING.true_frame) n++;
  if (selection.next_decision === CORRECT_FRAMING.next_decision) n++;
  return n;
}
