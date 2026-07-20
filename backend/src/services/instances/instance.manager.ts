import { StatusCodes } from "http-status-codes";
import { AppError } from "../../middlewares/error.middleware.js";
import { SchemaModel } from "../schemas/Schema.model.js";
import { InstanceModel } from "./Instance.model.js";
import type { IInstance } from "./instance.types.js";

export const createNewInstance = async (instanceData: IInstance) => {
  const { schemaId } = instanceData;

  await SchemaModel.findOne({ _id: schemaId, isDraft: false })
    .lean()
    .orFail(() => new AppError("Schema not found or is still a draft", StatusCodes.NOT_FOUND));

  return InstanceModel.create(instanceData);
};

export const fetchAllInstances = async () => {
  return InstanceModel.find({ isDraft: false }).lean();
};

export const fetchAllInstancesDrafts = async () => {
  return InstanceModel.find({ isDraft: true }).lean();
};

export const fetchInstancesBySchemaId = async (schemaId: string) => {
  await SchemaModel.findById(schemaId)
    .lean()
    .orFail(() => new AppError("The requested schema does not exist", StatusCodes.NOT_FOUND));

  return InstanceModel.find({ schemaId }).lean();
};

export const fetchInstanceById = async (id: string) => {
  return InstanceModel.findById(id)
    .lean()
    .orFail(() => new AppError("Instance not found", StatusCodes.NOT_FOUND));
};

export const updateInstanceManager = async (id: string, updateData: IInstance) => {
  return InstanceModel.findOneAndUpdate({ _id: id, isDraft: true }, updateData, {
    returnDocument: "after",
  })
    .lean()
    .orFail(() => new AppError("Instance not found, or it is not a draft", StatusCodes.NOT_FOUND));
};

export const removeInstance = async (id: string): Promise<IInstance> => {
  return InstanceModel.findByIdAndDelete(id)
    .lean()
    .orFail(() => new AppError("Instance not found", StatusCodes.NOT_FOUND));
};
