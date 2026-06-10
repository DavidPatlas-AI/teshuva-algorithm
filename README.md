# 📎 האלגוריתם שחזר בתשובה
### *The Algorithm That Repented*

> **What if the algorithm stopped hiding and started explaining itself?**

---

## The Idea

Every day, social media algorithms decide what you see — and they never tell you why.

This project is a small act of rebellion:  
A browser extension + desktop agent (Clippy, naturally) that sits with you while you browse, watches what the algorithm shows you, and **tells you the truth**.

*"You're seeing this because you clicked on politics 43% of the time this week."*  
*"You've visited YouTube 94 times in the last 7 days."*  
*"Your peak browsing hour is 11 PM."*

The algorithm repents. It confesses. It explains.

---

## What's Inside

```
📦 teshuva-algorithm/
├── 🧠 brain/          — Learning engine: classifies content into categories
├── 🎭 mascot/         — Clippy-based mascot with speech bubbles
├── 🔌 extension/      — Chrome/Edge browser extension (Manifest V3)
│   ├── content/       — Runs on Twitter, Facebook, Instagram, YouTube, TikTok
│   └── popup/         — Rich stats popup: history, categories, insights
└── 🖥️ desktop/        — Clippy lives on your desktop (Electron app)
```

### Features

| Feature | Status |
|---------|--------|
| Clippy mascot on desktop | ✅ |
| Content category detection | ✅ |
| Hebrew + English keywords | ✅ |
| Browsing history analysis | ✅ |
| Live feed analysis (Twitter, YouTube, etc.) | ✅ |
| Stats popup with 4 tabs | ✅ |
| Drag to reposition Clippy | ✅ |

---

## Install

### Browser Extension (Chrome / Edge)

1. Clone this repo
2. Run `npm install && npm run build`
3. Open `chrome://extensions` → Developer mode → Load unpacked
4. Select the `extension/` folder
5. Visit Twitter, YouTube, Instagram — Clippy appears!

### Desktop App (Windows)

```bash
npm install
npm run desktop
```

Or double-click `הפעל קליפי.bat` on your desktop.

---

## How It Works

```
You scroll Twitter
    ↓
Content script reads tweet text
    ↓
Brain classifies: "politics", "sports", "technology"...
    ↓
Clippy speaks: "You're seeing this because 38% of your feed is politics"
    ↓
Stats saved to chrome.storage + browsing history analyzed
    ↓
Popup shows full breakdown: categories, top domains, hourly patterns, insights
```

---

## 🗺️ Roadmap / Call for Contributions

This is v1. The vision is much bigger. Here's where the community can take it:

### 🔍 Algorithm Reverse Engineering
- Detect **promoted content** vs organic
- Identify when a post has been **suppressed** (visible 2 hours ago, gone now)
- Track **virality patterns** — why did this go viral?

### 🤝 Talk Back to the Algorithm
- A "**report card**" you send to platforms: *"My feed was 70% ads this week"*
- Browser extension that **logs anomalies** to a public, anonymized dataset
- Community dashboard showing **collective algorithm patterns**

### 🧠 Smarter Brain
- Replace keyword matching with a small local LLM
- Learn from explicit feedback: 👍 "This is accurate" / 👎 "You got this wrong"
- Cross-reference with [Media Bias / Fact Check](https://mediabiasfactcheck.com/)

### 🎭 More Personalities
- Replace Clippy with other agents (Merlin, Peedy, Bonzi)
- Build a fully custom Hebrew mascot
- Make the agent's personality match its findings (worried when seeing lots of news, excited when seeing sports)

### 🌐 Multi-language Support
- Arabic, French, Spanish keyword libraries
- RTL layout improvements

### 📊 Export & Share
- Export your weekly "algorithm report" as PDF
- Share anonymized stats to a community feed
- API for researchers studying social media consumption

---

## Philosophy

The algorithm knows everything about you.  
It knows when you're sad, when you're bored, when you're angry.  
It uses that knowledge to keep you scrolling.

This project flips the script:  
**You** get to know what the algorithm knows about you.  
And maybe — just maybe — that knowledge changes how you use it.

*The algorithm repented. Now it's your turn to decide what to do with the truth.*

---

## Contributing

PRs welcome. Issues welcome. Wild ideas especially welcome.

If you build something with this — tell us. Open an issue, share a screenshot, write a blog post.

This project grows when people see it and think: *"I could add ___."*

---

## License

MIT — do whatever you want with this, just give credit.

---

*Built with ❤️ and a healthy distrust of recommendation engines.*
