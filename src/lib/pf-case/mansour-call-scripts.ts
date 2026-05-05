import { genderLine, v } from "@/lib/genderText";
import type { DialogueLine } from "./types";

// مكالمة تليفونية بعد إرسال التقرير — نسخة مختصرة وسريعة
// بدون ترحيب، دخول مباشر في الموضوع، مع جملة تسويقية لـ IMP في النهاية

export const MANSOUR_CALL_STRONG: DialogueLine[] = [
  { characterId: "mansour", text: genderLine(["التقرير اللي ", v("بعتهولي", "بعتيهولي"), " ده شغل محترم . هشام الشريف اتصل بيا وكان مبسوط جداً."]), mood: "happy", audioSrc: "/voiceover/mansour/mansour_call_strong_01.wav" },
  { characterId: "mansour", text: genderLine(["أهم حاجة ", v("عملتها", "عملتيها"), " صح إنك ", v("مخدتش", "مخدتيش"), " وصف العميل للمشكلة على إنه الحقيقة. ده بالظبط Problem Framing سليم. لو ", v("كنت جريت", "كنتي جريتي"), " ورا كلامه كان ممكن يحصل مشاكل اكبر والشركة كانت هتخسر عميل كبير."]), mood: "serious", audioSrc: "/voiceover/mansour/mansour_call_strong_02.wav" },
  { characterId: "detective", text: "ده شرف ليّا يا أستاذ منصور.", mood: "happy", audioSrc: "/voiceover/analyst_male/analyst_ending_strong_response.wav" },
  { characterId: "mansour", text: genderLine([v("تستاهل", "تستاهلي"), ". هكتبلك على مكافأة. وهكلمك الأسبوع الجاي على استشارة جديدة."]), mood: "happy", audioSrc: "/voiceover/mansour/mansour_call_strong_03.wav" },
  { characterId: "mansour", text: genderLine([v("وكمل", "وكمّلي"), " اللي ", v("إنت بتعمله", "إنتي بتعمليه"), " — ", v("خليك ماشي", "خليكي ماشية"), " على منهج IMP في التحليل، ده اللي فرق ", v("معاك", "معاكي"), " النهارده. سلام."]), mood: "happy", audioSrc: "/voiceover/mansour/mansour_call_strong_04.wav" },
];

export const MANSOUR_CALL_WEAK: DialogueLine[] = [
  { characterId: "mansour", text: genderLine([" التقرير ده مش اللي كنت متوقعه منك خالص. ", v("إنت دخلت", "إنتي دخلتي"), " على الحل قبل ما ", v("تتأكد", "تتأكدي"), " إن في مشكلة أصلًا!"]), mood: "disappointed", audioSrc: "/voiceover/mansour/mansour_call_weak_01.wav" },
  { characterId: "detective", text: "حضرتك معاك حق… أنا استعجلت.", mood: "concerned", audioSrc: "/voiceover/analyst_male/analyst_ending_weak_response.wav" },
  { characterId: "mansour", text: genderLine(["لو هشام نفّذ اللي ", v("إنت كاتبه", "إنتي كاتباه"), " ده هيروح في داهية، وهييجي يقول لنا  إنتو نصحتوني غلط. إحنا شغلنا نفهم المشكلة الأول، مش نمشي ورا أول كلمة العميل يقولها."]), mood: "disappointed", audioSrc: "/voiceover/mansour/mansour_call_weak_02.wav" },
  { characterId: "mansour", text: genderLine(["الـ Problem Framing مش رفاهية. ده الفرق بين استشاري حقيقي وحد بيكتب تقارير وخلاص. أنا هخصملك يومين والتقييم ضعيف."]), mood: "serious", audioSrc: "/voiceover/mansour/mansour_call_weak_03.wav" },
  { characterId: "mansour", text: genderLine([v("روح ذاكر", "روحي ذاكري"), " دبلومة تحليل البيانات من IMP. هتساعدك جدًا إنك ", v("تطوّر", "تطوّري"), " تفكيرك. ولما ", v("تفهم", "تفهمي"), " ده صح… ", v("ابقى كلّمني", "ابقي كلّميني"), " سلام."]), mood: "disappointed", audioSrc: "/voiceover/mansour/mansour_call_weak_04.wav" },
];
