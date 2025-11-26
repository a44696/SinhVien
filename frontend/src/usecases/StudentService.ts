import type { Student } from "../types/Student";
import * as studentApi from "../api/sinhvienApi";

export class StudentService {
  async getAll(): Promise<Student[]> {
    return studentApi.fetchStudents();
  }

  async create(student: Student): Promise<Student> {
    return studentApi.createStudentApi(student);
  }

  async update(id: number, student: Partial<Student>): Promise<Student> {
    return studentApi.updateStudentApi(id, student);
  }

  async delete(id: number): Promise<void> {
    return studentApi.deleteStudentApi(id);
  }
}
