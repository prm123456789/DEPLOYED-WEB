import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { deployBot } from './deployEngine.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
});
