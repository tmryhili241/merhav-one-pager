# מערכת עיצוב – להטמעה בקוד

קובץ הוראות לכלי פיתוח (Antigravity וכו'). נגזר מהמסמך "מערכת עיצוב – משתני CSS", שהוא המקור. אין לשנות ערכים כאן בלי לשנות קודם במקור.

עדכון אחרון: 15.11.2026

## כללים

1. כל הצבעים, הפונטים, הגדלים והמשקלים מוגדרים **רק** בבלוק `:root` שבראש `css/style.css`. בשאר הקוד משתמשים רק ב-`var(--...)`. אסור לכתוב ערך HEX, שם פונט או גודל בפיקסלים מחוץ לבלוק.
2. משתמשים במשתני התפקיד (`--color-primary`, `--color-correct` וכו'), לא ישירות בצבעי הקיט.
3. `style.css` נטען **אחרי** `bootstrap.rtl.min.css`. דורסים את Bootstrap דרך משתני ה-CSS שלו (`--bs-...`) ולא בהגדרות כפולות.
4. גדלי טקסט ביחידות `rem` בלבד. mobile first: ערכי ברירת המחדל הם לנייד, וה-media query מ-992px מגדיל כותרות.
5. משובים בתרגול: הצבע משמש לרקע או למסגרת, והטקסט תמיד `--color-text`. אסור טקסט ירוק, אדום או צהוב על רקע לבן (לא עובר ניגודיות WCAG 2.1, 4.5:1).
6. טקסט צבעוני מותר רק ב-`--color-primary`, ורק כשיש לו תפקיד (קישור, כפתור, הדגשה בעלת משמעות). לא לקישוט.
7. משוב חלקי: השדות או התשובות הנכונים מסומנים ב-`--color-correct`, והשגויים או החסרים ב-`--color-wrong`.
8. כל גרפיקה שעוד לא עוצבה (כולל הלוגו): שומר מקום אפור עם X, ברקע `--color-placeholder`, עם `aria-label` שמתאר מה יהיה שם (למשל `aria-label="לוגו מרחב"`).
9. הערות בקוד באנגלית.

## פונטים

לטעון מ-Google Fonts ב-`<head>`, לפני `style.css`:
- **Rubik** במשקלים 400, 600, 700 (כותרות)
- **Assistant** במשקלים 400, 600, 700 (טקסט)

## הבלוק

```css
:root {
  /* Kit colors - Neutral */
  --color-white: #FFFFFF;
  --color-broken-white: #E0DFDF;
  --color-black: #000000;

  /* Kit colors - Call to Action */
  --color-blue-sea: #0163FD;
  --color-blue-sky: #CCE0FF;
  --color-dark-yellow: #FDB61E;

  /* Kit colors - Secondary */
  --color-yellow-med: #FCB923;
  --color-yellow-sun: #FFCF3C;
  --color-sage-green: #81A26B;
  --color-red-lips: #E83E2D;
  --color-ice-blue: #80CAE3;

  /* Role colors - use these in components */
  --color-primary: var(--color-blue-sea);        /* buttons, links, nav */
  --color-highlight-bg: var(--color-blue-sky);   /* highlighted areas */
  --color-accent: var(--color-dark-yellow);      /* emphasis (bg/border only) */
  --color-correct: var(--color-sage-green);      /* correct feedback (bg/border only) */
  --color-wrong: var(--color-red-lips);          /* wrong + partial feedback (bg/border only) */
  --color-bg: var(--color-white);                /* page background */
  --color-border: var(--color-broken-white);     /* dividers, subtle backgrounds */
  --color-placeholder: var(--color-broken-white);/* missing graphics */
  --color-text: var(--color-black);              /* all text */

  /* Fonts */
  --font-heading: "Rubik", sans-serif;
  --font-body: "Assistant", sans-serif;

  /* Font sizes - mobile first */
  --fs-h1: 2.5rem;      /* 40px */
  --fs-h2: 1.75rem;     /* 28px */
  --fs-h3: 1.25rem;     /* 20px */
  --fs-body: 1rem;      /* 16px */
  --fs-small: 0.875rem; /* 14px */

  /* Font weights */
  --fw-regular: 400;
  --fw-semibold: 600;
  --fw-bold: 700;
}

/* Larger screens: bigger headings */
@media only screen and (min-width: 992px) {
  :root {
    --fs-h1: 4.25rem;   /* 68px */
    --fs-h2: 2rem;      /* 32px */
  }
}
```

## מיפוי טיפוגרפיה

| אלמנט | פונט | גודל | משקל |
| --- | --- | --- | --- |
| `h1` | `--font-heading` | `--fs-h1` | `--fw-bold` |
| `h2` | `--font-heading` | `--fs-h2` | `--fw-semibold` |
| `h3` | `--font-heading` | `--fs-h3` | `--fw-bold` |
| `p`, טקסט רגיל | `--font-body` | `--fs-body` | `--fw-semibold` |
| טקסט קטן (תוויות, הערות, פוטר) | `--font-body` | `--fs-small` | `--fw-regular` |
