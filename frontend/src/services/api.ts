import type { MedicalTask } from "../types/medical-task";

const API_BASE_URL = "http://localhost:3000/api";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  tasksPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse {
  tasks: MedicalTask[];
  pagination: PaginationInfo;
}

export const api = {
  getTasks: async (page: number = 1, limit: number = 150): Promise<PaginatedResponse> => {
    const response = await fetch(`${API_BASE_URL}/tasks?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des tâches");
    return response.json();
  },

  getTask: async (id: string): Promise<MedicalTask> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) throw new Error("Tâche non trouvée");
    return response.json();
  },

  createTask: async (task: Omit<MedicalTask, "id" | "createdAt" | "updatedAt">): Promise<MedicalTask> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Erreur lors de la création de la tâche");
    return response.json();
  },

  updateTask: async (id: string, task: Partial<MedicalTask>): Promise<MedicalTask> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour de la tâche");
    return response.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression de la tâche");
  },
};
