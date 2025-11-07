import { Router } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schemas";

const router = Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  const { email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "EMAIL_EXISTS" });
  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  const user = await User.create({ email, passwordHash });
  return res.status(201).json({ id: user._id });
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  const accessToken = jwt.sign({ uid: String(user._id), roles: user.roles }, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ uid: String(user._id), roles: user.roles }, process.env.JWT_SECRET!, { expiresIn: "30d" });
  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 15*60*1000 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 30*24*60*60*1000 });
  return res.json({ ok: true });
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ ok: true });
});

export default router;