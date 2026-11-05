import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useQuery, type QueryKey, type QueryFunction } from "@tanstack/react-query";
import { isNotFoundError } from "../api/axiosClient";

interface UseEntityPageGateOptions<TData> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData | null>;
  enabled?: boolean;
  notFoundMessageKey: string;
}

export function useEntityPageGate<TData>(
  options: UseEntityPageGateOptions<TData>
) {
  const { queryKey, queryFn, enabled = true, notFoundMessageKey } = options;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isFetchedAfterMount, isPaused, error, refetch } = useQuery<TData | null>({
    queryKey,
    queryFn,
    enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const isNotFound = Boolean(enabled && error && isNotFoundError(error));
  const isOtherError = Boolean(enabled && error && !isNotFoundError(error));
  const isLoading = Boolean(enabled && !error && !isPaused && !isFetchedAfterMount);

  useEffect(() => {
    if (isNotFound) {
      toast.error(t(notFoundMessageKey));
      navigate("/", { replace: true });
    }
  }, [isNotFound, notFoundMessageKey, navigate, t]);

  return {
    data,
    isLoading,
    isNotFound,
    isOtherError,
    error,
    refetch,
  };
}
