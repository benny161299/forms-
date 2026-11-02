import { useQuery } from "@tanstack/react-query";
import { schemaApi } from "../../../api/schema.api";

export function useSchemaById(id?: string) {
  const { data, isPending, isFetchedAfterMount, isPaused, error, isError, refetch } = useQuery({
    queryKey: ["schema", id],
    queryFn: () => (id ? schemaApi.getSchemaById(id) : null),
    enabled: Boolean(id),
  });

  return {
    schema: data,
    isPending,
    isFetchedAfterMount,
    isPaused,
    error,
    isError,
    refetch,
  };
}
