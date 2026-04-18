

# خطة تطوير شاملة — Sound Effects + Game Feel + Polish

## 🎯 الهدف
نقل اللعبة من "تجربة جيدة" لـ "تجربة لا تُنسى" — صوت غني، ردود فعل بصرية فورية، حركة حية، وتفاصيل صغيرة بتفرق جداً.

---

## 1. 🔊 Sound Effects — توسعة كبيرة

### أصوات بيئية (Ambient loops)
- **داخل المتجر**: صوت خافت لمكيف + همهمة زباين بعيدة
- **داخل المكتب**: صوت ساعة حائط + كيبورد بعيد
- **شارع/سفر**: صوت سيارات وزحام خفيف
- كل واحد بيشتغل loop خفيف (volume 0.05) ويتغير حسب المشهد

### أصوات تفاعل (UI feedback)
| الحدث | الصوت |
|---|---|
| Hover على زرار سؤال | tick خفيف |
| اختيار سؤال | "page-flip" (ورقة بتتقلب) |
| فتح الدفتر | "notebook-open" |
| حفظ ملاحظة جديدة | "pen-write" + chime صغير |
| اختيار تأطير | "stamp" (ختم خشبي) |
| ظهور النتيجة (نجاح) | فانفير قصير |
| ظهور النتيجة (فشل) | نغمة هابطة حزينة |
| Trust ينخفض | نغمة منخفضة tense |
| ظهور insight جديد | sparkle |

### أصوات شخصيات
- **typing tick** أثناء الـ dialogue (موجود بس نخليه أحلى — pitch يتغير حسب الشخصية: منصور أعمق، أبو سعيد أوسط، اللاعبة أعلى)
- **footsteps** عند الانتقال بين المشاهد
- **door creak** عند فتح باب المكتب (مختلف عن knock)

كل ده هيتعمل بـ Web Audio synthesis (زي اللي عندنا) — مفيش API خارجي.

---

## 2. ✨ Visual Feedback — Game Feel

### Screen shake & impact
- شاشة بترتعش خفيف لما الـ trust ينخفض
- "punch" zoom بسيط على البورتريه لما الشخصية تقول جملة مهمة
- Flash أبيض خاطف (50ms) عند لحظات حاسمة (اختيار التأطير الصح)

### Particle effects
- **Sparkles** حوالين أيقونة الدفتر لما تتحفظ ملاحظة
- **Dust motes** خفيفة في خلفيات المتجر (ذرات غبار طايرة)
- **Confetti** عند نجاح التأطير (موجود بس نخليه أكتر وأطول)
- **Smoke** خفيف من فنجان قهوة على مكتب منصور

### Cursor & hover polish
- Cursor يبقى pointer مخصص فوق العناصر التفاعلية
- Glow حوالين الزراير المهمة بيتنفس (breathing)
- ripple effect عند الضغط

---

## 3. 🎬 Animation Upgrades

### شخصيات حية
- **Idle breathing**: الصور بتتنفس (scale 1.0 → 1.02 → 1.0) كل 4 ثواني
- **Blink**: رمشة كل 5-7 ثواني (overlay سريع)
- **Mouth movement**: bobbing أكتر synced مع الـ typing

### Camera moves
- **Ken Burns effect**: الخلفيات بتتحرك بطيء (zoom in/pan) بدل ما تكون ساكنة
- **Parallax** بسيط على عناصر الخلفية لما الـ mouse يتحرك

### Transitions أحلى
- **Iris wipe** (دائرة بتقفل/تفتح) بدل fade عادي في لحظات معينة
- **Push transition** بين المشاهد (المشهد القديم بيخرج من الشمال، الجديد داخل من اليمين) — بيدي إحساس حركة

---

## 4. 🎮 Micro-interactions جديدة

### Trust meter (مخفي)
- شريط ثقة صغير جدا في الكورنر (بدون أرقام، بس icon قلب/وجه)
- بيتغير لون تدريجي (أخضر → أصفر → أحمر) — **بدون تسريب** للسؤال الصح
- بيهتز شوية لما يتغير

