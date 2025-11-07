import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';

const router = Router();
const dataDir = path.join(process.cwd(), 'apps', 'backend', 'data', 'ugg');
const buildDir = path.join(dataDir, 'build');
const indexFile = path.join(dataDir, 'UGG-1_index.json');

function loadIndex() {
  if (!fs.existsSync(indexFile)) return [];
  try { return JSON.parse(fs.readFileSync(indexFile, 'utf-8')); } catch { return []; }
}

router.get('/api/ugg/index.json', (_req, res) => {
  const idx = loadIndex();
  res.json(idx);
});

router.get('/api/ugg/html/:slug', (req, res) => {
  const file = path.join(buildDir, `${req.params.slug}.html`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'not found' });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(fs.readFileSync(file, 'utf-8'));
});

router.get('/api/ugg/pdf/:slug', (req, res) => {
  const file = path.join(buildDir, `${req.params.slug}.pdf`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'pdf not available' });
  res.setHeader('Content-Type', 'application/pdf');
  res.send(fs.readFileSync(file));
});

export default router;