import { schemaApi } from "../api/schema.api";
import { useFetch } from "./useFetch";

export function useDraftSchemas() {
  const { data, loading, error } = useFetch(
    schemaApi.getDraftSchemas,
    "errors.fetchDraftSchemas"
  );

  return { schemas: data ?? [], loading, error };
}