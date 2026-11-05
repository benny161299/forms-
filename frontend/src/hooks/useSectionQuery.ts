import type { QueryKey } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

interface UseSectionQueryOptions<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T[]>;
  errorMessage?: string;
}

export function useSectionQuery<T>({
  queryKey,
  queryFn,
  errorMessage,
}: UseSectionQueryOptions<T>) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn,
  });

  return {
    items: data ?? [],
    loading: isLoading,
    error: error ? errorMessage ?? null : null,
    isError: Boolean(error),
    hasData: data !== undefined,
    refetch,
  };
}
