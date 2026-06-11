# מאגרי מידע — URLs מפורטים ואסטרטגיית גישה

## קבוצה א' — ממשלה מרכזית

### מרכב"ת (מינהל הרכש הממשלתי)
- חיפוש: `https://mr.gov.il/ilgstorefront/he/search/?text=CCTV&s=TENDER`
- עמוד מכרז: `https://mr.gov.il/ilgstorefront/he/p/{TENDER_ID}`
- גישה: web_search `site:mr.gov.il {מילת_מפתח} מכרז 2026` + web_fetch לדפי תוצאות

### data.gov.il
- package_search: `https://data.gov.il/api/action/package_search?q={QUERY}&rows=20`
- datastore_search: `https://data.gov.il/api/action/datastore_search?resource_id={ID}&q={QUERY}`
- גישה: API ישיר, JSON, ללא הרשאות

### Open Budget (next.obudget.org)
- מכרזים: `https://next.obudget.org/api/search?q={QUERY}&doctype=tenders&size=20`
- URL ידני: `https://next.obudget.org/datapackages/sitemaps/tenders.0001.html`
- גישה: API JSON, חינם, מכיל גם פטורים ממכרז

### בלם"ס — משרד הביטחון
- URL: `https://www.online.mod.gov.il/Online2016/Pages/General/Balam/BalamList.aspx?Reset=1`
- גישה: web_fetch (ממשק SAP, לעיתים מצריך JS)

---

## קבוצה ב' — חברות ממשלתיות

### חברת חשמל לישראל (IEC)
- מכרזים פעילים: `https://www.iec.co.il/content/suppliers/tenders-and-decisions/tenders/active-tenders`
- מכרזים ממוכנים: `https://www.iec.co.il/suppliers/pages/onlinetenders.aspx`
- ⚠️ האתר חסום מחוץ לישראל — גישה: web_search `site:iec.co.il מכרז {מילת_מפתח} 2026`

### מקורות
- URL: `https://www.mekorot.co.il/Heb/PurchasingAndTenders/Pages/default.aspx`
- גישה: web_fetch

### נתיבי ישראל
- URL: `https://www.iroads.co.il/מכרזים/מכרזים/`
- גישה: web_fetch

### רכבת ישראל
- URL: `https://www.rail.co.il/Pages/Call-for-Tenders.aspx`
- גישה: web_fetch

### נת"ב (נמלי ישראל)
- URL: `https://www.israports.co.il/he/Pages/tenders.aspx`
- גישה: web_fetch

### רשות שדות התעופה (CAAI)
- URL: `https://www.iaa.gov.il/tenders-and-contracts/`
- גישה: web_fetch

### נת"ע (רכבת קלה ומטרו)
- URL: `https://www.nta.co.il/page-18610`
- גישה: web_fetch

### תשתיות נפט ואנרגיה
- URL: `https://www.noe.co.il/heb/tenders.aspx`
- גישה: web_fetch

### בזק
- URL: `https://www.bezeq.co.il/aboutbezeq/tenders/`
- גישה: web_fetch

---

## קבוצה ג' — רשויות מקומיות

### מערכת נמ"ר (מרכז כל הרשויות — משרד הפנים)
- URL: `https://namerz.moin.gov.il/namer`
- גישה: web_search `site:namerz.moin.gov.il {QUERY}` + web_fetch

### עיריות — URLs ישירים
| עיר | URL |
|-----|-----|
| תל אביב | https://www.tel-aviv.gov.il/Residents/Tenders/ |
| ירושלים | https://www.jerusalem.muni.il/he/residents/tenders/ |
| חיפה | https://www.haifa.muni.il/node/2271 |
| באר שבע | https://www.beer-sheva.muni.il/residents/tenders/ |
| ראשון לציון | https://www.rishonlezion.muni.il/Residents/Tenders/ |
| פתח תקווה | https://www.petah-tikva.muni.il/Residents/Tenders/ |
| נתניה | https://www.netanya.muni.il/Residents/Tenders/ |
| אשדוד | https://www.ashdod.muni.il/residents/tenders/ |
| אשקלון | https://www.ashkelon.muni.il/Residents/Tenders/ |
| רחובות | https://www.rehovot.muni.il/Residents/Tenders/ |
| הרצליה | https://www.herzliya.muni.il/residents/tenders/ |
| כפר סבא | https://www.kfar-saba.muni.il/Residents/Tenders/ |
| חולון | https://www.holon.muni.il/residents/tenders/ |
| בני ברק | https://www.bnei-brak.muni.il/residents/tenders/ |
| רמת גן | https://www.ramat-gan.muni.il/residents/tenders/ |
| נס ציונה | https://www.nsz.muni.il/Residents/Tenders/ |
| לוד | https://www.lod.muni.il/Residents/Tenders/ |
| רמלה | https://www.ramla.muni.il/residents/tenders/ |
| מודיעין | https://www.modiin.muni.il/residents/tenders/ |

