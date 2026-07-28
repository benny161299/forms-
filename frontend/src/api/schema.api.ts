import { axiosClient } from "./axiosClient";
import type { Ischema, SchemaInput } from "../types/schema.types";

export const schemaApi = {
  getAllSchemas: async (): Promise<Ischema[]> => {
    const response = await axiosClient.get<Ischema[]>("/schemas");
    return response.data;
  },

  getDraftSchemas: async (): Promise<Ischema[]> => {
    const response = await axiosClient.get<Ischema[]>("/schemas/drafts");
    return response.data;
  },

  getSchemaById: async (id: string): Promise<Ischema> => {
    const response = await axiosClient.get<Ischema>(`/schemas/${id}`);
    return response.data;
  },


  createSchema: async (schemaData: SchemaInput): Promise<Ischema> => {
    const response = await axiosClient.post<Ischema>("/schemas", schemaData);
    return response.data;
  },

  
  updateSchema: async (id: string, schemaData: Partial<SchemaInput>): Promise<Ischema> => {
    const response = await axiosClient.put<Ischema>(`/schemas/${id}`, schemaData);
    return response.data;
  },

 
  publishSchema: async (id: string): Promise<Ischema> => {
    const response = await axiosClient.patch<Ischema>(`/schemas/${id}/publish`);
    return response.data;
  },

  deleteSchema: async (id: string): Promise<void> => {
    await axiosClient.delete(`/schemas/${id}`);
  },
};