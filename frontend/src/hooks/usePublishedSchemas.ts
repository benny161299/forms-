import { schemaApi } from "../api/schema.api";
import { useFetch } from "./useFetch";

export function usePublishedSchemas() {
  const { data, loading, error } = useFetch(
    schemaApi.getAllSchemas,
    "errors.fetchPublishedSchemas"
  );

  return { schemas: data ?? [], loading, error };
}