import { useQuery } from "@tanstack/react-query";
import { schemaApi } from "../../../api/schema.api";

export function useSchemaById(id?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["schema", id],
    queryFn: () => (id ? schemaApi.getSchemaById(id) : null),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    schema: data,
    isLoading,
    error,
  };
}