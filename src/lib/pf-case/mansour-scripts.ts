import type { DialogueLine } from "./types";

export const ABU_SAEED_GREETING: DialogueLine[] = [
  {
    characterId: "abuSaeed",
    text: "أهلاً وسهلاً يا فندم، نوّرت المحل. اتفضل اقعد، تشرب حاجة سقعة؟",
    mood: "happy",
  },
  {
    characterId: "detective",
    text: "أهلاً بيك يا أبو سعيد. أستاذ منصور قال لي إن حضرتك عاوز تتكلم في موضوع شاغلك.",
    mood: "neutral",
  },
  {
    characterId: "abuSaeed",
    text: "والله يا فندم… أنا من حوالي شهر، حاسس إن في حاجة في المحل مش ماشية ماشي. مش لاقي كلام أحسن من كده أوصفهولك بيه.",
    mood: "concerned",
  },
  {
    characterId: "abuSaeed",
    text: "المحل بيتفتح وبيقفل، الزباين بيدخلوا ويخرجوا، الواحد شغّال زي كل يوم… بس آخر الشهر لما بقعد على الأرقام، بحس إن في حاجة ناقصة.",
    mood: "concerned",
  },
  {
    characterId: "detective",
    text: "ما تشغلش بالك. خلينا نهدّي ونفهم سوا. هسألك كام سؤال براحة، وانت قول لي اللي عندك.",
    mood: "confident",
  },
];

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
    text: "المطلوب منك بسيط في شكله، لكن مهم: اسمع كويس، اسأل صح، وحاول تفهم المشكلة زي ما هي… مش زي ما أول حد يوصفهالك.",
    mood: "serious",
  },
  {
    characterId: "detective",
    text: "تمام. يعني أركز الأول على فهم الصورة، وبعدها أحدد المشكلة فعلًا فين.",
    mood: "neutral",
  },
  {
    characterId: "mansour",
    text: "بالضبط. ما تجريش على حل، وما تفترضش سبب من بدري. ارجع لي بصورة واضحة: الراجل شايف المشكلة إزاي، والمشكلة الحقيقية فين.",
    mood: "serious",
  },
  {
    characterId: "detective",
    text: "تمام يا أستاذ منصور. هروح وأرجع لك بالصورة كاملة.",
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
    text: "أهلاً… رجعت. ها، فهمت الصورة ولا لسه؟",
    mood: "neutral",
  },
  {
    characterId: "detective",
    text: "أيوه. أبو سعيد كان حاسس إن المبيعات أقل من المتوقع، وكان داخل على فكرة إنه يعمل عروض وخصومات. لكن المشكلة مش في البيع نفسه زي ما هو متخيل.",
    mood: "confident",
  },
  {
    characterId: "mansour",
    text: "كمّل.",
    mood: "serious",
  },
  {
    characterId: "detective",
    text: "هو بنى كلامه على إنه قارن فبراير 2026 بفبراير 2025. لكن لما بصّينا على فبراير 2024 كمان، طلع إن سنة 2025 هي اللي كانت طالعة عن الباقي، مش 2026 هي اللي واطية.",
    mood: "confident",
  },
  {
    characterId: "detective",
    text: "ولما فككنا الرقم لقينا إن سنة 2025 جاتله أوردر شركات كبير لوحده طلّع الرقم. لو شيلنا الأوردر ده، البيع للأفراد ماشي في نمو طبيعي. يعني لو كان عمل خصومات بسرعة، كان هياكل من الربح في غير محله.",
    mood: "confident",
  },
  {
    characterId: "mansour",
    text: "ممتاز. دي بالضبط النقطة. إنت ما خدتش وصف العميل للمشكلة كأنه الحقيقة، وما جريتش على الحل اللي هو كان داخل عليه.",
    mood: "impressed",
  },
  {
    characterId: "mansour",
    text: "القوة هنا مش إنك لقيت معلومة وخلاص… القوة إنك رجّعت تعريف المشكلة نفسه لمكانه الصح. وده أهم جزء في الشغل ده.",
    mood: "impressed",
  },
  {
    characterId: "mansour",
    text: "شغلك المرة دي قوي. هاحسبها لك تقرير مضبوط، ومستواك في الكيس دي ممتاز.",
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
    text: "واضح إن المقارنة اللي أبو سعيد بنى عليها كلامه فيها مشكلة. سنة 2025 كانت سنة استثنائية، وده مخلّيه حاسس إن الشهر الحالي أضعف.",
    mood: "neutral",
  },
  {
    characterId: "mansour",
    text: "ده جزء مهم… لكن إيه النتيجة اللي تبنيها على ده؟",
    mood: "serious",
  },
  {
    characterId: "detective",
    text: "إنه محتاج يراجع المقارنة قبل ما ياخد قرار خصومات.",
    mood: "neutral",
  },
  {
    characterId: "mansour",
    text: "صحيح، لكن كنت محتاج تكون أحسم من كده. الموضوع مش بس إن سنة 2025 مختلفة شوية… الموضوع إن ده يغيّر تعريف المشكلة كلها.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "لو إنت ما فرّقتش بوضوح بين: العميل شايف إيه، والحل اللي هو رايح له، والمشكلة الحقيقية فين… يبقى الصورة عندك لسه ناقصة.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "إنت مشيت في اتجاه صحيح، لكن كنت محتاج حسم أكتر، وربط أوضح بين المقارنة الغلط وبين خطر القرار اللي العميل كان داخل عليه.",
    mood: "neutral",
  },
  {
    characterId: "mansour",
    text: "أعتبرها شغل كويس، لكن لسه محتاج تبقى أدق وأوضح في كلامك النهائي.",
    mood: "neutral",
  },
];

export const MANSOUR_DEBRIEF_WEAK: DialogueLine[] = [
  {
    characterId: "mansour",
    text: "ها، طمّني. شايف المشكلة كانت فين؟",
    mood: "neutral",
  },
  {
    characterId: "detective",
    text: "واضح إن البيع محتاج يتنشّط، وممكن العروض أو حملة تسويقية يكونوا خطوة مناسبة.",
    mood: "uncertain",
  },
  {
    characterId: "mansour",
    text: "لا… هنا إنت استعجلت.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "إنت دخلت على الحل قبل ما تتأكد أصلًا إن في مشكلة بيع حقيقية. وده بالضبط الغلط اللي كان أبو سعيد نفسه داخل عليه.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "كان لازم تسأل: أقل من المتوقع مقارنة بإيه بالظبط؟ وكان لازم تتأكد إن المرجع اللي بيحكم بيه صح من الأساس.",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "لما العميل يوصّف لك موقف على إنه مشكلة، دورك مش إنك تساعده ينفذ أول حل جه في دماغه. دورك الأول إنك تتأكد: هل دي فعلًا المشكلة؟ ولا المشكلة في طريقة فهمه ليها؟",
    mood: "serious",
  },
  {
    characterId: "mansour",
    text: "في الكيس دي، إنت ما مسكتش المرجع الأول، وبالتالي بنيت تقريرك على أرضية ضعيفة. وده كان هيؤدي لقرار غلط.",
    mood: "disappointed",
  },
  {
    characterId: "mansour",
    text: "اعتبرها محاولة ضعيفة. المرة الجاية: ما تجريش على السبب، وما تجريش على الحل… امسك المرجع الأول.",
    mood: "serious",
  },
];
