import { SchemaModel } from './Schema.model.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { StatusCodes } from 'http-status-codes';
import { Ischema } from './schema.types.js'; 

export const createNewSchema = async (schemaData: Ischema) => {
  return await SchemaModel.create(schemaData);
};

export const fetchAllSchemas = async () => {
  return await SchemaModel.find({ isDraft: false });
};

export const fetchAllSchemaDrafts = async () => {
  return await SchemaModel.find({ isDraft: true });
};
export const fetchSchemaById = async (id: string) => {
  const schema = await SchemaModel.findById(id);
  if (!schema) {
    throw new AppError('Schema not found', StatusCodes.NOT_FOUND);
  }
  return schema;
};

export const updateSchemaManager = async (id: string, updateData: Ischema) => {
  const updatedSchema = await SchemaModel.findOneAndUpdate(
    { _id: id, isDraft: true },
    updateData
  );

  if (!updatedSchema) {
    throw new AppError('Schema not found, or it is not a draft', StatusCodes.NOT_FOUND);
  }

  return updatedSchema;
};

export const removeSchema = async (id: string) => {
  const deletedSchema = await SchemaModel.findByIdAndDelete(id);
  if (!deletedSchema) {
    throw new AppError('Schema not found', StatusCodes.NOT_FOUND);
  }
};