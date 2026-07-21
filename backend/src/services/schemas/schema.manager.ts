import { StatusCodes } from "http-status-codes";
import { AppError } from "../../middlewares/error.middleware.js";
import { SchemaModel } from "./Schema.model.js";
import type { SchemaInput  } from "./schema.types.js";

export const createNewSchema = async (schemaData: SchemaInput) => {
  const { title, sections } = schemaData;

  return SchemaModel.create({
    title,
    sections,
    isDraft: true,
  });
};

export const fetchAllSchemas = async () => {
  return SchemaModel.find({ isDraft: false }).lean();
};

export const fetchAllSchemaDrafts = async () => {
  return SchemaModel.find({ isDraft: true }).lean();
};
export const fetchSchemaById = async (id: string) => {
  return SchemaModel.findById(id)
    .lean()
    .orFail(() => new AppError("Schema not found", StatusCodes.NOT_FOUND));
};

export const updateSchemaManager = async (id: string, updateData: SchemaInput) => {
  const { title, sections } = updateData;

  return SchemaModel.findOneAndUpdate(
    { _id: id, isDraft: true },
    { title, sections },
    { returnDocument: "after" },
  ).orFail(() => new AppError("Schema not found, or it is not a draft", StatusCodes.NOT_FOUND));
};

export const publishSchemaManager = async (id: string) => {
  return SchemaModel.findOneAndUpdate(
    { _id: id, isDraft: true },
    { isDraft: false },
    { returnDocument: "after" },
  ).orFail(() => new AppError("Schema not found, or it is not a draft", StatusCodes.NOT_FOUND));
};

export const removeSchema = async (id: string) => {
  return SchemaModel.findByIdAndDelete(id)
    .lean()
    .orFail(() => new AppError("Schema not found", StatusCodes.NOT_FOUND));
};
