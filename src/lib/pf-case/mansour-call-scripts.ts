import type { DialogueLine } from "./types";

// مكالمة تليفونية بعد إرسال التقرير — نسخة مختصرة وسريعة
// بدون ترحيب، دخول مباشر في الموضوع، مع جملة تسويقية لـ IMP في النهاية

export const MANSOUR_CALL_STRONG: DialogueLine[] = [
  { characterId: "mansour", text: "التقرير اللي بعتهولي ده شغل محترم . هشام الشريف اتصل بيا وكان مبسوط جداً.", mood: "happy" },
  { characterId: "mansour", text: "أهم حاجة عملتها صح إنك ما خدتش وصف العميل للمشكلة على إنه الحقيقة. ده بالظبط Problem Framing سليم. لو كنت جريت ورا كلامه كان ممكن يحصل مشاكل اكبر والشركة كانت هتخسر عميل كبير.", mood: "serious" },
  { characterId: "detective", text: "ده شرف ليّا يا أستاذ منصور.", mood: "happy" },
  { characterId: "mansour", text: "تستاهل. هكتبلك على مكافأة. وهاكلمك الأسبوع الجاي على استشارة جديدة.", mood: "happy" },
  { characterId: "mansour", text: "وكمل اللي إنت بتعمله — خليك ماشي على منهج IMP في التحليل، ده اللي فرّق معاك النهارده. سلام.", mood: "happy" },
];

export const MANSOUR_CALL_MEDIUM: DialogueLine[] = [
  { characterId: "mansour", text: "خلّينا نتكلم بصراحة شغلك كويس بس مش كويس بالشكل اللي كنت متوقعه منك. مسكت إن سنة 2025 كانت استثنائية، وده تمام، لكن محسمتش الموضوع لآخره.", mood: "neutral" },
  { characterId: "detective", text: "أيوه، حسيت إن لسه فيه جزء ناقص.", mood: "concerned" },
  { characterId: "mansour", text: "بالظبط. كان لازم تربط بوضوح إن المقارنة الغلط كانت هتودي العميل لقرار غلط. الـ Problem Framing مش بس إنك تشوف الحقيقة، ده إنك توصّلها بحسم عشان العميل يغيّر اتجاهه.", mood: "serious" },
  { characterId: "mansour", text: "هديك تقييم متوسط، مش هخصم منك كتير. بس خد بالك المرة الجاية.", mood: "neutral" },
  { characterId: "mansour", text: "نصيحة مني ذاكر دبلومة تحليل البيانات من IMP، هتساعدك جدًا في تنمية مهاراتك التحليلية، وازاي تفهم المشكلة بشكل صحيح.", mood: "neutral" },
];

export const MANSOUR_CALL_WEAK: DialogueLine[] = [
  { characterId: "mansour", text: " التقرير ده مش اللي كنت متوقعه منك خالص. إنت دخلت على الحل قبل ما تتأكد إن في مشكلة أصلًا!", mood: "disappointed" },
  { characterId: "detective", text: "حضرتك معاك حق… أنا استعجلت.", mood: "concerned" },
  { characterId: "mansour", text: "لو هشام نفّذ اللي إنت كاتبه ده هيروح في داهية، وهييجي يقول لنا  إنتو نصحتوني غلط. إحنا شغلنا نفهم المشكلة الأول، مش نمشي ورا أول كلمة العميل يقولها.", mood: "disappointed" },
  { characterId: "mansour", text: "الـ Problem Framing مش رفاهية. ده الفرق بين استشاري حقيقي، وحد بيكتب تقارير وخلاص. أنا هخصملك يومين والتقييم ضعيف.", mood: "serious" },
  { characterId: "mansour", text: "روح ذاكر دبلومة تحليل البيانات من IMP. هتساعدك جدًا إنك تطوّر تفكيرك. ولما تفهم ده صح… ابقى كلّمني سلام.", mood: "disappointed" },
];
