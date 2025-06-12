import { Router } from "express";
import {
  register,
  login,
  getProfile,
  logout,
  refreshAccessToken,
} from "../controllers/authController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.post("/refresh", refreshAccessToken);
router.get("/logout", logout);

export default router;
