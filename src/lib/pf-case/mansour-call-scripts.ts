import type { DialogueLine } from "./types";

// مكالمة تليفونية بعد إرسال التقرير بالإيميل — نبرة قصصية + غير رسمية شوية
// الـ outcome بيحدد المسار: strong = مكافأة، medium = توجيه، weak = عنف + درس

export const MANSOUR_CALL_STRONG: DialogueLine[] = [
  { characterId: "mansour", text: "ألو… معاك منصور. لسه قافل الإيميل بتاعك من شوية.", mood: "happy" },
  { characterId: "detective", text: "أهلاً يا أستاذ منصور. كله تمام؟", mood: "neutral" },
  { characterId: "mansour", text: "أكتر من تمام. والله يا فندم خلّيتني فخور بيك النهارده.", mood: "happy" },
  { characterId: "mansour", text: "هشام الشريف بعتلي رسالة بعد ما شاف التقرير… قعد يقول: «الراجل ده فهمني أكتر مما أنا فاهم نفسي».", mood: "happy" },
  { characterId: "detective", text: "ده شرف ليّا.", mood: "happy" },
  { characterId: "mansour", text: "خلّي بالك من حاجة مهمة: إنت ما خدتش وصف العميل للمشكلة على إنه الحقيقة. ده بالظبط شغل الـ Problem Framing الصح.", mood: "serious" },
  { characterId: "mansour", text: "لو كنت جريت ورا فكرة الخصومات اللي هو داخل عليها، كان هياكل من الربح في غير محله، والشركة كانت هتخسر عميل كبير.", mood: "serious" },
  { characterId: "mansour", text: "أنا هاكتب لك تقييم ممتاز في الكيس دي، وفيه مكافأة على الشغل ده. تستاهل.", mood: "happy" },
  { characterId: "detective", text: "متشكر جداً يا أستاذ منصور.", mood: "happy" },
  { characterId: "mansour", text: "براحتك النهارده، وخد يومين راحة. أنا هكلمك تاني الأسبوع الجاي على كيس جديدة. سلام.", mood: "happy" },
];

export const MANSOUR_CALL_MEDIUM: DialogueLine[] = [
  { characterId: "mansour", text: "ألو… شفت الإيميل. اتفضل اقعد لو إنت واقف، عايز نتكلم شوية.", mood: "neutral" },
  { characterId: "detective", text: "أهلاً يا أستاذ منصور. اتفضل.", mood: "neutral" },
  { characterId: "mansour", text: "التقرير كويس… بس مش كويس بالشكل اللي كنت متوقعه منك.", mood: "neutral" },
  { characterId: "mansour", text: "إنت مسكت إن سنة 2025 كانت استثنائية، وده كويس. لكن ما حسمتش الموضوع لآخره.", mood: "serious" },
  { characterId: "detective", text: "أيوه، حسيت إن لسه فيه جزء ناقص.", mood: "nervous" },
  { characterId: "mansour", text: "بالظبط. كان لازم تربط بوضوح: المقارنة الغلط دي كانت هتودي العميل لقرار خصومات ضايع. ده اللي كان لازم يطلع في وش هشام مباشرة.", mood: "serious" },
  { characterId: "mansour", text: "الـ Problem Framing مش بس إنك تشوف الحقيقة. هو إنك توصّلها بحسم، عشان العميل يقتنع ويغيّر اتجاهه.", mood: "serious" },
  { characterId: "mansour", text: "أنا هاحسبها لك تقييم متوسط. مش هاخصم منك كتير، بس خد بالك المرة الجاية: حسم أكتر، وضوح أكتر.", mood: "neutral" },
  { characterId: "detective", text: "تمام يا أستاذ منصور. هاخد بالي.", mood: "neutral" },
  { characterId: "mansour", text: "كويس. روح ارتاح، وهنتكلم في الكيس الجاية. سلام.", mood: "neutral" },
];

export const MANSOUR_CALL_WEAK: DialogueLine[] = [
  { characterId: "mansour", text: "ألو… منصور معاك. قريت التقرير.", mood: "serious" },
  { characterId: "detective", text: "أهلاً يا أستاذ منصور…", mood: "nervous" },
  { characterId: "mansour", text: "خلّينا نتكلم بصراحة. التقرير ده مش اللي كنت متوقعه منك، خالص.", mood: "angry" },
  { characterId: "mansour", text: "إنت دخلت على الحل قبل ما تتأكد إن في مشكلة بيع أصلاً. ده نفس الغلط اللي كان هشام نفسه داخل عليه!", mood: "angry" },
  { characterId: "mansour", text: "إحنا في Prism Consulting شغلنا إننا نمسك المرجع الأول. مش إننا نهز راسنا للعميل ونمشي ورا أول فكرة جايه في دماغه.", mood: "angry" },
  { characterId: "detective", text: "حضرتك معاك حق… أنا استعجلت.", mood: "nervous" },
  { characterId: "mansour", text: "والله لو كان هشام نفّذ خصومات بناءً على التقرير ده، كان هياكل من الربح، وكان ممكن ييجي يقولنا «إنتو نصحتوني غلط».", mood: "angry" },
  { characterId: "mansour", text: "الـ Problem Framing مش رفاهية. هو الفرق بين استشاري حقيقي وحد بيكتب تقارير. إنت النهارده ما عملتش Framing… إنت كرّرت كلام العميل.", mood: "serious" },
  { characterId: "mansour", text: "هاخصم لك يومين من رصيدك التدريبي، والتقييم في الكيس دي ضعيف. لازم تتعلم: ما تجريش على السبب، وما تجريش على الحل. امسك المرجع الأول.", mood: "angry" },
  { characterId: "detective", text: "تمام يا أستاذ منصور. هاتعلّم من الغلطة دي.", mood: "nervous" },
  { characterId: "mansour", text: "أتمنى كده. روح ذاكر شغلك تاني، وخد المرة الجاية وقتك. سلام.", mood: "serious" },
];
