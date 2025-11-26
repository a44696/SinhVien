import { Request, Response, NextFunction } from "express";
import { StudentUsecases } from "../usecases/StudentUsecases";

export class StudentController {
  constructor(private usecase: StudentUsecases) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await this.usecase.createStudent(req.body);
      res.json(student);
    } catch (err) {
      next(err);
    }
  };

  getAll = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const students = await this.usecase.getAllStudents();
      res.json(students);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const student = await this.usecase.getStudentById(id);
      res.json(student);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const student = await this.usecase.updateStudent(id, req.body);
      res.json(student);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.usecase.deleteStudent(id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
}
