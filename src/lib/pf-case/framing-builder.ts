import type { FramingBuilderSection } from "./types";

export const FRAMING_BUILDER_SECTIONS: FramingBuilderSection[] = [
  {
    id: "client_view",
    title: "أبو سعيد كان شايف المشكلة في:",
    options: [
      { id: "client_view_expected_lower", text: "إن الموسم الحالي أقل من المتوقع.", isCorrect: true },
      { id: "client_view_people_not_buying", text: "إن الناس مش بتشتري أصلًا.", isCorrect: false },
      { id: "client_view_traffic_low", text: "إن الحركة ضعيفة جوه المحل.", isCorrect: false },
      { id: "client_view_prices_high", text: "إن الأسعار هي المشكلة الأساسية.", isCorrect: false },
    ],
  },
  {
    id: "flaw_in_view",
    title: "الخلل في فهمه الحالي كان:",
    options: [
      { id: "flaw_unchecked_comparison", text: "اعتمد على مقارنة غير مفحوصة.", isCorrect: true },
      { id: "flaw_solution_before_understanding", text: "قفز لحل قبل ما يفهم أصل المشكلة.", isCorrect: true },
      { id: "flaw_traffic_purchase_confusion", text: "خلط بين الحركة والشراء فقط.", isCorrect: false },
      { id: "flaw_staff_issue", text: "ركز على مشكلة داخلية في الفريق.", isCorrect: false },
    ],
  },
  {
    id: "true_frame",
    title: "التأطير الأدق للمشكلة هو:",
    options: [
      { id: "true_frame_baseline", text: "المشكلة في baseline المستخدمة للحكم على الأداء.", isCorrect: true },
      { id: "true_frame_conversion", text: "المشكلة في التحويل داخل المتجر.", isCorrect: false },
      { id: "true_frame_prices", text: "المشكلة في مستوى الأسعار.", isCorrect: false },
      { id: "true_frame_sales_team", text: "المشكلة في أداء فريق البيع.", isCorrect: false },
    ],
  },
  {
    id: "next_decision",
    title: "القرار الصحيح الآن هو:",
    options: [
      { id: "next_decision_fix_baseline", text: "إعادة تقييم الأداء على مرجع طبيعي وعادل قبل أي قرار تسعير.", isCorrect: true },
      { id: "next_decision_discount_now", text: "البدء فورًا في عروض أو تخفيضات.", isCorrect: false },
      { id: "next_decision_wait_only", text: "الانتظار فقط من غير إعادة تقييم.", isCorrect: false },
      { id: "next_decision_change_staff", text: "مراجعة الموظفين وتحميلهم مسؤولية النتيجة.", isCorrect: false },
    ],
  },
];
