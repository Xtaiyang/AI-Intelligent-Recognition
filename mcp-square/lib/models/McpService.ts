import mongoose, { Schema, Model } from 'mongoose';
import { IMcpService } from '../../types/McpService';

export interface McpServiceDocument extends Omit<IMcpService, '_id'>, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const McpServiceSchema = new Schema<McpServiceDocument>(
  {
    title: { type: String, required: [true, 'Title is required'] },
    summary: { type: String, required: [true, 'Summary is required'] },
    category: { type: String, required: [true, 'Category is required'] },
    tags: { type: [String], default: [] },
    pricing: { type: String, default: 'Free' },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'draft',
    },
    contactInfo: { type: String, default: '' },
  },
  { timestamps: true }
);

const McpService: Model<McpServiceDocument> =
  mongoose.models.McpService ||
  mongoose.model<McpServiceDocument>('McpService', McpServiceSchema);

export default McpService;