### Notebook breathing
- لما تتحفظ ملاحظة جديدة: bounce + glow + counter يطلع بـ pop animation
- الأيقونة بتتنفس بـ pulse خفيف لو فيه ملاحظات جديدة لسه ما اتقريتش

### Question card hover
- الكارت بيتحرك 3D tilt خفيف (mouse position based)
- shadow بيتعمق
- glow بيظهر من الأطراف

### Voice-over indicator
- waveform صغير بيتحرك جنب اسم الشخصية أثناء الكلام
- لما تضغط رجوع، الـ waveform بيظهر أنه بيعيد

---

## 5. 🎵 Music Layering

### Adaptive music
- موسيقى خلفية بطبقات (layers) بتظهر/تختفي حسب الموقف:
  - **Layer 1 (دايم)**: لحن هادئ
  - **Layer 2 (في الأسئلة)**: إيقاع خفيف
  - **Layer 3 (في التأطير)**: tension strings
  - **Layer 4 (نتيجة)**: triumphant أو somber

### Music transitions
- بدل cut حاد، crossfade ناعم بين الموسيقات (3 ثواني)
- duck الموسيقى تلقائياً (volume ينخفض 50%) لما الـ voice-over يشتغل

---

## 6. 📋 الأولوية (Implementation order)

| المرحلة | الشغل | الأثر |
|---|---|---|
| 1 | إضافة 8 أصوات UI جديدة (page-flip, stamp, pen-write, sparkle, tick, etc.) | 🔥🔥🔥 |
| 2 | Idle breathing + blink للشخصيات | 🔥🔥🔥 |
| 3 | Ambient loops (3 خلفيات صوتية) | 🔥🔥 |
| 4 | Notebook polish (bounce + glow + counter pop) | 🔥🔥 |
| 5 | Question card 3D tilt hover | 🔥🔥 |
| 6 | Ken Burns على الخلفيات | 🔥🔥 |
| 7 | Music ducking عند voice-over | 🔥🔥 |
| 8 | Screen shake خفيف عند الـ trust drop | 🔥 |
| 9 | Cursor مخصص على hotspots | 🔥 |
| 10 | Particle dust في الخلفيات | 🔥 |

---

## 7. 📁 الملفات اللي هتتعدل/تتضاف

| ملف | التعديل |
|---|---|
| `useSoundEffects.tsx` | إضافة 8 sound types جديدة (pageFlip, stamp, penWrite, sparkle, tick, footstep, doorCreak, lowTension) |
| `useAmbientSound.tsx` (جديد) | Hook لتشغيل ambient loops حسب المشهد |
| `useBackgroundMusic.tsx` | إضافة ducking + crossfade |
| `AnimatedCharacter.tsx` | idle breathing + blink overlay |
| `EnhancedDialogue.tsx` | waveform indicator + sound تشغيل عند الرجوع |
| `PFNotebook.tsx` | bounce/glow عند ملاحظة جديدة + counter pop |
| `InquiryScreen.tsx` | 3D tilt على question cards + Ken Burns + ambient |
| `ArrivalScreen.tsx` / `CompanyBriefingScreen.tsx` | Ken Burns + ambient loops |
| `FramingScreen.tsx` | stamp sound + screen flash عند الاختيار |
| `ResultScreen.tsx` | confetti موسع + fanfare/somber music |
| `index.css` | breathing keyframes + cursor styles |

---

## ⚠️ ضمانات (مهم)

- **مفيش تسريب**: كل الأصوات والأنيميشنز محايدة — مفيش صوت "صح" أو "غلط" أثناء اختيار السؤال. الصوت الإيجابي/السلبي يظهر فقط بعد الـ result الفعلي.
- **Performance**: كل الأنيميشنز CSS-based أو requestAnimationFrame خفيف — مش هيأثر على framerate.
- **Sound toggle**: كل الأصوات الجديدة تحت نفس الـ toggle الموجود في settings.
- **Mobile-friendly**: كل الـ hover effects عندها fallback للـ touch.

