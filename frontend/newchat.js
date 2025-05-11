

(function () {
  const NEW_CHAT_BTN_ID = 'new-chat-btn';
  const CHAT_BOX_ID    = 'chat-box';
  const HISTORY_KEY     = 'junius_chat_history';

  function clearChat() {
    const chatBox = document.getElementById(CHAT_BOX_ID);
    if (chatBox) {
      chatBox.innerHTML = '';
      // Scroll to top after clearing
      chatBox.scrollTop = 0;
    }
    localStorage.removeItem(HISTORY_KEY);
    // If a global history array exists, reset it
    if (typeof window.history === "object" && Array.isArray(window.history)) {
      window.history.length = 0;
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById(NEW_CHAT_BTN_ID);
    if (!btn) return;
    btn.addEventListener('click', () => {
      clearChat();
      // optional toast
      console.log('🆕 New chat started');
    });
  });
})();