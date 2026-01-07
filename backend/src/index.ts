import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import fetch from 'node-fetch'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { MedicalTask } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(cors());
app.use(express.json());

let tasks: MedicalTask[] = [];
try {
  const dataPath = join(__dirname, '../../medical-tasks.json');
  const data = readFileSync(dataPath, 'utf-8');
  tasks = JSON.parse(data);
  console.log(`✅ ${tasks.length} tâches médicales chargées`);
} catch (error) {
  console.error('❌ Erreur lors du chargement des données:', error);
}

app.get('/api/tasks', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 150;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedTasks = tasks.slice(startIndex, endIndex);

  res.json({
    tasks: paginatedTasks,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(tasks.length / limit),
      totalTasks: tasks.length,
      tasksPerPage: limit,
      hasNextPage: endIndex < tasks.length,
      hasPreviousPage: page > 1,
    }
  });
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }
  res.json(task);
});

app.get('/api/tasks/filter/:field/:value', (req, res) => {
  const { field, value } = req.params;
  const filteredTasks = tasks.filter(task => {
    const taskValue = task[field as keyof MedicalTask];
    return String(taskValue).toLowerCase() === value.toLowerCase();
  });
  res.json(filteredTasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask: MedicalTask = {
    ...req.body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }
  tasks[index] = {
    ...tasks[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString(),
  };
  res.json(tasks[index]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }
  const deletedTask = tasks.splice(index, 1)[0];
  res.json(deletedTask);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', tasks: tasks.length });
});

app.post('/api/ai/summarize', async (req, res) => {
  const text = req.body?.text;
  if (!text) return res.status(400).json({ error: 'Missing text in body' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(501).json({ error: 'AI service not configured on server (OPENAI_API_KEY missing)' });
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: "Tu es un assistant utile qui résume en français le contenu médical de manière concise (1-2 phrases). Ne pas inventer d'informations." },
          { role: 'user', content: `Fais un résumé court de ce texte : ${text}` }
        ],
        temperature: 0.2,
        max_tokens: 150,
      })
    })

    if (!resp.ok) {
      const txt = await resp.text()
      return res.status(500).json({ error: 'AI provider error', detail: txt })
    }

    const body = await resp.json()
    const summary = body?.choices?.[0]?.message?.content ?? null
    return res.json({ summary })
  } catch (err) {
    console.error('AI summarize error', err)
    return res.status(500).json({ error: 'Internal error calling AI provider' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}/api/tasks`);
});
