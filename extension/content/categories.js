const CATEGORIES = {
  politics: {
    heLabel: "פוליטיקה",
    keywords: {
      he: ["בחירות","כנסת","ממשלה","שר","ראש ממשלה","אופוזיציה","קואליציה","מפלגה","פוליטי","ביבי","גנץ","לפיד"],
      en: ["election","government","congress","senate","president","minister","vote","policy","democrat","republican","parliament"]
    }
  },
  sports: {
    heLabel: "ספורט",
    keywords: {
      he: ["כדורגל","כדורסל","ליגה","גול","משחק","שחקן","קבוצה","אליפות","מכבי","הפועל","ספורט"],
      en: ["football","basketball","soccer","goal","match","game","player","team","championship","nba","fifa","score","league"]
    }
  },
  entertainment: {
    heLabel: "בידור",
    keywords: {
      he: ["סרט","מוזיקה","שיר","זמר","שחקן","תוכנית","פרסומת","בידור","ריאליטי","סדרה"],
      en: ["movie","music","song","singer","actor","show","film","celebrity","tv","series","netflix","youtube","tiktok","viral"]
    }
  },
  technology: {
    heLabel: "טכנולוגיה",
    keywords: {
      he: ["בינה מלאכותית","AI","סטארטאפ","אפליקציה","תוכנה","חברת טק","פייסבוק","גוגל","אפל","אמזון","קוד","פיתוח"],
      en: ["ai","artificial intelligence","software","startup","app","coding","programming","tech","google","apple","amazon","meta","openai","chatgpt"]
    }
  },
  news: {
    heLabel: "חדשות",
    keywords: {
      he: ["פצצה","מלחמה","שריפה","רעידת אדמה","חדשות","עדכון","פיגוע","תאונה","אסון","מבצע"],
      en: ["breaking","news","update","war","attack","disaster","earthquake","fire","crisis","alert","urgent","report"]
    }
  },
  health: {
    heLabel: "בריאות",
    keywords: {
      he: ["בריאות","תרופה","רופא","מחלה","ספורט","פיטנס","דיאטה","תזונה","ויטמין","פסיכולוגיה"],
      en: ["health","medicine","doctor","disease","fitness","diet","nutrition","mental health","therapy","wellness","vaccine","covid"]
    }
  },
  economy: {
    heLabel: "כלכלה",
    keywords: {
      he: ["כלכלה","בורסה","מניות","דולר","שקל","אינפלציה","ריבית","השקעה","נדלן","משכנתא"],
      en: ["economy","stocks","market","dollar","inflation","investment","bitcoin","crypto","finance","bank","mortgage","real estate"]
    }
  },
  science: {
    heLabel: "מדע",
    keywords: {
      he: ["מדע","חלל","פיזיקה","כימיה","ביולוגיה","מחקר","גילוי","נאסא","כוכב","חיידק"],
      en: ["science","space","physics","chemistry","biology","research","discovery","nasa","star","planet","evolution","study","experiment"]
    }
  },
  religion: {
    heLabel: "דת ומסורת",
    keywords: {
      he: ["תורה","שבת","חג","תפילה","רב","ישיבה","הלכה","כשרות","קדושה","פסח","ראש השנה","יום כיפור"],
      en: ["torah","shabbat","jewish","prayer","rabbi","religion","faith","church","mosque","bible","god","holy"]
    }
  }
};

if (typeof module !== "undefined") module.exports = CATEGORIES;
