// Example custom mascot skin
// Implements IMascot interface — replace the body with your mascot logic

export function createExampleSkin() {
  let clickCallbacks = []
  let el = null

  return {
    async init() {
      el = document.createElement('div')
      el.style.cssText = 'position:fixed;bottom:20px;right:20px;width:80px;height:80px;cursor:pointer;z-index:99999'
      el.textContent = '🤖'  // Replace with your mascot element
      el.style.fontSize = '60px'
      el.addEventListener('click', () => clickCallbacks.forEach(cb => cb()))
      document.body.appendChild(el)
    },

    say(text) {
      // Show speech bubble with text
      const bubble = document.createElement('div')
      bubble.style.cssText = `
        position:fixed;bottom:110px;right:20px;
        background:white;border:2px solid #333;border-radius:8px;
        padding:10px;max-width:200px;font-size:14px;z-index:99999;
        direction:rtl;text-align:right;
      `
      bubble.textContent = text
      document.body.appendChild(bubble)
      setTimeout(() => bubble.remove(), 5000)
    },

    animate(name) {
      // Trigger animation by name
      // For this example, just wiggle the emoji
      if (!el) return
      el.style.transform = 'rotate(10deg)'
      setTimeout(() => { if (el) el.style.transform = '' }, 200)
    },

    show() { if (el) el.style.display = '' },
    hide() { if (el) el.style.display = 'none' },

    onClick(cb) { clickCallbacks.push(cb) },
  }
}
