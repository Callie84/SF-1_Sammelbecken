import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  userId: string;
  targetId: string; // Thread oder Post ID
  targetType: 'thread' | 'post';
  voteType: 'up' | 'down';
  createdAt: Date;
}

const VoteSchema = new Schema<IVote>({
  userId: {
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
  
  voteType: {
    type: String,
    enum: ['up', 'down'],
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Composite Index: Ein User kann nur 1x pro Target voten
VoteSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

// Index fÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¼r Vote-Counting
VoteSchema.index({ targetId: 1, targetType: 1, voteType: 1 });

export const Vote = mongoose.model<IVote>('Vote', VoteSchema);
