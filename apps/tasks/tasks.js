/**
 * apps/tasks/tasks.js — Task manager app
 */

export function createTasksApp(windowManager, taskManager) {
  return {
    open() {
      const content = document.createElement('div')

      function render() {
        const items = taskManager.getAll()
        const due   = taskManager.getDue(24 * 60 * 60_000)
        content.innerHTML = `
          <div style="font-size:.85rem;color:#64748b;margin-bottom:.5rem">
            ${due.length ? `⚠️ ${due.length} משימות עד מחר` : ''}
          </div>
          <div style="display:flex;gap:.5rem;margin-bottom:.8rem">
            <input id="task-input" type="text" placeholder="משימה חדשה..."
              style="flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:.4rem .7rem;
                     font-size:.9rem;direction:rtl" />
            <button id="task-add"
              style="background:#6366f1;color:white;border:none;border-radius:6px;
                     padding:.4rem .8rem;cursor:pointer;font-weight:700">+</button>
          </div>
          <ul style="list-style:none;margin:0;padding:0">
            ${items.map(t => `
              <li data-id="${t.id}" style="display:flex;align-items:center;gap:.5rem;
                  padding:.4rem .3rem;border-bottom:1px solid #f1f5f9;font-size:.9rem">
                <input type="checkbox" class="task-done" data-id="${t.id}" ${t.done ? 'checked' : ''}>
                <span style="${t.done ? 'text-decoration:line-through;color:#94a3b8' : ''}">${t.title}</span>
              </li>
            `).join('')}
          </ul>
        `

        content.querySelector('#task-add')?.addEventListener('click', () => {
          const input = content.querySelector('#task-input')
          if (input.value.trim()) {
            taskManager.add(input.value.trim())
            taskManager.save()
            input.value = ''
            render()
          }
        })

        content.querySelectorAll('.task-done').forEach(cb => {
          cb.addEventListener('change', () => {
            taskManager.complete(cb.dataset.id)
            taskManager.save()
            render()
          })
        })
      }

      render()
      windowManager.open({ id: 'tasks', title: '✅ משימות', content, width: 340, height: 360 })
    },
  }
}
