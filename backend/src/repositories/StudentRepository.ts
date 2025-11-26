export interface Student {
  id?: number;
  name: string;
  age: number;
  address: string;
}

export interface StudentRepository {
  create(student: Student): Promise<Student>;
  findAll(): Promise<Student[]>;
  findById(id: number): Promise<Student | null>;
  update(id: number, data: Partial<Student>): Promise<Student>;
  delete(id: number): Promise<void>;
}
