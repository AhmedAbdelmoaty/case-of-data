

## فهمت بالضبط 🎯

أنت عايز تستبدل **الفلو الحالي** اللي بيرجع فيه اللاعب من VELARO للشركة (ReturnTravelScreen → DebriefScreen في المكتب) بـ **سلسلة سينمائية حديثة** بتحاكي الحياة الواقعية:

### السيناريو اللي عايزه

```text
[PresentationScreen] هشام يستلم التقرير
        ↓
[NEW] زرار "📧 أرسل التقرير لأستاذ منصور بالإيميل"
        ↓
[NEW Scene 1] المحلل قاعد على لابتوب (بيت/كافيه) → يبعت الإيميل
        ↓
[NEW Scene 2] منصور في مكتبه → يفتح الإيميل → يقرأ التقرير
        ↓
[NEW Scene 3] المحلل قاعد مرتاح → الموبايل يرن (شاشة المكالمة بتظهر)
        ↓
زرار "📞 رد"
        ↓
[NEW Scene 4] المحلل ماسك الموبايل في ودنه + خلفية المكان
        + EnhancedDialogue (نفس النظام اللي في المكتب)
        + سكريبت قصصي بنبرة "مكالمة تليفون" (مش اجتماع)
        ↓
[ResultScreen] (زي ما هي)
```

### النبرة المطلوبة في الحوار (3 مسارات)

| النتيجة | النبرة | المحتوى |
|---|---|---|
| **strong** ✅ | قصصي + مكافأة + لمسة تعليمية بسيطة | "شاطر! العميل مبسوط، وأنا هاكافئك… عرفت تمسك المرجع الأول وما جريتش على الحل" |
| **medium** ⚠️ | متحفظ + توجيه قصصي | "شغل كويس، بس كنت محتاج تحسم أكتر. خصمتلك جزء من التقدير، خد بالك المرة الجاية" |
| **weak** ❌ | عنيف + تعليمي صريح + خصم واضح | "إنت استعجلت! نفس غلطة العميل! خصمتلك أيام من رصيدك التدريبي. لازم تتعلم تمسك المرجع الأول" |

---

## البلان الكاملة

### 🗂️ ملفات جديدة هتتعمل

#### 1. `src/lib/pf-case/mansour-call-scripts.ts`
سكريبتات المكالمة التليفونية الـ 3 (strong/medium/weak)، نفس بنية `MANSOUR_DEBRIEF_*` اللي موجودة دلوقتي بس بنبرة مكالمة + قصصية أقوى. كل سكريبت ~10-12 سطر حوار.

#### 2. `src/components/game/screens/EmailSendScreen.tsx` 🆕
**مشهد إرسال الإيميل من المحلل**
- خلفية: `analyst-laptop-evening.png` (placeholder حالياً، صورة لاحقاً)
- Ken Burns effect على الخلفية
- في النص: نموذج إيميل mockup (To: ahmed.mansour@prism.com / Subject: تقرير قضية VELARO)
- زرار كبير: **"📧 أرسل التقرير"**
- بعد الضغط: animation (الإيميل بيطير 🚀) + sound effect (whoosh)
- بعد ثانيتين → onComplete

#### 3. `src/components/game/screens/MansourReceivesEmailScreen.tsx` 🆕
**مشهد استلام منصور للإيميل**
- خلفية: `mansour-reading-email.png` (placeholder)
- Ken Burns بطيء
- Notification animation فوق (📩 إيميل جديد من المحلل)
- نص بسيط فوق: *"في مكتب Prism Consulting…"*
- منصور بيقرأ، بعد 4 ثواني → animation الموبايل بيطلع من جيبه → onComplete

#### 4. `src/components/game/screens/IncomingCallScreen.tsx` 🆕
**شاشة المكالمة الواردة (نفس شكل iOS/Android)**
- خلفية: `analyst-relaxing.png` (المحلل في كافيه/بيت — placeholder)
- في النص: card موبايل full-screen mockup بـ:
  - صورة منصور دائرية + اسمه "أ. أحمد منصور"
  - "📞 مكالمة واردة…"
  - Animation: ring vibration + ringtone sound
  - زرارين: 🔴 رفض / 🟢 رد
- لما يضغط رد → onComplete

#### 5. `src/components/game/screens/PhoneCallDebriefScreen.tsx` 🆕
**المكالمة الفعلية مع EnhancedDialogue**
- خلفية: `analyst-on-phone-{male/female}.png` (placeholder، gender-aware)
- في الكورنر العلوي: badge صغير "📞 مكالمة مع أ. منصور · 02:34" (counter شغّال)
- `EnhancedDialogue` بنفس النظام الحالي
- بيستخدم `mansour-call-scripts` بناءً على `outcome` من `usePFGame`
- بعد آخر سطر → onComplete → ResultScreen

