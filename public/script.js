document.getElementById('deployForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    GITHUB_USERNAME: form.GITHUB_USERNAME.value,
    SESSION_ID: form.SESSION_ID.value,
    OWNER_NAME: form.OWNER_NAME.value,
    OWNER_NUMBER: form.OWNER_NUMBER.value
  };

  document.getElementById('status').textContent = '⏳ Déploiement en cours...';

  try {
    const res = await fetch('http://localhost:3001/api/deploy', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    document.getElementById('status').textContent = result.message || result.error;
  } catch (err) {
    document.getElementById('status').textContent = '❌ Erreur lors du déploiement';
  }
});
