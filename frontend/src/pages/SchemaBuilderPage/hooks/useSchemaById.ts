import { useQuery } from "@tanstack/react-query";
import { schemaApi } from "../../../api/schema.api";

export function useSchemaById(id?: string) {
  const { data, isPending, isLoading, isFetchedAfterMount, isPaused, error, isError } = useQuery({
    queryKey: ["schema", id],
    queryFn: () => (id ? schemaApi.getSchemaById(id) : null),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
  });

  return {
    schema: data,
    isLoading,
    isPending,
    isFetchedAfterMount,
    isPaused,
    error,
    isError,
  };
}
