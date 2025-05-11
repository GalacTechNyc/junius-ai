// ------- Junius local‑storage + theme helpers --------
const chatBox        = document.getElementById('chat-box');
const chatHistoryKey = 'junius_chat_history';
const themeKey       = 'junius_theme';
let   history        = JSON.parse(localStorage.getItem(chatHistoryKey) || '[]');
// keeps track of which theme is active so we can call its cleanup
let currentTheme = null;
// ------- Session management --------
const sessionsKey = 'junius_chat_sessions';
let sessions      = JSON.parse(localStorage.getItem(sessionsKey) || '[]');

function saveHistory() {
  localStorage.setItem(chatHistoryKey, JSON.stringify(history));
}

function renderHistory() {
  chatBox.innerHTML = '';
  history.forEach(snippet => (chatBox.innerHTML += snippet));
  chatBox.scrollTop = chatBox.scrollHeight;
}

function applyTheme(theme) {
  // -- cleanup previous animated scene if it has a destroy method
  if (currentTheme && window.themeHandlers?.[currentTheme]?.destroy) {
    window.themeHandlers[currentTheme].destroy();
  }
  // remove previous
  document.body.classList.remove('space','jungle','ocean','desert','city','candy','default');
  ['space-bg-canvas','ocean-bg-canvas','jungle-bg-canvas','desert-bg-canvas','city-bg-canvas','candy-bg-canvas'].forEach(id=>{
    const el=document.getElementById(id);
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
  console.log("🟢 askJunius was called");

  const question = document.getElementById('question').value;
  const age = document.getElementById('age').value;

  if (!question || !age) {
    alert("Please enter your age and a question.");
    return;
  }

  const youSnippet = `<div><strong>You:</strong> ${question}</div>`;
  chatBox.innerHTML += youSnippet;
  history.push(youSnippet); saveHistory();

  try {
    // Use localhost endpoint in dev, relative path in prod (Vercel)
    const endpoint =
      window.location.hostname === 'localhost'
        ? 'http://localhost:5050/api/ask'
        : '/api/ask';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, age })
    });

    console.log('Fetch response:', res);

    if (!res.ok) {
      const botSnippet = `<div><strong>Junius:</strong> 🚨 Server returned status ${res.status}</div>`;
      chatBox.innerHTML += botSnippet;
      history.push(botSnippet); saveHistory();
      return;
    }

    const data = await res.json();
    console.log('Parsed data:', data);

    if (data.response) {
      const botSnippet = `<div><strong>Junius:</strong> ${data.response}</div>`;
      chatBox.innerHTML += botSnippet;
      history.push(botSnippet); saveHistory();
    } else {
      const botSnippet = `<div><strong>Junius:</strong> Hmm... I couldn't find an answer to that.</div>`;
      chatBox.innerHTML += botSnippet;
      history.push(botSnippet); saveHistory();
    }
  } catch (error) {
    console.error('Full error:', error);
    const botSnippet = `<div><strong>Junius:</strong> 🚨 ${error.message}</div>`;
    chatBox.innerHTML += botSnippet;
    history.push(botSnippet); saveHistory();
  }

  document.getElementById('question').value = '';
  chatBox.scrollTop = chatBox.scrollHeight;
}

window.askJunius = askJunius;
// ------- Restore history + theme on load --------
window.addEventListener('DOMContentLoaded', () => {
  renderHistory();
  applyTheme(localStorage.getItem(themeKey) || 'default');

  const sel = document.getElementById('theme-select');
  if (sel) sel.addEventListener('change', e => applyTheme(e.target.value));

  // — New Chat button: clear conversation and history
  const newChatBtn = document.getElementById('new-chat-btn');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      // Save current session if any messages exist
      if (history.length) {
        sessions.push({
          id:      Date.now(),
          created: new Date().toISOString(),
          messages: [...history]
        });
        localStorage.setItem(sessionsKey, JSON.stringify(sessions));
      }
      // Start fresh chat
      history = [];
      saveHistory();
      renderHistory();
    });
  }

  // — Saved Chats toggle sidebar
  const toggleSavedBtn = document.getElementById('toggle-saved-btn');
  const sidebar        = document.getElementById('saved-sidebar');
  if (toggleSavedBtn && sidebar) {
    toggleSavedBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      if (isOpen) {
        renderSessionList();
      }
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

  // Filter sessions
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      if (!listEl) return;
      listEl.querySelectorAll('li').forEach(li => {
        li.style.display = li.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  }
});