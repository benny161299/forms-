import { axiosClient } from "./axiosClient";
import type {
  CreateInstanceInput,
  IInstance,
  UpdateInstanceInput,
} from "../types/instance.types";

export const instanceApi = {
  getAllInstances: async (): Promise<IInstance[]> => {
    const response = await axiosClient.get<IInstance[]>("/instances");
    return response.data;
  },

  getDraftInstances: async (): Promise<IInstance[]> => {
    const response = await axiosClient.get<IInstance[]>("/instances/drafts");
    return response.data;
  },

  getInstancesBySchemaId: async (schemaId: string): Promise<IInstance[]> => {
    const response = await axiosClient.get<IInstance[]>(
      `/instances/schema/${schemaId}`
    );
    return response.data;
  },

  getInstanceById: async (id: string): Promise<IInstance> => {
    const response = await axiosClient.get<IInstance>(`/instances/${id}`);
    return response.data;
  },

  createInstance: async (
    instanceData: CreateInstanceInput
  ): Promise<IInstance> => {
    const response = await axiosClient.post<IInstance>(
      "/instances",
      instanceData
    );
    return response.data;
  },

  updateInstance: async (
    id: string,
    instanceData: UpdateInstanceInput
  ): Promise<IInstance> => {
    const response = await axiosClient.put<IInstance>(
      `/instances/${id}`,
      instanceData
    );
    return response.data;
  },

  submitInstance: async (id: string): Promise<IInstance> => {
    const response = await axiosClient.patch<IInstance>(
      `/instances/${id}/submit`
    );
    return response.data;
  },

  deleteInstance: async (id: string): Promise<void> => {
    await axiosClient.delete(`/instances/${id}`);
  },
};