# medical-tasks-app

Application full-stack de gestion des tâches médicales
 
## A propos

Ce dépôt contient une application full‑stack simple destinée à gérer des tâches médicales. L'objectif est de fournir :
- Une interface front moderne (React + TypeScript + Vite) pour visualiser, filtrer et modifier les tâches.
- Une API backend (Node.js) exposant les endpoints CRUD et la pagination.

Le frontend et le backend sont séparés dans deux dossiers `frontend/` et `backend/`.

## Routes et API

Le frontend appelle l'API exposée par le backend sur `http://localhost:3000/api` (valeur par défaut dans le code). Les principaux endpoints utilisés sont :

- GET /api/tasks?page={n}&limit={m}
	- Renvoie une page de tâches avec métadonnées de pagination.
- GET /api/tasks/{id}
	- Renvoie une tâche.
- POST /api/tasks
	- Crée une nouvelle tâche. Le frontend envoie un objet task (voir "Modèle de données").
- PUT /api/tasks/{id}
	- Met à jour une tâche existante.
- DELETE /api/tasks/{id}
	- Supprime une tâche.

## Modèle de données (résumé)

Type `MedicalTask` (présent dans `frontend/src/types/medical-task.ts`) :
- id: string
- title: string
- description: string
- patient: { id, firstName, lastName, dateOfBirth, roomNumber }
- assignedTo: { id, name, role }
- priority: "low" | "medium" | "high"
- status: "pending" | "in_progress" | "completed" | "cancelled"
- category: string
- dueDate, createdAt, updatedAt: string (ISO)

## Frontend — pages et composants principaux

- Page principale (/) :
	- Tableau interactif avec tri, filtrage, virtualisation (pour listes longues).
	- Barre de recherche (filtre global sur titre, patient, assigné, description, catégorie, priorité, status).
	- Pagination (contrôlée par le backend).
	- Composant d'édition d'une tâche (modal).

- Page Statistiques (/statistics) :
	- Vue récapitulative des priorités, status et nombre de tâches en retard.

- Fonctionnalité IA (local) :
 - Fonctionnalité IA :
	 - IA locale (heuristique) :
		 - `IA: Créer tâche` (bouton dans l'entête) ouvre une modale qui permet de coller du texte en langage naturel.
		 - Extraction heuristique côté frontend (`frontend/src/components/ai-task-creator.tsx`) pour priorité, date et nom du patient ; crée la tâche via l'endpoint POST `/api/tasks`.
	 - IA serveur (résumé via OpenAI) :
		 - Endpoint backend ajouté : `POST /api/ai/summarize` (implémenté dans `backend/src/index.ts`).
		 - Le frontend appelle ce endpoint depuis `frontend/src/services/api.ts` via `api.aiSummarize(text)`.
		 - UI : bouton "Résumé IA" dans la modale d'édition (`TaskEditForm`) qui génère un court résumé (1-2 phrases) de la description et propose d'insérer le résumé dans le champ Notes.
		 - Ce flux utilise l'API OpenAI côté serveur : il nécessite la variable d'environnement `OPENAI_API_KEY` dans le dossier `backend/` (fichier `.env` ou variable d'environnement de déploiement).
		 - Si `OPENAI_API_KEY` est absent, le backend renvoie une erreur 501 indiquant que le service IA n'est pas configuré.

	 - Où regarder le code :
		 - Frontend : `frontend/src/components/ai-task-creator.tsx` (création heuristique), `frontend/src/components/task-edit-form.tsx` (bouton Résumé IA), `frontend/src/services/api.ts` (méthode `aiSummarize`).
		 - Backend : `backend/src/index.ts` (endpoint `/api/ai/summarize`, utilise `node-fetch` et `dotenv`).

## Scripts et démarrage

Frontend :

```bash
cd frontend
npm install
npm run dev
```

Backend :

```bash
cd backend
npm install
npm run dev
```

Lancer les deux parties (backend puis frontend). Le frontend fait des appels à `http://localhost:3000/api` par défaut ; adapte l'URL si nécessaire dans `frontend/src/services/api.ts`.

## Développement & notes techniques

- Le frontend utilise : React 19, Vite, TypeScript, Tailwind CSS et @tanstack/react-table pour le tableau.
- Le tableau est virtualisé pour gérer de grandes listes tout en restant performant.
- Le composant `Statistics` calcule : répartition par priorité, répartition par status, nombre de tâches en retard (dueDate < now et status != completed).
- L'IA locale est implémentée dans `frontend/src/components/ai-task-creator.tsx`.

## Tests rapides / vérifications

1. Créer/éditer/supprimer une tâche depuis l'interface et vérifier que les changements se propagent.
2. Tester la recherche globale (titre, patient, assigné, catégorie, priorité, status).
3. Ouvrir "Mes statistiques" et vérifier les chiffres (priorités, statuts, en retard).
4. Tester l'IA : coller des phrases simples (ex: "Faire ECG pour Dupont demain, urgent") et vérifier la création et la recherche.
