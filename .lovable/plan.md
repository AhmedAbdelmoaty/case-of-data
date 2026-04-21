

# 🎨 Prompts كاملة لصور سلسلة الإيميل + المكالمة (نسخة مصححة)

أعتذر عن الخطأ السابق — كنت غيّرت أوصاف الشخصيات بدل ما ألتزم بالـ character references الثابتة بتاعتك. دلوقتي البلان مبني على **نفس الـ 4 شخصيات بالظبط** اللي في الصور المرجعية، بنفس اللبس ونفس الملامح، ومع الـ **base prompt الثابت** اللي بتحطه قبل كل صورة.

---

## 🔒 BASE PROMPT (ثابت — يتحط قبل كل prompt)

```
Cinematic, photorealistic 3D render with a stylized semi-cartoon aesthetic matching the reference character images. Warm cinematic lighting with soft rim light. Shallow depth of field. 16:9 aspect ratio, 4K detail. Rich color grading with teal-orange balance. High-end luxury brand atmosphere. No text artifacts, no distorted faces, no extra limbs.
---
CHARACTER REFERENCES (use EXACT likeness from attached images):

- HISHAM AL-SHARIF (store owner): Egyptian man, ~45yo, trimmed dark hair with greying sides, sunglasses pushed up on head, thin mustache, beige blazer over light blue shirt with pocket square. Warm concerned expression.

- A. MANSOUR (consulting manager): Egyptian man, ~35yo, neatly styled black hair, full black beard, navy blue suit with crisp white shirt and red tie, holding a black leather folder and pen. Confident professional demeanor.

- PLAYER (MALE ANALYST): Egyptian man, ~28yo, short dark brown hair styled up, light stubble, dark navy button-up shirt, holding a black spiral notebook. Intelligent focused expression.

- PLAYER (FEMALE ANALYST): Egyptian woman, ~28yo, wearing burgundy/plum hijab, black-framed glasses, dark grey blazer over white shirt, holding a black spiral notebook. Intelligent focused expression.

IMPORTANT: Maintain EXACT facial features, hair, and clothing as in reference images.
```

> 📎 **مع كل توليد صورة**: ارفق الصور المرجعية بتاعت الشخصية (أو الشخصيتين) اللي في المشهد + اكتب الـ Base Prompt فوق + الـ Scene Prompt تحت.

---

## 📋 جدول الصور المطلوبة

| # | الملف | Aspect | الشخصيات في المشهد | المرجع المطلوب رفعه |
|---|---|---|---|---|
| 1 | `analyst-laptop-evening-male.png` | 16:9 | PLAYER (MALE) | analyst-2.png |
| 2 | `analyst-laptop-evening-female.png` | 16:9 | PLAYER (FEMALE) | analyst_women-2.png |
| 3 | `mansour-reading-email.png` | 16:9 | A. MANSOUR | mansour-2.png |
| 4 | `mansour-picking-phone.png` | 16:9 | A. MANSOUR | mansour-2.png |
| 5 | `analyst-relaxing-male.png` | 16:9 | PLAYER (MALE) | analyst-2.png |
| 6 | `analyst-relaxing-female.png` | 16:9 | PLAYER (FEMALE) | analyst_women-2.png |
| 7 | `analyst-on-phone-male.png` | 16:9 | PLAYER (MALE) | analyst-2.png |
| 8 | `analyst-on-phone-female.png` | 16:9 | PLAYER (FEMALE) | analyst_women-2.png |
| 9 | `mansour-avatar-circle.png` | 1:1 | A. MANSOUR | mansour-2.png |

**إجمالي: 9 صور**

---

## 🎬 SCENE PROMPTS (تتحط بعد الـ Base Prompt مباشرة)

### 1️⃣ `analyst-laptop-evening-male.png`
**مرجع: analyst-2.png**
```
SCENE: Wide cinematic shot of the MALE ANALYST (exact likeness from reference) seated at a modern wooden desk in a cozy upscale apartment in the evening. He is wearing his signature dark navy button-up shirt, focused on an open silver MacBook laptop, fingers on the keyboard composing an important email. The laptop screen glows softly, casting warm light on his face. His black spiral notebook sits closed beside the laptop. On the desk: a glass of mint tea, a smartphone face-down. Background: blurred warm bokeh of hanging Edison bulbs, large window showing out-of-focus Cairo nightscape with city lights and distant minarets. Color palette: deep navy and charcoal with warm amber and gold accents. Mood: focused, professional, end-of-workday.
```

