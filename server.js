import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import { deployBot } from './deployEngine.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sert les fichiers HTML/CSS/JS
app.use(express.static('public'));

// API POST pour déploiement avec logs temps réel
app.post('/api/deploy', async (req, res) => {
  res.set({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  const sendLog = (message) => res.write(message);

  try {
    const data = req.body;
    sendLog('🚀 Déploiement démarré...\n');
    await deployBot({
      ...data,
      onLog: sendLog
    });
    sendLog('✅ Déploiement terminé.\n');
    res.end();
  } catch (err) {
    console.error(err);
    sendLog(`❌ Erreur: ${err.message}\n`);
    res.end();
  }
});

// Fallback pour SPA ou HTML direct
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
});
