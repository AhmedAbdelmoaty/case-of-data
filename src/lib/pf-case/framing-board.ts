// ============================================================
// Framing Board — 4 sections × 4 options, OPEN to all players
// ============================================================

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
      { id: "cv_lower_than_expected", text: "إن مبيعات الشهر أقل من المتوقع." },
      { id: "cv_team_weak", text: "إن فريق البيع ضعيف." },
      { id: "cv_competitors", text: "إن المنافسين بياخدوا منه السوق." },
      { id: "cv_marketing", text: "إن التسويق ضعيف ومحتاج حملات." },
    ],
  },
  {
    id: "hypothesis",
    title: "2. الفرضية اللي مشيت وراها أثناء الأسئلة",
    options: [
      { id: "hp_baseline_unchecked", text: "المقارنة نفسها مش مفحوصة، والـ baseline ممكن تكون مضللة." },
      { id: "hp_internal_execution", text: "ضعف في التنفيذ الداخلي وأداء الفريق." },
      { id: "hp_ops_disruption", text: "اضطراب تشغيلي داخل الشهر (stock، تذبذب يومي)." },
      { id: "hp_external_pressure", text: "ضغط خارجي من المنافسين أو ضعف في الطلب التسويقي." },
    ],
  },
  {
    id: "true_frame",
    title: "3. التأطير الأدق للمشكلة",
    options: [
      { id: "tf_misleading_baseline", text: "الـ baseline مضللة — السنة اللي فاتت كانت استثنائية بسبب أوردر شركات." },
      { id: "tf_internal_gap", text: "فجوة في التنفيذ الداخلي محتاجة تدريب ومتابعة." },
      { id: "tf_operational", text: "مشكلة تشغيلية يومية محتاجة تنظيم stock وساعات العمل." },
      { id: "tf_pricing_marketing", text: "ضغط سعري/تسويقي محتاج عروض وحملات." },
    ],
  },
  {
    id: "next_decision",
    title: "4. القرار التالي المقترح",
    options: [
      { id: "nd_revalidate_baseline", text: "نعيد تقييم المرجع قبل أي تدخل، ونفحص الأرقام بدون الأوردر الاستثنائي." },
      { id: "nd_training", text: "نعمل برنامج تدريب ومتابعة للفريق." },
      { id: "nd_ops_fix", text: "نحسّن التشغيل اليومي وإدارة الـ stock." },
      { id: "nd_promotions", text: "نطلق عروض/حملات تسويقية فورية." },
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
