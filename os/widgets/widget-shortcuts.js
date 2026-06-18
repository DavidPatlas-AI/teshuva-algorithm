export function createShortcutsWidget(container, shortcuts = []) {
  const defaultShortcuts = [
    { label: 'Twitter',   url: 'https://twitter.com',   icon: '🐦' },
    { label: 'YouTube',   url: 'https://youtube.com',   icon: '▶️' },
    { label: 'Instagram', url: 'https://instagram.com', icon: '📸' },
    { label: 'TikTok',   url: 'https://tiktok.com',    icon: '🎵' },
    ...shortcuts,
  ]

  const el = document.createElement('div')
  el.style.cssText = `
    background:white; border-radius:10px; padding:.8rem 1rem;
    border:1px solid #e2e8f0; box-shadow:0 2px 12px rgba(0,0,0,.06);
    font-family:Segoe UI,sans-serif; direction:rtl;
  `

  el.innerHTML = `
    <div style="font-weight:800;color:#312e81;margin-bottom:.6rem">⚡ קיצורים</div>
    <div style="display:flex;flex-wrap:wrap;gap:.4rem">
      ${defaultShortcuts.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener"
           style="display:inline-flex;align-items:center;gap:.3rem;
                  padding:.35rem .7rem;border-radius:99px;background:#f1f5f9;
                  color:#312e81;text-decoration:none;font-size:.82rem;font-weight:600">
          ${s.icon} ${s.label}
        </a>
      `).join('')}
    </div>
  `

  container.appendChild(el)
  return { el }
}
