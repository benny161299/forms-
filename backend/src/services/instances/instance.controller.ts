import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createNewInstance,
  fetchAllInstances,
  fetchAllInstancesDrafts,
  fetchInstanceById,
  fetchInstancesBySchemaId,
  removeInstance,
  submitInstanceManager,
  updateInstanceManager,
} from "./instance.manager.js";

export const createInstance = async (req: Request, res: Response) => {
  const newInstance = await createNewInstance(req.body);
  res.status(StatusCodes.CREATED).json(newInstance);
};

export const getInstances = async (_req: Request, res: Response) => {
  const instances = await fetchAllInstances();
  res.status(StatusCodes.OK).json(instances);
};

export const getInstancesDrafts = async (_req: Request, res: Response) => {
  const instances = await fetchAllInstancesDrafts();
  res.status(StatusCodes.OK).json(instances);
};

export const getInstancesBySchemaId = async (req: Request, res: Response) => {
  const schemaId = req.params.schemaId as string;
  const instances = await fetchInstancesBySchemaId(schemaId);
  res.status(StatusCodes.OK).json(instances);
};

export const getInstanceById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const instance = await fetchInstanceById(id);
  res.status(StatusCodes.OK).json(instance);
};

export const updateInstance = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedInstance = await updateInstanceManager(id, req.body);
  res.status(StatusCodes.OK).json(updatedInstance);
};

export const submitInstance = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const submittedInstance = await submitInstanceManager(id);
  res.status(StatusCodes.OK).json(submittedInstance);
};

export const deleteInstance = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const deletedInstance = await removeInstance(id);
  res.status(StatusCodes.OK).json(deletedInstance);
};
