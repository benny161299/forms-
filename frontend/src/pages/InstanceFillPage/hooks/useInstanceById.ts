import { useQuery } from "@tanstack/react-query";
import { instanceApi } from "../../../api/instance.api";

export function useInstanceById(id?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["instance", id],
    queryFn: () => instanceApi.getInstanceById(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    instance: data,
    isLoading,
    error,
  };
}