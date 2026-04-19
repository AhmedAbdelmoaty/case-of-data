// ============================================================
// Evidence Catalog — chart definitions rendered inline in dialogue
// ============================================================

export type EvidenceChartType =
  | "bar"
  | "stacked_bar"
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
  rows: EvidenceDataRow[];
  /** For stacked bars / multi-series bars: legend labels */
  series?: { key: "value" | "individuals" | "corporate"; label: string; color?: string }[];
  /** For table type */
  headers?: string[];
}

export const EVIDENCE: Record<string, EvidenceData> = {
  // === SPINE ===
  ev_year_vs_year: {
    id: "ev_year_vs_year",
    title: "مبيعات الشهر — السنة دي vs السنة اللي فاتت",
    type: "bar",
    caption: "فرق حوالي 30% بين الشهرين.",
    rows: [
      { label: "نفس الشهر — السنة اللي فاتت", value: 430 },
      { label: "الشهر الحالي", value: 300 },
    ],
    series: [{ key: "value", label: "ألف جنيه" }],
  },
  ev_three_year: {
    id: "ev_three_year",
    title: "مبيعات نفس الشهر — 3 سنين",
    type: "bar",
    caption: "السنة اللي فاتت طالعة عن الباقي بشكل واضح.",
    rows: [
      { label: "السنة الأسبق", value: 290 },
      { label: "السنة اللي فاتت", value: 430 },
      { label: "السنة دي", value: 300 },
    ],
    series: [{ key: "value", label: "ألف جنيه" }],
  },
  ev_breakdown: {
    id: "ev_breakdown",
    title: "تفكيك المبيعات — أفراد vs شركات",
    type: "stacked_bar",
    caption:
      "السنة اللي فاتت فيها أوردر شركات استثنائي 150 ألف. لو شيلناه — الأفراد ماشيين في نمو طبيعي 270 → 280 → 290.",
    rows: [
      { label: "السنة الأسبق", individuals: 270, corporate: 20 },
      { label: "السنة اللي فاتت", individuals: 280, corporate: 150 },
      { label: "السنة دي", individuals: 290, corporate: 10 },
    ],
    series: [
      { key: "individuals", label: "أفراد" },
      { key: "corporate", label: "شركات" },
    ],
  },

  // === TRACK A ===
  ev_team_performance: {
    id: "ev_team_performance",
    title: "أداء فريق البيع — الشهر الحالي",
    type: "bar",
    caption: "فروقات واضحة بين الأفراد.",
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
    title: "نسبة التحويل (Conversion) لكل بائع",
    type: "table",
    headers: ["البائع", "نسبة التحويل"],
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
    title: "تقرير المبيعات اليومية — الشهر الحالي",
    type: "line",
    caption: "تذبذب طبيعي. الإجمالي الشهري حوالي 300 ألف.",
    rows: [
      { label: "ي1", value: 9 },
      { label: "ي5", value: 11 },
      { label: "ي10", value: 8 },
      { label: "ي15", value: 12 },
      { label: "ي20", value: 9 },
      { label: "ي25", value: 10 },
      { label: "ي30", value: 7 },
    ],
    series: [{ key: "value", label: "ألف جنيه/يوم" }],
  },
  ev_weekly_sales: {
    id: "ev_weekly_sales",
    title: "مبيعات الشهر — أسبوعياً",
    type: "bar",
    caption: "الأسبوع الأخير الأضعف.",
    rows: [
      { label: "أسبوع 1", value: 78 },
      { label: "أسبوع 2", value: 92 },
      { label: "أسبوع 3", value: 71 },
      { label: "أسبوع 4", value: 59 },
    ],
    series: [{ key: "value", label: "ألف جنيه" }],
  },

  // === TRACK C ===
  ev_competitor_offers: {
    id: "ev_competitor_offers",
    title: "عروض المنافسين الحاليين",
    type: "list",
    rows: [
      { label: "محل 1: خصم 10% على المجموعات الكاملة" },
      { label: "محل 2: عرض 2+1 على موديلات مختارة" },
      { label: "محل 3: حملة سوشيال ميديا + توصيل مجاني" },
      { label: "محل 4: كوبونات لعملاء Loyalty" },
    ],
  },
  ev_customer_feedback: {
    id: "ev_customer_feedback",
    title: "ملاحظات العملاء الأخيرة",
    type: "list",
    rows: [
      { label: "«السعر غالي شوية مقارنة بالشارع»" },
      { label: "«مفيش عروض الفترة دي»" },
      { label: "«الجودة كويسة بس بدور على خصم»" },
    ],
  },

  // === TRACK D ===
  ev_marketing: {
    id: "ev_marketing",
    title: "Dashboard التسويق — السنة دي vs السنة اللي فاتت",
    type: "table",
    headers: ["المؤشر", "السنة اللي فاتت", "السنة دي"],
    rows: [
      { label: "ميزانية", cells: ["ميزانية شهرية", "18 ألف", "12 ألف"] },
      { label: "reach", cells: ["Reach", "420 ألف", "380 ألف"] },
      { label: "engagement", cells: ["Engagement", "3.1%", "2.9%"] },
      { label: "campaigns", cells: ["حملات نشطة", "2", "0"] },
    ],
  },
};
