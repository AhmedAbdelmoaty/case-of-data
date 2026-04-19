import type { NoteCandidate } from "./types";

export const NOTES_CATALOG: Record<string, NoteCandidate> = {
  note_claim_opened: {
    id: "note_claim_opened",
    text: "أبو سعيد حاسس إن الموسم أهدى من اللي كان عامله حسابه.",
    type: "claim",
    internalWeight: "useful_clue",
  },
  note_claim_defined: {
    id: "note_claim_defined",
    text: "المشكلة اللي شايفها أبو سعيد مرتبطة برقم البيع النهائي، مش بمجرد إحساس عام.",
    type: "claim",
    internalWeight: "strong_clue",
  },
  note_context_season_important: {
    id: "note_context_season_important",
    text: "الفترة الحالية موسم مهم بالنسبة لأبو سعيد، وداخلها بتوقعات عالية.",
    type: "context",
    internalWeight: "useful_clue",
  },
  note_request_discounts: {
    id: "note_request_discounts",
    text: "أبو سعيد كان بيميل يعمل عروض أو تخفيضات عشان يحرّك البيع.",
    type: "request",
    internalWeight: "strong_clue",
  },
  note_stakes_high_expectation: {
    id: "note_stakes_high_expectation",
    text: "قلق أبو سعيد مرتبط إن الفترة دي لازم تطلع بنتيجة قوية بالنسبة له.",
    type: "stake",
    internalWeight: "useful_clue",
  },
  note_baseline_last_year: {
    id: "note_baseline_last_year",
    text: "أبو سعيد بيقارن الأداء الحالي بنفس الفترة من السنة اللي فاتت.",
    type: "baseline",
    internalWeight: "strong_clue",
  },
  note_comparison_not_trend: {
    id: "note_comparison_not_trend",
    text: "قلق أبو سعيد جاي من المقارنة أكتر من كونه شايف تراجع مستمر واضح.",
    type: "baseline",
    internalWeight: "useful_clue",
  },
  note_reality_not_collapsing: {
    id: "note_reality_not_collapsing",
    text: "الواقع الحالي ما فيهوش علامة واضحة إن المحل واقع أو إن الحركة مختفية.",
    type: "reality",
    internalWeight: "strong_clue",
  },
  note_baseline_not_normal: {
    id: "note_baseline_not_normal",
    text: "السنة اللي فاتت ما كانتش سنة عادية تمامًا، وكان فيها عوامل خلتها أعلى من الطبيعي.",
    type: "baseline_doubt",
    internalWeight: "strong_clue",
  },
  note_comparison_method_weak: {
    id: "note_comparison_method_weak",
    text: "أبو سعيد غالبًا بيعتمد على السنة اللي قبلها فقط في الحكم، من غير ما يفتح مقارنة أوسع.",
    type: "baseline_doubt",
    internalWeight: "useful_clue",
  },
  note_exceptional_year: {
    id: "note_exceptional_year",
    text: "السنة اللي فاتت كانت أعلى من الطبيعي، ومش مناسبة كمرجع عادي للمقارنة.",
    type: "exceptional_factor",
    internalWeight: "strong_clue",
  },
  note_exceptional_cause: {
    id: "note_exceptional_cause",
    text: "كان في افتتاح كبير قريب من المنطقة السنة اللي فاتت، وده رفع الحركة والبيع بشكل استثنائي.",
    type: "exceptional_factor",
    internalWeight: "strong_clue",
  },
  note_weak_price_guess: {
    id: "note_weak_price_guess",
    text: "تم طرح احتمال إن الأسعار السبب، لكن من غير دليل واضح.",
    type: "assumption",
    internalWeight: "misleading_clue",
  },
  note_weak_staff_guess: {
    id: "note_weak_staff_guess",
    text: "تم طرح احتمال إن المشكلة من الموظفين، لكن من غير أساس واضح.",
    type: "assumption",
    internalWeight: "misleading_clue",
  },
  note_weak_competition_guess: {
    id: "note_weak_competition_guess",
    text: "تم طرح احتمال إن المنافسة هي السبب، لكن من غير ما يكون ده مفسر كفاية.",
    type: "assumption",
    internalWeight: "misleading_clue",
  },
  note_solution_jump: {
    id: "note_solution_jump",
    text: "القفز المبكر لفكرة العروض حصل قبل ما يتفهم أصل المشكلة.",
    type: "weak_opinion",
    internalWeight: "misleading_clue",
  },
};
