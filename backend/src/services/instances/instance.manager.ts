import { InstanceModel } from './Instance.model.js';
import { SchemaModel } from '../schemas/Schema.model.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { StatusCodes } from 'http-status-codes';
import { IInstance } from './instance.types.js'; 

export const createNewInstance = async (instanceData: IInstance) => {
  const { schemaId } = instanceData;

  const targetSchema = await SchemaModel.findById(schemaId);
  if (!targetSchema) {
    throw new AppError('schema not exist', StatusCodes.NOT_FOUND);
  }
  if (targetSchema.isDraft) {
    throw new AppError('schema is still a draft', StatusCodes.BAD_REQUEST);
  }

  return await InstanceModel.create(instanceData);
};

export const fetchAllInstances = async () => {
  return await InstanceModel.find({ isDraft: false });
};

export const fetchAllInstancesDrafts = async () => {
  return await InstanceModel.find({ isDraft: true });
};

export const fetchInstancesBySchemaId = async (schemaId: string) => {
    const instance = await InstanceModel.find({ schemaId })
    if(!instance){
        throw new AppError('instances not found', StatusCodes.NOT_FOUND)
    }
  return instance;
};

export const fetchInstanceById = async (id: string) => {
  const instance = await InstanceModel.findById(id);
  if (!instance) {
    throw new AppError('Instance not found', StatusCodes.NOT_FOUND);
  }
  return instance;
};

export const updateInstanceManager = async (id: string, updateData: IInstance) => {
  const updatedInstance = await InstanceModel.findOneAndUpdate(
    { _id: id, isDraft: true },
    updateData
  );

  if (!updatedInstance) {
    throw new AppError('Instance not found, or it is not a draft', StatusCodes.NOT_FOUND);
  }

  return updatedInstance;
};

export const removeInstance = async (id: string) => {
  const deletedInstance = await InstanceModel.findByIdAndDelete(id).lean();
  if (!deletedInstance) {
    throw new AppError('Instance not found', StatusCodes.NOT_FOUND);
  }
};