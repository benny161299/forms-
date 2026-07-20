import mongoose, { Schema } from "mongoose";
import type { IInstance } from "./instance.types.js";
import { config } from "../../config/config.js";
const InstanceMongooseSchema = new Schema<IInstance>(
  {
    schemaId: {
      type: String,
      required: true,
      ref: config.SCHEMA_MODEL_NAME,
    },

    isDraft: {
      type: Boolean,
      required: true,
    },

    answers: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const InstanceModel = mongoose.model<IInstance>(config.INSTANCE_MODEL_NAME, InstanceMongooseSchema);
