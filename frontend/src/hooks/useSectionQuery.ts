import type { QueryKey } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface UseSectionQueryOptions<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T[]>;
  errorKey?: string;
  errorMessage?: string;
}

export function useSectionQuery<T>({
  queryKey,
  queryFn,
  errorKey,
  errorMessage: customErrorMessage,
}: UseSectionQueryOptions<T>) {
  const { t } = useTranslation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn,
  });

  const errorMessage = error
    ? (customErrorMessage ?? (errorKey ? t(errorKey) : null))
    : null;

  return {
    items: data ?? [],
    loading: isLoading,
    error: errorMessage,
    isError: Boolean(error),
    hasData: data !== undefined,
    refetch,
  };
}
