async function askJunius() {
  console.log("🟢 askJunius was called");

  const question = document.getElementById('question').value;
  const age = document.getElementById('age').value;
  const chatBox = document.getElementById('chat-box');

  if (!question || !age) {
    alert("Please enter your age and a question.");
    return;
  }

  chatBox.innerHTML += `<div><strong>You:</strong> ${question}</div>`;

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, age })
    });

    console.log('Fetch response:', res);

    if (!res.ok) {
      chatBox.innerHTML += `<div><strong>Junius:</strong> 🚨 Server returned status ${res.status}</div>`;
      return;
    }

    const data = await res.json();
    console.log('Parsed data:', data);

    if (data.response) {
      chatBox.innerHTML += `<div><strong>Junius:</strong> ${data.response}</div>`;
    } else {
      chatBox.innerHTML += `<div><strong>Junius:</strong> Hmm... I couldn't find an answer to that.</div>`;
    }
  } catch (error) {
    console.error('Full error:', error);
    chatBox.innerHTML += `<div><strong>Junius:</strong> 🚨 ${error.message}</div>`;
  }

  document.getElementById('question').value = '';
  chatBox.scrollTop = chatBox.scrollHeight;
}

window.askJunius = askJunius;