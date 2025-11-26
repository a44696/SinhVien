import { useEffect, useState } from "react";
import type { Student } from "../types/Student";
import { StudentService } from "../usecases/StudentService";

export const useStudent = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const service = new StudentService();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await service.getAll();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const create = async (student: Student) => {
    await service.create(student);
    await fetchAll();
  };

  const update = async (id: number, student: Partial<Student>) => {
    await service.update(id, student);
    await fetchAll();
  };

  const remove = async (id: number) => {
    await service.delete(id);
    await fetchAll();
  };

  useEffect(() => { fetchAll(); }, []);

  return { students, loading, fetchAll, create, update, remove };
};
