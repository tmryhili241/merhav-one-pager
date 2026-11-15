# מערכת עיצוב – להטמעה בקוד

קובץ הוראות לכלי פיתוח (Antigravity וכו'). נגזר מהמסמך "מערכת עיצוב – משתני CSS" (עותק העריכה), שהוא המקור. אין לשנות ערכים כאן בלי לשנות קודם במקור.

עדכון אחרון: 15.11.2026 (גרסה 2: נוספו שפה חזותית, רכיבים, ומשתני רדיוס, צל, ריווח, צורות ופריסה)

## כללים

1. כל הצבעים, הפונטים, הגדלים, המשקלים, הרדיוסים, הצללים, הריווחים ומידות הפריסה מוגדרים **רק** בבלוק `:root` שבראש `css/style.css`. בשאר הקוד משתמשים רק ב-`var(--...)`. אסור לכתוב ערך HEX או rgba, שם פונט, או מידה קבועה (px, rem) מחוץ לבלוק.
2. משתמשים במשתני התפקיד (`--color-primary`, `--color-correct`, `--color-shape-1` וכו'), לא ישירות בצבעי הקיט.
3. `style.css` נטען **אחרי** `bootstrap.rtl.min.css`. דורסים את Bootstrap דרך משתני ה-CSS שלו (`--bs-...`) ולא בהגדרות כפולות. רדיוס וצל של רכיבי Bootstrap נקבעים בבלוק (`--bs-border-radius`, `--bs-box-shadow`). לכפתורים: `.btn { --bs-btn-border-radius: var(--radius-pill); }`.
4. גדלי טקסט ביחידות `rem` בלבד. mobile first: ערכי ברירת המחדל הם לנייד, וה-media query מ-992px מגדיל כותרות וריווחים.
5. משובים בתרגול: הצבע משמש לרקע או למסגרת, והטקסט תמיד `--color-text`. אסור טקסט ירוק, אדום או צהוב על רקע לבן (לא עובר ניגודיות WCAG 2.1, 4.5:1).
6. טקסט צבעוני מותר רק ב-`--color-primary`, ורק כשיש לו תפקיד (קישור, כפתור, הדגשה בעלת משמעות). לא לקישוט. על רקע `--color-primary` הטקסט הוא `--color-text-on-primary`.
7. משוב חלקי: מסגרת המשוב כולה ב-`--color-wrong`. בתוכו, השדות או התשובות הנכונים מסומנים ב-`--color-correct`, והשגויים או החסרים ב-`--color-wrong`.
8. כל גרפיקה שעוד לא עוצבה (כולל הלוגו): שומר מקום אפור עם X, ברקע `--color-placeholder`, עם `aria-label` שמתאר מה יהיה שם (למשל `aria-label="לוגו מרחב"`). שומר המקום מקבל את הצורה של התמונה שתבוא במקומו (כלל 13) וגובה מינימלי `--placeholder-min-height`.
9. אין צבע hover חדש. hover ו-`:focus-visible` מסומנים בקו מתאר: `outline: var(--outline-width) solid var(--outline-color); outline-offset: var(--outline-offset);`. בכפתורי Bootstrap משווים את `--bs-btn-hover-bg`, `--bs-btn-hover-border-color` ו-`--bs-btn-active-bg` לצבע הרגיל של הכפתור, כדי לבטל את ההכהיה.
10. מקטע נעול: המחלקה `is-locked` (`opacity: var(--opacity-locked)`) והמאפיין `inert` על כל המקטע. `inert` חוסם לחיצה, מעבר ב-Tab וקורא מסך בפעולה אחת, ולכן לא צריך `aria-disabled` על כל פקד. הסיבה לנעילה נאמרת בטקסט ליד הכפתור שפותח אותה (לא רק בשקיפות).
11. הערות בקוד באנגלית: כותרת לכל בלוק, והסבר מעל כל פונקציה ולכל משתנה חדש.

## שפה חזותית

הקיט נראה "שמח" בזכות צורות פשוטות וצבעוניות סביב התמונות ופינות מעוגלות בכל מקום. הצורות מקשטות בלבד ולא נושאות מידע.

### איפה כן ואיפה לא

| אזור | מה מותר |
| --- | --- |
| פתיח (hero) | תמונה בצורת קשת או D, עיגול רקע אחד, עד 5 נקודות, עד 2 קווי ציור, קו תחתון למילה אחת ב-h1 |
| מסך סיום | כמו בפתיח |
| מקטע הסבר עם תמונה (למשל מבט על) | תמונה בצורה ועיגול רקע אחד. בלי נקודות ובלי קווים |
| כרטיסי מידע | רק מה שבתוך הרכיב: קווי פינה ואריח אייקון (כללים 23–24) |
| תרשים השרשרת, טופס, תרגול, משוב, נאב, פס התקדמות, מקטע נעול, פוטר | אין צורות דקורטיביות. השפה החזותית באה רק מהרכיבים: פינות מעוגלות, כפתורי גלולה |

### צורות

12. **עיגול רקע מאחורי תמונה:** `::before` על העוטף של התמונה. הקוטר הוא `--shape-circle-size` (אחוז מרוחב התמונה), והוא בולט מפינה אחת ב-`--shape-circle-offset`. הצבע הוא אחד מ-`--color-shape-1` עד `--color-shape-4`, בשקיפות `--shape-opacity`.
13. **צורת תמונה:** רגילה: `--radius-lg`. קשת: `--radius-pill` בכל הפינות. צורת D: `--radius-pill` בשתי הפינות של צד ה-inline-end (`border-start-end-radius`, `border-end-end-radius`) ו-`--radius-lg` בשאר. משתמשים במאפיינים לוגיים כדי שהצורה תתהפך נכון ב-RTL.
14. **נקודות:** עיגולים מלאים בגודל `--shape-dot-sm` או `--shape-dot-md`, בצבעי `--color-shape-*`, בשקיפות מלאה. עד 5 בפתיח ועד 3 בנייד. מפוזרות, לא בשורה.
15. **קווי ציור יד:** SVG קטן בתוך ה-HTML, קו בלבד בלי מילוי: `stroke-width: var(--shape-stroke)`, `stroke-linecap: round`. צורות: גל, שלושה קווי ניצוץ, קו מעוקל. מציירים לבד, לא מעתיקים נתיבים מהקיט. עד 2 בכל מקטע. מוסתרים מתחת ל-992px (`d-none d-lg-block`).
16. **קו תחתון מודגש:** למילה אחת בלבד, ב-h1 של הפתיח או של מסך הסיום. `::after` מתחת לשורה, בצבע `--color-shape-1`, בגובה `--shape-stroke`. לא עובר על האותיות.
17. **הצבה טכנית:** האלמנט המקושט: `position: relative; isolation: isolate;`. הצורה: `position: absolute; z-index: -1; pointer-events: none;`. ב-`::before` ו-`::after` הערך הוא `content: ""`. כל SVG דקורטיבי מקבל `aria-hidden="true" focusable="false"`.
18. **לא מסתירים טקסט:** צורה לא נמצאת מתחת לטקסט או מאחוריו, חוץ מהקו התחתון בכלל 16. ניגודיות הטקסט נבדקת מול הרקע הלבן.
19. **בלי גלילה אופקית:** מקטע עם צורות מקבל `overflow-x: clip`. מידות הצורות באחוזים מהתמונה, כדי שיקטנו יחד איתה.
20. **סטטיות ובלי משמעות:** אין אנימציה לצורות. צורה לא מסמנת מצב (נכון, שגוי, שלב, נעול).
21. **ירוק ואדום דקורטיביים** (`--color-shape-3`, `--color-shape-4`) רק בפתיח ובמסך הסיום. ליד תרגול ומשוב הצבעים האלה אומרים "נכון" ו"שגוי".

### תמונות ואיורים

22. סגנון היעד: צילום של אדם על רקע בצבע אחיד מצבעי הקיט, חתוך לצורה לפי כלל 13. עד שיש גרפיקה, נשאר שומר מקום (כלל 8) באותה צורה. לא מעתיקים תמונות או אייקונים מהקיט. כל תמונה שנכנסת נרשמת בטבלת זכויות היוצרים.

### רכיבים

23. **כרטיס:** רקע `--color-bg`, `--radius-md`, `--shadow-card`, ריפוד `--space-card-padding`, בלי מסגרת. בכרטיסי מידע (לא בתרגול) אפשר קווי פינה: `::before` עם `border-top` ו-`border-inline-end` בפינה העליונה של ה-inline-end, ו-`::after` עם `border-bottom` ו-`border-inline-start` בפינה התחתונה הנגדית. עובי `--accent-line-width`, אורך `--accent-line-length`, ורדיוס זהה לפינת הכרטיס. צבע אחד לכל כרטיס: `--color-primary` או `--color-accent`.
24. **אריח אייקון:** ריבוע בגודל `--icon-tile-size`, `--radius-md`, רקע מלא. האייקון הוא קוד SVG בתוך ה-HTML: אפשר להעתיק אייקון מ-Bootstrap Icons (רישיון MIT, נרשם בזכויות היוצרים) או לצייר SVG פשוט בעצמנו. לא טוענים את ספריית Bootstrap Icons ולא שום ספרייה נוספת. על `--color-primary` האייקון בצבע `--color-text-on-primary`. על `--color-accent` האייקון בצבע `--color-text`.
25. **כפתורים:** גלולה (`--radius-pill`), גובה מינימלי `--btn-min-height`, טקסט `--font-body` במשקל `--fw-semibold`. כפתורים עגולים קטנים (כמו 1·2·3 במבנה הטופס) נשארים עגולים (`--radius-round`).
    - ראשי: רקע `--color-primary`, טקסט `--color-text-on-primary`.
    - משני: רקע `--color-accent`, טקסט `--color-text`.
    - שקט: רקע `--color-highlight-bg`, טקסט `--color-text`.
26. **כפתור אייקון עגול (למשל הפעלה):** `--radius-round`, רקע `--color-highlight-bg`, אייקון `--color-primary`.
27. **שדות טופס ואריחי בחירה:** `--radius-sm`, מסגרת `--border-width` בצבע `--color-input-border` (ניגודיות של לפחות 3:1 לגבול השדה. האפור של הקיט לא עובר).
28. **משטח מודגש:** רקע `--color-highlight-bg`, `--radius-lg`, בלי צל.
29. **פס מספרים** (אם יש): רקע `--color-accent`, `--radius-lg`, טקסט `--color-text`. לא לבן כמו בקיט, כי לבן על צהוב לא עובר ניגודיות.
30. **צללים:** `--shadow-card` לכרטיסים, ו-`--shadow-raised` רק לרכיב אחד בולט (למשל כפתור הפתיח). לא על כפתורים רגילים ולא על טקסט.

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
  --color-text-on-primary: var(--color-white);   /* text/icons on primary bg */
  --color-input-border: var(--color-black);      /* form fields, 3:1 non-text contrast */

  /* Role colors - decorative shapes only (never text, never state) */
  --color-shape-1: var(--color-yellow-sun);
  --color-shape-2: var(--color-ice-blue);
  --color-shape-3: var(--color-sage-green);      /* hero + end screen only */
  --color-shape-4: var(--color-red-lips);        /* hero + end screen only */
  --color-shape-strong: var(--color-blue-sea);   /* doodles, dots */

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

  /* Radius */
  --radius-sm: 0.5rem;      /* 8px - inputs, choice tiles, small stat cards */
  --radius-md: 0.8125rem;   /* 13px - cards, icon tiles */
  --radius-lg: 1.25rem;     /* 20px - images, placeholders, panels */
  --radius-pill: 50rem;     /* buttons, arches, D-shapes */
  --radius-round: 50%;      /* circles, round icon buttons */

  /* Shadows (softer than the kit's 0 4px 4px rgba(0,0,0,.25)) */
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-raised: 0 8px 24px rgba(0, 0, 0, 0.15); /* one standout element */

  /* Lines and outlines */
  --border-width: 1px;
  --accent-line-width: 4px;      /* card corner lines */
  --accent-line-length: 35%;     /* of card width/height */
  --outline-width: 2px;          /* hover + focus */
  --outline-offset: 2px;
  --outline-color: var(--color-primary);

  /* Spacing - mobile first */
  --space-section-y: 3rem;       /* 48px top/bottom of a section */
  --space-heading-gap: 2rem;     /* section heading -> content */
  --space-grid-gap: 1.5rem;      /* between cards */
  --space-card-padding: 1.5rem;  /* inside cards */

  /* Components */
  --btn-min-height: 2.75rem;     /* 44px touch target */
  --icon-tile-size: 2.75rem;     /* 44px */

  /* Decorative shapes */
  --shape-opacity: 0.35;         /* tinted circles behind images */
  --shape-circle-size: 60%;      /* of image width */
  --shape-circle-offset: -15%;   /* how far it sticks out of the corner */
  --shape-dot-sm: 0.5rem;        /* 8px */
  --shape-dot-md: 1rem;          /* 16px */
  --shape-stroke: 3px;           /* doodles, heading underline */

  /* Layout (values already in the code) */
  --navbar-height: 4.25rem;          /* 68px - fixed navbar, page offset */
  --logo-width: 7.5rem;              /* 120px - logo placeholder */
  --logo-height: 2.5rem;             /* 40px - logo placeholder */
  --progress-bar-width: 0.5rem;      /* 8px - vertical progress bar (section 3) */
  --placeholder-min-height: 12rem;   /* placeholders on mobile */
  --opacity-locked: 0.5;             /* locked sections 4-6 */

  /* Bootstrap overrides */
  --bs-border-radius: var(--radius-sm);
  --bs-border-radius-lg: var(--radius-lg);
  --bs-border-radius-pill: var(--radius-pill);
  --bs-box-shadow: var(--shadow-card);
}

/* Larger screens: bigger headings and spacing */
@media only screen and (min-width: 992px) {
  :root {
    --fs-h1: 4.25rem;   /* 68px */
    --fs-h2: 2rem;      /* 32px */

    --space-section-y: 6rem;      /* 96px */
    --space-heading-gap: 3.5rem;  /* 56px */
    --space-grid-gap: 2.25rem;    /* 36px */
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
| תווית מעל כותרת מקטע | `--font-body` | `--fs-small` | `--fw-bold`, צבע `--color-primary` |
| כפתור | `--font-body` | `--fs-body` | `--fw-semibold` |
