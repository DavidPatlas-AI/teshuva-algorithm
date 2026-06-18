(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // shared/constants.js
  var STORAGE_KEY, ASK_COOLDOWN_MS, SETTINGS_KEY, MSG;
  var init_constants = __esm({
    "shared/constants.js"() {
      STORAGE_KEY = "teshuva_state";
      ASK_COOLDOWN_MS = 5 * 6e4;
      SETTINGS_KEY = "teshuva_settings";
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

  // extension/background-entry.js
  var require_background_entry = __commonJS({
    "extension/background-entry.js"() {
      init_constants();
      init_categories();
      chrome.runtime.onInstalled.addListener(async ({ reason }) => {
        if (reason !== "install") return;
        const empty = Object.fromEntries(CATEGORY_IDS.map((id) => [id, 0]));
        await chrome.storage.local.set({
          [STORAGE_KEY]: {
            allTime: { ...empty },
            weights: Object.fromEntries(CATEGORY_IDS.map((id) => [id, 1])),
            installedAt: Date.now()
          },
          teshuva_onboarded: false
        });
      });
      chrome.runtime.onStartup.addListener(migrateIfNeeded);
      chrome.runtime.onInstalled.addListener(migrateIfNeeded);
      async function migrateIfNeeded() {
        const data = await chrome.storage.local.get(["allTime", STORAGE_KEY]);
        if (data[STORAGE_KEY]) return;
        if (data.allTime) {
          const existing = await chrome.storage.local.get(STORAGE_KEY);
          const state = existing[STORAGE_KEY] ?? { allTime: {}, weights: {} };
          Object.assign(state.allTime, data.allTime);
          await chrome.storage.local.set({ [STORAGE_KEY]: state });
          await chrome.storage.local.remove("allTime");
        }
      }
      chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
        handle(msg).then(sendResponse).catch((err) => sendResponse({ ok: false, error: err.message }));
        return true;
      });
      async function handle(msg) {
        switch (msg.type) {
          case MSG.GET_STATS: {
            const data = await chrome.storage.local.get(STORAGE_KEY);
            const state = data[STORAGE_KEY] ?? {};
            return { ok: true, data: state };
          }
          case MSG.RESET_STATS: {
            const empty = Object.fromEntries(CATEGORY_IDS.map((id) => [id, 0]));
            await chrome.storage.local.set({
              [STORAGE_KEY]: {
                allTime: { ...empty },
                weights: Object.fromEntries(CATEGORY_IDS.map((id) => [id, 1])),
                dismissed: { ...empty }
              }
            });
            return { ok: true };
          }
          case MSG.RECORD_SIGNAL: {
            const { categoryId, type } = msg;
            const data = await chrome.storage.local.get(STORAGE_KEY);
            const state = data[STORAGE_KEY] ?? { weights: {} };
            const w = state.weights?.[categoryId] ?? 1;
            state.weights[categoryId] = type === "positive" ? Math.min(3, w + 0.15) : Math.max(0.1, w - 0.08);
            await chrome.storage.local.set({ [STORAGE_KEY]: state });
            return { ok: true };
          }
          case MSG.GET_INSIGHTS: {
            return { ok: true, data: [] };
          }
          case MSG.GET_SETTINGS: {
            const data = await chrome.storage.local.get(SETTINGS_KEY);
            return { ok: true, data: data[SETTINGS_KEY] ?? { autoDismiss: true } };
          }
          case MSG.UPDATE_SETTINGS: {
            const { autoDismiss } = msg;
            await chrome.storage.local.set({ [SETTINGS_KEY]: { autoDismiss } });
            const tabs = await chrome.tabs.query({});
            for (const tab of tabs) {
              try {
                await chrome.tabs.sendMessage(tab.id, { type: MSG.SETTINGS_CHANGED, autoDismiss });
              } catch {
              }
            }
            return { ok: true };
          }
          default:
            return { ok: false, error: `Unknown message type: ${msg.type}` };
        }
      }
    }
  });
  require_background_entry();
})();
