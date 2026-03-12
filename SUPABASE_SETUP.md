# הגדרת Supabase

## 1. משתני סביבה (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=[הדבק_כאן_את_ה-URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[הדבק_כאן_את_ה-KEY]
```

מצא אותם ב-Supabase Dashboard → Project Settings → API.

## 2. הרצת ה-Schema

ב-Supabase → SQL Editor הרץ את `SUPABASE_SCHEMA.sql`.

## 3. Storage

ב-Supabase → Storage צור bucket בשם `portfolio-assets`:
- Public: כן (לקריאה)
- Policies: Authenticated users can upload; Public read

## 4. משתמש Admin

ב-Supabase → Authentication → Users הוסף משתמש (אימייל + סיסמה).
השתמש באותו אימייל וסיסמה להתחברות ב-`/admin`.
