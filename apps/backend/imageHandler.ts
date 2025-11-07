/**
 * SF-1 Bild-Service
 * - Liest Originale aus GridFS oder S3
 * - Skaliert mit sharp
 * - Signierte URLs via HMAC (IMG_SECRET)
 */

import express from "express";
import crypto from "crypto";
import sharp from "sharp";
import { Readable } from "stream";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

// ---- Konfiguration
const IMG_SECRET = process.env.IMG_SECRET || "";
const IMAGE_STORE = (process.env.IMAGE_STORE || "gridfs").toLowerCase(); // gridfs|s3

// Mongo / GridFS
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/sf1";
const MONGO_DB = process.env.MONGO_DB || "sf1";
let gfs: GridFSBucket | null = null;

// S3
const S3_ENDPOINT = process.env.S3_ENDPOINT || "";
const S3_REGION = process.env.S3_REGION || "auto";
const S3_BUCKET = process.env.S3_BUCKET || "";
const s3 = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT || undefined,
  forcePathStyle: !!S3_ENDPOINT,
  credentials: process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY
    ? { accessKeyId: process.env.S3_ACCESS_KEY!, secretAccessKey: process.env.S3_SECRET_KEY! }
    : undefined,
});

// ---- Utils
function sign(params: Record<string, string | number>) {
  if (!IMG_SECRET) return "";
  const base = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join("&");
  return crypto.createHmac("sha256", IMG_SECRET).update(base).digest("hex");
}

function assertSignature(req: express.Request) {
  if (!IMG_SECRET) return; // Signatur optional, wenn Secret nicht gesetzt
  const { id, w = "", h = "", q = "", fmt = "", fit = "" } = req.query as any;
  const given = (req.query.sig as string) || "";
  const want = sign({ id, w, h, q, fmt, fit });
  if (!given || given !== want) {
    const e: any = new Error("bad_signature");
    e.status = 403;
    throw e;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function ensureGridFS() {
  if (gfs) return;
  const cli = await MongoClient.connect(MONGO_URI);
  gfs = new GridFSBucket(cli.db(MONGO_DB), { bucketName: "images" });
}

async function loadOriginal(id: string): Promise<Readable> {
  if (IMAGE_STORE === "s3") {
    // S3: Key = id
    const obj = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: id }));
    // @ts-ignore - Body ist Readable
    return obj.Body as Readable;
  }
  // GridFS
  await ensureGridFS();
  const _id = ObjectId.isValid(id) ? new ObjectId(id) : (() => { throw Object.assign(new Error("bad_id"), { status: 400 }); })();
  return gfs!.openDownloadStream(_id);
}

// ---- Route
router.get("/img/:id", async (req, res) => {
  try {
    // Params
    const id = req.params.id;
    const w = clamp(parseInt(String(req.query.w || "0"), 10) || 0, 0, 3000);
    const h = clamp(parseInt(String(req.query.h || "0"), 10) || 0, 0, 3000);
    const q = clamp(parseInt(String(req.query.q || "80"), 10) || 80, 30, 95);
    const fmt = String(req.query.fmt || "webp").toLowerCase();
    const fit = String(req.query.fit || "cover") as "cover" | "contain";

    if (!["webp", "jpeg", "png"].includes(fmt)) {
      return res.status(400).json({ error: "fmt_invalid" });
    }
    if (!id) return res.status(400).json({ error: "id_missing" });

    assertSignature(req);

    // Quelle laden
    const stream = await loadOriginal(id);

    // Transformation
    let img = sharp();
    const pipe = stream.pipe(img);

    let transformer = sharp();
    if (w || h) {
      transformer = transformer.resize({ width: w || undefined, height: h || undefined, fit });
    }

    if (fmt === "webp") transformer = transformer.webp({ quality: q });
    if (fmt === "jpeg") transformer = transformer.jpeg({ quality: q, mozjpeg: true });
    if (fmt === "png") transformer = transformer.png();

    const out = pipe.pipe(transformer);

    // Caching-Header
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("ETag", `"${id}-${w}x${h}-${q}-${fmt}-${fit}"`);
    res.setHeader("Last-Modified", new Date().toUTCString());
    res.type(fmt);

    out.on("error", (e) => {
      console.error("[SF-1] image error:", e);
      if (!res.headersSent) res.status(500).json({ error: "img_processing_failed" });
    });
    out.pipe(res);
  } catch (e: any) {
    const code = e?.status || 500;
    res.status(code).json({ error: e?.message || "img_failed" });
  }
});

export default router;
