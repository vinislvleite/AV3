import { Router } from "express";
import { TesteController } from "../controller/testeController";

const router = Router();
const controller = new TesteController();

router.post("/", controller.cadastrar);
router.get("/", controller.listar);

export { router as testeRoutes };