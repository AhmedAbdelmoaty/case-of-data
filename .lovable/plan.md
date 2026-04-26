# 🎯 خطة التعديلات (نسخة معدلة)

## فهمي للطلب

1. **تعطيل تسجيل الدخول مؤقتاً** للاعبين العاديين (مش حذف).
2. **شاشة Setup** خانتين: الاسم الأول + الاسم الأخير.
3. **داخل اللعبة** نستخدم الاسم الأول فقط.
4. **Leaderboard مخفي** — صفحة admin خاصة بيك أنت بس، مش ظاهرة لأي لاعب.

---

## 1) تعطيل الـ Login للاعبين (بدون حذف)

- في `src/App.tsx`: راوت `/` و `/setup` يبقوا **مفتوحين** بدون `ProtectedRoute`.
- نسيب ملفات `Auth.tsx`, `AuthContext.tsx`, `ProtectedRoute.tsx` زي ما هم — نقدر نرجعهم بسهولة.
- نعمل **GuestProfileContext** خفيف يخزن `firstName / lastName / gender / avatar_choice` في `localStorage` تحت مفتاح `pf-guest-profile`.
- الكومبوننتس اللي بتستدعي `useAuth().profile` تتحول للـ Guest Profile.
- اللاعب يفتح اللعبة → لو معملش setup يروح `/setup`، خلصه يروح `/`.

## 2) شاشة Setup الجديدة

- خانتين: **الاسم الأول** + **الاسم الأخير** (الاتنين required، عربي/إنجليزي).
- يتحفظوا في الـ Guest Profile.
- زرار "يلا نبدأ 🚀" يحفظ ويوديه على `/`.

## 3) الاسم داخل اللعبة

- نستخدم `firstName` فقط في كل المراجع (`ResultScreen` وأي مكان تاني).

---

## 4) Leaderboard (Admin فقط — مخفي)

### أ) جدول `completed_players` في الـ backend

| العمود | النوع |
|---|---|
| `id` | uuid PK |
| `first_name` | text NOT NULL |
| `last_name` | text NOT NULL |
| `completed_at` | timestamptz default now() |

**RLS (مهم جداً عشان الخصوصية):**
- `INSERT`: مسموح للجميع (عشان اللاعبين يقدروا يسجلوا إنهائهم بدون login).
- `SELECT`: **محصور على admin فقط** — هنستخدم `has_role(auth.uid(), 'admin')`.
- `UPDATE/DELETE`: ممنوع لأي حد.

### ب) نظام أدوار (roles)

عشان الـ admin يبقى آمن وما يتحكنش من client-side:

- جدول `app_role` enum (`'admin'`, `'user'`).
- جدول `user_roles` (`user_id`, `role`) منفصل.
- function `has_role(_user_id, _role)` بـ `SECURITY DEFINER`.
- بعد الـ migration، أنا هضيفلك صف يدوي في `user_roles` لـ user_id بتاعك (هتقولي ايميلك أو تعمل signup مرة واحدة وأنا هرفّعك admin).

### ج) تسجيل الإنهاء

في `ResultScreen.tsx` لما اللاعب يوصل النتيجة لأول مرة:
- `insert` على `completed_players` بـ first_name + last_name.
- flag في localStorage (`pf-game-submitted`) يمنع التكرار لو ضغط "العب مرة أخرى".

### د) صفحة Admin مخفية

- راوت **سري**: `/admin/board-9k2x` (مش مربوط بأي زرار في اللعبة، ومش في sitemap).
- محمي بـ `ProtectedRoute` + check على `has_role(user, 'admin')`.
- لو دخل أي حد مش admin → يتحول على `/`.
- صفحة الدخول للأدمن: `/admin/login` (نفس صفحة Auth الحالية، لكن بعد الـ login لو مش admin يتلغبط).

### هـ) شكل صفحة الـ Board

```
┌─────────────────────────────────┐
│   🏁  Completed Players          │
│   (Admin View)                  │
│                                 │
│   1.  أحمد حسن                   │
│   2.  Sara Mohamed              │
│   3.  Omar Ali                  │
│   4.  محمد إبراهيم               │
│                                 │
│         [تسجيل خروج]              │
└─────────────────────────────────┘
```

- مرتبين `ORDER BY completed_at ASC` (الأقدم فوق).
- بدون أي تفاصيل تانية (لا وقت، لا تقييم، لا email).
- التكرارات تتعرض زي ما هي.

---

## ملخص الملفات

**جديد:**
- `src/contexts/GuestProfileContext.tsx`
- `src/pages/AdminBoard.tsx` (راوت `/admin/board-9k2x`)
- `src/pages/AdminLogin.tsx` (راوت `/admin/login`)
- migration: جدول `completed_players` + `user_roles` + `app_role` enum + `has_role` function + RLS

**تعديل:**
- `src/App.tsx` — إزالة الحماية من `/`، إضافة GuestProfileProvider، إضافة راوتات الأدمن
- `src/pages/Setup.tsx` — خانتين للاسم + Guest Profile
- `src/pages/Index.tsx` — Guest Profile بدل useAuth
- `src/components/game/screens/ResultScreen.tsx` — firstName + insert في completed_players

**مش بيتلمس:**
- `Auth.tsx`, `AuthContext.tsx`, `ProtectedRoute.tsx` (نسيبهم للأدمن وللرجوع المستقبلي)
- جدول `profiles`

---

## خطوات تفعيل الـ admin (بعد التنفيذ)

1. هتروح على `/admin/login` وتعمل signup بإيميل وباسورد.
2. تقولي الإيميل، وأنا هضيفلك صف في `user_roles` يخليك admin.
3. بعد كده هتدخل `/admin/board-9k2x` وتشوف الـ Leaderboard.
4. اللاعبين العاديين مش هيشوفوا الزرار ده ولا الراوت في أي مكان في اللعبة.

---

## ملاحظة أمنية

- الـ RLS هي اللي بتحمي البيانات فعلياً — حتى لو حد عرف الـ URL السري، مش هيقدر يقرأ الـ leaderboard إلا لو عنده role = admin في الـ backend.
- الـ obfuscated URL (`board-9k2x`) طبقة إضافية بس، الحماية الحقيقية في الـ RLS + role check.
