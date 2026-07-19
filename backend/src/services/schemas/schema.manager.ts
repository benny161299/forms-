import { StatusCodes } from "http-status-codes";
import { AppError } from "../../middlewares/error.middleware.js";
import { SchemaModel } from "./Schema.model.js";
import type { Ischema } from "./schema.types.js";

export const createNewSchema = async (schemaData: Ischema) => {
  return SchemaModel.create(schemaData);
};

export const fetchAllSchemas = async () => {
  return SchemaModel.find({ isDraft: false });
};

export const fetchAllSchemaDrafts = async () => {
  return SchemaModel.find({ isDraft: true });
};
export const fetchSchemaById = async (id: string) => {
  return SchemaModel.findById(id).orFail(
    () => new AppError("Schema not found", StatusCodes.NOT_FOUND),
  );
};

export const updateSchemaManager = async (id: string, updateData: Ischema) => {
  return SchemaModel.findOneAndUpdate({ _id: id, isDraft: true }, updateData,
    { returnDocument: 'after'}).orFail(
    () => new AppError("Schema not found, or it is not a draft", StatusCodes.NOT_FOUND),
  );
};

export const removeSchema = async (id: string) => {
  return SchemaModel.findByIdAndDelete(id).orFail(
    () => new AppError("Schema not found", StatusCodes.NOT_FOUND),
  );
};
