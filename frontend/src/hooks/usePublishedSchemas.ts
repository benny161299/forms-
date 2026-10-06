import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { schemaApi } from "../api/schema.api";
export function usePublishedSchemas() {
  const { t } = useTranslation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publishedSchemas"],
    queryFn: schemaApi.getAllSchemas,
  });

  const errorMessage = error ? t("errors.fetchPublishedSchemas") : null;

  return {
    schemas: data ?? [],
    loading: isLoading,
    error: errorMessage,
    refetch,
  };
}