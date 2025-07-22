import * as gastoController from "../controllers/gastoController.js";
import express from "express";

const router = express.Router();

router.post("/", gastoController.crearGasto);
router.get("/", gastoController.listarGastos);
router.get("/resumen", gastoController.resumenGastos);
router.put("/:id", gastoController.actualizarGasto);

export default router;
