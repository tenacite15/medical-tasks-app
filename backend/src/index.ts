import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { MedicalTask } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}/api/tasks`);
});
