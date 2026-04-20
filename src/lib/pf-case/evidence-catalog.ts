// ============================================================
// Evidence Catalog — REPORT documents (delivered as printed papers)
// ============================================================
// Each "evidence" represents a real report Abu Saeed hands over.
// Carries: title, issuer (stamp), date, footnote — to feel like a real document.
// All numeric facts live HERE, never in dialogue text.

export type EvidenceChartType =
  | "bar"
  | "stacked_bar"
  | "grouped_bar"
  | "line"
  | "table"
  | "list";

export interface EvidenceDataRow {
  label: string;
  value?: number;
  // For stacked bars
  individuals?: number;
  corporate?: number;
  // For tables
  cells?: string[];
}

export interface EvidenceData {
  id: string;
  title: string;
  type: EvidenceChartType;
  caption?: string;
  /** Document metadata — gives the report-document feel */
  issuer?: string;          // "محاسبة محل أبو سعيد"
  reportDate?: string;      // "مارس 2026"
  footnote?: string;        // small note printed on the paper
  rows: EvidenceDataRow[];
  series?: { key: "value" | "individuals" | "corporate"; label: string; color?: string }[];
  headers?: string[];
  /** Optional fixed Y axis bounds + ticks — used to exaggerate visual differences on key reports */
  yMax?: number;
  yTicks?: number[];
}

