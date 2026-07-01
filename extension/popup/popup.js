(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // brain/categories.js
  var CATEGORIES, CATEGORY_IDS;
  var init_categories = __esm({
    "brain/categories.js"() {
      CATEGORIES = {
        politics: {
          heLabel: "\u05E4\u05D5\u05DC\u05D9\u05D8\u05D9\u05E7\u05D4",
          color: "#EF4444",
          terms: [
            // חד-משמעיים
            { t: "\u05E0\u05EA\u05E0\u05D9\u05D4\u05D5", w: 3 },
            { t: "\u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: "\u05D1\u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: "\u05DC\u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: "\u05D4\u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: "\u05D1\u05D9\u05D1\u05D9", w: 3 },
            { t: "\u05D2\u05E0\u05E5", w: 3 },
            { t: "\u05DC\u05E4\u05D9\u05D3", w: 3 },
            { t: "\u05D2\u05DC\u05E0\u05D8", w: 3 },
            { t: "\u05D0\u05D5\u05E4\u05D5\u05D6\u05D9\u05E6\u05D9\u05D4", w: 3 },
            { t: "\u05E7\u05D5\u05D0\u05DC\u05D9\u05E6\u05D9\u05D4", w: 3 },
            { t: "\u05D4\u05DE\u05DE\u05E9\u05DC\u05D4", w: 3 },
            { t: "\u05D4\u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: '\u05D7"\u05DB', w: 3 },
            { t: "\u05D7\u05DB", w: 2 },
            // חזקים
            { t: "\u05D1\u05D7\u05D9\u05E8\u05D5\u05EA", w: 2 },
            { t: "\u05DC\u05D1\u05D7\u05D9\u05E8\u05D5\u05EA", w: 2 },
            { t: "\u05DE\u05DE\u05E9\u05DC\u05D4", w: 2 },
            { t: "\u05DE\u05E4\u05DC\u05D2\u05D4", w: 2 },
            { t: "\u05E9\u05DC \u05D4\u05DE\u05DE\u05E9\u05DC\u05D4", w: 2 },
            { t: "\u05E4\u05D5\u05DC\u05D9\u05D8\u05D9\u05E7\u05D4", w: 2 },
            { t: "\u05E4\u05D5\u05DC\u05D9\u05D8\u05D9", w: 2 },
            { t: "\u05DE\u05D3\u05D9\u05E0\u05D9\u05D5\u05EA", w: 2 },
            { t: "\u05E9\u05E8 ", w: 2 },
            { t: "\u05D4\u05E9\u05E8", w: 2 },
            { t: "\u05E8\u05D0\u05E9 \u05DE\u05DE\u05E9\u05DC\u05D4", w: 2 },
            { t: "\u05E6\u05D1\u05D0", w: 1 },
            { t: "\u05D9\u05DE\u05D9\u05DF", w: 1 },
            { t: "\u05E9\u05DE\u05D0\u05DC", w: 1 },
            { t: "\u05D3\u05DE\u05D5\u05E7\u05E8\u05D8\u05D9\u05D4", w: 2 },
            // אנגלית
            { t: "election", w: 2 },
            { t: "government", w: 2 },
            { t: "congress", w: 2 },
            { t: "senate", w: 2 },
            { t: "president", w: 2 },
            { t: "minister", w: 2 },
            { t: "vote", w: 1 },
            { t: "policy", w: 1 },
            { t: "democrat", w: 2 },
            { t: "republican", w: 2 },
            { t: "parliament", w: 2 },
            { t: "prime minister", w: 3 },
            { t: "political", w: 2 },
            { t: "trump", w: 3 },
            { t: "biden", w: 3 },
            { t: "netanyahu", w: 3 }
          ]
        },
        sports: {
          heLabel: "\u05E1\u05E4\u05D5\u05E8\u05D8",
          color: "#3B82F6",
          terms: [
            { t: "\u05DB\u05D3\u05D5\u05E8\u05D2\u05DC", w: 3 },
            { t: "\u05D1\u05DB\u05D3\u05D5\u05E8\u05D2\u05DC", w: 3 },
            { t: "\u05DC\u05DB\u05D3\u05D5\u05E8\u05D2\u05DC", w: 3 },
            { t: "\u05DB\u05D3\u05D5\u05E8\u05D2\u05DC\u05DF", w: 3 },
            { t: "\u05DB\u05D3\u05D5\u05E8\u05E1\u05DC", w: 3 },
            { t: "\u05D1\u05DB\u05D3\u05D5\u05E8\u05E1\u05DC", w: 3 },
            { t: "\u05DB\u05D3\u05D5\u05E8\u05E1\u05DC\u05DF", w: 3 },
            { t: "\u05DE\u05DB\u05D1\u05D9", w: 3 },
            { t: "\u05D4\u05E4\u05D5\u05E2\u05DC", w: 3 },
            { t: "\u05D1\u05D9\u05EA\u05E8", w: 3 },
            { t: '\u05D1\u05D9\u05EA"\u05E8', w: 3 },
            { t: "\u05E0\u05D1\u05D7\u05E8\u05EA", w: 3 },
            { t: "\u05D4\u05E0\u05D1\u05D7\u05E8\u05EA", w: 3 },
            { t: "\u05DC\u05D9\u05D2\u05D4", w: 2 },
            { t: "\u05D1\u05DC\u05D9\u05D2\u05D4", w: 2 },
            { t: "\u05D0\u05DC\u05D9\u05E4\u05D5\u05EA", w: 2 },
            { t: "\u05D2\u05D5\u05DC", w: 2 },
            { t: "\u05E9\u05D7\u05E7\u05DF", w: 1 },
            { t: "\u05E7\u05D1\u05D5\u05E6\u05D4", w: 1 },
            { t: "\u05DE\u05D2\u05E8\u05E9", w: 2 },
            { t: "\u05E1\u05E4\u05D5\u05E8\u05D8", w: 2 },
            { t: "\u05EA\u05D7\u05E8\u05D5\u05EA", w: 1 },
            { t: "\u05DE\u05E9\u05D7\u05E7", w: 1 },
            { t: "\u05D2\u05DE\u05E8", w: 2 },
            { t: "\u05E4\u05DC\u05D9\u05D9\u05D0\u05D5\u05E3", w: 2 },
            { t: "\u05E4\u05D9\u05E0\u05D0\u05DC", w: 2 },
            { t: "\u05D3\u05E8\u05D1\u05D9", w: 2 },
            { t: "\u05D9\u05D5\u05E8\u05D5\u05E4\u05D4", w: 2 },
            { t: "\u05E6\u05DE\u05E8\u05EA", w: 1 },
            { t: "\u05D0\u05E6\u05DF", w: 2 },
            { t: "\u05E9\u05D7\u05D9\u05D9\u05D4", w: 2 },
            { t: "football", w: 2 },
            { t: "basketball", w: 2 },
            { t: "soccer", w: 2 },
            { t: "goal", w: 1 },
            { t: "match", w: 1 },
            { t: "player", w: 1 },
            { t: "team", w: 1 },
            { t: "championship", w: 2 },
            { t: "nba", w: 3 },
            { t: "fifa", w: 3 },
            { t: "score", w: 1 },
            { t: "league", w: 2 },
            { t: "tournament", w: 2 },
            { t: "messi", w: 3 },
            { t: "ronaldo", w: 3 },
            { t: "lebron", w: 3 }
          ]
        },
        entertainment: {
          heLabel: "\u05D1\u05D9\u05D3\u05D5\u05E8",
          color: "#EC4899",
          terms: [
            { t: "\u05E1\u05E8\u05D8", w: 2 },
            { t: "\u05D4\u05E1\u05E8\u05D8", w: 2 },
            { t: "\u05D1\u05E1\u05E8\u05D8", w: 2 },
            { t: "\u05DC\u05E1\u05E8\u05D8", w: 2 },
            { t: "\u05DE\u05D5\u05D6\u05D9\u05E7\u05D4", w: 2 },
            { t: "\u05E9\u05D9\u05E8", w: 2 },
            { t: "\u05E9\u05D9\u05E8\u05D9\u05DD", w: 2 },
            { t: "\u05D1\u05D9\u05E6\u05D5\u05E2", w: 1 },
            { t: "\u05D6\u05DE\u05E8", w: 2 },
            { t: "\u05D6\u05DE\u05E8\u05EA", w: 2 },
            { t: "\u05E9\u05D7\u05E7\u05DF", w: 1 },
            { t: "\u05E9\u05D7\u05E7\u05E0\u05D9\u05EA", w: 2 },
            { t: "\u05E8\u05D9\u05D0\u05DC\u05D9\u05D8\u05D9", w: 3 },
            { t: "\u05E1\u05D3\u05E8\u05D4", w: 2 },
            { t: "\u05D1\u05E1\u05D3\u05E8\u05D4", w: 2 },
            { t: "\u05E2\u05D5\u05E0\u05D4", w: 1 },
            { t: "\u05D0\u05DC\u05D1\u05D5\u05DD", w: 2 },
            { t: "\u05E7\u05D5\u05E0\u05E6\u05E8\u05D8", w: 3 },
            { t: "\u05DC\u05D4\u05E7\u05D4", w: 2 },
            { t: "\u05E9\u05D9\u05D3\u05D5\u05E8", w: 1 },
            { t: "\u05D8\u05DC\u05D5\u05D5\u05D9\u05D6\u05D9\u05D4", w: 2 },
            { t: "\u05D1\u05D8\u05DC\u05D5\u05D5\u05D9\u05D6\u05D9\u05D4", w: 2 },
            { t: "\u05E2\u05E8\u05D5\u05E5", w: 1 },
            { t: "\u05EA\u05D5\u05DB\u05E0\u05D9\u05EA", w: 1 },
            { t: "\u05E7\u05D5\u05DE\u05D3\u05D9\u05D4", w: 2 },
            { t: "\u05D3\u05E8\u05DE\u05D4", w: 1 },
            { t: "\u05E7\u05DC\u05D9\u05E4", w: 2 },
            { t: "\u05D9\u05D5\u05D8\u05D9\u05D5\u05D1", w: 2 },
            { t: "\u05D8\u05D9\u05E7\u05D8\u05D5\u05E7", w: 2 },
            { t: "\u05D0\u05D9\u05E0\u05E1\u05D8\u05D2\u05E8\u05DD", w: 1 },
            { t: "\u05E1\u05DC\u05D1\u05E8\u05D9\u05D8\u05D9", w: 2 },
            { t: "\u05D0\u05D5\u05E4\u05E0\u05D4", w: 2 },
            { t: "movie", w: 2 },
            { t: "music", w: 2 },
            { t: "song", w: 2 },
            { t: "singer", w: 2 },
            { t: "actor", w: 2 },
            { t: "show", w: 1 },
            { t: "film", w: 2 },
            { t: "celebrity", w: 2 },
            { t: "series", w: 2 },
            { t: "netflix", w: 3 },
            { t: "spotify", w: 3 },
            { t: "concert", w: 2 },
            { t: "album", w: 2 },
            { t: "viral", w: 2 },
            { t: "trending", w: 1 },
            { t: "tiktok", w: 2 }
          ]
        },
        technology: {
          heLabel: "\u05D8\u05DB\u05E0\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4",
          color: "#8B5CF6",
          terms: [
            { t: "\u05D1\u05D9\u05E0\u05D4 \u05DE\u05DC\u05D0\u05DB\u05D5\u05EA\u05D9\u05EA", w: 3 },
            { t: "AI", w: 2 },
            { t: "ai", w: 2 },
            { t: "ChatGPT", w: 3 },
            { t: "chatgpt", w: 3 },
            { t: "GPT", w: 3 },
            { t: "\u05E1\u05D8\u05D0\u05E8\u05D8\u05D0\u05E4", w: 3 },
            { t: "\u05D4\u05D9\u05D9\u05D8\u05E7", w: 3 },
            { t: "\u05D4\u05D9\u05D9 \u05D8\u05E7", w: 3 },
            { t: "\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4", w: 2 },
            { t: "\u05EA\u05D5\u05DB\u05E0\u05D4", w: 2 },
            { t: "\u05D7\u05D1\u05E8\u05EA \u05D8\u05E7", w: 3 },
            { t: "\u05E7\u05D5\u05D3", w: 1 },
            { t: "\u05E4\u05D9\u05EA\u05D5\u05D7", w: 2 },
            { t: "\u05DE\u05E4\u05EA\u05D7", w: 1 },
            { t: "\u05D2\u05D5\u05D2\u05DC", w: 2 },
            { t: "\u05D0\u05E4\u05DC", w: 2 },
            { t: "\u05D0\u05DE\u05D6\u05D5\u05DF", w: 2 },
            { t: "\u05DE\u05D9\u05E7\u05E8\u05D5\u05E1\u05D5\u05E4\u05D8", w: 2 },
            { t: "\u05DE\u05D8\u05D0", w: 2 },
            { t: "\u05D7\u05D3\u05E9\u05E0\u05D5\u05EA", w: 2 },
            { t: "\u05D8\u05DB\u05E0\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4", w: 3 },
            { t: "\u05D3\u05D9\u05D2\u05D9\u05D8\u05DC", w: 2 },
            { t: "\u05E8\u05D5\u05D1\u05D5\u05D8", w: 2 },
            { t: "\u05E7\u05E8\u05D9\u05E4\u05D8\u05D5", w: 2 },
            { t: "\u05D1\u05DC\u05D5\u05E7\u05E6'\u05D9\u05D9\u05DF", w: 2 },
            { t: "\u05D1\u05D9\u05D8\u05E7\u05D5\u05D9\u05DF", w: 2 },
            { t: "artificial intelligence", w: 3 },
            { t: "software", w: 2 },
            { t: "startup", w: 2 },
            { t: "app", w: 1 },
            { t: "coding", w: 2 },
            { t: "programming", w: 2 },
            { t: "tech", w: 1 },
            { t: "google", w: 2 },
            { t: "apple", w: 2 },
            { t: "amazon", w: 2 },
            { t: "meta", w: 2 },
            { t: "openai", w: 3 },
            { t: "github", w: 2 },
            { t: "developer", w: 2 },
            { t: "cybersecurity", w: 2 }
          ]
        },
        news: {
          heLabel: "\u05D7\u05D3\u05E9\u05D5\u05EA",
          color: "#F97316",
          terms: [
            { t: "\u05DE\u05DC\u05D7\u05DE\u05D4", w: 3 },
            { t: "\u05D1\u05DE\u05DC\u05D7\u05DE\u05D4", w: 3 },
            { t: "\u05E9\u05E8\u05D9\u05E4\u05D4", w: 2 },
            { t: "\u05D1\u05E9\u05E8\u05D9\u05E4\u05D4", w: 2 },
            { t: "\u05E8\u05E2\u05D9\u05D3\u05EA \u05D0\u05D3\u05DE\u05D4", w: 3 },
            { t: "\u05E4\u05D9\u05D2\u05D5\u05E2", w: 3 },
            { t: "\u05DE\u05D1\u05E6\u05E2", w: 2 },
            { t: "\u05D9\u05E8\u05D9", w: 2 },
            { t: "\u05E0\u05E4\u05D2\u05E2", w: 2 },
            { t: "\u05E0\u05E4\u05D2\u05E2\u05D9\u05DD", w: 2 },
            { t: "\u05EA\u05D0\u05D5\u05E0\u05D4", w: 2 },
            { t: "\u05D0\u05E1\u05D5\u05DF", w: 3 },
            { t: "\u05E2\u05D3\u05DB\u05D5\u05DF", w: 1 },
            { t: "\u05E4\u05DC\u05E9", w: 2 },
            { t: "\u05DB\u05EA\u05D1\u05D4", w: 1 },
            { t: "\u05D3\u05D9\u05D5\u05D5\u05D7", w: 1 },
            { t: "\u05D7\u05D3\u05E9\u05D5\u05EA", w: 2 },
            { t: "\u05D4\u05D7\u05D3\u05E9\u05D5\u05EA", w: 2 },
            { t: "\u05D1\u05D7\u05D3\u05E9\u05D5\u05EA", w: 2 },
            { t: "\u05D9\u05D3\u05D9\u05E2\u05D4", w: 2 },
            { t: "\u05E2\u05E6\u05D5\u05E8", w: 1 },
            { t: "\u05D7\u05D9\u05E4\u05D5\u05E9", w: 1 },
            { t: "\u05DE\u05D7\u05E1\u05D5\u05DD", w: 2 },
            { t: "\u05E0\u05D5\u05D4\u05DC", w: 1 },
            { t: "\u05D4\u05D5\u05D3\u05E2\u05D4", w: 1 },
            { t: "\u05D7\u05D9\u05E8\u05D5\u05DD", w: 3 },
            { t: "\u05D1\u05D9\u05D8\u05D7\u05D5\u05DF", w: 2 },
            { t: "\u05D2\u05D1\u05D5\u05DC", w: 2 },
            { t: "breaking", w: 2 },
            { t: "news", w: 1 },
            { t: "update", w: 1 },
            { t: "war", w: 2 },
            { t: "attack", w: 2 },
            { t: "disaster", w: 2 },
            { t: "earthquake", w: 2 },
            { t: "fire", w: 1 },
            { t: "crisis", w: 2 },
            { t: "alert", w: 2 },
            { t: "urgent", w: 2 },
            { t: "killed", w: 2 },
            { t: "injured", w: 2 },
            { t: "report", w: 1 },
            { t: "conflict", w: 2 },
            { t: "bomb", w: 3 }
          ]
        },
        health: {
          heLabel: "\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA",
          color: "#10B981",
          terms: [
            { t: "\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA", w: 3 },
            { t: "\u05D4\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA", w: 3 },
            { t: "\u05EA\u05E8\u05D5\u05E4\u05D4", w: 2 },
            { t: "\u05EA\u05E8\u05D5\u05E4\u05D5\u05EA", w: 2 },
            { t: "\u05E8\u05D5\u05E4\u05D0", w: 2 },
            { t: "\u05E8\u05D5\u05E4\u05D0\u05D9\u05DD", w: 2 },
            { t: "\u05D7\u05D5\u05DC\u05D4", w: 2 },
            { t: "\u05DE\u05D7\u05DC\u05D4", w: 2 },
            { t: "\u05E4\u05D9\u05D8\u05E0\u05E1", w: 2 },
            { t: "\u05D3\u05D9\u05D0\u05D8\u05D4", w: 2 },
            { t: "\u05EA\u05D6\u05D5\u05E0\u05D4", w: 2 },
            { t: "\u05D5\u05D9\u05D8\u05DE\u05D9\u05DF", w: 2 },
            { t: "\u05E4\u05E1\u05D9\u05DB\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4", w: 3 },
            { t: "\u05E0\u05E4\u05E9", w: 2 },
            { t: "\u05DB\u05D5\u05E9\u05E8", w: 2 },
            { t: "\u05D0\u05D9\u05DE\u05D5\u05DF", w: 2 },
            { t: "\u05D1\u05D9\u05EA \u05D7\u05D5\u05DC\u05D9\u05DD", w: 3 },
            { t: "\u05DE\u05E8\u05E4\u05D0\u05D4", w: 2 },
            { t: "\u05E0\u05D9\u05EA\u05D5\u05D7", w: 2 },
            { t: "\u05D7\u05D9\u05E1\u05D5\u05DF", w: 2 },
            { t: "\u05D5\u05D9\u05E8\u05D5\u05E1", w: 2 },
            { t: "\u05DE\u05D2\u05E4\u05D4", w: 2 },
            { t: "\u05E1\u05D5\u05DB\u05E8\u05EA", w: 3 },
            { t: "\u05DC\u05D7\u05E5 \u05D3\u05DD", w: 3 },
            { t: "\u05E4\u05E1\u05D9\u05DB\u05D9\u05D0\u05D8\u05E8\u05D9\u05D4", w: 3 },
            { t: "\u05D7\u05E8\u05D3\u05D4", w: 2 },
            { t: "\u05D3\u05D9\u05DB\u05D0\u05D5\u05DF", w: 2 },
            { t: "\u05E9\u05D9\u05E0\u05D4", w: 1 },
            { t: "health", w: 2 },
            { t: "medicine", w: 2 },
            { t: "doctor", w: 2 },
            { t: "disease", w: 2 },
            { t: "fitness", w: 2 },
            { t: "diet", w: 1 },
            { t: "nutrition", w: 2 },
            { t: "mental health", w: 3 },
            { t: "therapy", w: 2 },
            { t: "wellness", w: 2 },
            { t: "vaccine", w: 2 },
            { t: "hospital", w: 2 },
            { t: "symptom", w: 2 },
            { t: "exercise", w: 1 },
            { t: "weight loss", w: 2 }
          ]
        },
        economy: {
          heLabel: "\u05DB\u05DC\u05DB\u05DC\u05D4",
          color: "#F59E0B",
          terms: [
            { t: "\u05DB\u05DC\u05DB\u05DC\u05D4", w: 3 },
            { t: "\u05D4\u05DB\u05DC\u05DB\u05DC\u05D4", w: 3 },
            { t: "\u05D1\u05D5\u05E8\u05E1\u05D4", w: 3 },
            { t: "\u05DE\u05E0\u05D9\u05D5\u05EA", w: 3 },
            { t: "\u05D3\u05D5\u05DC\u05E8", w: 2 },
            { t: "\u05E9\u05E7\u05DC", w: 2 },
            { t: "\u05D0\u05D9\u05E0\u05E4\u05DC\u05E6\u05D9\u05D4", w: 3 },
            { t: "\u05E8\u05D9\u05D1\u05D9\u05EA", w: 3 },
            { t: "\u05D4\u05E9\u05E7\u05E2\u05D4", w: 2 },
            { t: "\u05E0\u05D3\u05DC\u05DF", w: 3 },
            { t: '\u05E0\u05D3\u05DC"\u05DF', w: 3 },
            { t: "\u05DE\u05E9\u05DB\u05E0\u05EA\u05D0", w: 3 },
            { t: "\u05DE\u05D7\u05D9\u05E8", w: 1 },
            { t: "\u05D9\u05D5\u05E7\u05E8", w: 2 },
            { t: "\u05D9\u05D5\u05E7\u05E8 \u05D4\u05DE\u05D7\u05D9\u05D4", w: 3 },
            { t: "\u05DE\u05E1", w: 1 },
            { t: "\u05EA\u05E7\u05E6\u05D9\u05D1", w: 2 },
            { t: "\u05D2\u05D9\u05E8\u05E2\u05D5\u05DF", w: 2 },
            { t: "\u05D9\u05D9\u05E6\u05D5\u05D0", w: 2 },
            { t: "\u05D9\u05D1\u05D5\u05D0", w: 2 },
            { t: "\u05E8\u05D5\u05D5\u05D7", w: 1 },
            { t: "\u05D4\u05E4\u05E1\u05D3", w: 1 },
            { t: "\u05D7\u05D1\u05E8\u05D4", w: 1 },
            { t: "\u05E9\u05DB\u05E8", w: 2 },
            { t: "\u05E9\u05DB\u05E8 \u05DE\u05D9\u05E0\u05D9\u05DE\u05D5\u05DD", w: 3 },
            { t: "\u05E4\u05E0\u05E1\u05D9\u05D4", w: 2 },
            { t: "\u05D1\u05D9\u05D8\u05D5\u05D7 \u05DC\u05D0\u05D5\u05DE\u05D9", w: 3 },
            { t: "economy", w: 2 },
            { t: "stocks", w: 2 },
            { t: "market", w: 1 },
            { t: "dollar", w: 2 },
            { t: "inflation", w: 2 },
            { t: "investment", w: 2 },
            { t: "bitcoin", w: 2 },
            { t: "crypto", w: 2 },
            { t: "finance", w: 2 },
            { t: "bank", w: 1 },
            { t: "mortgage", w: 2 },
            { t: "price", w: 1 },
            { t: "gdp", w: 3 },
            { t: "recession", w: 2 },
            { t: "nasdaq", w: 3 },
            { t: "s&p", w: 3 },
            { t: "interest rate", w: 3 },
            { t: "housing", w: 1 }
          ]
        },
        science: {
          heLabel: "\u05DE\u05D3\u05E2",
          color: "#06B6D4",
          terms: [
            { t: "\u05DE\u05D3\u05E2", w: 3 },
            { t: "\u05D4\u05DE\u05D3\u05E2", w: 3 },
            { t: "\u05D7\u05DC\u05DC", w: 3 },
            { t: "\u05D1\u05D7\u05DC\u05DC", w: 3 },
            { t: "\u05E4\u05D9\u05D6\u05D9\u05E7\u05D4", w: 3 },
            { t: "\u05DB\u05D9\u05DE\u05D9\u05D4", w: 3 },
            { t: "\u05D1\u05D9\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4", w: 3 },
            { t: "\u05DE\u05D7\u05E7\u05E8", w: 2 },
            { t: "\u05D2\u05D9\u05DC\u05D5\u05D9", w: 2 },
            { t: "\u05E0\u05D0\u05E1\u05D0", w: 3 },
            { t: "\u05DB\u05D5\u05DB\u05D1", w: 2 },
            { t: "\u05DB\u05D5\u05DB\u05D1\u05D9\u05DD", w: 2 },
            { t: "\u05D2\u05DC\u05E7\u05E1\u05D9\u05D4", w: 3 },
            { t: "\u05D7\u05D9\u05D9\u05D3\u05E7", w: 2 },
            { t: "\u05D7\u05D9\u05D9\u05D3\u05E7\u05D9\u05DD", w: 2 },
            { t: "\u05D0\u05D1\u05D5\u05DC\u05D5\u05E6\u05D9\u05D4", w: 3 },
            { t: "DNA", w: 3 },
            { t: "\u05D2\u05E0\u05D8\u05D9\u05E7\u05D4", w: 3 },
            { t: "\u05DE\u05D0\u05D5\u05D1\u05DF", w: 2 },
            { t: "\u05D3\u05D9\u05E0\u05D5\u05D6\u05D0\u05D5\u05E8", w: 2 },
            { t: "\u05E0\u05D9\u05E1\u05D5\u05D9", w: 2 },
            { t: "\u05DE\u05E2\u05D1\u05D3\u05D4", w: 2 },
            { t: "\u05D7\u05D5\u05E7\u05E8", w: 1 },
            { t: "\u05DE\u05D3\u05E2\u05DF", w: 2 },
            { t: "\u05D0\u05E1\u05D8\u05E8\u05D5\u05E0\u05D5\u05DE\u05D9\u05D4", w: 3 },
            { t: "\u05D2\u05D9\u05D0\u05D5\u05D2\u05E8\u05E4\u05D9\u05D4", w: 2 },
            { t: "\u05D0\u05E7\u05DC\u05D9\u05DD", w: 2 },
            { t: "science", w: 2 },
            { t: "space", w: 2 },
            { t: "physics", w: 2 },
            { t: "chemistry", w: 2 },
            { t: "biology", w: 2 },
            { t: "research", w: 1 },
            { t: "discovery", w: 2 },
            { t: "nasa", w: 3 },
            { t: "star", w: 1 },
            { t: "planet", w: 2 },
            { t: "evolution", w: 2 },
            { t: "study", w: 1 },
            { t: "experiment", w: 2 },
            { t: "quantum", w: 3 },
            { t: "climate", w: 2 },
            { t: "species", w: 2 }
          ]
        },
        religion: {
          heLabel: "\u05D3\u05EA \u05D5\u05DE\u05E1\u05D5\u05E8\u05EA",
          color: "#A78BFA",
          terms: [
            { t: "\u05EA\u05D5\u05E8\u05D4", w: 3 },
            { t: "\u05D4\u05EA\u05D5\u05E8\u05D4", w: 3 },
            { t: "\u05E9\u05D1\u05EA", w: 3 },
            { t: "\u05D1\u05E9\u05D1\u05EA", w: 3 },
            { t: "\u05DC\u05E9\u05D1\u05EA", w: 3 },
            { t: "\u05D7\u05D2", w: 2 },
            { t: "\u05D1\u05D7\u05D2", w: 2 },
            { t: "\u05EA\u05E4\u05D9\u05DC\u05D4", w: 3 },
            { t: "\u05DC\u05D4\u05EA\u05E4\u05DC\u05DC", w: 3 },
            { t: "\u05E8\u05D1", w: 2 },
            { t: "\u05D4\u05E8\u05D1", w: 2 },
            { t: "\u05D9\u05E9\u05D9\u05D1\u05D4", w: 3 },
            { t: "\u05D4\u05DC\u05DB\u05D4", w: 3 },
            { t: "\u05DB\u05E9\u05E8\u05D5\u05EA", w: 3 },
            { t: "\u05DB\u05E9\u05E8", w: 3 },
            { t: "\u05E4\u05E1\u05D7", w: 3 },
            { t: "\u05E8\u05D0\u05E9 \u05D4\u05E9\u05E0\u05D4", w: 3 },
            { t: "\u05D9\u05D5\u05DD \u05DB\u05D9\u05E4\u05D5\u05E8", w: 3 },
            { t: "\u05E1\u05D5\u05DB\u05D5\u05EA", w: 3 },
            { t: "\u05D7\u05E0\u05D5\u05DB\u05D4", w: 3 },
            { t: "\u05E4\u05D5\u05E8\u05D9\u05DD", w: 3 },
            { t: "\u05E9\u05D1\u05D5\u05E2\u05D5\u05EA", w: 3 },
            { t: "\u05D1\u05D9\u05EA \u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: "\u05DB\u05E0\u05E1\u05D9\u05D9\u05D4", w: 3 },
            { t: "\u05DE\u05E1\u05D2\u05D3", w: 3 },
            { t: "\u05DE\u05E6\u05D5\u05D5\u05D4", w: 2 },
            { t: "\u05DE\u05E6\u05D5\u05D5\u05EA", w: 2 },
            { t: "\u05D1\u05E8\u05DB\u05D4", w: 2 },
            { t: "\u05E7\u05D9\u05D3\u05D5\u05E9", w: 3 },
            { t: "\u05EA\u05E9\u05D5\u05D1\u05D4", w: 2 },
            { t: "\u05D0\u05DE\u05D5\u05E0\u05D4", w: 2 },
            { t: "\u05D0\u05DC\u05D5\u05D4\u05D9\u05DD", w: 2 },
            { t: "\u05D3\u05EA\u05D9", w: 2 },
            { t: "\u05D7\u05E8\u05D3\u05D9", w: 3 },
            { t: "\u05D7\u05E8\u05D3\u05D9\u05DD", w: 3 },
            { t: "\u05E6\u05D9\u05D5\u05E0\u05D9 \u05D3\u05EA\u05D9", w: 3 },
            { t: "torah", w: 3 },
            { t: "shabbat", w: 3 },
            { t: "jewish", w: 2 },
            { t: "prayer", w: 2 },
            { t: "rabbi", w: 3 },
            { t: "religion", w: 2 },
            { t: "faith", w: 1 },
            { t: "church", w: 2 },
            { t: "bible", w: 2 },
            { t: "god", w: 1 },
            { t: "holy", w: 1 },
            { t: "synagogue", w: 3 },
            { t: "kosher", w: 3 },
            { t: "islam", w: 2 },
            { t: "muslim", w: 2 },
            { t: "christian", w: 2 }
          ]
        }
      };
      CATEGORY_IDS = Object.keys(CATEGORIES);
    }
  });

  // shared/constants.js
  var ASK_COOLDOWN_MS, MSG;
  var init_constants = __esm({
    "shared/constants.js"() {
      ASK_COOLDOWN_MS = 5 * 6e4;
      MSG = {
        GET_STATS: "GET_STATS",
        RESET_STATS: "RESET_STATS",
        RECORD_SIGNAL: "RECORD_SIGNAL",
        // { categoryId, type: 'positive'|'negative' }
        GET_INSIGHTS: "GET_INSIGHTS",
        GET_SETTINGS: "GET_SETTINGS",
        UPDATE_SETTINGS: "UPDATE_SETTINGS",
        // { autoDismiss: boolean }
        SETTINGS_CHANGED: "SETTINGS_CHANGED"
        // broadcast to content scripts
      };
    }
  });

  // extension/api.js
  function sendMsg(type, payload = {}) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type, ...payload }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (!response?.ok) {
          reject(new Error(response?.error ?? "Unknown error"));
        } else {
          resolve(response.data);
        }
      });
    });
  }
  var api;
  var init_api = __esm({
    "extension/api.js"() {
      init_constants();
      api = {
        getStats: () => sendMsg(MSG.GET_STATS),
        resetStats: () => sendMsg(MSG.RESET_STATS),
        positive: (categoryId) => sendMsg(MSG.RECORD_SIGNAL, { categoryId, type: "positive" }),
        negative: (categoryId) => sendMsg(MSG.RECORD_SIGNAL, { categoryId, type: "negative" }),
        getInsights: () => sendMsg(MSG.GET_INSIGHTS),
        getSettings: () => sendMsg(MSG.GET_SETTINGS),
        updateSettings: (autoDismiss) => sendMsg(MSG.UPDATE_SETTINGS, { autoDismiss })
      };
    }
  });

  // extension/popup/popup-entry.js
  var require_popup_entry = __commonJS({
    "extension/popup/popup-entry.js"() {
      init_categories();
      init_api();
      var URL_KEYS = {
        politics: ["news", "politic", "gov", "knesset", "haaretz", "ynet", "mako", "maariv"],
        sports: ["sport", "football", "basketball", "nba", "fifa", "maccabi"],
        entertainment: ["netflix", "prime", "disney", "music", "spotify", "youtube", "tiktok"],
        technology: ["github", "stackoverflow", "tech", "dev", "google", "apple", "amazon", "openai"],
        news: ["breaking", "cnn", "bbc", "walla", "nrg", "calcalist"],
        health: ["health", "medical", "doctor", "fitness", "gym", "diet"],
        economy: ["finance", "bank", "invest", "stock", "crypto", "bitcoin"],
        science: ["science", "nasa", "nature", "research", "academic", "wikipedia"],
        religion: ["torah", "jewish", "chabad", "otzar", "daat", "hebrewbooks"]
      };
      function classifyUrl(url) {
        const lower = url.toLowerCase();
        for (const id of CATEGORY_IDS) {
          for (const kw of URL_KEYS[id] ?? [])
            if (lower.includes(kw)) return id;
        }
        return "uncategorized";
      }
      var SOCIAL_DOMAINS = ["twitter.com", "x.com", "facebook.com", "instagram.com", "youtube.com", "tiktok.com", "linkedin.com", "reddit.com", "threads.net", "snapchat.com"];
      function showTab(name) {
        const names = ["overview", "categories", "history", "insights", "settings"];
        document.querySelectorAll(".tab").forEach((t, i) => t.classList.toggle("active", names[i] === name));
        document.querySelectorAll(".tab-content").forEach((el) => el.classList.toggle("active", el.id === "tab-" + name));
      }
      window.showTab = showTab;
      function barRow(label, count, max, color, weight = null, dismissed = 0) {
        const pct = max > 0 ? Math.round(count / max * 100) : 0;
        const sentimentEl = weight != null ? weightBadge(weight, dismissed) : "";
        return `<div class="bar-row">
    <span class="bar-label">${label}</span>
    <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>
    <span class="bar-count">${count}</span>
    ${sentimentEl}
  </div>`;
      }
      function weightBadge(w, dismissed = 0) {
        if (dismissed > 0) return `<span class="badge badge-block" title="${dismissed} \u05D4\u05D5\u05E1\u05E8\u05D5">\u{1F6AB} ${dismissed}</span>`;
        if (w >= 1.5) return `<span class="badge badge-love"  title="\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4 \u05D0\u05D4\u05D5\u05D1\u05D4">\u2764\uFE0F</span>`;
        if (w >= 0.8) return `<span class="badge badge-mid"   title="\u05E0\u05D9\u05D8\u05E8\u05DC\u05D9">\u{1F610}</span>`;
        if (w >= 0.4) return `<span class="badge badge-low"   title="\u05DC\u05D0 \u05DE\u05DE\u05E9 \u05DE\u05E2\u05E0\u05D9\u05D9\u05DF">\u{1F612}</span>`;
        return `<span class="badge badge-block" title="\u05DE\u05E1\u05D9\u05E8 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA">\u{1F6AB}</span>`;
      }
      async function loadAll() {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1e3;
        const brainState = await api.getStats().catch(() => ({}));
        const stored = brainState?.allTime ?? {};
        const weights = brainState?.weights ?? {};
        const dismissedBy = brainState?.dismissed ?? {};
        const histItems = await new Promise(
          (r) => chrome.history.search({ text: "", maxResults: 5e3, startTime: sevenDaysAgo }, r)
        );
        const domainCounts = {};
        const socialCounts = {};
        const histCatCounts = {};
        const hourBuckets = new Array(24).fill(0);
        for (const item of histItems) {
          try {
            const url = item.url ?? "";
            const host = new URL(url).hostname.replace("www.", "");
            domainCounts[host] = (domainCounts[host] ?? 0) + (item.visitCount ?? 1);
            if (SOCIAL_DOMAINS.some((d) => host.includes(d)))
              socialCounts[host] = (socialCounts[host] ?? 0) + (item.visitCount ?? 1);
            const cat = classifyUrl(url);
            histCatCounts[cat] = (histCatCounts[cat] ?? 0) + 1;
            if (item.lastVisitTime)
              hourBuckets[new Date(item.lastVisitTime).getHours()]++;
          } catch {
          }
        }
        const totalVisits = histItems.length;
        const totalSocial = Object.values(socialCounts).reduce((a, b) => a + b, 0);
        const liveCats = Object.entries(stored).filter(([k, v]) => v > 0 && k !== "uncategorized").sort((a, b) => b[1] - a[1]);
        const topLiveCat = liveCats[0];
        const dismissedTotal = brainState?.dismissedTotal ?? 0;
        if (dismissedTotal > 0) {
          document.getElementById("stat-dismissed").textContent = dismissedTotal.toLocaleString();
          document.getElementById("dismiss-banner").style.display = "flex";
        }
        document.getElementById("header-sub").textContent = `${totalVisits.toLocaleString()} \u05D1\u05D9\u05E7\u05D5\u05E8\u05D9\u05DD \u05D1-7 \u05D9\u05DE\u05D9\u05DD`;
        const postsAnalyzed = Object.values(stored).reduce((a, b) => a + b, 0);
        if (postsAnalyzed === 0 && totalSocial === 0) {
          document.getElementById("tab-overview").innerHTML = `
      <div style="text-align:center;padding:28px 16px">
        <div style="font-size:48px;margin-bottom:12px">\u{1F4CE}</div>
        <div style="font-size:15px;font-weight:700;color:#1F2937;margin-bottom:8px">\u05D1\u05E8\u05D5\u05DA \u05D4\u05D1\u05D0!</div>
        <div style="font-size:12px;color:#6B7280;line-height:1.7;margin-bottom:20px">
          \u05E7\u05DC\u05D9\u05E4\u05D9 \u05DE\u05D5\u05DB\u05DF \u05DC\u05E0\u05EA\u05D7 \u05D0\u05EA \u05D4\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA.<br>
          \u05E4\u05EA\u05D7 <b>Twitter, YouTube, Facebook</b> \u05D0\u05D5 \u05DB\u05DC \u05E8\u05E9\u05EA \u05D7\u05D1\u05E8\u05EA\u05D9\u05EA \u05D0\u05D7\u05E8\u05EA<br>
          \u05D5\u05E7\u05DC\u05D9\u05E4\u05D9 \u05D9\u05EA\u05D7\u05D9\u05DC \u05DC\u05D0\u05E1\u05D5\u05E3 \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA.
        </div>
        <div style="background:#EDE9FE;border-radius:10px;padding:12px 14px;font-size:12px;color:#5B21B6;text-align:right">
          \u{1F4A1} \u05D2\u05DC\u05D5\u05DC \u05DB\u05DE\u05D4 \u05E4\u05D5\u05E1\u05D8\u05D9\u05DD, \u05D5\u05D0\u05D6 \u05D7\u05D6\u05D5\u05E8 \u05DC\u05DB\u05D0\u05DF \u05DC\u05E8\u05D0\u05D5\u05EA \u05D0\u05EA \u05D4\u05E0\u05D9\u05EA\u05D5\u05D7
        </div>
      </div>`;
          return;
        }
        document.getElementById("stat-posts-analyzed").textContent = postsAnalyzed.toLocaleString();
        document.getElementById("stat-dismissed-grid").textContent = dismissedTotal.toLocaleString();
        document.getElementById("stat-social").textContent = totalSocial.toLocaleString();
        document.getElementById("stat-top-cat").textContent = topLiveCat ? CATEGORIES[topLiveCat[0]]?.heLabel ?? topLiveCat[0] : Object.entries(histCatCounts).filter(([k]) => k !== "uncategorized").sort((a, b) => b[1] - a[1])[0] ? CATEGORIES[Object.entries(histCatCounts).sort((a, b) => b[1] - a[1])[0][0]]?.heLabel ?? "\u2014" : "\u2014";
        const sortedSocial = Object.entries(socialCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
        const maxSocial = sortedSocial[0]?.[1] ?? 1;
        document.getElementById("social-sites").innerHTML = sortedSocial.length ? sortedSocial.map(([d, c]) => barRow(d, c, maxSocial, "#A78BFA")).join("") : '<div class="empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05D1\u05D9\u05E7\u05D5\u05E8\u05D9\u05DD \u05D1\u05E8\u05E9\u05EA\u05D5\u05EA \u05D7\u05D1\u05E8\u05EA\u05D9\u05D5\u05EA \u05D1-7 \u05D9\u05DE\u05D9\u05DD \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D9\u05DD</div>';
        const maxLive = Math.max(...Object.values(stored), 1);
        document.getElementById("cat-bars-live").innerHTML = liveCats.length ? liveCats.map(([id, cnt]) => barRow(
          CATEGORIES[id]?.heLabel ?? id,
          cnt,
          maxLive,
          CATEGORIES[id]?.color ?? "#9CA3AF",
          weights[id] ?? null,
          dismissedBy[id] ?? 0
        )).join("") : '<div class="empty">\u05E2\u05D3\u05D9\u05D9\u05DF \u05DC\u05D0 \u05D6\u05D5\u05D4\u05D4 \u05EA\u05D5\u05DB\u05DF. \u05D2\u05DC\u05D5\u05DC \u05D1\u05E8\u05E9\u05EA \u05D7\u05D1\u05E8\u05EA\u05D9\u05EA \u05E2\u05DD \u05D4\u05EA\u05D5\u05E1\u05E3 \u05E4\u05E2\u05D9\u05DC.</div>';
        const histCatEntries = Object.entries(histCatCounts).filter(([k]) => k !== "uncategorized").sort((a, b) => b[1] - a[1]);
        const maxHistCat = histCatEntries[0]?.[1] ?? 1;
        document.getElementById("cat-bars-history").innerHTML = histCatEntries.length ? histCatEntries.map(([id, cnt]) => barRow(CATEGORIES[id]?.heLabel ?? id, cnt, maxHistCat, CATEGORIES[id]?.color ?? "#9CA3AF")).join("") : '<div class="empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D5\u05EA \u05D1\u05D4\u05D9\u05E1\u05D8\u05D5\u05E8\u05D9\u05D9\u05EA \u05D4\u05D2\u05DC\u05D9\u05E9\u05D4</div>';
        const maxHour = Math.max(...hourBuckets, 1);
        document.getElementById("time-bars").innerHTML = hourBuckets.map(
          (v) => `<div class="time-bar" style="height:${Math.max(3, Math.round(v / maxHour * 48))}px" title="${v} \u05D1\u05D9\u05E7\u05D5\u05E8\u05D9\u05DD"></div>`
        ).join("");
        document.getElementById("time-labels").innerHTML = Array.from({ length: 24 }, (_, i) => {
          const label = i === 0 ? "12AM" : i === 6 ? "6AM" : i === 12 ? "12PM" : i === 18 ? "6PM" : "";
          return `<div class="time-label" title="\u05E9\u05E2\u05D4 ${i}:00">${label}</div>`;
        }).join("");
        const topDomains = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const maxDomain = topDomains[0]?.[1] ?? 1;
        document.getElementById("top-domains").innerHTML = topDomains.length ? topDomains.map(([d, c]) => `
        <div class="domain-item">
          <span class="domain-name">${d}</span>
          <span class="domain-count">${c.toLocaleString()}</span>
        </div>
        <div class="domain-bar"><div class="domain-bar-fill" style="width:${Math.round(c / maxDomain * 100)}%"></div></div>
      `).join("") : '<div class="empty">\u05D0\u05D9\u05DF \u05D4\u05D9\u05E1\u05D8\u05D5\u05E8\u05D9\u05D4 \u05D6\u05DE\u05D9\u05E0\u05D4</div>';
        const insights = [];
        if (sortedSocial.length) {
          const [top] = sortedSocial;
          insights.push({ icon: "\u{1F4F1}", text: `\u05D4\u05D0\u05EA\u05E8 \u05D4\u05DB\u05D9 \u05E4\u05D5\u05E4\u05D5\u05DC\u05E8\u05D9 \u05E9\u05DC\u05DA \u05D4\u05E9\u05D1\u05D5\u05E2: <b>${top[0]}</b> \u2014 ${top[1].toLocaleString()} \u05D1\u05D9\u05E7\u05D5\u05E8\u05D9\u05DD.` });
        }
        const peakHour = hourBuckets.indexOf(Math.max(...hourBuckets));
        insights.push({ icon: "\u23F0", text: `\u05D0\u05EA\u05D4 \u05D2\u05D5\u05DC\u05E9 \u05D4\u05DB\u05D9 \u05D4\u05E8\u05D1\u05D4 \u05D1\u05E9\u05E2\u05D4 <b>${peakHour}:00</b> (${hourBuckets[peakHour]} \u05D1\u05D9\u05E7\u05D5\u05E8\u05D9\u05DD \u05D1-7 \u05D9\u05DE\u05D9\u05DD).` });
        if (totalVisits > 0) {
          const pct = Math.round(totalSocial / totalVisits * 100);
          insights.push({ icon: "\u{1F578}\uFE0F", text: `<b>${pct}%</b> \u05DE\u05D4\u05D2\u05DC\u05D9\u05E9\u05D4 \u05E9\u05DC\u05DA \u05D4\u05D5\u05DC\u05DB\u05EA \u05DC\u05E8\u05E9\u05EA\u05D5\u05EA \u05D7\u05D1\u05E8\u05EA\u05D9\u05D5\u05EA.` });
        }
        if (topLiveCat) {
          const liveTotal = Object.values(stored).reduce((a, b) => a + b, 0) || 1;
          const pct = Math.round(topLiveCat[1] / liveTotal * 100);
          insights.push({ icon: "\u{1F50D}", text: `\u05D4\u05EA\u05D5\u05DB\u05DF \u05D4\u05E0\u05E4\u05D5\u05E5 \u05D1\u05D9\u05D5\u05EA\u05E8 \u05E9\u05E0\u05D7\u05E9\u05E4\u05EA \u05D0\u05DC\u05D9\u05D5: <b>${CATEGORIES[topLiveCat[0]]?.heLabel}</b> \u2014 ${pct}% \u05DE\u05D4\u05E4\u05D5\u05E1\u05D8\u05D9\u05DD.` });
        }
        if (histCatEntries.length) {
          const hTotal = histCatEntries.reduce((a, [, v]) => a + v, 0) || 1;
          const top3 = histCatEntries.slice(0, 3).map(([id, cnt]) => `${CATEGORIES[id]?.heLabel ?? id} (${Math.round(cnt / hTotal * 100)}%)`).join(", ");
          insights.push({ icon: "\u{1F4CA}", text: `\u05DC\u05E4\u05D9 \u05D4\u05D9\u05E1\u05D8\u05D5\u05E8\u05D9\u05D9\u05EA \u05D4\u05D2\u05DC\u05D9\u05E9\u05D4, \u05D4\u05E0\u05D5\u05E9\u05D0\u05D9\u05DD \u05E9\u05DE\u05E2\u05E0\u05D9\u05D9\u05E0\u05D9\u05DD \u05D0\u05D5\u05EA\u05DA: <b>${top3}</b>.` });
        }
        const avgPerDay = Math.round(totalVisits / 7);
        insights.push({ icon: "\u{1F4C8}", text: `\u05DE\u05DE\u05D5\u05E6\u05E2 \u05E9\u05DC <b>${avgPerDay}</b> \u05D1\u05D9\u05E7\u05D5\u05E8\u05D9\u05DD \u05D1\u05D9\u05D5\u05DD \u05D4\u05E9\u05D1\u05D5\u05E2 \u05D4\u05D0\u05D7\u05E8\u05D5\u05DF.` });
        document.getElementById("insights-list").innerHTML = insights.length ? insights.map(
          (ins) => `<div class="insight"><div class="insight-icon">${ins.icon}</div><div class="insight-text">${ins.text}</div></div>`
        ).join("") : '<div class="empty">\u05D0\u05D9\u05DF \u05DE\u05E1\u05E4\u05D9\u05E7 \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05E2\u05D3\u05D9\u05D9\u05DF. \u05D4\u05EA\u05D5\u05E1\u05E3 \u05E6\u05E8\u05D9\u05DA \u05D6\u05DE\u05DF \u05DC\u05DC\u05DE\u05D5\u05D3.</div>';
      }
      document.getElementById("btn-reset").addEventListener("click", async () => {
        await api.resetStats();
        location.reload();
      });
      async function loadSettings() {
        const settings = await api.getSettings().catch(() => ({ autoDismiss: true }));
        const brainState = await api.getStats().catch(() => ({}));
        const weights = brainState?.weights ?? {};
        const toggle = document.getElementById("toggle-auto-dismiss");
        toggle.checked = settings?.autoDismiss ?? true;
        toggle.addEventListener("change", () => api.updateSettings(toggle.checked));
        const catList = document.getElementById("settings-cat-list");
        const rows = CATEGORY_IDS.map((id) => {
          const w = weights[id] ?? 1;
          let badge = "\u{1F610}";
          if (w >= 1.5) badge = "\u2764\uFE0F";
          else if (w < 0.4) badge = "\u{1F6AB}";
          else if (w < 0.8) badge = "\u{1F612}";
          return `<div class="cat-pref-row">
      <span class="cat-pref-name">${CATEGORIES[id]?.heLabel ?? id}</span>
      <span class="cat-pref-badge">${badge}</span>
    </div>`;
        });
        catList.innerHTML = rows.join("");
      }
      document.getElementById("btn-reset-prefs").addEventListener("click", async () => {
        await api.resetStats();
        location.reload();
      });
      loadAll().catch(console.error);
      loadSettings().catch(console.error);
    }
  });
  require_popup_entry();
})();
