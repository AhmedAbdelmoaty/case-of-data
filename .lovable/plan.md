# فهمت إيه بالظبط

اللي طالبه يتلخص في 4 محاور:

1. **فلترة صارمة**: الداشبورد يعرض **فقط** اللي:
  - خلصوا اللعبة (وصلوا لشاشة النتيجة).
  - حلّوا الـ 5 أسئلة كلها صح (يعني مشيوا على الـ spine كامل من غير ما يدخلوا في wrong track).
  - والتأطير في التقرير 2/3 أو 3/3 صح.
  - أي حد عمل سؤال غلط واحد أو framing < 2 → مش هيظهر خالص حتى لو خلّص بسرعة.
2. **الترتيب بالسرعة**: الأسرع في الأعلى. مفيش وقت متسجل حاليًا، فلازم نسجّل `started_at` لما اللاعب يبدأ + `duration_ms` عند الإنهاء، والترتيب بيكون بالأقل duration.
3. **تحديث Live اوتوماتيك**: شاشة الإيفنت تتحدث لحظة ما حد جديد يأهّل، من غير refresh، عبر Supabase Realtime + animation للداخل الجديد.
4. **Reset** زر "Reset" تاني (احتياطي) يمسح كل شيء لو حبيت.  
خلينا دلوقتي نبدأ بزر الريست وبعدين نبقى نطور ونعمل ال EVENT SESSION او اي تطوير اخر بس خلينا دلوقتي نبدأ بابسط حاجه 
5. **تصميم gamified**: ميداليات (🥇🥈🥉)، كاس للأول، خلفية متدرجة، fonts عصرية (Cairo display)، animations دخول من اليمين مع glow، confetti بسيط للأول، أوقات الإنهاش بشكل واضح (مثلًا "2:14")، شارة "LIVE" نابضة.

---

# الـ Plan الكاملة

## 1. تعديلات قاعدة البيانات (Migration)

### جدول `completed_players` — إضافة أعمدة:

```sql
ALTER TABLE completed_players
  ADD COLUMN qualified boolean NOT NULL DEFAULT false,
  ADD COLUMN outcome text,                  -- 'strong' | 'medium' | 'weak'
  ADD COLUMN framing_correct int,           -- 0..3
  ADD COLUMN duration_ms int,               -- وقت اللعب بالمللي ثانية
  ADD COLUMN started_at timestamptz;        -- وقت بداية الجلسة للاعب
```

- **ملاحظة**: `qualified = true` فقط لما (full spine صح) AND (framing_correct >= 2).
- نضيف index: `(qualified, duration_ms ASC)` للأداء.

### جدول جديد `event_sessions`:

```sql
CREATE TABLE event_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id)
);
```

- RLS: قراءة public (anon)، insert/update للأدمن فقط.
- Trigger أو منطق يضمن جلسة active واحدة بس.

### Realtime:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE completed_players;
ALTER PUBLICATION supabase_realtime ADD TABLE event_sessions;
```

## 2. تعديلات اللعبة (تتبع الوقت + التأهل)

### `PFGameContext.tsx`:

- نضيف `gameStartedAt: number` يتسجّل أول لما اللاعب يدخل الـ inquiry (أو الـ company-briefing).
- يتحفظ في الـ state ويتمرّر لـ ResultScreen.

### `ResultScreen.tsx` — تعديل الـ insert:

```ts
const fullSpine = !state.trackEntered &&
  state.history.length >= 5 &&
  state.history.every(h => h.choice === "correct");
const qualified = fullSpine && state.framingCorrectCount >= 2;
const duration_ms = Date.now() - state.gameStartedAt;

