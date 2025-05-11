// frontend/savedchats.js
(function() {
  const TOGGLE_BTN = document.getElementById('toggle-saved-btn');
  const SIDEBAR    = document.getElementById('saved-sidebar');
  const CONTENT    = document.getElementById('saved-content');
  const HISTORY_KEY= 'junius_chat_history';

  function renderSaved() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    CONTENT.innerHTML = history.length
      ? history.join('')
      : '<p>No messages saved yet.</p>';
    SIDEBAR.scrollTop = 0;
  }

  TOGGLE_BTN.addEventListener('click', () => {
    const isOpen = SIDEBAR.classList.toggle('open');
    if (isOpen) renderSaved();
  });
})();