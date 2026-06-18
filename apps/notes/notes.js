/**
 * apps/notes/notes.js — Floating notes app
 */

export function createNotesApp(windowManager, fs) {
  return {
    open() {
      const content = document.createElement('div')
      content.style.cssText = 'display:flex;flex-direction:column;height:100%;gap:.5rem'

      const textarea = document.createElement('textarea')
      textarea.style.cssText = `
        flex:1; border:1px solid #e2e8f0; border-radius:6px; padding:.5rem;
        font-family:Segoe UI,sans-serif; font-size:.9rem; resize:none;
        direction:rtl; text-align:right; color:#1e293b; background:#f8fafc;
      `
      textarea.placeholder = 'כתוב כאן...'

      const saveBtn = document.createElement('button')
      saveBtn.textContent = '💾 שמור'
      saveBtn.style.cssText = `
        background:#6366f1;color:white;border:none;border-radius:6px;
        padding:.5rem 1rem;cursor:pointer;font-weight:700;font-size:.9rem;
      `

      content.appendChild(textarea)
      content.appendChild(saveBtn)

      // Load existing note
      fs.read('notes/main.txt').then(text => {
        if (text) textarea.value = text
      })

      saveBtn.addEventListener('click', async () => {
        await fs.write('notes/main.txt', textarea.value)
        saveBtn.textContent = '✅ נשמר!'
        setTimeout(() => { saveBtn.textContent = '💾 שמור' }, 1500)
      })

      windowManager.open({ id: 'notes', title: '📝 פתקים', content, width: 360, height: 320 })
    },
  }
}