supabase.from("completed_players").insert({
  first_name, last_name,
  qualified,
  outcome: state.outcome,
  framing_correct: state.framingCorrectCount,
  duration_ms,
  started_at: new Date(state.gameStartedAt).toISOString(),
});
```

- (مش هنغيّر شاشة النتيجة للاعب نفسه — هي زي ما هي).

## 3. الداشبورد الجديدة (`AdminBoard.tsx`)

### Logic:

- جيب `event_sessions` الـ active الواحدة.
- جيب `completed_players` WHERE `qualified = true` AND `completed_at >= active.started_at` ORDER BY `duration_ms ASC`.
- اشترك على Realtime channel للجدولين:
  - عند INSERT جديد مؤهل → ضيفه في القائمة بـ animation.
  - عند تغيير الـ active session → اعمل reload وتفريغ.

### UI / تصميم gamified:

**Layout** (full-screen مناسب للعرض على شاشة كبيرة):

```
┌─────────────────────────────────────────────┐
│  🏆 لوحة المتصدرين  •  ● LIVE   [⚙ جلسة]  │
│                 │
├─────────────────────────────────────────────┤
│  ╔═══════════════════════════════════════╗  │
│  ║ 🥇  أحمد عبدالمعطي         02:14    ║  │  ← ، gradient ذهبي، كاس، glow
│  ║                         ║  │
│  ╚═══════════════════════════════════════╝  │
│  ┌─────────────────────────────────────┐    │
│  │ 🥈  سارة محمد              02:48   │    │  ← 
│  │                       │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │ 🥉  محمد علي               03:05   │    │  ← 
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │ 4    خالد ...              03:22   │    │
│  ...                                          │
└─────────────────────────────────────────────┘
```

انا مش عايز البورد يكون فيها حاجات كتير هو الاسم فقط وانجاوات بقى وانميشن على حسب اللاعب وترتيبه    
لكن مش عايز اي نصوص تانيه ولا كلمة تأطير قوي او متوسط ولا اي حاجه من ده ولا حتى ذهبي وفضي  وكده انا عايز النص فقط يكون اسم اللاعب واي حاجه تانيه هي ايموجيز وانميشن وعايز الوان واحساس لعب ممتع  مش عايز الداشوبرد تكون مليانة كلام وخلاص هي حاجه بس للمرح وتركيز يكون على الانميشن واحساس اللعب وكده وعايز ايموجيز او احساس انجاز لكل اللاعيبة حتى لو بدرجة اقل من اول3 مراكز بس على الاقل الباقي يكون ليهم بردو احساس ايموجي وانجاز مش يبقى الاسم بس   
**عناصر التصميم**:

- خلفية: gradient غامق متحرك (slate-900 → blue-950) + particles خفيفة.
- الأول: كرت كبير، ذهبي gradient، أيقونة كأس Trophy متحركة (bouncing/glow)، شارة "البطل"، confetti إن جا جديد.
- 2 و 3: ميداليات فضية/برونزية، أحجام أصغر.
- 4+: كروت موحّدة بسيطة برقم.
- كل كرت يدخل بـ slide-in من اليمين + scale + glow flash لما يكون جديد (highlight لمدة 3 ثواني).
- شارة `● LIVE` نابضة (pulse) أحمر.
- الوقت بفونت monospace كبير واضح.
- Header يعرض اسم الجلسة + وقت البداية + عدد المؤهلين.
- شريط جانبي/زرار صغير أعلى للأدمن:
  - "جلسة جديدة" (يعمل end للـ active ويبدأ واحدة جديدة → القايمة تتفضى لحظيًا).  
  وممكن ميكونش اسم الزر"جلسة جديدة"  ممكن يبقى ايموجي يعبر عن الريست او حتى كلمة REST
  - "تصدير" CSV للنتايج الحالية.
  - "خروج".

**Fonts**: Cairo / Tajawal للعربي، JetBrains Mono للأرقام.

**Responsiveness**: مصمّمة بريمري لشاشة كبيرة (1920×1080) مع تكبير الفونت، لكن تشتغل على لابتوب عادي.

## 4. ملاحظات تقنية

- اللاعبين الحاليين في الجدول هيبقوا بـ `qualified = NULL/false` و `duration_ms = NULL`، فمش هيظهروا في الداشبورد الجديدة (وده اللي عايزينه).
- Realtime subscription لازم يتعمله cleanup عند unmount.
- نضيف protection: لو في أكتر من 100 مؤهل، نعرض top 50 + scroll.
- زر "تصدير CSV" مفيد بعد الإيفنت.

## ملفات هتتعدل/تتعمل

- **Migration SQL** (أعمدة جديدة + جدول `event_sessions` + RLS + realtime).
- `src/contexts/PFGameContext.tsx` — تتبع `gameStartedAt`.
- `src/components/game/screens/ResultScreen.tsx` — insert بالحقول الجديدة.
- `src/pages/AdminBoard.tsx` — إعادة كتابة كاملة بالتصميم الـ gamified + realtime + session control.
- (احتمال) `src/components/admin/SessionControl.tsx` — modal منفصل للإدارة.
- `tailwind.config.ts` / `index.css` — animations جديدة (gold-glow, slide-in-highlight, pulse-live).

---

**سؤال واحد قبل التنفيذ**: تفضّل الوقت يبدأ يتحسب من **بداية الـ inquiry** (أول سؤال) أم من **company-briefing** (دخول اللعبة الفعلي)؟ أنا مرشّح **بداية الـ inquiry** عشان مايتأثرش بسرعة قراءة المقدمة — لكن قولي رأيك. (لو مش مهم، هختار inquiry start).