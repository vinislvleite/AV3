import { Router } from "express";
import { PecaController } from "../controller/pecaController";

const router = Router();
const controller = new PecaController();

router.post("/", controller.cadastrar);
router.get("/", controller.listar);
router.patch("/:id/status", controller.atualizarStatus);

export { router as pecaRoutes };