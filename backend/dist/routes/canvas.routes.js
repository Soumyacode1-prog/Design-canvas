import { Router } from "express";
import { createCanvas, deleteCanvas, getCanvas, getCanvases, updateCanvas, } from "../controllers/canvas.controller.js";
const router = Router();
router.post("/", createCanvas);
router.get("/", getCanvases);
router.get("/:id", getCanvas);
router.put("/:id", updateCanvas);
router.delete("/:id", deleteCanvas);
export default router;
//# sourceMappingURL=canvas.routes.js.map