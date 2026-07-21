import mongoose, { Schema } from "mongoose";
import { config } from "../../config/config.js";
import type { IQuestion, ISection, Ischema } from "./schema.types.js";

const QuestionMongooseSchema = new Schema<IQuestion>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
    },
    required: { type: Boolean, default: false },
    options: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

const SectionMongooseSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [QuestionMongooseSchema],
  },
  { _id: false },
);

const SchemaMongooseSchema = new Schema<Ischema>(
  {
    title: { type: String, required: true },
    isDraft: { type: Boolean, default: true },
    sections: [SectionMongooseSchema],
  },
  {
    timestamps: true,
  },
);

export const SchemaModel = mongoose.model<Ischema>(config.SCHEMA_MODEL_NAME, SchemaMongooseSchema);
