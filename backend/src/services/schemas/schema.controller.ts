import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  createNewSchema,
  fetchAllSchemas,
  fetchAllSchemaDrafts,
  fetchSchemaById,
  updateSchemaManager,
  removeSchema
} from './schemas.manager.js';

export const createSchema = async (req: Request, res: Response) => {
  const newSchema = await createNewSchema(req.body);
  return res.status(StatusCodes.CREATED).json(newSchema);
};

export const getSchemas = async (req: Request, res: Response) => {
  const schemas = await fetchAllSchemas();
  return res.status(StatusCodes.OK).json(schemas);
};

export const getSchemaDrafts = async (req: Request, res: Response) => {
  const schemas = await fetchAllSchemaDrafts();
  return res.status(StatusCodes.OK).json(schemas);
};

export const getSchemaById = async (req: Request, res: Response) => {
  const id = req.params.id as string; 
  const schema = await fetchSchemaById(id);
  return res.status(StatusCodes.OK).json(schema);
};

export const updateSchema = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedSchema = await updateSchemaManager(id, req.body);
  return res.status(StatusCodes.OK).json(updatedSchema);
};

export const deleteSchema = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await removeSchema(id);
  return res.status(StatusCodes.OK).json({ message: 'Schema deleted'});
};