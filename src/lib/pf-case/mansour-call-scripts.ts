import type { DialogueLine } from "./types";

// مكالمة تليفونية بعد إرسال التقرير — نسخة مختصرة وسريعة
// بدون ترحيب، دخول مباشر في الموضوع، مع جملة تسويقية لـ IMP في النهاية

export const MANSOUR_CALL_STRONG: DialogueLine[] = [
  { characterId: "mansour", text: "شوف يا فندم… التقرير اللي بعتهولي ده شغل محترم جدًا. هشام الشريف بعتلي رسالة بعد ما قراه، قال حرفيًا: «الراجل ده فهمني أكتر مما أنا فاهم نفسي».", mood: "happy" },
  { characterId: "mansour", text: "أهم حاجة عملتها صح إنك ما خدتش وصف العميل للمشكلة على إنه الحقيقة. ده بالظبط Problem Framing سليم. وعرفت كويس انو بيقارن غلط والمبيعات مش اقل، لو كنت جريت ورا تفسير العميل الخاطئ كان ممكن يحصل مشاكل اكبر والشركة كانت هتخسر عميل كبير.", mood: "serious" },
  { characterId: "detective", text: "ده شرف ليّا يا أستاذ منصور.", mood: "happy" },
  { characterId: "mansour", text: "تستاهل. هاكتب لك على مكافأة. وهاكلمك الأسبوع الجاي على استشارة جديدة.", mood: "happy" },
  { characterId: "mansour", text: "وكمل اللي إنت بتعمله — خليك ماشي على منهج IMP في التحليل، ده اللي فرّق معاك النهارده. سلام.", mood: "happy" },
];

export const MANSOUR_CALL_MEDIUM: DialogueLine[] = [
  { characterId: "mansour", text: "خلّينا نتكلم بصراحة في التقرير… شغلك كويس بس مش كويس بالشكل اللي كنت متوقعه منك. مسكت إن سنة 2025 كانت استثنائية، وده تمام، لكن ما حسمتش الموضوع لآخره.", mood: "neutral" },
  { characterId: "detective", text: "أيوه، حسيت إن لسه فيه جزء ناقص.", mood: "concerned" },
  { characterId: "mansour", text: "بالظبط. كان لازم تربط بوضوح إن المقارنة الغلط كانت هتودي العميل لقرار خصومات ضايع. الـ Framing مش بس إنك تشوف الحقيقة، ده إنك توصّلها بحسم عشان العميل يغيّر اتجاهه.", mood: "serious" },
  { characterId: "mansour", text: "هاحسبها لك تقييم متوسط، مش هاخصم منك كتير. بس خد بالك المرة الجاية: حسم أكتر، وضوح أكتر.", mood: "neutral" },
  { characterId: "mansour", text: "نصيحة مني — راجع كورسات IMP في Problem Framing تاني، فيه شروحات هتساعدك توصل المعنى للعميل بشكل أقوى. سلام.", mood: "neutral" },
];

export const MANSOUR_CALL_WEAK: DialogueLine[] = [
  { characterId: "mansour", text: "خلّينا نتكلم بصراحة. التقرير ده مش اللي كنت متوقعه منك خالص. إنت دخلت على الحل قبل ما تتأكد إن في مشكلة بيع أصلًا — ده نفس الغلط اللي هشام نفسه داخل عليه!", mood: "disappointed" },
  { characterId: "detective", text: "حضرتك معاك حق… أنا استعجلت.", mood: "concerned" },
  { characterId: "mansour", text: "لو هشام نفّذ اللي في تقريرك ده هيروح في داهيه، وهييجي يقولنا «إنتو نصحتوني غلط». شغلنا إننا نفهم المشكلة صح الأول، مش نمشي ورا أول فكرة في دماغ العميل.", mood: "disappointed" },
  { characterId: "mansour", text: "الـ Problem Framing مش رفاهية — ده الفرق بين استشاري حقيقي وحد بيكتب تقارير. إنت النهارده ما عملتش Framing، إنت محددتش المشكلة صح اصلا. هاخصم لك يومين والتقييم ضعيف.", mood: "serious" },
  { characterId: "mansour", text: "روح ذاكر كورس IMP في Problem Framing من الأول، خصوصًا جزء «امسك المشكلة قبل ما تجري على الحل». لما تتقنه، كلمني. سلام.", mood: "disappointed" },
];
