# Analytics Dashboard

## גרפים מוצעים לפופ-אפ

### 1. Category Distribution (Pie/Donut)
```
allTime counts → pie chart
מוצג בלשונית "קטגוריות"
```

### 2. Hourly Activity (Bar Chart)
```
analytics.countBy('post.seen', 'hour', 7days)
→ bar chart 0-23
מוצג בלשונית "היסטוריה"
```

### 3. Weekly Trend (Line Chart)
```
sessions per day × 7 days
→ line chart
מוצג בלשונית "היסטוריה"
```

### 4. Weight Evolution (Radar)
```
weights per category
→ radar chart
מוצג בלשונית "תובנות"
```

---

## כלי ויזואליזציה מוצעים

| ספרייה | גודל | מורכבות | המלצה |
|--------|------|---------|-------|
| Chart.js | ~200KB | קלה | ✅ מומלץ |
| D3.js | ~500KB | גבוהה | למשתמש מתקדם |
| Recharts | ~300KB | בינונית | אם React |
| Vanilla Canvas | 0KB | בינונית | לאורזים |

---

## קוד דוגמה — Chart.js ב-popup.html

```html
<canvas id="categoryChart"></canvas>
<script src="chart.min.js"></script>
<script>
const stats = await api.getStats()
const labels = Object.keys(stats.allTime).map(k => stats.categories[k]?.heLabel ?? k)
const data   = Object.values(stats.allTime)
const colors = Object.keys(stats.allTime).map(k => stats.categories[k]?.color ?? '#999')

new Chart(document.getElementById('categoryChart'), {
  type: 'doughnut',
  data: { labels, datasets: [{ data, backgroundColor: colors }] }
})
</script>
```
