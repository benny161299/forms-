import { axiosClient } from "./axiosClient";
import type { Ischema, SchemaInput } from "../types/schema.types";

export const schemaApi = {
  getAllSchemas: async (): Promise<Ischema[]> => {
    const { data } = await axiosClient.get<Ischema[]>("/schemas");
    return data;
  },

  getDraftSchemas: async (): Promise<Ischema[]> => {
    const { data } = await axiosClient.get<Ischema[]>("/schemas/drafts");
    return data;
  },

  getSchemaById: async (id: string): Promise<Ischema> => {
    const { data } = await axiosClient.get<Ischema>(`/schemas/${id}`);
    return data;
  },

  createSchema: async (schemaData: SchemaInput): Promise<Ischema> => {
    const { data } = await axiosClient.post<Ischema>("/schemas", schemaData);
    return data;
  },

  updateSchema: async (
    id: string,
    schemaData: Partial<SchemaInput>
  ): Promise<Ischema> => {
    const { data } = await axiosClient.put<Ischema>(
      `/schemas/${id}`,
      schemaData
    );
    return data;
  },

  publishSchema: async (id: string): Promise<Ischema> => {
    const { data } = await axiosClient.patch<Ischema>(
      `/schemas/${id}/publish`
    );
    return data;
  },

  deleteSchema: async (id: string): Promise<void> => {
    await axiosClient.delete(`/schemas/${id}`);
  },
};
