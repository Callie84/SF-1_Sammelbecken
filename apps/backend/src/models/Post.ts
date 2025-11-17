import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  threadId: string;
  userId: string;
  parentId?: string; // FÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¼r Replies
  
  // Content
  content: string;
  
  // Social
  upvoteCount: number;
  downvoteCount: number;
  
  // Moderation
  isDeleted: boolean;
  isEdited: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  deletedReason?: string;
  editedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  threadId: { 
    type: String, 
    required: true, 
    index: true 
  },
  
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  
  parentId: {
    type: String,
    index: true
  },
  
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 5000
  },
  
  upvoteCount: { type: Number, default: 0 },
  downvoteCount: { type: Number, default: 0 },
  
  isDeleted: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: String,
  deletedReason: String,
  editedAt: Date
}, {
  timestamps: true
});

// Indexes
PostSchema.index({ threadId: 1, createdAt: 1 });
PostSchema.index({ threadId: 1, parentId: 1, createdAt: 1 });
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ upvoteCount: -1 });

// Virtuals
PostSchema.virtual('netVotes').get(function() {
  return this.upvoteCount - this.downvoteCount;
});

// Virtuals fÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¼r Replies
PostSchema.virtual('replies', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'parentId'
});

export const Post = mongoose.model<IPost>('Post', PostSchema);
