import type { DialogueLine } from "./types";

// مكالمة تليفونية بعد إرسال التقرير — نسخة مختصرة وسريعة
// بدون ترحيب، دخول مباشر في الموضوع، مع جملة تسويقية لـ IMP في النهاية

export const MANSOUR_CALL_STRONG: DialogueLine[] = [
  { characterId: "mansour", text: "التقرير اللي بعتهولي ده شغل محترم . هشام الشريف اتصل بيا وكان مبسوط جداً.", mood: "happy", audioSrc: "/voiceover/mansour/mansour_call_strong_01.wav" },
  { characterId: "mansour", text: "أهم حاجة عملتها صح إنك مخدتش وصف العميل للمشكلة على إنه الحقيقة. ده بالظبط Problem Framing سليم. لو كنت جريت ورا كلامه كان ممكن يحصل مشاكل اكبر والشركة كانت هتخسر عميل كبير.", mood: "serious", audioSrc: "/voiceover/mansour/mansour_call_strong_02.wav" },
  { characterId: "detective", text: "ده شرف ليّا يا أستاذ منصور.", mood: "happy", audioSrc: "/voiceover/analyst_male/analyst_ending_strong_response.wav" },
  { characterId: "mansour", text: "تستاهل. هكتبلك على مكافأة. وهكلمك الأسبوع الجاي على استشارة جديدة.", mood: "happy", audioSrc: "/voiceover/mansour/mansour_call_strong_03.wav" },
  { characterId: "mansour", text: "وكمل اللي إنت بتعمله — خليك ماشي على منهج IMP في التحليل، ده اللي فرق معاك النهارده. سلام.", mood: "happy", audioSrc: "/voiceover/mansour/mansour_call_strong_04.wav" },
];

export const MANSOUR_CALL_MEDIUM: DialogueLine[] = [
  { characterId: "mansour", text: "خلّينا نتكلم بصراحة شغلك كويس بس مش كويس بالشكل اللي كنت متوقعه منك. مسكت إن سنة 2025 كانت استثنائية، وده تمام، لكن محسمتش الموضوع لآخره.", mood: "neutral", audioSrc: "/voiceover/mansour/mansour_call_medium_01.wav" },
  { characterId: "detective", text: "أيوه، حسيت إن لسه فيه جزء ناقص.", mood: "concerned", audioSrc: "/voiceover/analyst_male/analyst_ending_medium_response.wav" },
  { characterId: "mansour", text: "بالظبط. كان لازم تربط بوضوح إن المقارنة الغلط كانت هتودي العميل لقرار غلط. الـ Problem Framing مش بس إنك تشوف الحقيقة، ده إنك توصّلها بحسم عشان العميل يغيّر اتجاهه.", mood: "serious", audioSrc: "/voiceover/mansour/mansour_call_medium_02.wav" },
  { characterId: "mansour", text: "هديك تقييم متوسط، مش هخصم منك كتير. بس خد بالك المرة الجاية.", mood: "neutral", audioSrc: "/voiceover/mansour/mansour_call_medium_03.wav" },
  { characterId: "mansour", text: "نصيحة مني ذاكر دبلومة تحليل البيانات من IMP، هتساعدك جدًا في تنمية مهاراتك التحليلية، وازاي تفهم المشكلة بشكل صحيح.", mood: "neutral", audioSrc: "/voiceover/mansour/mansour_call_medium_04.wav" },
];

export const MANSOUR_CALL_WEAK: DialogueLine[] = [
  { characterId: "mansour", text: " التقرير ده مش اللي كنت متوقعه منك خالص. إنت دخلت على الحل قبل ما تتأكد إن في مشكلة أصلًا!", mood: "disappointed", audioSrc: "/voiceover/mansour/mansour_call_weak_01.wav" },
  { characterId: "detective", text: "حضرتك معاك حق… أنا استعجلت.", mood: "concerned" },
  { characterId: "mansour", text: "لو هشام نفّذ اللي إنت كاتبه ده هيروح في داهية، وهييجي يقول لنا  إنتو نصحتوني غلط. إحنا شغلنا نفهم المشكلة الأول، مش نمشي ورا أول كلمة العميل يقولها.", mood: "disappointed", audioSrc: "/voiceover/mansour/mansour_call_weak_02.wav" },
  { characterId: "mansour", text: "الـ Problem Framing مش رفاهية. ده الفرق بين استشاري حقيقي، وحد بيكتب تقارير وخلاص. أنا هخصملك يومين والتقييم ضعيف.", mood: "serious", audioSrc: "/voiceover/mansour/mansour_call_weak_03.wav" },
  { characterId: "mansour", text: "روح ذاكر دبلومة تحليل البيانات من IMP. هتساعدك جدًا إنك تطوّر تفكيرك. ولما تفهم ده صح… ابقى كلّمني سلام.", mood: "disappointed", audioSrc: "/voiceover/mansour/mansour_call_weak_04.wav" },
];
