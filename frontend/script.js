// ------- Junius local‑storage + theme helpers --------
const chatBox        = document.getElementById('chat-box');
const chatHistoryKey = 'junius_chat_history';
const themeKey       = 'junius_theme';
let history          = JSON.parse(localStorage.getItem(chatHistoryKey) || '[]');
// keeps track of which theme is active so we can call its cleanup
let currentTheme = null;

// ------- Session management --------
const sessionsKey = 'junius_chat_sessions';
let sessions      = JSON.parse(localStorage.getItem(sessionsKey) || '[]');

// helper: escape HTML for code blocks
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function saveHistory() {
  localStorage.setItem(chatHistoryKey, JSON.stringify(history));
}

function renderHistory() {
  chatBox.innerHTML = '';
  history.forEach(snippet => (chatBox.innerHTML += snippet));
  chatBox.scrollTop = chatBox.scrollHeight;
}

function applyTheme(theme) {
  // cleanup previous animated scene if it has a destroy method
  if (currentTheme && window.themeHandlers?.[currentTheme]?.destroy) {
    window.themeHandlers[currentTheme].destroy();
  }
  // remove previous theme classes & canvases
  document.body.classList.remove('space','jungle','ocean','desert','city','candy','default');
  ['space-bg-canvas','ocean-bg-canvas','jungle-bg-canvas','desert-bg-canvas','city-bg-canvas','candy-bg-canvas']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

  if (theme !== 'default') document.body.classList.add(theme);
  if (window.themeHandlers?.[theme]) window.themeHandlers[theme]();
  localStorage.setItem(themeKey, theme);

  const sel = document.getElementById('theme-select');
  if (sel) sel.value = theme;
  currentTheme = theme;
}

async function askJunius() {
  const question = document.getElementById('question').value;
  const age = document.getElementById('age').value;
  if (!question || !age) {
    alert("Please enter your age and a question.");
    return;
  }

  const youSnippet = `<div><strong>You:</strong> ${question}</div>`;
  chatBox.innerHTML += youSnippet;
  history.push(youSnippet);
  saveHistory();

  try {
    const endpoint = window.location.hostname === 'localhost'
      ? 'http://localhost:5050/api/ask'
      : '/api/ask';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, age })
    });

    if (!res.ok) {
      const botSnippet = `<div><strong>Junius:</strong> 🚨 Server returned status ${res.status}</div>`;
      chatBox.innerHTML += botSnippet;
      history.push(botSnippet);
      saveHistory();
      return;
    }

    const data = await res.json();
    if (data.response) {
      // Determine if the response should be treated as code
      const isCode = data.response.trim().startsWith('```') || data.response.includes('\n');
      let botSnippet;
      if (isCode) {
        botSnippet = `
          <div data-speaker="Junius"><strong>Junius:</strong></div>
          <button class="toggle-code">Hide code</button>
          <div class="collapsible open">
            <div class="code-wrapper">
              <button class="copy-btn" title="Copy code">📋 Copy</button>
              <pre><code class="language-javascript">${escapeHtml(data.response)}</code></pre>
            </div>
          </div>
        `;
      } else {
        botSnippet = `<div data-speaker="Junius"><strong>Junius:</strong> ${escapeHtml(data.response)}</div>`;
      }
      chatBox.innerHTML += botSnippet;
      history.push(botSnippet);
      saveHistory();
    } else {
      const botSnippet = `<div data-speaker="Junius"><strong>Junius:</strong> Hmm... I couldn't find an answer to that.</div>`;
      chatBox.innerHTML += botSnippet;
      history.push(botSnippet);
      saveHistory();
    }
  } catch (error) {
    console.error(error);
    const botSnippet = `<div data-speaker="Junius"><strong>Junius:</strong> 🚨 ${escapeHtml(error.message)}</div>`;
    chatBox.innerHTML += botSnippet;
    history.push(botSnippet);
    saveHistory();
  }

  document.getElementById('question').value = '';
  chatBox.scrollTop = chatBox.scrollHeight;
}

window.askJunius = askJunius;

// ------- Restore history + theme on load --------
window.addEventListener('DOMContentLoaded', () => {
  renderHistory();
  applyTheme(localStorage.getItem(themeKey) || 'default');

  // Theme selector
  const sel = document.getElementById('theme-select');
  if (sel) sel.addEventListener('change', e => applyTheme(e.target.value));

  // New Chat button
  const newChatBtn = document.getElementById('new-chat-btn');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      if (history.length) {
        sessions.push({
          id:      Date.now(),
          created: new Date().toISOString(),
          messages: [...history]
        });
        localStorage.setItem(sessionsKey, JSON.stringify(sessions));
      }
      history = [];
      saveHistory();
      renderHistory();
    });
  }

  // Saved Chats toggle
  const toggleSavedBtn = document.getElementById('toggle-saved-btn');
  const sidebar        = document.getElementById('saved-sidebar');
  if (toggleSavedBtn && sidebar) {
    toggleSavedBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      if (isOpen) renderSessionList();
    });
  }

  // Session list & search
  const searchInput = document.getElementById('session-search');
  const listEl      = document.getElementById('session-list');
  const msgEl       = document.getElementById('session-messages');

  function renderSessionList() {
    if (!listEl) return;
    listEl.innerHTML = '';
    sessions.forEach(s => {
      const li = document.createElement('li');
      li.textContent = new Date(s.created).toLocaleString();
      li.addEventListener('click', () => {
        if (msgEl) msgEl.innerHTML = s.messages.join('');
        if (sidebar) sidebar.classList.add('open');
      });
      listEl.appendChild(li);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      if (!listEl) return;
      listEl.querySelectorAll('li').forEach(li => {
        li.style.display = li.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  }

  // — Copy code button handler
  document.addEventListener('click', e => {
    if (e.target.matches('.copy-btn')) {
      const codeEl = e.target.nextElementSibling.querySelector('code');
      navigator.clipboard.writeText(codeEl.textContent);
      const original = e.target.textContent;
      e.target.textContent = '✅ Copied!';
      setTimeout(() => { e.target.textContent = original; }, 1500);
    }
  });

  // — Toggle code block visibility
  document.addEventListener('click', e => {
    if (e.target.matches('.toggle-code')) {
      const coll = e.target.nextElementSibling;
      coll.classList.toggle('open');
      e.target.textContent = coll.classList.contains('open') ? 'Hide code' : 'Show code';
    }
  });
});