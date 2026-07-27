import mongoose, { Schema } from "mongoose";
import { config } from "../../config/config.js";
import type { IInstance } from "./instance.types.js";

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
      default: true,
    },

    answers: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

export const InstanceModel = mongoose.model<IInstance>(
  config.INSTANCE_MODEL_NAME,
  InstanceMongooseSchema,
);
