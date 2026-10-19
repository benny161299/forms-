import { axiosClient } from "./axiosClient";
import type {
  CreateInstanceInput,
  IInstance,
  UpdateInstanceInput,
} from "../types/instance.types";

export const instanceApi = {
  getAllInstances: async (): Promise<IInstance[]> => {
    const { data } = await axiosClient.get<IInstance[]>("/instances");
    return data;
  },

  getDraftInstances: async (): Promise<IInstance[]> => {
    const { data } = await axiosClient.get<IInstance[]>("/instances/drafts");
    return data;
  },

  getInstanceById: async (id: string): Promise<IInstance> => {
    const { data } = await axiosClient.get<IInstance>(`/instances/${id}`);
    return data;
  },

  createInstance: async (
    instanceData: CreateInstanceInput
  ): Promise<IInstance> => {
    const { data } = await axiosClient.post<IInstance>(
      "/instances",
      instanceData
    );
    return data;
  },

  updateInstance: async (
    id: string,
    instanceData: UpdateInstanceInput
  ): Promise<IInstance> => {
    const { data } = await axiosClient.put<IInstance>(
      `/instances/${id}`,
      instanceData
    );
    return data;
  },

  submitInstance: async (id: string): Promise<IInstance> => {
    const { data } = await axiosClient.patch<IInstance>(
      `/instances/${id}/submit`
    );
    return data;
  },

  deleteInstance: async (id: string): Promise<void> => {
    await axiosClient.delete(`/instances/${id}`);
  },
};
