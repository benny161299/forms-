import { instanceApi } from "../api/instance.api";
import { useFetch } from "./useFetch";

export function useDraftInstances() {
  const { data, loading, error } = useFetch(
    instanceApi.getDraftInstances,
    "errors.fetchDraftInstances"
  );

  return { instances: data ?? [], loading, error };
}