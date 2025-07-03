document.getElementById('deployForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    GITHUB_USERNAME: form.GITHUB_USERNAME.value,
    SESSION_ID: form.SESSION_ID.value,
    OWNER_NAME: form.OWNER_NAME.value,
    OWNER_NUMBER: form.OWNER_NUMBER.value
  };

  const statusEl = document.getElementById('status');
  statusEl.textContent = '⏳ Déploiement en cours...\n';

  fetch('/api/deploy', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(response => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const read = () => {
      reader.read().then(({ done, value }) => {
        if (done) return;
        const text = decoder.decode(value);
        statusEl.textContent += text;
        statusEl.scrollTop = statusEl.scrollHeight;
        read();
      });
    };
    read();
  }).catch((err) => {
    statusEl.textContent += `❌ Erreur: ${err.message}\n`;
  });
});
