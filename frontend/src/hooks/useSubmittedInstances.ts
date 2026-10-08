import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { instanceApi } from "../api/instance.api";
export function useSubmittedInstances() {
  const { t } = useTranslation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["submittedInstances"],
    queryFn: instanceApi.getAllInstances,
  });

  const errorMessage = error ? t("errors.fetchSubmittedInstances") : null;

  return {
    instances: data ?? [],
    loading: isLoading,
    error: errorMessage,
    refetch,
  };
}
