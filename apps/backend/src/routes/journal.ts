import { Router } from 'express';
import multer from 'multer';
import { JournalEntry } from '../models/JournalEntry';
import { saveBufferToGridFS, openGridFSReadStream } from '../services/storage';
import { Types } from 'mongoose';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 }
});
const ALLOWED = new Set(['image/jpeg','image/png','image/webp']);

router.get('/api/journal', async (req, res) => {
  const limit = Math.min(parseInt(String(req.query.limit || '20'), 10) || 20, 100);
  const skip = parseInt(String(req.query.skip || '0'), 10) || 0;
  const tag = String(req.query.tag || '') || undefined;
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;

  const q: any = {};
  if (tag) q.tags = tag;
  if (from || to) q.date = { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) };

  const [items, total] = await Promise.all([
    JournalEntry.find(q).sort({ date: -1, _id: -1 }).skip(skip).limit(limit).lean(),
    JournalEntry.countDocuments(q)
  ]);
  res.json({ total, items });
});

router.get('/api/journal/:id', async (req, res) => {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'bad id' });
  const doc = await JournalEntry.findById(id).lean();
  if (!doc) return res.status(404).json({ error: 'not found' });
  res.json(doc);
});

router.post('/api/journal', upload.array('photos', 10), async (req, res) => {
  try {
    const { title, notes, date, tags } = req.body as Record<string,string>;
    if (!title || !date) return res.status(400).json({ error: 'title and date required' });
    const tagList = (tags ? tags.split(',') : []).map(t => t.trim()).filter(Boolean);

    const photos = [] as any[];
    for (const f of (req.files as Express.Multer.File[] || [])) {
      if (!ALLOWED.has(f.mimetype)) return res.status(415).json({ error: `unsupported type ${f.mimetype}` });
      const saved = await saveBufferToGridFS(f.buffer, f.originalname, f.mimetype);
      photos.push({ fileId: saved.fileId, filename: f.originalname, contentType: f.mimetype, size: saved.size });
    }

    const doc = await JournalEntry.create({
      title: String(title),
      notes: String(notes || ''),
      date: new Date(String(date)),
      tags: tagList,
      photos
    });
    res.status(201).json(doc);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'error' });
  }
});

router.put('/api/journal/:id', async (req, res) => {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'bad id' });
  const { title, notes, date, tags } = req.body as any;
  const update: any = {};
  if (title !== undefined) update.title = String(title);
  if (notes !== undefined) update.notes = String(notes);
  if (date !== undefined) update.date = new Date(String(date));
  if (tags !== undefined) update.tags = Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean);
  const doc = await JournalEntry.findByIdAndUpdate(id, update, { new: true });
  if (!doc) return res.status(404).json({ error: 'not found' });
  res.json(doc);
});

router.delete('/api/journal/:id', async (req, res) => {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'bad id' });
  const doc = await JournalEntry.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'not found' });
  // Dateien optional hier aus GridFS lÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¶schen ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ bewusst aufbewahrt, falls mehrere EintrÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤ge referenzieren.
  res.json({ ok: true });
});

router.get('/api/journal/photo/:fileId', async (req, res) => {
  const { fileId } = req.params;
  const stream = openGridFSReadStream(fileId);
  // ContentÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¹Ã…â€œType ermitteln: GridFS speichert contentType in filesÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¹Ã…â€œCollection
  // Fallback auf image/jpeg
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  stream.on('file', (f: any) => {
    if (f && f.contentType) res.setHeader('Content-Type', f.contentType);
  });
  stream.on('error', () => res.status(404).end());
  stream.pipe(res);
});

export default router;