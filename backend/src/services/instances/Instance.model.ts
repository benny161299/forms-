import mongoose, { Schema } from 'mongoose';
import { IInstance } from './instance.types.js';

const InstanceMongooseSchema = new Schema<IInstance>({
 
  schemaId: {
    type: String,
    required: true
  },

  isDraft: {
    type: Boolean,
    required: true
  },

  answers: {
    type: Schema.Types.Mixed,
    required: true
  }

}, {
  timestamps: true
});

export const InstanceModel = mongoose.model<IInstance>('Instance', InstanceMongooseSchema);