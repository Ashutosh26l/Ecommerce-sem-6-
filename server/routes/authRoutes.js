import express from "express";
import {
  login,
  logout,
  register,
  renderLoginPage,
  renderRegisterPage,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/register", renderRegisterPage);
router.get("/login", renderLoginPage);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
