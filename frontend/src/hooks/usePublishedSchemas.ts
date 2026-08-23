import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { schemaApi } from "../api/schema.api";
import { ApiError } from "../api/axiosClient";

export function usePublishedSchemas() {
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ["publishedSchemas"],
    queryFn: schemaApi.getAllSchemas,
  });

  let errorMessage: string | null = null;

  if (error) {
    errorMessage = error instanceof ApiError ? error.message : t("errors.fetchPublishedSchemas");
  }

  return {
    schemas: data ?? [],
    loading: isLoading,
    error: errorMessage,
  };
}