### מועצות אזוריות — web_search
`מועצה אזורית מכרז "מצלמות" OR "בקרת כניסה" OR BMS 2026`

---

## קבוצה ד' — בריאות

### בתי חולים מרכזיים
| בית חולים | URL מכרזים / אסטרטגיה |
|-----------|----------------------|
| שיבא (תל השומר) | `https://www.sheba.co.il/tenders/` |
| איכילוב (תל אביב) | `https://www.tasmc.org.il/sites/he/HR/Pages/tenders.aspx` |
| הדסה | `https://www.hadassah.org.il/english/Hadassah-Hospital/tenders/` |
| כללית | web_search: `site:clalit.co.il מכרז` |
| רמב"ם | web_search: `רמב"ם מכרז מצלמות OR BMS 2026` |
| סורוקה | web_search: `סורוקה מכרז 2026 אבטחה` |

---

## קבוצה ה' — חינוך

| מוסד | אסטרטגיה |
|------|---------|
| טכניון | web_search: `site:technion.ac.il מכרז` |
| האוניברסיטה הפתוחה | web_search: `האוניברסיטה הפתוחה מכרז 2026` |
| אוניברסיטת תל אביב | web_search: `site:tau.ac.il מכרז` |
| בר-אילן | web_search: `site:biu.ac.il מכרז` |
| הנגב — BGU | web_search: `site:bgu.ac.il מכרז` |
| חיפה | web_search: `site:haifa.ac.il מכרז` |

---

## קבוצה ו' — אגרגטורים ומאגרים משניים (חינם)

| אתר | URL | הערות |
|-----|-----|-------|
| BDNHOST | `https://michrazim.bdnhost.net/` | חינם, ממשלתי + עיריות |
| מש"מ | `https://www.masham.org.il/bids/` | השלטון המקומי |
| רשויות.co.il | `https://www.rashuiot.co.il/` | פורטל רשויות |

---

## אסטרטגיית web_search יומית מומלצת (25 שאילתות)

```
1. site:mr.gov.il "CCTV" OR "טמ"ס" מכרז 2026
2. site:mr.gov.il "מצלמות אבטחה" מכרז 2026
3. site:mr.gov.il "בקרת כניסה" מכרז 2026
4. site:mr.gov.il "BMS" OR "בקרת מבנה" מכרז 2026
5. site:mr.gov.il "גילוי אש" OR "כיבוי אש" מכרז 2026
6. site:mr.gov.il "מולטימדיה" OR "AV" מכרז 2026
7. site:mr.gov.il "טלפוניה" OR "VoIP" OR "IPT" מכרז 2026
8. site:mr.gov.il "מתח נמוך" מכרז 2026
9. site:mr.gov.il "כריזה" OR "PA system" מכרז 2026
10. site:mr.gov.il "UPS" OR "גנרטור" OR "חדר שרתים" מכרז 2026
11. עירייה מכרז "בקרת כניסה" OR "מצלמות" 2026
12. עירייה מכרז BMS OR "בקרת מבנה" 2026
13. רשות מקומית מכרז "גילוי אש" OR כיבוי 2026
14. עירייה מכרז "מולטימדיה" OR "חדר ישיבות" 2026
15. מועצה מקומית מכרז טלפוניה VoIP IPT 2026
16. בית חולים מכרז מצלמות אבטחה 2026
17. בית חולים מכרז "בקרת כניסה" OR BMS 2026
18. אוניברסיטה טכניון מכרז מצלמות OR אבטחה 2026
19. חברת חשמל מכרז בקרה OR תקשורת 2026
20. מקורות נתיבים רכבת מכרז CCTV OR SCADA 2026
21. site:iec.co.il מכרז חשמל בקרה 2026
22. site:iroads.co.il מכרז CCTV תקשורת 2026
23. נמל תעופה מכרז אבטחה CCTV ביומטריה 2026
24. site:namerz.moin.gov.il מצלמות OR "בקרת כניסה" 2026
25. מכרז "מערכות ביטחון" OR "מתח נמוך" פרויקט בנייה 2026
```

