export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "in_progress" | "completed" | "cancelled";
export type Role = "doctor" | "nurse" | "specialist";
export type Category = "examination" | "surgery" | "medication" | "consultation" | "follow_up";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  roomNumber: string;
}

export interface AssignedTo {
  id: string;
  name: string;
  role: Role;
}

export interface MedicalTask {
  id: string;
  title: string;
  description: string;
  patient: Patient;
  assignedTo: AssignedTo;
  priority: Priority;
  status: Status;
  category: Category;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}