### 2️⃣ `analyst-laptop-evening-female.png`
**مرجع: analyst_women-2.png**
```
SCENE: Wide cinematic shot of the FEMALE ANALYST (exact likeness from reference — burgundy/plum hijab, black-framed glasses, dark grey blazer over white shirt) seated at a modern wooden desk in a cozy upscale apartment in the evening. She is focused on an open silver MacBook laptop, fingers on the keyboard composing an important email. The laptop screen glows softly, casting warm light on her face. Her black spiral notebook sits closed beside the laptop. On the desk: a glass of mint tea, a smartphone face-down. Background: blurred warm bokeh of hanging Edison bulbs, large window showing out-of-focus Cairo nightscape with city lights and distant minarets. Color palette: deep navy and charcoal with warm amber and gold accents. Mood: focused, professional, end-of-workday.
```

### 3️⃣ `mansour-reading-email.png`
**مرجع: mansour-2.png**
```
SCENE: Cinematic medium shot of A. MANSOUR (exact likeness from reference — full black beard, navy blue suit with crisp white shirt and red tie) seated at a large executive desk in his modern high-end consulting firm office at night. He is leaning slightly forward holding a black tablet in his hands, reading an email with a serious, focused, slightly narrowed-eye expression of concentration. His black leather folder sits closed on the desk beside him. Behind him: floor-to-ceiling windows showing a panoramic Cairo skyline at night, glowing city lights softly out of focus, with the same potted plants visible in the reference. Warm desk lamp casts a golden glow on one side of his face, while cool blue light from the window touches the other side. Color palette: deep navy, charcoal, with warm gold accents. Mood: contemplative, executive, decisive.
```

### 4️⃣ `mansour-picking-phone.png`
**مرجع: mansour-2.png**
```
SCENE: Cinematic close-up shot of A. MANSOUR (exact likeness from reference — full black beard, navy blue suit, crisp white shirt, red tie) standing beside his executive desk, holding a sleek black smartphone up to his ear, mid-action of dialing — his other hand still hovering near the screen. Expression: serious and intentional, jaw set, eyes focused forward. Background: same modern office with the Cairo nightscape glowing softly out of focus through the window behind him, plants visible. Warm desk lamp light from below catches his hand and the phone. Color palette: deep navy, charcoal, gold and amber accents. Mood: decisive, urgent, professional.
```

### 5️⃣ `analyst-relaxing-male.png`
**مرجع: analyst-2.png**
```
SCENE: Wide cinematic shot of the MALE ANALYST (exact likeness from reference — dark navy button-up shirt) now relaxed after sending the email. He is sitting back in a plush armchair on a small balcony overlooking a glowing Cairo cityscape at night. Posture relaxed, leaning back, one arm on the armrest, holding a small glass of mint tea. On a small side table next to him: his smartphone face-up with a dark screen, and his black spiral notebook closed. Soft warm string lights overhead, blurred city lights and distant minarets. Expression: calm, satisfied, slightly tired but content — a small smile. Color palette: deep navy sky with warm amber, gold, and orange city glow. Mood: peaceful, end-of-day relief, the calm before the call.
```

### 6️⃣ `analyst-relaxing-female.png`
**مرجع: analyst_women-2.png**
```
SCENE: Wide cinematic shot of the FEMALE ANALYST (exact likeness from reference — burgundy/plum hijab, black-framed glasses, dark grey blazer over white shirt) now relaxed after sending the email. She is sitting back in a plush armchair on a small balcony overlooking a glowing Cairo cityscape at night. Posture relaxed, leaning back, one arm on the armrest, holding a small glass of mint tea. On a small side table next to her: her smartphone face-up with a dark screen, and her black spiral notebook closed. Soft warm string lights overhead, blurred city lights and distant minarets. Expression: calm, satisfied, slightly tired but content — a small smile. Color palette: deep navy sky with warm amber, gold, and orange city glow. Mood: peaceful, end-of-day relief, the calm before the call.
```

