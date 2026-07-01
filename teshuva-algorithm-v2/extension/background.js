(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // shared/constants.js
  var STORAGE_KEY, ASK_COOLDOWN_MS, MSG;
  var init_constants = __esm({
    "shared/constants.js"() {
      STORAGE_KEY = "teshuva_state";
      ASK_COOLDOWN_MS = 5 * 6e4;
      MSG = {
        GET_STATS: "GET_STATS",
        RESET_STATS: "RESET_STATS",
        RECORD_SIGNAL: "RECORD_SIGNAL",
        // { categoryId, type: 'positive'|'negative' }
        GET_INSIGHTS: "GET_INSIGHTS"
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
          keywords: {
            he: ["\u05D1\u05D7\u05D9\u05E8\u05D5\u05EA", "\u05DB\u05E0\u05E1\u05EA", "\u05DE\u05DE\u05E9\u05DC\u05D4", "\u05E9\u05E8", "\u05E8\u05D0\u05E9 \u05DE\u05DE\u05E9\u05DC\u05D4", "\u05D0\u05D5\u05E4\u05D5\u05D6\u05D9\u05E6\u05D9\u05D4", "\u05E7\u05D5\u05D0\u05DC\u05D9\u05E6\u05D9\u05D4", "\u05DE\u05E4\u05DC\u05D2\u05D4", "\u05E4\u05D5\u05DC\u05D9\u05D8\u05D9", "\u05D1\u05D9\u05D1\u05D9", "\u05D2\u05E0\u05E5", "\u05DC\u05E4\u05D9\u05D3", "\u05E0\u05EA\u05E0\u05D9\u05D4\u05D5", "\u05D2\u05DC\u05E0\u05D8"],
            en: ["election", "government", "congress", "senate", "president", "minister", "vote", "policy", "democrat", "republican", "parliament", "prime minister"]
          }
        },
        sports: {
          heLabel: "\u05E1\u05E4\u05D5\u05E8\u05D8",
          color: "#3B82F6",
          keywords: {
            he: ["\u05DB\u05D3\u05D5\u05E8\u05D2\u05DC", "\u05DB\u05D3\u05D5\u05E8\u05E1\u05DC", "\u05DC\u05D9\u05D2\u05D4", "\u05D2\u05D5\u05DC", "\u05DE\u05E9\u05D7\u05E7", "\u05E9\u05D7\u05E7\u05DF", "\u05E7\u05D1\u05D5\u05E6\u05D4", "\u05D0\u05DC\u05D9\u05E4\u05D5\u05EA", "\u05DE\u05DB\u05D1\u05D9", "\u05D4\u05E4\u05D5\u05E2\u05DC", "\u05D1\u05D9\u05EA\u05E8", "\u05E0\u05D1\u05D7\u05E8\u05EA"],
            en: ["football", "basketball", "soccer", "goal", "match", "game", "player", "team", "championship", "nba", "fifa", "score", "league", "tournament"]
          }
        },
        entertainment: {
          heLabel: "\u05D1\u05D9\u05D3\u05D5\u05E8",
          color: "#EC4899",
          keywords: {
            he: ["\u05E1\u05E8\u05D8", "\u05DE\u05D5\u05D6\u05D9\u05E7\u05D4", "\u05E9\u05D9\u05E8", "\u05D6\u05DE\u05E8", "\u05E9\u05D7\u05E7\u05DF", "\u05EA\u05D5\u05DB\u05E0\u05D9\u05EA", "\u05D1\u05D9\u05D3\u05D5\u05E8", "\u05E8\u05D9\u05D0\u05DC\u05D9\u05D8\u05D9", "\u05E1\u05D3\u05E8\u05D4", "\u05D0\u05DC\u05D1\u05D5\u05DD", "\u05E7\u05D5\u05E0\u05E6\u05E8\u05D8"],
            en: ["movie", "music", "song", "singer", "actor", "show", "film", "celebrity", "tv", "series", "netflix", "spotify", "concert", "album", "viral"]
          }
        },
        technology: {
          heLabel: "\u05D8\u05DB\u05E0\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4",
          color: "#8B5CF6",
          keywords: {
            he: ["\u05D1\u05D9\u05E0\u05D4 \u05DE\u05DC\u05D0\u05DB\u05D5\u05EA\u05D9\u05EA", "AI", "\u05E1\u05D8\u05D0\u05E8\u05D8\u05D0\u05E4", "\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4", "\u05EA\u05D5\u05DB\u05E0\u05D4", "\u05D7\u05D1\u05E8\u05EA \u05D8\u05E7", "\u05E7\u05D5\u05D3", "\u05E4\u05D9\u05EA\u05D5\u05D7", "\u05D2\u05D5\u05D2\u05DC", "\u05D0\u05E4\u05DC", "\u05D0\u05DE\u05D6\u05D5\u05DF", "\u05DE\u05D9\u05E7\u05E8\u05D5\u05E1\u05D5\u05E4\u05D8"],
            en: ["ai", "artificial intelligence", "software", "startup", "app", "coding", "programming", "tech", "google", "apple", "amazon", "meta", "openai", "chatgpt", "github", "developer"]
          }
        },
        news: {
          heLabel: "\u05D7\u05D3\u05E9\u05D5\u05EA",
          color: "#F97316",
          keywords: {
            he: ["\u05DE\u05DC\u05D7\u05DE\u05D4", "\u05E9\u05E8\u05D9\u05E4\u05D4", "\u05E8\u05E2\u05D9\u05D3\u05EA \u05D0\u05D3\u05DE\u05D4", "\u05D7\u05D3\u05E9\u05D5\u05EA", "\u05E2\u05D3\u05DB\u05D5\u05DF", "\u05E4\u05D9\u05D2\u05D5\u05E2", "\u05EA\u05D0\u05D5\u05E0\u05D4", "\u05D0\u05E1\u05D5\u05DF", "\u05DE\u05D1\u05E6\u05E2", "\u05D9\u05E8\u05D9", "\u05E0\u05E4\u05D2\u05E2"],
            en: ["breaking", "news", "update", "war", "attack", "disaster", "earthquake", "fire", "crisis", "alert", "urgent", "report", "killed", "injured"]
          }
        },
        health: {
          heLabel: "\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA",
          color: "#10B981",
          keywords: {
            he: ["\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA", "\u05EA\u05E8\u05D5\u05E4\u05D4", "\u05E8\u05D5\u05E4\u05D0", "\u05DE\u05D7\u05DC\u05D4", "\u05E4\u05D9\u05D8\u05E0\u05E1", "\u05D3\u05D9\u05D0\u05D8\u05D4", "\u05EA\u05D6\u05D5\u05E0\u05D4", "\u05D5\u05D9\u05D8\u05DE\u05D9\u05DF", "\u05E4\u05E1\u05D9\u05DB\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4", "\u05E0\u05E4\u05E9", "\u05DB\u05D5\u05E9\u05E8"],
            en: ["health", "medicine", "doctor", "disease", "fitness", "diet", "nutrition", "mental health", "therapy", "wellness", "vaccine", "hospital", "symptom"]
          }
        },
        economy: {
          heLabel: "\u05DB\u05DC\u05DB\u05DC\u05D4",
          color: "#F59E0B",
          keywords: {
            he: ["\u05DB\u05DC\u05DB\u05DC\u05D4", "\u05D1\u05D5\u05E8\u05E1\u05D4", "\u05DE\u05E0\u05D9\u05D5\u05EA", "\u05D3\u05D5\u05DC\u05E8", "\u05E9\u05E7\u05DC", "\u05D0\u05D9\u05E0\u05E4\u05DC\u05E6\u05D9\u05D4", "\u05E8\u05D9\u05D1\u05D9\u05EA", "\u05D4\u05E9\u05E7\u05E2\u05D4", "\u05E0\u05D3\u05DC\u05DF", "\u05DE\u05E9\u05DB\u05E0\u05EA\u05D0", "\u05DE\u05D7\u05D9\u05E8", "\u05D9\u05D5\u05E7\u05E8"],
            en: ["economy", "stocks", "market", "dollar", "inflation", "investment", "bitcoin", "crypto", "finance", "bank", "mortgage", "price", "gdp", "recession"]
          }
        },
        science: {
          heLabel: "\u05DE\u05D3\u05E2",
          color: "#06B6D4",
          keywords: {
            he: ["\u05DE\u05D3\u05E2", "\u05D7\u05DC\u05DC", "\u05E4\u05D9\u05D6\u05D9\u05E7\u05D4", "\u05DB\u05D9\u05DE\u05D9\u05D4", "\u05D1\u05D9\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4", "\u05DE\u05D7\u05E7\u05E8", "\u05D2\u05D9\u05DC\u05D5\u05D9", "\u05E0\u05D0\u05E1\u05D0", "\u05DB\u05D5\u05DB\u05D1", "\u05D7\u05D9\u05D9\u05D3\u05E7", "\u05D0\u05D1\u05D5\u05DC\u05D5\u05E6\u05D9\u05D4"],
            en: ["science", "space", "physics", "chemistry", "biology", "research", "discovery", "nasa", "star", "planet", "evolution", "study", "experiment", "quantum"]
          }
        },
        religion: {
          heLabel: "\u05D3\u05EA \u05D5\u05DE\u05E1\u05D5\u05E8\u05EA",
          color: "#A78BFA",
          keywords: {
            he: ["\u05EA\u05D5\u05E8\u05D4", "\u05E9\u05D1\u05EA", "\u05D7\u05D2", "\u05EA\u05E4\u05D9\u05DC\u05D4", "\u05E8\u05D1", "\u05D9\u05E9\u05D9\u05D1\u05D4", "\u05D4\u05DC\u05DB\u05D4", "\u05DB\u05E9\u05E8\u05D5\u05EA", "\u05E4\u05E1\u05D7", "\u05E8\u05D0\u05E9 \u05D4\u05E9\u05E0\u05D4", "\u05D9\u05D5\u05DD \u05DB\u05D9\u05E4\u05D5\u05E8", "\u05E1\u05D5\u05DB\u05D5\u05EA", "\u05D7\u05E0\u05D5\u05DB\u05D4"],
            en: ["torah", "shabbat", "jewish", "prayer", "rabbi", "religion", "faith", "church", "bible", "god", "holy", "synagogue", "kosher"]
          }
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
                weights: Object.fromEntries(CATEGORY_IDS.map((id) => [id, 1]))
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
          default:
            return { ok: false, error: `Unknown message type: ${msg.type}` };
        }
      }
    }
  });
  require_background_entry();
})();
