import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { schemaApi } from "../api/schema.api";
import { ApiError } from "../api/axiosClient";

export function useDraftSchemas() {
  const { t } = useTranslation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["draftSchemas"],
    queryFn: schemaApi.getDraftSchemas,
  });

  let errorMessage: string | null = null;

  if (error instanceof ApiError) {
    errorMessage = error.message;
  } else if (error) {
    errorMessage = t("errors.fetchDraftSchemas");
  }

  return {
    schemas: data ?? [],
    loading: isLoading,
    error: errorMessage,
    refetch,
  };
}