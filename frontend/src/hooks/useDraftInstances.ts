import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { instanceApi } from "../api/instance.api";
export function useDraftInstances() {
  const { t } = useTranslation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["draftInstances"],
    queryFn: instanceApi.getDraftInstances,
  });

  const errorMessage = error ? t("errors.fetchDraftInstances") : null;

  return {
    instances: data ?? [],
    loading: isLoading,
    error: errorMessage,
    refetch,
  };
}