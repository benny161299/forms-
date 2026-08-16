import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { instanceApi } from "../api/instance.api";
import { ApiError } from "../api/axiosClient";

export function useDraftInstances() {
  const { t } = useTranslation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["draftInstances"],
    queryFn: instanceApi.getDraftInstances,
  });

  let errorMessage: string | null = null;

  if (error instanceof ApiError) {
    errorMessage = error.message;
  } else if (error) {
    errorMessage = t("errors.fetchDraftInstances");
  }

  return {
    instances: data ?? [],
    loading: isLoading,
    error: errorMessage,
    refetch,
  };
}