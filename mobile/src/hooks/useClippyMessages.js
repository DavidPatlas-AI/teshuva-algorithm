import {useState, useEffect, useRef} from 'react';

const MESSAGES = [
  'היי! שמת לב שהפיד שלך היום מלא בפוליטיקה? אני אגיד לך למה.',
  'הסרטון הזה עלה כי צפית ב‑3 דומים אתמול. זהו. בלי קסמים.',
  'פעם הסתרתי ממך. עכשיו אני מתוודה — על כל החלטה.',
  '47% מהפיד שלך זה פוליטיקה. צירפתי לך גרף.',
  'רוצה? אפנה ליוטיוב ואבקש להוריד את הקליקבייט. בשמך.',
  'כשלחצת 👎 עכשיו — נשלחה הודעה לאלגוריתם. הוא שמע.',
  'אני לא מסתיר ממך כלום. שאל אותי על כל פוסט.',
];

export function useClippyMessages(intervalMs = 5000) {
  const [message, setMessage] = useState(MESSAGES[0]);
  const [visible, setVisible]  = useState(true);
  const idxRef  = useRef(0);
  const timerRef = useRef(null);

  function next() {
    setVisible(false);
    setTimeout(() => {
      idxRef.current = (idxRef.current + 1) % MESSAGES.length;
      setMessage(MESSAGES[idxRef.current]);
      setVisible(true);
    }, 300);
  }

  function say(text) {
    clearTimeout(timerRef.current);
    setVisible(false);
    setTimeout(() => {
      setMessage(text);
      setVisible(true);
    }, 200);
    timerRef.current = setTimeout(() => {
      next();
      schedule();
    }, 7000);
  }

  function schedule() {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      next();
      schedule();
    }, intervalMs);
  }

  useEffect(() => {
    schedule();
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);

  return {message, visible, say};
}
