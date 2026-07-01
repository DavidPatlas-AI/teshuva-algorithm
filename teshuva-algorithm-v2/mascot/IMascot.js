// ממשק המסכה — כל מסכה חייבת לממש את ה-API הזה

/**
 * @typedef {Object} IMascot
 * @property {() => Promise<void>} init         — טען את המסכה ל-DOM
 * @property {(text: string) => void} say       — הצג בועת טקסט
 * @property {(name: string) => void} animate   — הפעל אנימציה
 * @property {() => void} show                  — הצג את המסכה
 * @property {() => void} hide                  — הסתר את המסכה
 * @property {(cb: Function) => void} onClick   — רישום callback לקליק
 */

// פונקציה לוודא שמסכה ממשת את הממשק
export function validateMascot(mascot) {
  const required = ['init', 'say', 'animate', 'show', 'hide', 'onClick']
  for (const method of required) {
    if (typeof mascot[method] !== 'function') {
      throw new Error(`IMascot: missing method "${method}"`)
    }
  }
  return mascot
}
