import express from "express";
import fetch from "node-fetch";
import { consentCheck } from "../middleware/consent";

const router = express.Router();

router.post("/", consentCheck, async (req, res) => {
  try {
    await fetch(process.env.PLAUSIBLE_URL + "/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PLAUSIBLE_SECRET}`,
      },
      body: JSON.stringify(req.body),
    });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "analytics relay failed" });
  }
});

export default router;
