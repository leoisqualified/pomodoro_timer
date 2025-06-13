import { Router } from "express";
import { createSession, getSessions } from "../controllers/sessionController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.use(authenticate);
router.post("/", createSession);
router.get("/", getSessions);

export default router;
