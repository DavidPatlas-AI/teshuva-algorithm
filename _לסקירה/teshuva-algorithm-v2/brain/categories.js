// מקור האמת היחיד לקטגוריות — כל שאר הקבצים מייבאים מכאן

export const CATEGORIES = {
  politics: {
    heLabel: 'פוליטיקה',
    color: '#EF4444',
    keywords: {
      he: ['בחירות','כנסת','ממשלה','שר','ראש ממשלה','אופוזיציה','קואליציה','מפלגה','פוליטי','ביבי','גנץ','לפיד','נתניהו','גלנט'],
      en: ['election','government','congress','senate','president','minister','vote','policy','democrat','republican','parliament','prime minister'],
    },
  },
  sports: {
    heLabel: 'ספורט',
    color: '#3B82F6',
    keywords: {
      he: ['כדורגל','כדורסל','ליגה','גול','משחק','שחקן','קבוצה','אליפות','מכבי','הפועל','ביתר','נבחרת'],
      en: ['football','basketball','soccer','goal','match','game','player','team','championship','nba','fifa','score','league','tournament'],
    },
  },
  entertainment: {
    heLabel: 'בידור',
    color: '#EC4899',
    keywords: {
      he: ['סרט','מוזיקה','שיר','זמר','שחקן','תוכנית','בידור','ריאליטי','סדרה','אלבום','קונצרט'],
      en: ['movie','music','song','singer','actor','show','film','celebrity','tv','series','netflix','spotify','concert','album','viral'],
    },
  },
  technology: {
    heLabel: 'טכנולוגיה',
    color: '#8B5CF6',
    keywords: {
      he: ['בינה מלאכותית','AI','סטארטאפ','אפליקציה','תוכנה','חברת טק','קוד','פיתוח','גוגל','אפל','אמזון','מיקרוסופט'],
      en: ['ai','artificial intelligence','software','startup','app','coding','programming','tech','google','apple','amazon','meta','openai','chatgpt','github','developer'],
    },
  },
  news: {
    heLabel: 'חדשות',
    color: '#F97316',
    keywords: {
      he: ['מלחמה','שריפה','רעידת אדמה','חדשות','עדכון','פיגוע','תאונה','אסון','מבצע','ירי','נפגע'],
      en: ['breaking','news','update','war','attack','disaster','earthquake','fire','crisis','alert','urgent','report','killed','injured'],
    },
  },
  health: {
    heLabel: 'בריאות',
    color: '#10B981',
    keywords: {
      he: ['בריאות','תרופה','רופא','מחלה','פיטנס','דיאטה','תזונה','ויטמין','פסיכולוגיה','נפש','כושר'],
      en: ['health','medicine','doctor','disease','fitness','diet','nutrition','mental health','therapy','wellness','vaccine','hospital','symptom'],
    },
  },
  economy: {
    heLabel: 'כלכלה',
    color: '#F59E0B',
    keywords: {
      he: ['כלכלה','בורסה','מניות','דולר','שקל','אינפלציה','ריבית','השקעה','נדלן','משכנתא','מחיר','יוקר'],
      en: ['economy','stocks','market','dollar','inflation','investment','bitcoin','crypto','finance','bank','mortgage','price','gdp','recession'],
    },
  },
  science: {
    heLabel: 'מדע',
    color: '#06B6D4',
    keywords: {
      he: ['מדע','חלל','פיזיקה','כימיה','ביולוגיה','מחקר','גילוי','נאסא','כוכב','חיידק','אבולוציה'],
      en: ['science','space','physics','chemistry','biology','research','discovery','nasa','star','planet','evolution','study','experiment','quantum'],
    },
  },
  religion: {
    heLabel: 'דת ומסורת',
    color: '#A78BFA',
    keywords: {
      he: ['תורה','שבת','חג','תפילה','רב','ישיבה','הלכה','כשרות','פסח','ראש השנה','יום כיפור','סוכות','חנוכה'],
      en: ['torah','shabbat','jewish','prayer','rabbi','religion','faith','church','bible','god','holy','synagogue','kosher'],
    },
  },
}

// רשימת כל המזהים — שימושי לאיטרציה מסודרת
export const CATEGORY_IDS = Object.keys(CATEGORIES)

// קבל קטגוריה לפי מזהה, עם fallback בטוח
export function getCategory(id) {
  return CATEGORIES[id] ?? null
}
