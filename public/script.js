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

  const evtSource = new EventSource('/api/deploy');
  evtSource.onmessage = (event) => {
    statusEl.textContent += `${event.data}\n`;
    statusEl.scrollTop = statusEl.scrollHeight;
  };

  fetch('/api/deploy', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(() => {
    evtSource.close();
  }).catch((err) => {
    statusEl.textContent += `❌ Erreur: ${err.message}\n`;
    evtSource.close();
  });
});
