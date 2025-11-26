import { Router } from "express";
import { MysqlStudentRepository } from "../infra/MysqlStudentRepository";
import { StudentUsecases } from "../usecases/StudentUsecases";
import { StudentController } from "../controllers/StudentController";

const repo = new MysqlStudentRepository();
const usecase = new StudentUsecases(repo);
const controller = new StudentController(usecase);

const router = Router();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