---

## קבוצה ז' — אגרגטורי מכרזים מסחריים (בתשלום/מנוי)

אתרים אלה מרכזים מכרזים מכל המאגרים — גישה מלאה דורשת מנוי בתשלום.
**אסטרטגיית סריקה**: web_search `site:{domain} {מילת_מפתח} מכרז 2026`

| שם | URL | הערות |
|----|-----|-------|
| **גובי** (govi.co.il) | `https://govi.co.il/` | חיפוש: `https://govi.co.il/search?q={QUERY}` — מאגר גדול, ממשלתי + פרטי |
| **גובו** (govo.co.il) | `https://www.govo.co.il/` | כולל חברת חשמל, מקורות, רשויות; חיפוש `site:govo.co.il {QUERY}` |
| **יפעת** (tenders.co.il) | `https://www.tenders.co.il/` | ⚠️ נגישות מוגבלת מחוץ לרשת — web_search `site:tenders.co.il {QUERY}` |
| **חשכ"ל** | `https://www.govo.co.il/subbranch/חשכ"ל` | חשב כללי — מכרזים ממשלתיים פיננסיים |
| **משהב"ט** (מינהל שירותי הביטחון) | `https://www.online.mod.gov.il/Online2016/Pages/General/Balam/BalamList.aspx` | רכש ביטחוני — גישה: web_fetch ישיר |
| **אשכול רשויות** (אשכולות אזוריות) | מרובה — ראה טבלה למטה | איגודי ערים אזוריים |
| **מאגרים** (tenders.maagarim.city) | `https://tenders.maagarim.city/` | WEB חכם — ממשלה + רשויות + חברות + בתי חולים |
| **WizBiz** (wizbiz.co.il) | `https://wizbiz.co.il/` | כולל מכרזי חשמל, CCTV, מיזוג; web_search `site:wizbiz.co.il {QUERY}` |
| **לשכת המסחר** (chamber.org.il) | `https://www.chamber.org.il/serviceslobby/tenders/` | ChamberNet — מכרזי ביטחון + חשמל |

### אשכולות אזוריות — URLs מפורטים
| אשכול | URL מכרזים |
|-------|-----------|
| גליל מזרחי | `https://eastgalil.org.il/מידע-לתושב/מכרזים/` |
| גליל מערבי | web_search: `אשכול גליל מערבי מכרז 2026` |
| נגב מערבי | web_search: `אשכול נגב מערבי מכרז 2026` |
| נגב מזרחי | web_search: `אשכול נגב מזרחי מכרז 2026` |
| בית הכרם הגלילי | web_search: `אשכול בית הכרם מכרז 2026` |
| גליל והעמקים | `https://galilamakim.org.il` → קטגוריה מכרזים |

### שאילתות נוספות לאגרגטורים

```
site:govi.co.il "CCTV" OR "מצלמות" OR "בקרת כניסה" 2026
site:govi.co.il "BMS" OR "גילוי אש" OR "מתח נמוך" 2026
site:govi.co.il "טלפוניה" OR "מולטימדיה" OR "כריזה" 2026
site:govo.co.il "CCTV" OR "מצלמות" OR "אבטחה" 2026
site:govo.co.il "בקרת כניסה" OR "BMS" 2026
site:wizbiz.co.il "מצלמות" OR "CCTV" OR "בקרת כניסה" 2026
site:wizbiz.co.il "מתח נמוך" OR "גילוי אש" 2026
חשכ"ל מכרז "מצלמות" OR "בקרת כניסה" 2026
משהב"ט מכרז CCTV OR "מתח נמוך" 2026
"אשכול" מכרז "מצלמות" OR "בקרת כניסה" OR BMS 2026
```
