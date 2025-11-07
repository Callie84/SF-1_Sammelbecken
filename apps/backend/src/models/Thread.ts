import mongoose, { Schema, Document } from 'mongoose';

export interface IThread extends Document {
  userId: string;
  
  // Content
  title: string;
  content: string;
  
  // Category
  category: 'general' | 'beginner' | 'advanced' | 'problems' | 'strains' | 'harvest' | 'equipment';
  
  // Tags
  tags: string[];
  
  // Social
  viewCount: number;
  postCount: number;
  upvoteCount: number;
  downvoteCount: number;
  
  // Status
  isPinned: boolean;
  isLocked: boolean;
  isDeleted: boolean;
  
  // Moderation
  deletedAt?: Date;
  deletedBy?: string;
  deletedReason?: string;
  
  // Timestamps
  lastPostAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ThreadSchema = new Schema<IThread>({
  userId: { type: String, required: true, index: true },
  
  title: { 
    type: String, 
    required: true,
    minlength: 5,
    maxlength: 200,
    trim: true
  },
  
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10000
  },
  
  category: {
    type: String,
    enum: ['general', 'beginner', 'advanced', 'problems', 'strains', 'harvest', 'equipment'],
    required: true,
    index: true
  },
  
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: (v: string[]) => v.length <= 5,
      message: 'Max 5 tags allowed'
    }
  },
  
  viewCount: { type: Number, default: 0 },
  postCount: { type: Number, default: 0 },
  upvoteCount: { type: Number, default: 0 },
  downvoteCount: { type: Number, default: 0 },
  
  isPinned: { type: Boolean, default: false, index: true },
  isLocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false, index: true },
  
  deletedAt: Date,
  deletedBy: String,
  deletedReason: String,
  
  lastPostAt: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

// Indexes
ThreadSchema.index({ category: 1, isPinned: -1, lastPostAt: -1 });
ThreadSchema.index({ userId: 1, createdAt: -1 });
ThreadSchema.index({ upvoteCount: -1 });
ThreadSchema.index({ title: 'text', content: 'text', tags: 'text' });
ThreadSchema.index({ isDeleted: 1, category: 1, lastPostAt: -1 });

// Virtuals
ThreadSchema.virtual('netVotes').get(function() {
  return this.upvoteCount - this.downvoteCount;
});

export const Thread = mongoose.model<IThread>('Thread', ThreadSchema);