export const EVIDENCE: Record<string, EvidenceData> = {
  // === SPINE ===
  ev_year_vs_year: {
    id: "ev_year_vs_year",
    title: "تقرير مبيعات شهرية — مقارنة فبراير 2025 / فبراير 2026",
    type: "bar",
    issuer: "محاسبة محل أبو سعيد",
    reportDate: "مارس 2026",
    caption: "مقارنة إجمالي المبيعات بين نفس الشهر في السنتين.",
    footnote: "الأرقام بالألف جنيه مصري، صافي مبيعات بعد المرتجعات.",
    rows: [
      { label: "فبراير 2025", value: 720 },
      { label: "فبراير 2026", value: 500 },
    ],
    series: [{ key: "value", label: "ألف جنيه" }],
    yMax: 800,
    yTicks: [0, 100, 200, 300, 400, 500, 600, 700, 800],
  },
  ev_three_year: {
    id: "ev_three_year",
    title: "تقرير مبيعات فبراير — على مدى 3 سنين",
    type: "bar",
    issuer: "محاسبة محل أبو سعيد",
    reportDate: "مارس 2026",
    caption: "مبيعات شهر فبراير في السنوات الثلاث الأخيرة.",
    footnote: "الأرقام بالألف جنيه. التقرير بيوضح إن سنة 2025 طالعة بشكل ملحوظ عن السنتين التانيين.",
    rows: [
      { label: "فبراير 2024", value: 480 },
      { label: "فبراير 2025", value: 720 },
      { label: "فبراير 2026", value: 500 },
    ],
    series: [{ key: "value", label: "ألف جنيه" }],
    yMax: 800,
    yTicks: [0, 100, 200, 300, 400, 500, 600, 700, 800],
  },
  ev_breakdown: {
    id: "ev_breakdown",
    title: "تقرير تفصيلي — تقسيم مبيعات فبراير حسب نوع البيع",
    type: "grouped_bar",
    issuer: "محاسبة محل أبو سعيد",
    reportDate: "مارس 2026",
    caption: "كل سنة فيها عمودين: بيع أفراد (تجزئة) جنب بيع شركات (جملة) — عشان يبان التدرج في كل نوع لوحده.",
    footnote:
      "الأرقام بالألف جنيه. ملاحظة المحاسبة: في فبراير 2025 جالنا أوردر شركات استثنائي (حوالي 290 ألف) من عميل واحد، مش بيتكرر كل سنة.",
    rows: [
      { label: "فبراير 2024", individuals: 390, corporate: 90 },
      { label: "فبراير 2025", individuals: 430, corporate: 290 },
      { label: "فبراير 2026", individuals: 480, corporate: 20 },
    ],
    series: [
      { key: "individuals", label: "أفراد" },
      { key: "corporate", label: "شركات" },
    ],
    yMax: 500,
    yTicks: [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
  },

  // === TRACK A ===
  ev_team_performance: {
    id: "ev_team_performance",
    title: "تقرير أداء فريق البيع — فبراير 2026",
    type: "bar",
    issuer: "محاسبة محل أبو سعيد",
    reportDate: "مارس 2026",
    caption: "إجمالي مبيعات كل بائع للشهر الحالي.",
    footnote: "الأرقام بالألف جنيه. الفريق مكوّن من 4 بائعين بدوام كامل.",
    rows: [
      { label: "كريم", value: 110 },
      { label: "سامح", value: 75 },
      { label: "وليد", value: 60 },
      { label: "هاني", value: 55 },
    ],
    series: [{ key: "value", label: "ألف جنيه" }],
  },
  ev_team_conversion: {
    id: "ev_team_conversion",
    title: "تقرير نسبة الإقفال (التحويل) لكل بائع",
    type: "table",
    issuer: "محاسبة محل أبو سعيد",
    reportDate: "مارس 2026",
    footnote: "نسبة التحويل = عدد البيعات ÷ عدد الزباين اللي تعامل معاهم البائع.",
    headers: ["البائع", "نسبة الإقفال"],
    rows: [
      { label: "كريم", cells: ["كريم", "28%"] },
      { label: "سامح", cells: ["سامح", "21%"] },
      { label: "وليد", cells: ["وليد", "17%"] },
      { label: "هاني", cells: ["هاني", "16%"] },
    ],
  },

  // === TRACK B ===
  ev_daily_sales: {
    id: "ev_daily_sales",
    title: "تقرير المبيعات اليومية — فبراير 2026",
    type: "line",
    issuer: "محاسبة محل أبو سعيد",
    reportDate: "مارس 2026",
    caption: "حركة البيع اليومية على مدار الشهر.",
    footnote: "الأرقام بالألف جنيه/يوم. الإجمالي الشهري حوالي 500 ألف جنيه.",
    rows: [
      { label: "ي1", value: 15 },
      { label: "ي5", value: 18 },
      { label: "ي10", value: 14 },
      { label: "ي15", value: 20 },
      { label: "ي20", value: 16 },
      { label: "ي25", value: 17 },
      { label: "ي30", value: 12 },
    ],
    series: [{ key: "value", label: "ألف جنيه/يوم" }],
    yMax: 25,
    yTicks: [0, 5, 10, 15, 20, 25],
  },
  ev_weekly_sales: {
    id: "ev_weekly_sales",
    title: "تقرير المبيعات الأسبوعية — فبراير 2026",
    type: "bar",
    issuer: "محاسبة محل أبو سعيد",
    reportDate: "مارس 2026",
    caption: "إجمالي البيع لكل أسبوع في الشهر.",
    footnote: "الأرقام بالألف جنيه. الأسبوع الرابع هو الأقل بشكل واضح.",
    rows: [
      { label: "أسبوع 1", value: 130 },
      { label: "أسبوع 2", value: 155 },
      { label: "أسبوع 3", value: 120 },
      { label: "أسبوع 4", value: 95 },
    ],
    series: [{ key: "value", label: "ألف جنيه" }],
    yMax: 180,
    yTicks: [0, 45, 90, 135, 180],
  },

  // === TRACK C ===
  ev_competitor_offers: {
    id: "ev_competitor_offers",
    title: "ملخص عروض المنافسين الحاليين",
    type: "list",
    issuer: "متابعة أبو سعيد الشخصية",
    reportDate: "فبراير 2026",
    footnote: "ملاحظات مجمّعة من زيارات شخصية للمحلات المجاورة.",
    rows: [
      { label: "محل 1: خصم 10% على المجموعات الكاملة" },
      { label: "محل 2: عرض 2+1 على موديلات مختارة" },
      { label: "محل 3: حملة سوشيال ميديا + توصيل مجاني" },
      { label: "محل 4: كوبونات لعملاء الـ Loyalty" },
    ],
  },
  ev_customer_feedback: {
    id: "ev_customer_feedback",
    title: "ملاحظات العملاء الأخيرة",
    type: "list",
    issuer: "دفتر ملاحظات أبو سعيد",
    reportDate: "فبراير 2026",
    footnote: "تعليقات شفوية مسجّلة من زباين الفترة الأخيرة.",
    rows: [
      { label: "«السعر غالي شوية مقارنة بالشارع»" },
      { label: "«مفيش عروض الفترة دي»" },
      { label: "«الجودة كويسة بس بدور على خصم»" },
    ],
  },

  // === TRACK D ===
  ev_marketing: {
    id: "ev_marketing",
    title: "ملخص أداء التسويق — فبراير 2025 vs فبراير 2026",
    type: "table",
    issuer: "متابعة أبو سعيد للحملات",
    reportDate: "مارس 2026",
    footnote: "بيانات مجمّعة من حسابات السوشيال ميديا والإعلانات الممولة.",
    headers: ["المؤشر", "فبراير 2025", "فبراير 2026"],
    rows: [
      { label: "ميزانية", cells: ["ميزانية شهرية", "18 ألف", "12 ألف"] },
      { label: "reach", cells: ["وصول الإعلانات", "420 ألف", "380 ألف"] },
      { label: "engagement", cells: ["نسبة التفاعل", "3.1%", "2.9%"] },
      { label: "campaigns", cells: ["حملات نشطة", "2", "0"] },
    ],
  },
};
