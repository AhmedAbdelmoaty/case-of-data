

# خطة التطوير الشاملة — المتعة والمحاكاة (النسخة المعتمدة)

## تعليقك صح 100%

الـ green flash / red shake / ⭐ / ⚠️ كلها **تسريب مباشر** — بتقول للاعب "ده كان صح/غلط" فبيلغي التفكير. هنشيل كل ده ونستبدله بردود فعل **غير مباشرة** من أبو سعيد (لغة جسد تتغير تدريجياً مش فورياً، بدون ألوان تكشف).

---

## ملخص التغييرات المعتمدة

### المجموعة 1: مشاهد سينمائية (CompanyBriefing + Arrival)

**CompanyBriefingScreen — 3 مراحل بدل 2:**
1. **ممر الشركة** — صورة `office-hallway.png` + زرار "ادخل المكتب" على الباب + أنيميشن zoom in
2. **داخل المكتب** — صورة `mansour-desk.png` + fade in → المحادثة تبدأ
3. **بعد المحادثة** — "المهمة بدأت" + transition للسفر

**ArrivalScreen — 3 مراحل بدل 2:**
1. **واجهة المتجر** (موجودة) — store-front.png
2. **باب المتجر** — صورة `store-entrance.png` + زرار "ادخل المتجر" + صوت جرس
3. **أبو سعيد مستقبلك** — صورة `abu-saeed-greeting.png` → المحادثة تبدأ

### المجموعة 2: تحسينات InquiryScreen (بدون تسريب)

**خلفيات متنوعة حسب الجولة:**
- جولات 1-2: `store-inside.png`
- جولة 3: `store-womens-section.png` + transition "أبو سعيد واخدك على قسم تاني..."
- جولات 4-5: `store-counter.png`

**ردود فعل بدون تسريب:**
- لا green/red flash — **محذوف**
- لا trust meter مرئي — **محذوف**
- أبو سعيد: لغة جسده تتغير **تدريجياً** حسب الـ trust التراكمي (مش بعد كل سؤال مباشرة). لو الـ trust عالي بعد 3 جولات: يقرب (الصورة تكبر 5%). لو منخفض: يبعد (تصغر 5%). ده **تأثير بطيء وغير واضح** — مش هنت مباشر.

### المجموعة 3: FramingScreen بطاقات + Stamp

- الاختيارات تظهر **واحدة واحدة** مع delay (0.3s بين كل بطاقة)
- كل اختيار = بطاقة كبيرة فيها عنوان + النص الكامل
- لما تختار: باقي البطاقات تتحرك بعيد + البطاقة المختارة تكبر
- زرار "أكّد اختيارك" → أنيميشن **ختم** (stamp) على البطاقة + صوت ختم

### المجموعة 4: TravelScreen تحسينات

- إضافة إطار "نافذة سيارة" شفاف حوالين الشاشة (border مع rounded corners)
- **monologue داخلي**: نص بيظهر ببطء ويختفي: "يا ترى المشكلة فين..." (مش هنت — مجرد تفكير عام)
- عناصر متحركة صغيرة: أشجار/عمارات silhouettes بتعدي

### المجموعة 5: Notebook (بدون تسريب)

- **محذوف**: ⭐ و ⚠️ على الملاحظات
- **مضاف**: bounce + glow على الأيقونة لما تتضاف أي ملاحظة (بالتساوي لكل الملاحظات)
- الملاحظات الجديدة highlighted بلون مختلف لمدة 5 ثواني فقط (عشان يعرف أنهي الجديدة)

### المجموعة 6: Screen Transitions

- مكون `ScreenTransition.tsx` — fade to black (0.4s) بين كل شاشة
- iris transition (دائرة بتتفتح) عند بداية اللعبة

### المجموعة 7: Progress Timeline

- شريط أفقي صغير أعلى الشاشة يوضح المراحل
- المرحلة الحالية مضيئة + pulse
- السابقة ✓ ملونة، القادمة باهتة
- **بدون أي إشارة للأداء** — مجرد مكان وين أنت

### المجموعة 8: Mini-interactions

- **طرق الباب** — قبل دخول مكتب منصور: زرار → صوت طرق → "اتفضل"
- **مصافحة** — أول لقاء أبو سعيد: أنيميشن يدين + click
- **ختم التقرير** — FramingScreen عند التأكيد

### المجموعة 9: DebriefScreen حسب الأداء

- إضاءة المكتب تتغير حسب الـ tier:
  - Exceptional: إضاءة ذهبية دافئة
  - Promising: إضاءة عادية
  - Beginner: إضاءة باردة

### المجموعة 10: PresentationScreen

- camera angle يتبدل بين لقطة المحلل ولقطة أبو سعيد (مش ثابتة)
- تأخير بسيط (1.5s) قبل رد أبو سعيد — suspense

---

## الصور AI المطلوبة (6 صور جديدة)

| # | اسم الملف | الوصف |
|---|---|---|
| 1 | `office-hallway.png` | ممر مكتب استشارات حديث — أرضية رخام، إضاءة سقفية، باب زجاجي في النهاية |
| 2 | `mansour-desk.png` | منصور قاعد ورا مكتب خشبي — نافذة خلفه، كراسي جلد |
| 3 | `store-entrance.png` | باب متجر ملابس مفتوح — إضاءة دافئة من جوا |
| 4 | `abu-saeed-greeting.png` | أبو سعيد واقف عند المدخل بابتسامة |
| 5 | `store-womens-section.png` | قسم ملابس حريمي — ستاندات ومرايا تجربة |
| 6 | `car-interior.png` | منظر من داخل سيارة — مدينة عربية من الزجاج الأمامي |

كل الصور بأسلوب cartoon/illustrated يطابق الأصول الموجودة.

---

## الملفات

### تتعدل:
| ملف | التعديل |
|---|---|
| `CompanyBriefingScreen.tsx` | 3 مراحل (ممر → مكتب → محادثة) + طرق باب |
| `ArrivalScreen.tsx` | 3 مراحل (واجهة → باب → استقبال → محادثة) + مصافحة |
| `TravelScreen.tsx` | إطار سيارة + monologue + عناصر متحركة |
| `InquiryScreen.tsx` | 3 خلفيات حسب الجولة + **حذف triggerFlash** + لغة جسد تدريجية |
| `FramingScreen.tsx` | بطاقات متحركة + stamp effect |
| `PresentationScreen.tsx` | camera angles + suspense delay |
| `DebriefScreen.tsx` | إضاءة حسب الأداء |
| `PFNotebook.tsx` | bounce/glow عند الإضافة + highlight مؤقت |
| `Index.tsx` | screen transitions + progress timeline |

### جديدة:
| ملف | الوظيفة |
|---|---|
| `ScreenTransition.tsx` | fade/iris transitions |
| `ProgressTimeline.tsx` | شريط التقدم الأفقي |
| `StampEffect.tsx` | أنيميشن الختم |

---

## الأولوية

1. صور AI + مشاهد CompanyBriefing + Arrival (أكبر أثر بصري)
2. InquiryScreen — حذف التسريب + خلفيات متنوعة + لغة جسد تدريجية
3. FramingScreen بطاقات + stamp
4. Screen transitions + Progress timeline
5. Mini-interactions (طرق الباب، مصافحة)
6. TravelScreen + Notebook polish
7. PresentationScreen + DebriefScreen

