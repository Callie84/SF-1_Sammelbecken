import mongoose, { Schema, Types } from 'mongoose';

export interface IPhotoRef {
  fileId: Types.ObjectId;
  filename: string;
  contentType: string;
  size: number;
}

export interface IJournalEntry {
  title: string;
  notes?: string;
  date: Date;
  tags: string[];
  photos: IPhotoRef[];
  createdAt: Date;
  updatedAt: Date;
}

const PhotoRefSchema = new Schema<IPhotoRef>({
  fileId: { type: Schema.Types.ObjectId, required: true },
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

const JournalEntrySchema = new Schema<IJournalEntry>({
  title: { type: String, required: true, trim: true },
  notes: { type: String, default: '' },
  date: { type: Date, required: true },
  tags: { type: [String], default: [] },
  photos: { type: [PhotoRefSchema], default: [] }
}, { timestamps: true });

JournalEntrySchema.index({ date: -1 });
JournalEntrySchema.index({ tags: 1, date: -1 });

export const JournalEntry = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);