import type { DialogueLine } from "./types";

export const MANSOUR_INTRO_DIALOGUES: DialogueLine[] = [
  {
    characterId: "mansour",
    text: "أهلاً، اتفضل اقعد. عندنا شغلانة جديدة محتاجة تركيز.",
    mood: "neutral",
  },
  {
    characterId: "detective",
    text: "تمام يا أستاذ منصور، أنا معاك.",
    mood: "neutral",
  },
  {
    characterId: "mansour",
    text: "العميل اسمه أبو سعيد. عنده متجر ملابس في المنطقة التجارية، وطلب مننا نقعد معاه لأن في موضوع شاغله في الشغل اليومين دول.",
    mood: "neutral",
  },
  {
    characterId: "mansour",
    text: "هو واضح إنه داخل على قرار، بس أنا مش عايزك تروح تناقش قرار قبل ما تفهم أصل الحكاية.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "المطلوب منك بسيط في شكله، لكن مهم: اسمع كويس، اسأل صح، وحاول تفهم المشكلة زي ما هي... مش زي ما أول حد يوصفهالك.",
    mood: "serious",
  },
  {
    characterId: "detective",
    text: "تمام. يعني أركز الأول على فهم الصورة، وبعدها أحدد المشكلة فعلًا فين.",
    mood: "neutral",
  },
  {
    characterId: "mansour",
    text: "بالضبط. ما تجريش على حل، وما تفترضش سبب من بدري. ارجعلي بتأطير واضح: الراجل شايف المشكلة إزاي، والمشكلة الحقيقية فين.",
    mood: "serious",
  },
  {
    characterId: "detective",
    text: "تمام يا أستاذ منصور. هروح وأرجعلك بالصورة واضحة.",
    mood: "confident",
  },
  {
    characterId: "mansour",
    text: "كويس. يلا روح له، واسمع أكتر ما تتكلم في الأول.",
    mood: "neutral",
  },
];

export const MANSOUR_DEBRIEF_STRONG: DialogueLine[] = [
  {
    characterId: "mansour",
    text: "أهلاً... رجعت. ها، فهمت الصورة ولا لسه؟",
    mood: "neutral",
  },
  {
    characterId: "detective",
    text: "أيوه. أبو سعيد كان شايف إن الموسم أضعف من المتوقع، وابتدى يميل لفكرة العروض. لكن المشكلة مش في الأداء الحالي بالشكل اللي هو متخيله.",
    mood: "confident",
  },
  {
    characterId: "mansour",
    text: "كمّل.",
    mood: "serious",
  },
  {
    characterId: "detective",
    text: "هو بنى حكمه على مقارنة بالسنة اللي فاتت، لكن السنة اللي فاتت ما كانتش سنة طبيعية. كان فيه ظرف استثنائي رفع الحركة والبيع أكتر من المعتاد، فبالتالي baseline نفسها مضللة.",
    mood: "confident",
  },
  {
    characterId: "detective",
    text: "فالخلل مش إن البيع الحالي واقع بشكل مؤكد، إنما إن التقييم نفسه مبني على مرجع غلط. ولو كان أخد قرار خصومات بسرعة، كان ممكن يضغط على هامش الربح من غير ما يكون عنده أصلًا مشكلة أداء حقيقية.",
    mood: "confident",
  },
  {
    characterId: "mansour",
    text: "ممتاز. دي بالضبط النقطة. إنت ما خدتش وصف العميل للمشكلة كأنه الحقيقة، وما جريتش على الحل اللي هو كان داخل عليه.",
    mood: "impressed",
  },
  {
    characterId: "mansour",
    text: "القوة هنا مش إنك لقيت معلومة وخلاص... القوة إنك رجّعت تعريف المشكلة نفسه لمكانه الصح. وده أهم جزء في الشغل ده.",
    mood: "impressed",
  },
  {
    characterId: "mansour",
    text: "شغلك المرة دي قوي. هاحسبهالك تقرير مضبوط، ومستواك في الكيس دي ممتاز.",
    mood: "happy",
  },
];

export const MANSOUR_DEBRIEF_MEDIUM: DialogueLine[] = [
  {
    characterId: "mansour",
    text: "رجعت. ها، وصلت لإيه؟",
    mood: "neutral",
  },
  {
    characterId: "detective",
    text: "واضح إن المقارنة بالسنة اللي فاتت فيها مشكلة، لأن السنة اللي فاتت كانت أعلى من الطبيعي شوية، وده مخلي أبو سعيد حاسس إن الموسم الحالي أضعف.",
    mood: "neutral",
  },
  {
    characterId: "mansour",
    text: "ده جزء مهم... لكن إيه النتيجة اللي تبنيها على ده؟",
    mood: "serious",
  },
  {
    characterId: "detective",
    text: "إنه محتاج يراجع المقارنة قبل ما ياخد قرار.",
    mood: "neutral",
  },
  {
    characterId: "mansour",
    text: "صحيح، لكن كنت محتاج تكون أقطع من كده. الموضوع مش بس إن السنة اللي فاتت مختلفة شوية... الموضوع إن ده يغيّر تعريف المشكلة كلها.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "لو إنت ما فرّقتش بوضوح بين: العميل شايف إيه، والحل اللي هو رايح له، والمشكلة الحقيقية فين... يبقى لسه framing ناقص.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "أنت مشيت في اتجاه صحيح، لكن كنت محتاج حسم أكتر وربط أوضح بين baseline وبين خطر القرار اللي العميل كان داخل عليه.",
    mood: "neutral",
  },
  {
    characterId: "mansour",
    text: "أعتبرها شغل كويس، لكن لسه محتاج تبقى أدق وأوضح في تأطيرك النهائي.",
    mood: "neutral",
  },
];

export const MANSOUR_DEBRIEF_WEAK: DialogueLine[] = [
  {
    characterId: "mansour",
    text: "ها، طمني. شايف المشكلة كانت فين؟",
    mood: "neutral",
  },
  {
    characterId: "detective",
    text: "واضح إن البيع محتاج يتنشط، وممكن العروض أو التحريك التجاري يكونوا خطوة مناسبة.",
    mood: "uncertain",
  },
  {
    characterId: "mansour",
    text: "لا... هنا إنت استعجلت.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "إنت دخلت على الحل قبل ما تثبت أصلًا إن في مشكلة أداء حقيقية. وده بالضبط الغلط اللي كان أبو سعيد نفسه داخل عليه.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "كان لازم تسأل: أقل من المتوقع مقارنة بإيه؟ وكان لازم تختبر إذا كان المرجع اللي بيحكم عليه صالح أصلًا ولا لأ.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "لما العميل يوصّفلك موقف على إنه مشكلة، دورك مش إنك تساعده ينفذ أول حل جه في دماغه. دورك الأول إنك تتأكد: هل دي فعلًا المشكلة؟ ولا المشكلة في طريقة فهمه ليها؟",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "في الكيس دي، إنت ما مسكتش الـbaseline، وبالتالي بنيت تقريرك على أرضية ضعيفة. وده كان هيؤدي لقرار غلط.",
    mood: "disappointed",
  },
  {
    characterId: "mansour",
    text: "اعتبرها محاولة ضعيفة. المرة الجاية: ما تجريش على السبب، وما تجريش على الحل... امسك المرجع الأول.",
    mood: "serious",
  },
];
