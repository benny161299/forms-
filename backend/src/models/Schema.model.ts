import mongoose, { Schema } from 'mongoose';
import { Ischema, ISection, IQuestion } from '../types/schema.types.js';

const QuestionMongooseSchema = new Schema<IQuestion>({
  id: { type: String, required: true },    
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true 
  },
  required: { type: Boolean, required: true },
  options: { type: Schema.Types.Mixed }       
}, { _id: false });