### 7️⃣ `analyst-on-phone-male.png`
**مرجع: analyst-2.png**
```
SCENE: Cinematic medium shot of the MALE ANALYST (exact likeness from reference — dark navy button-up shirt, short dark brown hair, light stubble) standing on the balcony, holding a black smartphone pressed to his right ear, listening intently to an important call. His other hand rests on the balcony railing. Facial expression: alert, attentive, slightly tense — eyebrows slightly furrowed, lips parted as if about to respond. Background: glowing Cairo nightscape with warm city lights and distant minarets, blurred bokeh. Warm string lights above cast soft golden light on his face, contrasting with the cool blue night behind. Color palette: deep navy and charcoal with warm amber and gold accents. Mood: tense, anticipatory, the moment of truth.
```

### 8️⃣ `analyst-on-phone-female.png`
**مرجع: analyst_women-2.png**
```
SCENE: Cinematic medium shot of the FEMALE ANALYST (exact likeness from reference — burgundy/plum hijab, black-framed glasses, dark grey blazer over white shirt) standing on the balcony, holding a black smartphone pressed to her right ear, listening intently to an important call. Her other hand rests on the balcony railing. Facial expression: alert, attentive, slightly tense — eyebrows slightly furrowed, lips parted as if about to respond. Background: glowing Cairo nightscape with warm city lights and distant minarets, blurred bokeh. Warm string lights above cast soft golden light on her face, contrasting with the cool blue night behind. Color palette: deep navy and charcoal with warm amber and gold accents. Mood: tense, anticipatory, the moment of truth.
```

### 9️⃣ `mansour-avatar-circle.png` (1:1 — للـ caller ID في شاشة المكالمة)
**مرجع: mansour-2.png**
```
SCENE: Professional close-up portrait headshot of A. MANSOUR (exact likeness from reference — full black beard, neatly styled black hair, navy blue suit jacket, crisp white shirt, red tie). He is looking directly at the camera with a confident, composed, slightly serious executive expression — a hint of warmth in his eyes. Soft studio lighting from a 45-degree angle, neutral dark gradient background (deep charcoal to navy). Centered composition, head and shoulders only, perfectly framed for a circular crop (avatar style). 1:1 SQUARE ASPECT RATIO (override the 16:9 in base prompt for this image only). Sharp focus on face, soft background.
```

---

## 🎯 خطوات التوليد (مهم جداً)

لكل صورة من الـ 9:

1. **افتح أداة توليد الصور** (Gemini / Nano Banana Pro)
2. **ارفع الصور المرجعية** المذكورة في عمود "المرجع المطلوب رفعه"
   - مثلاً صورة 1: ارفع `analyst-2.png`
   - صورة 9: ارفع `mansour-2.png`
3. **انسخ الـ Base Prompt** كامل (الموجود فوق)
4. **الصق Scene Prompt** بتاع الصورة بعده مباشرة
5. **ولّد الصورة** → تأكد إن الشخصية مطابقة للمرجع 100%
6. **لو فيه اختلاف** في اللبس أو الملامح: أعد التوليد مع التأكيد على الـ "EXACT likeness from reference"

---

## 📤 بعد ما تجهّز الصور

ابعتهم ليّا بأي أسماء، وأنا هحطهم في أماكنهم الصح:

| الصورة | المكان في الكود |
|---|---|
| analyst-laptop-evening-{male/female} | `EmailSendScreen.tsx` |
| mansour-reading-email | `MansourReceivesEmailScreen.tsx` (phase: reading) |
| mansour-picking-phone | `MansourReceivesEmailScreen.tsx` (phase: phoning) |
| analyst-relaxing-{male/female} | `IncomingCallScreen.tsx` |
| mansour-avatar-circle | `IncomingCallScreen.tsx` (caller ID) |
| analyst-on-phone-{male/female} | `PhoneCallDebriefScreen.tsx` |

كل الـ imports والـ wiring هتبقى جاهزة فور ما تبعت الصور — مفيش أي تغيير في اللوجيك أو الـ flow.

---

## ✅ ضمانات

- ✅ نفس الـ 4 شخصيات بالظبط (نفس الملامح، نفس اللبس، نفس الـ accessories)
- ✅ المحللة بالحجاب البرغندي + النضارة السوداء (زي المرجع)
- ✅ المحلل بقميص النيفي الكحلي (زي المرجع)
- ✅ منصور بالبدلة الكحلي + الكرافت الأحمر (زي المرجع)
- ✅ هشام مش هيظهر في المشاهد دي (هو بس في PresentationScreen السابقة)
- ✅ نفس الـ Base Prompt الثابت بتاعك بدون تعديل
- ✅ الـ 9 صور هتبقى متناسقة بصرياً مع باقي صور اللعبة الموجودة

