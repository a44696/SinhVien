import { StudentRepository, Student } from "../repositories/StudentRepository";

export class StudentUsecases {
  constructor(private repo: StudentRepository) {}

  async createStudent(data: Student): Promise<Student> {
    return this.repo.create(data);
  }

  async getAllStudents(): Promise<Student[]> {
    return this.repo.findAll();
  }

  async getStudentById(id: number): Promise<Student | null> {
    return this.repo.findById(id);
  }

  async updateStudent(id: number, data: Partial<Student>): Promise<Student> {
    return this.repo.update(id, data);
  }

  async deleteStudent(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
