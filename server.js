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

// 👉 Sert les fichiers HTML/CSS/JS
app.use(express.static('public'));

// API POST pour déploiement
app.post('/api/deploy', async (req, res) => {
  try {
    const data = req.body;
    await deployBot(data);
    res.status(200).send({ message: '✅ Déploiement lancé avec succès !' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Erreur pendant le déploiement', details: err.message });
  }
});

// 👉 Route fallback pour SPA ou HTML direct
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
});
