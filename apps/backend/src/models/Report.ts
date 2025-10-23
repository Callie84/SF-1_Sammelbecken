import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId: string;
  targetId: string; // Thread oder Post ID
  targetType: 'thread' | 'post';
  
  // Grund
  reason: 'spam' | 'harassment' | 'misinformation' | 'nsfw' | 'illegal' | 'other';
  details?: string;
  
  // Status
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  
  // Moderation
  reviewedBy?: string;
  reviewedAt?: Date;
  resolution?: string;
  actionTaken?: 'none' | 'warning' | 'delete' | 'ban_user';
  
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  reporterId: {
    type: String,
    required: true,
    index: true
  },
  
  targetId: {
    type: String,
    required: true,
    index: true
  },
  
  targetType: {
    type: String,
    enum: ['thread', 'post'],
    required: true
  },
  
  reason: {
    type: String,
    enum: ['spam', 'harassment', 'misinformation', 'nsfw', 'illegal', 'other'],
    required: true
  },
  
  details: {
    type: String,
    maxlength: 500
  },
  
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending',
    index: true
  },
  
  reviewedBy: String,
  reviewedAt: Date,
  resolution: String,
  actionTaken: {
    type: String,
    enum: ['none', 'warning', 'delete', 'ban_user']
  }
}, {
  timestamps: true
});

// Indexes
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ targetId: 1, targetType: 1 });
ReportSchema.index({ reviewedBy: 1, status: 1 });

export const Report = mongoose.model<IReport>('Report', ReportSchema);
