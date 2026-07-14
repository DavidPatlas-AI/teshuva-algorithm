package com.teshuva

/**
 * Native port of brain/classifier.js + brain/categories.js — same 9 categories,
 * same terms/weights, same scoring algorithm. Kept self-contained (no JS/RN
 * dependency) because FeedWatcherService must work even when the RN JS
 * context isn't alive.
 *
 * NOTE: keep this in sync with brain/categories.js by hand. There are only
 * two copies (this one + the JS source of truth) — if the term lists there
 * change, mirror the change here.
 */
object ClippyClassifier {

    private const val MIN_TEXT_LENGTH = 15
    private const val MIN_SCORE_TO_CLASSIFY = 2

    data class Term(val t: String, val w: Int)
    data class Category(val id: String, val heLabel: String, val terms: List<Term>)

    val CATEGORIES: List<Category> = listOf(
        Category("politics", "פוליטיקה", listOf(
            Term("נתניהו", 3), Term("כנסת", 3), Term("בכנסת", 3), Term("לכנסת", 3),
            Term("הכנסת", 3), Term("ביבי", 3), Term("גנץ", 3), Term("לפיד", 3),
            Term("גלנט", 3), Term("אופוזיציה", 3), Term("קואליציה", 3), Term("הממשלה", 3),
            Term("ח\"כ", 3), Term("חכ", 2),
            Term("בחירות", 2), Term("לבחירות", 2), Term("ממשלה", 2), Term("מפלגה", 2),
            Term("של הממשלה", 2), Term("פוליטיקה", 2), Term("פוליטי", 2), Term("מדיניות", 2),
            Term("שר ", 2), Term("השר", 2), Term("ראש ממשלה", 2), Term("צבא", 1),
            Term("ימין", 1), Term("שמאל", 1), Term("דמוקרטיה", 2),
            Term("election", 2), Term("government", 2), Term("congress", 2), Term("senate", 2),
            Term("president", 2), Term("minister", 2), Term("vote", 1), Term("policy", 1),
            Term("democrat", 2), Term("republican", 2), Term("parliament", 2),
            Term("prime minister", 3), Term("political", 2), Term("trump", 3),
            Term("biden", 3), Term("netanyahu", 3),
        )),
        Category("sports", "ספורט", listOf(
            Term("כדורגל", 3), Term("בכדורגל", 3), Term("לכדורגל", 3), Term("כדורגלן", 3),
            Term("כדורסל", 3), Term("בכדורסל", 3), Term("כדורסלן", 3),
            Term("מכבי", 3), Term("הפועל", 3), Term("ביתר", 3), Term("בית\"ר", 3),
            Term("נבחרת", 3), Term("הנבחרת", 3), Term("ליגה", 2), Term("בליגה", 2),
            Term("אליפות", 2), Term("גול", 2), Term("שחקן", 1), Term("קבוצה", 1),
            Term("מגרש", 2), Term("ספורט", 2), Term("תחרות", 1), Term("משחק", 1),
            Term("גמר", 2), Term("פלייאוף", 2), Term("פינאל", 2), Term("דרבי", 2),
            Term("יורופה", 2), Term("צמרת", 1), Term("אצן", 2), Term("שחייה", 2),
            Term("football", 2), Term("basketball", 2), Term("soccer", 2), Term("goal", 1),
            Term("match", 1), Term("player", 1), Term("team", 1), Term("championship", 2),
            Term("nba", 3), Term("fifa", 3), Term("score", 1), Term("league", 2),
            Term("tournament", 2), Term("messi", 3), Term("ronaldo", 3), Term("lebron", 3),
        )),
        Category("entertainment", "בידור", listOf(
            Term("סרט", 2), Term("הסרט", 2), Term("בסרט", 2), Term("לסרט", 2),
            Term("מוזיקה", 2), Term("שיר", 2), Term("שירים", 2), Term("ביצוע", 1),
            Term("זמר", 2), Term("זמרת", 2), Term("שחקן", 1), Term("שחקנית", 2),
            Term("ריאליטי", 3), Term("סדרה", 2), Term("בסדרה", 2), Term("עונה", 1),
            Term("אלבום", 2), Term("קונצרט", 3), Term("להקה", 2), Term("שידור", 1),
            Term("טלוויזיה", 2), Term("בטלוויזיה", 2), Term("ערוץ", 1), Term("תוכנית", 1),
            Term("קומדיה", 2), Term("דרמה", 1), Term("קליפ", 2), Term("יוטיוב", 2),
            Term("טיקטוק", 2), Term("אינסטגרם", 1), Term("סלבריטי", 2), Term("אופנה", 2),
            Term("movie", 2), Term("music", 2), Term("song", 2), Term("singer", 2),
            Term("actor", 2), Term("show", 1), Term("film", 2), Term("celebrity", 2),
            Term("series", 2), Term("netflix", 3), Term("spotify", 3), Term("concert", 2),
            Term("album", 2), Term("viral", 2), Term("trending", 1), Term("tiktok", 2),
        )),
        Category("technology", "טכנולוגיה", listOf(
            Term("בינה מלאכותית", 3), Term("AI", 2), Term("ai", 2), Term("ChatGPT", 3),
            Term("chatgpt", 3), Term("GPT", 3), Term("סטארטאפ", 3), Term("הייטק", 3),
            Term("היי טק", 3), Term("אפליקציה", 2), Term("תוכנה", 2), Term("חברת טק", 3),
            Term("קוד", 1), Term("פיתוח", 2), Term("מפתח", 1), Term("גוגל", 2),
            Term("אפל", 2), Term("אמזון", 2), Term("מיקרוסופט", 2), Term("מטא", 2),
            Term("חדשנות", 2), Term("טכנולוגיה", 3), Term("דיגיטל", 2), Term("רובוט", 2),
            Term("קריפטו", 2), Term("בלוקצ'יין", 2), Term("ביטקוין", 2),
            Term("artificial intelligence", 3), Term("software", 2), Term("startup", 2),
            Term("app", 1), Term("coding", 2), Term("programming", 2), Term("tech", 1),
            Term("google", 2), Term("apple", 2), Term("amazon", 2), Term("meta", 2),
            Term("openai", 3), Term("github", 2), Term("developer", 2), Term("cybersecurity", 2),
        )),
        Category("news", "חדשות", listOf(
            Term("מלחמה", 3), Term("במלחמה", 3), Term("שריפה", 2), Term("בשריפה", 2),
            Term("רעידת אדמה", 3), Term("פיגוע", 3), Term("מבצע", 2), Term("ירי", 2),
            Term("נפגע", 2), Term("נפגעים", 2), Term("תאונה", 2), Term("אסון", 3),
            Term("עדכון", 1), Term("פלש", 2), Term("כתבה", 1), Term("דיווח", 1),
            Term("חדשות", 2), Term("החדשות", 2), Term("בחדשות", 2), Term("ידיעה", 2),
            Term("עצור", 1), Term("חיפוש", 1), Term("מחסום", 2), Term("נוהל", 1),
            Term("הודעה", 1), Term("חירום", 3), Term("ביטחון", 2), Term("גבול", 2),
            Term("breaking", 2), Term("news", 1), Term("update", 1), Term("war", 2),
            Term("attack", 2), Term("disaster", 2), Term("earthquake", 2), Term("fire", 1),
            Term("crisis", 2), Term("alert", 2), Term("urgent", 2), Term("killed", 2),
            Term("injured", 2), Term("report", 1), Term("conflict", 2), Term("bomb", 3),
        )),
        Category("health", "בריאות", listOf(
            Term("בריאות", 3), Term("הבריאות", 3), Term("תרופה", 2), Term("תרופות", 2),
            Term("רופא", 2), Term("רופאים", 2), Term("חולה", 2), Term("מחלה", 2),
            Term("פיטנס", 2), Term("דיאטה", 2), Term("תזונה", 2), Term("ויטמין", 2),
            Term("פסיכולוגיה", 3), Term("נפש", 2), Term("כושר", 2), Term("אימון", 2),
            Term("בית חולים", 3), Term("מרפאה", 2), Term("ניתוח", 2), Term("חיסון", 2),
            Term("וירוס", 2), Term("מגפה", 2), Term("סוכרת", 3), Term("לחץ דם", 3),
            Term("פסיכיאטריה", 3), Term("חרדה", 2), Term("דיכאון", 2), Term("שינה", 1),
            Term("health", 2), Term("medicine", 2), Term("doctor", 2), Term("disease", 2),
            Term("fitness", 2), Term("diet", 1), Term("nutrition", 2), Term("mental health", 3),
            Term("therapy", 2), Term("wellness", 2), Term("vaccine", 2), Term("hospital", 2),
            Term("symptom", 2), Term("exercise", 1), Term("weight loss", 2),
        )),
        Category("economy", "כלכלה", listOf(
            Term("כלכלה", 3), Term("הכלכלה", 3), Term("בורסה", 3), Term("מניות", 3),
            Term("דולר", 2), Term("שקל", 2), Term("אינפלציה", 3), Term("ריבית", 3),
            Term("השקעה", 2), Term("נדלן", 3), Term("נדל\"ן", 3), Term("משכנתא", 3),
            Term("מחיר", 1), Term("יוקר", 2), Term("יוקר המחיה", 3), Term("מס", 1),
            Term("תקציב", 2), Term("גירעון", 2), Term("ייצוא", 2), Term("יבוא", 2),
            Term("רווח", 1), Term("הפסד", 1), Term("חברה", 1), Term("שכר", 2),
            Term("שכר מינימום", 3), Term("פנסיה", 2), Term("ביטוח לאומי", 3),
            Term("economy", 2), Term("stocks", 2), Term("market", 1), Term("dollar", 2),
            Term("inflation", 2), Term("investment", 2), Term("bitcoin", 2), Term("crypto", 2),
            Term("finance", 2), Term("bank", 1), Term("mortgage", 2), Term("price", 1),
            Term("gdp", 3), Term("recession", 2), Term("nasdaq", 3), Term("s&p", 3),
            Term("interest rate", 3), Term("housing", 1),
        )),
        Category("science", "מדע", listOf(
            Term("מדע", 3), Term("המדע", 3), Term("חלל", 3), Term("בחלל", 3),
            Term("פיזיקה", 3), Term("כימיה", 3), Term("ביולוגיה", 3), Term("מחקר", 2),
            Term("גילוי", 2), Term("נאסא", 3), Term("כוכב", 2), Term("כוכבים", 2),
            Term("גלקסיה", 3), Term("חיידק", 2), Term("חיידקים", 2), Term("אבולוציה", 3),
            Term("DNA", 3), Term("גנטיקה", 3), Term("מאובן", 2), Term("דינוזאור", 2),
            Term("ניסוי", 2), Term("מעבדה", 2), Term("חוקר", 1), Term("מדען", 2),
            Term("אסטרונומיה", 3), Term("גיאוגרפיה", 2), Term("אקלים", 2),
            Term("science", 2), Term("space", 2), Term("physics", 2), Term("chemistry", 2),
            Term("biology", 2), Term("research", 1), Term("discovery", 2), Term("nasa", 3),
            Term("star", 1), Term("planet", 2), Term("evolution", 2), Term("study", 1),
            Term("experiment", 2), Term("quantum", 3), Term("climate", 2), Term("species", 2),
        )),
        Category("religion", "דת ומסורת", listOf(
            Term("תורה", 3), Term("התורה", 3), Term("שבת", 3), Term("בשבת", 3),
            Term("לשבת", 3), Term("חג", 2), Term("בחג", 2), Term("תפילה", 3),
            Term("להתפלל", 3), Term("רב", 2), Term("הרב", 2), Term("ישיבה", 3),
            Term("הלכה", 3), Term("כשרות", 3), Term("כשר", 3), Term("פסח", 3),
            Term("ראש השנה", 3), Term("יום כיפור", 3), Term("סוכות", 3),
            Term("חנוכה", 3), Term("פורים", 3), Term("שבועות", 3),
            Term("בית כנסת", 3), Term("כנסייה", 3), Term("מסגד", 3),
            Term("מצווה", 2), Term("מצוות", 2), Term("ברכה", 2), Term("קידוש", 3),
            Term("תשובה", 2), Term("אמונה", 2), Term("אלוהים", 2), Term("דתי", 2),
            Term("חרדי", 3), Term("חרדים", 3), Term("ציוני דתי", 3),
            Term("torah", 3), Term("shabbat", 3), Term("jewish", 2), Term("prayer", 2),
            Term("rabbi", 3), Term("religion", 2), Term("faith", 1), Term("church", 2),
            Term("bible", 2), Term("god", 1), Term("holy", 1), Term("synagogue", 3),
            Term("kosher", 3), Term("islam", 2), Term("muslim", 2), Term("christian", 2),
        )),
    )

    data class Result(val categoryId: String?, val heLabel: String?, val score: Int)

    /** Mirrors classifier.js's classify() — returns null (== "uncategorized") if nothing scores high enough. */
    fun classify(text: String): Result {
        if (text.length < MIN_TEXT_LENGTH) return Result(null, null, 0)
        val lower = text.lowercase()

        var best: Category? = null
        var bestScore = 0
        for (cat in CATEGORIES) {
            var score = 0
            for (term in cat.terms) {
                if (lower.contains(term.t.lowercase())) score += term.w
            }
            if (score >= MIN_SCORE_TO_CLASSIFY && score > bestScore) {
                best = cat
                bestScore = score
            }
        }
        return if (best != null) Result(best.id, best.heLabel, bestScore) else Result(null, null, 0)
    }
}
