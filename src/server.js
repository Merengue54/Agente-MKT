import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v4 as uuidv4 } from 'uuid';
import { generateInstitutionalContent } from './contentGenerator.js';
import { getHistory, saveHistoryEntry } from './historyRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/content', express.static(path.resolve(__dirname, '../public')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Murialdo Content Studio' });
});

app.get('/api/history', async (_req, res, next) => {
  try {
    const history = await getHistory();
    res.json({ items: history });
  } catch (error) {
    next(error);
  }
});

app.post('/api/content/generate', async (req, res, next) => {
  try {
    const { schoolName, audience, objective, tone, channels, additionalContext } = req.body;

    if (!schoolName || !audience || !objective || !tone || !Array.isArray(channels) || channels.length === 0) {
      return res.status(400).json({
        error: 'Campos obrigatórios: schoolName, audience, objective, tone e channels (array).'
      });
    }

    const payload = {
      schoolName,
      audience,
      objective,
      tone,
      channels,
      additionalContext
    };

    const generated = await generateInstitutionalContent(payload);

    const entry = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      input: payload,
      output: generated
    };

    await saveHistoryEntry(entry);

    return res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno ao processar a solicitação.' });
});

app.listen(port, () => {
  console.log(`Murialdo Content Studio rodando em http://localhost:${port}/content`);
});
