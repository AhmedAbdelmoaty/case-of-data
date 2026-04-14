

# خطة تطوير المتعة والمحاكاة — المرحلة التالية

## المشكلة الحالية

الشاشات الحالية تفتقر للتغذية البصرية. مثلاً:
- **CompanyBriefingScreen**: خلفية gradient فاضية + نص "مكتب الشركة 🏢" — مفيش صورة مكتب حقيقية
- **DebriefScreen**: gradient فاضي بدون أي صورة خلفية
- **TravelScreen / ReturnTravelScreen**: نقط بتتحرك + إيموجي 🚗 — مفيش إحساس سفر حقيقي
- **InquiryScreen**: نفس صورة `store-front.png` طول الـ 5 جولات — مفيش تنوع بصري
- كل المشاهد بتفتح مباشرة على المحادثة بدون "لحظة وصول" أو "مشهد تأسيسي"

## الحل: 7 تحسينات مرتبة حسب التأثير

### 1. خلفيات سينمائية لكل شاشة (التأثير الأكبر)

نولّد 5 صور AI backgrounds تتحط خلف كل مشهد:

| صورة | الاستخدام | الوصف |
|---|---|---|
| `office-briefing.png` | CompanyBriefingScreen + DebriefScreen | مكتب استشارات أنيق بإضاءة دافئة — مكتب خشبي، كراسي جلد، نافذة كبيرة |
| `city-drive.png` | TravelScreen | منظر من داخل سيارة على طريق مدينة عربية — أبراج وشوارع |
| `city-drive-return.png` | ReturnTravelScreen | نفس الطريق لكن بالعكس / وقت مختلف (غروب مثلاً) |
| `store-inside.png` | InquiryScreen (جولات 1-3) + PresentationScreen | داخل متجر ملابس — رفوف وأقسام وإضاءة تجارية |
| `store-counter.png` | InquiryScreen (جولات 4-5) + FramingScreen | كاونتر الكاشير / ركن أبو سعيد — أقرب وأكثر حميمية |

ده هيحوّل كل شاشة من "gradient فاضي" لـ "مكان حقيقي" فوراً.

### 2. "مشاهد تأسيسية" — Establishing Shots قبل كل محادثة

بدل ما المحادثة تبدأ مباشرة، كل شاشة هتبدأ بـ **3-5 ثواني مشهد** فيه:
- صورة الخلفية full-screen مع overlay خفيف
- اسم المكان بيظهر بأنيميشن (مثل ArrivalScreen الحالية — نوسّع النمط ده)
- نص قصير وصفي
- زرار "ابدأ" أو auto-transition

**أماكن التطبيق:**
- **CompanyBriefingScreen**: مشهد المكتب → "مكتب Pinnacle Consulting — الطابق 12" → ثم المحادثة
- **DebriefScreen**: مشهد المكتب → "رجعت المكتب — منصور مستنيك" → ثم المحادثة
- **InquiryScreen**: عند الانتقال من جولة 3 لـ 4 — flash transition + تغيير الخلفية من المتجر للكاونتر → "قعدت مع أبو سعيد عند الكاشير"

### 3. تطوير شاشات السفر

**TravelScreen**: بدل النقط والإيموجي:
- صورة `city-drive.png` full-screen
- parallax خفيف (الصورة بتتحرك ببطء)
- أسماء أماكن بتظهر وتختفي: "📍 وسط المدينة" → "📍 المنطقة التجارية" → "📍 Fashion House"
- شريط تقدم أنيق

**ReturnTravelScreen**: نفس الفكرة بصورة مختلفة ونص "في الطريق للمكتب..."

### 4. تنوع بصري في الـ Inquiry

بدل نفس الخلفية طول الـ 5 جولات:
- **جولات 1-3**: خلفية `store-inside.png` (داخل المتجر — بنتكلم عن الحركة العامة)
- **جولة 4**: transition سريع + خلفية `store-counter.png` (بنضيّق على الأقسام)
- **جولة 5**: نفس `store-counter.png` لكن مع overlay أغمق (بنركّز أكتر)

هيدي إحساس إن المحادثة بتتطور وبتتعمق — مش ثابتة.

### 5. شاشة "التأمل" قبل الـ Framing

بعد آخر سؤال في الـ Inquiry وقبل الـ FramingScreen:
- شاشة 4 ثواني: صورة المحلل + خلفية المتجر blurred
- نص: "بتراجع كل اللي سمعته... وبتحاول تصيغ المشكلة الحقيقية"
- أنيميشن تفكير (نقط بتتحرك أو pulse)
- auto-transition للـ FramingScreen

ده هيخلي الانتقال من "أسئلة" لـ "قرار" يحس طبيعي ومدروس.

### 6. تحسين الـ FramingScreen بصرياً

- خلفية `store-counter.png` (مش store-front)
- إضافة صورة المحلل واقف بيفكر في الجانب
- الاختيارات تظهر كـ "بطاقات تقرير" مش مجرد buttons

### 7. تحسين الـ PresentationScreen

- إضافة "مشهد تأسيسي" قبل المحادثة: المحلل واقف قدام أبو سعيد بيقدم التقرير
- خلفية `store-inside.png` أو `store-counter.png`

---

## الصور المطلوب توليدها بالـ AI

5 صور بأسلوب cartoon/illustrated يشبه الأصول الموجودة:

1. **`office-briefing.png`** — مكتب استشارات أنيق (warm lighting, wooden desk, leather chairs, city view window) — cartoon/illustrated style matching existing assets
2. **`city-drive.png`** — منظر من داخل سيارة في مدينة عربية حديثة — cartoon style
3. **`city-drive-return.png`** — نفس المنظر وقت الغروب/المساء — cartoon style
4. **`store-inside.png`** — داخل متجر ملابس أنيق — أقسام وأرفف وإضاءة — cartoon style
5. **`store-counter.png`** — كاونتر الكاشير في متجر ملابس — مكان أقرب وأكثر حميمية — cartoon style

---

## التغييرات التقنية

### ملفات تتعدل:
| ملف | التعديل |
|---|---|
| `CompanyBriefingScreen.tsx` | إضافة establishing shot + خلفية office-briefing.png |
| `TravelScreen.tsx` | إعادة بناء بصرياً مع city-drive.png + parallax + waypoints |
| `ReturnTravelScreen.tsx` | نفس التطوير مع city-drive-return.png |
| `InquiryScreen.tsx` | تغيير الخلفية حسب الجولة (store-inside → store-counter) + transition بينهم |
| `FramingScreen.tsx` | خلفية store-counter + تحسين بصري للبطاقات |
| `PresentationScreen.tsx` | establishing shot + خلفية store-inside |
| `DebriefScreen.tsx` | establishing shot + خلفية office-briefing.png |

### شاشة جديدة (optional):
| ملف | الوظيفة |
|---|---|
| `ReflectionTransition.tsx` | شاشة "التأمل" بين Inquiry و Framing (4 ثواني) |

### Index.tsx:
- إضافة شاشة "reflection" بين inquiry و framing (اختياري — ممكن ندمجها في InquiryScreen نفسها)

### ملفات لا تتغير:
- `EnhancedDialogue.tsx` ✅
- `PFGameContext.tsx` ✅
- `pf-scenario.ts` ✅
- `ResultScreen.tsx` ✅
- `ArrivalScreen.tsx` ✅ (عندها establishing shot أصلاً)

