import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Readable } from 'node:stream';

function getBucket() {
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB connection not ready');
  return new GridFSBucket(db, { bucketName: 'uploads' });
}

export async function saveBufferToGridFS(buf: Buffer, filename: string, contentType: string): Promise<{ fileId: ObjectId; size: number }>{
  const bucket = getBucket();
  const stream = new Readable();
  stream.push(buf);
  stream.push(null);
  return new Promise((resolve, reject) => {
    const upload = bucket.openUploadStream(filename, { contentType });
    let bytes = 0;
    stream.on('data', (chunk) => { bytes += (chunk as Buffer).length; });
    stream.pipe(upload)
      .on('error', reject)
      .on('finish', () => resolve({ fileId: upload.id as ObjectId, size: bytes }));
  });
}

export function openGridFSReadStream(fileId: string) {
  const bucket = getBucket();
  return bucket.openDownloadStream(new ObjectId(fileId));
}

export async function deleteGridFSFile(fileId: string) {
  const bucket = getBucket();
  await bucket.delete(new ObjectId(fileId));
}