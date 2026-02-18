import express from "express";
import logController from "../controllers/logController.js";

const router = express.Router();

router.get("/logs", logController.getLogs);
router.get("/logs/stats", logController.getStats);

export default router;