---

### 🔧 ملفات هتتعدل

#### 1. `src/pages/Index.tsx`
- إضافة الـ Screens الجديدة للـ type union
- استبدال flow `presentation → return-travel → debrief → result` بـ:
  ```text
  presentation → email-send → mansour-receives → incoming-call → phone-call → result
  ```
- حذف import لـ `ReturnTravelScreen` و `DebriefScreen` (نخليهم مش مستخدمين بدل ما نحذفهم احتياطاً)

#### 2. `src/components/game/screens/PresentationScreen.tsx`
- في النهاية، بدل ما يكمل لـ return-travel على طول، يطلع زرار **"📧 أرسل التقرير لأستاذ منصور"** → `onComplete()` يروح لـ EmailSendScreen

#### 3. `src/components/game/ProgressTimeline.tsx`
- تحديث الـ stages لتشمل المراحل الجديدة (إيميل → مكالمة) بدل (سفر عودة → debrief)

#### 4. `src/hooks/useSoundEffects.tsx`
- إضافة 2 sounds: `playEmailSent` (whoosh) + `playPhoneRing` (ringtone loop)

---

### 🎨 الصور المطلوبة (نولدها بعدين)

| اسم الملف | الوصف | Gender-aware؟ |
|---|---|---|
| `analyst-laptop-evening-male.png` | محلل ذكر قاعد على لابتوب في كافيه/بيت، إضاءة دافية، بيكتب إيميل | ✅ |
| `analyst-laptop-evening-female.png` | محللة قاعدة على لابتوب، نفس الجو | ✅ |
| `mansour-reading-email.png` | منصور في مكتبه بيبص على شاشة الكمبيوتر/التابلت بتركيز | ❌ ثابت |
| `mansour-picking-phone.png` | منصور رافع التليفون بيدق على رقم (transition) | ❌ ثابت |
| `analyst-relaxing-male.png` | محلل ذكر قاعد مرتاح في كافيه/شرفة، الموبايل جنبه على الترابيزة | ✅ |
| `analyst-relaxing-female.png` | محللة قاعدة مرتاحة، نفس الجو | ✅ |
| `analyst-on-phone-male.png` | محلل ذكر ماسك الموبايل في ودنه، تعبير وجه (متركز/مبسوط/قلقان) | ✅ |
| `analyst-on-phone-female.png` | محللة ماسكة الموبايل، نفس الفكرة | ✅ |
| `mansour-avatar-circle.png` | صورة دائرية لمنصور لشاشة المكالمة الواردة | ❌ ثابت |

**إجمالي**: 9 صور (4 منهم بنسختين male/female = 8 + 1 منصور avatar = **9 ملفات**)

دلوقتي هنستخدم **placeholders** من الصور الحالية (مثلاً `mansour-office-seated-male.png` للمنصور بيقرأ الإيميل) لحد ما تجهز الصور الجديدة.

---

### 🛡️ ضمانات

- ✅ **اللوجيك صفر تغيير**: scoring, framing, outcome كله زي ما هو
- ✅ **EnhancedDialogue نفسه**: نفس المكون، نفس الـ animations، نفس الـ characters
- ✅ **Gender-awareness**: كل صورة فيها محلل بتتغير حسب `profile.gender`
- ✅ **Backward compatible**: الـ ReturnTravelScreen و DebriefScreen بيفضلوا في الكود (مش هنحذفهم) لو احتجنا نرجعهم
- ✅ **Placeholders جاهزة**: المشاهد هتشتغل من أول يوم بصور موجودة، بس هتبقى أحلى مع الصور الجديدة

---

### 📋 الـ Flow النهائي بعد التنفيذ

```text
Company Briefing → Travel → Arrival → Inquiry → Reflection → Framing
        ↓
[PresentationScreen] هشام يستلم التقرير
        ↓
[Send Button] "📧 أرسل لأستاذ منصور"
        ↓
[EmailSendScreen] المحلل بيبعت من اللابتوب 🚀
        ↓
[MansourReceivesEmailScreen] منصور بيقرأ في مكتبه
        ↓
[IncomingCallScreen] الموبايل بيرن عند المحلل 📞
        ↓
[Press 🟢 Answer]
        ↓
[PhoneCallDebriefScreen] حوار قصصي حسب outcome
   • strong → مكافأة + قصصي
   • medium → توجيه + خصم بسيط
   • weak → عنف + خصم + درس
        ↓
[ResultScreen]
```

---

### ✅ المتبقي بعد التنفيذ

كل اللي هيتبقى هو إنك تولد الـ 9 صور وتبعتهملي بأي أسماء، وأنا هحطهم في أماكنهم الصح بدل الـ placeholders.

