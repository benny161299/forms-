import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { instanceApi } from "../api/instance.api";
import { ApiError } from "../api/axiosClient";

export function useSubmittedInstances() {
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ["submittedInstances"],
    queryFn: instanceApi.getAllInstances,
  });

  let errorMessage: string | null = null;

  if (error) {
    errorMessage = error instanceof ApiError ? error.message : t("errors.fetchSubmittedInstances");
  }

  return {
    instances: data ?? [],
    loading: isLoading,
    error: errorMessage,
  };
}