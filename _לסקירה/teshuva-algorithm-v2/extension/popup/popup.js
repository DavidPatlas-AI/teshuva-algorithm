(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

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
        GET_INSIGHTS: "GET_INSIGHTS"
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
        getInsights: () => sendMsg(MSG.GET_INSIGHTS)
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
        const names = ["overview", "categories", "history", "insights"];
        document.querySelectorAll(".tab").forEach((t, i) => t.classList.toggle("active", names[i] === name));
        document.querySelectorAll(".tab-content").forEach((el) => el.classList.toggle("active", el.id === "tab-" + name));
      }
      window.showTab = showTab;
      function barRow(label, count, max, color) {
        const pct = max > 0 ? Math.round(count / max * 100) : 0;
        return `<div class="bar-row">
    <span class="bar-label">${label}</span>
    <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>
    <span class="bar-count">${count}</span>
  </div>`;
      }
      async function loadAll() {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1e3;
        const brainState = await api.getStats().catch(() => ({}));
        const stored = brainState?.allTime ?? {};
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
        document.getElementById("header-sub").textContent = `${totalVisits.toLocaleString()} \u05D1\u05D9\u05E7\u05D5\u05E8\u05D9\u05DD \u05D1-7 \u05D9\u05DE\u05D9\u05DD`;
        document.getElementById("stat-visits").textContent = totalVisits.toLocaleString();
        document.getElementById("stat-social").textContent = totalSocial.toLocaleString();
        document.getElementById("stat-categories").textContent = liveCats.length || Object.keys(histCatCounts).filter((k) => k !== "uncategorized").length;
        document.getElementById("stat-top-cat").textContent = topLiveCat ? CATEGORIES[topLiveCat[0]]?.heLabel ?? topLiveCat[0] : Object.entries(histCatCounts).filter(([k]) => k !== "uncategorized").sort((a, b) => b[1] - a[1])[0]?.[0] ? CATEGORIES[Object.entries(histCatCounts).sort((a, b) => b[1] - a[1])[0][0]]?.heLabel ?? "\u2014" : "\u2014";
        const sortedSocial = Object.entries(socialCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
        const maxSocial = sortedSocial[0]?.[1] ?? 1;
        document.getElementById("social-sites").innerHTML = sortedSocial.length ? sortedSocial.map(([d, c]) => barRow(d, c, maxSocial, "#A78BFA")).join("") : '<div class="empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05D1\u05D9\u05E7\u05D5\u05E8\u05D9\u05DD \u05D1\u05E8\u05E9\u05EA\u05D5\u05EA \u05D7\u05D1\u05E8\u05EA\u05D9\u05D5\u05EA \u05D1-7 \u05D9\u05DE\u05D9\u05DD \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D9\u05DD</div>';
        const maxLive = Math.max(...Object.values(stored), 1);
        document.getElementById("cat-bars-live").innerHTML = liveCats.length ? liveCats.map(([id, cnt]) => barRow(CATEGORIES[id]?.heLabel ?? id, cnt, maxLive, CATEGORIES[id]?.color ?? "#9CA3AF")).join("") : '<div class="empty">\u05E2\u05D3\u05D9\u05D9\u05DF \u05DC\u05D0 \u05D6\u05D5\u05D4\u05D4 \u05EA\u05D5\u05DB\u05DF. \u05D2\u05DC\u05D5\u05DC \u05D1\u05E8\u05E9\u05EA \u05D7\u05D1\u05E8\u05EA\u05D9\u05EA \u05E2\u05DD \u05D4\u05EA\u05D5\u05E1\u05E3 \u05E4\u05E2\u05D9\u05DC.</div>';
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
      loadAll().catch(console.error);
    }
  });
  require_popup_entry();
})();
