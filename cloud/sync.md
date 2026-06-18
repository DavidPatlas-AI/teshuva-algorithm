# Cloud Sync — סנכרון ענן

> **זמין בגרסת Pro בלבד.**  
> בגרסה חינמית ופרימיום — כל הנתונים נשארים מקומיים.

---

## מה נסנכרן

| נתון | מסונכרן? | הערה |
|------|----------|------|
| allTime counts | ✅ | merge: max per category |
| weights | ✅ | merge: average |
| preferences | ✅ | merge: last-write-wins |
| shortTerm memory | ❌ | לא — private context |
| license key | ✅ | encrypted |
| browsing history (raw) | ❌ | לעולם לא |

---

## אבטחה

- **E2E Encryption**: AES-256-GCM, המפתח נגזר מסיסמת המשתמש
- **Zero-knowledge**: השרת לא יכול לקרוא את הנתונים
- **Device ID**: כל מכשיר מקבל UUID רנדומלי (לא ניתן לשיוך)
- **Opt-in**: הסנכרון מופעל רק אחרי אישור מפורש

---

## מניעת קונפליקטים

כל entity מכיל `updatedAt` timestamp:

```js
// merge strategy
{
  allTime: mergeMax(local.allTime, remote.allTime),
  weights: mergeAvg(local.weights, remote.weights),
  preferences: lastWriteWins(local.preferences, remote.preferences),
}
```

`mergeMax`: לוקח את הערך הגדול ביותר לכל קטגוריה (שומר על ההיסטוריה).  
`mergeAvg`: ממוצע בין המשקלים — מונע drift קיצוני.

---

## תדירות סנכרון

- On startup: pull from cloud
- כל 30 דקות: push diff
- On close: final push
- On-demand: כפתור "סנכרן עכשיו" בהגדרות
