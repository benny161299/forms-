import { instanceApi } from "../api/instance.api";
import { useFetch } from "./useFetch";

export function useSubmittedInstances() {
  const { data, loading, error } = useFetch(
    instanceApi.getAllInstances,
    "errors.fetchSubmittedInstances"
  );

  return { instances: data ?? [], loading, error };
}