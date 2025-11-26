import { pool } from "../db/mysql";
import { StudentRepository, Student } from "../repositories/StudentRepository";

export class MysqlStudentRepository implements StudentRepository {

  async create(student: Student): Promise<Student> {
    const [result]: any = await pool.query(
      "INSERT INTO students (name, age, address) VALUES (?, ?, ?)",
      [student.name, student.age, student.address]
    );

    return {
      id: result.insertId,
      name: student.name,
      age: student.age,
      address: student.address,
    };
  }

  async findAll(): Promise<Student[]> {
    const [rows]: any = await pool.query("SELECT * FROM students ORDER BY id DESC");
    return rows as Student[];
  }

  async findById(id: number): Promise<Student | null> {
    const [rows]: any = await pool.query("SELECT * FROM students WHERE id=?", [id]);
    return rows[0] || null;
  }

  async update(id: number, data: Partial<Student>): Promise<Student> {
    await pool.query(
      "UPDATE students SET name=?, age=?, address=? WHERE id=?",
      [data.name, data.age, data.address, id]
    );

    const [rows]: any = await pool.query("SELECT * FROM students WHERE id=?", [id]);
    return rows[0] as Student;
  }

  async delete(id: number): Promise<void> {
    await pool.query("DELETE FROM students WHERE id=?", [id]);
  }
}
