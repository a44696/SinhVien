import type { Student } from "../types/Student";

const API_URL = "http://localhost:3000/api/students";

export const fetchStudents = async (): Promise<Student[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

export const createStudentApi = async (student: Student): Promise<Student> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
};

export const updateStudentApi = async (id: number, student: Partial<Student>): Promise<Student> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error("Failed to update student");
  return res.json();
};

export const deleteStudentApi = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete student");
};
