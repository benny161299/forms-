import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createNewSchema,
  fetchAllSchemaDrafts,
  fetchAllSchemas,
  fetchSchemaById,
  removeSchema,
  updateSchemaManager,
} from "./schema.manager.js";

export const createSchema = async (req: Request, res: Response) => {
  const newSchema = await createNewSchema(req.body);
  res.status(StatusCodes.CREATED).json(newSchema);
};

export const getSchemas = async (_req: Request, res: Response) => {
  const schemas = await fetchAllSchemas();
  res.status(StatusCodes.OK).json(schemas);
};

export const getSchemaDrafts = async (_req: Request, res: Response) => {
  const schemas = await fetchAllSchemaDrafts();
  res.status(StatusCodes.OK).json(schemas);
};

export const getSchemaById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const schema = await fetchSchemaById(id);
  res.status(StatusCodes.OK).json(schema);
};

export const updateSchema = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedSchema = await updateSchemaManager(id, req.body);
  res.status(StatusCodes.OK).json(updatedSchema);
};

export const deleteSchema = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const deletedSchema = await removeSchema(id);
  res.status(StatusCodes.OK).json(deletedSchema);
};
